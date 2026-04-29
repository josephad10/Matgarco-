"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * HeroBackgroundGrid — PERFECT CURVES & GRID ALIGNMENT (V6.2)
 * 
 * Implements a premium Bento Showcase with 48px curved corners,
 * locked max-w-6xl grid alignment, and precision 8px gap mathematics.
 */

const LOOPING_IMAGES = [
  "/background/background1.jpg",
  "/background/background2.jpg",
  "/background/background3.jpg",
  "/background/background1.jpg", // Loop start point
  "/background/background2.jpg",
  "/background/background3.jpg"  // Loop end point
];

export function HeroBackgroundGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505] pointer-events-none z-0">
      {/* OLED Black Overlay (Visual Calibration) */}
      <div className="absolute inset-0 bg-[#000000]/60 z-10" />
      
      {/* Vertical Infinite Marquee (Mathematically Spaced & Locked Grid) */}
      <motion.div
        className="absolute inset-x-0 top-0 flex flex-col gap-2 max-w-6xl mx-auto" // Minimalist 8px gap + locked 6xl grid
        animate={{ translateY: ["0vh", "calc(-300vh - 24px)"] }} // 3 images * 100vh + 3 gaps (8px * 3)
        transition={{ repeat: Infinity, ease: "linear", duration: 60 }} // Slow premium crawl
        style={{ willChange: "transform" }}
      >
        {LOOPING_IMAGES.map((src, index) => (
          <div key={index} className="flex-shrink-0 relative w-full h-[100vh] px-6">
            {/* THE BENTO CARD (48px Curves & OLED Shadow) */}
            <div className="relative w-full h-full overflow-hidden rounded-[48px] border border-white/10 shadow-2xl bg-[#000000]">
              <Image
                src={src}
                alt={`Matgarco Bento Background ${index + 1}`}
                fill
                className="object-cover object-center brightness-75 opacity-90"
                sizes="100vw"
                priority={index < 2}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
