import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';

interface HeaderProps {
  id?: string;
  variant?: string;
  settings: Record<string, any>;
  blocks?: any[];
  storeData?: any;
}

export default function HeaderSection({ variant = 'split', settings = {}, storeData }: HeaderProps) {
  const merchant = storeData?.merchant || {};

  const {
    logoUrl,
    logoWidth = 120,
    isSticky = true,
    transparentOnHero = false,
    backgroundColor = '#ffffff',
    textColor = '#111827',
    borderBottom = true,
    showSearch = true,
    showUser = true,
    showCart = true,
    showAnnouncement = false,
    announcementText = '🎉 شحن مجاني على الطلبات فوق 200 جنيه',
  } = settings;

  const displayLogo = logoUrl || merchant.logo;
  const base = merchant.subdomain ? `/store/${merchant.subdomain}` : '';

  const bgStyle: React.CSSProperties = {
    backgroundColor: transparentOnHero ? 'transparent' : backgroundColor,
    color: textColor,
    borderBottom: borderBottom ? '1px solid var(--border)' : 'none',
  };

  const logoEl = displayLogo ? (
    <img src={displayLogo} alt={merchant.storeName} className="max-h-12 object-contain" style={{ width: `${logoWidth}px` }} />
  ) : (
    <span className="text-2xl font-black tracking-tight" style={{ color: textColor }}>{merchant.storeName || 'المتجر'}</span>
  );

  const actions = (
    <div className="flex items-center gap-3 md:gap-5">
      {showSearch && (
        <button title="بحث" className="p-2 hover:bg-black/5 rounded-full transition-colors hidden sm:block">
          <Search className="w-5 h-5" />
        </button>
      )}
      {showUser && (
        <button title="حسابي" className="p-2 hover:bg-black/5 rounded-full transition-colors hidden sm:block">
          <User className="w-5 h-5" />
        </button>
      )}
      {showCart && (
        <Link href={`${base}/cart`} title="السلة" className="p-2 hover:bg-black/5 rounded-full transition-colors relative flex items-center gap-2">
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold flex items-center justify-center">0</span>
          </div>
        </Link>
      )}
    </div>
  );

  const navLinks = (
    <nav className="hidden md:flex items-center gap-8 font-semibold">
      <Link href={base || '/'} className="hover:text-[var(--primary)] transition-colors">الرئيسية</Link>
      <Link href={`${base}/products`} className="hover:text-[var(--primary)] transition-colors">المنتجات</Link>
      <Link href={`${base}/categories`} className="hover:text-[var(--primary)] transition-colors">التصنيفات</Link>
      <Link href={`${base}/about`} className="hover:text-[var(--primary)] transition-colors">من نحن</Link>
    </nav>
  );

  return (
    <header className={`${isSticky ? 'sticky top-0' : ''} z-50 shadow-sm w-full`} style={bgStyle}>
      {/* Announcement Bar */}
      {showAnnouncement && announcementText && (
        <div className="text-center text-xs py-2 px-4 font-medium" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>
          {announcementText}
        </div>
      )}

      {/* Top info bar (only for split variant) */}
      {variant !== 'minimal' && (merchant.email || merchant.phone) && (
        <div className="hidden md:flex justify-between items-center py-1.5 px-4 text-xs opacity-70 border-b border-black/10">
          <div className="flex gap-4">
            {merchant.email && <span>✉️ {merchant.email}</span>}
            {merchant.phone && <span>📞 {merchant.phone}</span>}
          </div>
          <div className="flex gap-4">
            <span>تتبع الطلب</span>
            <span>الأسئلة الشائعة</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* ─── SPLIT variant: Logo left, Nav center/right ─── */}
        {(variant === 'split' || !variant) && (
          <div className="flex justify-between items-center h-16 md:h-20">
            <button className="md:hidden p-2 hover:bg-black/5 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <Link href={base || '/'} className="flex-shrink-0">{logoEl}</Link>
            {navLinks}
            {actions}
          </div>
        )}

        {/* ─── CENTERED variant: Logo center, Nav below ─── */}
        {variant === 'centered' && (
          <div className="flex flex-col items-center gap-2 py-4">
            <Link href={base || '/'}>{logoEl}</Link>
            {navLinks}
          </div>
        )}

        {/* ─── MINIMAL variant: Logo + hamburger only ─── */}
        {variant === 'minimal' && (
          <div className="flex justify-between items-center h-14">
            <Link href={base || '/'}>{logoEl}</Link>
            <div className="flex items-center gap-2">
              {actions}
              <button className="p-2 hover:bg-black/5 rounded-lg transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
