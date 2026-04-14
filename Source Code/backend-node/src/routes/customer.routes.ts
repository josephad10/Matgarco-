import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  updateCustomer,
  getCustomerOrders,
} from '../controllers/customer.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantIsolation } from '../middleware/tenantIsolation.middleware';

const router = Router();

// All routes require authentication
router.get(
  '/',
  authenticate,
  tenantIsolation,
  getCustomers
);

router.get(
  '/:id',
  authenticate,
  tenantIsolation,
  getCustomerById
);

router.patch(
  '/:id',
  authenticate,
  tenantIsolation,
  updateCustomer
);

router.get(
  '/:id/orders',
  authenticate,
  tenantIsolation,
  getCustomerOrders
);

export default router;
