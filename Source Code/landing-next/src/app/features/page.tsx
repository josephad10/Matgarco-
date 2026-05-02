import { Navbar } from "@/components/layout/Navbar";
import { GlobalFooter } from "@/components/sections/GlobalFooter";
import { FeaturesCosmicBackground } from "@/components/features-islands/FeaturesCosmicBackground";
import { FeaturesClientOrchestrator } from "./FeaturesClientOrchestrator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | Matgarco - Command Your Commerce Ecosystem",
  description: "One Platform. Complete E-Commerce Ecosystem.",
};

export default function FeaturesPage() {
  return (
    <main className="relative w-full min-h-screen">
      {/* 1. FIXED COSMIC ENGINE */}
      <FeaturesCosmicBackground />

      {/* 2. GLOBAL NAVIGATION */}
      <Navbar />

      {/* 3 & 4. CLIENT ORCHESTRATOR FOR i18n SYNC */}
      <FeaturesClientOrchestrator />

      {/* 5. GLOBAL FOOTER */}
      <GlobalFooter />
    </main>
  );
}
