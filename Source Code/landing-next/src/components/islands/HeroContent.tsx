"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { HeroWordFlip } from "./HeroWordFlip";

export function HeroContent() {
  const { t, lang } = useLanguage();

  const isAr = lang === "ar";
  const typographyClass = isAr
    ? "leading-[1.6] tracking-normal"
    : "tracking-tighter";

  return (
    <div className="flex flex-col items-start text-start w-full order-1">
      <HeroWordFlip />

      <p
        className={`text-xl md:text-2xl text-[#f8fafc]/85 mb-10 max-w-xl font-medium text-balance drop-shadow-sm opacity-0 animate-fade-in-up ${typographyClass}`}
        style={{ animationDelay: "200ms" }}
      >
        {t.hero.slogan}
      </p>

      <div
        className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full opacity-0 animate-fade-in-up"
        style={{ animationDelay: "400ms" }}
      >
        <a
          href="http://localhost:3002/register"
          className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#000080] text-white rounded-2xl font-black text-lg md:text-xl shadow-[0_15px_40px_rgba(0,0,128,0.4)] hover:shadow-[0_20px_50px_rgba(0,0,128,0.6)] hover:-translate-y-1 active:scale-95 transition-all duration-300 overflow-hidden outline-none w-full sm:w-auto ${typographyClass}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#000080] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
          <span className="relative z-10 drop-shadow-md">{t.hero.ctaLabel}</span>
        </a>
      </div>
    </div>
  );
}
