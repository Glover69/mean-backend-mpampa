// src/routes/paystack.route.ts

import express from 'express';
import { PaystackService } from './paystack';
const router = express.Router();

router.post('/initiate-payment', async (req, res) => {
  const { amount, email } = req.body;
  const paymentResponse = await PaystackService.initiateTransaction(amount, email);
  res.json(paymentResponse);
});

export default router;
