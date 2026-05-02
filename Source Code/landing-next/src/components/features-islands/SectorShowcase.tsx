"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ar } from "@/i18n/ar";
import { en } from "@/i18n/en";
import { 
  Shirt, Monitor, Sparkles, Coffee, Home, Palette, Gem, 
  Search, Heart, MessageCircle, Star, Plus, Maximize, 
  Scissors, Box, Camera, CheckCircle, ChevronRight, Ruler
} from "lucide-react";

interface SectorShowcaseProps {
  lang: string;
}

export function SectorShowcase({ lang }: SectorShowcaseProps) {
  const t = lang === "ar" ? ar : en;
  const isRtl = lang === "ar";
  const [activeSector, setActiveSector] = useState("fashion");

  const showcaseData = t.sectorShowcase;
  const sectorsKeys = Object.keys(showcaseData.sectors) as Array<keyof typeof showcaseData.sectors>;

  const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  };

  const iconMap: Record<string, JSX.Element> = {
    fashion: <Shirt className="w-4 h-4" />,
    electronics: <Monitor className="w-4 h-4" />,
    cosmetics: <Sparkles className="w-4 h-4" />,
    food: <Coffee className="w-4 h-4" />,
    home: <Home className="w-4 h-4" />,
    handmade: <Palette className="w-4 h-4" />,
    accessories: <Gem className="w-4 h-4" />,
  };

  const renderFakeUI = () => {
    switch (activeSector) {
      case "fashion":
        return (
          <motion.div
            key="fashion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={springTransition}
            className="flex flex-col md:flex-row h-full p-8 gap-10 items-stretch relative z-10"
          >
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="w-full md:w-5/12 relative group rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/10" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CgkJPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPgoJPC9zdmc+')] opacity-50 mix-blend-overlay" />
              <div className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <Search className="w-4 h-4 text-white/70" />
              </div>
            </div>
            <div className="flex-1 flex flex-col relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400 gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <span className="text-white/40 text-xs font-medium">(128 Reviews)</span>
              </div>
              <div className="w-3/4 h-8 bg-white/80 rounded-lg mb-4" />
              <div className="w-1/3 h-6 bg-blue-400 rounded-md mb-6" />
              <p className="text-white/60 text-sm leading-relaxed mb-8 border-b border-white/10 pb-6">{showcaseData.fakeUI.fashionDesc}</p>
              <div className="mb-6">
                <span className="text-xs font-bold text-white/70 uppercase tracking-widest mb-3 block">Color</span>
                <div className="flex gap-4">
                  {['bg-[#050505]', 'bg-red-900', 'bg-[#D1D5DB]'].map((color, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border border-white/20 ${color} ${i===0 ? 'ring-2 ring-white ring-offset-4 ring-offset-[#050505]' : ''}`} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size, i) => (
                  <div key={size} className={`h-12 rounded-xl border flex items-center justify-center text-sm font-bold cursor-pointer transition-all ${i===1 ? 'border-white bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]' : 'border-white/10 text-white/40 hover:bg-white/[0.03]'}`}>
                    {size}
                  </div>
                ))}
              </div>
              <button className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold mt-8 shadow-[0_0_30px_rgba(59,130,246,0.5)]">Add to Bag</button>
            </div>
          </motion.div>
        );

      case "electronics":
        return (
          <motion.div
            key="electronics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={springTransition}
            className="flex flex-col h-full p-8 gap-8 relative z-10"
          >
            <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="w-full h-56 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-transparent border border-white/10 rounded-2xl flex items-center px-12 relative overflow-hidden">
               <div className="flex-1 flex flex-col gap-4 relative z-10">
                 <div className="w-1/2 h-8 bg-white/80 rounded-lg" />
                 <p className="text-white/60 text-sm max-w-md leading-relaxed">{showcaseData.fakeUI.electronicsDesc}</p>
                 <div className="w-32 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                    <div className="w-16 h-3 bg-white/80 rounded" />
                 </div>
               </div>
               <div className="w-64 h-40 bg-white/5 rounded-xl border border-white/10 rotate-[-5deg] backdrop-blur-xl" />
            </div>
            <div className="flex flex-col md:flex-row gap-8 flex-1 overflow-hidden">
              <div className="flex-[2] flex flex-col border border-white/10 rounded-2xl overflow-hidden bg-black/40">
                <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02]"><span className="text-sm font-bold text-white">Technical Specifications</span></div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {[{l:"Processor", v:"Octa-core 3.2 GHz"}, {l:"Display", v:"6.8\" OLED 120Hz"}, {l:"Battery", v:"5000mAh Fast Charge"}].map((r, i) => (
                    <div key={i} className={`flex items-center p-4 border-b border-white/5 ${i%2===0 ? 'bg-white/[0.03]' : ''}`}>
                      <div className="w-1/3 text-xs font-bold text-white/50 uppercase">{r.l}</div>
                      <div className="w-2/3 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /><span className="text-sm text-white/90">{r.v}</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-xl">
                <span className="text-xs font-bold text-white/50 uppercase mb-4 block">Compare Similar</span>
                <div className="flex flex-col gap-4">
                  {[1,2].map(i => (
                    <div key={i} className="flex gap-4 p-3 rounded-xl border border-white/5 bg-black/40">
                      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center"><Monitor className="w-5 h-5 text-white/20" /></div>
                      <div className="flex-1"><div className="w-full h-2 bg-white/60 rounded mb-2" /><div className="w-1/2 h-2 bg-blue-400 rounded" /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "food":
        return (
          <motion.div
            key="food"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={springTransition}
            className="flex flex-col h-full p-8 gap-6 relative z-10"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="flex gap-3 overflow-hidden">
              {["All Items", "Pizza", "Burgers", "Drinks"].map((cat, i) => (
                <div key={i} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold ${i===0 ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-black/60 border border-white/10 text-white/60'}`}>
                  {i===0 && <Star className="w-3 h-3" />}{cat}
                </div>
              ))}
            </div>
            <p className="text-white/60 text-sm font-medium">{showcaseData.fakeUI.foodDesc}</p>
            <div className="flex-1 grid grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pb-20 pr-2">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-black/40 border border-white/10 rounded-2xl p-3 flex gap-4 items-center group">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center shrink-0"><Coffee className="w-6 h-6 text-white/20" /></div>
                  <div className="flex-1">
                    <div className="w-3/4 h-3 bg-white/90 rounded mb-2" />
                    <div className="w-1/2 h-2 bg-white/40 rounded mb-4" />
                    <div className="flex justify-between items-center"><span className="text-white font-black text-sm">EGP 150.00</span><div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center"><Plus className="w-4 h-4 text-white" /></div></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-11/12 h-16 bg-blue-600 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.6)] flex items-center justify-between px-6">
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-white text-blue-600 font-black flex items-center justify-center text-sm">3</div><span className="text-white font-bold text-sm">View Basket</span></div>
              <span className="text-white font-black text-lg">EGP 450.00</span>
            </div>
          </motion.div>
        );

      case "home":
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={springTransition}
            className="flex flex-col md:flex-row h-full p-8 gap-8 items-stretch relative z-10"
          >
            <div className="absolute inset-0 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="w-full md:w-2/3 relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-50" />
              <div className="absolute top-1/3 left-1/4 group"><div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse cursor-pointer group-hover:scale-125 transition-transform"><Plus className="w-3 h-3 text-amber-600" /></div><div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Modern Sofa</div></div>
              <div className="absolute bottom-1/4 right-1/3 group"><div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse cursor-pointer group-hover:scale-125 transition-transform"><Plus className="w-3 h-3 text-amber-600" /></div><div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Arc Lamp</div></div>
              <div className="absolute top-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2"><Ruler className="w-3.5 h-3.5 text-amber-400" /><span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">350cm x 280cm</span></div>
            </div>
            <div className="flex-1 flex flex-col bg-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4 block">Shop the Look</span>
              <div className="flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar mb-6">
                {[1,2,3].map(i => (
                  <div key={i} className="flex gap-4 items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                    <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10"><Home className="w-6 h-6 text-white/20 group-hover:text-amber-400 transition-colors" /></div>
                    <div className="flex-1"><div className="w-3/4 h-2 bg-white/60 rounded mb-2" /><div className="text-[10px] text-amber-400 font-bold">EGP 2,400.00</div></div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-amber-500 rounded-xl flex flex-col gap-1 shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer hover:bg-amber-400 transition-colors">
                <span className="text-[10px] text-black font-bold uppercase opacity-60">Bundle Total</span>
                <div className="flex justify-between items-center"><span className="text-black font-black text-lg">EGP 7,200.00</span><ChevronRight className="w-5 h-5 text-black" /></div>
              </div>
            </div>
          </motion.div>
        );

      case "handmade":
        return (
          <motion.div
            key="handmade"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={springTransition}
            className="flex flex-col h-full p-10 relative z-10"
          >
            <div className="absolute inset-0 bg-stone-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="max-w-2xl mx-auto w-full flex flex-col items-center">
              <div className="flex items-center gap-4 mb-8 bg-white/5 px-6 py-3 rounded-full border border-white/10 shadow-xl">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-stone-400 to-stone-600 border border-white/20" />
                 <div className="flex flex-col"><span className="text-xs font-bold text-white tracking-wide">Meet the Maker</span><span className="text-[10px] text-stone-400 italic">Handcrafted with soul</span></div>
              </div>
              <div className="w-full aspect-[16/10] bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 flex flex-col items-center justify-center gap-6 relative shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-500/10 via-transparent to-transparent opacity-50" />
                <div className="w-48 h-48 rounded-2xl bg-white/5 border border-white/10 rotate-3 flex items-center justify-center shadow-inner group-hover:rotate-0 transition-transform duration-700"><Scissors className="w-12 h-12 text-stone-600" /></div>
                <div className="flex flex-col items-center text-center max-w-sm">
                  <div className="flex gap-2 mb-4"><span className="px-2 py-1 bg-stone-500/20 text-stone-400 text-[8px] font-bold uppercase tracking-widest border border-stone-500/30 rounded">Natural Wood</span><span className="px-2 py-1 bg-stone-500/20 text-stone-400 text-[8px] font-bold uppercase tracking-widest border border-stone-500/30 rounded">Eco Friendly</span></div>
                  <div className="w-3/4 h-6 bg-white/80 rounded mb-4" />
                  <p className="text-stone-400 text-xs leading-relaxed italic">{showcaseData.fakeUI.handmadeDesc}</p>
                </div>
                <div className="absolute top-8 right-8 flex flex-col items-end gap-2"><div className="w-12 h-12 rounded-full border border-stone-500/20 flex flex-col items-center justify-center"><CheckCircle className="w-5 h-5 text-stone-500 mb-0.5" /><span className="text-[6px] text-stone-500 font-bold">100% Unique</span></div></div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-8 w-full max-w-lg">
                {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-square bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors shadow-lg" />
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "accessories":
        return (
          <motion.div
            key="accessories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={springTransition}
            className="flex flex-col items-center h-full p-8 relative z-10"
          >
            <div className="absolute inset-0 bg-slate-400/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center gap-12">
              <div className="relative w-72 h-72 rounded-full flex items-center justify-center">
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-full border border-white/5 shadow-inner" />
                 <div className="w-48 h-48 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center rotate-45 shadow-2xl relative group overflow-hidden"><Gem className="w-16 h-16 text-slate-200 opacity-20 -rotate-45" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20"><Maximize className="w-4 h-4 text-white" /></div></div>
                 <div className="absolute -top-4 -right-4 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-2xl"><div className="flex flex-col"><span className="text-[8px] text-white/40 font-bold uppercase mb-1">Price</span><span className="text-sm font-black text-white tracking-tight">EGP 1,850.00</span></div></div>
              </div>
              <div className="flex flex-col items-center gap-8 w-full max-w-md">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="flex flex-col items-center gap-4">
                   <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Select Material</span>
                   <div className="flex gap-6">
                      {['from-amber-400 to-amber-600', 'from-slate-200 to-slate-400', 'from-rose-300 to-rose-500'].map((grad, i) => (
                        <div key={i} className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad} border border-white/20 cursor-pointer transition-transform hover:scale-125 shadow-xl ${i===1 ? 'ring-2 ring-white ring-offset-4 ring-offset-[#050505]' : ''}`} />
                      ))}
                   </div>
                </div>
                <div className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-md flex flex-col gap-4 shadow-2xl">
                   <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Styling Recommendation</span>
                   <div className="flex gap-4">
                      {[1,2,3].map(i => <div key={i} className="flex-1 aspect-square bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors shadow-inner" />)}
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "cosmetics":
        return (
          <motion.div
            key="cosmetics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={springTransition}
            className="flex flex-col h-full p-8 gap-8 relative z-10"
          >
            <div className="absolute inset-0 bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="w-full flex-1 flex flex-col items-center justify-center gap-10">
              <div className="flex justify-between items-center w-full max-w-md px-4">
                 <div className="flex flex-col"><div className="w-32 h-6 bg-white/80 rounded mb-1" /><div className="w-20 h-3 bg-white/30 rounded" /></div>
                 <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-lg"><span className="text-[10px] text-pink-400 font-bold uppercase">Try-On</span><div className="w-10 h-5 bg-pink-500 rounded-full relative shadow-[0_0_15px_rgba(236,72,153,0.4)]"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md" /></div></div>
              </div>
              <div className="w-full max-w-xs aspect-[3/4] bg-white/[0.02] border border-white/10 rounded-[4rem] relative overflow-hidden shadow-2xl group">
                 <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 via-transparent to-transparent opacity-50" />
                 <div className="absolute inset-0 border-[12px] border-white/5 rounded-[4rem] m-2 pointer-events-none shadow-inner" />
                 <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center"><Camera className="w-16 h-16 text-white/5 group-hover:text-pink-500/20 transition-colors duration-500" /></div>
                 <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-1.5 bg-white/20 rounded-full overflow-hidden shadow-inner"><motion.div animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }} className="w-1/2 h-full bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.8)]" /></div>
                 <div className="absolute top-8 left-8 flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-[8px] text-white/60 font-bold uppercase">Scanning...</span></div>
              </div>
              <div className="w-full max-w-xl bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-2xl flex flex-col gap-6">
                 <div className="flex justify-between items-center"><span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Select Shade</span><div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"><span className="text-[10px] text-white/60 font-medium">Matte Finish</span><ChevronRight className="w-3 h-3 text-white/40 rotate-90" /></div></div>
                 <div className="grid grid-cols-6 gap-4">
                    {['bg-red-700', 'bg-pink-400', 'bg-orange-300', 'bg-rose-500', 'bg-red-900', 'bg-neutral-200'].map((shade, i) => (
                      <div key={i} className={`aspect-square rounded-full shadow-lg cursor-pointer transition-transform hover:scale-125 border border-white/10 ${shade} ${i===1 ? 'ring-2 ring-pink-500 ring-offset-4 ring-offset-[#050505]' : ''}`} />
                    ))}
                 </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 relative z-10" dir={isRtl ? "rtl" : "ltr"}>
      <div className="mb-12 text-center lg:w-2/3 mx-auto">
        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-blue-400 mb-6 shadow-inner">
          {showcaseData.badge}
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
          {showcaseData.titleStart}
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#82A8FF] to-[#3B82F6] drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
            {showcaseData.titleBrand}
          </span>
          {showcaseData.titleEnd}
        </h2>
        <p className="text-lg text-white/60 leading-relaxed max-w-3xl mx-auto font-medium">
          {showcaseData.subtitle}
        </p>
      </div>

      <div className="relative max-w-full overflow-x-auto hide-scrollbar mb-12 py-2">
        <div className="flex items-center justify-center min-w-max gap-2 px-6 py-2 mx-auto w-max bg-white/[0.02] border border-white/5 rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] backdrop-blur-sm">
          {sectorsKeys.map((key) => {
            const isActive = activeSector === key;
            return (
              <button
                key={key}
                onClick={() => setActiveSector(key)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 outline-none flex items-center gap-2
                  ${isActive ? "text-black" : "text-slate-400 hover:text-white"}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSectorIndicator"
                    className="absolute inset-0 bg-white rounded-full shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                    transition={springTransition}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {iconMap[key]}
                  {showcaseData.sectors[key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full aspect-auto md:aspect-video min-h-[600px] max-h-[850px] bg-[#050505]/80 border border-white/10 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,128,0.3)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05),transparent_50%)] pointer-events-none z-0" />
        <AnimatePresence mode="wait">
          {renderFakeUI()}
        </AnimatePresence>
      </div>
    </section>
  );
}
