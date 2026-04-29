"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = [
  "/quantus/quantus-1.jpg",
  "/quantus/quantus-2.jpg",
  "/quantus/quantus-3.jpg",
];

export function QuantusShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 8000); // Change image every 8 seconds

    // Strict cleanup function to prevent memory leaks and protect the Event Loop
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-[16/10] lg:aspect-video rounded-2xl overflow-hidden bg-[#020205] border-[2px] border-[#3B82F6]/50 shadow-[0_0_80px_15px_rgba(0,0,128,0.6),inset_0_0_30px_rgba(0,0,128,0.4)] isolate">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={IMAGES[index]}
          alt={`Matgarco Quantus UI Showcase ${index + 1}`}
          className="absolute inset-0 w-full h-full object-contain"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </AnimatePresence>
    </div>
  );
}
