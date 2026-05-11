"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageContext";

export function PaymentIsland() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const copy = t.featuresPage?.paymentSection;

  if (!copy) return null;

  return (
    <section className="relative w-full py-32 border-none outline-none bg-transparent overflow-hidden">
      
      {/* Background Deep Navy Glows */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Navy Glow instead of Emerald */}
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#000080]/10 blur-[150px] rounded-full -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`w-full lg:col-span-7 flex items-center justify-center ${isRtl ? "lg:order-2" : "lg:order-1"}`}
          >
            <div className="relative w-full rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(0,0,128,0.08)] border border-white/5">
              <Image 
                src="/featers%20photo/payment.jpeg" 
                alt="Matgarco Local Payments Checkout" 
                width={1200}
                height={900}
                className="w-full h-auto rounded-[2rem]"
                priority
              />
            </div>
          </motion.div>

          {/* Text Column */}
          <motion.div 
            initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col lg:col-span-5 ${isRtl ? "text-right lg:order-1" : "text-left lg:order-2"}`}
          >
            {/* Updated to Navy #000080 */}
            <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#000080] to-blue-700 uppercase tracking-[0.2em] mb-4 block">
              {copy.category}
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
              {copy.title}
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed font-medium mb-10">
              {copy.desc}
            </p>

            {/* Premium Pill-Style payment badges */}
            <div className="flex flex-wrap gap-3">
              {copy.cards.map((card: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-3 rtl:space-x-reverse bg-white/[0.03] border border-white/10 px-5 py-3 rounded-full backdrop-blur-sm shadow-xl hover:bg-white/[0.08] transition-colors duration-300">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    card.includes("InstaPay") ? 'bg-purple-500 shadow-[0_0_12px_#A855F7]' : 
                    card.includes("Fawry") ? 'bg-yellow-400 shadow-[0_0_12px_#FACC15]' : 
                    'bg-blue-600 shadow-[0_0_12px_#2563EB]'
                  }`} />
                  <span className="text-white font-bold text-sm md:text-base">{card}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
