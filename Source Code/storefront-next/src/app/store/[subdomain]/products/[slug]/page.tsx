import { fetchProductBySlug, fetchStorefrontTheme } from '@/lib/api';
import { notFound } from 'next/navigation';
import StorePageShell from '@/components/StorePageShell';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: { subdomain: string; slug: string };
}

export async function generateMetadata({ params }: Props) {
  const data = await fetchProductBySlug(params.subdomain, params.slug);
  if (!data?.product) return {};
  const { product } = data;
  return {
    title: product.seo?.title || product.name,
    description: product.seo?.description || product.description?.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { subdomain, slug } = params;

  const [themeRes, productData] = await Promise.all([
    fetchStorefrontTheme(subdomain),
    fetchProductBySlug(subdomain, slug),
  ]);

  if (!themeRes || !productData?.product) return notFound();

  const { theme } = themeRes;
  const { product, related: relatedProducts = [] } = productData;

  return (
    <StorePageShell subdomain={subdomain}>
      <ProductDetailClient
        product={product}
        subdomain={subdomain}
        relatedProducts={relatedProducts}
      />
    </StorePageShell>
  );
}
