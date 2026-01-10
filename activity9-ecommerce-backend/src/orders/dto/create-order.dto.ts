import { IsArray, IsObject, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: [
    { name: 'Sample Product', price: 999.99, qty: 2 }
  ] })
  @IsArray()
  items: Array<{ name: string; price: number; qty: number }>;

  @ApiProperty({ example: {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    address: '123 Main St',
    city: 'Metro City',
    state: 'Metro State',
    zipCode: '12345'
  } })
  @IsObject()
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };

  @ApiProperty({ example: 1999.98 })
  @IsNumber()
  total: number;

  @ApiProperty({ example: 'credit_card' })
  @IsString()
  paymentMethod: string;
}
