import mongoose, { Document, Schema } from 'mongoose';
import { OrderStatus, PaymentStatus, FulfillmentStatus } from '../types';

interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  productImage?: string;
  variantId?: mongoose.Types.ObjectId;
  variantName?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface IAddress {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface ITimelineEvent {
  status: string;
  timestamp: Date;
  note?: string;
}

export interface IOrder extends Document {
  merchantId: mongoose.Types.ObjectId;
  orderNumber: string;
  
  // Customer
  customerId?: mongoose.Types.ObjectId;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  
  // Items
  items: IOrderItem[];
  
  // Pricing
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  
  // Addresses
  shippingAddress: IAddress;
  billingAddress?: IAddress;
  
  // Status
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  
  // Payment
  paymentMethod: 'cash' | 'card' | 'paymob' | 'wallet';
  paymentGateway?: string;
  paymentTransactionId?: string;
  
  // Platform Commission
  platformCommission: {
    percentage: number;
    amount: number;
  };

  // Payout / Settlement (Aggregator model)
  paymobFee: number;              // ~2% رسوم Paymob
  matgarcoFee: number;            // عمولة Matgarco (1/2/3%)
  merchantNet: number;            // صافي ما يستلمه التاجر
  usesMerchantPaymob: boolean;    // Business plan: يستخدم Paymob الخاص
  payoutStatus: 'pending' | 'included_in_payout' | 'paid';
  payoutId?: mongoose.Types.ObjectId;  // ref: MerchantPayout
  
  // Shipping
  shippingMethod?: string;
  trackingNumber?: string;
  shippingProvider?: string;
  
  // Notes
  customerNotes?: string;
  merchantNotes?: string;
  
  // Timeline
  timeline: ITimelineEvent[];
  
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    
    // Customer
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      index: true,
    },
    customerInfo: {
      email: {
        type: String,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    
    // Items
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        productImage: String,
        variantId: Schema.Types.ObjectId,
        variantName: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    
    // Pricing
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    
    // Addresses
    shippingAddress: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: String,
      country: {
        type: String,
        default: 'Egypt',
      },
      postalCode: String,
    },
    billingAddress: {
      firstName: String,
      lastName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    
    // Status
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    fulfillmentStatus: {
      type: String,
      enum: ['unfulfilled', 'partial', 'fulfilled'],
      default: 'unfulfilled',
    },
    
    // Payment
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'paymob', 'wallet'],
      required: true,
    },
    paymentGateway: String,
    paymentTransactionId: String,
    
    // Platform Commission
    platformCommission: {
      percentage: { type: Number, default: 0 },
      amount: { type: Number, default: 0 },
    },

    // Payout / Settlement
    paymobFee: { type: Number, default: 0 },
    matgarcoFee: { type: Number, default: 0 },
    merchantNet: { type: Number, default: 0 },
    usesMerchantPaymob: { type: Boolean, default: false },
    payoutStatus: {
      type: String,
      enum: ['pending', 'included_in_payout', 'paid'],
      default: 'pending',
      index: true,
    },
    payoutId: { type: Schema.Types.ObjectId, ref: 'MerchantPayout' },
    
    // Shipping
    shippingMethod: String,
    trackingNumber: String,
    shippingProvider: String,
    
    // Notes
    customerNotes: String,
    merchantNotes: String,
    
    // Timeline
    timeline: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add initial timeline event
orderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.timeline.push({
      status: 'Order Created',
      timestamp: new Date(),
      note: 'Order has been placed',
    });
  }
  next();
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
