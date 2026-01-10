import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
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
}
