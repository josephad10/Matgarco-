import { Response } from 'express';
import { AuthRequest } from '../types';
import Merchant from '../models/Merchant';
import Order from '../models/Order';
import Theme from '../models/Theme';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/error.middleware';

const DEFAULT_THEME_GLOBAL_SETTINGS = {
  colors: {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#111827',
    textMuted: '#6B7280',
    accent: '#10B981',
    border: '#E5E7EB',
  },
  typography: {
    headingFont: 'Cairo',
    fontFamily: 'Cairo',
    fontSize: 'md',
  },
  layout: {
    direction: 'rtl',
    language: 'ar',
  },
};

const DEFAULT_THEME_PAGES = {
  global: {
    sections: [
      { id: 'global-header', type: 'header', enabled: true, variant: 'split', settings: { isSticky: true, showSearch: true, showCart: true }, blocks: [] },
      { id: 'global-footer', type: 'footer', enabled: true, variant: 'classic', settings: { showNewsletter: true, showQuickLinks: true, showSupportLinks: true }, blocks: [] },
    ],
  },
  home: {
    sections: [
      { id: 'home-announcement', type: 'announcement_bar', enabled: true, variant: 'simple', settings: { text: '🎉 مرحباً بك في متجرنا! شحن مجاني على الطلبات فوق 200 جنيه' }, blocks: [] },
      {
        id: 'home-hero',
        type: 'hero',
        enabled: true,
        variant: 'centered',
        settings: { overlayOpacity: 40, height: 'medium' },
        blocks: [
          { id: 'home-hero-blk-1', type: 'heading', settings: { text: 'مرحباً بك في متجرنا', size: 'h1' } },
          { id: 'home-hero-blk-2', type: 'subtext', settings: { text: 'اكتشف أحدث المنتجات بأسعار منافسة' } },
          { id: 'home-hero-blk-3', type: 'button', settings: { label: 'تسوق الآن', link: '/products', style: 'solid' } },
        ],
      },
      { id: 'home-featured', type: 'featured_products', enabled: true, variant: 'grid', settings: { title: 'منتجات مميزة', limit: 8 }, blocks: [] },
      { id: 'home-categories', type: 'categories_grid', enabled: true, variant: 'grid', settings: { title: 'تسوق حسب الفئة', style: '3col' }, blocks: [] },
      { id: 'home-trust', type: 'trust_badges', enabled: true, variant: 'icons_row', settings: { badges: ['shipping', 'guarantee', 'secure', 'support'] }, blocks: [] },
    ],
  },
  categories: { sections: [{ id: 'categories-grid', type: 'categories_grid', enabled: true, variant: 'grid', settings: { title: 'التصنيفات', style: '3col' }, blocks: [] }] },
  products: { sections: [{ id: 'products-featured', type: 'featured_products', enabled: true, variant: 'grid', settings: { title: 'كل المنتجات', limit: 20 }, blocks: [] }] },
  about: { sections: [{ id: 'about-image-text', type: 'image_with_text', enabled: true, variant: 'text_right', settings: { title: 'من نحن', text: 'متجر احترافي يوفر أفضل تجربة تسوق لعملائك.' }, blocks: [] }] },
  contact: { sections: [{ id: 'contact-image-text', type: 'image_with_text', enabled: true, variant: 'text_left', settings: { title: 'تواصل معنا', text: 'يمكنك التواصل معنا عبر البريد والهاتف لأي استفسار.' }, blocks: [] }] },
  faq: { sections: [{ id: 'faq-text', type: 'image_with_text', enabled: true, variant: 'text_right', settings: { title: 'الأسئلة الشائعة', text: 'أضف أهم الأسئلة وإجاباتها هنا.' }, blocks: [] }] },
  shipping: { sections: [{ id: 'shipping-text', type: 'image_with_text', enabled: true, variant: 'text_right', settings: { title: 'سياسة الشحن', text: 'اكتب سياسة الشحن والتوصيل بالتفصيل.' }, blocks: [] }] },
  returns: { sections: [{ id: 'returns-text', type: 'image_with_text', enabled: true, variant: 'text_right', settings: { title: 'سياسة الاسترجاع', text: 'وضح شروط وإجراءات الاسترجاع والاستبدال.' }, blocks: [] }] },
  privacy: { sections: [{ id: 'privacy-text', type: 'image_with_text', enabled: true, variant: 'text_right', settings: { title: 'سياسة الخصوصية', text: 'وضح كيف يتم جمع واستخدام بيانات العملاء.' }, blocks: [] }] },
  terms: { sections: [{ id: 'terms-text', type: 'image_with_text', enabled: true, variant: 'text_right', settings: { title: 'الشروط والأحكام', text: 'اكتب الشروط والأحكام الخاصة باستخدام المتجر.' }, blocks: [] }] },
};

const normalizeSlug = (raw: string) =>
  raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const cloneThemeDefaults = <T>(value: T): T => JSON.parse(JSON.stringify(value));

/**
 * @desc    Get top level platform KPIs
 * @route   GET /api/superadmin/kpis
 * @access  Private (super_admin)
 */
export const getDashboardKPIs = async (_req: AuthRequest, res: Response) => {
  const totalMerchants = await Merchant.countDocuments();
  const activeMerchants = await Merchant.countDocuments({ isActive: true });
  
  // Calculate Platform GMV (Gross Merchandise Value)
  const gmvAggregation = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, totalGMV: { $sum: '$total' } } }
  ]);
  const totalGMV = gmvAggregation.length > 0 ? gmvAggregation[0].totalGMV : 0;

  // Calculate Subscriptions approximate MRR (Monthly Recurring Revenue)
  // Standard pricing: Starter 250, Pro 450, Business 699
  const pricingMap: Record<string, number> = {
    free_trial: 0,
    starter: 250,
    professional: 450,
    business: 699
  };

  const merchantsByPlan = await Merchant.aggregate([
    { $match: { subscriptionStatus: 'active' } },
    { $group: { _id: '$subscriptionPlan', count: { $sum: 1 } } }
  ]);

  let mrr = 0;
  merchantsByPlan.forEach((planStats) => {
    const planName = planStats._id as string;
    if (pricingMap[planName]) {
      mrr += planStats.count * pricingMap[planName];
    }
  });

  res.status(200).json({
    success: true,
    data: {
      totalMerchants,
      activeMerchants,
      totalGMV,
      mrr,
      merchantsDistribution: merchantsByPlan
    }
  });
};

/**
 * @desc    Get all merchants with filters
 * @route   GET /api/superadmin/merchants
 * @access  Private (super_admin)
 */
export const getMerchants = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const plan = req.query.plan as string;
  const status = req.query.status as string;
  const search = req.query.search as string;

  const query: any = {};
  if (plan && plan !== 'all') query.subscriptionPlan = plan;
  if (status && status !== 'all') query.subscriptionStatus = status;
  
  if (search) {
    query.$or = [
      { storeName: { $regex: search, $options: 'i' } },
      { subdomain: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const merchants = await Merchant.find(query)
    .populate('ownerId', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Merchant.countDocuments(query);

  res.status(200).json({
    success: true,
    count: merchants.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: merchants
  });
};

/**
 * @desc    Get single merchant details
 * @route   GET /api/superadmin/merchants/:id
 * @access  Private (super_admin)
 */
export const getMerchantDetails = async (req: AuthRequest, res: Response) => {
  const merchant = await Merchant.findById(req.params.id).populate('ownerId', 'firstName lastName email phone lastLogin');
  
  if (!merchant) {
    throw new AppError('Merchant not found', 404);
  }

  res.status(200).json({
    success: true,
    data: merchant
  });
};

/**
 * @desc    Suspend or activate a merchant
 * @route   PUT /api/superadmin/merchants/:id/status
 * @access  Private (super_admin)
 */
export const toggleMerchantStatus = async (req: AuthRequest, res: Response) => {
  const { isActive, suspensionReason } = req.body;
  
  const merchant = await Merchant.findById(req.params.id);
  
  if (!merchant) {
    throw new AppError('Merchant not found', 404);
  }

  merchant.isActive = isActive;
  if (suspensionReason) merchant.suspensionReason = suspensionReason;
  
  // Optionally pause subscription
  if (!isActive) {
    merchant.subscriptionStatus = 'suspended';
  } else if (merchant.subscriptionStatus === 'suspended') {
    merchant.subscriptionStatus = 'active';
  }

  await merchant.save();

  res.status(200).json({
    success: true,
    data: merchant
  });
};

/**
 * @desc    Get all themes (Templates)
 * @route   GET /api/superadmin/themes
 * @access  Private (super_admin)
 */
export const getThemes = async (_req: AuthRequest, res: Response) => {
  const themes = await Theme.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: themes
  });
};

/**
 * @desc    Get single base Theme details for Editor
 * @route   GET /api/superadmin/themes/:id
 * @access  Private (super_admin)
 */
export const getTheme = async (req: AuthRequest, res: Response) => {
  const theme = await Theme.findById(req.params.id);
  if (!theme) throw new AppError('Theme not found', 404);
  
  res.status(200).json({
    success: true,
    data: theme
  });
};

/**
 * @desc    Create a new base Theme
 * @route   POST /api/superadmin/themes
 * @access  Private (super_admin)
 */
export const createTheme = async (req: AuthRequest, res: Response) => {
  const name = String(req.body?.name || '').trim();
  if (!name) {
    throw new AppError('Theme name is required', 400);
  }

  const slugCandidate = normalizeSlug(String(req.body?.slug || name));
  if (!slugCandidate) {
    throw new AppError('Valid theme slug is required', 400);
  }

  const exists = await Theme.findOne({ slug: slugCandidate });
  if (exists) {
    throw new AppError('Theme slug already exists', 409);
  }

  const isPremium = !!req.body?.isPremium;
  const allowedPlans = Array.isArray(req.body?.allowedPlans) && req.body.allowedPlans.length > 0
    ? req.body.allowedPlans
    : isPremium
      ? ['professional', 'business']
      : ['free_trial', 'starter', 'professional', 'business'];

  const theme = await Theme.create({
    name,
    slug: slugCandidate,
    description: req.body?.description || '',
    category: req.body?.category || 'general',
    status: req.body?.status || 'draft',
    isPremium,
    allowedPlans,
    isBuiltIn: false,
    thumbnail: req.body?.thumbnail || 'https://picsum.photos/seed/theme/600/400',
    globalSettings: {
      ...DEFAULT_THEME_GLOBAL_SETTINGS,
      ...(req.body?.globalSettings || {}),
      colors: {
        ...DEFAULT_THEME_GLOBAL_SETTINGS.colors,
        ...(req.body?.globalSettings?.colors || {}),
      },
      typography: {
        ...DEFAULT_THEME_GLOBAL_SETTINGS.typography,
        ...(req.body?.globalSettings?.typography || {}),
      },
      layout: {
        ...DEFAULT_THEME_GLOBAL_SETTINGS.layout,
        ...(req.body?.globalSettings?.layout || {}),
      },
    },
    pages: req.body?.pages && typeof req.body.pages === 'object'
      ? { ...cloneThemeDefaults(DEFAULT_THEME_PAGES), ...req.body.pages }
      : cloneThemeDefaults(DEFAULT_THEME_PAGES),
    version: req.body?.version || '1.0.0',
    changelog: req.body?.changelog || '',
  });

  res.status(201).json({ success: true, data: theme });
};

/**
 * @desc    Update a theme's status (active/maintenance)
 * @route   PATCH /api/superadmin/themes/:id/status
 * @access  Private (super_admin)
 */
export const updateThemeStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  
  if (!['active', 'maintenance', 'draft'].includes(status)) {
    throw new AppError('Invalid status value', 400);
  }

  const theme = await Theme.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!theme) {
    throw new AppError('Theme not found', 404);
  }

  res.status(200).json({
    success: true,
    data: theme
  });
};

/**
 * @desc    Update which subscription plans can use a theme
 * @route   PATCH /api/superadmin/themes/:id/plans
 * @access  Private (super_admin)
 */
export const updateThemePlans = async (req: AuthRequest, res: Response) => {
  const { allowedPlans } = req.body;
  
  if (!Array.isArray(allowedPlans)) {
    throw new AppError('allowedPlans must be an array', 400);
  }

  const theme = await Theme.findByIdAndUpdate(
    req.params.id,
    { allowedPlans },
    { new: true, runValidators: true }
  );

  if (!theme) {
    throw new AppError('Theme not found', 404);
  }

  res.status(200).json({
    success: true,
    data: theme
  });
};

/**
 * @desc    Impersonate a merchant (Login as owner)
 * @route   POST /api/superadmin/impersonate/:merchantId
 * @access  Private (super_admin)
 */
export const impersonateMerchant = async (req: AuthRequest, res: Response) => {
  const merchant = await Merchant.findById(req.params.merchantId).populate('ownerId');
  
  if (!merchant || !merchant.ownerId) {
    throw new AppError('Merchant or Owner not found', 404);
  }

  const owner = merchant.ownerId as any;

  const payload = {
    user: {
      id: owner._id,
      role: owner.role
    }
  };

  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || '15m') as any
  };

  const accessToken = jwt.sign(
    payload, 
    process.env.JWT_SECRET || 'fallback_secret', 
    options
  );

  res.status(200).json({
    success: true,
    data: {
      token: accessToken,
      redirectUrl: `${process.env.STOREFRONT_URL || 'http://localhost:3002'}/auth/auto-login?token=${accessToken}`
    }
  });
};

/**
 * @desc    Dashboard charts data (registrations, revenue over time, recent activity)
 * @route   GET /api/superadmin/dashboard/charts
 * @access  Private (super_admin)
 */
export const getDashboardCharts = async (_req: AuthRequest, res: Response) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Registrations per day (last 30 days)
  const registrations = await Merchant.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', count: 1, _id: 0 } }
  ]);

  // Revenue trend (last 12 months from orders)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  const revenueTrend = await Order.aggregate([
    { $match: { createdAt: { $gte: twelveMonthsAgo }, paymentStatus: 'paid' } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { month: '$_id', revenue: 1, orders: 1, _id: 0 } }
  ]);

  // Plan distribution for pie chart
  const planDistribution = await Merchant.aggregate([
    { $group: { _id: '$subscriptionPlan', count: { $sum: 1 } } },
    { $project: { plan: '$_id', count: 1, _id: 0 } }
  ]);

  // Recent activity (last 10 merchants + last 10 orders)
  const recentMerchants = await Merchant.find().sort({ createdAt: -1 }).limit(5).select('storeName subdomain subscriptionPlan createdAt');
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).select('orderNumber total merchantId createdAt').populate('merchantId', 'storeName');

  const recentActivity = [
    ...recentMerchants.map(m => ({
      type: 'new_merchant' as const,
      message: `متجر جديد: ${m.storeName}`,
      detail: `${m.subdomain}.matgarco.com — ${m.subscriptionPlan}`,
      time: m.createdAt
    })),
    ...recentOrders.map(o => ({
      type: 'new_order' as const,
      message: `طلب جديد #${o.orderNumber}`,
      detail: `${o.total.toLocaleString()} ج.م — ${(o.merchantId as any)?.storeName || ''}`,
      time: o.createdAt
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

  // Today stats for Daily Pulse
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todayMerchants = await Merchant.countDocuments({ createdAt: { $gte: todayStart } });
  const todayOrders = await Order.aggregate([
    { $match: { createdAt: { $gte: todayStart } } },
    { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      registrations,
      revenueTrend,
      planDistribution,
      recentActivity,
      dailyPulse: {
        newMerchants: todayMerchants,
        todayOrders: todayOrders[0]?.count || 0,
        todayRevenue: todayOrders[0]?.revenue || 0
      }
    }
  });
};

/**
 * @desc    Send notification to a specific merchant
 * @route   POST /api/superadmin/merchants/:id/notify
 * @access  Private (super_admin)
 */
export const notifyMerchant = async (req: AuthRequest, res: Response) => {
  const { title, message, type } = req.body;
  const Notification = mongoose.model('Notification');

  const merchant = await Merchant.findById(req.params.id);
  if (!merchant) throw new AppError('Merchant not found', 404);

  await Notification.create({
    merchantId: merchant._id,
    title: title || 'رسالة من إدارة المنصة',
    message,
    type: type || 'system'
  });

  res.status(200).json({ success: true, message: 'تم إرسال الإشعار بنجاح' });
};

/**
 * @desc    Manually change a merchant's subscription plan
 * @route   PATCH /api/superadmin/merchants/:id/plan
 * @access  Private (super_admin)
 */
export const changeMerchantPlan = async (req: AuthRequest, res: Response) => {
  const { plan } = req.body;
  const validPlans = ['free_trial', 'starter', 'professional', 'business'];
  if (!validPlans.includes(plan)) throw new AppError('Invalid plan', 400);

  const limitsMap: Record<string, any> = {
    free_trial: { maxProducts: 20, maxStaffUsers: 0, aiCreditsPerMonth: 5, aiCreditsUsed: 0 },
    starter: { maxProducts: 100, maxStaffUsers: 1, aiCreditsPerMonth: 30, aiCreditsUsed: 0 },
    professional: { maxProducts: -1, maxStaffUsers: 3, aiCreditsPerMonth: 100, aiCreditsUsed: 0 },
    business: { maxProducts: -1, maxStaffUsers: 10, aiCreditsPerMonth: 300, aiCreditsUsed: 0 }
  };

  const merchant = await Merchant.findByIdAndUpdate(
    req.params.id,
    { subscriptionPlan: plan, limits: limitsMap[plan] },
    { new: true }
  );

  if (!merchant) throw new AppError('Merchant not found', 404);
  res.status(200).json({ success: true, data: merchant });
};

/**
 * @desc    Advanced finance reports (Churn, LTV, Commission)
 * @route   GET /api/superadmin/finance/advanced
 * @access  Private (super_admin)
 */
export const getAdvancedFinanceReports = async (_req: AuthRequest, res: Response) => {
  const totalMerchants = await Merchant.countDocuments();
  const cancelledThisMonth = await Merchant.countDocuments({
    subscriptionStatus: 'cancelled',
    updatedAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
  });
  const churnRate = totalMerchants > 0 ? ((cancelledThisMonth / totalMerchants) * 100).toFixed(2) : '0';

  // LTV approximation
  const pricingMap: Record<string, number> = { free_trial: 0, starter: 250, professional: 450, business: 699 };
  const merchants = await Merchant.find({ subscriptionStatus: 'active' }).select('subscriptionPlan createdAt');
  let totalLTV = 0;
  merchants.forEach(m => {
    const monthsActive = Math.max(1, Math.ceil((Date.now() - new Date(m.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)));
    totalLTV += (pricingMap[(m as any).subscriptionPlan] || 0) * monthsActive;
  });
  const avgLTV = merchants.length > 0 ? Math.round(totalLTV / merchants.length) : 0;

  // Commission revenue
  const commissionAgg = await Order.aggregate([
    { $match: { paymentStatus: 'paid', 'platformCommission.amount': { $gt: 0 } } },
    { $group: { _id: null, total: { $sum: '$platformCommission.amount' } } }
  ]);
  const commissionRevenue = commissionAgg[0]?.total || 0;

  res.status(200).json({
    success: true,
    data: { churnRate: parseFloat(churnRate), avgLTV, commissionRevenue, cancelledThisMonth, totalMerchants }
  });
};

/**
 * @desc    Update theme details (name, description, isPremium, category, version)
 * @route   PATCH /api/superadmin/themes/:id
 * @access  Private (super_admin)
 */
export const updateThemeDetails = async (req: AuthRequest, res: Response) => {
  const updates: Record<string, any> = { ...req.body };

  if (updates.slug) {
    const nextSlug = normalizeSlug(String(updates.slug));
    if (!nextSlug) {
      throw new AppError('Invalid slug', 400);
    }
    const duplicate = await Theme.findOne({ slug: nextSlug, _id: { $ne: req.params.id } });
    if (duplicate) {
      throw new AppError('Theme slug already exists', 409);
    }
    updates.slug = nextSlug;
  }

  if (updates.globalSettings) {
    updates.globalSettings = {
      ...DEFAULT_THEME_GLOBAL_SETTINGS,
      ...(updates.globalSettings || {}),
      colors: {
        ...DEFAULT_THEME_GLOBAL_SETTINGS.colors,
        ...(updates.globalSettings?.colors || {}),
      },
      typography: {
        ...DEFAULT_THEME_GLOBAL_SETTINGS.typography,
        ...(updates.globalSettings?.typography || {}),
      },
      layout: {
        ...DEFAULT_THEME_GLOBAL_SETTINGS.layout,
        ...(updates.globalSettings?.layout || {}),
      },
    };
  }

  if (updates.pages && typeof updates.pages === 'object') {
    updates.pages = {
      ...cloneThemeDefaults(DEFAULT_THEME_PAGES),
      ...updates.pages,
    };
  }

  const theme = await Theme.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!theme) throw new AppError('Theme not found', 404);
  res.status(200).json({ success: true, data: theme });
};

/**
 * @desc    Release a new version of a theme
 * @route   POST /api/superadmin/themes/:id/version
 * @access  Private (super_admin)
 */
export const releaseThemeVersion = async (req: AuthRequest, res: Response) => {
  const { version, changelog } = req.body;
  if (!version) throw new AppError('version is required', 400);

  const theme = await Theme.findById(req.params.id);
  if (!theme) throw new AppError('Theme not found', 404);

  // Push current version to history
  (theme as any).previousVersions = (theme as any).previousVersions || [];
  (theme as any).previousVersions.push({
    version: (theme as any).version || '1.0.0',
    releasedAt: new Date(),
    changelog: (theme as any).changelog || 'Initial release'
  });
  (theme as any).version = version;
  (theme as any).changelog = changelog || '';
  await theme.save();

  res.status(200).json({ success: true, data: theme });
};

/**
 * @desc    Get merchants using a specific theme
 * @route   GET /api/superadmin/themes/:id/merchants
 * @access  Private (super_admin)
 */
export const getThemeMerchants = async (req: AuthRequest, res: Response) => {
  const StoreTheme = (await import('../models/StoreTheme')).default;
  const theme = await Theme.findById(req.params.id);
  if (!theme) throw new AppError('Theme not found', 404);

  const settings = await StoreTheme.find({ themeId: theme._id, isActive: true })
    .select('merchantId')
    .populate('merchantId', 'storeName subdomain subscriptionPlan isActive');

  const merchants = settings
    .filter((s: any) => s.merchantId)
    .map((s: any) => s.merchantId);

  // Update merchantCount
  theme.set('merchantCount', merchants.length);
  await theme.save();

  res.status(200).json({ success: true, data: merchants, count: merchants.length });
};

/**
 * @desc    Delete a theme (only if not used by any merchant)
 * @route   DELETE /api/superadmin/themes/:id
 * @access  Private (super_admin)
 */
export const deleteTheme = async (req: AuthRequest, res: Response) => {
  const StoreTheme = (await import('../models/StoreTheme')).default;
  const theme = await Theme.findById(req.params.id);
  if (!theme) throw new AppError('Theme not found', 404);

  const inUse = await StoreTheme.countDocuments({ themeId: theme._id, isActive: true });
  if (inUse > 0) throw new AppError(`لا يمكن حذف القالب — مستخدم في ${inUse} متجر`, 400);

  await Theme.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'تم حذف القالب بنجاح' });
};

/**
 * @desc    Get all available subscription plans
 * @route   GET /api/superadmin/plans
 * @access  Private (super_admin)
 */
export const listPlans = async (_req: AuthRequest, res: Response) => {
  const Plan = (await import('../models/Plan')).default;
  const plans = await Plan.find().sort({ order: 1 });
  
  // Seed defaults if empty
  if (plans.length === 0) {
    const defaults = [
      { slug: 'free_trial', name: 'Free Trial', nameAr: 'تجربة مجانية', price: 0, yearlyPrice: 0, commissionRate: 0.03, limits: { maxProducts: 20, maxStaffUsers: 0, aiCreditsPerMonth: 5 }, features: ['basic_analytics'], order: 1 },
      { slug: 'starter', name: 'Starter', nameAr: 'المبتدئ', price: 250, yearlyPrice: 2500, commissionRate: 0.02, limits: { maxProducts: 100, maxStaffUsers: 1, aiCreditsPerMonth: 30 }, features: ['basic_analytics', 'custom_domain'], order: 2 },
      { slug: 'professional', name: 'Professional', nameAr: 'الاحترافي', price: 450, yearlyPrice: 4500, commissionRate: 0.01, limits: { maxProducts: -1, maxStaffUsers: 3, aiCreditsPerMonth: 100 }, features: ['advanced_analytics', 'custom_domain', 'priority_support'], order: 3 },
      { slug: 'business', name: 'Business', nameAr: 'الأعمال', price: 699, yearlyPrice: 6990, commissionRate: 0, limits: { maxProducts: -1, maxStaffUsers: 10, aiCreditsPerMonth: 300 }, features: ['all_features', 'dedicated_manager', 'own_payment_gateway'], order: 4 },
    ];
    await Plan.insertMany(defaults);
    const newPlans = await Plan.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: newPlans });
    return;
  }

  res.status(200).json({ success: true, data: plans });
};

/**
 * @desc    Update a subscription plan
 * @route   PATCH /api/superadmin/plans/:slug
 * @access  Private (super_admin)
 */
export const updatePlan = async (req: AuthRequest, res: Response) => {
  const Plan = (await import('../models/Plan')).default;
  const updates = req.body;
  
  const plan = await Plan.findOneAndUpdate({ slug: req.params.slug }, updates, { new: true, runValidators: true });
  if (!plan) throw new AppError('Plan not found', 404);
  
  res.status(200).json({ success: true, data: plan });
};

