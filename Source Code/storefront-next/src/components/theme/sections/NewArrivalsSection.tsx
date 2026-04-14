import React from 'react';
import Link from 'next/link';
import { ProductCard } from '../ProductCard';

export default function NewArrivalsSection({ settings, storeData }: { settings: Record<string, any>; storeData?: any }) {
  const {
    title = 'وصل حديثاً ✨',
    limit = 8,
  } = settings;

  const products: any[] = storeData?.products ?? [];
  // Show the last `limit` products as "new arrivals"
  const newProducts = [...products].reverse().slice(0, limit);

  return (
    <section className="py-16 bg-[var(--color-surface,#f9fafb)]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-[var(--color-text,#111)]">{title}</h2>
          <Link
            href="/products"
            className="text-[var(--color-primary,#3B82F6)] font-semibold hover:underline text-sm"
          >
            عرض الكل ←
          </Link>
        </div>

        {newProducts.length === 0 ? (
          <div className="py-12 text-center text-gray-400 bg-white rounded-xl border border-dashed">
            لا توجد منتجات جديدة لعرضها
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
