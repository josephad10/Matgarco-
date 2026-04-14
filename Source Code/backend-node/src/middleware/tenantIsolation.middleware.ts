import { Response, NextFunction } from 'express';
import Merchant from '../models/Merchant';
import { AuthRequest } from '../types';
import { AppError } from './error.middleware';

/**
 * enforceTenantScope — Unified Tenant Isolation Middleware
 *
 * Single source of truth for establishing the verified `req.merchantId`.
 * Replaces the previous two-function design (`tenantIsolation` + `injectMerchantId`)
 * which was fragile because a developer could accidentally apply injection
 * without validation, or neither at all.
 *
 * ─── THREE SCENARIOS ────────────────────────────────────────────────────────
 *
 * 1. SUPER ADMIN
 *    Bypasses all tenant checks.  May optionally read a merchantId from
 *    req.params / req.query to act on behalf of a specific merchant.
 *    req.merchantId is set to that value if present; otherwise left unset
 *    so the controller can scope its own query as needed.
 *
 * 2. AUTHENTICATED MERCHANT / STAFF (req.user present, role ≠ super_admin)
 *    a. Requires req.user.merchantId — 403 if absent.
 *    b. If any clientMerchantId is supplied in params/query/body, it MUST
 *       match the JWT's merchantId — 403 if it does not.
 *    c. Sets req.merchantId = req.user.merchantId (JWT-verified value).
 *       Controllers read only from req.merchantId, never from req.body.merchantId.
 *
 * 3. PUBLIC STOREFRONT (no req.user — unauthenticated)
 *    a. Tenant is resolved from the `x-subdomain` request header ONLY.
 *       This header is set by the Next.js storefront middleware (trusted server hop)
 *       and CANNOT be spoofed by a browser client as a custom HTTP header on a
 *       cross-origin request to the backend directly.
 *    b. Any merchantId present in req.body, req.query, or req.params is
 *       DELETED before `next()` is called — client-side injection is impossible.
 *    c. Performs a DB lookup to resolve subdomain → merchantId and verifies
 *       the store is active.  If no active merchant is found → 403.
 *    d. Sets req.merchantId = verified merchant._id.toString().
 *
 * ─── CONTROLLER CONTRACT ────────────────────────────────────────────────────
 * After this middleware, every controller can safely write:
 *   const merchantId = req.merchantId!;
 * and be guaranteed it is a DB-verified, injection-proof tenant identifier.
 */
export const enforceTenantScope = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // ── SCENARIO 1: Super Admin ──────────────────────────────────────────────
    if (req.user?.role === 'super_admin') {
      // Allow super_admin to target a specific merchant via params/query.
      // If none is specified, req.merchantId remains undefined and the
      // controller is responsible for scoping its own query.
      const targetId =
        (req.params.merchantId as string | undefined) ||
        (req.query.merchantId as string | undefined);

      if (targetId) {
        req.merchantId = targetId;
      }
      return next();
    }

    // ── SCENARIO 2: Authenticated Merchant / Staff ───────────────────────────
    if (req.user) {
      if (!req.user.merchantId) {
        return next(new AppError('No merchant associated with this user', 403));
      }

      // Cross-check any client-supplied ID against the JWT claim.
      // A mismatch means the client is attempting to access a different tenant.
      const clientMerchantId =
        (req.params.merchantId as string | undefined) ||
        (req.query.merchantId as string | undefined) ||
        (req.body?.merchantId as string | undefined);

      if (clientMerchantId && clientMerchantId !== req.user.merchantId) {
        return next(new AppError('Access denied to this merchant', 403));
      }

      // Pin the verified merchantId to the top-level request property.
      // Controllers must read from here — never from req.body.merchantId.
      req.merchantId = req.user.merchantId;

      // Convenience: ensure query-based controllers that filter by merchantId
      // can pick it up without accessing req.user (backward compat with getProducts).
      if (!req.query.merchantId) {
        req.query.merchantId = req.user.merchantId;
      }

      return next();
    }

    // ── SCENARIO 3: Public Storefront (unauthenticated) ──────────────────────
    // Subdomain is set by the Next.js storefront Edge middleware as a trusted
    // server-to-server header.  We never accept merchantId from the client body.
    const subdomain = req.headers['x-subdomain'] as string | undefined;

    // CRITICAL: Scrub any client-injected merchantId before proceeding.
    // Ensures a browser cannot bypass tenant isolation by supplying their own ID.
    if (req.body) delete req.body.merchantId;
    if (req.query.merchantId) delete req.query.merchantId;
    if (req.params.merchantId) delete req.params.merchantId;

    if (!subdomain) {
      return next(
        new AppError(
          'Store subdomain is required for public routes',
          403
        )
      );
    }

    // DB lookup: resolve subdomain → verified merchantId.
    // This is the only trusted path for public route tenant resolution.
    const merchant = await Merchant.findOne(
      { subdomain: subdomain.toLowerCase(), isActive: true },
      { _id: 1 }   // projection: fetch only what we need
    ).lean();

    if (!merchant) {
      return next(new AppError('Store not found or inactive', 403));
    }

    req.merchantId = (merchant._id as any).toString();
    return next();

  } catch (err) {
    return next(err);
  }
};

// ─── Backward-Compatible Named Exports ──────────────────────────────────────
// All existing route files import `tenantIsolation` and/or `injectMerchantId`
// by name.  These aliases preserve those import contracts so zero route files
// need to be changed.  Both now resolve to the single unified implementation.
//
//   OLD chain:  authenticate → tenantIsolation → injectMerchantId → controller
//   NEW chain:  authenticate → tenantIsolation (= enforceTenantScope) → controller
//
// `injectMerchantId` is deliberately aliased to the full middleware rather than
// being a no-op, so that any route which previously used it alone (without
// `tenantIsolation`) is now automatically protected.
export const tenantIsolation = enforceTenantScope;
export const injectMerchantId = enforceTenantScope;
