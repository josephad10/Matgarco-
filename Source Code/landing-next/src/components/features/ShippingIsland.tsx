"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageContext";

export function ShippingIsland() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const copy = t.featuresPage?.shippingSection;

  if (!copy) return null;

  return (
    // 1. Removed all background colors, dots, and borders to blend with global features page stars.
    <section className="relative w-full py-32 border-none outline-none bg-transparent">
      
      <div className="relative max-w-7xl mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Column */}
          <motion.div 
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col lg:col-span-5 ${isRtl ? "text-right lg:order-2" : "text-left lg:order-1"}`}
          >
            <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase tracking-[0.2em] mb-4 block">
              {copy.category}
            </span>
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-6 tracking-tight drop-shadow-2xl">
              {copy.title}
            </h2>
            <h3 className="sr-only">Shipping Services</h3>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl font-medium mb-10">
              {copy.desc}
            </p>

            {/* Premium Pill-Style Bullets */}
            <div className="flex flex-wrap gap-4">
              {copy.cards.map((card: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-3 rtl:space-x-reverse bg-white/5 border border-white/10 px-5 py-3 rounded-full backdrop-blur-sm shadow-xl">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]" />
                  <span className="text-white font-bold text-sm md:text-base">{card}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image Column: Exact Shopify Staggered Grid */}
          <div className={`w-full flex items-center justify-center mt-12 lg:mt-0 lg:col-span-7 ${isRtl ? "lg:order-1" : "lg:order-2"}`}>
            <div className="grid grid-cols-3 gap-4 md:gap-8 items-center w-full max-w-full" dir="ltr">
              
              {/* Left Image (Lowered) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 40 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 scale-100"
              >
                <Image src="/shipping/ship-phone.png" alt="Step 1" fill className="object-cover" />
              </motion.div>

              {/* Center Image (Elevated & Larger) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: -20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.2)] border border-white/20 z-20 scale-[1.20]"
              >
                <Image src="/shipping/ship-boxes.png" alt="Step 2" fill className="object-cover" />
              </motion.div>

              {/* Right Image (Lowered) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 40 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 scale-100"
              >
                <Image src="/shipping/ship-pin.jpg" alt="Step 3" fill className="object-cover" />
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
