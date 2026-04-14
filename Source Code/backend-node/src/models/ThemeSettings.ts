/**
 * @deprecated — This model has been replaced by Theme + StoreTheme.
 * 
 * DO NOT IMPORT THIS FILE in new code.
 * 
 * The new system:
 *   - Theme (models/Theme.ts)      → Base themes managed by Super Admin
 *   - StoreTheme (models/StoreTheme.ts) → Merchant's customised copy
 *
 * This file is kept only so Mongoose doesn't error if the old collection
 * still exists in the database. It will be deleted once all data is migrated.
 */
import mongoose, { Document, Schema } from 'mongoose';

// ─── Section config ───────────────────────────────────────────────────────────
export interface ISection {
  id: string;
  enabled: boolean;
  order: number;
  config: Record<string, unknown>;
}

// ─── Full theme shape ─────────────────────────────────────────────────────────
export interface IThemeData {
  templateId: string;

  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    accent: string;
    border: string;
  };

  fonts: {
    heading: string;
    body: string;
    size: 'sm' | 'md' | 'lg';
  };

  header: {
    style: 'centered' | 'split' | 'minimal' | 'sticky';
    showSearch: boolean;
    showCart: boolean;
    showWishlist: boolean;
  };

  productCard: {
    style: 'classic' | 'overlay' | 'minimal' | 'bordered';
    showRating: boolean;
    showBadges: boolean;
    showQuickAdd: boolean;
  };

  footer: {
    style: 'full' | 'minimal' | 'centered';
    showSocial: boolean;
    showNewsletter: boolean;
  };

  seo: {
    title: string;
    description: string;
    keywords: string;
    favicon: string;
    ogImage: string;
    googleAnalyticsId: string;
    facebookPixelId: string;
  };

  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
    whatsapp: string;
    twitter: string;
    youtube: string;
  };

  store: {
    logo: string;
    tagline: string;
    currency: string;
    language: 'ar' | 'en';
    direction: 'rtl' | 'ltr';
    announcementBar: {
      enabled: boolean;
      text: string;
      bgColor: string;
      textColor: string;
    };
  };

  sections: ISection[];
}

// ─── Document shape ───────────────────────────────────────────────────────────
export interface IThemeSettings extends Document {
  merchantId: mongoose.Types.ObjectId;
  published: IThemeData;
  draft: IThemeData;
  hasUnpublishedChanges: boolean;
  lastPublishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Default sections for every template ─────────────────────────────────────
export const DEFAULT_SECTIONS: ISection[] = [
  { id: 'announcement_bar',  enabled: true,  order: 1, config: { text: '🎉 مرحباً بك في متجرنا! شحن مجاني على الطلبات فوق 200 جنيه', bgColor: '', textColor: '' } },
  { id: 'hero',              enabled: true,  order: 2, config: { style: 'fullscreen', title: 'مرحباً بك', subtitle: 'اكتشف أحدث المنتجات', ctaText: 'تسوق الآن', ctaLink: '/products', image: '' } },
  { id: 'featured_products', enabled: true,  order: 3, config: { title: 'منتجات مميزة', style: 'grid', limit: 8 } },
  { id: 'categories_grid',   enabled: true,  order: 4, config: { title: 'تسوق حسب الفئة', style: '3col' } },
  { id: 'promo_banner',      enabled: false, order: 5, config: { title: '', subtitle: '', ctaText: '', ctaLink: '', image: '', bgColor: '' } },
  { id: 'new_arrivals',      enabled: true,  order: 6, config: { title: 'وصل حديثاً', limit: 6 } },
  { id: 'testimonials',      enabled: false, order: 7, config: { title: 'ماذا يقول عملاؤنا', style: 'cards' } },
  { id: 'trust_badges',      enabled: true,  order: 8, config: { badges: ['shipping', 'guarantee', 'secure', 'support'] } },
  { id: 'newsletter',        enabled: false, order: 9, config: { title: 'اشترك في نشرتنا', subtitle: 'احصل على أحدث العروض', placeholder: 'بريدك الإلكتروني', buttonText: 'اشترك' } },
];

// ─── Template defaults ────────────────────────────────────────────────────────
export const TEMPLATE_DEFAULTS: Record<string, Partial<IThemeData>> = {
  spark: {
    colors: { primary: '#3B82F6', secondary: '#1E40AF', background: '#F8FAFC', surface: '#FFFFFF', text: '#111827', textMuted: '#6B7280', accent: '#10B981', border: '#E5E7EB' },
    fonts: { heading: 'Cairo', body: 'Cairo', size: 'md' },
    header: { style: 'split', showSearch: true, showCart: true, showWishlist: true },
    productCard: { style: 'classic', showRating: true, showBadges: true, showQuickAdd: true },
  },
  volt: {
    colors: { primary: '#7C3AED', secondary: '#5B21B6', background: '#0A0A0A', surface: '#1A1A1A', text: '#FFFFFF', textMuted: '#9CA3AF', accent: '#00FF88', border: '#2D2D2D' },
    fonts: { heading: 'Cairo', body: 'Cairo', size: 'md' },
    header: { style: 'centered', showSearch: true, showCart: true, showWishlist: false },
    productCard: { style: 'overlay', showRating: true, showBadges: true, showQuickAdd: true },
  },
  epure: {
    colors: { primary: '#8B4513', secondary: '#A0522D', background: '#FAF7F4', surface: '#FFFFFF', text: '#2C1810', textMuted: '#8B7355', accent: '#D4956A', border: '#E8DDD5' },
    fonts: { heading: 'Tajawal', body: 'Tajawal', size: 'md' },
    header: { style: 'centered', showSearch: true, showCart: true, showWishlist: true },
    productCard: { style: 'minimal', showRating: false, showBadges: true, showQuickAdd: false },
  },
  bloom: {
    colors: { primary: '#EC4899', secondary: '#DB2777', background: '#FFFFFF', surface: '#FFF7F9', text: '#1F2937', textMuted: '#9CA3AF', accent: '#D4A574', border: '#FCE7F3' },
    fonts: { heading: 'Tajawal', body: 'Cairo', size: 'md' },
    header: { style: 'centered', showSearch: true, showCart: true, showWishlist: true },
    productCard: { style: 'classic', showRating: true, showBadges: true, showQuickAdd: true },
  },
  noir: {
    colors: { primary: '#C9A84C', secondary: '#A37C28', background: '#111111', surface: '#1C1C1C', text: '#F5F5F0', textMuted: '#8B8B7A', accent: '#C9A84C', border: '#2A2A2A' },
    fonts: { heading: 'Tajawal', body: 'Cairo', size: 'md' },
    header: { style: 'minimal', showSearch: true, showCart: true, showWishlist: false },
    productCard: { style: 'bordered', showRating: false, showBadges: true, showQuickAdd: false },
  },
  mosaic: {
    colors: { primary: '#FF6B6B', secondary: '#EE5A24', background: '#FFFBF5', surface: '#FFFFFF', text: '#2C2C2C', textMuted: '#7F8C8D', accent: '#4ECDC4', border: '#FFE0CC' },
    fonts: { heading: 'Tajawal', body: 'Cairo', size: 'md' },
    header: { style: 'split', showSearch: true, showCart: true, showWishlist: true },
    productCard: { style: 'classic', showRating: true, showBadges: true, showQuickAdd: true },
  },
};

// ─── Build a full default theme for any templateId ────────────────────────────
export function buildDefaultTheme(templateId: string, storeName: string): IThemeData {
  const tmpl = TEMPLATE_DEFAULTS[templateId] || TEMPLATE_DEFAULTS.spark;

  return {
    templateId,
    colors: tmpl.colors!,
    fonts: tmpl.fonts!,
    header: tmpl.header!,
    productCard: tmpl.productCard!,
    footer: { style: 'full', showSocial: true, showNewsletter: true },
    seo: { title: storeName, description: '', keywords: '', favicon: '', ogImage: '', googleAnalyticsId: '', facebookPixelId: '' },
    social: { facebook: '', instagram: '', tiktok: '', whatsapp: '', twitter: '', youtube: '' },
    store: { logo: '', tagline: '', currency: 'EGP', language: 'ar', direction: 'rtl', announcementBar: { enabled: false, text: '', bgColor: tmpl.colors!.primary, textColor: '#FFFFFF' } },
    sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)), // deep clone
  };
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const ThemeSettingsSchema = new Schema<IThemeSettings>(
  {
    merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true, unique: true },
    published: { type: Schema.Types.Mixed, default: {} },
    draft:     { type: Schema.Types.Mixed, default: {} },
    hasUnpublishedChanges: { type: Boolean, default: false },
    lastPublishedAt: { type: Date },
  },
  { timestamps: true }
);

export const ThemeSettings = mongoose.model<IThemeSettings>('ThemeSettings', ThemeSettingsSchema);
