import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentLinkDto {
  @ApiProperty({ example: 1000 })
  amount: number;

  @ApiProperty({ example: 'Order payment for #123' })
  description: string;

  @ApiProperty({ example: 'https://example.com/success' })
  successUrl: string;

  @ApiProperty({ example: 'https://example.com/failed' })
  failedUrl: string;
}
