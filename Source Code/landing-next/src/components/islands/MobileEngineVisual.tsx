"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { ShoppingBag, AlertCircle } from "lucide-react";

export function MobileEngineVisual() {
  const { t, lang } = useLanguage();
  const [imageError, setImageError] = useState(false);

  // Fallback translation safety
  const notif1 = t.phase7?.notifications?.notif1 || "New Order: 450 EGP";
  const notif2 = t.phase7?.notifications?.notif2 || "Inventory Low: Black Hoodie";

  return (
    <div className="relative w-full max-w-[320px] mx-auto aspect-[1/2] perspective-[1000px]">
      {/* Smartphone Frame */}
      <div className="absolute inset-0 bg-[#050505] rounded-[3rem] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden shadow-[#000080]/30 transform-style-3d rotate-y-[-10deg] rotate-x-[5deg]">
        
        {/* Dynamic Island Notch */}
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-20">
          <div className="w-24 h-6 bg-black rounded-b-2xl"></div>
        </div>

        {/* Content Layer (Image / Skeleton) */}
        <div className="relative w-full h-full bg-[#000000]">
          {!imageError ? (
            <img 
              src="/mobile-mockup.jpg" 
              alt="Mobile Admin Interface"
              className="w-full h-full object-cover opacity-90"
              onError={() => setImageError(true)}
            />
          ) : (
            // Glassmorphic Skeleton Fallback
            <div className="w-full h-full bg-[#000080]/20 animate-pulse flex flex-col p-6 pt-16 gap-4">
              <div className="w-1/2 h-6 bg-white/10 rounded-md"></div>
              <div className="w-full h-32 bg-white/5 rounded-xl"></div>
              <div className="flex gap-2">
                <div className="w-1/2 h-24 bg-white/5 rounded-xl"></div>
                <div className="w-1/2 h-24 bg-white/5 rounded-xl"></div>
              </div>
              <div className="w-full h-12 bg-white/10 rounded-xl mt-auto"></div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Notifications (SKILL V7.0 Spring Physics) */}
      <motion.div 
        className={`absolute top-20 ${lang === 'ar' ? '-right-12' : '-left-12'} z-30 bg-[#000080]/30 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-2xl w-max max-w-[200px]`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
      >
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
          <ShoppingBag size={14} />
        </div>
        <p className="text-white/90 text-xs font-medium truncate">{notif1}</p>
      </motion.div>

      <motion.div 
        className={`absolute bottom-32 ${lang === 'ar' ? '-left-8' : '-right-8'} z-30 bg-[#000080]/30 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-2xl w-max max-w-[220px]`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.4 }}
      >
        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
          <AlertCircle size={14} />
        </div>
        <p className="text-white/90 text-xs font-medium truncate">{notif2}</p>
      </motion.div>
    </div>
  );
}
