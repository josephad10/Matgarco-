"use client";

import {
  LayoutTemplate,
  Filter,
  Inbox,
  ShoppingCart,
  Users,
  Package,
  MessagesSquare,
  Globe,
  Truck,
  CreditCard,
  Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Phase 3+4 — GalaxyText (Client Island)
 *
 * Renders all user-visible text for the cosmic galaxy section
 * using the i18n dictionary via useLanguage(). Zero hardcoded strings.
 *
 * Responsible for:
 * - Partner Program heading (t.galaxy.partnerBadge, t.galaxy.partnerTitle)
 * - "Everything You Need" heading (t.galaxy.featuresTitle1/2, t.galaxy.featuresSubtitle)
 * - Glassmorphic Feature Pills with lucide-react icons (t.galaxy.featurePills[])
 */

/** Icon mapping — order matches t.galaxy.featurePills[] array indices */
const ICONS: readonly LucideIcon[] = [
  LayoutTemplate,
  Filter,
  Inbox,
  ShoppingCart,
  Users,
  Package,
  MessagesSquare,
  Globe,
  Truck,
  CreditCard,
  Megaphone,
];

export function GalaxyText() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-6 text-center mb-16">
      <h3 className="text-[#3B82F6] font-bold text-sm tracking-widest uppercase mb-4">
        {t.galaxy?.partnerBadge}
      </h3>
      <h2 className="text-white text-3xl md:text-4xl font-black tracking-tight">
        {t.galaxy?.partnerTitle}
      </h2>
    </div>
  );
}

export function FeaturePillsBlock() {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 mt-32 max-w-5xl mx-auto px-6 text-center">
      <h2 className="text-white text-4xl md:text-5xl font-black mb-6 leading-tight">
        {t.galaxy?.featuresTitle1}<br />
        <span className="text-[#3B82F6]">{t.galaxy?.featuresTitle2}</span>
      </h2>
      <p className="text-white/60 text-lg mb-12">
        {t.galaxy?.featuresSubtitle}
      </p>

      {/* Glassmorphic Feature Pills with Lucide Icons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {t.galaxy?.featurePills?.map((pillName: string, idx: number) => {
          const Icon = ICONS[idx] ?? Globe;
          return (
            <div
              key={pillName}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:text-white transition-all cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-sm md:text-base group"
            >
              <Icon size={18} className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
              <span>{pillName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
