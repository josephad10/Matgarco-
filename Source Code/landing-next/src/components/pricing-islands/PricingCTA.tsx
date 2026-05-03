"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * PricingCTA — Phase 13: Honest Shopify-style Bento Grid + Edge-to-Edge Ribbon
 *
 * Architectural Justification:
 * - Pillar 6 (UX/UI): Replaces the static button with a luxurious, edge-to-edge 
 *   infinite marquee. Uses 100vw breakout logic to span the entire screen, 
 *   creating a cinematic, high-energy transition at the bottom of the page.
 */
export function PricingCTA() {
  const { t, lang } = useLanguage();
  const cta = t.pricingPage?.finalCta;
  const isRtl = lang === "ar";

  if (!cta || !cta.features) return null;

  // Ensure ribbonText is an array (fallback to empty array if not)
  const ribbonPhrases = Array.isArray(cta.ribbonText) ? cta.ribbonText : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-32" dir={isRtl ? "rtl" : "ltr"}>
      {/* ── SECTION TITLE ── */}
      <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-16 tracking-tight max-w-3xl mx-auto">
        {cta.title}
      </h2>

      {/* ── SHOPIFY-STYLE 5-COLUMN GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6 mb-16">
        {cta.features.map((feature: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white rounded-2xl p-6 lg:p-8 flex flex-col justify-start hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-default"
          >
            <h3 className="text-lg lg:text-xl font-black text-[#050505] mb-3 leading-tight">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm font-medium leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── INFINITE NAVY RIBBON (EDGE-TO-EDGE) ── */}
      <a 
        href="http://localhost:3002/register" 
        dir="ltr"
        className="block w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] mt-24 cursor-pointer group overflow-hidden"
      >
        <div className="relative flex bg-[#000080] py-5 border-y border-white/20 shadow-[0_0_50px_rgba(0,0,128,0.5)]">
          
          {/* Main Animation Block */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ repeat: Infinity, ease: "linear", duration: 80 }}
            className="flex whitespace-nowrap items-center px-4"
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                {ribbonPhrases.map((text: string, idx: number) => (
                  <div key={`text-1-${i}-${idx}`} className="flex items-center">
                    <span className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter px-8">
                      {text}
                    </span>
                    <svg className={`w-6 h-6 text-[#3B82F6] ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>

          {/* Duplicate Block for Seamless Loop */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ repeat: Infinity, ease: "linear", duration: 80 }}
            className="flex whitespace-nowrap items-center px-4"
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                {ribbonPhrases.map((text: string, idx: number) => (
                  <div key={`text-2-${i}-${idx}`} className="flex items-center">
                    <span className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter px-8">
                      {text}
                    </span>
                    <svg className={`w-6 h-6 text-[#3B82F6] ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </a>
    </div>
  );
}
