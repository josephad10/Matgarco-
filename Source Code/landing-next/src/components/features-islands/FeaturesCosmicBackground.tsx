"use client";

import { CanvasStarfield } from "@/components/islands/CanvasStarfield";

/**
 * FeaturesCosmicBackground (Phase 9 FINAL VISUAL POLISH)
 * 
 * DIRECTIVES:
 * - fixed inset-0 z-[-100] bg-[#000000] (OLED Black + Hidden behind global layout).
 * - Reduced star noise (20% opacity).
 * - Subtle navy glow (10% opacity).
 */
export function FeaturesCosmicBackground() {
  return (
    <div className="fixed inset-0 z-[-100] bg-[#000000] pointer-events-none overflow-hidden">
      {/* Reduced Stars Noise */}
      <div className="opacity-20 absolute inset-0">
        <CanvasStarfield />
      </div>
      
      {/* Subtle Background Glow (Reduced) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#000080]/10 blur-[150px] rounded-full" />
    </div>
  );
}
