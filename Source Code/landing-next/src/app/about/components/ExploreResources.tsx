"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { MouseEvent, useState } from "react";

export function ExploreResources() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const copy = t.aboutMegaPage?.exploreResources;
  const [isClicked, setIsClicked] = useState(false);

  // Zero-Rerender Mouse Spotlight Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightStyle = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.15), transparent 80%)`;

  if (!copy) return null;

  return (
    <section className="relative w-full pb-40 bg-[#000000] z-10 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight mb-4 drop-shadow-2xl">
              {copy.title}
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto">
              {copy.subtitle}
            </p>
          </motion.div>
        </div>

        {/* The Cinematic Video Hub */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={handleMouseMove}
          onClick={() => setIsClicked(true)}
          className="relative max-w-5xl mx-auto aspect-video min-h-[400px] bg-[#050505] border border-white/10 rounded-[3rem] overflow-hidden cursor-pointer group shadow-2xl"
        >
          {/* 1. Zero-Rerender Spotlight */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen"
            style={{ background: spotlightStyle }}
          />

          {/* 2. Tech Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* 3. Center Play Button UI */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl mb-8 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all duration-700 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]"
            >
              <svg
                className="w-10 h-10 md:w-14 md:h-14 text-white group-hover:text-blue-400 transition-colors duration-700 fill-current ml-2"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              className="space-y-2"
            >
              <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic opacity-90">
                {copy.videoTitle}
              </h3>
              <p className="text-base md:text-lg text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
                {copy.videoDesc}
              </p>
            </motion.div>
          </div>

          {/* 4. Coming Soon Overlay */}
          <AnimatePresence>
            {isClicked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/60 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="max-w-md w-full bg-white/5 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"
                >
                  <h4 className="text-3xl font-black text-white mb-4 tracking-tight">
                    {copy.comingSoonTitle}
                  </h4>
                  <p className="text-lg text-slate-300 font-medium mb-8 leading-relaxed">
                    {copy.comingSoonDesc}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsClicked(false);
                    }}
                    className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-500 active:scale-95"
                  >
                    {copy.closeButton}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
