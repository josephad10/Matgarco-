import { fetchStorefrontTheme, fetchPreviewTheme, fetchMasterThemePreview } from '@/lib/api';
import { notFound } from 'next/navigation';
import ThemeRenderer from '@/components/theme/ThemeRenderer';
import StorePageShell from '@/components/StorePageShell';

interface Props {
  params: { subdomain: string; page: string };
  searchParams: { preview?: string; master_theme_id?: string };
}

export const revalidate = 60;

export default async function GenericStorePage({ params, searchParams }: Props) {
  const { subdomain, page } = params;
  const isPreview = searchParams.preview === '1';

  // Protect against reserved or non-existent page slugs globally
  const validPages = ['about', 'contact', 'faq', 'terms', 'privacy', 'shipping', 'returns'];
  if (!validPages.includes(page)) {
    return notFound();
  }

  const themeRes = isPreview && searchParams.master_theme_id
    ? await fetchMasterThemePreview(searchParams.master_theme_id)
    : isPreview 
      ? await fetchPreviewTheme(subdomain) 
      : await fetchStorefrontTheme(subdomain);

  if (!themeRes) return notFound();

  // Load sections for this specific page (e.g., 'about' or 'contact')
  let sections = themeRes.theme?.pages?.[page]?.sections;

  // Provide a smart default structure if the page hasn't been designed yet
  if (!sections || sections.length === 0) {
    if (page === 'about') {
      sections = [
        { id: 'hdr', type: 'header', settings: {} },
        { 
          id: 'about-img-text', 
          type: 'image_with_text', 
          settings: { 
            title: 'قصتنا', 
            text: 'نحن متجر مصمم بالشغف لنقدم لك أفضل الخدمات المتنوعة.' 
          } 
        },
        { id: 'ftr', type: 'footer', settings: {} }
      ];
    } else {
      sections = [
        { id: 'hdr', type: 'header', settings: {} },
        { id: 'ftr', type: 'footer', settings: {} }
      ];
    }
  }

  return (
    <StorePageShell subdomain={subdomain}>
      <ThemeRenderer 
        sections={sections} 
        storeData={themeRes.theme?.store || {}} 
      />
    </StorePageShell>
  );
}
