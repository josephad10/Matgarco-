"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";

// Dynamically import react-globe.gl to prevent SSR "window is not defined" errors
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export function InteractiveGlobe() {
  const [mounted, setMounted] = useState(false);
  const globeRef = useRef<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cairoLat = 30.0444;
  const cairoLng = 31.2357;

  useEffect(() => {
    if (mounted && globeRef.current) {
      // Set initial point of view
      globeRef.current.pointOfView({ lat: cairoLat - 10, lng: cairoLng, altitude: 2 }, 1000);
      
      const globe = globeRef.current;
      const enableRotation = () => {
        const controls = globe.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = -0.8; // Right-to-Left (West-to-East) rotation
        } else {
          // Retry if controls are not yet initialized
          setTimeout(enableRotation, 100);
        }
      };
      
      enableRotation();
    }
  }, [mounted, cairoLat, cairoLng]);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[600px] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-[#3B82F6] animate-spin" />
      </div>
    );
  }

  // Massive Commerce Flow: 15+ arcs from Cairo
  const arcsData = [
    { startLat: cairoLat, startLng: cairoLng, endLat: 25.2048, endLng: 55.2708, color: "#3B82F6" }, // Dubai
    { startLat: cairoLat, startLng: cairoLng, endLat: 24.7136, endLng: 46.6753, color: "#3B82F6" }, // Riyadh
    { startLat: cairoLat, startLng: cairoLng, endLat: 51.5074, endLng: -0.1278, color: "#3B82F6" }, // London
    { startLat: cairoLat, startLng: cairoLng, endLat: 40.7128, endLng: -74.0060, color: "#3B82F6" }, // NYC
    { startLat: cairoLat, startLng: cairoLng, endLat: 1.3521, endLng: 103.8198, color: "#3B82F6" }, // Singapore
    { startLat: cairoLat, startLng: cairoLng, endLat: 35.6762, endLng: 139.6503, color: "#3B82F6" }, // Tokyo
    { startLat: cairoLat, startLng: cairoLng, endLat: -23.5505, endLng: -46.6333, color: "#3B82F6" }, // São Paulo
    { startLat: cairoLat, startLng: cairoLng, endLat: 19.0760, endLng: 72.8777, color: "#3B82F6" }, // Mumbai
    { startLat: cairoLat, startLng: cairoLng, endLat: -33.8688, endLng: 151.2093, color: "#3B82F6" }, // Sydney
    { startLat: cairoLat, startLng: cairoLng, endLat: 52.5200, endLng: 13.4050, color: "#3B82F6" }, // Berlin
    { startLat: cairoLat, startLng: cairoLng, endLat: 48.8566, endLng: 2.3522, color: "#3B82F6" }, // Paris
    { startLat: cairoLat, startLng: cairoLng, endLat: -33.9249, endLng: 18.4241, color: "#3B82F6" }, // Cape Town
    { startLat: cairoLat, startLng: cairoLng, endLat: 34.0522, endLng: -118.2437, color: "#3B82F6" }, // LA
    { startLat: cairoLat, startLng: cairoLng, endLat: 55.7558, endLng: 37.6173, color: "#3B82F6" }, // Moscow
    { startLat: cairoLat, startLng: cairoLng, endLat: -1.2921, endLng: 36.8219, color: "#3B82F6" }, // Nairobi
  ];

  // Permanent Radiant Glow over Cairo
  const labelsData = [
    {
      lat: cairoLat,
      lng: cairoLng,
      text: t.engineering?.floating?.egypt || "Egypt",
      color: "#3B82F6",
      size: 2,
    },
  ];

  const htmlElementsData = [
    { lat: cairoLat, lng: cairoLng },
  ];

  const floatingTitles = [
    { text: t.engineering?.floating?.title1, pos: "top-10 left-0", delay: 0 },
    { text: t.engineering?.floating?.title2, pos: "top-32 right-10", delay: 1 },
    { text: t.engineering?.floating?.title3, pos: "bottom-32 left-10", delay: 0.5 },
    { text: t.engineering?.floating?.title4, pos: "bottom-10 right-0", delay: 1.5 },
  ];

  return (
    <div className="w-full aspect-square md:aspect-[20/10] min-h-[600px] flex items-center justify-center relative cursor-grab active:cursor-grabbing">
      {/* Floating Badges */}
      {floatingTitles.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.pos} z-20 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[12px] md:text-sm font-medium text-white/80 pointer-events-none whitespace-nowrap hidden sm:block`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: [0, -10, 0] 
          }}
          transition={{ 
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: item.delay },
            opacity: { duration: 0.8, delay: i * 0.2 }
          }}
        >
          {item.text}
        </motion.div>
      ))}

      <Globe
        ref={globeRef}
        width={700}
        height={700}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="#000080"
        atmosphereAltitude={0.15}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.8}
        arcDashGap={0.1}
        arcDashAnimateTime={1000}
        arcsTransitionDuration={0}
        labelsData={labelsData}
        labelDotRadius={1.5}
        labelColor="color"
        labelText={() => ""}
        htmlElementsData={htmlElementsData}
        htmlElement={() => {
          const el = document.createElement("div");
          el.className = "w-3 h-3 bg-[#3B82F6] rounded-full animate-pulse shadow-[0_0_30px_15px_rgba(59,130,246,0.6)]";
          return el;
        }}
      />
    </div>
  );
}
