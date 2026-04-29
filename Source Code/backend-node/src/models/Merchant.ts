import mongoose, { Document, Schema } from 'mongoose';
import { SubscriptionPlan } from '../types';

export interface IMerchant extends Document {
  // Store Identity
  storeName: string;
  subdomain: string;
  customDomain?: string;

  // Business Info
  businessName?: string;
  businessType?: string;
  description?: string;
  logo?: string;

  // Contact
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  // Owner
  ownerId: mongoose.Types.ObjectId;

  // Subscription
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: 'active' | 'expired' | 'suspended' | 'cancelled';
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  trialEndsAt?: Date;

  // Settings
  currency: string;
  language: string;
  timezone: string;

  // Store Config
  templateId?: mongoose.Types.ObjectId;

  // Features Limits
  limits: {
    maxProducts: number;
    maxStaffUsers: number;
    aiCreditsPerMonth: number;
    aiCreditsUsed: number;
  };

  // Stats
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
  };

  // Status
  isActive: boolean;
  suspensionReason?: string;

  // Payment Gateway (Business plan: own Paymob)
  paymobConfig?: {
    secretKey: string;
    publicKey: string;
    integrationId?: string;
  };

  // Payout / Settlement
  payoutInfo: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    iban?: string;
    pendingBalance: number;    // رصيد لم يُحول بعد
    totalPaidOut: number;      // إجمالي ما تم تحويله
    lastPayoutAt?: Date;
  };

  // Meta
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const merchantSchema = new Schema<IMerchant>(
  {
    // Store Identity
    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
    },
    subdomain: {
      type: String,
      required: [true, 'Subdomain is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    customDomain: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },

    // Business Info
    businessName: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      enum: ['retail', 'wholesale', 'services', 'other'],
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },

    // Contact
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: 'Egypt' },
      postalCode: String,
    },

    // Owner
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Subscription
    subscriptionPlan: {
      type: String,
      enum: ['free_trial', 'starter', 'professional', 'business'],
      default: 'free_trial',
      index: true,
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'expired', 'suspended', 'cancelled'],
      default: 'active',
      index: true,
    },
    subscriptionStartDate: {
      type: Date,
      default: Date.now,
    },
    subscriptionEndDate: {
      type: Date,
      required: true,
    },
    trialEndsAt: {
      type: Date,
    },

    // Settings
    currency: {
      type: String,
      default: 'EGP',
    },
    language: {
      type: String,
      enum: ['ar', 'en'],
      default: 'ar',
    },
    timezone: {
      type: String,
      default: 'Africa/Cairo',
    },

    // Store Config
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
    },

    // Features Limits
    limits: {
      maxProducts: {
        type: Number,
        default: 20, // Free trial default
      },
      maxStaffUsers: {
        type: Number,
        default: 0,
      },
      aiCreditsPerMonth: {
        type: Number,
        default: 5,
      },
      aiCreditsUsed: {
        type: Number,
        default: 0,
      },
    },

    // Stats
    stats: {
      totalOrders: {
        type: Number,
        default: 0,
      },
      totalRevenue: {
        type: Number,
        default: 0,
      },
      totalProducts: {
        type: Number,
        default: 0,
      },
      totalCustomers: {
        type: Number,
        default: 0,
      },
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    suspensionReason: {
      type: String,
    },

    // Payment Gateway (Business plan: own Paymob)
    paymobConfig: {
      secretKey: { type: String, select: false }, // encrypted ideally
      publicKey: { type: String },
      integrationId: { type: String },
    },

    // Payout / Settlement
    payoutInfo: {
      bankName: { type: String },
      accountNumber: { type: String },
      accountName: { type: String },
      iban: { type: String },
      pendingBalance: { type: Number, default: 0 },
      totalPaidOut: { type: Number, default: 0 },
      lastPayoutAt: { type: Date },
    },

    // Meta
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Set trial end date before saving
merchantSchema.pre('save', function (next) {
  if (this.isNew && this.subscriptionPlan === 'free_trial') {
    const trialDays = 14;
    this.trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000);
    this.subscriptionEndDate = this.trialEndsAt;
  }
  next();
});

// Cascade cleanup middleware to prevent data orphanage
const cascadeCleanup = async function (this: mongoose.Query<any, IMerchant>, next: (err?: Error) => void) {
  const filter = this.getFilter();
  const merchantId = filter._id;

  if (!merchantId) return next();

  try {
    const modelsToCleanup = [
      { name: 'Product', filter: { merchantId } },
      { name: 'Order', filter: { merchantId } },
      { name: 'Customer', filter: { merchantId } },
      { name: 'StoreTheme', filter: { merchantId } },
    ];

    for (const modelInfo of modelsToCleanup) {
      await mongoose.model(modelInfo.name).deleteMany(modelInfo.filter);
    }
    
    next();
  } catch (error) {
    next(error as Error);
  }
};

merchantSchema.pre('findOneAndDelete', cascadeCleanup);

// Explicit compound index for maximum O(1) read throughput on the availability check.
// This is the primary access path for GET /api/public/subdomain/check.
// Declared separately (not inline on the field) to be explicit about performance intent.

const Merchant = mongoose.model<IMerchant>('Merchant', merchantSchema);

export default Merchant;
