import { Router } from 'express';
import { authenticate, isMerchant } from '../middleware/auth.middleware';
import {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
} from '../controllers/notification.controller';

const router = Router();

router.use(authenticate, isMerchant);

router.get('/', getNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);
router.delete('/:id', deleteNotification);

export default router;
