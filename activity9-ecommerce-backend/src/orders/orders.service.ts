import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private productsService: ProductsService,
  ) {}

  /**
   * Validate order - check stock availability before placing order
   */
  async validateOrder(items: Array<{ name: string; price: number; qty: number }>) {
    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const validationErrors: string[] = [];

    for (const item of items) {
      // Get product from database
      const product = await this.productsService.findByName(item.name);
      
      if (!product) {
        validationErrors.push(`Product "${item.name}" not found`);
        continue;
      }

      const availableStock = product.stock || 0;
      if (availableStock <= 0) {
        validationErrors.push(`Product "${item.name}" is out of stock`);
      } else if (item.qty > availableStock) {
        validationErrors.push(
          `Insufficient stock for "${item.name}". Requested: ${item.qty}, Available: ${availableStock}`
        );
      }

      // Validate price matches - ALWAYS use backend price
      const backendPrice = parseFloat(product.price?.toString());
      if (Math.abs(backendPrice - item.price) > 0.01) {
        validationErrors.push(
          `Price mismatch for "${item.name}". Current price: ₱${backendPrice}`
        );
      }
    }

    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Order validation failed',
        errors: validationErrors,
      });
    }

    return true;
  }

  /**
   * Create order - validate stock and reduce quantities
   * Recalculates total using backend prices to prevent price manipulation
   */
  async createOrder(
    user: User,
    items: Array<{ name: string; price: number; qty: number }>,
    shippingInfo: any,
    total: number,
    paymentMethod: string,
  ) {
    // Validate order
    await this.validateOrder(items);

    // Recalculate total using backend prices (security measure)
    let calculatedTotal = 0;
    const validatedItems: Array<{ name: string; price: number; qty: number }> = [];
    
    for (const item of items) {
      const product = await this.productsService.findByName(item.name);
      if (product) {
        const backendPrice = parseFloat(product.price?.toString());
        calculatedTotal += backendPrice * item.qty;
        validatedItems.push({
          name: item.name,
          price: backendPrice, // Use backend price, not client price
          qty: item.qty
        });
      }
    }

    // Check if submitted total matches calculated total
    if (Math.abs(calculatedTotal - total) > 0.01) {
      throw new BadRequestException(
        `Total amount mismatch. Expected: ₱${calculatedTotal.toFixed(2)}, Received: ₱${total.toFixed(2)}`
      );
    }

    // Prepare orderId (will update after save to include first product id)
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    let orderId = `${dateStr}-${randomNum}`;
    let firstProductId: number = 0;

    // Use transaction to ensure atomicity and row locking
    return await this.productsRepository.manager.transaction(async (transactionalEntityManager) => {
      // Reduce stock for each item with row locking
      for (const item of validatedItems) {
        // Lock the product row for update
        const product = await transactionalEntityManager
          .createQueryBuilder(Product, 'product')
          .setLock('pessimistic_write')
          .where('product.name = :name', { name: item.name })
          .getOne();

        if (!product) {
          throw new BadRequestException(`Product "${item.name}" not found`);
        }

        // Capture first product ID
        if (firstProductId === 0) {
          firstProductId = product.id;
        }

        const newStock = Math.max(0, (product.stock || 0) - item.qty);
        // Double-check stock availability (race condition protection)
        if (product.stock < item.qty) {
          throw new BadRequestException(
            `Insufficient stock for "${item.name}". Available: ${product.stock}, Requested: ${item.qty}`
          );
        }
        // Update stock within transaction
        await transactionalEntityManager.update(Product, { id: product.id }, { stock: newStock });
      }

      // Create and save order with temporary orderId
      const order = this.ordersRepository.create({
        orderId,
        user,
        items: validatedItems,
        shippingInfo,
        total: calculatedTotal,
        paymentMethod,
        status: 'Pending Payment',
      });

      const savedOrder = await transactionalEntityManager.save(order);

      // Update orderId to include first product id
      orderId = `${dateStr}-${randomNum}-${firstProductId}`;
      await transactionalEntityManager.update(Order, { id: savedOrder.id }, { orderId });

      return {
        id: savedOrder.id,
        orderId,
        status: savedOrder.status,
        total: savedOrder.total,
        createdAt: savedOrder.createdAt,
      };
    });
  }

  /**
   * Get user's orders
   */
  async getUserOrders(userId: number) {
    return await this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: number, userId: number, isAdmin: boolean = false) {
    const whereCondition: any = { id };
    
    // Only filter by userId if not admin
    if (!isAdmin) {
      whereCondition.user = { id: userId };
    }
    
    const order = await this.ordersRepository.findOne({
      where: whereCondition,
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: number, status: string, userId: number, isAdmin: boolean = false) {
    const order = await this.getOrderById(id, userId, isAdmin);
    order.status = status;
    return await this.ordersRepository.save(order);
  }

  /**
   * Cancel order and restore stock
   */
  async cancelOrder(id: number, userId: number, isAdmin: boolean = false) {
    const order = await this.getOrderById(id, userId, isAdmin);

    if (order.status === 'Cancelled') {
      throw new BadRequestException('Order is already cancelled');
    }

    // Restore stock
    for (const item of order.items) {
      const product = await this.productsService.findByName(item.name);
      if (product) {
        const newQuantity = (product.stock || 0) + item.qty;
        await this.productsService.updateQuantity(product.id, newQuantity);
      }
    }

    order.status = 'Cancelled';
    return await this.ordersRepository.save(order);
  }
}
