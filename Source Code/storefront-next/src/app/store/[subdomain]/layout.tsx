import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchStorefrontTheme, fetchPreviewTheme, fetchMasterThemePreview } from '@/lib/api';
import { buildCSSVariables, buildGoogleFontsURL } from '@/lib/theme';
import { CartProvider } from '@/components/CartProvider';
import ThemeDocumentSync from '@/components/ThemeDocumentSync';
import PreviewLinkInterceptor from '@/components/PreviewLinkInterceptor';
import StorefrontLivePreview from '@/components/StorefrontLivePreview';

interface Props {
  children: React.ReactNode;
  params: { subdomain: string };
  // Note: Next.js 14 does NOT pass searchParams to layouts (only pages get them).
  // We rely on headers set by middleware.
}

// ─── Helper: resolve master theme ID from headers ─────────────────────────────
function resolveHeaders() {
  try {
    const { headers } = require('next/headers');
    const h = headers();
    return {
      masterThemeId: h.get('x-master-theme') as string | null,
      isPreview: h.get('x-preview') === '1',
    };
  } catch {
    return { masterThemeId: null, isPreview: false };
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
  const masterThemeId = searchParams?.master_theme_id;
  const isPreview = searchParams?.preview === '1';

  const data = masterThemeId
    ? await fetchMasterThemePreview(masterThemeId)
    : isPreview
      ? await fetchPreviewTheme(params.subdomain)
      : await fetchStorefrontTheme(params.subdomain);

  if (!data) return { title: 'معاينة القالب' };
  return { title: data.merchant?.storeName || 'معاينة القالب' };
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default async function StoreLayout({ children, params }: Props) {
  const { masterThemeId, isPreview } = resolveHeaders();

  const data = masterThemeId
    ? await fetchMasterThemePreview(masterThemeId)
    : isPreview
      ? await fetchPreviewTheme(params.subdomain)
      : await fetchStorefrontTheme(params.subdomain);

  if (!data) notFound();

  const { theme } = data;

  // ───────────────────────────────────────────────────────────────────────────
  // NEW SYSTEM: Theme data lives in `theme.globalSettings` / `theme.pages`
  // Master Theme Preview wraps base theme inside `theme.themeId`
  // We normalise to always get the right config.
  // ───────────────────────────────────────────────────────────────────────────
  const baseTheme: any = (theme as any)?.themeId ?? theme;
  
  // CSS Variables: read from globalSettings (new system)
  const cssVars  = buildCSSVariables(baseTheme);
  const fontsURL = buildGoogleFontsURL(baseTheme);

  const dir  = baseTheme?.globalSettings?.layout?.direction ?? 'rtl';
  const lang = baseTheme?.globalSettings?.layout?.language  ?? 'ar';

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={fontsURL} />
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <ThemeDocumentSync dir={dir} lang={lang} />
      <PreviewLinkInterceptor />
      <StorefrontLivePreview />
      <CartProvider>
        {children}
      </CartProvider>
    </>
  );
}
