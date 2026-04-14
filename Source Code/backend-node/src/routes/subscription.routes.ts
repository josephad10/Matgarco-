import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  listPlans,
  getMySubscription,
  subscribeToPlan,
  upgradePlan,
  downgradePlan,
  cancelSubscription,
  listInvoices,
} from '../controllers/subscription.controller';

const router = Router();

// Public — anyone can see plans
router.get('/plans', listPlans);

// Protected — merchant must be logged in
router.use(authenticate);

router.get('/my', getMySubscription);
router.get('/invoices', listInvoices);
router.post('/subscribe', subscribeToPlan);
router.post('/upgrade', upgradePlan);
router.post('/downgrade', downgradePlan);
router.post('/cancel', cancelSubscription);

export default router;
