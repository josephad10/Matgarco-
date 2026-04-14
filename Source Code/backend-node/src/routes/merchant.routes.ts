import { Router } from 'express';
import {
  createMerchant,
  getMerchantById,
  getMerchantBySubdomain,
  updateMerchant,
  getMerchantStats,
  checkSubdomainAvailability,
  completeOnboarding,
  getAllMerchants,
  suspendMerchant,
  activateMerchant,
} from '../controllers/merchant.controller';
import { authenticate, authorize, isMerchantOwner } from '../middleware/auth.middleware';
import { tenantIsolation } from '../middleware/tenantIsolation.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';
import { subdomainSchema, emailSchema } from '../utils/validators';

const router = Router();

// Validation schemas
const createMerchantSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Store name must be at least 2 characters').optional(),
    storeName: z.string().min(2, 'Store name must be at least 2 characters').optional(),
    subdomain: subdomainSchema,
    description: z.string().optional(),
  }).refine(data => data.name || data.storeName, {
    message: 'Store name is required',
  }),
});

const updateMerchantSchema = z.object({
  body: z.object({
    storeName: z.string().min(2).optional(),
    businessName: z.string().optional(),
    businessType: z.enum(['retail', 'wholesale', 'services', 'other']).optional(),
    description: z.string().optional(),
    phone: z.string().optional(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      postalCode: z.string(),
    }).optional(),
    currency: z.string().optional(),
    language: z.enum(['ar', 'en']).optional(),
  }),
});

// Public routes
router.get('/subdomain/:subdomain', getMerchantBySubdomain);
router.get('/check-subdomain/:subdomain', checkSubdomainAvailability);

// Protected routes (Merchant Owner)
router.post(
  '/',
  authenticate,
  validate(createMerchantSchema),
  createMerchant
);

router.get(
  '/:id',
  authenticate,
  tenantIsolation,
  getMerchantById
);

router.patch(
  '/:id',
  authenticate,
  tenantIsolation,
  isMerchantOwner,
  validate(updateMerchantSchema),
  updateMerchant
);

router.get(
  '/:id/stats',
  authenticate,
  tenantIsolation,
  getMerchantStats
);

router.post(
  '/:id/complete-onboarding',
  authenticate,
  tenantIsolation,
  isMerchantOwner,
  completeOnboarding
);

// Admin only routes
router.get(
  '/',
  authenticate,
  authorize('super_admin'),
  getAllMerchants
);

router.post(
  '/:id/suspend',
  authenticate,
  authorize('super_admin'),
  suspendMerchant
);

router.post(
  '/:id/activate',
  authenticate,
  authorize('super_admin'),
  activateMerchant
);

export default router;
