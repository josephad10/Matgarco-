"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { MouseEvent } from "react";

function LuxuryCard({ title, desc, icon, glowColor, delay }: { title: string, desc: string, icon: React.ReactNode, glowColor: string, delay: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 400, damping: 40 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 40 });

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-[2.5rem] p-[1px] overflow-hidden transition-transform duration-700 hover:-translate-y-2`}
    >
      {/* 1px Animated Border Glow matching the Mouse */}
      <motion.div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, ${glowColor}, transparent 40%)`,
        }}
      />
      {/* Static subtle border fallback */}
      <div className="absolute inset-0 rounded-[2.5rem] border border-white/10 z-0" />

      {/* Main Card Body */}
      <div className="relative z-10 bg-[#050505] w-full h-full rounded-[calc(2.5rem-1px)] p-10 lg:p-16 overflow-hidden flex flex-col items-start justify-center">
        
        {/* Deep Ambient Background Glow */}
        <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-[${glowColor}] opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
        
        {/* Subtle Tech Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {/* Inner Mouse Spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-screen"
          style={{
            background: useMotionTemplate`radial-gradient(500px circle at ${springX}px ${springY}px, ${glowColor}, transparent 80%)`,
            opacity: 0.1
          }}
        />
        
        {/* Content */}
        <div className="relative z-20">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-700 shadow-2xl backdrop-blur-md">
            {icon}
          </div>
          <h3 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-lg">{title}</h3>
          <p className="text-xl text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors duration-500">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function VisionMission() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const copy = t.aboutPage;

  if (!copy) return null;

  return (
    <section className="relative w-full py-32 bg-[#000000] z-10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-900/10 blur-[200px] rounded-[100%] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12" dir={isRtl ? "rtl" : "ltr"}>
          <LuxuryCard 
            delay={0}
            title={copy.missionTitle} 
            desc={copy.missionDesc} 
            glowColor="rgba(59,130,246,0.8)" // Blue
            icon={<svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
          />
          <LuxuryCard 
            delay={0.2}
            title={copy.visionTitle} 
            desc={copy.visionDesc} 
            glowColor="rgba(16,185,129,0.8)" // Emerald
            icon={<svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
          />
        </div>
      </div>
    </section>
  );
}
