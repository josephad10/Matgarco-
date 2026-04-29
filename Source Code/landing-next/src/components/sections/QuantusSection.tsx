"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { QuantusShowcase } from "@/components/islands/QuantusShowcase";
import { Sparkles, ScanEye, Cpu } from "lucide-react";

export function QuantusSection() {
  const { t, lang } = useLanguage();
  const features = t.quantus?.features || [];
  const icons = [Sparkles, ScanEye, Cpu];

  return (
    <section className="relative py-32 bg-[#000000] border-t border-white/5 overflow-hidden isolate" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Background Radial Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#000080]/30 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[90rem] mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 lg:gap-24">
          
          {/* Start Column: Content & Features */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div className="space-y-6">

              <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-[#3B82F6] to-[#000080] drop-shadow-[0_0_20px_rgba(0,0,128,0.8)] pb-2">
                {t.quantus?.title}
              </h2>
              <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-xl">
                {t.quantus?.subtitle}
              </p>
            </div>

            {/* Features List */}
            <div className="flex flex-col gap-8 mt-4">
              {features.map((feature: any, index: number) => {
                const Icon = icons[index] || Cpu;
                return (
                  <div key={index} className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-[#000080]/30 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] shrink-0 mt-1 group-hover:bg-[#3B82F6]/20 transition-colors">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-white/60 leading-relaxed font-light">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* End Column: Radiant Fader */}
          <div className="lg:col-span-7 w-full relative">
            <QuantusShowcase />
          </div>

        </div>
      </div>
    </section>
  );
}
