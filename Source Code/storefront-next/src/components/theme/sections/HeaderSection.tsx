import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';

export default function HeaderSection({ settings = {}, storeData }: { settings?: Record<string, any>, storeData?: any }) {
  const merchant = storeData?.merchant || {};
  const { 
    logoUrl,
    logoWidth = 120,
    showSearch = true,
    showUser = true,
    showCart = true,
    backgroundColor = 'var(--background)',
    textColor = 'var(--text)',
  } = settings;

  const displayLogo = logoUrl || merchant.logo;

  return (
    <header className="sticky top-0 z-50 shadow-sm border-b border-[var(--border)]" style={{ backgroundColor, color: textColor }}>
      <div className="container mx-auto px-4">
        {/* Top Info Bar */}
        <div className="hidden md:flex justify-between items-center py-1.5 text-xs text-[var(--text-muted)] border-b border-[var(--border)]">
          <div className="flex gap-4">
            {merchant.email && <span>✉️ {merchant.email}</span>}
            {merchant.phone && <span>📞 {merchant.phone}</span>}
          </div>
          <div className="flex gap-4">
            <span>تتبع الطلب</span>
            <span>الأسئلة الشائعة</span>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-[var(--text)] hover:opacity-70 transition-opacity">
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href={`/store/${merchant.subdomain}`} className="flex-shrink-0 flex items-center justify-center md:justify-start">
            {displayLogo ? (
              <img 
                src={displayLogo} 
                alt={merchant.storeName} 
                className="max-h-12 object-contain"
                style={{ width: `${logoWidth}px` }}
              />
            ) : (
              <span className="text-2xl font-black tracking-tight text-[var(--text)]">{merchant.storeName || 'المتجر'}</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-semibold text-[var(--text)]">
            <Link href={merchant.subdomain ? `/store/${merchant.subdomain}` : '/'} className="hover:text-[var(--primary)] transition-colors">الرئيسية</Link>
            <Link href={merchant.subdomain ? `/store/${merchant.subdomain}/products` : '/products'} className="hover:text-[var(--primary)] transition-colors">المنتجات</Link>
            <Link href={merchant.subdomain ? `/store/${merchant.subdomain}/categories` : '/categories'} className="hover:text-[var(--primary)] transition-colors">التصنيفات</Link>
            <Link href={merchant.subdomain ? `/store/${merchant.subdomain}/about` : '/about'} className="hover:text-[var(--primary)] transition-colors">من نحن</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-5 text-[var(--text)]">
            {showSearch && (
              <button 
                title="بحث"
                className="p-2 hover:bg-[var(--surface)] hover:text-[var(--primary)] rounded-full transition-colors hidden sm:block"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            
            {showUser && (
              <button 
                title="حسابي"
                className="p-2 hover:bg-[var(--surface)] hover:text-[var(--primary)] rounded-full transition-colors hidden sm:block"
              >
                <User className="w-5 h-5" />
              </button>
            )}
            
            {showCart && (
              <Link 
                href={merchant.subdomain ? `/store/${merchant.subdomain}/cart` : '/cart'} 
                title="السلة"
                className="p-2 hover:bg-[var(--surface)] hover:text-[var(--primary)] rounded-full transition-colors relative flex items-center gap-2"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold flex items-center justify-center">
                    0
                  </span>
                </div>
                <span className="hidden lg:block font-bold mt-1 text-sm bg-[var(--surface)] px-2 py-0.5 rounded">0.00 ج.م</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
