"use client";

import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";

export function FeaturesHero() {
  const { t } = useLanguage();

  return (
    <section className="pt-32 pb-16 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          {t.featuresPage.heroTitle1}{" "}
          <span className="text-matgarco-700">{t.featuresPage.heroTitle2}</span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed mx-auto max-w-2xl">
          {t.featuresPage.heroSubtitle}
        </p>
      </div>
    </section>
  );
}
