import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { tenantIsolation } from '../middleware/tenantIsolation.middleware';
import {
  uploadSingle,
  uploadMultiple,
  handleMulterError,
} from '../middleware/upload.middleware';
import {
  uploadSingleImage,
  uploadMultipleImagesController,
} from '../controllers/upload.controller';

const router = Router();

// All routes require authentication and tenant isolation
router.use(authenticate);
router.use(tenantIsolation);

/**
 * @route   POST /api/upload/single
 * @desc    Upload single image
 * @access  Private (Merchant/Staff)
 */
router.post('/single', uploadSingle, handleMulterError, uploadSingleImage);

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple images (max 5)
 * @access  Private (Merchant/Staff)
 */
router.post('/multiple', uploadMultiple, handleMulterError, uploadMultipleImagesController);

export default router;
