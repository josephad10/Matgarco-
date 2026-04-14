import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  updateTracking,
} from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantIsolation } from '../middleware/tenantIsolation.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createOrderSchema = z.object({
  body: z.object({
    merchantId: z.string(),
    items: z.array(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1),
      })
    ).min(1, 'At least one item required'),
    customerInfo: z.object({
      email: z.string().email(),
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      phone: z.string(),
    }),
    shippingAddress: z.object({
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string(),
      street: z.string(),
      city: z.string(),
      state: z.string().optional(),
      country: z.string().default('Egypt'),
      postalCode: z.string().optional(),
    }),
    billingAddress: z.object({
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string(),
      street: z.string(),
      city: z.string(),
      state: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.string().optional(),
    }).optional(),
    paymentMethod: z.enum(['cash', 'card', 'paymob', 'wallet']),
    shippingCost: z.number().min(0).optional(),
    tax: z.number().min(0).optional(),
    discount: z.number().min(0).optional(),
    customerNotes: z.string().optional(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    orderStatus: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
    note: z.string().optional(),
  }),
});

const updatePaymentSchema = z.object({
  body: z.object({
    paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']),
    transactionId: z.string().optional(),
  }),
});

// Public route (storefront checkout)
router.post(
  '/',
  validate(createOrderSchema),
  createOrder
);

// Protected routes (merchant)
router.get(
  '/',
  authenticate,
  tenantIsolation,
  getOrders
);

router.get(
  '/:id',
  authenticate,
  tenantIsolation,
  getOrderById
);

router.patch(
  '/:id/status',
  authenticate,
  tenantIsolation,
  validate(updateStatusSchema),
  updateOrderStatus
);

router.patch(
  '/:id/payment',
  authenticate,
  tenantIsolation,
  validate(updatePaymentSchema),
  updatePaymentStatus
);

router.post(
  '/:id/cancel',
  authenticate,
  tenantIsolation,
  cancelOrder
);

router.patch(
  '/:id/tracking',
  authenticate,
  tenantIsolation,
  updateTracking
);

export default router;
