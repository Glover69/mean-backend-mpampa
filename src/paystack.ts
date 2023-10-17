// src/services/paystack.service.ts

import axios from 'axios';
import { PaystackResponse } from './employee';

const PAYSTACK_SECRET_KEY = 'sk_test_7d5cb26ec39966c5ff125359a3443fe7613460a8';

export class PaystackService {
  static async initiateTransaction(amount: number, email: string): Promise<PaystackResponse> {
    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          amount: amount * 100, // Paystack API expects amount in kobo
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        status: true,
        message: 'Payment initiated successfully',
        data: response.data,
      };
    } catch (error) {
      console.error('Error initiating payment:', error.response?.data);
      return {
        status: false,
        message: 'Payment initiation failed',
      };
    }
  }
}
