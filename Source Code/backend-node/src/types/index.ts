import { Request } from 'express';

// User roles
export type UserRole = 'super_admin' | 'merchant_owner' | 'merchant_staff' | 'customer';

// Staff permission keys
export type PermissionKey =
  | 'products.view' | 'products.create' | 'products.edit' | 'products.delete'
  | 'orders.view' | 'orders.updateStatus' | 'orders.cancel'
  | 'customers.view' | 'customers.edit'
  | 'reports.view'
  | 'settings.view' | 'settings.edit' | 'settings.editSubscription'
  | 'staff.view' | 'staff.create' | 'staff.edit' | 'staff.delete';

export type StaffPermissions = Record<PermissionKey, boolean>;

// Subscription plans
export type SubscriptionPlan = 'free_trial' | 'starter' | 'professional' | 'business';

// Order status
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type FulfillmentStatus = 'unfulfilled' | 'partial' | 'fulfilled';

// Product status
export type ProductStatus = 'draft' | 'active' | 'archived';

// Template types
export type TemplateType = 'modern' | 'minimal' | 'luxury';

// Extend Express Request type
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
    merchantId?: string;
    permissions?: Record<string, boolean>;
    staffRole?: string;
  };
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  merchantId?: string;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
