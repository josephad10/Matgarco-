"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRef, MouseEvent } from "react";

export function ResourcesBridge() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const copy = t.aboutMegaPage?.resourcesBridge;
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax for Mega-Typography
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  // Magnetic Hook Logic (Zero Re-renders)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the magnetic feel
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  function handleMouseMove(e: MouseEvent) {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();

    // Calculate distance from center of the container
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Only move if within a certain radius (e.g., 200px)
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    if (distance < 200) {
      // Scale movement to a 20px radius
      mouseX.set(distanceX * 0.1);
      mouseY.set(distanceY * 0.1);
    } else {
      mouseX.set(0);
      mouseY.set(0);
    }
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  if (!copy) return null;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[60vh] bg-[#000000] flex flex-col items-center justify-center overflow-hidden z-10"
    >
      {/* 1. Phantom Mega-Typography (Parallax) */}
      <motion.div
        style={{ y: parallaxY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="text-[8rem] md:text-[12rem] lg:text-[18rem] font-black uppercase text-white/[0.03] select-none whitespace-nowrap tracking-tighter">
          {isRtl ? "تمكين التجار" : "EMPOWERING MERCHANTS"}
        </span>
      </motion.div>

      {/* 2. The Horizon Light (Ignition Line) */}
      <div className="absolute top-0 left-0 w-full flex justify-center">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        />
      </div>

      {/* 3. The Magnetic Hook & Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            {copy.title}
          </h2>
          <p className="max-w-2xl text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12">
            {copy.subtitle}
          </p>
        </motion.div>

        {/* Magnetic Scroll Indicator */}
        <motion.div
          style={{
            x: magneticX,
            y: magneticY,
          }}
          className="group cursor-pointer relative"
        >
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors duration-500 backdrop-blur-sm">
            <svg
              className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors duration-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>

          {/* Subtle Ripple Effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full border border-blue-500/30"
          />
        </motion.div>
      </div>

      {/* Bottom Horizon Light */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        />
      </div>
    </section>
  );
}
