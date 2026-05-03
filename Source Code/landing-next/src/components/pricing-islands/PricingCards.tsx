"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useUIStore } from "@/store/useUIStore";

/**
 * PricingCards — Phase 13: Absolute Perfect Symmetry
 *
 * Architectural Justification:
 * - Pillar 1 (SRP): Purely presentational. Reads billingCycle from Zustand.
 * - Pillar 5 (Islands Architecture): "use client" boundary.
 * - Pillar 6 (UI/UX): Absolute vertical symmetry. Removed scaling to ensure pixel-perfect 
 *   horizontal alignment of all card tops and bottoms.
 * - CRITICAL FIX: initial={false} on all motion elements prevents blank screen on BF-cache restoration.
 */
export function PricingCards() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const cards = t.pricingPage?.cards;
  const billingCycle = useUIStore((state) => state.billingCycle);

  if (!cards || cards.length === 0) return null;

  // Localized VAT label
  const vatLabel = lang === "ar" ? "شامل الضريبة" : "VAT Inclusive";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-24" dir={isRtl ? "rtl" : "ltr"}>
      {/* Grid Container: items-stretch ensures all columns share exactly the same height anchor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {cards.map((card, index) => {
          const isPro = card.isPopular === true;
          const isNavyCheck = card.id !== "lite";
          const displayPrice = billingCycle === "monthly" ? card.monthlyPrice : card.annualPrice;
          const periodLabel = billingCycle === "monthly" ? t.pricingPage.monthly : t.pricingPage.annual;

          return (
            <motion.div
              key={card.id}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, delay: index * 0.1 }}
              className="h-full"
            >
              <div
                className={`relative flex flex-col h-full bg-white rounded-[2rem] overflow-hidden transition-all duration-300 ${
                  isPro
                    ? "border-[3px] border-[#000080] shadow-[0_0_50px_rgba(0,0,128,0.15)] z-10"
                    : "border border-gray-200 shadow-xl"
                }`}
              >
                {/* ── 1. BLOCK-LEVEL NAVY HEADER (Marketing Badge) ── */}
                <div className="w-full bg-[#000080] py-4 px-6 flex items-center justify-center border-b border-[#000080]/20 shadow-[0_4px_20px_rgba(0,0,128,0.15)]">
                  <span className="text-white text-xs font-black uppercase tracking-widest text-center leading-tight">
                    {card.badge}
                  </span>
                </div>

                {/* ── 2. CARD BODY: flex-1 ensures it fills the column height ── */}
                <div className="p-8 lg:p-10 flex flex-col flex-1">
                  
                  {/* Header: Title + Popular Label */}
                  <div className="mb-8">
                    <div className="flex items-center flex-wrap gap-3">
                      <h3 className="text-3xl font-black text-[#050505] tracking-tight">
                        {card.name}
                      </h3>
                      {isPro && card.popularLabel && (
                        <span className="bg-[#000080] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_4px_12px_rgba(0,0,128,0.4)]">
                          {card.popularLabel}
                        </span>
                      )}
                    </div>
                    {card.subName && (
                      <span className="text-xs font-bold uppercase text-gray-400 mt-1.5 block">
                        {card.subName.replace(/[()]/g, "")}
                      </span>
                    )}
                  </div>

                  {/* Price Block */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl lg:text-6xl font-black text-[#050505] tracking-tighter">
                        {displayPrice}
                      </span>
                      <span className="text-lg font-bold text-gray-500">{card.currency}</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1 font-medium">{periodLabel}</div>
                    <div className="text-[10px] text-gray-300 mt-1 uppercase font-bold tracking-wider">{vatLabel}</div>
                  </div>

                  {/* Commission Highlight */}
                  <div className={`p-3.5 rounded-xl mb-8 font-black text-center text-xs uppercase tracking-wide border ${
                    isPro || card.id === "prime"
                      ? "bg-[#000080]/5 border-[#000080]/20 text-[#000080]"
                      : "bg-gray-50 border-gray-100 text-gray-500"
                  }`}>
                    {card.commission}
                  </div>

                  {/* ── 3. FEATURES LIST: flex-1 acts as the vertical spring ── */}
                  <ul className="flex-1 space-y-4.5 mb-10">
                    {card.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg
                          className={`w-5 h-5 shrink-0 mt-0.5 ${isNavyCheck ? "text-[#000080]" : "text-gray-400"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 font-medium text-sm leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* ── 4. CTA BUTTON: mt-auto locks it to the bottom ── */}
                  <a
                    href="http://localhost:3002/register"
                    className={`w-full h-14 mt-auto rounded-full flex items-center justify-center text-sm font-extrabold tracking-wide transition-all duration-300 ${
                      isPro
                        ? "bg-[#000080] text-white shadow-[0_10px_30px_rgba(0,0,128,0.3)]"
                        : "bg-[#050505] text-white hover:bg-gray-800"
                    }`}
                  >
                    {card.cta}
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
