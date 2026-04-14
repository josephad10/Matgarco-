"use client";

import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";

export function TrustMarquee() {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-white border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-slate-500 font-medium text-sm tracking-wide">
          {t.trust.subtitle}
        </p>
      </div>

      <div className="relative flex overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10" />

        <div className="flex animate-marquee gap-16 whitespace-nowrap min-w-full hover:[animation-play-state:paused]">
          {[...t.trust.partners, ...t.trust.partners].map((partner, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center min-w-[150px] opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <div className="text-xl font-black text-slate-800 tracking-tighter">
                {partner}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
