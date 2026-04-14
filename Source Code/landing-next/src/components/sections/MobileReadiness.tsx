"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export function MobileReadiness() {
  const { t, lang } = useLanguage();

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[100%] rounded-full bg-matgarco-500 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[100%] rounded-full bg-indigo-500 blur-[120px]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        <div className={cn("w-full lg:w-1/2 text-center", lang === "ar" ? "lg:text-right" : "lg:text-left")}>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            {t.featuresPage.mobileTitle1}
            <br />
            <span className="text-matgarco-400">{t.featuresPage.mobileTitle2}</span>
          </h2>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
            {t.featuresPage.mobileSubtitle}
          </p>
          <div className={cn("flex flex-wrap gap-4", lang === "ar" ? "justify-center lg:justify-start" : "justify-center lg:justify-start")}>
            <Button variant="primary" size="lg" className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl shadow-white/10">
              {t.featuresPage.mobileCta}
            </Button>
          </div>
        </div>

        <div className="w-full lg:w-1/2 relative h-[500px] flex justify-center items-center">
          <div className="absolute z-20 left-1/2 lg:left-[40%] -translate-x-1/2 w-64 h-[480px] bg-white rounded-[2.5rem] border-[10px] border-slate-800 shadow-2xl overflow-hidden transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-2xl bg-slate-800 z-30" />
            <div className="h-full bg-slate-50 flex flex-col">
              <div className="h-40 bg-rose-100 flex items-end p-4">
                <span className="font-bold text-rose-900 text-lg">{lang === "ar" ? "متجرك الأنيق" : "Your Store"}</span>
              </div>
              <div className="flex-1 p-4 grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-28" />
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-28" />
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-28" />
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-28" />
              </div>
            </div>
          </div>

          <div className="absolute z-10 left-1/2 lg:left-[60%] -translate-x-1/2 w-64 h-[440px] bg-slate-900 rounded-[2.5rem] border-[10px] border-slate-700 shadow-2xl overflow-hidden transform rotate-6 translate-x-16 translate-y-8 hover:-translate-y-4 transition-transform duration-500">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-2xl bg-slate-700 z-30" />
            <div className="h-full bg-slate-950 flex flex-col p-4 pt-10 gap-4">
              <div className="h-20 bg-slate-800 rounded-xl relative overflow-hidden border border-slate-700 p-3">
                <span className="text-slate-400 text-xs">{lang === "ar" ? "أرباح اليوم" : "Today's Revenue"}</span>
                <div className="text-white text-xl font-bold mt-1">{lang === "ar" ? "12,500 ج.م" : "12,500 EGP"}</div>
                <div className="absolute bottom-0 right-0 w-1/2 h-10 bg-matgarco-500/20 blur-xl" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="h-12 bg-slate-800/50 rounded-lg w-full flex items-center px-4"><span className="w-3 h-3 rounded-full bg-emerald-400"></span></div>
                <div className="h-12 bg-slate-800/50 rounded-lg w-full flex items-center px-4"><span className="w-3 h-3 rounded-full bg-amber-400"></span></div>
                <div className="h-12 bg-slate-800/50 rounded-lg w-full flex items-center px-4"><span className="w-3 h-3 rounded-full bg-slate-600"></span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
