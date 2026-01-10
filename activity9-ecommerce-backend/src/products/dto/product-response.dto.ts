import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Sample Product' })
  name: string;

  @ApiProperty({ example: 'A great product.' })
  description: string;

  @ApiProperty({ example: 999.99 })
  price: number;

  @ApiProperty({ example: 10 })
  stock: number;

  @ApiProperty({ example: ['https://example.com/image1.jpg'] })
  images: string[];

  @ApiProperty({ example: 'Electronics' })
  category: string;

  @ApiProperty({ example: 'Graphics Card' })
  productType: string;

  @ApiProperty({ example: false })
  isArchived: boolean;

  @ApiProperty({ example: '2026-01-11T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-11T00:00:00.000Z' })
  updatedAt: Date;
}
