"use client";

import React from "react";
import { Star } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            {t.testimonials.title1} <span className="text-matgarco-700">{t.testimonials.title2}</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">{t.testimonials.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.testimonials.reviews.map((review, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-matgarco-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (<Star key={i} size={20} className="fill-amber-400 text-amber-400" />))}
              </div>
              <p className="text-slate-700 leading-relaxed text-lg mb-8 flex-grow">&ldquo;{review.content}&rdquo;</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-matgarco-100 flex items-center justify-center text-matgarco-700 font-bold text-lg">{review.name.charAt(0)}</div>
                <div>
                  <h4 className="font-bold text-slate-900">{review.name}</h4>
                  <p className="text-sm text-slate-500">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
