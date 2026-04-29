"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function LangToggle() {
  const { toggleLang, lang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Robust mount check that re-evaluates safely on route changes (bfcache fix)
  useEffect(() => {
    setMounted(true);
    
    const handlePageshow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setMounted(true);
      }
    };
    window.addEventListener('pageshow', handlePageshow);
    return () => window.removeEventListener('pageshow', handlePageshow);
  }, [pathname]);

  if (!mounted) {
    // Return an invisible placeholder matching dimensions to avoid layout shift
    // but without causing visual skeleton bugs on back navigation
    return (
      <div className="flex items-center">
        <div className="w-[104px] h-10" />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <button
        onClick={toggleLang}
        className="flex items-center gap-1.5 px-4 h-10 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors shadow-inner outline-none"
        title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
      >
        <Globe size={16} />
        <span className="hidden sm:inline tracking-normal">
          {lang === 'ar' ? 'English' : 'عربى'}
        </span>
      </button>
    </div>
  );
}
