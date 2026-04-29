"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Phase 5 — SectorTabs (Client Island)
 *
 * Interactive tabbed showcase of Matgarco's B2B/B2C versatility.
 * ALL user-visible text is sourced from t.sectors.* via useLanguage().
 * Zero hardcoded strings — strict i18n compliance.
 */

/** Unsplash images — code-level config */
const SECTOR_IMAGES: readonly string[] = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200",
  "https://images.unsplash.com/photo-1586528116311-ad8ed7c663b0?q=80&w=1200",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200",
] as const;

/** Spring physics for natural motion */
const SPRING_CONFIG = { type: "spring", stiffness: 300, damping: 30 } as const;

export function SectorTabs() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const sectorTabs = t.sectors?.tabs ?? [];
  const activeSector = sectorTabs[activeIndex];

  if (!activeSector) return null;

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* ═══════════════════════════════════════════════════════════
          Section Heading
          ═══════════════════════════════════════════════════════════ */}
      <div className="text-center mb-16">
        <h3 className="text-[#3B82F6] font-bold text-sm tracking-widest uppercase mb-4">
          {t.sectors?.badge}
        </h3>
        <h2 className="text-white text-3xl md:text-5xl font-black mb-6 leading-tight">
          {t.sectors?.title1} <br />
          <span className="text-[#3B82F6]">{t.sectors?.title2}</span>
        </h2>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          {t.sectors?.subtitle}
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          Tab Controls
          ═══════════════════════════════════════════════════════════ */}
      <div
        role="tablist"
        aria-label="Business sector tabs"
        className="flex flex-wrap items-center justify-center gap-2 mb-12"
      >
        {sectorTabs.map((sector, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={sector.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIndex(idx)}
              className="relative px-6 py-3 rounded-full text-sm font-bold tracking-tight transition-colors duration-300 outline-none cursor-pointer"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white/10 border border-white/20 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                  transition={SPRING_CONFIG}
                />
              )}
              <span className={`relative z-10 ${isActive ? "text-white" : "text-white/50 hover:text-white/70"}`}>
                {sector.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          Content Canvas
          ═══════════════════════════════════════════════════════════ */}
      <div className="min-h-[520px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSector.id}
            role="tabpanel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={SPRING_CONFIG}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="flex flex-col gap-6 text-start">
              <h3 className="text-white text-2xl md:text-3xl font-black tracking-tight">
                {activeSector.title}
              </h3>
              <p className="text-white/60 text-lg leading-relaxed">
                {activeSector.desc}
              </p>
              <ul className="flex flex-col gap-3">
                {activeSector.features.map((feature: string) => (
                  <li key={feature} className="flex items-center gap-3 text-start">
                    <CheckCircle2 size={20} className="text-[#3B82F6] shrink-0" />
                    <span className="text-white/80 font-medium text-sm md:text-base">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <button
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#3B82F6] text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-[0_5px_20px_rgba(59,130,246,0.3)] active:scale-95 cursor-pointer"
                >
                  {activeSector.cta}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="p-2 bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              <img
                src={SECTOR_IMAGES[activeIndex]}
                alt={activeSector.title}
                className="rounded-2xl object-cover w-full h-[400px]"
                loading="lazy"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
