import { notFound } from 'next/navigation';
import { fetchStorefrontTheme, fetchPreviewTheme, fetchMasterThemePreview, fetchProducts } from '@/lib/api';
import ThemeRenderer from '@/components/theme/ThemeRenderer';
import StorePageShell from '@/components/StorePageShell';

interface Props {
  params: { subdomain: string };
  searchParams: { preview?: string; master_theme_id?: string };
}

export default async function StorefrontHomePage({ params, searchParams }: Props) {
  // Pages in Next.js 14 receive searchParams as props — most reliable source
  const masterThemeId = searchParams?.master_theme_id;
  const isPreview = searchParams?.preview === '1';
  const { subdomain } = params;

  let data;
  if (masterThemeId) {
    data = await fetchMasterThemePreview(masterThemeId);
  } else if (isPreview) {
    data = await fetchPreviewTheme(subdomain);
  } else {
    data = await fetchStorefrontTheme(subdomain);
  }

  if (!data) notFound();

  const { theme, merchant } = data;

  // ─── NEW SYSTEM: Extract sections from pages.home.sections ──────────────
  // Master Theme Preview:  theme = { themeId: { pages }, draft: { pages }, published: { pages } }
  // StoreTheme (merchant):  theme = { pages: { home: { sections } } }
  // Legacy ThemeSettings:   theme = { sections: [{id, config, enabled}] } — will be removed

  const baseTheme: any = (theme as any)?.themeId ?? theme;

  // Try all possible locations for sections (new system priority)
  const pages: any =
    (theme as any)?.draft?.pages ??
    (theme as any)?.published?.pages ??
    baseTheme?.pages ??
    {};

  const rawSections: any[] = pages?.home?.sections ?? [];

  // If no sections from new system, try legacy format and convert
  let legacySections: any[] = [];
  if (rawSections.length === 0 && Array.isArray((theme as any)?.sections)) {
    legacySections = (theme as any).sections
      .filter((s: any) => s.enabled !== false)
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      .map((s: any) => ({
        id: s.id,
        type: s.id, // In legacy, the id IS the type (hero, featured_products, etc.)
        enabled: s.enabled,
        settings: s.config || {},
      }));
  }

  // Filter enabled sections
  const activeSections = rawSections.length > 0
    ? rawSections.filter((s: any) => s.enabled !== false)
    : legacySections;

  // Default skeleton if theme has zero sections
  const sections = activeSections.length > 0
    ? activeSections
    : [
        { id: 'default-hero', type: 'hero', enabled: true, settings: { title: merchant?.storeName || 'مرحباً بك في المتجر', subtitle: 'اكتشف أحدث المنتجات بأفضل الأسعار', buttonText: 'تسوق الآن', buttonLink: '/products' } },
        { id: 'default-products', type: 'featured_products', enabled: true, settings: { title: 'منتجات مميزة', limit: 8 } },
        { id: 'default-trust', type: 'trust_badges', enabled: true, settings: {} },
        { id: 'default-footer', type: 'footer', enabled: true, settings: {} },
      ];

  // Fetch products for product-related sections
  const productsData = await fetchProducts(
    subdomain === 'demo-preview' ? 'demo' : subdomain,
    { limit: 12, featured: true }
  );
  const products = productsData?.products ?? [];

  return (
    <StorePageShell subdomain={subdomain}>
      <ThemeRenderer
        sections={sections}
        storeData={{ products, merchant, isPreview: isPreview || !!masterThemeId }}
      />
    </StorePageShell>
  );
}
