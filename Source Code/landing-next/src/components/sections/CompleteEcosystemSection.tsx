"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { EcosystemBentoGrid } from "@/components/islands/EcosystemBentoGrid";

export function CompleteEcosystemSection() {
  const { t, lang } = useLanguage();

  return (
    <section className="relative py-32 bg-[#000000] overflow-hidden isolate" id="ecosystem" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#000080]/20 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
            {t.ecosystem?.title}
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">
            {t.ecosystem?.mainDescription}
          </p>
        </div>

        {/* 12-Column Bento Grid */}
        <EcosystemBentoGrid />
        
      </div>
    </section>
  );
}
