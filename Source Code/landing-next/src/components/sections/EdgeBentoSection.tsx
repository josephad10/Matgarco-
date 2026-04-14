"use client";

import React from "react";
import { BentoGrid, BentoCard } from "@/components/ui/BentoCard";
import { Zap, ShieldCheck, Paintbrush, Users } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export function EdgeBentoSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-6">
          {t.edge.title1} <span className="text-matgarco-700">{t.edge.title2}</span>
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          {t.edge.subtitle}
        </p>
      </div>

      <BentoGrid className="grid-rows-[auto_auto]">
        <BentoCard
          title={t.edge.card1Title}
          description={t.edge.card1Desc}
          icon={<ShieldCheck size={28} strokeWidth={2} />}
          className="md:col-span-2 min-h-[300px]"
        >
          <div className="absolute bottom-[-10px] right-8 flex gap-4 opacity-80">
            <div className="w-32 h-40 bg-white shadow-xl rounded-t-xl border border-slate-200 p-4 border-b-0 translate-y-8 group-hover:translate-y-4 transition-transform duration-500">
              <div className="w-8 h-8 rounded-full bg-emerald-100 mb-4" />
              <div className="w-full h-2 bg-slate-100 rounded mb-2" />
              <div className="w-2/3 h-2 bg-slate-100 rounded" />
            </div>
            <div className="w-32 h-48 bg-matgarco-700 shadow-xl rounded-t-xl border border-matgarco-600 p-4 border-b-0 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
              <div className="w-full h-8 bg-matgarco-800 rounded mb-4" />
              <div className="w-full h-2 bg-matgarco-500 rounded mb-2" />
              <div className="w-2/3 h-2 bg-matgarco-500 rounded" />
            </div>
          </div>
        </BentoCard>

        <BentoCard
          title={t.edge.card2Title}
          description={t.edge.card2Desc}
          icon={<Zap size={28} strokeWidth={2} />}
          className="min-h-[300px]"
        >
          <div className="absolute bottom-4 left-8 right-8 h-20 bg-gradient-to-t from-white to-transparent" />
        </BentoCard>

        <BentoCard
          title={t.edge.card3Title}
          description={t.edge.card3Desc}
          icon={<Paintbrush size={28} strokeWidth={2} />}
          className="min-h-[300px]"
        />

        <BentoCard
          title={t.edge.card4Title}
          description={t.edge.card4Desc}
          icon={<Users size={28} strokeWidth={2} />}
          className="md:col-span-2 min-h-[300px]"
        >
          <div className="absolute right-0 bottom-4 flex -space-x-4 px-8 overflow-hidden group-hover:space-x-1 transition-all duration-500 text-white">
            <div className="w-12 h-12 rounded-full border-4 border-slate-50 bg-indigo-500 flex items-center justify-center font-bold relative z-[4] shadow-md">M</div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-50 bg-pink-500 flex items-center justify-center font-bold relative z-[3] shadow-md">S</div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-50 bg-teal-500 flex items-center justify-center font-bold relative z-[2] shadow-md">A</div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-50 bg-matgarco-600 flex items-center justify-center font-bold relative z-[1] shadow-md">+3</div>
          </div>
        </BentoCard>
      </BentoGrid>
    </section>
  );
}
