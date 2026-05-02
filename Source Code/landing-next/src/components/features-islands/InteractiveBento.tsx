"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ar } from "@/i18n/ar";
import { en } from "@/i18n/en";

interface InteractiveBentoProps {
  lang: string;
}

type TabType = "merchant" | "customer" | "admin";

/**
 * InteractiveBento (Client Island) — Phase 10
 * 
 * DESIGN PHILOSOPHY:
 * - "Show, Don't Tell" UX with real-time module switching.
 * - Glassmorphism aesthetics with OLED Black foundations.
 * - Strict Framer Motion physics for staggered module reveals.
 */
export function InteractiveBento({ lang }: InteractiveBentoProps) {
  const t = lang === "ar" ? ar : en;
  const isRtl = lang === "ar";
  const [activeTab, setActiveTab] = useState<TabType>("merchant");

  // Map cards based on active tab
  const getActiveCards = () => {
    switch (activeTab) {
      case "merchant":
        return t.featuresBento.merchantCards;
      case "customer":
        return t.featuresBento.customerCards;
      case "admin":
        return t.featuresBento.adminCards;
      default:
        return [];
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <section 
      id="modules"
      className="max-w-7xl mx-auto px-6 py-24 relative z-10" 
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* TABS SWITCHER */}
      <div className="flex justify-center mb-20">
        <div className="inline-flex p-1.5 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {(["merchant", "customer", "admin"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                relative px-8 py-3 rounded-full text-sm font-bold transition-all duration-500 outline-none
                ${activeTab === tab ? "text-black" : "text-slate-400 hover:text-white"}
              `}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-full z-0 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t.featuresBento.tabs[tab]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* BENTO GRID */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {getActiveCards().map((card: any, idx: number) => (
            <motion.div
              key={`${activeTab}-${idx}`}
              variants={cardVariants}
              className="relative group bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.08] hover:border-[#3B82F6]/50 rounded-[32px] p-8 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] overflow-hidden"
            >
              {/* Hover Spotlight */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3B82F6]/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full -mr-10 -mt-10" />
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Module Icon Placeholder (Standardized) */}
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-blue-500/30 transition-all duration-500 shadow-inner">
                  <div className="w-5 h-5 rounded-full bg-blue-500/40 blur-[4px] group-hover:bg-blue-400/60" />
                  <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {card.title}
                </h3>
                
                <p className="text-slate-400 leading-relaxed">
                  {card.desc}
                </p>

                {/* Bottom Interaction Element */}
                <div className="mt-auto pt-10">
                  <div className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent mb-4" />
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-black uppercase tracking-[0.2em] text-[10px] text-white/40 group-hover:text-blue-400 transition-colors">
                      {t.featuresBento.learnMore} &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
