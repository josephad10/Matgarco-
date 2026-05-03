import { Router } from "express";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { submitContact } from "../controllers/contact.controller";

const router = Router();

// 1. SECURITY: Explicit CORS for Next.js ports (allowedHeaders fixes preflight blocking of custom header)
router.use(cors({ 
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"], 
  credentials: true,
  allowedHeaders: ["Content-Type", "x-idempotency-key"] // CRITICAL FOR PREFLIGHT
}));

// 2. ARCHITECTURE FIX: Force JSON parsing! (This fixes the empty {} error)
router.use(express.json());

// 3. SECURITY: Rate Limiting (DOS & Brute Force Protection)
const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per window
  message: { success: false, message: "Too many requests. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. ROUTE MOUNTING
router.post("/", contactRateLimiter, submitContact);

export default router;
