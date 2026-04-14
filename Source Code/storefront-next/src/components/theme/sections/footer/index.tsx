import React from 'react';
import Link from 'next/link';

interface FooterProps {
  id?: string;
  variant?: string;
  settings: Record<string, any>;
  blocks?: any[];
  storeData?: any;
}

export default function FooterSection({ variant = 'classic', settings = {}, storeData }: FooterProps) {
  const merchant = storeData?.merchant || {};

  const {
    backgroundColor = '#0f172a',
    textColor = '#f8fafc',
    aboutText = 'متجر يوفر لك أفضل المنتجات بأعلى جودة. تسوق الآن واحصل على عروض حصرية.',
    copyrightText = `© ${new Date().getFullYear()} جميع الحقوق محفوظة`,
    showNewsletter = true,
    showQuickLinks = true,
    showSupportLinks = true,
  } = settings;

  const base = merchant.subdomain ? `/store/${merchant.subdomain}` : '';

  const quickLinks = [
    { label: 'الرئيسية',    href: base || '/' },
    { label: 'المتجر',      href: `${base}/products` },
    { label: 'التصنيفات',   href: `${base}/categories` },
    { label: 'من نحن',      href: `${base}/about` },
    { label: 'اتصل بنا',   href: `${base}/contact` },
  ];

  const supportLinks = [
    { label: 'الأسئلة الشائعة',    href: `${base}/faq` },
    { label: 'سياسة الشحن',        href: `${base}/shipping` },
    { label: 'سياسة الاسترجاع',    href: `${base}/returns` },
    { label: 'سياسة الخصوصية',     href: `${base}/privacy` },
  ];

  // ─── MINIMAL variant ──────────────────────────────────────────────────────
  if (variant === 'minimal') {
    return (
      <footer style={{ backgroundColor, color: textColor }} className="py-6 border-t border-white/10 w-full mt-auto">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm opacity-70">
          <p className="font-medium">{copyrightText}</p>
          <div className="flex gap-6">
            {quickLinks.slice(0, 4).map(l => (
              <Link key={l.href} href={l.href} className="hover:opacity-100 transition-opacity">{l.label}</Link>
            ))}
          </div>
          <p className="text-xs">Powered by <a href="https://matgarco.com" target="_blank" rel="noreferrer" className="font-bold text-white">Matgarco</a></p>
        </div>
      </footer>
    );
  }

  // ─── CLASSIC variant (default) ────────────────────────────────────────────
  return (
    <footer style={{ backgroundColor, color: textColor }} className="pt-20 pb-8 border-t border-white/10 w-full mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-bold mb-6 tracking-tight text-white">{merchant.storeName || 'المتجر'}</h3>
            <p className="text-base opacity-70 leading-relaxed mb-6 font-medium">{aboutText}</p>
            {merchant.email && <p className="text-sm flex items-center gap-2 opacity-80 mb-2">✉️ {merchant.email}</p>}
            {merchant.phone && <p className="text-sm flex items-center gap-2 opacity-80">📞 {merchant.phone}</p>}
          </div>

          {/* Quick Links */}
          {showQuickLinks && (
            <div>
              <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-white">روابط سريعة</h4>
              <ul className="space-y-3 font-medium opacity-80">
                {quickLinks.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white transition-colors flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>{l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Support */}
          {showSupportLinks && (
            <div>
              <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-white">خدمة العملاء</h4>
              <ul className="space-y-3 font-medium opacity-80">
                {supportLinks.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white transition-colors flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>{l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Newsletter */}
          {showNewsletter && (
            <div>
              <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-white">القائمة البريدية</h4>
              <p className="text-sm opacity-70 mb-6 leading-relaxed">اشترك معنا ليصلك كل جديد وعروض حصرية.</p>
              <form className="flex flex-col gap-3">
                <input type="email" placeholder="البريد الإلكتروني"
                  className="px-4 py-3 w-full rounded text-gray-900 bg-white/95 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all font-medium" />
                <button type="button" className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded transition-colors">
                  اشترك الآن
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-60 font-medium">{copyrightText}</p>
          <div className="flex items-center gap-2 text-sm opacity-60 bg-black/20 px-4 py-2 rounded-full">
            <span>Powered by</span>
            <a href="https://matgarco.com" target="_blank" rel="noreferrer" className="font-bold text-white hover:text-blue-400 transition-colors">Matgarco</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
