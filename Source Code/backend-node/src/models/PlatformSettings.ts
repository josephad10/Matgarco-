import mongoose, { Schema, Document } from 'mongoose';

export interface IPlatformSettings extends Document {
  siteName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  payment: {
    paymobApiKey: string;
    paymobIframeId: string;
    paymobHmac: string;
  };
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
  featureFlags: {
    aiEnabled: boolean;
    reviewsEnabled: boolean;
    newSignupsEnabled: boolean;
    affiliateEnabled: boolean;
  };
}

const platformSettingsSchema = new Schema(
  {
    _id: { type: String, default: 'platform_settings' },
    siteName: { type: String, default: 'Matgarco' },
    supportEmail: { type: String, default: 'support@matgarco.com' },
    maintenanceMode: { type: Boolean, default: false },
    payment: {
      paymobApiKey: { type: String, default: '' },
      paymobIframeId: { type: String, default: '' },
      paymobHmac: { type: String, default: '' }
    },
    smtp: {
      host: { type: String, default: '' },
      port: { type: Number, default: 587 },
      user: { type: String, default: '' },
      pass: { type: String, default: '' }
    },
    featureFlags: {
      aiEnabled: { type: Boolean, default: true },
      reviewsEnabled: { type: Boolean, default: true },
      newSignupsEnabled: { type: Boolean, default: true },
      affiliateEnabled: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IPlatformSettings>('PlatformSettings', platformSettingsSchema);
