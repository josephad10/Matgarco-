import { Navbar } from "@/components/layout/Navbar";
import { GlobalFooter } from "@/components/sections/GlobalFooter";
import { FeaturesHero } from "@/components/sections/FeaturesHero";
import { InteractiveDashboard } from "@/components/sections/InteractiveDashboard";
import { MultiSectorShowcase } from "@/components/sections/MultiSectorShowcase";
import { MobileReadiness } from "@/components/sections/MobileReadiness";


export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      
      <main className="flex-grow">
        <FeaturesHero />
        <InteractiveDashboard />
        <MultiSectorShowcase />
        <MobileReadiness />
        
      </main>

      <GlobalFooter />
    </div>
  );
}
