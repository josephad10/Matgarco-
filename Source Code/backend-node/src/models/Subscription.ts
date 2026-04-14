import mongoose, { Document, Schema } from 'mongoose';

// ─────────────────────────────────────────────
// PLAN DEFINITIONS — single source of truth
// ─────────────────────────────────────────────
export const PLANS = {
  free_trial: {
    id: 'free_trial',
    name: 'تجربة مجانية',
    nameEn: 'Free Trial',
    price: 0,
    yearlyPrice: 0,
    trialDays: 14,
    limits: { maxProducts: 20, maxStaffUsers: 0, aiCreditsPerMonth: 5 },
    commission: 3,
    features: [
      '20 منتج',
      'متجر إلكتروني احترافي',
      'قالب واحد مجاني',
      'لوحة تحكم أساسية',
      'دعم بريدي'
    ],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    nameEn: 'Starter',
    price: 250,
    yearlyPrice: 2500,
    trialDays: 0,
    limits: { maxProducts: 100, maxStaffUsers: 2, aiCreditsPerMonth: 20 },
    commission: 2,
    features: [
      '100 منتج',
      'مستخدمَي فريق',
      '20 رصيد AI شهرياً',
      'تقارير مبيعات',
      'دعم نظام الشحن',
      'دعم بريدي وهاتفي'
    ],
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    nameEn: 'Professional',
    price: 450,
    yearlyPrice: 4500,
    trialDays: 0,
    limits: { maxProducts: 500, maxStaffUsers: 5, aiCreditsPerMonth: 50 },
    commission: 0,
    features: [
      '500 منتج',
      '5 مستخدمي فريق',
      '50 رصيد AI شهرياً',
      'بوابة دفع Paymob الخاصة',
      'كوبونات وخصومات',
      'تقارير متقدمة',
      'عمولة منصة 0%',
      'دعم أولوية'
    ],
  },
  business: {
    id: 'business',
    name: 'Business',
    nameEn: 'Business',
    price: 699,
    yearlyPrice: 6990,
    trialDays: 0,
    limits: { maxProducts: -1, maxStaffUsers: -1, aiCreditsPerMonth: 200 },
    commission: 0,
    features: [
      'منتجات غير محدودة',
      'فريق غير محدود',
      '200 رصيد AI شهرياً',
      'دومين مخصص',
      'تصدير بيانات (CSV)',
      'مدير حساب مخصص',
      'عمولة منصة 0%',
      'دعم 24/7'
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;

// ─────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────
export interface IInvoice {
  _id?: mongoose.Types.ObjectId;
  invoiceNumber: string;        // INV-2026-00001
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  description: string;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  paidAt?: Date;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: Date;
}

export interface ISubscription extends Document {
  merchantId: mongoose.Types.ObjectId;
  plan: PlanId;
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  status: 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired';
  startDate: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  autoRenew: boolean;
  invoices: IInvoice[];
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// SCHEMA
// ─────────────────────────────────────────────
const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'EGP' },
    status: {
      type: String,
      enum: ['paid', 'pending', 'failed', 'refunded'],
      default: 'pending',
    },
    description: { type: String, required: true },
    billingPeriodStart: { type: Date, required: true },
    billingPeriodEnd: { type: Date, required: true },
    paidAt: Date,
    paymentMethod: String,
    transactionId: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const subscriptionSchema = new Schema<ISubscription>(
  {
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
      unique: true,           // واحد لكل متجر
      index: true,
    },
    plan: {
      type: String,
      enum: ['free_trial', 'starter', 'professional', 'business'],
      required: true,
      index: true,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'EGP' },
    status: {
      type: String,
      enum: ['trialing', 'active', 'past_due', 'cancelled', 'expired'],
      default: 'trialing',
      index: true,
    },
    startDate: { type: Date, required: true, default: Date.now },
    currentPeriodStart: { type: Date, required: true, default: Date.now },
    currentPeriodEnd: { type: Date, required: true },
    cancelledAt: Date,
    cancellationReason: String,
    autoRenew: { type: Boolean, default: true },
    invoices: [invoiceSchema],
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** توليد رقم فاتورة فريد */
subscriptionSchema.statics.generateInvoiceNumber = async function (): Promise<string> {
  const year = new Date().getFullYear();
  const count = await this.aggregate([
    { $unwind: '$invoices' },
    { $count: 'total' },
  ]);
  const seq = String((count[0]?.total || 0) + 1).padStart(5, '0');
  return `INV-${year}-${seq}`;
};

const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;
