"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t, toggleLang, lang, isRTL } = useLanguage();

  const navLinks = [
    { href: "/features", label: t.nav.features },
    { href: "/solutions", label: t.nav.solutions },
    { href: "/pricing", label: t.nav.pricing },
    { href: "/resources", label: t.nav.resources },
    { href: "/about", label: t.nav.about },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/80 py-1 shadow-sm"
          : "bg-transparent py-2"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-50">
          <Image
            src="/logo.svg"
            alt="Matgarco Logo"
            width={140}
            height={30}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-lg transition-all duration-200 text-sm",
                pathname === link.href
                  ? "text-matgarco-700 bg-matgarco-50 font-bold"
                  : "text-slate-600 hover:text-matgarco-700 hover:bg-slate-50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-matgarco-700 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
            title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
          >
            <Globe size={16} />
            <span>{t.nav.langToggle}</span>
          </button>

          <a
            href="http://localhost:3002/login"
            className="px-4 py-2.5 font-bold text-slate-600 hover:text-matgarco-700 transition-colors rounded-lg hover:bg-slate-50 text-sm"
          >
            {t.nav.login}
          </a>
          <a
            href="http://localhost:3002/register"
            className="px-5 py-2.5 bg-matgarco-700 text-white font-bold rounded-xl hover:bg-matgarco-800 transition-all shadow-md shadow-matgarco-500/20 hover:shadow-lg hover:shadow-matgarco-500/30 hover:-translate-y-0.5 text-sm"
          >
            {t.nav.cta}
          </a>
        </div>

        {/* Mobile Menu Buttons */}
        <div className="flex lg:hidden items-center gap-2 relative z-50">
          <button
            onClick={toggleLang}
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors text-xs font-bold"
          >
            {t.nav.langToggle}
          </button>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 flex flex-col pt-24 px-6 pb-8 transition-all duration-300 lg:hidden",
          isMobileOpen
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
                "px-6 py-4 rounded-2xl text-lg font-bold transition-all",
                pathname === link.href
                  ? "bg-matgarco-50 text-matgarco-700"
                  : "text-slate-700 hover:bg-slate-50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
          <a
            href="http://localhost:3002/login"
            className="px-6 py-4 text-center font-bold text-slate-700 rounded-2xl border-2 border-slate-200 hover:border-matgarco-300"
          >
            {t.nav.login}
          </a>
          <a
            href="http://localhost:3002/register"
            className="px-6 py-4 text-center bg-matgarco-700 text-white font-bold rounded-2xl shadow-lg"
          >
            {t.nav.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
