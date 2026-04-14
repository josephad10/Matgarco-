import { fetchStorefrontTheme, fetchMasterThemePreview, fetchPreviewTheme } from '@/lib/api';
import { notFound } from 'next/navigation';
import StorePageShell from '@/components/StorePageShell';
import CartPageClient from './CartPageClient';

interface Props {
  params: { subdomain: string };
  searchParams: { preview?: string; master_theme_id?: string };
}

export default async function CartPage({ params, searchParams }: Props) {
  const { subdomain } = params;
  const isPreview = searchParams.preview === '1';
  const masterThemeId = searchParams.master_theme_id;

  const themeRes = masterThemeId
    ? await fetchMasterThemePreview(masterThemeId)
    : isPreview
      ? await fetchPreviewTheme(subdomain)
      : await fetchStorefrontTheme(subdomain);

  if (!themeRes) return notFound();

  return (
    <StorePageShell subdomain={subdomain}>
      <CartPageClient
        subdomain={subdomain}
      />
    </StorePageShell>
  );
}
