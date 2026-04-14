import mongoose, { Schema, Document } from 'mongoose';

export interface IThemeSection {
  id: string;
  type: string;
  name?: string;
  enabled?: boolean;
  variant?: string;
  settings: Record<string, any>;
  blocks?: Array<{
    id: string;
    type: string;
    settings: Record<string, any>;
  }>;
}

export interface ITheme extends Document {
  name: string;
  slug: string;
  description: string;
  version: string;
  changelog: string;
  previousVersions?: Array<{
    version: string;
    releasedAt: Date;
    changelog?: string;
  }>;
  category: 'general' | 'fashion' | 'electronics' | 'food' | 'digital' | 'services';
  thumbnail: string;
  screenshots: string[];
  allowedPlans: string[];
  isPremium: boolean;
  merchantCount: number;
  
  // Advanced Theme Engine Base Schemas
  globalSettings: {
    colors: Record<string, string>;
    typography: Record<string, string>;
    layout?: Record<string, string>;
  };
  pages: Record<string, { sections: IThemeSection[] }>;

  status: 'active' | 'maintenance' | 'draft';
  isBuiltIn: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const themeSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    version: { type: String, default: '1.0.0' },
    changelog: { type: String, default: '' },
    previousVersions: [
      {
        version: { type: String, required: true },
        releasedAt: { type: Date, required: true },
        changelog: { type: String, default: '' },
      },
    ],
    category: {
      type: String,
      enum: ['general', 'fashion', 'electronics', 'food', 'digital', 'services'],
      default: 'general'
    },
  thumbnail: { type: String, default: 'https://picsum.photos/seed/theme/600/400' },
    screenshots: [{ type: String }],
    allowedPlans: [{
      type: String,
      enum: ['free_trial', 'starter', 'professional', 'business']
    }],
    isPremium: { type: Boolean, default: false },
    merchantCount: { type: Number, default: 0 },
    
    // Engine Config Base
    globalSettings: { type: Schema.Types.Mixed, default: { colors: {}, typography: {} } },
    pages: { type: Schema.Types.Mixed, default: { home: { sections: [] } } },
    
    status: {
      type: String,
      enum: ['active', 'maintenance', 'draft'],
      default: 'active'
    },
    isBuiltIn: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<ITheme>('Theme', themeSchema);
