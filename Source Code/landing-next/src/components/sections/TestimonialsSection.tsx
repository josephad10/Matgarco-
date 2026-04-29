"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { InfiniteMarquee } from "@/components/islands/InfiniteMarquee";

export function TestimonialsSection() {
  const { t, lang } = useLanguage();

  return (
    <section className="relative overflow-hidden py-24 z-10 bg-[#000000]" id="testimonials" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
            {t.testimonials?.title}
          </h2>
          <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
            {t.testimonials?.subtitle}
          </p>
        </div>

        {/* Masked Marquee Container */}
        <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <InfiniteMarquee />
        </div>
        
      </div>
    </section>
  );
}
