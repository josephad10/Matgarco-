"use client";

import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Phase 6 — EngineeringContent (Client Island)
 *
 * Renders the massive typography and stats engine using the active i18n context.
 * Utilizes explicit RTL/LTR directionality to prevent punctuation layout thrashing.
 */
export function EngineeringContent() {
  const { t, lang } = useLanguage();

  return (
    <div className="flex flex-col gap-12 z-10 w-full" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Top Section: Massive Typography */}
      <div className="flex flex-col gap-6 text-start">
        <span className="text-[#3B82F6] text-sm font-bold tracking-[0.2em] uppercase">
          {t.engineering?.badge}
        </span>
        <h2 className="text-6xl md:text-8xl font-black text-white leading-[1.05] tracking-tighter max-w-3xl">
          {t.engineering?.title1}
        </h2>
        <p className="text-white/60 text-xl md:text-2xl leading-relaxed max-w-xl">
          {t.engineering?.subtitle}
        </p>
      </div>

      {/* Middle Section: SWE Features */}
      <div className="flex flex-col gap-8 mt-4 text-start max-w-lg">
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {t.engineering?.card1Title}
          </h3>
          <p className="text-white/60 text-lg leading-relaxed">
            {t.engineering?.card1Desc}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {t.engineering?.card2Title}
          </h3>
          <p className="text-white/60 text-lg leading-relaxed">
            {t.engineering?.card2Desc}
          </p>
        </div>
      </div>

      {/* Bottom Section: Massive Stats Engine */}
      <div className="flex flex-row gap-12 mt-4 pt-10 border-t border-white/10">
        <div className="flex flex-col gap-1 text-start">
          <span className="text-7xl lg:text-9xl font-black text-[#3B82F6] tracking-tighter leading-none">
            {t.engineering?.stat1Value}
          </span>
          <span className="text-white/50 text-sm md:text-base font-bold uppercase tracking-widest mt-2">
            {t.engineering?.stat1Label}
          </span>
        </div>

        <div className="flex flex-col gap-1 text-start">
          <span className="text-7xl lg:text-9xl font-black text-[#3B82F6] tracking-tighter leading-none">
            {t.engineering?.stat2Value}
          </span>
          <span className="text-white/50 text-sm md:text-base font-bold uppercase tracking-widest mt-2">
            {t.engineering?.stat2Label}
          </span>
        </div>
      </div>
    </div>
  );
}
