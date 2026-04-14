"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ShoppingBag, Paintbrush, LineChart } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export function InteractiveDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const { t, lang } = useLanguage();

  const icons = [
    <LayoutDashboard key="d" size={20} />,
    <ShoppingBag key="s" size={20} />,
    <Paintbrush key="p" size={20} />,
    <LineChart key="l" size={20} />,
  ];
  const colors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-matgarco-500"];
  const ids = ["dashboard", "orders", "themes", "analytics"];

  const features = t.featuresPage.tabs.map((tab, idx) => ({
    id: ids[idx],
    title: tab.title,
    description: tab.desc,
    icon: icons[idx],
    color: colors[idx],
  }));

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              {t.featuresPage.dashboardTitle}
            </h2>
            {features.map((feature, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveTab(idx)}
                  className={cn(
                    "p-6 rounded-2xl border-2 transition-all duration-300 w-full flex flex-col gap-3 group",
                    lang === "ar" ? "text-right" : "text-left",
                    isActive
                      ? "bg-white border-matgarco-500 shadow-lg shadow-matgarco-500/10"
                      : "bg-transparent border-transparent hover:bg-slate-100"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-white transition-transform duration-300",
                      feature.color,
                      isActive ? "scale-110 shadow-md" : "opacity-70 group-hover:opacity-100"
                    )}>
                      {feature.icon}
                    </div>
                    <h3 className={cn(
                      "text-xl font-bold transition-colors",
                      isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
                    )}>
                      {feature.title}
                    </h3>
                  </div>
                  {isActive && (
                    <p className="text-slate-500 leading-relaxed text-sm animate-fade-in-up">
                      {feature.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <div className="w-full lg:w-2/3">
            <div className="relative aspect-[16/10] bg-slate-200 rounded-3xl border border-slate-300 shadow-2xl overflow-hidden flex flex-col">
              <div className="h-12 bg-slate-100 border-b border-slate-300 flex items-center px-4 gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white rounded-md h-7 border border-slate-300 flex items-center justify-center text-xs text-slate-400 px-3 overflow-hidden">
                  <span className="truncate">matgarco.com/admin/{features[activeTab].id}</span>
                </div>
              </div>
              <div className="flex-1 relative bg-white p-6 overflow-hidden">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "absolute inset-0 p-8 flex flex-col gap-6 bg-slate-50 transition-all duration-500",
                      activeTab === idx ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-12 z-0 pointer-events-none"
                    )}
                  >
                    <div className="flex justify-between w-full h-10 border-b border-slate-200 pb-4">
                      <div className="w-48 h-6 bg-slate-200 rounded-md" />
                      <div className="w-24 h-6 bg-slate-200 rounded-md" />
                    </div>
                    {idx === 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-32 bg-white rounded-xl border border-slate-200 shadow-sm" />
                        <div className="h-32 bg-white rounded-xl border border-slate-200 shadow-sm" />
                        <div className="h-32 bg-white rounded-xl border border-slate-200 shadow-sm" />
                        <div className="col-span-3 h-64 bg-white rounded-xl border border-slate-200 mt-4 shadow-sm" />
                      </div>
                    )}
                    {idx === 1 && (
                      <div className="flex flex-col gap-3">
                        <div className="h-12 bg-white rounded-md border border-slate-200 w-full" />
                        <div className="h-16 bg-white rounded-md border border-slate-200 w-full" />
                        <div className="h-16 bg-white rounded-md border border-slate-200 w-full" />
                        <div className="h-16 bg-white rounded-md border border-slate-200 w-full" />
                      </div>
                    )}
                    {idx === 2 && (
                      <div className="flex gap-6 h-full">
                        <div className="w-1/4 h-full bg-white rounded-md border border-slate-200" />
                        <div className="w-3/4 h-full bg-slate-200 rounded-md border border-slate-300 flex items-center justify-center font-bold text-slate-400">
                          Theme Live Preview
                        </div>
                      </div>
                    )}
                    {idx === 3 && (
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="col-span-2 h-48 bg-white rounded-xl border border-slate-200" />
                        <div className="h-48 bg-white rounded-xl border border-slate-200" />
                        <div className="h-48 bg-white rounded-xl border border-slate-200" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
