
import { EngineeringContent } from "@/components/islands/EngineeringContent";
import { InteractiveGlobe } from "@/components/islands/InteractiveGlobe";

/**
 * Phase 6 — Engineering Authority Section (RSC)
 *
 * Replaces the Pricing section. Validates Matgarco as a high-end SWE startup.
 * Uses zero-layout-thrashing CSS Grid and OLED Black (#000000).
 */
export async function EngineeringAuthoritySection() {
  return (
    <section className="relative py-32 bg-[#000000] border-t border-white/5 overflow-hidden isolate">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Start Side: Massive Typography & Stats Engine */}
          <EngineeringContent />

          {/* End Side: 3D Interactive Globe */}
          <div className="relative z-10 w-full h-full min-h-[600px] flex items-center justify-center">
            {/* Massive Navy Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#000080]/40 rounded-full blur-[180px] -z-20 pointer-events-none" />
            
            {/* The 3D WebGL Globe Engine */}
            <div className="absolute inset-0 z-0">
              <InteractiveGlobe />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
