import { Router } from 'express';
import { apiLimiter } from '../middleware/rateLimiter.middleware';
import { checkSubdomainAvailability } from '../controllers/public.controller';

const router = Router();

// GET /api/public/subdomain/check?subdomain=<value>
//
// Security layer order (enforced left-to-right by Express):
//   1. apiLimiter  — Token Bucket rate limiter (15 req / 30s per IP).
//                    IP resolution relies on `app.set('trust proxy', 1)`
//                    configured in app.ts to correctly identify real client
//                    IPs behind Cloudflare / Vercel reverse proxies.
//   2. checkSubdomainAvailability — validates, blacklists reserved names,
//                    and performs O(1) DB existence check.
router.get('/subdomain/check', apiLimiter, checkSubdomainAvailability);

export default router;
