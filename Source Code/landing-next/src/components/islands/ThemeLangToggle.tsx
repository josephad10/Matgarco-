"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeLangToggle() {
  const { toggleLang, lang } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex items-center">
        <div className="w-24 h-10 rounded-xl bg-white/10 animate-pulse shadow-inner border border-white/20" />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <button
        onClick={toggleLang}
        className="flex items-center gap-1.5 px-3 h-10 rounded-xl text-sm font-bold bg-white/10 text-white hover:bg-white/20 transition-colors shadow-inner border border-white/20 outline-none"
        title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
      >
        <Globe size={16} />
        <span className="hidden sm:inline">
          {lang === 'ar' ? 'English' : 'عربى'}
        </span>
      </button>
    </div>
  );
}
