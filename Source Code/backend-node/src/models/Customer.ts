import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  merchantId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // If registered user
  
  // Basic Info
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  
  // Addresses
  addresses: Array<{
    _id: mongoose.Types.ObjectId;
    label: string;
    isDefault: boolean;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }>;
  
  // Stats
  stats: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
  };
  
  // Marketing
  acceptsMarketing: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    
    // Basic Info
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    
    // Addresses
    addresses: [
      {
        label: {
          type: String,
          required: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
        street: String,
        city: String,
        state: String,
        country: {
          type: String,
          default: 'Egypt',
        },
        postalCode: String,
      },
    ],
    
    // Stats
    stats: {
      totalOrders: {
        type: Number,
        default: 0,
      },
      totalSpent: {
        type: Number,
        default: 0,
      },
      averageOrderValue: {
        type: Number,
        default: 0,
      },
      lastOrderDate: Date,
    },
    
    // Marketing
    acceptsMarketing: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique email per merchant
customerSchema.index({ merchantId: 1, email: 1 });

// Virtual for full name
customerSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

const Customer = mongoose.model<ICustomer>('Customer', customerSchema);

export default Customer;
