"use client";

import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";

export function PricingHero() {
  const { t } = useLanguage();

  return (
    <section className="pt-32 pb-12 bg-slate-50 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold mb-8">
          {t.pricingPage.badge}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          {t.pricingPage.heroTitle1}{" "}
          <span className="text-matgarco-700">{t.pricingPage.heroTitle2}</span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed mx-auto max-w-2xl">
          {t.pricingPage.heroSubtitle}
        </p>
      </div>
    </section>
  );
}
