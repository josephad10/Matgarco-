"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { CanvasStarfield } from "@/components/islands/CanvasStarfield";
import { GlowingJourneyPath } from "@/components/islands/GlowingJourneyPath";
import { Sparkles } from "lucide-react";

export function MerchantJourneySection() {
  const { t, lang } = useLanguage();

  return (
    <section className="relative overflow-hidden py-24 z-10 bg-[#000000]" id="journey" dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* Deep Space Background */}
      <CanvasStarfield />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 pt-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
            {t.journey?.title}
          </h2>
          <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
            {t.journey?.subtitle}
          </p>
        </div>

        {/* The Path */}
        <GlowingJourneyPath />
        
      </div>
    </section>
  );
}
