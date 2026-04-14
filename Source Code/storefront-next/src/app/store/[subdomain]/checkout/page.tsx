import { fetchStorefrontTheme } from '@/lib/api';
import { notFound } from 'next/navigation';
import StorePageShell from '@/components/StorePageShell';
import CheckoutClient from './CheckoutClient';

interface Props {
  params: { subdomain: string };
}

export default async function CheckoutPage({ params }: Props) {
  const { subdomain } = params;

  const themeRes = await fetchStorefrontTheme(subdomain);
  if (!themeRes) return notFound();

  const { theme } = themeRes;

  return (
    <StorePageShell subdomain={subdomain}>
      <CheckoutClient
        subdomain={subdomain}
      />
    </StorePageShell>
  );
}
