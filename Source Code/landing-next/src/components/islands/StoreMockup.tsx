"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, ShoppingBag, BarChart3, Settings, TrendingUp, CheckCircle2, MousePointer2, Zap, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";

// Natural Elegance: High-quality, bright, naturally colored Unsplash URLs
const PRODUCTS = [
  { img: "/mockup/shirt.jpg", title: "Classic Black Shirt", price: "EGP 1,200.00" },
  { img: "/mockup/sweater.jpg", title: "Premium Zip Sweater", price: "EGP 1,850.00" },
  { img: "/mockup/jacket.jpg", title: "Geim Storm Jacket", price: "EGP 3,400.00" },
];

export function StoreMockup() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const products = t.mockup.products;

  return (
    <div className="relative w-full h-full">

      {/* Flying Badge: Top-End — API Paymob */}
      <motion.div
        key={pathname + "-paymob"}
        className="absolute -top-8 -end-8 z-30 flex items-center gap-3 bg-[#050505] border border-white/20 rounded-2xl px-4 py-3 shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <CheckCircle2 size={20} className="text-[#3B82F6] shrink-0" />
        <div className="flex flex-col">
          <span className="text-white text-sm font-bold tracking-tight">{t.mockup.paymob}</span>
          <span className="text-[#3B82F6] text-xs font-semibold tracking-tight">{t.mockup.secure}</span>
        </div>
      </motion.div>

      {/* Flying Badge: Bottom-Start — Conversion (Navy Theme) */}
      <motion.div
        key={pathname + "-conversion"}
        className="absolute -bottom-8 -start-8 z-30 flex items-center gap-3 bg-[#000080] border border-white/20 rounded-2xl px-4 py-3 shadow-[0_20px_40px_rgba(0,0,128,0.6)] backdrop-blur-xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
      >
        <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
          <TrendingUp size={20} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-white/80 text-xs uppercase tracking-widest font-semibold">{t.mockup.conversion}</span>
          <span className="text-white text-base font-black tracking-tight">{t.mockup.spike}</span>
        </div>
      </motion.div>

      {/* Main Window */}
      <div className="w-full bg-[#050505] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-[inset_0_1px_0_rgba(255,255,255,0.08),_0_30px_60px_rgba(0,0,0,0.9)]">

        {/* Mac OS Chrome */}
        <div className="h-12 flex items-center px-4 border-b border-white/10 bg-[#050505] relative shrink-0">
          <div className="flex gap-2 items-center absolute start-4">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500/90 shadow-inner" />
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/90 shadow-inner" />
            <div className="w-3.5 h-3.5 rounded-full bg-green-500/90 shadow-inner" />
          </div>
          <div className="mx-auto bg-white/5 border border-white/10 rounded-lg px-10 py-1.5 text-[11px] text-white/50 font-mono tracking-widest">
            app.matgarco.com
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 h-[520px]">
          {/* Sidebar */}
          <div className="w-[68px] sm:w-[210px] flex flex-col gap-1 border-e border-white/10 bg-[#050505] p-4 shrink-0">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#000080] border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] flex items-center justify-center shrink-0">
                <Zap size={18} className="text-white" />
              </div>
              <div className="hidden sm:flex flex-col overflow-hidden">
                <span className="text-white text-sm font-bold tracking-tight truncate">Matgarco</span>
                <span className="text-white/40 text-xs font-semibold">{t.mockup.proDashboard}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#000080]/40 border border-[#000080] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] cursor-pointer">
              <LayoutDashboard size={18} className="text-[#3B82F6] shrink-0" />
              <span className="hidden sm:block text-white text-sm font-bold tracking-tight">{t.mockup.storefront}</span>
            </div>
            {[{ Icon: ShoppingBag, label: t.mockup.products_nav }, { Icon: BarChart3, label: t.mockup.analytics }].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors opacity-60 hover:opacity-100">
                <Icon size={18} className="text-white/80 shrink-0" />
                <span className="hidden sm:block text-white/80 text-sm font-medium tracking-tight">{label}</span>
              </div>
            ))}
            <div className="mt-auto flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors opacity-60 hover:opacity-100">
              <Settings size={18} className="text-white/80 shrink-0" />
              <span className="hidden sm:block text-white/80 text-sm font-medium tracking-tight">{t.mockup.settings}</span>
            </div>
          </div>

          {/* Canvas - The Editable Storefront */}
          <div className="flex-1 bg-[#050505] overflow-hidden flex flex-col p-5 gap-5 relative">
            
            {/* Fake Storefront Navigation Bar */}
            <div className="w-full flex items-center justify-between shrink-0 mb-2 px-1">
              <span className="text-white font-serif font-bold text-xl tracking-wide">LUXE</span>
              <div className="hidden md:flex items-center gap-2 bg-white/10 border border-white/5 rounded-full h-6 px-3 w-32">
                <Search size={10} className="text-white/50" />
                <span className="text-white/40 text-[9px]">{t.mockup.search}</span>
              </div>
              <div className="relative cursor-pointer">
                <ShoppingCart size={18} className="text-white/90" />
                <div className="absolute -top-1.5 -end-1.5 w-3.5 h-3.5 bg-[#3B82F6] rounded-full flex items-center justify-center text-[8px] font-bold text-white border border-[#050505]">2</div>
              </div>
            </div>

            {/* Interactive Tutorial — Glide to Products */}
            <motion.div
              key={pathname + "-cursor"}
              className="absolute z-50 flex items-center gap-2 pointer-events-none"
              style={{ top: "45%", insetInlineStart: "40%" }}
              animate={{ x: [0, -30, -30, 0], y: [0, 100, 100, 0], scale: [1, 1, 0.8, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <MousePointer2 size={24} className="text-white fill-white drop-shadow-2xl" />
              <div className="bg-[#050505]/90 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-1.5">
                <span className="text-white text-[11px] font-bold tracking-tight">{t.mockup.setup}</span>
              </div>
            </motion.div>

            {/* Hero Banner (Natural Beauty) */}
            <div className="w-full h-40 rounded-2xl relative overflow-hidden border border-white/10 shrink-0 group bg-white/5">
              <Image 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop" 
                alt="Luxury Store Hero" 
                fill 
                priority 
                className="object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 start-5 pointer-events-none">
                <p className="text-white font-black text-xl tracking-tight mb-0.5">{t.mockup.heroTitle}</p>
                <p className="text-white/60 text-xs font-medium tracking-tight">{t.mockup.heroSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 shrink-0">
              <span className="text-white font-bold text-sm tracking-tight">{t.mockup.featured}</span>
              <span className="text-[#3B82F6] text-[10px] font-bold tracking-tight cursor-pointer hover:underline uppercase">{t.mockup.viewAll}</span>
            </div>

            {/* Product Grid (Natural Realism) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
              {products.map((item: any, idx: number) => (
                <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-2xl p-2.5 flex flex-col gap-2.5 hover:bg-white/[0.05] hover:border-white/20 transition-all cursor-pointer group">
                  
                  <div className="w-full aspect-square rounded-xl overflow-hidden relative border border-white/5 bg-white/5">
                    <Image 
                      src={PRODUCTS[idx].img} 
                      alt={item.title} 
                      fill 
                      priority 
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-0.5 px-0.5">
                    <p className="text-white/90 text-xs font-bold tracking-tight truncate">{item.title}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-white/80 text-[10px] font-black tracking-tight">{item.price}</span>
                      <div className="w-6 h-6 rounded-lg bg-[#000080] border border-white/10 shadow-[0_4px_10px_rgba(0,0,128,0.5)] flex items-center justify-center text-white text-xs font-bold group-hover:scale-110 transition-transform">+</div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
