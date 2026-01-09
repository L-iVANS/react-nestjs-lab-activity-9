import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // Get all products (excluding archived)
  async findAll(): Promise<Product[]> {
    const products = await this.productsRepository.find({ where: { isArchived: false } });
    return products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images as any) : []
    }));
  }

  // Get all archived products
  async findAllArchived(): Promise<Product[]> {
    const products = await this.productsRepository.find({ where: { isArchived: true } });
    return products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images as any) : []
    }));
  }

  // Get product by ID
  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return {
      ...product,
      images: product.images ? JSON.parse(product.images as any) : []
    };
  }

  // Create a new product
  async create(productData: Partial<Product>): Promise<Product> {
    // Validate and sanitize input
    if (!productData.name || productData.name.trim().length === 0) {
      throw new Error('Product name is required');
    }
    
    if (!productData.price || productData.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }
    
    if (productData.stock !== undefined && productData.stock < 0) {
      throw new Error('Product stock cannot be negative');
    }
    
    // Sanitize string inputs
    const sanitizedData: Partial<Product> = {
      ...productData,
      name: productData.name.trim(),
      description: productData.description?.trim() || '',
      category: productData.category?.trim() || '',
      images: productData.images ? JSON.stringify(productData.images) : null,
    };
    
    const product = this.productsRepository.create(sanitizedData);
    const savedProduct = await this.productsRepository.save(product);
    
    // Return with parsed images for frontend
    return {
      ...savedProduct,
      images: savedProduct.images ? JSON.parse(savedProduct.images as any) : []
    };
  }

  // Update a product
  async update(id: number, productData: Partial<Product>): Promise<Product> {
    // Validate input
    if (productData.name !== undefined && productData.name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    
    if (productData.price !== undefined && productData.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }
    
    if (productData.stock !== undefined && productData.stock < 0) {
      throw new Error('Product stock cannot be negative');
    }
    
    // Sanitize string inputs
    const sanitizedData: Partial<Product> = { ...productData };
    if (productData.name) sanitizedData.name = productData.name.trim();
    if (productData.description) sanitizedData.description = productData.description.trim();
    if (productData.category) sanitizedData.category = productData.category.trim();
    if (productData.images) sanitizedData.images = JSON.stringify(productData.images) as any;
    
    await this.productsRepository.update(id, sanitizedData);
    return this.findOne(id);
  }

  // Delete a product
  async delete(id: number): Promise<void> {
    const product = await this.findOne(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    await this.productsRepository.delete(id);
  }

  // Get products by category
  async findByCategory(category: string): Promise<Product[]> {
    const products = await this.productsRepository.find({ where: { category } });
    return products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images as any) : []
    }));
  }

  // Find product by name
  async findByName(name: string): Promise<Product | null> {
    return this.productsRepository.findOne({ where: { name } });
  }

  // Update product quantity
  async updateQuantity(id: number, quantity: number): Promise<Product> {
    await this.productsRepository.update(id, { stock: quantity });
    return this.findOne(id);
  }

  // Archive product
  async archiveProduct(id: number): Promise<Product> {
    const result = await this.productsRepository.update(id, { isArchived: true });
    if (result.affected === 0) {
      throw new Error(`Product with id ${id} not found`);
    }
    return this.findOne(id);
  }

  // Restore product from archive
  async restoreProduct(id: number): Promise<Product> {
    const result = await this.productsRepository.update(id, { isArchived: false });
    if (result.affected === 0) {
      throw new Error(`Product with id ${id} not found`);
    }
    return this.findOne(id);
  }
}
