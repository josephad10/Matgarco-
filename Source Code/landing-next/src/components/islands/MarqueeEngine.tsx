"use client";

import React from "react";
import { usePathname } from "next/navigation";

/**
 * Phase 3 — MarqueeEngine (Client Island)
 *
 * Unstoppable infinite card-based typographical partner marquee.
 * Zero external assets — pure CSS typography inside massive glassy cards.
 * NO pause-on-hover — continuous, uninterrupted GPU-accelerated flow.
 *
 * Visual Architecture:
 * - Default: Ghosted white text inside large bg-white/5 glassy cards
 * - Hover:  Card border + text shift to exact brand hex with glow
 *
 * Animation: CSS @keyframes translate3d(-50%) — unstoppable infinite loop.
 * bfcache protection via key={pathname}.
 */

interface Partner {
  readonly name: string;
  readonly color: string;
}

/** Expanded partner array — fills the viewport with enterprise-grade density */
const PARTNERS: readonly Partner[] = [
  { name: "Paymob",       color: "#1748FF" },
  { name: "Bosta",        color: "#E50000" },
  { name: "Fawry",        color: "#FCD000" },
  { name: "Vodafone Cash",color: "#E60000" },
  { name: "Tabby",        color: "#33FFCC" },
  { name: "Visa",         color: "#1A1F71" },
  { name: "Shopify",      color: "#95BF47" },
  { name: "Stripe",       color: "#6366F1" },
  { name: "PayPal",       color: "#00457C" },
  { name: "Amazon Pay",   color: "#FF9900" },
  { name: "Kashier",      color: "#3B82F6" },
  { name: "Mastercard",   color: "#FF5F00" },
] as const;

export function MarqueeEngine() {
  const pathname = usePathname();

  return (
    <div className="relative w-full overflow-hidden">
      {/* Scoped GPU-accelerated keyframes — UNSTOPPABLE, no pause logic */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cosmic-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-cosmic-marquee {
          animation: cosmic-marquee 40s linear infinite;
        }
        .partner-card {
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
          transition: border-color 0.4s ease, box-shadow 0.4s ease, background-color 0.4s ease;
        }
        .partner-card:hover {
          border-color: var(--brand-color);
          box-shadow: 0 0 24px var(--brand-color-glow), 0 0 48px var(--brand-color-soft), inset 0 1px 0 rgba(255,255,255,0.1);
          background-color: rgba(255, 255, 255, 0.08);
        }
        .partner-text {
          color: rgba(255, 255, 255, 0.35);
          transition: color 0.4s ease, filter 0.4s ease;
        }
        .partner-card:hover .partner-text {
          color: var(--brand-color);
          filter: drop-shadow(0 0 10px var(--brand-color-glow));
        }
      `}} />

      {/* Edge Fade Masks — Cosmic void gradient */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-36 bg-gradient-to-r from-[#000000] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 md:w-36 bg-gradient-to-l from-[#000000] to-transparent z-10 pointer-events-none" />

      {/* Unstoppable Infinite Marquee Track — Duplicated for seamless loop */}
      <div
        key={pathname + "-marquee"}
        className="flex w-max items-center gap-0 will-change-transform animate-cosmic-marquee py-4"
      >
        {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
          <div
            key={`${partner.name}-${idx}`}
            className="partner-card w-64 h-24 md:w-72 md:h-28 mx-4 shrink-0 flex items-center justify-center rounded-2xl bg-white/[0.03] border cursor-pointer select-none transform-gpu"
            style={{
              "--brand-color": partner.color,
              "--brand-color-glow": `${partner.color}60`,
              "--brand-color-soft": `${partner.color}20`,
            } as React.CSSProperties}
          >
            <span className="partner-text font-black text-3xl md:text-4xl tracking-tighter transform-gpu">
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
