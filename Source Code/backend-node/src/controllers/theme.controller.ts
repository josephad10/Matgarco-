/**
 * Theme Controller — Merchant Dashboard API
 * 
 * NEW SYSTEM: Uses StoreTheme + Theme models (replacing old ThemeSettings).
 * 
 * Maintains the same API shape for backward compatibility with the dashboard:
 *   GET    /api/theme              → returns { published, draft }
 *   PATCH  /api/theme/draft        → save draft changes
 *   POST   /api/theme/publish      → publish draft → live
 *   POST   /api/theme/reset-draft  → reset draft to published
 *   POST   /api/theme/apply-template → install a base theme
 *   GET    /api/theme/storefront/:subdomain         → public published
 *   GET    /api/theme/storefront/:subdomain/preview  → public draft
 */
import { Request, Response } from 'express';
import StoreTheme from '../models/StoreTheme';
import Theme from '../models/Theme';
import Merchant from '../models/Merchant';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types';
import { normalizeThemePages, normalizeThemeSection } from '../utils/themeNormalization';

// ─── Default colors & typography ──────────────────────────────────────────────
const DEFAULT_GLOBAL_SETTINGS = {
  colors: {
    primary:   '#3B82F6',
    secondary: '#1E40AF',
    background:'#F8FAFC',
    surface:   '#FFFFFF',
    text:      '#111827',
    textMuted: '#6B7280',
    accent:    '#10B981',
    border:    '#E5E7EB',
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

const DEFAULT_PAGES = {
  home: {
    sections: [
      {
        id: 'announcement_bar',
        type: 'announcement_bar',
        enabled: true,
        variant: 'simple',
        settings: { text: '🎉 مرحباً بك في متجرنا! شحن مجاني على الطلبات فوق 200 جنيه' },
        blocks: [],
      },
      {
        id: 'hero',
        type: 'hero',
        enabled: true,
        variant: 'centered',
        settings: { overlayOpacity: 40, height: 'medium' },
        blocks: [
          { id: 'hero-blk-1', type: 'heading', settings: { text: 'مرحباً بك في متجرنا', size: 'h1' } },
          { id: 'hero-blk-2', type: 'subtext', settings: { text: 'اكتشف أحدث المنتجات بأسعار منافسة' } },
          { id: 'hero-blk-3', type: 'button', settings: { label: 'تسوق الآن', link: '/products', style: 'solid' } },
        ],
      },
      {
        id: 'featured_products',
        type: 'featured_products',
        enabled: true,
        variant: 'grid',
        settings: { title: 'منتجات مميزة', limit: 8 },
        blocks: [],
      },
      {
        id: 'categories_grid',
        type: 'categories_grid',
        enabled: true,
        variant: 'grid',
        settings: { title: 'تسوق حسب الفئة', style: '3col' },
        blocks: [],
      },
      {
        id: 'promo_banner',
        type: 'promo_banner',
        enabled: false,
        variant: 'fullwidth',
        settings: {},
        blocks: [],
      },
      {
        id: 'new_arrivals',
        type: 'new_arrivals',
        enabled: true,
        variant: 'grid',
        settings: { title: 'وصل حديثاً', limit: 6 },
        blocks: [],
      },
      {
        id: 'trust_badges',
        type: 'trust_badges',
        enabled: true,
        variant: 'icons_row',
        settings: { badges: ['shipping', 'guarantee', 'secure', 'support'] },
        blocks: [],
      },
      {
        id: 'newsletter',
        type: 'newsletter',
        enabled: false,
        variant: 'simple',
        settings: {},
        blocks: [],
      },
    ],
  },
};

function normalizeSection(section: any): any {
  const sectionFallbacks = {
    hero: {
      variant: 'centered',
      settings: { overlayOpacity: 40, height: 'medium' },
      blocks: [
        { type: 'heading', settings: { text: 'مرحباً بك في متجرنا', size: 'h1' } },
        { type: 'subtext', settings: { text: 'اكتشف أفضل المنتجات' } },
        { type: 'button', settings: { label: 'تصفح المنتجات', link: '/products', style: 'solid' } },
      ],
    },
    categories_grid: {
      variant: 'grid',
      settings: { title: 'تسوق حسب الفئة', style: '3col' },
      blocks: [],
    },
    header: {
      variant: 'split',
      settings: { isSticky: true, showSearch: true, showCart: true },
      blocks: [],
    },
    footer: {
      variant: 'classic',
      settings: { showNewsletter: true, showQuickLinks: true, showSupportLinks: true },
      blocks: [],
    },
  };

  return normalizeThemeSection(section, sectionFallbacks);
}

function normalizePages(pages: any): Record<string, { sections: any[] }> {
  return normalizeThemePages(pages, DEFAULT_PAGES as any) as Record<string, { sections: any[] }>;
}

// ─── Helper: ensure merchant has a StoreTheme doc ─────────────────────────────
async function ensureStoreTheme(merchantId: string) {
  let storeTheme = await StoreTheme.findOne({ merchantId, isActive: true });
  
  if (!storeTheme) {
    // Find default theme in DB (first active one)
    const baseTheme = await Theme.findOne({ status: 'active' }).sort({ createdAt: 1 });
    
    const gs = baseTheme?.globalSettings || DEFAULT_GLOBAL_SETTINGS;
    const pages = normalizePages(baseTheme?.pages || DEFAULT_PAGES);

    storeTheme = await StoreTheme.create({
      merchantId,
      themeId: baseTheme?._id || null,
      name: baseTheme?.name || 'Default Theme',
      isActive: true,
      globalSettings: gs,
      pages: pages,
    });
  } else {
    const normalizedPages = normalizePages(storeTheme.pages || DEFAULT_PAGES);
    const currentPagesRaw = JSON.stringify(storeTheme.pages || {});
    const normalizedPagesRaw = JSON.stringify(normalizedPages);
    if (currentPagesRaw !== normalizedPagesRaw) {
      storeTheme.pages = normalizedPages;
      await storeTheme.save();
    }
  }
  
  return storeTheme;
}

// ─── GET /api/theme ───────────────────────────────────────────────────────────
// Returns { published, draft } shape for dashboard compatibility
export const getTheme = async (req: AuthRequest, res: Response): Promise<void> => {
  const merchantId = req.user?.merchantId?.toString();
  if (!merchantId) throw new AppError('Merchant not found', 404);

  const storeTheme = await ensureStoreTheme(merchantId);

  // The StoreTheme stores the live data directly (globalSettings + pages).
  // We manufacture "published" and "draft" from a single source for now.
  // TODO: Add draft field to StoreTheme model for proper draft/publish flow.
  const themeData = {
    globalSettings: storeTheme.globalSettings,
    pages: storeTheme.pages,
    // Legacy fields the dashboard panels currently read:
    colors: (storeTheme.globalSettings as any)?.colors || DEFAULT_GLOBAL_SETTINGS.colors,
    fonts: {
      heading: (storeTheme.globalSettings as any)?.typography?.headingFont || 'Cairo',
      body:    (storeTheme.globalSettings as any)?.typography?.fontFamily || 'Cairo',
      size:    (storeTheme.globalSettings as any)?.typography?.fontSize || 'md',
    },
    sections: (storeTheme.pages as any)?.home?.sections || [],
    templateId: storeTheme.name?.toLowerCase().replace(/\s/g, '-') || 'custom',
    header: { style: 'split', showSearch: true, showCart: true, showWishlist: true },
    productCard: { style: 'classic', showRating: true, showBadges: true, showQuickAdd: true },
    footer: { style: 'full', showSocial: true, showNewsletter: true },
    seo: {},
    social: {},
    store: {
      logo: '',
      tagline: '',
      currency: 'EGP',
      language: (storeTheme.globalSettings as any)?.layout?.language || 'ar',
      direction: (storeTheme.globalSettings as any)?.layout?.direction || 'rtl',
      announcementBar: { enabled: false, text: '', bgColor: '', textColor: '' },
    },
  };

  res.json({
    success: true,
    data: {
      published: themeData,
      draft: themeData,
      hasUnpublishedChanges: false,
    },
  });
};

// ─── PATCH /api/theme/draft ───────────────────────────────────────────────────
export const saveDraft = async (req: AuthRequest, res: Response): Promise<void> => {
  const merchantId = req.user?.merchantId?.toString();
  if (!merchantId) throw new AppError('Merchant not found', 404);

  const storeTheme = await ensureStoreTheme(merchantId);
  const update = req.body;

  // Map legacy dashboard fields back to new system
  const newGlobalSettings: any = { ...(storeTheme.globalSettings || {}) };
  const newPages: any = { ...(storeTheme.pages || {}) };

  // Handle colors update (legacy: update.colors → new: globalSettings.colors)
  if (update.colors) {
    newGlobalSettings.colors = { ...(newGlobalSettings.colors || {}), ...update.colors };
  }
  // Direct globalSettings update (new system)
  if (update.globalSettings) {
    if (update.globalSettings.colors) {
      newGlobalSettings.colors = { ...(newGlobalSettings.colors || {}), ...update.globalSettings.colors };
    }
    if (update.globalSettings.typography) {
      newGlobalSettings.typography = { ...(newGlobalSettings.typography || {}), ...update.globalSettings.typography };
    }
    if (update.globalSettings.layout) {
      newGlobalSettings.layout = { ...(newGlobalSettings.layout || {}), ...update.globalSettings.layout };
    }
  }

  // Handle fonts update (legacy)
  if (update.fonts) {
    newGlobalSettings.typography = {
      ...(newGlobalSettings.typography || {}),
      headingFont: update.fonts.heading || newGlobalSettings.typography?.headingFont,
      fontFamily:  update.fonts.body    || newGlobalSettings.typography?.fontFamily,
      fontSize:    update.fonts.size    || newGlobalSettings.typography?.fontSize,
    };
  }

  // Handle sections update (legacy: update.sections → new: pages.home.sections)
  if (update.sections) {
    newPages.home = { 
      ...(newPages.home || {}),
      sections: update.sections.map((s: any) => normalizeSection(s)),
    };
  }
  // Direct pages update (new system)
  if (update.pages) {
    for (const [pageKey, pageValue] of Object.entries(update.pages)) {
      const incomingPage = (pageValue as any) || {};
      const currentPage = (newPages as any)[pageKey] || {};
      const mergedPage = {
        ...currentPage,
        ...incomingPage,
      };
      const candidateSections = incomingPage.sections ?? currentPage.sections ?? [];
      (newPages as any)[pageKey] = {
        ...mergedPage,
        sections: Array.isArray(candidateSections)
          ? candidateSections.map((s: any) => normalizeSection(s))
          : [],
      };
    }
  }

  // Handle store settings (legacy)
  if (update.store) {
    newGlobalSettings.layout = {
      ...(newGlobalSettings.layout || {}),
      direction: update.store.direction || newGlobalSettings.layout?.direction,
      language: update.store.language || newGlobalSettings.layout?.language,
    };
  }

  storeTheme.globalSettings = newGlobalSettings;
  storeTheme.pages = normalizePages(newPages);
  await storeTheme.save();

  // Return in legacy format for dashboard compatibility
  const draft = {
    globalSettings: storeTheme.globalSettings,
    pages: storeTheme.pages,
    colors: (storeTheme.globalSettings as any)?.colors || {},
    fonts: {
      heading: (storeTheme.globalSettings as any)?.typography?.headingFont || 'Cairo',
      body:    (storeTheme.globalSettings as any)?.typography?.fontFamily || 'Cairo',
      size:    (storeTheme.globalSettings as any)?.typography?.fontSize || 'md',
    },
    sections: (storeTheme.pages as any)?.home?.sections || [],
  };

  res.json({ success: true, data: { draft, hasUnpublishedChanges: true } });
};

// ─── POST /api/theme/publish ──────────────────────────────────────────────────
export const publishTheme = async (req: AuthRequest, res: Response): Promise<void> => {
  const merchantId = req.user?.merchantId?.toString();
  if (!merchantId) throw new AppError('Merchant not found', 404);

  // In the new system, StoreTheme IS the live data. No separate publish step.
  // The save already persists to the live store.
  const storeTheme = await StoreTheme.findOne({ merchantId, isActive: true });
  if (!storeTheme) throw new AppError('Theme not found', 404);

  res.json({ success: true, message: 'تم نشر التصميم بنجاح', data: { published: storeTheme } });
};

// ─── POST /api/theme/reset-draft ─────────────────────────────────────────────
export const resetDraft = async (req: AuthRequest, res: Response): Promise<void> => {
  const merchantId = req.user?.merchantId?.toString();
  if (!merchantId) throw new AppError('Merchant not found', 404);

  const storeTheme = await StoreTheme.findOne({ merchantId, isActive: true }).populate('themeId');
  if (!storeTheme) throw new AppError('Theme not found', 404);

  // Reset to the base theme defaults
  const baseTheme = storeTheme.themeId as any;
  if (baseTheme) {
    storeTheme.globalSettings = baseTheme.globalSettings || DEFAULT_GLOBAL_SETTINGS;
    storeTheme.pages = normalizePages(baseTheme.pages || DEFAULT_PAGES);
    await storeTheme.save();
  }

  const draft = {
    globalSettings: storeTheme.globalSettings,
    pages: storeTheme.pages,
    colors: (storeTheme.globalSettings as any)?.colors || {},
    sections: (storeTheme.pages as any)?.home?.sections || [],
  };

  res.json({ success: true, message: 'تم تجاهل التغييرات', data: { draft } });
};

// ─── POST /api/theme/apply-template ──────────────────────────────────────────
export const applyTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
  const merchantId = req.user?.merchantId?.toString();
  if (!merchantId) throw new AppError('Merchant not found', 404);

  const { templateId } = req.body;
  if (!templateId) throw new AppError('templateId is required', 400);

  // Find the base theme by slug or ID
  const baseTheme = await Theme.findOne({ slug: templateId }) || await Theme.findById(templateId);
  if (!baseTheme) throw new AppError('القالب غير موجود', 404);

  // Deactivate existing themes, create new StoreTheme
  await StoreTheme.updateMany({ merchantId }, { isActive: false });

  const newStoreTheme = await StoreTheme.create({
    merchantId,
    themeId: baseTheme._id,
    name: `Custom ${baseTheme.name}`,
    isActive: true,
    globalSettings: baseTheme.globalSettings || DEFAULT_GLOBAL_SETTINGS,
    pages: normalizePages(baseTheme.pages || DEFAULT_PAGES),
  });

  const draft = {
    globalSettings: newStoreTheme.globalSettings,
    pages: newStoreTheme.pages,
    colors: (newStoreTheme.globalSettings as any)?.colors || {},
    sections: (newStoreTheme.pages as any)?.home?.sections || [],
    templateId: baseTheme.slug,
  };

  res.json({ success: true, data: { draft } });
};

// ─── PUBLIC: GET /api/theme/storefront/:subdomain ─────────────────────────────
export const getPublishedTheme = async (req: Request, res: Response): Promise<void> => {
  const { subdomain } = req.params;

  const merchant = await Merchant.findOne({ subdomain }).lean();
  if (!merchant) throw new AppError('Store not found', 404);

  const merchantId = (merchant as any)._id.toString();
  const storeTheme = await ensureStoreTheme(merchantId);

  // Return theme data in the format the Storefront expects
  const themeData: any = {
    globalSettings: storeTheme.globalSettings,
    pages: storeTheme.pages,
    // Legacy aliases
    colors: (storeTheme.globalSettings as any)?.colors || DEFAULT_GLOBAL_SETTINGS.colors,
    fonts: {
      heading: (storeTheme.globalSettings as any)?.typography?.headingFont || 'Cairo',
      body:    (storeTheme.globalSettings as any)?.typography?.fontFamily || 'Cairo',
      size:    (storeTheme.globalSettings as any)?.typography?.fontSize || 'md',
    },
    sections: (storeTheme.pages as any)?.home?.sections || [],
    store: {
      logo: '',
      tagline: '',
      currency: (merchant as any).currency || 'EGP',
      language: (storeTheme.globalSettings as any)?.layout?.language || 'ar',
      direction: (storeTheme.globalSettings as any)?.layout?.direction || 'rtl',
    },
  };

  res.json({
    success: true,
    data: {
      theme: themeData,
      merchant: {
        _id: (merchant as any)._id,
        storeName: (merchant as any).storeName,
        subdomain: (merchant as any).subdomain,
        logo: (merchant as any).logo,
        currency: (merchant as any).currency,
        language: (merchant as any).language,
        email: (merchant as any).email,
        phone: (merchant as any).phone,
      },
    },
  });
};

// ─── PUBLIC: GET /api/theme/storefront/:subdomain/preview ─────────────────────
export const getPreviewTheme = async (req: Request, res: Response): Promise<void> => {
  const { subdomain } = req.params;

  const merchant = await Merchant.findOne({ subdomain }).lean();
  if (!merchant) throw new AppError('Store not found', 404);

  const merchantId = (merchant as any)._id.toString();
  const storeTheme = await ensureStoreTheme(merchantId);

  const themeData: any = {
    globalSettings: storeTheme.globalSettings,
    pages: storeTheme.pages,
    colors: (storeTheme.globalSettings as any)?.colors || DEFAULT_GLOBAL_SETTINGS.colors,
    fonts: {
      heading: (storeTheme.globalSettings as any)?.typography?.headingFont || 'Cairo',
      body:    (storeTheme.globalSettings as any)?.typography?.fontFamily || 'Cairo',
      size:    (storeTheme.globalSettings as any)?.typography?.fontSize || 'md',
    },
    sections: (storeTheme.pages as any)?.home?.sections || [],
    store: {
      logo: '',
      tagline: '',
      currency: (merchant as any).currency || 'EGP',
      language: (storeTheme.globalSettings as any)?.layout?.language || 'ar',
      direction: (storeTheme.globalSettings as any)?.layout?.direction || 'rtl',
    },
  };

  res.json({
    success: true,
    data: {
      theme: themeData,
      isPreview: true,
      merchant: {
        storeName: (merchant as any).storeName,
        subdomain: (merchant as any).subdomain,
        logo: (merchant as any).logo,
        currency: (merchant as any).currency,
        email: (merchant as any).email,
        phone: (merchant as any).phone,
      },
    },
  });
};
