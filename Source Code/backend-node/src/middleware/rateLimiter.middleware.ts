import rateLimit from 'express-rate-limit';
import { AppError } from './error.middleware';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many auth requests, please try again later', 429));
  },
});

export const checkoutLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many checkout attempts, please try again later', 429));
  },
});

// -----------------------------------------------------------------------
// apiLimiter: Token Bucket strategy for the public subdomain check API.
//
// Configuration rationale:
//   - windowMs: 30s — short enough to throttle bots, long enough for a human
//     composing a store name at natural typing speed (typically 1 req/2–3s).
//   - max: 15 — allows a human to check ~15 subdomains in 30 seconds,
//     which covers real UX tolerance (debounce fires ~every 500ms).
//     A bot scanning the namespace would be blocked after 15 attempts.
//
// Trust Proxy is configured in app.ts so this limiter resolves the real
// client IP behind Cloudflare/Vercel reverse proxies, not the proxy IP.
// -----------------------------------------------------------------------
export const apiLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 15,
  standardHeaders: true, // Sends RateLimit-* headers (RFC 6585)
  legacyHeaders: false,  // Disables deprecated X-RateLimit-* headers
  handler: (req, res, next) => {
    next(new AppError('Too many requests. Please slow down and try again shortly.', 429));
  },
});
