import React from 'react';
import Link from 'next/link';
import { ProductCard } from '../ProductCard';

export default function FeaturedProductsSection({ settings, storeData }: { settings: Record<string, any>, storeData?: any }) {
  const {
    title = 'منتجات مميزة',
    subtitle = 'اكتشف أحدث المنتجات المضافة لمتجرنا',
    viewAllText = 'عرض الكل',
    viewAllLink = '/store',
    layout = 'grid', // grid, carousel
    limit = 8,
  } = settings;

  const products = storeData?.products || [];
  const displayProducts = products.slice(0, limit);

  return (
    <section className="py-16 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-[var(--text)] mb-2">{title}</h2>
            {subtitle && <p className="text-[var(--text-muted)] text-lg">{subtitle}</p>}
          </div>
          {viewAllText && (
            <Link 
              href={viewAllLink}
              className="mt-4 md:mt-0 text-[var(--primary)] font-medium hover:underline flex items-center gap-1"
            >
              {viewAllText}
            </Link>
          )}
        </div>

        {displayProducts.length === 0 ? (
          <div className="py-12 text-center text-[var(--text-muted)] bg-[var(--surface)] rounded-[var(--radius)]">
            لا توجد منتجات مميزة لعرضها حالياً
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
