import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../utils/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET all products - Public (no auth required for guests)
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products' })
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  // GET product by ID - Public (no auth required)
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product details' })
  async findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  // POST create new product - Admin only
  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(@Body() productData: CreateProductDto): Promise<Product> {
    // Convert images array to JSON string for storage
    const dataToSave = {
      ...productData,
      images: Array.isArray(productData.images) ? JSON.stringify(productData.images) : productData.images,
    };
    return this.productsService.create(dataToSave as any);
  }

  // PUT update product - Admin only
  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async update(@Param('id') id: number, @Body() productData: UpdateProductDto): Promise<Product> {
    // Convert images array to JSON string for storage
    const dataToUpdate = {
      ...productData,
      images: Array.isArray(productData.images) ? JSON.stringify(productData.images) : productData.images,
    };
    return this.productsService.update(id, dataToUpdate as any);
  }

  // GET products by category - Authenticated users (clients, admins)
  @Get('category/:category')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({ status: 200, description: 'List of products by category' })
  async findByCategory(@Param('category') category: string): Promise<Product[]> {
    return this.productsService.findByCategory(category);
  }

  // GET archived products - Admin only
  @Get('archive/list')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  @ApiOperation({ summary: 'Get archived products' })
  @ApiResponse({ status: 200, description: 'List of archived products' })
  async getArchivedProducts(): Promise<Product[]> {
    return this.productsService.findAllArchived();
  }

  // Archive product - Admin only
  @Put(':id/archive')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  @ApiOperation({ summary: 'Archive a product' })
  @ApiResponse({ status: 200, description: 'Product archived successfully' })
  async archiveProduct(@Param('id') id: number): Promise<Product> {
    return this.productsService.archiveProduct(id);
  }

  // Restore product from archive - Admin only
  @Put(':id/restore')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  @ApiOperation({ summary: 'Restore a product from archive' })
  @ApiResponse({ status: 200, description: 'Product restored successfully' })
  async restoreProduct(@Param('id') id: number): Promise<Product> {
    return this.productsService.restoreProduct(id);
  }
}
