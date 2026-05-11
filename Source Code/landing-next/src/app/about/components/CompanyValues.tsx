"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { MouseEvent } from "react";

const valueIcons = [
  <svg key="1" className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  <svg key="2" className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  <svg key="3" className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  <svg key="4" className="w-7 h-7 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
];

const glowColors = ["rgba(96,165,250,0.8)", "rgba(192,132,252,0.8)", "rgba(52,211,153,0.8)", "rgba(250,204,21,0.8)"];

function ValueCard({ value, idx }: { value: any, idx: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 400, damping: 40 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 40 });

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const glowColor = glowColors[idx];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: idx * 0.1, type: "spring", stiffness: 100 }}
      onMouseMove={handleMouseMove}
      className="group relative rounded-[2rem] p-[1px] overflow-hidden transition-transform duration-500 hover:-translate-y-2 cursor-default"
    >
      {/* Dynamic Border Reveal (Linear.app Style) */}
      <motion.div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: useMotionTemplate`radial-gradient(400px circle at ${springX}px ${springY}px, ${glowColor}, transparent 50%)` }}
      />
      <div className="absolute inset-0 rounded-[2rem] border border-white/5 z-0" />

      {/* Inner Card */}
      <div className="relative z-10 w-full h-full bg-[#080808] rounded-[calc(2rem-1px)] p-8 flex flex-col">
        <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 transition-all duration-500 border border-white/5 group-hover:border-white/20 group-hover:scale-110 shadow-lg`}>
          {valueIcons[idx]}
        </div>
        <h4 className="text-2xl font-bold text-white mb-4 tracking-tight drop-shadow-sm">{value.title}</h4>
        <p className="text-base text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors duration-300">{value.desc}</p>
      </div>
    </motion.div>
  );
}

export function CompanyValues() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const copy = t.aboutPage;

  if (!copy) return null;

  return (
    <section className="relative w-full pb-40 bg-[#000000] z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-2xl">
            {copy.valuesTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" dir={isRtl ? "rtl" : "ltr"}>
          {copy.values.map((value: any, idx: number) => (
            <ValueCard key={idx} value={value} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
