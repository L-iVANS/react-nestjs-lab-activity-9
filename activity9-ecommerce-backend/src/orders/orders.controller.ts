import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../utils/enums/user-role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Validate order before checkout
   * POST /orders/validate
   */
  @Post('validate')
  @ApiOperation({ summary: 'Validate order before checkout' })
  @ApiResponse({ status: 200, description: 'Order validation result' })
  async validateOrder(
    @Body('items') items: Array<{ name: string; price: number; qty: number }>,
  ) {
    try {
      await this.ordersService.validateOrder(items);
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
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async createOrder(
    @Request() req,
    @Body() body: CreateOrderDto,
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
  @ApiOperation({ summary: "Get user's orders" })
  @ApiResponse({ status: 200, description: 'List of user orders' })
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
  @ApiOperation({ summary: 'Get specific order' })
  @ApiResponse({ status: 200, description: 'Order details' })
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
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
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
  @ApiOperation({ summary: 'Cancel order (remove from cart)' })
  @ApiResponse({ status: 200, description: 'Order cancelled/removed from cart' })
  async cancelOrder(@Request() req, @Param('id') id: number) {
    const isAdmin = req.user.role === UserRole.ADMIN;
    return await this.ordersService.cancelOrder(id, req.user.id, isAdmin);
  }
}
