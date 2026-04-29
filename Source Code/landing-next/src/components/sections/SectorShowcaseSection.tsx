import { InfiniteShowcase } from "@/components/islands/InfiniteShowcase";

/**
 * Phase 5 — SectorShowcaseSection (RSC Wrapper)
 *
 * Pure Server Component wrapping the interactive InfiniteShowcase client island.
 * All user-visible text is read from t.sectors.* inside the Client Island
 * via useLanguage(). This RSC is a spatial container only.
 *
 * Strict Islands Architecture — no "use client" directive.
 */
export function SectorShowcaseSection() {
  return (
    <section className="relative py-32 bg-[#000000] border-t border-white/5 isolate overflow-hidden">
      {/* Deep Space Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#000080]/10 rounded-full blur-[150px]" />
      </div>

      {/* Client Island: Infinite Image Loop & 3-Column Grid */}
      <div className="relative z-10">
        <InfiniteShowcase />
      </div>
    </section>
  );
}
