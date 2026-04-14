import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeaturesHero } from "@/components/sections/FeaturesHero";
import { InteractiveDashboard } from "@/components/sections/InteractiveDashboard";
import { MultiSectorShowcase } from "@/components/sections/MultiSectorShowcase";
import { MobileReadiness } from "@/components/sections/MobileReadiness";
import { MegaCTA } from "@/components/sections/MegaCTA";

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      
      <main className="flex-grow">
        <FeaturesHero />
        <InteractiveDashboard />
        <MultiSectorShowcase />
        <MobileReadiness />
        <MegaCTA />
      </main>

      <Footer />
    </div>
  );
}
