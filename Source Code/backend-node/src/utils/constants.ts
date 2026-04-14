// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS = {
  free_trial: {
    name: 'Free Trial',
    price: 0,
    billingCycle: 'trial',
    duration: 14, // days
    commissionRate: 3, // percentage
    limits: {
      maxProducts: 20,
      maxStaffUsers: 0,
      aiCreditsPerMonth: 5,
    },
    features: [
      'Basic store setup',
      'Limited product listings (20)',
      'Order and customer management',
      'Basic sales dashboard',
      'Platform-branded subdomain',
      'Standard customer support',
    ],
  },
  starter: {
    name: 'Starter',
    price: 250, // EGP
    yearlyPrice: 2500, // EGP (save 17%)
    billingCycle: 'monthly',
    commissionRate: 2, // percentage
    limits: {
      maxProducts: 100,
      maxStaffUsers: 1,
      aiCreditsPerMonth: 30,
    },
    features: [
      'Full store customization',
      'Up to 100 products',
      'Integrated local payment gateways',
      'Shipping integration',
      'AI-generated product descriptions (30 credits)',
      'Standard analytics and sales reports',
      'Remove "Powered by Matgarco"',
    ],
  },
  professional: {
    name: 'Professional',
    price: 450, // EGP
    yearlyPrice: 4500, // EGP (save 17%)
    billingCycle: 'monthly',
    commissionRate: 0, // percentage
    limits: {
      maxProducts: -1, // unlimited
      maxStaffUsers: 3,
      aiCreditsPerMonth: 100,
    },
    features: [
      'Unlimited product listings',
      'Advanced sales analytics and performance insights',
      'AI tools (100 credits)',
      'Custom domain mapping',
      'Discount and coupon management',
      'Priority customer support',
      '0% transaction fees',
    ],
  },
  business: {
    name: 'Business',
    price: 699, // EGP
    yearlyPrice: 6999, // EGP (save 17%)
    billingCycle: 'monthly',
    commissionRate: 0, // percentage
    limits: {
      maxProducts: -1, // unlimited
      maxStaffUsers: 10,
      aiCreditsPerMonth: 300,
    },
    features: [
      'Multi-user staff access and role management',
      'Advanced inventory forecasting and alerts',
      'AI-powered sales and marketing recommendations (300 credits)',
      'Exportable financial reports (PDF / CSV)',
      'API access for integrations',
      'Dedicated support channel',
      '0% transaction fees',
    ],
  },
} as const;

// AI Credit Costs
export const AI_CREDIT_COSTS = {
  product_description: 1,
  seo_optimization: 2,
  category_suggestion: 1,
  image_alt_text: 1,
} as const;

// Image Upload Limits
export const IMAGE_LIMITS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFiles: 10,
} as const;

// Pagination Defaults
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 100,
} as const;

// Reserved Subdomains
export const RESERVED_SUBDOMAINS = [
  'www', 'api', 'admin', 'dashboard', 'app', 'mail', 'ftp',
  'localhost', 'webmail', 'smtp', 'pop', 'imap', 'cpanel',
  'whm', 'ns1', 'ns2', 'matgarco', 'staging', 'dev', 'test',
  'blog', 'shop', 'store', 'help', 'support', 'docs',
] as const;

// Default Store Config
export const DEFAULT_STORE_CONFIG = {
  colors: {
    primary: '#0ea5e9',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#1e293b',
  },
  fonts: {
    heading: 'Poppins',
    body: 'Inter',
  },
  layout: {
    style: 'grid' as const,
    productsPerRow: 3,
    buttonShape: 'rounded' as const,
  },
} as const;
