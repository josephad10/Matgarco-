import React from 'react';
import Link from 'next/link';

export default function FooterSection({ settings = {}, storeData }: { settings: Record<string, any>, storeData?: any }) {
  const merchant = storeData?.merchant || {};
  const { 
    aboutText = 'متجر يوفر لك أفضل المنتجات بأعلى جودة. تسوق الآن واحصل على عروض حصرية.', 
    copyrightText = `© ${new Date().getFullYear()} جميع الحقوق محفوظة`,
    backgroundColor = '#0f172a',
    textColor = '#f8fafc',
    showNewsletter = true,
  } = settings;

  return (
    <footer style={{ backgroundColor, color: textColor }} className="pt-20 pb-8 border-t border-gray-800 relative z-10 w-full mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Logo & About */}
          <div className="lg:pr-4">
            <h3 className="text-3xl font-bold mb-6 tracking-tight text-white">{merchant.storeName || 'المتجر'}</h3>
            <p className="text-base opacity-70 leading-relaxed mb-6 font-medium">
              {aboutText}
            </p>
            {merchant.email && (
              <p className="text-sm flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity mb-3">
                <span className="text-xl">✉️</span> {merchant.email}
              </p>
            )}
            {merchant.phone && (
              <p className="text-sm flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
                <span className="text-xl">📞</span> {merchant.phone}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-white">روابط سريعة</h4>
            <ul className="space-y-4 font-medium opacity-80">
              <li><Link href={merchant.subdomain ? `/store/${merchant.subdomain}` : '/'} className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>الرئيسية</Link></li>
              <li><Link href={merchant.subdomain ? `/store/${merchant.subdomain}/products` : '/products'} className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>المتجر</Link></li>
              <li><Link href={merchant.subdomain ? `/store/${merchant.subdomain}/categories` : '/categories'} className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>من نحن</Link></li>
              <li><Link href={merchant.subdomain ? `/store/${merchant.subdomain}/contact` : '/contact'} className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>اتصل بنا</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-white">خدمة العملاء</h4>
            <ul className="space-y-4 font-medium opacity-80">
              <li><Link href={merchant.subdomain ? `/store/${merchant.subdomain}/faq` : '/faq'} className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>الأسئلة الشائعة</Link></li>
              <li><Link href={merchant.subdomain ? `/store/${merchant.subdomain}/shipping` : '/shipping'} className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>سياسة الشحن</Link></li>
              <li><Link href={merchant.subdomain ? `/store/${merchant.subdomain}/returns` : '/returns'} className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>سياسة الاسترجاع</Link></li>
              <li><Link href={merchant.subdomain ? `/store/${merchant.subdomain}/privacy` : '/privacy'} className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>سياسة الخصوصية</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          {showNewsletter && (
            <div>
              <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-white">القائمة البريدية</h4>
              <p className="text-sm opacity-70 mb-6 leading-relaxed font-medium">اشترك معنا الآن ليصلك كل جديد وعروض حصرية فور إطلاقها.</p>
              <form className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="البريد الإلكتروني" 
                  className="px-4 py-3 w-full rounded text-gray-900 bg-white/95 focus:bg-white border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all font-medium"
                />
                <button 
                  type="button" 
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded transition-colors shadow-lg shadow-blue-500/30"
                >
                  اشترك الآن
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-60 font-medium">{copyrightText}</p>
          <div className="flex items-center gap-2 text-sm opacity-60 font-medium bg-black/20 px-4 py-2 rounded-full">
            <span>Powered by</span>
            <a href="https://matgarco.com" target="_blank" rel="noreferrer" className="font-bold text-white hover:text-blue-400 transition-colors flex items-center gap-1">
              Matgarco <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
