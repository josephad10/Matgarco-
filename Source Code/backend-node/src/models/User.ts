import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types';

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  
  // Profile
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  
  // Staff
  staffRole?: string;        // template: 'owner' | 'manager' | 'staff' | 'accountant' | custom
  staffRoleLabel?: string;   // display name (custom label)
  permissions?: Record<string, boolean>;
  
  // Relations
  merchantId?: mongoose.Types.ObjectId;
  
  // Auth
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshToken?: string;
  
  // OAuth
  googleId?: string;
  facebookId?: string;
  
  // Meta
  lastLogin?: Date;
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['super_admin', 'merchant_owner', 'merchant_staff', 'customer'],
      default: 'customer',
      index: true,
    },
    
    // Profile
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
    avatar: {
      type: String,
    },
    
    // Staff
    staffRole: {
      type: String,
      default: 'owner',
    },
    staffRoleLabel: {
      type: String,
    },
    permissions: {
      type: Schema.Types.Mixed,
      default: {},
    },
    
    // Relations
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      index: true,
    },
    
    // Auth
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    
    // OAuth
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    
    // Meta
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
