import { Navbar } from "@/components/layout/Navbar";
import { GlobalFooter } from "@/components/sections/GlobalFooter";
import { PricingHero } from "@/components/sections/PricingHero";
import { PricingCards } from "@/components/sections/PricingCards";
import { PricingComparison } from "@/components/sections/PricingComparison";
import { PricingFAQ } from "@/components/sections/PricingFAQ";


export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      
      <main className="flex-grow">
        <PricingHero />
        <PricingCards />
        <PricingComparison />
        <PricingFAQ />
        
      </main>

      <GlobalFooter />
    </div>
  );
}
