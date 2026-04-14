import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
  slug: 'free_trial' | 'starter' | 'professional' | 'business';
  name: string;
  nameAr: string;
  price: number;
  yearlyPrice: number;
  commissionRate: number;
  limits: {
    maxProducts: number;
    maxStaffUsers: number;
    aiCreditsPerMonth: number;
  };
  features: string[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema(
  {
    slug: {
      type: String,
      enum: ['free_trial', 'starter', 'professional', 'business'],
      required: true,
      unique: true
    },
    name: { type: String, required: true },
    nameAr: { type: String, required: true },
    price: { type: Number, required: true },
    yearlyPrice: { type: Number, required: true },
    commissionRate: { type: Number, required: true }, // e.g. 0.03
    limits: {
      maxProducts: { type: Number, default: 100 },
      maxStaffUsers: { type: Number, default: 1 },
      aiCreditsPerMonth: { type: Number, default: 10 }
    },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model<IPlan>('Plan', planSchema);
