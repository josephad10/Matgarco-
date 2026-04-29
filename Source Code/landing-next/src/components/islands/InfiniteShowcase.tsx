"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Phase 5 — InfiniteShowcase (Client Island)
 *
 * Centralized, massive Glassmorphic container that infinitely cross-fades
 * through showcase images. Replaces the old "Tabs" approach.
 * ALL user-visible text is sourced from t.sectors.* via useLanguage().
 */

const SHOWCASE_IMAGES: readonly string[] = [
  "/showcase/showcase-1.jpeg",
  "/showcase/showcase-2.jpeg",
  "/showcase/showcase-3.jpeg",
] as const;

export function InfiniteShowcase() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  // 4000ms infinite loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % SHOWCASE_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const sectors = t.sectors?.tabs ?? [];

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
        <p className="text-white/60 text-lg max-w-3xl mx-auto">
          {t.sectors?.subtitle}
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          Massive Glassmorphic Image Container (Infinite Loop)
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto rounded-[2rem] p-3 bg-white/5 border border-[#000080]/50 shadow-[0_0_80px_rgba(0,0,128,0.4)]">
        {/* Strict aspect ratio to prevent Layout Thrashing */}
        <div className="relative w-full aspect-[16/10] md:aspect-video rounded-2xl overflow-hidden bg-black/50">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={SHOWCASE_IMAGES[activeIndex]}
              alt={`Showcase ${activeIndex + 1}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          3-Column Sector Grid
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20">
        {sectors.map((sector: any) => (
          <div key={sector.id} className="flex flex-col gap-5 text-start">
            <div className="relative inline-block self-start mb-1">
              <div className="absolute inset-0 bg-[#000080] blur-2xl opacity-50 -z-10 transform-gpu"></div>
              <h3 className="text-2xl font-bold text-white relative z-10">
                {sector.title}
              </h3>
            </div>
            <p className="text-white/60 text-base leading-relaxed h-auto md:h-20">
              {sector.desc}
            </p>
            <ul className="flex flex-col gap-3 flex-grow">
              {sector.features.map((feature: string) => (
                <li key={feature} className="flex items-start gap-3 text-start">
                  <CheckCircle2 size={18} className="text-[#3B82F6] shrink-0 mt-0.5" />
                  <span className="text-white/80 font-medium text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Premium CTA with Hover Glow - Anchor Tag for Conversion Routing */}
            <div className="mt-4">
              <a
                href="http://localhost:3002/register"
                className="inline-flex items-center justify-center w-full md:w-auto md:justify-start gap-2 px-6 py-3 bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 rounded-xl font-bold text-sm hover:bg-[#3B82F6] hover:text-white transition-all shadow-none hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95 cursor-pointer"
              >
                {sector.cta}
                <ArrowRight size={16} className="shrink-0" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
