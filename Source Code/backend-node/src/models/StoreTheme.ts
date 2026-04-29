import mongoose, { Schema, Document } from 'mongoose';
import { IThemeSection } from './Theme';

export interface IStoreTheme extends Document {
  merchantId: mongoose.Types.ObjectId;
  themeId: mongoose.Types.ObjectId;
  name: string;
  isActive: boolean;
  
  // Merchant specific overrides
  globalSettings: {
    colors: Record<string, string>;
    typography: Record<string, string>;
    layout?: Record<string, string>;
  };
  
  // Merchant customized pages structure
  pages: Record<string, { sections: IThemeSection[] }>;
  
  createdAt: Date;
  updatedAt: Date;
}

const storeThemeSchema = new Schema({
  merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true, index: true },
  themeId: { type: Schema.Types.ObjectId, ref: 'Theme', required: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  
  globalSettings: {
    colors: {
      type: Map,
      of: String,
      default: {}
    },
    typography: {
      type: Map,
      of: String,
      default: {}
    },
    layout: {
      type: Map,
      of: String,
      default: {}
    }
  },
  
  pages: {
    type: Map,
    of: new Schema({
      sections: [{
        id: { type: String, required: true },
        type: { type: String, required: true },
        enabled: { type: Boolean, default: true },
        settings: { type: Schema.Types.Mixed, default: {} },
        blocks: [{ type: Schema.Types.Mixed }]
      }]
    }, { _id: false }),
    default: { home: { sections: [] } }
  },
}, { timestamps: true });

export default mongoose.model<IStoreTheme>('StoreTheme', storeThemeSchema);
