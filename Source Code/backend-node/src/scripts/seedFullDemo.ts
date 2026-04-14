/**
 * Full Demo Seed — products, customers, orders, theme
 * Run: npm run seed:full
 *
 * Creates:
 *  - demo@matgarco.com / Demo1234        → full store with data (onboardingCompleted: true)
 *  - fresh@matgarco.com / Fresh1234      → brand-new account, merchant NOT created yet
 *    → logs in fresh@matgarco.com → Register page → /onboarding wizard
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import User from '../models/User';
import Merchant from '../models/Merchant';
import Product from '../models/Product';
import Customer from '../models/Customer';
import Order from '../models/Order';
import StoreTheme from '../models/StoreTheme';
import Theme from '../models/Theme';

dotenv.config();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slug(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function orderNum(i: number) {
  return `ORD-2026${String(i + 1).padStart(4, '0')}`;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    name: 'حذاء رياضي نايكي إير ماكس',
    description: 'حذاء رياضي مريح لممارسة الرياضة والمشي اليومي، مصنوع من مواد عالية الجودة توفر دعمًا وراحةً استثنائية.',
    shortDescription: 'حذاء رياضي مريح ومتين',
    price: 450,
    compareAtPrice: 600,
    category: 'أحذية',
    tags: ['رياضي', 'نايكي', 'أحذية'],
    quantity: 45,
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', alt: 'حذاء نايكي', isPrimary: true },
    ],
    isFeatured: true,
  },
  {
    name: 'تيشيرت قطن بريميوم',
    description: 'تيشيرت مصنوع من قطن 100% ناعم وخفيف، مناسب للاستخدام اليومي. متوفر بألوان متعددة.',
    shortDescription: 'قطن 100% ناعم وخفيف',
    price: 89,
    compareAtPrice: 120,
    category: 'ملابس',
    tags: ['تيشيرت', 'قطن', 'ملابس'],
    quantity: 120,
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', alt: 'تيشيرت', isPrimary: true },
    ],
    isFeatured: true,
  },
  {
    name: 'ساعة ذكية سامسونج جالاكسي',
    description: 'ساعة ذكية متطورة تتيح تتبع النشاط البدني، رسائل الإشعارات، ومراقبة معدل ضربات القلب.',
    shortDescription: 'ساعة ذكية متعددة المزايا',
    price: 1299,
    compareAtPrice: 1599,
    category: 'إلكترونيات',
    tags: ['ساعة', 'سامسونج', 'إلكترونيات'],
    quantity: 18,
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', alt: 'ساعة ذكية', isPrimary: true },
    ],
    isFeatured: true,
  },
  {
    name: 'حقيبة جلد طبيعي يدوية',
    description: 'حقيبة يد أنيقة مصنوعة يدويًا من الجلد الطبيعي، تتميز بمتانتها وأناقتها الفريدة التي تجعلها مثالية لكل المناسبات.',
    shortDescription: 'جلد طبيعي صناعة يدوية',
    price: 750,
    compareAtPrice: 950,
    category: 'حقائب',
    tags: ['حقيبة', 'جلد', 'يدوية'],
    quantity: 12,
    images: [
      { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', alt: 'حقيبة جلد', isPrimary: true },
    ],
    isFeatured: false,
  },
  {
    name: 'عطر أود الملكي 100مل',
    description: 'عطر فاخر بعبق العود الأصيل المستخلص من أجود أنواع الخشب، يمنحك جاذبية وثقة استثنائية.',
    shortDescription: 'عطر عود فاخر طويل الأمد',
    price: 320,
    compareAtPrice: 420,
    category: 'عطور',
    tags: ['عطر', 'عود', 'فاخر'],
    quantity: 30,
    images: [
      { url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600', alt: 'عطر عود', isPrimary: true },
    ],
    isFeatured: false,
  },
  {
    name: 'سماعات لاسلكية بلوتوث',
    description: 'سماعات لاسلكية بتقنية إلغاء الضجيج النشط، بطارية تدوم 30 ساعة، وجودة صوت استثنائية.',
    shortDescription: 'صوت نقي وبطارية 30 ساعة',
    price: 699,
    compareAtPrice: 899,
    category: 'إلكترونيات',
    tags: ['سماعات', 'بلوتوث', 'إلكترونيات'],
    quantity: 25,
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', alt: 'سماعات', isPrimary: true },
    ],
    isFeatured: true,
  },
  {
    name: 'بلوزة كاجوال نسائية',
    description: 'بلوزة أنيقة مناسبة للعمل والخروجات اليومية، خامة مريحة لا تتجعد.',
    shortDescription: 'أنيقة ومريحة طوال اليوم',
    price: 145,
    compareAtPrice: null,
    category: 'ملابس',
    tags: ['بلوزة', 'نسائي', 'كاجوال'],
    quantity: 65,
    images: [
      { url: 'https://images.unsplash.com/photo-1485518882345-15568b007407?w=600', alt: 'بلوزة', isPrimary: true },
    ],
    isFeatured: false,
  },
  {
    name: 'كريم مرطب هيالورونيك',
    description: 'كريم ترطيب مكثف يحتوي على هيالورونيك آسيد بتركيز عالي، يمنح البشرة نضارةً وترطيبًا طويل الأمد.',
    shortDescription: 'ترطيب مكثف 24 ساعة',
    price: 185,
    compareAtPrice: 220,
    category: 'عناية',
    tags: ['كريم', 'عناية', 'بشرة'],
    quantity: 80,
    images: [
      { url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600', alt: 'كريم', isPrimary: true },
    ],
    isFeatured: false,
  },
  {
    name: 'حذاء كعب عالي أنيق',
    description: 'حذاء بكعب عالي أنيق مصنوع من الجلد الناعم، مريح للارتداء ومثالي للمناسبات الرسمية والسهرات.',
    shortDescription: 'أناقة وراحة في خطوة',
    price: 395,
    compareAtPrice: 499,
    category: 'أحذية',
    tags: ['حذاء', 'كعب', 'نسائي'],
    quantity: 20,
    images: [
      { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600', alt: 'حذاء كعب', isPrimary: true },
    ],
    isFeatured: false,
  },
  {
    name: 'نظارة شمسية ريبان كلاسيك',
    description: 'نظارة شمسية بإطار كلاسيكي وعدسات بحماية UV400 عالية، تجمع بين الأناقة والحماية الفعّالة.',
    shortDescription: 'حماية UV400 وأناقة دائمة',
    price: 280,
    compareAtPrice: 350,
    category: 'إكسسوارات',
    tags: ['نظارة', 'شمسية', 'ريبان'],
    quantity: 35,
    images: [
      { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', alt: 'نظارة شمسية', isPrimary: true },
    ],
    isFeatured: true,
  },
];

const CUSTOMERS_DATA = [
  { firstName: 'أحمد',  lastName: 'محمد',    email: 'ahmed.m@test.com',    phone: '01012345678', city: 'القاهرة',    country: 'EG' },
  { firstName: 'سارة',  lastName: 'علي',     email: 'sara.ali@test.com',   phone: '01123456789', city: 'الإسكندرية', country: 'EG' },
  { firstName: 'محمود', lastName: 'حسن',     email: 'mhmd.h@test.com',     phone: '01234567890', city: 'الجيزة',     country: 'EG' },
  { firstName: 'فاطمة', lastName: 'إبراهيم', email: 'fatema.i@test.com',   phone: '01098765432', city: 'طنطا',       country: 'EG' },
  { firstName: 'عمر',   lastName: 'خالد',    email: 'omar.kh@test.com',    phone: '01587654321', city: 'المنصورة',   country: 'EG' },
  { firstName: 'منى',   lastName: 'سامي',    email: 'mona.sam@test.com',   phone: '01234012345', city: 'أسيوط',      country: 'EG' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await connectDatabase();
    console.log('\n🌱  Seeding full demo data...\n');

    // ── 1. Demo Merchant (full data account) ─────────────────────────────────

    let demoUser = await User.findOne({ email: 'demo@matgarco.com' });
    if (!demoUser) {
      demoUser = await User.create({
        email: 'demo@matgarco.com',
        password: 'Demo1234',
        firstName: 'متجر',
        lastName: 'التجريبي',
        role: 'merchant_owner',
        emailVerified: true,
        isActive: true,
      });
      console.log('✅  Demo user created');
    }

    let demoMerchant = await Merchant.findOne({ ownerId: demoUser._id });
    if (!demoMerchant) {
      const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      demoMerchant = await Merchant.create({
        storeName: 'متجر النخبة',
        subdomain: 'demo-store',
        businessName: 'النخبة للتجارة',
        description: 'أفضل منتجات الموضة والإلكترونيات بأسعار منافسة',
        email: 'demo@matgarco.com',
        phone: '01000000000',
        ownerId: demoUser._id,
        subscriptionPlan: 'professional',
        subscriptionStatus: 'active',
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        trialEndsAt: trialEnd,
        currency: 'EGP',
        language: 'ar',
        timezone: 'Africa/Cairo',
        isActive: true,
        onboardingCompleted: true,
        limits: { maxProducts: 1000, maxStaffUsers: 5, aiCreditsPerMonth: 50, aiCreditsUsed: 0 },
        stats: { totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalCustomers: 0 },
      });
      demoUser.merchantId = demoMerchant._id as any;
      await demoUser.save();
      console.log('✅  Demo merchant created: demo-store.matgarco.com');
    }

    const merchantId = demoMerchant._id;

    // ── 2. Clear old demo products / orders / customers ──────────────────────
    await Product.deleteMany({ merchantId });
    await Order.deleteMany({ merchantId });
    await Customer.deleteMany({ merchantId });
    await StoreTheme.deleteMany({ merchantId });
    console.log('🧹  Cleared old demo data');

    // ── 3. Products ──────────────────────────────────────────────────────────
    const createdProducts = await Promise.all(
      PRODUCTS.map((p, i) =>
        Product.create({
          merchantId,
          name: p.name,
          slug: `${slug(p.name)}-${i}`,
          description: p.description,
          shortDescription: p.shortDescription,
          price: p.price,
          compareAtPrice: p.compareAtPrice ?? undefined,
          trackQuantity: true,
          quantity: p.quantity,
          lowStockThreshold: 5,
          images: p.images,
          category: p.category,
          tags: p.tags,
          hasVariants: false,
          status: 'active',
          isVisible: true,
          isFeatured: p.isFeatured,
          aiGenerated: { description: false, seo: false },
          views: rand(50, 800),
          sales: rand(0, 40),
        })
      )
    );
    console.log(`✅  Created ${createdProducts.length} products`);

    // ── 4. Customers ─────────────────────────────────────────────────────────
    const createdCustomers = await Promise.all(
      CUSTOMERS_DATA.map((c) =>
        Customer.create({
          merchantId,
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          phone: c.phone,
          addresses: [
            {
              label: 'المنزل',
              isDefault: true,
              street: 'شارع التحرير',
              city: c.city,
              state: c.city,
              country: c.country,
              postalCode: '11511',
            },
          ],
          stats: { totalOrders: 0, totalSpent: 0, averageOrderValue: 0 },
          acceptsMarketing: true,
        })
      )
    );
    console.log(`✅  Created ${createdCustomers.length} customers`);

    // ── 5. Orders ────────────────────────────────────────────────────────────

    const STATUSES: Array<'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'> =
      ['pending', 'processing', 'shipped', 'delivered', 'delivered', 'delivered', 'cancelled', 'processing'];

    const PAYMENT_METHODS: Array<'cash' | 'card' | 'paymob' | 'wallet'> = ['cash', 'card', 'paymob'];

    const PAYMENT_STATUSES_MAP: Record<string, 'pending' | 'paid' | 'failed' | 'refunded'> = {
      pending:    'pending',
      processing: 'paid',
      shipped:    'paid',
      delivered:  'paid',
      cancelled:  'refunded',
    };

    const ordersToCreate = 8;
    const createdOrders = [];

    for (let i = 0; i < ordersToCreate; i++) {
      const customer = createdCustomers[i % createdCustomers.length];
      const orderStatus = STATUSES[i];
      const paymentMethod = pick(PAYMENT_METHODS);
      const paymentStatus = PAYMENT_STATUSES_MAP[orderStatus];

      // Pick 1-2 random products
      const numItems = rand(1, 2);
      const chosenProducts = [...createdProducts].sort(() => 0.5 - Math.random()).slice(0, numItems);

      const items = chosenProducts.map((p) => {
        const qty = rand(1, 3);
        return {
          productId: p._id,
          productName: p.name,
          productImage: p.images[0]?.url,
          quantity: qty,
          price: p.price,
          subtotal: p.price * qty,
        };
      });

      const subtotal = items.reduce((s, it) => s + it.subtotal, 0);
      const shipping = 30;
      const tax = Math.round(subtotal * 0.14);
      const total = subtotal + shipping + tax;

      const order = await Order.create({
        merchantId,
        orderNumber: orderNum(i),
        customerId: customer._id,
        customerInfo: {
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
        },
        items,
        subtotal,
        tax,
        shippingCost: shipping,
        discount: 0,
        total,
        shippingAddress: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          street: 'شارع التحرير',
          city: (customer.addresses?.[0] as any)?.city || 'القاهرة',
          state: 'القاهرة',
          country: 'EG',
          postalCode: '11511',
        },
        orderStatus,
        paymentStatus,
        fulfillmentStatus: orderStatus === 'delivered' ? 'fulfilled' : orderStatus === 'shipped' ? 'partial' : 'unfulfilled',
        paymentMethod,
        platformCommission: { percentage: 2.5, amount: Math.round(total * 0.025) },
        timeline: [{ status: orderStatus, timestamp: new Date(), note: 'تم إنشاء الطلب تلقائيًا' }],
      });

      createdOrders.push(order);
    }

    console.log(`✅  Created ${createdOrders.length} orders`);

    // ── 6. Update merchant stats ──────────────────────────────────────────────
    const totalRevenue = createdOrders
      .filter((o) => (o as any).paymentStatus === 'paid')
      .reduce((s, o) => s + (o as any).total, 0);

    await Merchant.findByIdAndUpdate(merchantId, {
      'stats.totalProducts': createdProducts.length,
      'stats.totalCustomers': createdCustomers.length,
      'stats.totalOrders': createdOrders.length,
      'stats.totalRevenue': totalRevenue,
    });
    console.log('✅  Updated merchant stats');

    // Find the Spark base theme (seeded by seedThemes.ts)
    const sparkTheme = await Theme.findOne({ slug: 'spark' });
    if (sparkTheme) {
      await StoreTheme.create({
        merchantId,
        themeId: sparkTheme._id,
        name: `Custom ${sparkTheme.name}`,
        isActive: true,
        globalSettings: {
          colors: {
            primary: '#6366F1',
            secondary: '#8B5CF6',
            accent: '#EC4899',
            background: '#FFFFFF',
            surface: '#F9FAFB',
            text: '#111827',
            textMuted: '#6B7280',
            border: '#E5E7EB',
          },
          typography: sparkTheme.globalSettings?.typography || { headingFont: 'Cairo', fontFamily: 'Cairo', fontSize: 'md' },
          layout: sparkTheme.globalSettings?.layout || { direction: 'rtl', language: 'ar' },
        },
        pages: sparkTheme.pages || { home: { sections: [] } },
      });
      console.log('✅  StoreTheme created (Spark base, indigo/violet overrides)');
    } else {
      console.log('⚠️  No Spark theme found in DB. Run seedThemes.ts first!');
    }

    // ── 8. Fresh test user (wizard flow) ─────────────────────────────────────
    await User.deleteOne({ email: 'fresh@matgarco.com' });
    const freshUser = await User.create({
      email: 'fresh@matgarco.com',
      password: 'Fresh1234',
      firstName: 'مستخدم',
      lastName: 'جديد',
      role: 'merchant_owner',
      emailVerified: true,
      isActive: true,
    });

    // Create merchant for fresh user but mark onboarding NOT completed
    await Merchant.deleteOne({ subdomain: 'fresh-store' });
    const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const freshMerchant = await Merchant.create({
      storeName: 'متجر جديد',
      subdomain: 'fresh-store',
      email: 'fresh@matgarco.com',
      ownerId: freshUser._id,
      subscriptionPlan: 'free_trial',
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: trialEnd,
      trialEndsAt: trialEnd,
      currency: 'EGP',
      language: 'ar',
      timezone: 'Africa/Cairo',
      isActive: true,
      onboardingCompleted: false,   // ← triggers wizard on login
      limits: { maxProducts: 50, maxStaffUsers: 1, aiCreditsPerMonth: 10, aiCreditsUsed: 0 },
      stats: { totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalCustomers: 0 },
    });
    freshUser.merchantId = freshMerchant._id as any;
    await freshUser.save();
    console.log('✅  Fresh test user + merchant created (onboardingCompleted: false → wizard)');


    // ── Summary ───────────────────────────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉  Seed complete!\n');
    console.log('  SCENARIO A — Test full dashboard (data already exists)');
    console.log('  ─────────────────────────────────────────────────────');
    console.log('  URL:      http://localhost:3002/login');
    console.log('  Email:    demo@matgarco.com');
    console.log('  Password: Demo1234');
    console.log('  Subdomain: http://localhost:3001/store/demo-store\n');
    console.log('  SCENARIO B — Test Wizard from scratch (no store yet)');
    console.log('  ─────────────────────────────────────────────────────');
    console.log('  Step 1: Go to http://localhost:3002/login');
    console.log('  Step 2: Email: fresh@matgarco.com  /  Password: Fresh1234');
    console.log('  OR register a new account at http://localhost:3002/register');
    console.log('  → After login/register you will be redirected to the Onboarding Wizard');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed error:', err);
    process.exit(1);
  }
};

seed();
