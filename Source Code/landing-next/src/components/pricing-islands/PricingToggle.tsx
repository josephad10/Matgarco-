"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useUIStore } from "@/store/useUIStore";

/**
 * PricingToggle — Phase 13: Matrix Toggle
 * 
 * Architectural Justification:
 * - Pillar 1: Single Responsibility Principle (SRP). Handles ONLY billing cycle state.
 * - Pillar 3: Centralized state. Writes to `useUIStore`, ensuring isolated business logic.
 * - Pillar 6: UI/UX. Uses Framer Motion layout animations for the Apple-style pill switcher.
 */
export function PricingToggle() {
  const { t } = useLanguage();
  const toggle = t.pricingPage?.toggle;
  const billingCycle = useUIStore((state) => state.billingCycle);
  const setBillingCycle = useUIStore((state) => state.setBillingCycle);

  if (!toggle) return null;

  return (
    <div className="flex justify-center items-center w-full mb-12">
      <div className="relative flex items-center bg-white/10 p-1 rounded-full border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`relative px-8 py-2.5 rounded-full text-sm font-bold z-10 transition-colors ${
            billingCycle === "monthly" ? "text-black" : "text-white/70 hover:text-white"
          }`}
        >
          {billingCycle === "monthly" && (
            <motion.div
              layoutId="billingToggle"
              className="absolute inset-0 bg-white rounded-full z-[-1]"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{toggle.monthly}</span>
        </button>

        <button
          onClick={() => setBillingCycle("annual")}
          className={`relative px-8 py-2.5 rounded-full text-sm font-bold z-10 transition-colors ${
            billingCycle === "annual" ? "text-black" : "text-white/70 hover:text-white"
          }`}
        >
          {billingCycle === "annual" && (
            <motion.div
              layoutId="billingToggle"
              className="absolute inset-0 bg-white rounded-full z-[-1]"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{toggle.annual}</span>
          
          {/* Floating Save 20% Badge */}
          <span className="absolute -top-3 -right-2 px-2 py-0.5 bg-[#3B82F6] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse pointer-events-none whitespace-nowrap">
            {toggle.saveBadge}
          </span>
        </button>
      </div>
    </div>
  );
}
