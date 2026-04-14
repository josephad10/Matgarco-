"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/i18n/LanguageContext";

export function MegaCTA() {
  const { t } = useLanguage();

  return (
    <section className="relative py-24 overflow-hidden bg-slate-900">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-[50%] -left-[10%] w-[60%] h-[150%] bg-matgarco-800 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] -right-[20%] w-[70%] h-[100%] bg-cyan-900 rounded-full blur-[100px] mix-blend-screen" />
      </div>
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          {t.megaCta.title1} <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 to-matgarco-400">{t.megaCta.title2}</span>
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">{t.megaCta.subtitle}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="shine" size="lg" className="w-full sm:w-auto shadow-cyan-500/20 shadow-xl">{t.megaCta.ctaPrimary}</Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 bg-slate-800/50 backdrop-blur-sm">{t.megaCta.ctaSecondary}</Button>
        </div>
      </div>
    </section>
  );
}
