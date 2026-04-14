// ─── Section ──────────────────────────────────────────────────────────────────
export interface ThemeSection {
  id: string;
  type?: string;
  enabled?: boolean;
  order?: number;
  variant?: string;
  config?: Record<string, unknown>;
  settings?: Record<string, any>;
  blocks?: any[];
}

// ─── Full theme payload ────────────────────────────────────────────────────────
export interface ThemeData {
  templateId?: string;
  
  // -- NEW THEME ENGINE FIELDS --
  themeId?: string;
  isActive?: boolean;
  globalSettings?: {
    colors?: Record<string, string>;
    typography?: Record<string, string>;
    layout?: Record<string, string>;
  };
  pages?: Record<string, { sections: ThemeSection[] }>;

  // -- LEGACY ARSHIVE --
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    surface?: string;
    text?: string;
    textMuted?: string;
    accent?: string;
    border?: string;
  };

  fonts?: {
    heading?: string;
    body?: string;
    size?: 'sm' | 'md' | 'lg';
  };

  header?: {
    style?: 'centered' | 'split' | 'minimal' | 'sticky';
    showSearch?: boolean;
    showCart?: boolean;
    showWishlist?: boolean;
  };

  productCard?: {
    style?: 'classic' | 'overlay' | 'minimal' | 'bordered';
    showRating?: boolean;
    showBadges?: boolean;
    showQuickAdd?: boolean;
  };

  footer?: {
    style?: 'full' | 'minimal' | 'centered';
    showSocial?: boolean;
    showNewsletter?: boolean;
  };

  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    favicon?: string;
    ogImage?: string;
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };

  social?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    whatsapp?: string;
    twitter?: string;
    youtube?: string;
  };

  store?: {
    logo?: string;
    tagline?: string;
    currency?: string;
    language?: 'ar' | 'en';
    direction?: 'rtl' | 'ltr';
    announcementBar?: {
      enabled?: boolean;
      text?: string;
      bgColor?: string;
      textColor?: string;
    };
  };

  sections?: ThemeSection[];
}

// ─── Storefront API response ───────────────────────────────────────────────────
export interface StorefrontThemeResponse {
  theme: ThemeData;
  merchant: {
    _id?: string;
    storeName: string;
    subdomain: string;
    logo?: string;
    currency?: string;
    language?: string;
    email?: string;
    phone?: string;
  };
  isPreview?: boolean;
}

// ─── Template metadata (for picker UI) ────────────────────────────────────────
export interface TemplateInfo {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  thumbnail: string;   
  tags: string[];
  bestFor: string;
  bestForAr: string;
  accentColor: string; 
  isDark: boolean;
}
