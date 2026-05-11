"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

export function AboutStoryHero() {
  const { t, lang } = useLanguage();
  const copy = t.aboutMegaPage?.hero;

  if (!copy) return null;

  const words = copy.story.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, damping: 20, stiffness: 100 } 
    }
  };

  // REFINED PHYSICS: Stronger opacity, wider sway, sharper widths.
  const rays = [
    { id: 1, rotate: -38, width: "160px", duration: 7, delay: 0, opacity: [0.15, 0.45, 0.15], sway: 3.5 },
    { id: 2, rotate: -22, width: "220px", duration: 5, delay: 1, opacity: [0.25, 0.65, 0.25], sway: 2.5 },
    { id: 3, rotate: -8, width: "320px", duration: 8, delay: 2, opacity: [0.5, 0.95, 0.5], sway: 2 }, // Strong central beam
    { id: 4, rotate: 10, width: "260px", duration: 6, delay: 0.5, opacity: [0.4, 0.85, 0.4], sway: 2.5 }, // Strong central beam
    { id: 5, rotate: 24, width: "180px", duration: 9, delay: 1.5, opacity: [0.2, 0.6, 0.2], sway: 3 },
    { id: 6, rotate: 40, width: "140px", duration: 5.5, delay: 2.5, opacity: [0.1, 0.4, 0.1], sway: 4 },
  ];

  return (
    <section className="relative w-full flex flex-col items-center justify-center bg-[#000000] overflow-hidden pt-[150px] pb-32 min-h-[90vh]">
      
      {/* VOLUMETRIC RAYS CONTAINER */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[1000px] pointer-events-none z-0 flex justify-center"
        style={{ filter: 'blur(8px)' }} // REDUCED BLUR for sharper, purer light definition
      >
        {/* The Individual Shimmering Rays */}
        {rays.map((ray) => (
          <motion.div
            key={ray.id}
            // BRIGHTER GRADIENT: from-white/50 instead of white/30
            className="absolute top-0 h-full bg-gradient-to-b from-white/50 via-white/10 to-transparent mix-blend-screen"
            style={{
              width: ray.width,
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              transformOrigin: 'top center',
            }}
            initial={{ rotate: ray.rotate, opacity: ray.opacity[0] }}
            animate={{
              opacity: ray.opacity,
              // ENHANCED SWAY for visible water-caustic motion
              rotate: [ray.rotate, ray.rotate + ray.sway, ray.rotate - ray.sway, ray.rotate],
            }}
            transition={{
              duration: ray.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: ray.delay
            }}
          />
        ))}

        {/* The Central Lamp Hotspot - Intensified */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-white/40 blur-[40px] pointer-events-none rounded-full" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[80px] bg-white/80 blur-[20px] pointer-events-none rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center mt-10">
        
        <motion.h1 
          className="text-3xl md:text-5xl lg:text-[4rem] font-black text-white leading-[1.3] lg:leading-[1.2] tracking-tight mb-20 flex flex-wrap justify-center gap-x-3 gap-y-2 lg:gap-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          {words.map((word: string, index: number) => (
            <motion.span key={index} variants={wordVariants} className="inline-block">
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: (words.length * 0.1) + 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#000080] to-blue-600 drop-shadow-[0_0_40px_rgba(0,0,128,0.6)]">
            {copy.hook}
          </h2>
        </motion.div>

      </div>
    </section>
  );
}
