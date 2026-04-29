import { MarqueeEngine } from "@/components/islands/MarqueeEngine";
import { GalaxyText, FeaturePillsBlock } from "@/components/islands/GalaxyText";

/**
 * Phase 3 + 4 — Unified Cosmic Galaxy Section (RSC Wrapper)
 *
 * Pure Server Component. All user-visible text is rendered by the
 * GalaxyText and FeaturePillsBlock Client Islands which read
 * t.galaxy.* via useLanguage(). Zero hardcoded strings.
 *
 * This RSC provides:
 * - The OLED Void Black (#000000) cosmic background with SUPERNOVA star field
 * - The spatial layout container for MarqueeEngine, GalaxyText, FeaturePillsBlock
 */

export function TrustMarquee() {
  return (
    <section className="relative overflow-hidden bg-[#000000] py-32 isolate">

      {/* ═══════════════════════════════════════════════════════════
          STAR LAYER 1: Dense dust (1px) — opacity 100%
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 2% 8%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 8% 28%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 13% 52%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 19% 75%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 24% 15%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 30% 90%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 36% 38%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 42% 62%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 47% 5%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 53% 82%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 58% 22%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 64% 48%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 69% 70%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 75% 12%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 80% 55%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 86% 85%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 91% 32%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 96% 65%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 3% 45%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 15% 95%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 40% 18%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 62% 92%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 84% 42%, #fff 100%, transparent 100%),
            radial-gradient(1px 1px at 73% 88%, #fff 100%, transparent 100%)
          `,
        }}
      />

      {/* ═══════════════════════════════════════════════════════════
          STAR LAYER 2: Mid-range (2px) — opacity 100%
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(2px 2px at 6% 22%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 15% 55%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 25% 35%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 34% 78%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 44% 12%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 53% 62%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 63% 85%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 72% 28%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 82% 68%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 91% 45%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 10% 88%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 48% 42%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 78% 8%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 38% 95%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 88% 18%, #fff 100%, transparent 100%),
            radial-gradient(2px 2px at 20% 72%, #fff 100%, transparent 100%)
          `,
        }}
      />

      {/* ═══════════════════════════════════════════════════════════
          STAR LAYER 3: Glowing (3px) — Supernova, opacity 100%, 2s twinkle
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none animate-pulse"
        style={{
          animationDuration: "2s",
          backgroundImage: `
            radial-gradient(3px 3px at 8% 18%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 70%),
            radial-gradient(3px 3px at 22% 55%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 70%),
            radial-gradient(3px 3px at 38% 22%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 70%),
            radial-gradient(3px 3px at 52% 75%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 70%),
            radial-gradient(3px 3px at 68% 38%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 70%),
            radial-gradient(3px 3px at 82% 65%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 70%),
            radial-gradient(3px 3px at 92% 15%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 70%),
            radial-gradient(3px 3px at 28% 88%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 70%),
            radial-gradient(3px 3px at 58% 48%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 70%),
            radial-gradient(3px 3px at 75% 92%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 70%)
          `,
          filter: "drop-shadow(0 0 6px #fff) drop-shadow(0 0 12px rgba(255,255,255,0.6))",
        }}
      />

      {/* ═══════════════════════════════════════════════════════════
          STAR LAYER 4: Beacon stars (4px) — MAX radiant bloom, 12px glow
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none animate-pulse"
        style={{
          animationDuration: "3.5s",
          backgroundImage: `
            radial-gradient(4px 4px at 12% 30%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 80%),
            radial-gradient(4px 4px at 35% 70%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 80%),
            radial-gradient(4px 4px at 60% 20%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 80%),
            radial-gradient(4px 4px at 85% 55%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 80%),
            radial-gradient(4px 4px at 48% 90%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 80%),
            radial-gradient(4px 4px at 95% 40%, #fff 100%, rgba(255,255,255,0.9) 100%, transparent 80%)
          `,
          filter: "drop-shadow(0 0 12px #fff) drop-shadow(0 0 24px rgba(255,255,255,0.8)) drop-shadow(0 0 40px rgba(180,200,255,0.4))",
        }}
      />

      {/* Border glow lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Client Island: i18n Partner Program headings */}
      <div className="relative z-10">
        <GalaxyText />
      </div>

      {/* Client Island: Unstoppable Card-Based MarqueeEngine */}
      <div className="relative z-10 mt-16">
        <MarqueeEngine />
      </div>

      {/* Client Island: i18n Feature Pills with Lucide Icons */}
      <div className="relative z-10">
        <FeaturePillsBlock />
      </div>
    </section>
  );
}
