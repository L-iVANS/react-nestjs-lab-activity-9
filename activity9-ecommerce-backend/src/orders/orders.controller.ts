import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../utils/enums/user-role.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Validate order before checkout
   * POST /orders/validate
   */
  @Post('validate')
  async validateOrder(
    @Body()
    body: {
      items: Array<{ name: string; price: number; qty: number }>;
    },
  ) {
    try {
      await this.ordersService.validateOrder(body.items);
      return { valid: true };
    } catch (error) {
      if (error instanceof BadRequestException) {
        return { valid: false, errors: error.getResponse() };
      }
      throw error;
    }
  }

  /**
   * Create new order
   * POST /orders
   * Requires authentication
   */
  @UseGuards(JwtGuard)
  @Post()
  async createOrder(
    @Request() req,
    @Body()
    body: {
      items: Array<{ name: string; price: number; qty: number }>;
      shippingInfo: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
      };
      total: number;
      paymentMethod: string;
    },
  ) {
    const user = req.user;
    return await this.ordersService.createOrder(
      user,
      body.items,
      body.shippingInfo,
      body.total,
      body.paymentMethod,
    );
  }

  /**
   * Get user's orders
   * GET /orders
   * Requires authentication
   */
  @UseGuards(JwtGuard)
  @Get()
  async getUserOrders(@Request() req) {
    return await this.ordersService.getUserOrders(req.user.id);
  }

  /**
   * Get specific order
   * GET /orders/:id
   * Requires authentication
   */
  @UseGuards(JwtGuard)
  @Get(':id')
  async getOrder(@Request() req, @Param('id') id: number) {
    const isAdmin = req.user.role === UserRole.ADMIN;
    return await this.ordersService.getOrderById(id, req.user.id, isAdmin);
  }

  /**
   * Update order status
   * PATCH /orders/:id/status
   * Admin only - can update any order status
   * User can only update their own orders
   */
  @UseGuards(JwtGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.CLIENT])
  @Patch(':id/status')
  async updateOrderStatus(
    @Request() req,
    @Param('id') id: number,
    @Body('status') status: string,
  ) {
    const isAdmin = req.user.role === UserRole.ADMIN;
    return await this.ordersService.updateOrderStatus(id, status, req.user.id, isAdmin);
  }

  /**
   * Cancel order
   * POST /orders/:id/cancel
   * Requires authentication
   */
  @UseGuards(JwtGuard)
  @Post(':id/cancel')
  async cancelOrder(@Request() req, @Param('id') id: number) {
    const isAdmin = req.user.role === UserRole.ADMIN;
    return await this.ordersService.cancelOrder(id, req.user.id, isAdmin);
  }
}
