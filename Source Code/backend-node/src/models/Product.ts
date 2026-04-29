import mongoose, { Document, Schema } from 'mongoose';
import { ProductStatus } from '../types';

interface IProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

interface IProductAttribute {
  key: string;
  value: string;
}

interface IProductVariant {
  _id: mongoose.Types.ObjectId;
  name: string;
  sku?: string;
  price?: number;
  quantity?: number;
  attributes: IProductAttribute[];
}

export interface IProduct extends Document {
  merchantId: mongoose.Types.ObjectId;
  
  // Basic Info
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  
  // Pricing
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  
  // Inventory
  sku?: string;
  barcode?: string;
  trackQuantity: boolean;
  quantity?: number;
  lowStockThreshold?: number;
  
  // Media
  images: IProductImage[];
  
  // Organization
  category?: string;
  tags?: string[];
  
  // Variants
  hasVariants: boolean;
  variants?: IProductVariant[];
  
  // SEO
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  
  // Status
  status: ProductStatus;
  isVisible: boolean;
  isFeatured: boolean;
  
  // AI Generated
  aiGenerated: {
    description: boolean;
    seo: boolean;
  };
  
  // Stats
  views: number;
  sales: number;
  averageRating?: number;
  reviewCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
      index: true,
    },
    
    // Basic Info
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    
    // Pricing
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    costPerItem: {
      type: Number,
      min: 0,
    },
    
    // Inventory
    sku: {
      type: String,
      trim: true,
    },
    barcode: {
      type: String,
      trim: true,
    },
    trackQuantity: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    
    // Media
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    
    // Organization
    category: {
      type: String,
      index: true,
    },
    tags: [String],
    
    // Variants
    hasVariants: {
      type: Boolean,
      default: false,
    },
    variants: [
      {
        name: String,
        sku: String,
        price: Number,
        quantity: Number,
        attributes: [
          {
            key: { type: String, required: true },
            value: { type: String, required: true },
          },
        ],
      },
    ],
    
    // SEO
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    
    // Status
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'draft',
      index: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    
    // AI Generated
    aiGenerated: {
      description: {
        type: Boolean,
        default: false,
      },
      seo: {
        type: Boolean,
        default: false,
      },
    },
    
    // Stats
    views: {
      type: Number,
      default: 0,
    },
    sales: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(_doc, ret) {
        // Map quantity to stock for frontend compatibility
        (ret as any).stock = ret.quantity;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function(_doc, ret) {
        (ret as any).stock = ret.quantity;
        return ret;
      }
    }
  }
);

// Compound index for unique slug per merchant
productSchema.index({ merchantId: 1, slug: 1 }, { unique: true });

// Ensure at least one image is primary
productSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0) {
    const hasPrimary = this.images.some(img => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }
  next();
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
