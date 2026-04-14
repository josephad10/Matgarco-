import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from './error.middleware';

/**
 * Tenant Isolation Middleware
 * Ensures users can only access their own merchant data
 */
export const tenantIsolation = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  // Super admin can access all merchants
  if (req.user.role === 'super_admin') {
    return next();
  }

  // Merchant users must have merchantId
  if (!req.user.merchantId) {
    return next(new AppError('No merchant associated with this user', 403));
  }

  // Check if trying to access other merchant's data
  const requestedMerchantId = 
    req.params.merchantId || 
    req.body.merchantId || 
    req.query.merchantId;

  if (requestedMerchantId && requestedMerchantId !== req.user.merchantId) {
    return next(new AppError('Access denied to this merchant', 403));
  }

  next();
};

/**
 * Inject merchant ID into request
 * Automatically adds merchantId to queries for tenant isolation
 */
export const injectMerchantId = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.merchantId) {
    // Add merchantId to query params if not already present
    if (!req.query.merchantId) {
      req.query.merchantId = req.user.merchantId;
    }
  }
  next();
};
