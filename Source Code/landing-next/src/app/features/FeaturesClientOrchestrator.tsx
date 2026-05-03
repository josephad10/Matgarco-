"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { FeaturesHero } from "@/components/features-sections/FeaturesHero";
import { InteractiveBento } from "@/components/features-islands/InteractiveBento";
import { WorkspaceShowcase } from "@/components/features-islands/WorkspaceShowcase";
import { SectorShowcase } from "@/components/features-islands/SectorShowcase";
import { ShippingIsland } from "@/components/features/ShippingIsland";

/**
 * FeaturesClientOrchestrator
 * Reads the client-side language state from the global LanguageContext
 * and passes it down securely to the UI islands, ensuring perfect sync with the Navbar.
 */
export function FeaturesClientOrchestrator() {
  const { lang } = useLanguage();

  return (
    <>
      {/* 3. HERO CONTENT */}
      <FeaturesHero lang={lang} />

      {/* 4. INTERACTIVE BENTO ECOSYSTEM (PHASE 10) */}
      <InteractiveBento lang={lang} />

      {/* 5. WORKSPACE SHOWCASE (PHASE 10.5) */}
      <WorkspaceShowcase lang={lang} />

      {/* 6. SECTOR SHOWCASE (PHASE 11) */}
      <SectorShowcase lang={lang} />

      {/* 7. LUXURY SHIPPING SECTION (PHASE 13) */}
      <ShippingIsland />
    </>
  );
}
