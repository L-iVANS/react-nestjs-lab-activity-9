import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaymentsService } from './payments.service';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('link')
  @ApiOperation({ summary: 'Create payment link' })
  @ApiResponse({ status: 201, description: 'Payment link created successfully' })
  async createLink(
    @Body() body: CreatePaymentLinkDto,
  ) {
    const { amount, description, successUrl, failedUrl } = body;
    const result = await this.paymentsService.createPaymentLink(amount, description, successUrl, failedUrl);
    return result;
  }
}
