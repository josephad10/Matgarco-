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
            <div className="w-full md:w-5/12 relative group rounded-2xl overflow-hidden border border-white/10 shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)] bg-slate-50">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 to-slate-100" />
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center border border-slate-200 cursor-pointer hover:bg-white transition-colors shadow-sm">
                <Search className="w-4 h-4 text-slate-500" />
              </div>
            </div>
            <div className="flex-1 flex flex-col relative z-10 bg-slate-50 rounded-2xl p-8 border border-white/10 shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-500 gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <span className="text-slate-500 text-xs font-medium">(128 Reviews)</span>
              </div>
              <div className="w-3/4 h-8 bg-slate-200 rounded-lg mb-4" />
              <div className="w-1/3 h-6 bg-blue-600/10 border border-blue-600/20 rounded-md mb-6 flex items-center px-3">
                <div className="w-16 h-2.5 bg-blue-600/60 rounded" />
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 border-b border-slate-200 pb-6">{showcaseData.fakeUI.fashionDesc}</p>
              <div className="mb-6">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3 block">Color</span>
                <div className="flex gap-4">
                  {['bg-slate-900', 'bg-red-900', 'bg-slate-300'].map((color, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border border-slate-200 ${color} cursor-pointer transition-transform hover:scale-110 ${i===0 ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-50 shadow-lg' : 'shadow-md'}`} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size, i) => (
                  <div key={size} className={`h-10 rounded-xl border flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${i===1 ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                    {size}
                  </div>
                ))}
              </div>
              <button className="w-full h-14 rounded-xl bg-blue-600 text-white font-bold mt-8 shadow-[0_10px_25px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition-all">Add to Bag</button>
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
            <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="w-full h-56 bg-slate-50 border border-white/10 rounded-2xl flex items-center px-12 relative overflow-hidden shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)]">
               <div className="flex-1 flex flex-col gap-4 relative z-10">
                 <div className="w-1/2 h-8 bg-slate-200 rounded-lg" />
                 <p className="text-slate-500 text-sm max-w-md leading-relaxed font-medium">{showcaseData.fakeUI.electronicsDesc}</p>
                 <div className="w-32 h-10 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center">
                    <div className="w-16 h-3 bg-slate-400 rounded" />
                 </div>
               </div>
               <div className="w-64 h-40 bg-white rounded-xl border border-slate-200 rotate-[-5deg] shadow-lg flex items-center justify-center">
                 <Monitor className="w-12 h-12 text-slate-300" />
               </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 flex-1 overflow-hidden">
              <div className="flex-[2] flex flex-col border border-white/10 rounded-2xl overflow-hidden bg-slate-50 shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)]">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-100/50"><span className="text-sm font-bold text-slate-800">Technical Specifications</span></div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {[{l:"Processor", v:"Octa-core 3.2 GHz"}, {l:"Display", v:"6.8\" OLED 120Hz"}, {l:"Battery", v:"5000mAh Fast Charge"}].map((r, i) => (
                    <div key={i} className={`flex items-center p-4 border-b border-slate-100 ${i%2===0 ? 'bg-white/50' : ''}`}>
                      <div className="w-1/3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.l}</div>
                      <div className="w-2/3 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" /><span className="text-sm text-slate-800 font-medium">{r.v}</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col bg-slate-50 border border-white/10 rounded-2xl p-5 shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Compare Similar</span>
                <div className="flex flex-col gap-4">
                  {[1,2].map(i => (
                    <div key={i} className="flex gap-4 p-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100"><Monitor className="w-5 h-5 text-slate-300" /></div>
                      <div className="flex-1 flex flex-col justify-center gap-2">
                        <div className="w-full h-2.5 bg-slate-200 rounded" />
                        <div className="w-1/2 h-2 bg-blue-600/20 rounded" />
                      </div>
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="flex gap-3 overflow-hidden">
              {["All Items", "Pizza", "Burgers", "Drinks"].map((cat, i) => (
                <div key={i} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${i===0 ? 'bg-orange-500 text-white shadow-lg' : 'bg-[#050505]/40 border border-white/10 text-white/60 hover:bg-white/5'}`}>
                  {i===0 && <Star className="w-3 h-3 fill-current" />}{cat}
                </div>
              ))}
            </div>
            <p className="text-white/60 text-sm font-medium">{showcaseData.fakeUI.foodDesc}</p>
            <div className="flex-1 grid grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pb-20 pr-2">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-slate-50 border border-white/10 rounded-2xl p-3 flex gap-4 items-center group shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)]">
                  <div className="w-20 h-20 rounded-xl bg-slate-200 flex items-center justify-center shrink-0 border border-slate-100"><Coffee className="w-6 h-6 text-slate-400" /></div>
                  <div className="flex-1">
                    <div className="w-3/4 h-3 bg-slate-300 rounded mb-2" />
                    <div className="w-1/2 h-2 bg-slate-200 rounded mb-4" />
                    <div className="flex justify-between items-center"><span className="text-slate-800 font-black text-sm">EGP 150.00</span><div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center shadow-sm"><Plus className="w-4 h-4 text-white" /></div></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-11/12 h-16 bg-slate-50 border border-white/10 rounded-2xl shadow-2xl flex items-center justify-between px-6">
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-sm">3</div><span className="text-slate-800 font-bold text-sm">View Basket</span></div>
              <span className="text-slate-800 font-black text-lg">EGP 450.00</span>
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
            <div className="w-full md:w-2/3 relative rounded-2xl overflow-hidden border border-white/10 bg-slate-50 shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50" />
              <div className="absolute top-1/3 left-1/4 group"><div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center shadow-lg animate-pulse cursor-pointer group-hover:scale-125 transition-transform"><Plus className="w-3 h-3 text-white" /></div><div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">Modern Sofa</div></div>
              <div className="absolute bottom-1/4 right-1/3 group"><div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center shadow-lg animate-pulse cursor-pointer group-hover:scale-125 transition-transform"><Plus className="w-3 h-3 text-white" /></div><div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">Arc Lamp</div></div>
              <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm"><Ruler className="w-3.5 h-3.5 text-amber-400" /><span className="text-[10px] text-white font-bold uppercase tracking-wider">350cm x 280cm</span></div>
            </div>
            <div className="flex-1 flex flex-col bg-slate-50 border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)]">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-4 block">Shop the Look</span>
              <div className="flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar mb-6">
                {[1,2,3].map(i => (
                  <div key={i} className="flex gap-4 items-center p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors group cursor-pointer shadow-sm">
                    <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 shadow-inner"><Home className="w-6 h-6 text-slate-300 group-hover:text-amber-500 transition-colors" /></div>
                    <div className="flex-1 flex flex-col gap-2"><div className="w-3/4 h-2.5 bg-slate-200 rounded" /><div className="text-[10px] text-amber-600 font-black">EGP 2,400.00</div></div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-amber-500 rounded-xl flex flex-col gap-1 shadow-lg cursor-pointer hover:bg-amber-400 transition-all hover:-translate-y-0.5 active:translate-y-0">
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
              <div className="flex items-center gap-4 mb-8 bg-slate-50 px-6 py-3 rounded-full border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-stone-400 to-stone-600 border border-white shadow-sm" />
                 <div className="flex flex-col"><span className="text-xs font-bold text-slate-800 tracking-wide">Meet the Maker</span><span className="text-[10px] text-slate-500 italic font-medium">Handcrafted with soul</span></div>
              </div>
              <div className="w-full aspect-[16/10] bg-slate-50 border border-white/10 rounded-[3rem] p-8 flex flex-col items-center justify-center gap-6 relative shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)] overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-200/30 via-transparent to-transparent opacity-50" />
                <div className="w-48 h-48 rounded-2xl bg-white border border-slate-200 rotate-3 flex items-center justify-center shadow-sm group-hover:rotate-0 transition-all duration-700"><Scissors className="w-12 h-12 text-stone-300" /></div>
                <div className="flex flex-col items-center text-center max-w-sm">
                  <div className="flex gap-2 mb-4"><span className="px-2 py-1 bg-stone-100 text-stone-600 text-[8px] font-bold uppercase tracking-widest border border-stone-200 rounded">Natural Wood</span><span className="px-2 py-1 bg-stone-100 text-stone-600 text-[8px] font-bold uppercase tracking-widest border border-stone-200 rounded">Eco Friendly</span></div>
                  <div className="w-3/4 h-6 bg-slate-200 rounded mb-4" />
                  <p className="text-slate-500 text-xs leading-relaxed italic font-medium">{showcaseData.fakeUI.handmadeDesc}</p>
                </div>
                <div className="absolute top-8 right-8 flex flex-col items-end gap-2"><div className="w-12 h-12 rounded-full border border-slate-200 flex flex-col items-center justify-center bg-white shadow-sm"><CheckCircle className="w-5 h-5 text-green-600 mb-0.5" /><span className="text-[6px] text-slate-500 font-bold uppercase">Unique</span></div></div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-8 w-full max-w-lg">
                {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-square bg-slate-50 border border-white/10 rounded-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] hover:bg-white transition-colors" />
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
                 <div className="absolute inset-0 bg-slate-50 rounded-full border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]" />
                 <div className="w-48 h-48 bg-white rounded-2xl border border-slate-200 flex items-center justify-center rotate-45 shadow-xl relative group overflow-hidden"><Gem className="w-16 h-16 text-slate-200 -rotate-45" /><div className="absolute inset-0 bg-gradient-to-t from-slate-200/40 to-transparent" /><div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md p-2 rounded-full border border-slate-200 shadow-sm"><Maximize className="w-4 h-4 text-slate-600" /></div></div>
                 <div className="absolute -top-4 -right-4 bg-white backdrop-blur-xl px-4 py-2 rounded-2xl border border-slate-200 shadow-xl"><div className="flex flex-col"><span className="text-[8px] text-slate-400 font-bold uppercase mb-1">Price</span><span className="text-sm font-black text-slate-800 tracking-tight">EGP 1,850.00</span></div></div>
              </div>
              <div className="flex flex-col items-center gap-8 w-full max-w-md">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent" />
                <div className="flex flex-col items-center gap-4">
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select Material</span>
                   <div className="flex gap-6">
                      {['from-amber-400 to-amber-600', 'from-slate-200 to-slate-400', 'from-rose-300 to-rose-500'].map((grad, i) => (
                        <div key={i} className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad} border border-slate-200 cursor-pointer transition-transform hover:scale-125 shadow-lg ${i===1 ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-[#050505]' : ''}`} />
                      ))}
                   </div>
                </div>
                <div className="w-full p-6 bg-slate-50 border border-white/10 rounded-3xl shadow-[inset_0_2px_15px_rgba(0,0,0,0.05)] flex flex-col gap-4">
                   <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Styling Recommendation</span>
                   <div className="flex gap-4">
                      {[1,2,3].map(i => <div key={i} className="flex-1 aspect-square bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shadow-sm" />)}
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
                 <div className="flex flex-col"><div className="w-32 h-6 bg-slate-200 rounded mb-1" /><div className="w-20 h-3 bg-slate-100 rounded" /></div>
                 <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm"><span className="text-[10px] text-pink-600 font-bold uppercase">Try-On</span><div className="w-10 h-5 bg-pink-500 rounded-full relative shadow-sm"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md" /></div></div>
              </div>
              <div className="w-full max-w-xs aspect-[3/4] bg-slate-50 border border-white/10 rounded-[4rem] relative overflow-hidden shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)] group">
                 <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 via-transparent to-transparent opacity-50" />
                 <div className="absolute inset-0 border-[12px] border-white/5 rounded-[4rem] m-2 pointer-events-none shadow-inner" />
                 <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center"><Camera className="w-16 h-16 text-slate-200 group-hover:text-pink-500/10 transition-colors duration-500" /></div>
                 <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-1.5 bg-slate-200 rounded-full overflow-hidden shadow-inner"><motion.div animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }} className="w-1/2 h-full bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)]" /></div>
                 <div className="absolute top-8 left-8 flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Scanning...</span></div>
              </div>
              <div className="w-full max-w-xl bg-slate-50 border border-white/10 rounded-3xl p-6 shadow-[inset_0_2px_15px_rgba(0,0,0,0.05)] flex flex-col gap-6">
                 <div className="flex justify-between items-center"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select Shade</span><div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"><span className="text-[10px] text-slate-600 font-medium">Matte Finish</span><ChevronRight className="w-3 h-3 text-slate-400 rotate-90" /></div></div>
                 <div className="grid grid-cols-6 gap-4">
                    {['bg-red-700', 'bg-pink-400', 'bg-orange-300', 'bg-rose-500', 'bg-red-900', 'bg-neutral-200'].map((shade, i) => (
                      <div key={i} className={`aspect-square rounded-full shadow-md cursor-pointer transition-transform hover:scale-125 border border-slate-100 ${shade} ${i===1 ? 'ring-2 ring-pink-500 ring-offset-4 ring-offset-white' : ''}`} />
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

      <div className="w-full aspect-auto md:aspect-video min-h-[600px] max-h-[850px] bg-[#050505] border border-white/10 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,128,0.15)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05),transparent_50%)] pointer-events-none z-0" />
        <AnimatePresence mode="wait">
          {renderFakeUI()}
        </AnimatePresence>
      </div>
    </section>
  );
}
