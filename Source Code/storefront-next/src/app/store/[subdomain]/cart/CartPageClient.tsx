'use client';

import { useCart } from '@/components/CartProvider';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';

interface Props {
  subdomain: string;
}

export default function CartPageClient({ subdomain }: Props) {
  const { items, totalItems, totalPrice, removeItem, updateQty, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4 bg-[var(--background)]">
        <div className="p-6 rounded-full bg-[var(--surface)] border border-[var(--border)]">
          <ShoppingBag className="w-12 h-12 text-[var(--primary)]" />
        </div>
        <h2 className="text-3xl font-black text-[var(--text)] font-heading">سلتك فارغة</h2>
        <p className="text-base text-[var(--text-muted)] font-medium">لم تضف أي منتجات بعد</p>
        <Link
          href={`/store/${subdomain}/products`}
          className="px-8 py-3.5 rounded-[var(--radius)] font-bold text-sm text-white hover:opacity-90 transition-opacity bg-[var(--primary)] shadow-lg"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-[var(--background)]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-[var(--text)] font-heading">
          سلة التسوق ({totalItems})
        </h1>
        <button
          onClick={clearCart}
          className="text-sm font-bold flex items-center gap-2 hover:text-red-500 transition-colors text-[var(--text-muted)]"
        >
          <Trash2 className="w-4 h-4" /> إفراغ السلة
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)]"
            >
              {/* Image */}
              <div className="relative w-24 h-24 rounded-[var(--radius)] overflow-hidden flex-shrink-0 bg-[var(--background)]">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-base text-[var(--text)] line-clamp-2 pr-4">{item.name}</p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="hover:text-red-500 transition-colors text-[var(--text-muted)] p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Qty */}
                  <div className="flex items-center rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--background)]">
                    <button
                      onClick={() => updateQty(item.productId, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1.5 text-base hover:bg-[var(--surface)] text-[var(--text)] transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-[var(--text)]">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.quantity + 1)}
                      className="px-3 py-1.5 text-base hover:bg-[var(--surface)] text-[var(--text)] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Price */}
                  <span className="font-black text-lg text-[var(--primary)]">
                    {(item.price * item.quantity).toLocaleString()} ج.م
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="p-6 rounded-[var(--radius)] h-fit sticky top-24 bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <h3 className="font-black text-lg mb-6 text-[var(--text)]">ملخص الطلب</h3>
          <div className="space-y-4 text-base mb-6 text-[var(--text-muted)] font-medium">
            <div className="flex justify-between">
              <span>المنتجات ({totalItems})</span>
              <span>{totalPrice.toLocaleString()} ج.م</span>
            </div>
            <div className="flex justify-between">
              <span>الشحن</span>
              <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">مجانا</span>
            </div>
          </div>
          <div className="flex justify-between font-black text-xl py-4 border-t border-[var(--border)] text-[var(--text)]">
            <span>الإجمالي</span>
            <span className="text-[var(--primary)]">{totalPrice.toLocaleString()} ج.م</span>
          </div>

          <Link
            href={`/store/${subdomain}/checkout`}
            className="flex items-center justify-center w-full mt-6 py-4 rounded-[var(--radius)] font-bold text-white text-base transition-opacity hover:opacity-90 bg-[var(--primary)] shadow-md"
          >
            إتمام الشراء
          </Link>

          <Link
            href={`/store/${subdomain}/products`}
            className="block text-center mt-4 text-sm font-bold hover:underline text-[var(--primary)] opacity-90"
          >
            متابعة التسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
