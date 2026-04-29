"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";

export function GlowingJourneyPath() {
  const { t, lang } = useLanguage();

  const steps = t.journey?.steps;
  if (!steps || !Array.isArray(steps)) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-20" dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* Continuous Horizontal Connecting Line (Desktop) */}
      <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-[2px] bg-blue-900/50 z-0" />

      {/* Journey Nodes */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {steps.map((step: any, index: number) => {
          return (
            <motion.div 
              key={index} 
              className="flex flex-col items-center relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2, type: "spring", stiffness: 100 }}
            >
              {/* The Numbered Circle (sits perfectly on the line) */}
              <div className="w-12 h-12 rounded-full bg-[#000080] border-2 border-blue-400 flex items-center justify-center text-xl font-black text-white shadow-[0_0_20px_#3B82F6] z-10 relative">
                {index + 1}
              </div>

              {/* The Card (sits below) */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mt-8 bg-gradient-to-b from-[#050510] to-[#020205] border border-white/10 rounded-2xl p-6 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] w-full h-full flex flex-col items-center backdrop-blur-md relative overflow-hidden group-hover:border-blue-500/50 group-hover:shadow-[0_0_30px_rgba(0,0,128,0.8)] transition-all duration-300"
              >
                {/* Subtle top glow on card */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#3B82F6]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />
                
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {step.desc}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
