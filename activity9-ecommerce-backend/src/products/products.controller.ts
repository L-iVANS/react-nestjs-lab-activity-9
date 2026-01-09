import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../utils/enums/user-role.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET all products - Public (no auth required for guests)
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  // GET product by ID - Public (no auth required)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  // POST create new product - Admin only
  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  async create(@Body() productData: Partial<Product>): Promise<Product> {
    return this.productsService.create(productData);
  }

  // PUT update product - Admin only
  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  async update(@Param('id') id: number, @Body() productData: Partial<Product>): Promise<Product> {
    return this.productsService.update(id, productData);
  }

  // DELETE product - Admin only
  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    await this.productsService.delete(id);
    return { message: 'Product deleted successfully' };
  }

  // GET products by category - Authenticated users (clients, admins)
  @Get('category/:category')
  @UseGuards(JwtGuard)
  async findByCategory(@Param('category') category: string): Promise<Product[]> {
    return this.productsService.findByCategory(category);
  }

  // GET archived products - Admin only
  @Get('archive/list')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  async getArchivedProducts(): Promise<Product[]> {
    return this.productsService.findAllArchived();
  }

  // Archive product - Admin only
  @Put(':id/archive')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  async archiveProduct(@Param('id') id: number): Promise<Product> {
    return this.productsService.archiveProduct(id);
  }

  // Restore product from archive - Admin only
  @Put(':id/restore')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  async restoreProduct(@Param('id') id: number): Promise<Product> {
    return this.productsService.restoreProduct(id);
  }
}
