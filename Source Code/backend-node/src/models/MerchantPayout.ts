import mongoose, { Document, Schema } from 'mongoose';

export interface IMerchantPayout extends Document {
  merchantId: mongoose.Types.ObjectId;
  periodFrom: Date;
  periodTo: Date;
  ordersCount: number;
  grossAmount: number;       // إجمالي مبيعات الفترة
  paymobFees: number;        // ~2% رسوم Paymob
  matgarcoCommission: number;// عمولة Matgarco حسب الباقة
  netAmount: number;         // صافي التاجر بعد الخصومات
  status: 'pending' | 'processing' | 'paid' | 'failed';
  paidAt?: Date;
  transferReference?: string; // رقم إيصال التحويل البنكي
  notes?: string;
  orderIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const merchantPayoutSchema = new Schema<IMerchantPayout>(
  {
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
      index: true,
    },
    periodFrom: { type: Date, required: true },
    periodTo: { type: Date, required: true },
    ordersCount: { type: Number, default: 0 },
    grossAmount: { type: Number, default: 0 },
    paymobFees: { type: Number, default: 0 },
    matgarcoCommission: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'failed'],
      default: 'pending',
      index: true,
    },
    paidAt: Date,
    transferReference: String,
    notes: String,
    orderIds: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  },
  { timestamps: true }
);

export default mongoose.model<IMerchantPayout>('MerchantPayout', merchantPayoutSchema);
