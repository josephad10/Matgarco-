"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Shirt, MonitorSmartphone, Palette, Coffee } from "lucide-react";

export function MultiSectorShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const sectors = [
    {
      id: "fashion",
      title: "الأزياء والموضة",
      icon: <Shirt size={20} />,
      description: "قوالب مصممة لإبراز التفاصيل الدقيقة للملابس مع نظام متقدم لخيارات المقاسات والألوان.",
      imageColor: "bg-rose-100",
      accent: "text-rose-600",
    },
    {
      id: "electronics",
      title: "الإلكترونيات",
      icon: <MonitorSmartphone size={20} />,
      description: "جداول مقارنة للمواصفات التقنية وتصفية متقدمة (الفلاتر) بناءً على العلامة التجارية والسعر.",
      imageColor: "bg-blue-100",
      accent: "text-blue-600",
    },
    {
      id: "digital",
      title: "المنتجات الرقمية",
      icon: <Palette size={20} />,
      description: "تسليم فوري للملفات بعد الدفع وتخصيص تجربة الشراء للملصقات، الدورات أو التصاميم.",
      imageColor: "bg-purple-100",
      accent: "text-purple-600",
    },
    {
      id: "food",
      title: "المأكولات والمقاهي",
      icon: <Coffee size={20} />,
      description: "خيارات للتوصيل المجدول واستلام الفروع مع دعم المنتجات ذات التخصيصات والطلبات الخاصة.",
      imageColor: "bg-amber-100",
      accent: "text-amber-600",
    },
  ];

  return (
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-6">
          مهما كان مجال تجارتك، <span className="text-matgarco-700">متجركو مصمم لك</span>
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-16">
          محرك القوالب الخاص بنا لا يعتمد على واجهة واحدة، بل يمنحك المرونة لتصميم متجر يخدم قطاعك بشكل مثالي.
        </p>

        {/* Tabs Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {sectors.map((sector, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={sector.id}
                onClick={() => setActiveTab(idx)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300",
                  isActive
                    ? `bg-slate-900 text-white shadow-lg`
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <div className={cn("transition-colors", isActive ? "text-white" : sector.accent)}>
                  {sector.icon}
                </div>
                <span>{sector.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Display */}
        <div className="relative mx-auto max-w-5xl rounded-3xl overflow-hidden aspect-[2/1] md:aspect-[21/9] bg-slate-100 shadow-inner border border-slate-200 group">
          {sectors.map((sector, idx) => (
            <div
              key={idx}
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out p-8",
                activeTab === idx ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0 pointer-events-none"
              )}
            >
              <div className={cn("absolute inset-0 opacity-50 transition-colors duration-700", sector.imageColor)} />
              
              {/* Fake Storefront Layout representation */}
              <div className="relative z-10 w-full max-w-3xl h-full bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
                <div className="h-12 border-b border-slate-100 flex items-center justify-between px-6">
                  <div className={cn("font-bold text-lg", sector.accent)}>{sector.title} Fake UI</div>
                  <div className="flex gap-4">
                    <div className="w-16 h-4 bg-slate-100 rounded-full" />
                    <div className="w-16 h-4 bg-slate-100 rounded-full" />
                  </div>
                </div>
                <div className="flex-1 p-6 flex flex-col gap-6">
                  <div className="w-full h-32 bg-slate-50 rounded-lg flex items-center justify-center p-6 text-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-tr from-white to-transparent" />
                     <p className="relative z-10 text-xl font-bold text-slate-800 break-words w-full h-full flex items-center tracking-normal">
                       {sector.description}
                     </p>
                  </div>
                  <div className="grid grid-cols-4 gap-4 flex-1">
                    <div className="bg-slate-50 rounded-lg" />
                    <div className="bg-slate-50 rounded-lg" />
                    <div className="bg-slate-50 rounded-lg" />
                    <div className="bg-slate-50 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
