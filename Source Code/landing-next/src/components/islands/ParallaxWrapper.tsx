"use client";

import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { StoreMockup } from "./StoreMockup";

export function ParallaxWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(smoothY, [-1, 1], [20, -20]);
  const rotateY = useTransform(smoothX, [-1, 1], [-20, 20]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set(Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2))));
      mouseY.set(Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2))));
    };
    const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center relative z-20" style={{ perspective: 1200 }}>
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative w-full max-w-2xl">
        <StoreMockup />
      </motion.div>
    </div>
  );
}
