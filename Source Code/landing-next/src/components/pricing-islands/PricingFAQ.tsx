"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * PricingFAQ — Phase 13: Step 4 (Shopify-Style FAQ Accordion)
 *
 * Architectural Justification:
 * - Pillar 6 (UX/UI): Implements a minimalist, high-contrast dark accordion 
 *   inspired by Shopify's pricing page. Uses Framer Motion for hardware-accelerated 
 *   height transitions.
 * - Readability: Features oversized question typography and balanced whitespace 
 *   to ensure trust-building information is easily consumable.
 */
export function PricingFAQ() {
  const { t, lang } = useLanguage();
  const pricing = t.pricingPage;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!pricing?.faqs) return null;

  return (
    <section className="bg-black py-32 px-4 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        {/* ── HEADER ── */}
        <h2 className="text-4xl md:text-5xl font-black text-white mb-20 tracking-tighter">
          {pricing.faqTitle}
        </h2>

        {/* ── ACCORDION LIST ── */}
        <div className="flex flex-col border-b border-white/20">
          {pricing.faqs.map((faq: any, index: number) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index} 
                className="border-t border-white/20 py-8 transition-colors hover:bg-white/[0.02]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center text-left group"
                >
                  <span className={`text-2xl md:text-3xl font-bold pr-8 transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>
                    {faq.q}
                  </span>
                  
                  <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0">
                    {/* Minimalist Toggle Icon (+ / -) */}
                    <motion.div
                      animate={{ rotate: isOpen ? 0 : 90 }}
                      className="absolute w-6 h-0.5 bg-white"
                    />
                    <div className="absolute w-6 h-0.5 bg-white" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-8 text-xl text-gray-400 leading-relaxed max-w-3xl font-medium">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
