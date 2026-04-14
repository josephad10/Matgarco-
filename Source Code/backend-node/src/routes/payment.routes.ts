import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  createIntention,
  handleWebhook,
  getPaymentStatus,
} from '../controllers/payment.controller';

const router = Router();

// Public — Paymob webhook (no auth, HMAC verified internally)
router.post('/webhook', handleWebhook);

// Public — Storefront checkout (no user session needed, just order data)
router.post('/create-intention', createIntention);

// Protected — check payment status (merchant accessing their order)
router.get('/status/:orderId', authenticate, getPaymentStatus);

export default router;
