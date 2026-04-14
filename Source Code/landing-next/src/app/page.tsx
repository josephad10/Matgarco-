"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustMarquee } from "@/components/sections/TrustMarquee";
import { EdgeBentoSection } from "@/components/sections/EdgeBentoSection";
import { TimelineSteps } from "@/components/sections/TimelineSteps";
import { Testimonials } from "@/components/sections/Testimonials";
import { MegaCTA } from "@/components/sections/MegaCTA";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <TrustMarquee />
        <EdgeBentoSection />
        <TimelineSteps />
        <Testimonials />
        <MegaCTA />
      </main>
      <Footer />
    </div>
  );
}
