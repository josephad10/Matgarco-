'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { ShoppingCart, Check } from 'lucide-react';

interface Props {
  product: any;
  subdomain: string;
  relatedProducts?: any[];
}

function getImageUrl(img: any): string {
  if (!img) return '';
  return typeof img === 'string' ? img : img.url || '';
}

export default function ProductDetailClient({ product, subdomain, relatedProducts = [] }: Props) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const images   = product.images || [];
  const main     = getImageUrl(images[selectedImage]) || '';
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: main,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm mb-8 text-[var(--text-muted)]">
        <Link href={`/store/${subdomain}`} className="hover:underline">الرئيسية</Link>
        <span className="mx-2">/</span>
        <Link href={`/store/${subdomain}/products`} className="hover:underline">المنتجات</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--text)]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-[var(--surface)]">
            {main ? (
              <Image src={main} alt={product.name} fill className="object-contain" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">📦</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img: any, i: number) => {
                const url = getImageUrl(img);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className="relative aspect-square rounded-lg overflow-hidden transition-all bg-[var(--surface)]"
                    style={{
                      border: i === selectedImage ? `2px solid var(--primary)` : `1px solid var(--border)`,
                    }}
                  >
                    {url && <Image src={url} alt={`${product.name} ${i + 1}`} fill className="object-cover" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <p className="text-sm mb-2 text-[var(--text-muted)]">{product.category}</p>
          )}
          <h1 className="text-2xl md:text-3xl font-black mb-4 text-[var(--text)] font-heading">
            {product.name}
          </h1>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-black text-[var(--primary)]">
              {product.price?.toLocaleString()} ج.م
            </span>
            {hasDiscount && (
              <span className="text-lg line-through text-[var(--text-muted)]">
                {product.comparePrice?.toLocaleString()}
              </span>
            )}
            {hasDiscount && (
              <span className="px-2 py-0.5 rounded-full text-sm font-bold text-white bg-red-500">
                خصم {Math.round((1 - product.price / product.comparePrice) * 100)}%
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm leading-relaxed mb-6 text-[var(--text-muted)] whitespace-pre-line">
              {product.description}
            </p>
          )}

          {/* Qty + CTA */}
          {!isOutOfStock ? (
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Qty selector */}
              <div className="flex items-center rounded-[var(--radius)] overflow-hidden bg-[var(--surface)] border border-[var(--border)]">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-3 text-lg font-bold hover:opacity-70 text-[var(--text)]"
                >
                  −
                </button>
                <span className="px-4 font-semibold text-[var(--text)]">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-3 text-lg font-bold hover:opacity-70 text-[var(--text)]"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-[var(--radius)] font-bold transition-all hover:opacity-90 active:scale-95 text-white"
                style={{ backgroundColor: added ? '#22C55E' : 'var(--primary)' }}
              >
                {added ? (
                  <><Check className="w-5 h-5" /> تمت الإضافة!</>
                ) : (
                  <><ShoppingCart className="w-5 h-5" /> أضف للسلة</>
                )}
              </button>
            </div>
          ) : (
            <div className="py-3 px-6 rounded-[var(--radius)] text-center font-bold text-sm bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]">
              هذا المنتج نفذ من المخزون
            </div>
          )}

          {/* Stock */}
          {!isOutOfStock && product.stock <= 5 && (
            <p className="text-xs mt-3 text-orange-500 font-medium">⚠️ باقي {product.stock} قطع فقط!</p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-black mb-6 text-[var(--text)]">منتجات قد تعجبك</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((rp: any) => {
              const img = getImageUrl(rp.images?.[0]);
              return (
                <Link
                  key={rp._id}
                  href={`/store/${subdomain}/products/${rp.slug || rp._id}`}
                  className="group block rounded-[var(--radius)] overflow-hidden hover:shadow-md transition-shadow bg-[var(--surface)] border border-[var(--border)]"
                >
                  <div className="relative aspect-square bg-[var(--background)]">
                    {img ? <Image src={img} alt={rp.name} fill className="object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold line-clamp-1 text-[var(--text)]">{rp.name}</p>
                    <p className="text-sm font-bold mt-1 text-[var(--primary)]">{rp.price?.toLocaleString()} ج.م</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
