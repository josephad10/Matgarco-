"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState } from "react";

function GuideItem({ guide, isExpanded, onToggle, isRtl }: { guide: any, isExpanded: boolean, onToggle: () => void, isRtl: boolean }) {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-8 flex items-center justify-between group transition-all duration-500 hover:bg-white/[0.02] px-6 rounded-2xl"
      >
        <div className={`flex items-center gap-8 ${isRtl ? "flex-row-reverse text-right" : "text-left"}`}>
          <span className="text-4xl md:text-5xl font-black text-white/10 select-none group-hover:text-blue-500/20 transition-colors duration-500">
            {guide.id}
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-500 tracking-tight">
            {guide.title}
          </h3>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex-shrink-0 ml-4"
        >
          <svg className="w-6 h-6 text-white/40 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className={`pb-12 ${isRtl ? "pr-24 pl-6 text-right" : "pl-24 pr-6 text-left"}`}>
              <div className="max-w-3xl">
                {guide.content.split('\n\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="text-lg text-slate-400 font-medium leading-relaxed mb-6 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PopularGuides() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const copy = t.aboutMegaPage?.popularGuides;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!copy) return null;

  return (
    <section className="relative w-full py-32 bg-[#000000] z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
              {copy.title}
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto">
              {copy.subtitle}
            </p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto" dir={isRtl ? "rtl" : "ltr"}>
          {copy.guides.map((guide: any) => (
            <GuideItem 
              key={guide.id}
              guide={guide}
              isExpanded={expandedId === guide.id}
              onToggle={() => setExpandedId(expandedId === guide.id ? null : guide.id)}
              isRtl={isRtl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
