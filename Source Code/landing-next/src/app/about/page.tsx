import { Navbar } from "@/components/layout/Navbar";
import { GlobalFooter } from "@/components/sections/GlobalFooter";
import { AboutStoryHero } from "./components/AboutStoryHero";
import { VisionMission } from "./components/VisionMission";
import { CompanyValues } from "./components/CompanyValues";
import { MeetTheTeam } from "./components/MeetTheTeam";
import { ResourcesBridge } from "./components/ResourcesBridge";
import { ExploreResources } from "./components/ExploreResources";
import { PopularGuides } from "./components/PopularGuides";

export const metadata = {
  title: "About Us | Matgarco",
  description: "Building the future of e-commerce in Egypt.",
};

export default function AboutPage() {
  return (
    <div className="w-full bg-[#000000] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <AboutStoryHero />
        <MeetTheTeam />
        {/* Sections 16 and 17 explicitly moved AFTER the team */}
        <VisionMission />
        <CompanyValues />
        <ResourcesBridge />
        <ExploreResources />
        <PopularGuides />
      </main>
      <GlobalFooter />
    </div>
  );
}
