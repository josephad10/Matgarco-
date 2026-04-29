import React from "react";
import { ParallaxWrapper } from "@/components/islands/ParallaxWrapper";
import { HeroBackgroundGrid } from "@/components/islands/HeroBackgroundGrid";
import { HeroContent } from "@/components/islands/HeroContent";

/**
 * HeroSection — Pure RSC Layout Wrapper.
 *
 * Architectural justification: This component ships ZERO client JS.
 * All reactive i18n logic lives in HeroContent (Client Island).
 * All mouse-tracking physics live in ParallaxWrapper (Client Island).
 * This RSC is a spatial container only — it arranges z-layers and
 * the 2-column grid, nothing else.
 */
export function HeroSection() {
  return (
    <section className="relative pt-32 pb-0 overflow-hidden bg-[#050505] min-h-screen flex flex-col justify-between border-b border-white/10 isolate">

      {/* z-0 — Infinite panning e-commerce image grid */}
      <HeroBackgroundGrid />

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10 flex-1 flex flex-col justify-center mt-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">

          {/* Start column — reactive i18n text + CTA */}
          <HeroContent />

          {/* End column — 3D tilt mockup */}
          <div className="relative w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] flex items-center justify-center z-20 pointer-events-auto transform-gpu order-2">
            <ParallaxWrapper />
          </div>

        </div>
      </div>
    </section>
  );
}
