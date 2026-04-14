import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingHero } from "@/components/sections/PricingHero";
import { PricingCards } from "@/components/sections/PricingCards";
import { PricingComparison } from "@/components/sections/PricingComparison";
import { PricingFAQ } from "@/components/sections/PricingFAQ";
import { MegaCTA } from "@/components/sections/MegaCTA";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      
      <main className="flex-grow">
        <PricingHero />
        <PricingCards />
        <PricingComparison />
        <PricingFAQ />
        <MegaCTA />
      </main>

      <Footer />
    </div>
  );
}
