import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustMarquee } from "@/components/sections/TrustMarquee";
import { SectorShowcaseSection } from "@/components/sections/SectorShowcaseSection";
import { EngineeringAuthoritySection } from "@/components/sections/EngineeringAuthoritySection";
import { QuantusSection } from "@/components/sections/QuantusSection";
import { CompleteEcosystemSection } from "@/components/sections/CompleteEcosystemSection";
import { MerchantJourneySection } from "@/components/sections/MerchantJourneySection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { GlobalFooter } from "@/components/sections/GlobalFooter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <TrustMarquee />
        <SectorShowcaseSection />
        <EngineeringAuthoritySection />
        <QuantusSection />
        <CompleteEcosystemSection />
        <MerchantJourneySection />
        <TestimonialsSection />
      </main>
      <GlobalFooter />
    </div>
  );
}
