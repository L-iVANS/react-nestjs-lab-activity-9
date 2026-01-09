import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';


@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('link')
  async createLink(
    @Body()
    body: {
      amount: number;
      description: string;
      successUrl: string;
      failedUrl: string;
    },
  ) {
    const { amount, description, successUrl, failedUrl } = body;
    const result = await this.paymentsService.createPaymentLink(amount, description, successUrl, failedUrl);
    return result;
  }
}
