// ARCHITECTURE NOTE: Ensure the main Express app (app.ts) uses CORS middleware: app.use(cors({ origin: 'http://localhost:3000' })); to prevent network blocking.

import { Request, Response } from "express";
import { z } from "zod";
import ContactMessage from "../models/ContactMessage";

// Strict validation schema to prevent injections and limit data sizes
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(150),
  phone: z.string().max(20).optional().or(z.literal("")),
  message: z.string().min(10).max(2000),
});

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const idempotencyKey = req.headers["x-idempotency-key"] as string;
    
    if (!idempotencyKey) {
      res.status(400).json({ success: false, message: "Missing x-idempotency-key header" });
      return;
    }

    // 1. Input Validation
    const parsedData = contactSchema.safeParse(req.body);
    if (!parsedData.success) {
      console.error("Zod Validation Failed:", parsedData.error.format());
      res.status(400).json({ 
        success: false, 
        message: "Invalid input data", 
        errors: parsedData.error.errors 
      });
      return;
    }

    const { name, email, phone, message } = parsedData.data;

    // 2. Input Sanitization (Basic XSS mitigation)
    const sanitizedMessage = message.replace(/<[^>]*>?/gm, "");

    // 3. Database Operation
    const newContact = new ContactMessage({
      name,
      email,
      phone,
      message: sanitizedMessage,
      idempotencyKey,
    });

    await newContact.save();

    res.status(200).json({ success: true, data: newContact });
  } catch (error: unknown) {
    // 4. Idempotency Handling
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      res.status(200).json({ success: true, message: "Idempotent response: Message already received." });
      return;
    }
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Contact Submission Error:", errorMessage);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
