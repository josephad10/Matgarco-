import { fetchStorefrontTheme, fetchPreviewTheme, fetchCategories, fetchMasterThemePreview } from '@/lib/api';
import { notFound } from 'next/navigation';
import ThemeRenderer from '@/components/theme/ThemeRenderer';
import StorePageShell from '@/components/StorePageShell';

interface Props {
  params: { subdomain: string };
  searchParams: { preview?: string; master_theme_id?: string };
}

export const revalidate = 60;

export default async function CategoriesPage({ params, searchParams }: Props) {
  const { subdomain } = params;
  const isPreview = searchParams.preview === '1';
  const masterThemeId = searchParams.master_theme_id;
  const isMasterPreview = isPreview && !!masterThemeId;
  // demo-preview has no real merchant — fall back to 'demo' for categories
  const realSubdomain = isMasterPreview ? 'demo' : subdomain;

  const [themeRes, categoriesRes] = await Promise.all([
    isMasterPreview
      ? fetchMasterThemePreview(masterThemeId!)
      : isPreview
        ? fetchPreviewTheme(subdomain)
        : fetchStorefrontTheme(subdomain),
    fetchCategories(realSubdomain),
  ]);

  if (!themeRes) return notFound();

  // Try to load custom sections for the Categories Page from the Theme Data
  let sections = themeRes.theme?.pages?.categories?.sections;

  // Fallback to a default configuration if the theme does not have a customized categories page yet
  if (!sections || sections.length === 0) {
    sections = [
      { id: 'hdr', type: 'header', settings: {} },
      { id: 'cat', type: 'categories_grid', settings: { style: '3col' } },
      { id: 'ftr', type: 'footer', settings: {} }
    ];
  }

  return (
    <StorePageShell subdomain={subdomain}>
      <ThemeRenderer 
        sections={sections} 
        storeData={{ 
          ...themeRes.theme?.store, 
          categories: categoriesRes || [] // Pass the fetched categories to the renderer
        }} 
      />
    </StorePageShell>
  );
}
