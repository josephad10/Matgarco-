"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { LangToggle } from "@/components/islands/LangToggle";
import { useUIStore } from "@/store/useUIStore";
import { useEffect } from "react";

export function Navbar() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const pathname = usePathname();
  const { t, lang } = useLanguage();

  const navLinks = [
    { href: "/features", label: t.nav?.features || "Features" },
    { href: "/solutions", label: t.nav?.solutions || "Solutions" },
    { href: "/pricing", label: t.nav?.pricing || "Pricing" },
    { href: "/resources", label: t.nav?.resources || "Resources" },
    { href: "/about", label: t.nav?.about || "About Us" },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] h-20 flex items-center text-white shrink-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-full">
        
        <Link href="/" className="flex items-center gap-2 relative z-50 shrink-0 outline-none">
          <Image
            src="/logo.svg"
            alt="Matgarco"
            width={195}
            height={48}
            className="object-contain transition-all duration-300"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 font-medium z-50 h-full ms-auto pe-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-3 rounded-lg transition-all duration-200 text-sm flex items-center outline-none",
                lang === 'ar' ? 'leading-[1.6] tracking-normal' : 'tracking-tighter',
                pathname === link.href
                  ? "bg-white/10 font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3 z-50 h-full shrink-0">
          <LangToggle />
          <a
            href="http://localhost:3002/login"
            className={cn(
              "px-4 py-3 font-bold text-white hover:text-[#3B82F6] transition-colors rounded-lg text-sm flex items-center outline-none",
              lang === 'ar' ? 'leading-[1.6] tracking-normal' : 'tracking-tighter'
            )}
          >
            {t.nav?.login || "Login"}
          </a>
          <a
            href="http://localhost:3002/register"
            className={cn(
              "px-5 py-3 bg-[#000080] text-white font-black hover:bg-blue-900 transition-transform active:scale-95 shadow-[0_4px_15px_rgba(0,0,128,0.4)] rounded-xl text-sm flex items-center outline-none",
              lang === 'ar' ? 'leading-[1.6] tracking-normal' : 'tracking-tighter'
            )}
          >
            {t.nav?.cta || "Start Free"}
          </a>
        </div>

        <div className="flex lg:hidden items-center gap-2 relative z-50 h-full shrink-0 ms-auto">
          <LangToggle />
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/20 outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 bg-[#050505]/95 z-40 flex flex-col pt-24 px-6 pb-8 transition-all duration-300 lg:hidden text-white overflow-y-auto will-change-transform",
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-2 flex-grow">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-6 py-4 rounded-2xl text-lg font-bold transition-colors outline-none",
                lang === 'ar' ? 'leading-[1.6] tracking-normal' : 'tracking-tighter',
                pathname === link.href
                  ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "text-white/80 hover:bg-white/5 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
          <a
            href="http://localhost:3002/login"
            className={cn(
              "px-6 py-4 text-center font-bold text-white hover:text-[#3B82F6] rounded-2xl border border-white/20 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] outline-none",
              lang === 'ar' ? 'leading-[1.6] tracking-normal' : 'tracking-tighter'
            )}
          >
            {t.nav?.login || "Login"}
          </a>
          <a
            href="http://localhost:3002/register"
            className={cn(
              "px-6 py-4 text-center bg-[#000080] text-white font-black rounded-2xl shadow-[0_4px_15px_rgba(0,0,128,0.4)] hover:bg-blue-900 transition-colors outline-none",
              lang === 'ar' ? 'leading-[1.6] tracking-normal' : 'tracking-tighter'
            )}
          >
            {t.nav?.cta || "Start Free"}
          </a>
        </div>
      </div>
    </header>
  );
}
