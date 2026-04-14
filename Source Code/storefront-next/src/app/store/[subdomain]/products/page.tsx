import { fetchProducts, fetchStorefrontTheme, fetchMasterThemePreview, fetchPreviewTheme } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StorePageShell from '@/components/StorePageShell';
import { ProductCard } from '@/components/theme/ProductCard';

interface Props {
  params: { subdomain: string };
  searchParams: { q?: string; sort?: string; page?: string; category?: string; preview?: string; master_theme_id?: string };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { subdomain } = params;
  const isPreview = searchParams.preview === '1';
  const masterThemeId = searchParams.master_theme_id;
  const isMasterPreview = isPreview && !!masterThemeId;
  const currentPage = parseInt(searchParams.page || '1');

  // In master preview mode, use demo products (no real merchant needed)
  const realSubdomain = isMasterPreview ? 'demo' : subdomain;

  const themeRes = isMasterPreview
    ? await fetchMasterThemePreview(masterThemeId!)
    : isPreview
      ? await fetchPreviewTheme(subdomain)
      : await fetchStorefrontTheme(subdomain);

  const productsRes = await fetchProducts(realSubdomain, {
    search:   searchParams.q,
    sort:     searchParams.sort,
    category: searchParams.category,
    page:     currentPage,
    limit:    20,
  });

  if (!themeRes) return notFound();

  const products = productsRes?.products || [];
  const total    = productsRes?.pagination?.total || 0;

  return (
    <StorePageShell subdomain={subdomain}>
      <div className="px-4 max-w-7xl mx-auto pb-16 pt-6">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6 text-[var(--text-muted)]">
          <Link href={`/store/${subdomain}`} className="hover:underline">الرئيسية</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--text)]">المنتجات</span>
        </nav>

        {/* Header + Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-[var(--text)] font-heading">
              جميع المنتجات
            </h1>
            <p className="text-sm mt-1 text-[var(--text-muted)]">{total} منتج</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {/* Search */}
            <form method="GET">
              {searchParams.sort     && <input type="hidden" name="sort"     value={searchParams.sort} />}
              {searchParams.category && <input type="hidden" name="category" value={searchParams.category} />}
              <input
                name="q"
                defaultValue={searchParams.q}
                placeholder="ابحث عن منتج..."
                className="px-4 py-2.5 rounded-[var(--radius)] text-sm outline-none bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:border-blue-500 transition-colors"
                style={{ minWidth: '220px' }}
              />
            </form>

            {/* Sort */}
            <form method="GET" className="flex items-center gap-2">
              {searchParams.q        && <input type="hidden" name="q"        value={searchParams.q} />}
              {searchParams.category && <input type="hidden" name="category" value={searchParams.category} />}
              <select
                name="sort"
                defaultValue={searchParams.sort || 'newest'}
                className="px-4 py-2.5 rounded-[var(--radius)] text-sm outline-none cursor-pointer bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]"
              >
                <option value="featured">المميزة</option>
                <option value="newest">الأحدث</option>
                <option value="price_asc">السعر: من الأقل</option>
                <option value="price_desc">السعر: من الأعلى</option>
                <option value="popular">الأكثر مبيعًا</option>
                <option value="name_asc">الاسم: أ-ي</option>
              </select>
              <button type="submit" className="px-4 py-2.5 rounded-[var(--radius)] text-sm font-bold text-white bg-[var(--primary)] hover:opacity-90 transition-opacity">
                ترتيب
              </button>
            </form>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24 text-[var(--text-muted)] bg-[var(--surface)] rounded-[var(--radius)]">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-2xl font-semibold text-[var(--text)]">لا توجد منتجات مطابقة لعملية البحث</p>
            {searchParams.q && (
              <Link
                href={`/store/${subdomain}/products`}
                className="mt-4 inline-block text-base font-bold underline text-[var(--primary)]"
              >
                مسح البحث وعرض كل المنتجات
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination (Simple Next/Prev) */}
        {total > 20 && (
          <div className="flex justify-center gap-4 mt-12">
            {currentPage > 1 && (
              <Link
                href={`?page=${currentPage - 1}${searchParams.q ? `&q=${searchParams.q}` : ''}${searchParams.sort ? `&sort=${searchParams.sort}` : ''}`}
                className="px-6 py-2.5 rounded-[var(--radius)] text-sm font-bold bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:shadow-md transition-shadow"
              >
                ← الصفحة السابقة
              </Link>
            )}
            {total > currentPage * 20 && (
              <Link
                href={`?page=${currentPage + 1}${searchParams.q ? `&q=${searchParams.q}` : ''}${searchParams.sort ? `&sort=${searchParams.sort}` : ''}`}
                className="px-6 py-2.5 rounded-[var(--radius)] text-sm font-bold text-white bg-[var(--primary)] hover:opacity-90 shadow-lg"
              >
                الصفحة التالية →
              </Link>
            )}
          </div>
        )}
      </div>
    </StorePageShell>
  );
}
