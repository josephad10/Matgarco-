import { notFound } from 'next/navigation';
import Link from 'next/link';
import StorePageShell from '@/components/StorePageShell';
import { fetchStorefrontTheme } from '@/lib/api';
import { CheckCircle, Package, MapPin, Phone, Mail, ArrowLeft, User } from 'lucide-react';

interface Props {
  params: { subdomain: string; id: string };
}

async function fetchOrder(orderId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${orderId}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.order ?? null;
  } catch {
    return null;
  }
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { subdomain, id } = params;

  const [themeRes, order] = await Promise.all([
    fetchStorefrontTheme(subdomain),
    fetchOrder(id),
  ]);

  if (!themeRes) return notFound();

  const currency = 'ج.م';

  return (
    <StorePageShell subdomain={subdomain}>
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 bg-green-50 border-[6px] border-green-100 shadow-sm">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-black mb-3 text-[var(--text)] font-heading">
            تم تأكيد طلبك! 🎉
          </h1>
          <p className="text-base font-medium text-[var(--text-muted)]">
            شكراً لتسوقك معنا. سنتواصل معك قريباً لتأكيد موعد التسليم.
          </p>
          {order && (
            <div className="inline-flex items-center mt-6 px-6 py-2.5 rounded-full text-sm font-black bg-[var(--primary)] bg-opacity-10 text-[var(--primary)] border border-[var(--primary)] border-opacity-20 shadow-sm">
              رقم الطلب: <span className="ml-2 font-mono text-base">{order.orderNumber}</span>
            </div>
          )}
        </div>

        {order ? (
          <div className="space-y-6">
            {/* Order Items */}
            <div className="rounded-[var(--radius)] overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-md">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--border)] bg-[var(--background)]">
                <div className="p-2 bg-[var(--primary)] bg-opacity-10 rounded-lg">
                  <Package className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <h2 className="font-black text-lg text-[var(--text)] font-heading">المنتجات المطلوبة</h2>
              </div>
              <div className="divide-y divide-[var(--border)] max-h-96 overflow-y-auto">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-bold text-base text-[var(--text)]">{item.productName}</p>
                      <p className="text-sm font-medium text-[var(--text-muted)] mt-1">الكمية: {item.quantity}</p>
                    </div>
                    <span className="text-base font-black flex-shrink-0 text-[var(--primary)]">
                      {item.subtotal?.toLocaleString()} {currency}
                    </span>
                  </div>
                ))}
              </div>
              {/* Total */}
              <div className="flex justify-between items-center px-6 py-5 border-t border-[var(--border)] bg-[var(--background)]">
                <span className="font-black text-lg text-[var(--text-muted)]">الإجمالي الكلي</span>
                <span className="text-2xl font-black text-[var(--primary)]">
                  {order.total?.toLocaleString()} {currency}
                </span>
              </div>
            </div>

            {/* Shipping Info */}
            {order.shippingAddress && (
              <div className="rounded-[var(--radius)] p-6 space-y-4 border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[var(--primary)] bg-opacity-10 rounded-lg">
                    <MapPin className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <h2 className="font-black text-lg text-[var(--text)] font-heading">معلومات الشحن</h2>
                </div>
                
                <div className="space-y-3 pr-2">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 mt-0.5 text-[var(--text-muted)]" />
                    <div>
                      <p className="font-bold text-sm text-[var(--text)]">مستلم الطلب</p>
                      <p className="text-base text-[var(--text-muted)]">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 text-[var(--text-muted)]" />
                    <div>
                      <p className="font-bold text-sm text-[var(--text)]">العنوان</p>
                      <p className="text-base text-[var(--text-muted)]">
                        {order.shippingAddress.street}، {order.shippingAddress.state}، {order.shippingAddress.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-8 mt-2 pt-4 border-t border-[var(--border)] border-dashed">
                    {order.customerInfo?.phone && (
                      <span className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
                        <Phone className="w-4 h-4" /> {order.customerInfo.phone}
                      </span>
                    )}
                    {order.customerInfo?.email && (
                      <span className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
                        <Mail className="w-4 h-4" /> {order.customerInfo.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[var(--radius)] p-10 text-center bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-lg font-bold text-[var(--text-muted)]">تم استلام طلبك بنجاح! جاري معالجة البيانات.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href={`/store/${subdomain}/products`}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[var(--radius)] font-black text-base text-white transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg bg-[var(--primary)]"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة لمتابعة التسوق
          </Link>
        </div>
      </div>
    </StorePageShell>
  );
}
