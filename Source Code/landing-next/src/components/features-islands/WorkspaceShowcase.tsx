"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ar } from "@/i18n/ar";
import { en } from "@/i18n/en";

interface WorkspaceShowcaseProps {
  lang: string;
}

type ItemType = "dashboard" | "orders" | "customization";

export function WorkspaceShowcase({ lang }: WorkspaceShowcaseProps) {
  const t = lang === "ar" ? ar : en;
  const isRtl = lang === "ar";
  const [activeItem, setActiveItem] = useState<ItemType>("dashboard");

  const showcaseData = t.workspaceShowcase;

  const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  };

  const renderMockupContent = () => {
    switch (activeItem) {
      case "dashboard":
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springTransition}
            className="flex flex-col gap-6 p-6 h-full overflow-y-auto custom-scrollbar"
          >
            {/* Metric Cards */}
            <div className="grid grid-cols-3 gap-4 shrink-0">
              {[
                { label: t.workspace.totalRevenue, val: t.workspace.revenueValue, trend: "+14.5%", color: "text-green-400", bg: "bg-green-400/10" },
                { label: t.workspace.activeOrders, val: "1,284", trend: "+5.2%", color: "text-green-400", bg: "bg-green-400/10" },
                { label: t.workspace.conversionRate, val: "3.84%", trend: "-1.2%", color: "text-red-400", bg: "bg-red-400/10" },
              ].map((m, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:bg-white/[0.04] transition-colors">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-xl rounded-full -mr-8 -mt-8 group-hover:bg-blue-500/20 transition-colors" />
                  <span className="text-[10px] text-white/40 font-bold tracking-wider uppercase">{m.label}</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl lg:text-2xl font-black text-white">{m.val}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${m.bg} ${m.color} font-bold`}>{m.trend}</span>
                    <span className="text-[10px] text-white/30 font-medium">{t.workspace.vsLastMonth}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart Area */}
            <div className="flex-1 min-h-[200px] bg-white/[0.02] border border-white/5 rounded-xl p-5 flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 z-10">
                <span className="text-xs font-bold text-white/70">{t.workspace.revenueOverview}</span>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-white/10 rounded-md text-[10px] font-bold text-white cursor-pointer shadow-sm">{isRtl ? "أسبوعي" : "Weekly"}</div>
                  <div className="px-3 py-1.5 rounded-md text-[10px] font-medium text-white/40 hover:text-white/70 cursor-pointer">{isRtl ? "شهري" : "Monthly"}</div>
                </div>
              </div>
              
              {/* Grid Lines */}
              <div className="absolute inset-0 pt-16 pb-8 px-5 flex flex-col justify-between pointer-events-none">
                {[1,2,3,4].map(i => <div key={i} className="w-full h-[1px] bg-white/5" />)}
              </div>

              <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 z-10 pt-4">
                {[30, 45, 25, 60, 75, 50, 85, 40, 95, 65, 55, 80, 45, 70, 88].map((h, idx) => (
                  <div key={idx} className="w-full flex flex-col items-center gap-2 group cursor-pointer h-full">
                    <div className="w-full max-w-[24px] bg-white/[0.03] rounded-t-sm relative flex items-end justify-center h-full group-hover:bg-white/10 transition-colors">
                      <div
                        className="w-full bg-gradient-to-t from-[#000080] to-[#3B82F6] rounded-t-sm group-hover:to-blue-300 transition-colors shadow-[0_0_10px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "orders":
        return (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springTransition}
            className="flex flex-col p-6 h-full"
          >
            <div className="flex justify-between items-center mb-6 shrink-0">
              <span className="text-sm font-bold text-white">{t.workspace.recentOrders}</span>
              <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg text-xs font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                {t.workspace.exportCsv}
              </button>
            </div>
            
            <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-white/10 bg-white/[0.02] text-[10px] font-bold text-white/40 uppercase tracking-wider shrink-0">
                <div>{t.workspace.orderId}</div>
                <div>{t.workspace.customer}</div>
                <div>{t.workspace.date}</div>
                <div>{t.workspace.status}</div>
                <div className="text-right">{t.workspace.amount}</div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col divide-y divide-white/5 overflow-y-auto custom-scrollbar flex-1">
                {[
                  { id: "#ORD-001", customer: "Ahmed Hassan", date: `${t.workspace.today}, 10:42 AM`, status: t.workspace.completed, amount: isRtl ? "1,250 ج.م" : "$45.00" },
                  { id: "#ORD-002", customer: "Sarah Magdy", date: `${t.workspace.today}, 09:15 AM`, status: t.workspace.pending, amount: isRtl ? "450 ج.م" : "$15.00" },
                  { id: "#ORD-003", customer: "Omar Radwan", date: t.workspace.yesterday, status: t.workspace.shipped, amount: isRtl ? "3,400 ج.م" : "$110.00" },
                  { id: "#ORD-004", customer: "Laila Tarek", date: t.workspace.yesterday, status: t.workspace.completed, amount: isRtl ? "850 ج.م" : "$28.00" },
                  { id: "#ORD-005", customer: "Kareem Ali", date: "Oct 12, 2026", status: t.workspace.cancelled, amount: isRtl ? "120 ج.م" : "$4.00" },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-5 gap-4 px-4 py-3.5 items-center hover:bg-white/[0.04] transition-colors text-xs text-white/80 cursor-pointer group">
                    <div className="font-mono text-blue-400 font-medium group-hover:text-blue-300 transition-colors">{row.id}</div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-[9px] font-bold shadow-inner">
                        {row.customer.charAt(0)}
                      </div>
                      <span className="truncate font-medium">{row.customer}</span>
                    </div>
                    <div className="text-white/40 text-[10px] font-medium">{row.date}</div>
                    <div>
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        row.status === t.workspace.completed ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]' :
                        row.status === t.workspace.pending ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]' :
                        row.status === t.workspace.shipped ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_100px_rgba(59,130,246,0.2)]' :
                        'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                      }`}>
                        {row.status}
                      </span>
                    </div>
                    <div className="text-right font-bold tracking-tight">{row.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "customization":
        return (
          <motion.div
            key="customization"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springTransition}
            className="flex h-full"
          >
            {/* Left: Tools Panel */}
            <div className="w-2/5 border-r border-white/5 p-6 flex flex-col gap-8 bg-white/[0.01] overflow-y-auto custom-scrollbar relative z-10 backdrop-blur-sm">
              <div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 block">Theme Colors</span>
                <div className="flex gap-3">
                  {['bg-[#050505]', 'bg-[#3B82F6]', 'bg-[#10B981]', 'bg-[#F59E0B]', 'bg-[#EC4899]'].map((color, i) => (
                    <div key={i} className={`w-7 h-7 rounded-full ${color} cursor-pointer shadow-lg transition-transform ${i===1 ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a]' : 'border border-white/20 hover:scale-110'}`} />
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 block">Typography</span>
                <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-center justify-between text-xs text-white/80 cursor-pointer hover:bg-white/10 transition-colors shadow-inner">
                  <span className="font-medium">Inter (Sans-Serif)</span>
                  <div className="w-2.5 h-2.5 border-b-2 border-r-2 border-white/40 rotate-45 mr-1" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 block">Component Settings</span>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Sticky Header", active: true },
                    { label: "Show Announcement Bar", active: false },
                    { label: "Enable Quick View", active: true },
                    { label: "Dark Mode Default", active: true },
                  ].map((toggle, i) => (
                    <div key={i} className="flex justify-between items-center group cursor-pointer">
                      <span className="text-xs text-white/60 font-medium group-hover:text-white/90 transition-colors">{toggle.label}</span>
                      <div className={`w-8 h-4.5 rounded-full ${toggle.active ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-white/10 border border-white/10'} relative transition-colors`}>
                        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[2px] transition-all duration-300 shadow-sm ${toggle.active ? 'right-[2px]' : 'left-[2px] opacity-70'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Storefront Wireframe */}
            <div className="w-3/5 p-6 flex flex-col items-center justify-center bg-black/60 relative overflow-hidden">
              {/* Grid Background pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="w-full max-w-[240px] aspect-[9/18] bg-[#050505] border border-white/20 rounded-[2.5rem] p-3 flex flex-col gap-3 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative z-10 ring-4 ring-white/5 overflow-y-hidden">
                {/* Mobile Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-20 flex justify-center items-center">
                   <div className="w-8 h-1 rounded-full bg-white/10" />
                </div>
                
                {/* Mobile Header */}
                <div className="flex justify-between items-center px-2 pt-5">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex flex-col items-center justify-center gap-0.5">
                     <div className="w-2.5 h-[1px] bg-white/60" />
                     <div className="w-2.5 h-[1px] bg-white/60" />
                  </div>
                  <div className="w-20 h-3.5 bg-white/80 rounded" />
                  <div className="flex gap-1.5">
                    <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
                       <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    </div>
                  </div>
                </div>
                
                {/* Hero Banner */}
                <div className="w-full h-28 bg-gradient-to-br from-[#000080] to-[#3B82F6] rounded-xl flex items-center justify-center shadow-inner mt-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
                  <div className="w-20 h-5 bg-white/30 rounded-full backdrop-blur-md" />
                </div>

                <div className="flex gap-2 overflow-hidden px-1 mt-1">
                   {[1,2,3].map(i => <div key={i} className={`h-6 rounded-full px-3 flex items-center shrink-0 text-[8px] font-bold ${i===1 ? 'bg-white text-black' : 'bg-white/10 text-white/60'}`}>Category {i}</div>)}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-2 flex flex-col gap-1.5 shadow-sm">
                      <div className="w-full aspect-square bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center">
                         <div className="w-6 h-6 rounded bg-white/10" />
                      </div>
                      <div className="w-16 h-2 bg-white/40 rounded mt-1" />
                      <div className="flex justify-between items-center mt-1">
                         <div className="w-10 h-2 bg-blue-400 rounded" />
                         <div className="w-3 h-3 rounded-full bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 relative z-10" dir={isRtl ? "rtl" : "ltr"}>
      <div className="mb-16 text-center lg:text-start lg:w-1/2">
        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-blue-400 mb-6 shadow-inner">
          {showcaseData.badge}
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
          {showcaseData.heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Menu Items */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-3">
          {showcaseData.items.map((item: any) => {
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id as ItemType)}
                className={`text-start p-6 rounded-2xl transition-all duration-300 outline-none
                  ${isActive 
                    ? "bg-white/[0.05] border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                    : "border border-transparent hover:bg-white/[0.02] text-slate-400"
                  }
                `}
              >
                <h3 className={`text-xl font-bold mb-3 ${isActive ? "text-white" : "text-white/70"}`}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed opacity-80">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Column: High-Fidelity Mockup */}
        <div className="col-span-1 lg:col-span-8 relative">
          <div className="w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[16/10] rounded-2xl border border-white/10 bg-[#050505]/90 backdrop-blur-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,128,0.3)] flex flex-col">
            
            {/* Mac-style Top Bar */}
            <div className="h-12 bg-white/[0.02] border-b border-white/5 flex items-center px-4 shrink-0">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-500/50" />
              </div>
              <div className="mx-auto flex items-center gap-2 text-white/30 text-[10px] font-medium tracking-wider">
                <div className="w-4 h-4 rounded bg-white/5 flex items-center justify-center border border-white/10">
                  <svg className="w-2 h-2 text-white/40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
                </div>
                matgarco.app/admin
              </div>
            </div>

            {/* Dashboard Inner Layout */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Mini-Sidebar */}
              <div className="w-16 bg-black/40 border-r border-white/5 flex flex-col items-center py-6 gap-5 shrink-0 z-20">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] mb-2 cursor-pointer">
                   <div className="w-4 h-4 bg-white rounded-sm" />
                </div>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-lg ${i === 1 ? 'bg-white/10 border border-white/10' : 'bg-transparent'} flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer`}>
                    <div className={`w-4 h-4 rounded-sm ${i === 1 ? 'bg-blue-400' : 'bg-white/20'}`} />
                  </div>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#050505]">
                
                {/* Simulated Top Nav */}
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-white/[0.01] z-20">
                  <div className="flex items-center gap-3 w-1/2">
                    <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer">
                      <div className="w-3 h-[1px] bg-white/40" />
                    </div>
                    <div className="h-8 w-full max-w-[220px] bg-black/50 rounded-lg border border-white/10 flex items-center px-3 shadow-inner">
                       <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                       <div className="w-16 h-1.5 bg-white/10 rounded ms-2" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative cursor-pointer hover:bg-white/10 transition-colors">
                       <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                       <div className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0a]" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border border-white/20 cursor-pointer shadow-sm" />
                  </div>
                </div>

                {/* Dynamic Content Area */}
                <div className="flex-1 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {renderMockupContent()}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
