import { Navbar } from "@/components/layout/Navbar";
import { GlobalFooter } from "@/components/sections/GlobalFooter";
import { PricingHero } from "@/components/pricing-islands/PricingHero";
import { PricingToggle } from "@/components/pricing-islands/PricingToggle";
import { PricingCards } from "@/components/pricing-islands/PricingCards";
import { ComparisonMatrix } from "@/components/pricing-islands/ComparisonMatrix";
import { PricingCTA } from "@/components/pricing-islands/PricingCTA";
import { PricingFAQ } from "@/components/pricing-islands/PricingFAQ";
import { ContactSection } from "@/components/pricing-islands/ContactSection";

export const metadata = { title: "Pricing | Matgarco", description: "Transparent pricing in EGP." };

export default function PricingPage() {
  return (
    <div className="bg-[#000000] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full overflow-hidden flex flex-col pt-32 pb-24">
        <PricingHero />
        <div className="pt-16">
          <PricingToggle />
          <PricingCards />
        </div>
        
        {/* Phase 13 Step 3: Deep Comparison Matrix */}
        <div className="mt-32 w-full flex flex-col items-center">
          <h2 className="text-5xl lg:text-6xl font-black text-white text-center tracking-tighter mb-4">
            Features Comparison
          </h2>
          <p className="text-gray-400 text-lg mb-12 text-center max-w-2xl px-4">
            Everything you need to know to choose the perfect plan for your business.
          </p>
          <ComparisonMatrix />
        </div>

        {/* Phase 13 Step 3.5: Final Catch CTA */}
        <PricingCTA />

        {/* Phase 13 Step 4: Shopify-Style FAQ Accordion */}
        <PricingFAQ />

        {/* Phase 13 Step 5: Enterprise Contact System */}
        <ContactSection />
      </main>
      <GlobalFooter />
    </div>
  );
}
