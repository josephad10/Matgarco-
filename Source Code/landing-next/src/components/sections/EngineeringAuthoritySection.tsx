
import { EngineeringContent } from "@/components/islands/EngineeringContent";
import { InteractiveGlobe } from "@/components/islands/InteractiveGlobe";
import { CanvasStarfield } from "@/components/islands/CanvasStarfield";

/**
 * Phase 6 — Engineering Authority Section (RSC)
 *
 * Replaces the Pricing section. Validates Matgarco as a high-end SWE startup.
 * Uses zero-layout-thrashing CSS Grid and OLED Black (#000000).
 */
export async function EngineeringAuthoritySection() {
  return (
    <section className="relative w-full py-24 bg-[#050505] overflow-hidden isolate">
      {/* 1. Full Section Stars Background (The Open Void) */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <CanvasStarfield />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Start Side: Massive Typography & Stats Engine */}
          <EngineeringContent />

          {/* Right Column: Free-Floating Globe (NO BORDERS, NO BOX) */}
          <div className="relative w-full aspect-square md:aspect-[20/10] min-h-[600px] flex items-center justify-center">
            {/* Massive Navy Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#000080]/30 rounded-full blur-[180px] -z-10 pointer-events-none" />
            
            <InteractiveGlobe />
          </div>

        </div>
      </div>
    </section>
  );
}
