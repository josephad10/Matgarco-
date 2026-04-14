import React from 'react';
import Link from 'next/link';

export function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block h-full bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img 
          src={product.images?.[0] || 'https://picsum.photos/400/500?random=' + product._id} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.compareAtPrice > product.price && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            تخفيض
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col justify-between h-[130px]">
        <h3 className="font-bold text-base text-[var(--text)] line-clamp-2 mb-2 group-hover:text-[var(--primary)] transition-colors leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-bold text-[var(--text)] text-lg">
            {product.price.toLocaleString()} ج.م
          </span>
          {product.compareAtPrice > product.price && (
            <span className="text-sm text-[var(--text-muted)] line-through relative top-0.5">
              {product.compareAtPrice.toLocaleString()} ج.م
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
