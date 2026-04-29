import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Merchant from '../models/Merchant';

// -----------------------------------------------------------------------
// SECURITY: Reserved Subdomain Blacklist
//
// These subdomains are permanently blocked from merchant registration to:
//   1. Protect platform infrastructure routes (api, admin, app, dashboard)
//   2. Prevent brand impersonation (matgarco, support, status)
//   3. Block trivially guessable vanity names used for scanning (www, test, demo)
//
// Using a Set<string> ensures O(1) lookup — this check runs before any DB hit.
// -----------------------------------------------------------------------
const RESERVED_SUBDOMAINS = new Set<string>([
  'www',
  'api',
  'admin',
  'app',
  'dashboard',
  'support',
  'mail',
  'blog',
  'status',
  'matgarco',
  'test',
  'demo',
  'store',
  'shop',
]);

// -----------------------------------------------------------------------
// Zod Schema: Subdomain Validation
//
// Regex enforces RFC-compliant subdomain structure:
//   - Must start and end with alphanumeric character
//   - May contain hyphens in the middle
//   - Max length: 63 characters (DNS label limit)
//   - Case-insensitive flag matches both 'MyStore' and 'mystore'
//
// On failure: we intentionally return { available: false } — not a 422 —
// to prevent input format disclosure to subdomain scanners (Anti-Leakage Policy).
// -----------------------------------------------------------------------
const subdomainQuerySchema = z.object({
  subdomain: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i,
      'Subdomain contains invalid characters or format.'
    ),
});

export const checkSubdomainAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Step 1: Zod validation — parse and validate the query parameter
    const parseResult = subdomainQuerySchema.safeParse(req.query);

    if (!parseResult.success) {
      // Anti-Leakage: Malformed inputs are silently treated as unavailable.
      // We never expose the validation error message to the caller.
      res.status(200).json({ available: false });
      return;
    }

    // Step 2: Normalize to lowercase — subdomains are always case-insensitive at the DNS level
    const normalizedSubdomain = parseResult.data.subdomain.toLowerCase();

    // Step 3: Reserved subdomain check — O(1) Set lookup, runs BEFORE any DB query
    if (RESERVED_SUBDOMAINS.has(normalizedSubdomain)) {
      // Anti-Leakage: Reserved names return false, not a separate error code.
      // An attacker cannot distinguish "reserved" from "already taken."
      res.status(200).json({ available: false });
      return;
    }

    // Step 4: Database existence check — O(1) via the explicit subdomain index.
    // Merchant.exists() returns the _id of a matching doc or null.
    // It does NOT hydrate the full 250+ field Mongoose document — avoiding
    // Event Loop blocking and unnecessary heap allocation.
    const existingMerchant = await Merchant.exists({ subdomain: normalizedSubdomain });

    res.status(200).json({ available: existingMerchant === null });
  } catch (error) {
    // Escalate unexpected errors (e.g., DB timeout, network partition) to the
    // centralized error handler. The handler will log context and return a
    // safe 500 response without leaking internals.
    next(error);
  }
};
