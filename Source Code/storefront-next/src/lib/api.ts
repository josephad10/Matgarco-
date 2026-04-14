import type { StorefrontThemeResponse } from '@/types/theme';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Fetch published theme (used by storefront pages) ────────────────────────
export async function fetchStorefrontTheme(subdomain: string): Promise<StorefrontThemeResponse | null> {
  try {
    const res = await fetch(`${API_URL}/storefront/${subdomain}/theme`, {
      next: { revalidate: 0 }, 
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as StorefrontThemeResponse;
  } catch {
    return null;
  }
}

// ─── Fetch draft theme (used by preview mode) ─────────────────────────────────
export async function fetchPreviewTheme(subdomain: string): Promise<StorefrontThemeResponse | null> {
  try {
    const res = await fetch(`${API_URL}/theme/storefront/${subdomain}/preview`, {
      cache: 'no-store', // always fresh for preview
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as StorefrontThemeResponse;
  } catch {
    return null;
  }
}

// ─── Fetch Master Theme (used by Super Admin Template Maker) ─────────────────
export async function fetchMasterThemePreview(themeId: string): Promise<StorefrontThemeResponse | null> {
  try {
    const res = await fetch(`${API_URL}/storefront/theme-preview/${themeId}`, {
      cache: 'no-store', 
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? (json.data as StorefrontThemeResponse) : null;
  } catch {
    return null;
  }
}

// ─── Products (PUBLIC — uses subdomain, no auth needed) ──────────────────────
export async function fetchProducts(subdomain: string, params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
}) {
  const query = new URLSearchParams();
  if (params?.page)     query.set('page',     String(params.page));
  if (params?.limit)    query.set('limit',    String(params.limit));
  if (params?.category) query.set('category', params.category);
  if (params?.search)   query.set('search',   params.search);
  if (params?.sort)     query.set('sort',     params.sort);
  if (params?.featured) query.set('featured', 'true');

  try {
    const res = await fetch(
      `${API_URL}/storefront/${subdomain}/products?${query}`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return { products: [], pagination: { page: 1, total: 0, pages: 0 } };
    const json = await res.json();
    return json.data;
  } catch {
    return { products: [], pagination: { page: 1, total: 0, pages: 0 } };
  }
}

// ─── Single product ───────────────────────────────────────────────────────────
export async function fetchProductBySlug(subdomain: string, slug: string) {
  try {
    const res = await fetch(
      `${API_URL}/storefront/${subdomain}/products/slug/${slug}`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

// ─── Merchant info (public) ────────────────────────────────────────────────────
export async function fetchMerchantBySubdomain(subdomain: string) {
  const res = await fetch(
    `${API_URL}/merchants/subdomain/${subdomain}`,
    { next: { revalidate: 120 } }
  );
  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.merchant ?? null;
}

// ─── Categories (public) ───────────────────────────────────────────────────────
export async function fetchCategories(subdomain: string) {
  try {
    const res = await fetch(
      `${API_URL}/storefront/${subdomain}/categories`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}
