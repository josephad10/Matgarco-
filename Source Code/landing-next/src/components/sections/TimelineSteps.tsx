"use client";

import React from "react";
import { UserPlus, Palette, Rocket } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export function TimelineSteps() {
  const { t } = useLanguage();

  const steps = [
    { title: t.timeline.step1Title, description: t.timeline.step1Desc, icon: <UserPlus size={24} className="text-matgarco-600" /> },
    { title: t.timeline.step2Title, description: t.timeline.step2Desc, icon: <Palette size={24} className="text-matgarco-600" /> },
    { title: t.timeline.step3Title, description: t.timeline.step3Desc, icon: <Rocket size={24} className="text-matgarco-600" /> },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            {t.timeline.title1} <span className="text-matgarco-700">{t.timeline.title2}</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">{t.timeline.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-gradient-to-l from-slate-200 via-matgarco-300 to-slate-200 z-0" />
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-100 shadow-xl flex items-center justify-center mb-6 relative group-hover:border-matgarco-500 group-hover:-translate-y-2 transition-all duration-300">
                {step.icon}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-matgarco-700 text-white font-bold flex items-center justify-center border-4 border-white shadow-sm">{idx + 1}</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-matgarco-700 transition-colors">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed max-w-[280px]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
