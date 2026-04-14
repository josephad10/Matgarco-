/**
 * Seed Script — Converts the 6 hardcoded template defaults into Theme documents.
 * 
 * Run with: npx ts-node src/scripts/seedThemes.ts
 * Or:       npx tsx src/scripts/seedThemes.ts
 * 
 * This is idempotent: if a theme with the same slug already exists, it will be updated.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// ─── Theme Schema (inline to avoid import issues) ─────────────────────────────
const themeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    version: { type: String, default: '1.0.0' },
    changelog: { type: String, default: '' },
    category: {
      type: String,
      enum: ['general', 'fashion', 'electronics', 'food', 'digital', 'services'],
      default: 'general',
    },
    thumbnail: { type: String, default: '' },
    screenshots: [{ type: String }],
    allowedPlans: [{ type: String }],
    isPremium: { type: Boolean, default: false },
    merchantCount: { type: Number, default: 0 },
    globalSettings: { type: mongoose.Schema.Types.Mixed, default: {} },
    pages: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ['active', 'maintenance', 'draft'], default: 'active' },
    isBuiltIn: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Theme = mongoose.models.Theme || mongoose.model('Theme', themeSchema);

// ─── Default sections for every template ──────────────────────────────────────
const DEFAULT_SECTIONS = [
  { id: 'announcement_bar',  type: 'announcement_bar',  enabled: true,  settings: { text: '🎉 مرحباً بك في متجرنا! شحن مجاني على الطلبات فوق 200 جنيه' } },
  { id: 'hero',              type: 'hero',              enabled: true,  settings: { title: 'مرحباً بك', subtitle: 'اكتشف أحدث المنتجات', buttonText: 'تسوق الآن', buttonLink: '/products' } },
  { id: 'featured_products', type: 'featured_products', enabled: true,  settings: { title: 'منتجات مميزة', limit: 8 } },
  { id: 'categories_grid',   type: 'categories_grid',   enabled: true,  settings: { title: 'تسوق حسب الفئة', style: '3col' } },
  { id: 'promo_banner',      type: 'promo_banner',      enabled: false, settings: {} },
  { id: 'new_arrivals',      type: 'new_arrivals',      enabled: true,  settings: { title: 'وصل حديثاً', limit: 6 } },
  { id: 'testimonials',      type: 'testimonials',      enabled: false, settings: { title: 'ماذا يقول عملاؤنا' } },
  { id: 'trust_badges',      type: 'trust_badges',      enabled: true,  settings: { badges: ['shipping', 'guarantee', 'secure', 'support'] } },
  { id: 'newsletter',        type: 'newsletter',        enabled: false, settings: { title: 'اشترك في نشرتنا', subtitle: 'احصل على أحدث العروض', placeholder: 'بريدك الإلكتروني', buttonText: 'اشترك' } },
];

// ─── The 6 Templates ──────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    name: 'Spark',
    slug: 'spark',
    description: 'قالب عصري وحديث بألوان زرقاء مريحة. مناسب لكل أنواع المتاجر.',
    category: 'general',
    isPremium: false,
    allowedPlans: ['free_trial', 'starter', 'professional', 'business'],
    globalSettings: {
      colors: { primary: '#3B82F6', secondary: '#1E40AF', background: '#F8FAFC', surface: '#FFFFFF', text: '#111827', textMuted: '#6B7280', accent: '#10B981', border: '#E5E7EB' },
      typography: { headingFont: 'Cairo', fontFamily: 'Cairo', fontSize: 'md' },
      layout: { direction: 'rtl', language: 'ar' },
    },
  },
  {
    name: 'Volt',
    slug: 'volt',
    description: 'قالب داكن وجريء بألوان نيون. مثالي لمتاجر التقنية والألعاب.',
    category: 'electronics',
    isPremium: false,
    allowedPlans: ['free_trial', 'starter', 'professional', 'business'],
    globalSettings: {
      colors: { primary: '#7C3AED', secondary: '#5B21B6', background: '#0A0A0A', surface: '#1A1A1A', text: '#FFFFFF', textMuted: '#9CA3AF', accent: '#00FF88', border: '#2D2D2D' },
      typography: { headingFont: 'Cairo', fontFamily: 'Cairo', fontSize: 'md' },
      layout: { direction: 'rtl', language: 'ar' },
    },
  },
  {
    name: 'Epure',
    slug: 'epure',
    description: 'قالب أنيق وهادئ بألوان ترابية دافئة. مثالي لمتاجر الأزياء والمجوهرات.',
    category: 'fashion',
    isPremium: true,
    allowedPlans: ['professional', 'business'],
    globalSettings: {
      colors: { primary: '#8B4513', secondary: '#A0522D', background: '#FAF7F4', surface: '#FFFFFF', text: '#2C1810', textMuted: '#8B7355', accent: '#D4956A', border: '#E8DDD5' },
      typography: { headingFont: 'Tajawal', fontFamily: 'Tajawal', fontSize: 'md' },
      layout: { direction: 'rtl', language: 'ar' },
    },
  },
  {
    name: 'Bloom',
    slug: 'bloom',
    description: 'قالب ناعم وأنيق بألوان وردية. مثالي لمتاجر العطور والتجميل.',
    category: 'fashion',
    isPremium: true,
    allowedPlans: ['professional', 'business'],
    globalSettings: {
      colors: { primary: '#EC4899', secondary: '#DB2777', background: '#FFFFFF', surface: '#FFF7F9', text: '#1F2937', textMuted: '#9CA3AF', accent: '#D4A574', border: '#FCE7F3' },
      typography: { headingFont: 'Tajawal', fontFamily: 'Cairo', fontSize: 'md' },
      layout: { direction: 'rtl', language: 'ar' },
    },
  },
  {
    name: 'Noir',
    slug: 'noir',
    description: 'قالب فاخر بألوان ذهبية على أسود. مثالي للعلامات التجارية الفاخرة.',
    category: 'fashion',
    isPremium: true,
    allowedPlans: ['business'],
    globalSettings: {
      colors: { primary: '#C9A84C', secondary: '#A37C28', background: '#111111', surface: '#1C1C1C', text: '#F5F5F0', textMuted: '#8B8B7A', accent: '#C9A84C', border: '#2A2A2A' },
      typography: { headingFont: 'Tajawal', fontFamily: 'Cairo', fontSize: 'md' },
      layout: { direction: 'rtl', language: 'ar' },
    },
  },
  {
    name: 'Mosaic',
    slug: 'mosaic',
    description: 'قالب حيوي وملون. مثالي لمتاجر الطعام والمنتجات اليدوية.',
    category: 'food',
    isPremium: false,
    allowedPlans: ['free_trial', 'starter', 'professional', 'business'],
    globalSettings: {
      colors: { primary: '#FF6B6B', secondary: '#EE5A24', background: '#FFFBF5', surface: '#FFFFFF', text: '#2C2C2C', textMuted: '#7F8C8D', accent: '#4ECDC4', border: '#FFE0CC' },
      typography: { headingFont: 'Tajawal', fontFamily: 'Cairo', fontSize: 'md' },
      layout: { direction: 'rtl', language: 'ar' },
    },
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/matgarco';
  console.log('Connecting to MongoDB:', mongoUri);
  
  await mongoose.connect(mongoUri);
  console.log('Connected!\n');

  let created = 0;
  let updated = 0;

  for (const tmpl of TEMPLATES) {
    const existing = await Theme.findOne({ slug: tmpl.slug });
    if (existing) {
      existing.globalSettings = tmpl.globalSettings;
      existing.pages = { home: { sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)) } };
      existing.description = tmpl.description;
      existing.category = tmpl.category;
      existing.isPremium = tmpl.isPremium;
      existing.allowedPlans = tmpl.allowedPlans;
      existing.name = tmpl.name;
      await existing.save();
      console.log(`Updated "${tmpl.name}" (${tmpl.slug})`);
      updated++;
      continue;
    }

    await Theme.create({
      name: tmpl.name,
      slug: tmpl.slug,
      description: tmpl.description,
      version: '1.0.0',
      category: tmpl.category,
      isPremium: tmpl.isPremium,
      allowedPlans: tmpl.allowedPlans,
      isBuiltIn: true,
      status: 'active',
      globalSettings: tmpl.globalSettings,
      pages: {
        home: { sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)) },
      },
    });

    console.log(`Created "${tmpl.name}" (${tmpl.slug}) [${tmpl.isPremium ? 'Premium' : 'Free'}]`);
    created++;
  }

  console.log(`\nResults: ${created} created, ${updated} updated`);
  console.log(`Total themes in DB: ${await Theme.countDocuments()}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
