import slugify from 'slugify';

/**
 * Generate URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

/**
 * Generate unique order number
 */
export const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `ORD-${year}${month}-${random}`;
};

/**
 * Calculate platform commission
 */
export const calculateCommission = (amount: number, percentage: number): number => {
  return Math.round((amount * percentage) / 100);
};

/**
 * Calculate pagination
 */
export const calculatePagination = (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  
  return {
    skip,
    limit,
    page,
  };
};

/**
 * Generate random token
 */
export const generateToken = (length: number = 32): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return token;
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100;
};

/**
 * Format currency (EGP)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
  }).format(amount);
};
