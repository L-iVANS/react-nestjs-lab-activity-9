import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentsService {
  constructor(private readonly http: HttpService) {}

  async createPaymentLink(amountPhp: number, description: string, successUrl: string, failedUrl: string) {
    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!secretKey) {
      throw new InternalServerErrorException('PAYMONGO_SECRET_KEY is not set');
    }

    const payload = {
      data: {
        attributes: {
          amount: Math.round(amountPhp * 100), // centavos
          description,
          remarks: 'Checkout payment link',
          currency: 'PHP',
          redirect: {
            success: successUrl,
            failed: failedUrl,
          },
        },
      },
    };

    const authHeader = 'Basic ' + Buffer.from(`${secretKey}:`).toString('base64');

    const response = await firstValueFrom(
      this.http.post('https://api.paymongo.com/v1/links', payload, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }),
    );

    return response.data;
  }
}
