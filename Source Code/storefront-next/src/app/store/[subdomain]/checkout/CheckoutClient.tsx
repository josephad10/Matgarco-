'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, ShoppingBag, MapPin, User, CreditCard, Banknote, ArrowRight, ExternalLink } from 'lucide-react';

interface Props {
  subdomain: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CheckoutClient({ subdomain }: Props) {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();
  const currency = 'ج.م';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    notes: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        subdomain,
        customerInfo: {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
        },
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          street: form.street,
          city: form.city,
          state: form.state || form.city,
          country: 'EG',
          postalCode: '',
        },
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          productImage: item.image || '',
          variantId: undefined,
          variantName: item.variant || undefined,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        subtotal: totalPrice,
        tax: 0,
        shippingCost: 0,
        discount: 0,
        total: totalPrice,
        paymentMethod,
        customerNotes: form.notes,
      };

      if (paymentMethod === 'card') {
        const orderRes = await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.message || 'فشل إنشاء الطلب');

        const orderId = orderData.data?.order?._id || orderData.data?._id;

        const intentionRes = await fetch(`${API_URL}/payments/create-intention`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            customerInfo: payload.customerInfo,
            shippingAddress: payload.shippingAddress,
            items: payload.items,
            total: payload.total,
          }),
        });
        const intentionData = await intentionRes.json();
        if (!intentionRes.ok) throw new Error(intentionData.message || 'فشل تهيئة الدفع');

        clearCart();
        window.location.href = intentionData.data.paymentUrl;
        return;
      }

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'حدث خطأ أثناء إرسال الطلب');

      const orderId = data.data?.order?._id || data.data?._id;
      clearCart();
      router.push(`/store/${subdomain}/orders/${orderId}`);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مجدداً');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4 bg-[var(--background)]">
        <div className="p-6 rounded-full bg-[var(--surface)] border border-[var(--border)]">
          <ShoppingBag className="w-12 h-12 text-[var(--primary)]" />
        </div>
        <h2 className="text-3xl font-black text-[var(--text)] font-heading">سلتك فارغة</h2>
        <p className="text-base text-[var(--text-muted)] font-medium">أضف منتجات لتكمل عملية الشراء</p>
        <Link
          href={`/store/${subdomain}/products`}
          className="px-8 py-3.5 rounded-[var(--radius)] font-bold text-sm text-white hover:opacity-90 transition-opacity bg-[var(--primary)] shadow-lg"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  function InputField({ label, name, type = 'text', required = false, placeholder = '' }: any) {
    return (
      <div>
        <label className="block text-sm font-bold mb-2 text-[var(--text-muted)]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          name={name}
          value={(form as any)[name]}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-3.5 rounded-[var(--radius)] text-base transition-colors focus:ring-2 focus:ring-[var(--primary)] bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] outline-none placeholder:text-[var(--border)]"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-[var(--background)]">
      <nav className="flex items-center gap-2 text-sm mb-10 text-[var(--text-muted)] font-medium">
        <Link href={`/store/${subdomain}`} className="hover:underline">الرئيسية</Link>
        <span>/</span>
        <Link href={`/store/${subdomain}/cart`} className="hover:underline">السلة</Link>
        <span>/</span>
        <span className="text-[var(--text)]">الدفع</span>
      </nav>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <section className="rounded-[var(--radius)] p-8 bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[var(--primary)] bg-opacity-10 rounded-lg">
                <User className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <h2 className="font-black text-xl text-[var(--text)] font-heading">البيانات الشخصية</h2>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <InputField label="الاسم الأول" name="firstName" required placeholder="أحمد" />
              <InputField label="الاسم الأخير" name="lastName" required placeholder="محمد" />
            </div>
            <div className="mt-5">
              <InputField label="رقم الهاتف" name="phone" type="tel" required placeholder="01xxxxxxxxx" />
            </div>
            <div className="mt-5">
              <InputField label="البريد الإلكتروني" name="email" type="email" placeholder="example@email.com" />
            </div>
          </section>

          <section className="rounded-[var(--radius)] p-8 bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[var(--primary)] bg-opacity-10 rounded-lg">
                <MapPin className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <h2 className="font-black text-xl text-[var(--text)] font-heading">عنوان الشحن</h2>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <InputField label="المحافظة / المدينة" name="city" required placeholder="القاهرة" />
              <InputField label="المنطقة / الحي" name="state" placeholder="مدينة نصر" />
            </div>
            <div className="mt-5">
              <InputField label="العنوان بالتفصيل" name="street" required placeholder="الشارع، رقم المبنى، الدور..." />
            </div>
            <div className="mt-5">
              <label className="block text-sm font-bold mb-2 text-[var(--text-muted)]">ملاحظات للطلب</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="أي تعليمات خاصة للتوصيل..."
                className="w-full px-4 py-3.5 rounded-[var(--radius)] text-base transition-colors focus:ring-2 focus:ring-[var(--primary)] bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] outline-none resize-none"
              />
            </div>
          </section>

          <section className="rounded-[var(--radius)] p-8 bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[var(--primary)] bg-opacity-10 rounded-lg">
                <CreditCard className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <h2 className="font-black text-xl text-[var(--text)] font-heading">طريقة الدفع</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-start gap-4 p-5 rounded-[var(--radius)] border-2 text-right transition-all ${paymentMethod === 'cash' ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-5' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${paymentMethod === 'cash' ? 'border-[var(--primary)]' : 'border-[var(--border)]'}`}>
                  {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />}
                </div>
                <div>
                  <div className={`text-base font-bold mb-1 ${paymentMethod === 'cash' ? 'text-[var(--primary)]' : 'text-[var(--text)]'}`}>الدفع عند الاستلام</div>
                  <div className="text-sm text-[var(--text-muted)]">كاش أو بطاقة مع المندوب</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-start gap-4 p-5 rounded-[var(--radius)] border-2 text-right transition-all ${paymentMethod === 'card' ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-5' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${paymentMethod === 'card' ? 'border-[var(--primary)]' : 'border-[var(--border)]'}`}>
                  {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />}
                </div>
                <div>
                  <div className={`text-base font-bold mb-1 ${paymentMethod === 'card' ? 'text-[var(--primary)]' : 'text-[var(--text)]'}`}>بطاقة بنكية</div>
                  <div className="text-sm text-[var(--text-muted)]">Visa, Mastercard آمن 100%</div>
                </div>
              </button>
            </div>
            {paymentMethod === 'card' && (
              <div className="mt-4 p-4 rounded-[var(--radius)] text-sm font-medium flex items-center gap-3 bg-[var(--primary)] bg-opacity-10 text-[var(--primary)]">
                <ExternalLink className="w-5 h-5 flex-shrink-0" />
                سيتم تحويلك لبوابة الدفع الآمنة عقب تأكيد الطلب
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="rounded-[var(--radius)] overflow-hidden sticky top-32 bg-[var(--surface)] border border-[var(--border)] shadow-lg">
            <div className="px-6 py-5 border-b border-[var(--border)] bg-[var(--background)]">
              <h3 className="font-black text-lg text-[var(--text)] font-heading">
                ملخص الطلب ({totalItems} منتج)
              </h3>
            </div>

            <div className="divide-y divide-[var(--border)] max-h-[40vh] overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId + (item.variant || '')} className="flex items-center gap-4 px-6 py-4">
                  <div className="relative w-16 h-16 rounded-[var(--radius)] overflow-hidden flex-shrink-0 bg-[var(--background)] border border-[var(--border)]">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm">
                        <ShoppingBag className="w-6 h-6 text-[var(--border)]" />
                      </div>
                    )}
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[11px] font-black text-white flex items-center justify-center bg-[var(--primary)] shadow-md">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-bold text-[var(--text)] line-clamp-2 leading-snug">{item.name}</p>
                    {item.variant && <p className="text-xs mt-1 font-medium text-[var(--text-muted)]">{item.variant}</p>}
                  </div>
                  <span className="text-sm font-black flex-shrink-0 text-[var(--primary)]">
                    {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-6 py-5 space-y-4 border-t border-[var(--border)] bg-[var(--background)]">
              <div className="flex justify-between text-sm font-medium text-[var(--text-muted)]">
                <span>المجموع الفرعي</span>
                <span>{totalPrice.toLocaleString()} {currency}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-[var(--text-muted)]">
                <span>رسوم التوصيل</span>
                <span className="text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full font-bold">مجاناً</span>
              </div>
              <div className="flex justify-between font-black text-xl pt-5 border-t border-[var(--border)] text-[var(--text)]">
                <span>الإجمالي الطلب</span>
                <span className="text-[var(--primary)]">{totalPrice.toLocaleString()} {currency}</span>
              </div>
            </div>

            {error && (
              <div className="mx-6 mb-5 p-4 rounded-[var(--radius)] text-sm font-bold text-red-700 bg-red-50 border border-red-200 flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}

            <div className="px-6 pb-6 bg-[var(--background)]">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-[var(--radius)] font-black text-base text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0 disabled:shadow-none bg-[var(--primary)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {paymentMethod === 'card' ? 'جاري التحويل...' : 'جاري التأكيد...'}
                  </>
                ) : (
                  <>
                    {paymentMethod === 'card' ? (
                      <>
                        <CreditCard className="w-5 h-5" />
                        ادفع الآن
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5 ml-1" />
                        تأكيد الطلب
                      </>
                    )}
                  </>
                )}
              </button>
              
              <Link
                href={`/store/${subdomain}/cart`}
                className="block text-center mt-5 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              >
                ← العودة وتعديل السلة
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
