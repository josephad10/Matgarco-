import { z } from 'zod';

// Email validation
export const emailSchema = z.string().email('Invalid email format');

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Phone validation (Egyptian format)
export const phoneSchema = z
  .string()
  .regex(/^(\+20)?[0-9]{10,11}$/, 'Invalid phone number format');

// Subdomain validation
export const subdomainSchema = z
  .string()
  .min(3, 'Subdomain must be at least 3 characters')
  .max(30, 'Subdomain must be at most 30 characters')
  .regex(/^[a-z0-9-]+$/, 'Subdomain must contain only lowercase letters, numbers, and hyphens')
  .regex(/^[a-z]/, 'Subdomain must start with a letter')
  .regex(/[a-z0-9]$/, 'Subdomain must end with a letter or number');

// ObjectId validation
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

// Validate Egyptian phone number
export const validateEgyptianPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+20)?[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

// Validate subdomain availability
export const isValidSubdomain = (subdomain: string): boolean => {
  const reserved = [
    'www', 'api', 'admin', 'dashboard', 'app', 'mail', 'ftp', 
    'localhost', 'webmail', 'smtp', 'pop', 'imap', 'cpanel',
    'whm', 'ns1', 'ns2', 'matgarco', 'staging', 'dev', 'test'
  ];
  
  return !reserved.includes(subdomain.toLowerCase());
};
