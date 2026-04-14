"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/i18n/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-matgarco-200/30 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-cyan-100/40 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-matgarco-50 border border-matgarco-100 text-matgarco-700 text-sm font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-matgarco-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-matgarco-500"></span>
            </span>
            {t.hero.badge}
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 max-w-4xl">
            {t.hero.title1}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-matgarco-600 to-cyan-500">
              {t.hero.title2}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button variant="shine" size="lg" className="w-full sm:w-auto">
              {t.hero.ctaPrimary}
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white">
              {t.hero.ctaSecondary}
            </Button>
          </div>

          <p className="text-sm text-slate-500 mt-4">
            {t.hero.trialNote}
          </p>
        </div>

        {/* 3D Mockup Container */}
        <div className="mt-20 relative mx-auto max-w-5xl">
          <div className="relative rounded-2xl border border-slate-200/50 bg-white/40 backdrop-blur-3xl shadow-2xl p-2 md:p-4 aspect-video overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-matgarco-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="w-full h-full rounded-xl bg-slate-900 border border-slate-800 shadow-inner flex flex-col overflow-hidden">
              <div className="h-10 border-b border-slate-800 flex items-center px-4 gap-2 bg-slate-950">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                </div>
              </div>
              <div className="flex-1 p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-8 left-8 w-64 h-32 rounded-xl bg-slate-800/50 border border-slate-700/50" />
                <div className="absolute top-8 left-80 w-48 h-32 rounded-xl bg-slate-800/50 border border-slate-700/50" />
                <div className="absolute top-48 left-8 right-8 bottom-8 rounded-xl bg-slate-800/30 border border-slate-700/30" />
                <span className="text-slate-500 font-medium z-10 text-xl">
                  {t.hero.dashboardLabel}
                </span>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 md:bottom-[-20%] md:right-[-5%] w-1/3 md:w-[25%] aspect-[9/19] rounded-[2rem] border-8 border-slate-900 bg-white shadow-2xl overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-slate-900 rounded-b-xl z-20" />
              <div className="p-4 pt-10 h-full flex flex-col gap-4 bg-slate-50 relative">
                <div className="w-full h-32 bg-slate-200 rounded-lg animate-pulse" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-24 bg-slate-200 rounded-md" />
                  <div className="h-24 bg-slate-200 rounded-md" />
                </div>
                <div className="w-full h-10 bg-matgarco-600 rounded-md mt-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
