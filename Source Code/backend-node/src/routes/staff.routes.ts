import { Router } from 'express';
import { authenticate, authorize, checkPermission } from '../middleware/auth.middleware';
import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  resetStaffPassword,
} from '../controllers/staff.controller';

const router = Router();

// All routes require authentication + merchant role
router.use(authenticate, authorize('merchant_owner', 'merchant_staff'));

// View: anyone with staff.view permission (owners always pass)
router.get('/', checkPermission('staff.view'), getStaff);

// Mutating actions: require specific permissions
router.post('/', checkPermission('staff.create'), createStaff);
router.patch('/:id', checkPermission('staff.edit'), updateStaff);
router.delete('/:id', checkPermission('staff.delete'), deleteStaff);
router.post('/:id/reset-password', checkPermission('staff.edit'), resetStaffPassword);

export default router;
