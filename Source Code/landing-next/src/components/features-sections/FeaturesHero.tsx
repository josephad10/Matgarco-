"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ar } from "@/i18n/ar";
import { en } from "@/i18n/en";

interface FeaturesHeroProps {
  lang: string;
}

/**
 * FeaturesHero (Phase 9 FINAL VISUAL POLISH)
 * 
 * PREMIUM APPLE-GRADE TYPOGRAPHY:
 * - H1 with bg-clip-text and multi-layer gradients.
 * - Light Navy Blue variant accent for the hook.
 * - Preserved "as const" for Framer Motion variant safety.
 */
export function FeaturesHero({ lang }: FeaturesHeroProps) {
  const t = lang === "ar" ? ar : en;
  const isRTL = lang === "ar";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section 
      className="relative w-full pt-32 pb-20 px-6 md:px-12 lg:pt-48 lg:pb-40 overflow-hidden" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* COLUMN 1: THE TEXT */}
        <motion.div 
          className="flex flex-col items-start relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* H1 (The Hook with Navy Highlight) */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] max-w-4xl text-start"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#82A8FF] to-[#000080] drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              {t.featuresHero.titleHighlight}
            </span>
            
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400">
              {t.featuresHero.titleMain}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-neutral-400 font-medium max-w-2xl mt-6 text-balance text-start"
          >
            {t.featuresHero.subtitle}
          </motion.p>

          {/* Button */}
          <motion.div variants={itemVariants} className="mt-10">
            <Link 
              href="http://localhost:3002/register"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all"
            >
              {t.featuresHero.ctaPrimary}
            </Link>
          </motion.div>
        </motion.div>

        {/* COLUMN 2: THE 3D VISUAL & GLOW */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="relative w-full aspect-square max-w-lg mx-auto lg:mx-0 flex items-center justify-center"
        >
          {/* Radiant Navy Glow */}
          <div className="absolute inset-0 bg-[#000080]/30 blur-[120px] rounded-full pointer-events-none" />
          
          {/* Floating 3D Image Wrapper */}
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ 
              repeat: Infinity, 
              duration: 6, 
              ease: "easeInOut" 
            }}
            className="relative w-full h-full z-10 drop-shadow-[0_0_30px_rgba(0,0,128,0.4)] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]"
          >
            <Image 
              src="/featers photo/featers1.png" 
              alt="Matgarco 3D Engine" 
              fill 
              className="object-contain" 
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
