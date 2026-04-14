import { Response, NextFunction } from 'express';
import Merchant from '../models/Merchant';
import User from '../models/User';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../types';
import { generateSlug } from '../utils/helpers';
import { isValidSubdomain } from '../utils/validators';
import { SUBSCRIPTION_PLANS } from '../utils/constants';

/**
 * Create merchant (during onboarding)
 * POST /api/merchants
 */
export const createMerchant = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { name, storeName, subdomain, description } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Get user to fetch email
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if user already has a merchant
    const existingMerchant = await Merchant.findOne({ ownerId: userId });
    if (existingMerchant) {
      throw new AppError('User already has a merchant store', 400);
    }

    // Use name or storeName
    const merchantName = name || storeName;
    if (!merchantName) {
      throw new AppError('Store name is required', 400);
    }

    // Validate subdomain
    if (!isValidSubdomain(subdomain)) {
      throw new AppError('Subdomain is reserved or invalid', 400);
    }

    // Check if subdomain is available
    const subdomainExists = await Merchant.findOne({ subdomain: subdomain.toLowerCase() });
    if (subdomainExists) {
      throw new AppError('Subdomain is already taken', 400);
    }

    // Calculate trial end date (14 days from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 14);

    // Calculate subscription end date (same as trial for free trial)
    const subscriptionEndDate = new Date(trialEndDate);

    // Create merchant with free trial
    const merchant = await Merchant.create({
      storeName: merchantName,
      subdomain: subdomain.toLowerCase(),
      description,
      email: user.email,
      ownerId: userId,
      subscriptionPlan: 'free_trial',
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: subscriptionEndDate,
      trialEndsAt: trialEndDate,
      limits: SUBSCRIPTION_PLANS.free_trial.limits,
    });

    // Update user with merchantId
    await User.findByIdAndUpdate(userId, {
      merchantId: merchant._id,
    });

    res.status(201).json({
      success: true,
      message: 'Merchant created successfully',
      data: {
        merchant: {
          id: merchant._id,
          name: merchant.storeName,
          subdomain: merchant.subdomain,
          subscriptionPlan: merchant.subscriptionPlan,
          trialEndsAt: merchant.trialEndsAt,
        },
      },
    });
  }
);

/**
 * Get merchant by ID
 * GET /api/merchants/:id
 */
export const getMerchantById = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const merchant = await Merchant.findById(id).populate('ownerId', 'firstName lastName email');

    if (!merchant) {
      throw new AppError('Merchant not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { merchant },
    });
  }
);

/**
 * Get merchant by subdomain (public)
 * GET /api/merchants/subdomain/:subdomain
 */
export const getMerchantBySubdomain = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { subdomain } = req.params;

    const merchant = await Merchant.findOne({ 
      subdomain: subdomain.toLowerCase(),
      isActive: true 
    });

    if (!merchant) {
      throw new AppError('Store not found', 404);
    }

    // Return public data only
    res.status(200).json({
      success: true,
      data: {
        merchant: {
          id: merchant._id,
          storeName: merchant.storeName,
          subdomain: merchant.subdomain,
          logo: merchant.logo,
          description: merchant.description,
          currency: merchant.currency,
          language: merchant.language,
        },
      },
    });
  }
);

/**
 * Update merchant
 * PATCH /api/merchants/:id
 */
export const updateMerchant = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow updating sensitive fields
    delete updates.ownerId;
    delete updates.subscriptionPlan;
    delete updates.subscriptionStatus;
    delete updates.limits;
    delete updates.stats;

    const merchant = await Merchant.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!merchant) {
      throw new AppError('Merchant not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Merchant updated successfully',
      data: { merchant },
    });
  }
);

/**
 * Get merchant stats
 * GET /api/merchants/:id/stats
 */
export const getMerchantStats = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const merchant = await Merchant.findById(id);

    if (!merchant) {
      throw new AppError('Merchant not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        stats: merchant.stats,
        subscription: {
          plan: merchant.subscriptionPlan,
          status: merchant.subscriptionStatus,
          endsAt: merchant.subscriptionEndDate,
          trialEndsAt: merchant.trialEndsAt,
        },
        limits: merchant.limits,
      },
    });
  }
);

/**
 * Check subdomain availability
 * GET /api/merchants/check-subdomain/:subdomain
 */
export const checkSubdomainAvailability = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { subdomain } = req.params;

    // Validate format
    if (!isValidSubdomain(subdomain)) {
      res.status(200).json({
        success: true,
        data: {
          available: false,
          reason: 'Subdomain is reserved or invalid format',
        },
      });
      return;
    }

    // Check if exists
    const exists = await Merchant.findOne({ subdomain: subdomain.toLowerCase() });

    res.status(200).json({
      success: true,
      data: {
        available: !exists,
        subdomain: subdomain.toLowerCase(),
      },
    });
  }
);

/**
 * Complete onboarding
 * POST /api/merchants/:id/complete-onboarding
 */
export const completeOnboarding = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const merchant = await Merchant.findByIdAndUpdate(
      id,
      { onboardingCompleted: true },
      { new: true }
    );

    if (!merchant) {
      throw new AppError('Merchant not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Onboarding completed',
      data: { merchant },
    });
  }
);

// ==================== ADMIN ONLY ====================

/**
 * Get all merchants (Admin)
 * GET /api/merchants
 */
export const getAllMerchants = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    
    if (req.query.status) {
      filter.subscriptionStatus = req.query.status;
    }
    
    if (req.query.plan) {
      filter.subscriptionPlan = req.query.plan;
    }

    const [merchants, total] = await Promise.all([
      Merchant.find(filter)
        .populate('ownerId', 'firstName lastName email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Merchant.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        merchants,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  }
);

/**
 * Suspend merchant (Admin)
 * POST /api/merchants/:id/suspend
 */
export const suspendMerchant = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { reason } = req.body;

    const merchant = await Merchant.findByIdAndUpdate(
      id,
      {
        isActive: false,
        subscriptionStatus: 'suspended',
        suspensionReason: reason,
      },
      { new: true }
    );

    if (!merchant) {
      throw new AppError('Merchant not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Merchant suspended',
      data: { merchant },
    });
  }
);

/**
 * Activate merchant (Admin)
 * POST /api/merchants/:id/activate
 */
export const activateMerchant = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const merchant = await Merchant.findByIdAndUpdate(
      id,
      {
        isActive: true,
        subscriptionStatus: 'active',
        suspensionReason: undefined,
      },
      { new: true }
    );

    if (!merchant) {
      throw new AppError('Merchant not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Merchant activated',
      data: { merchant },
    });
  }
);
