"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { GlobalFooter } from "@/components/sections/GlobalFooter";

const THEMES = [
  {
    id: "vanguard",
    name: "Vanguard Street",
    category: "Clothing & Streetwear",
    price: "Included in Pro Tier",
    images: [
      "/themes/vanguard/1.png", // Main Cover
      "/themes/vanguard/2.png",
      "/themes/vanguard/3.png",
      "/themes/vanguard/4.png",
    ],
    overview:
      "Designed to handle large product catalogs with high performance, focusing on speed and a beautiful interface.",
    features: [
      {
        title: "Catalog Intelligence",
        desc: "Inventory-scale filtering and discovery.",
      },
      {
        title: "Express Checkout",
        desc: "Egypt-Native logic for maximum ROAS.",
      },
      { title: "100% White-Label", desc: "Complete brand supremacy." },
      {
        title: "Navy Pulse Accents",
        desc: "Creates urgency and urban authority.",
      },
    ],
  },
];

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState<any>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedTheme) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedTheme]);

  return (
    <div className="min-h-screen bg-white text-[#050505]">
      <Navbar />

      <main className="pt-36 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto text-center">
        {/* Shopify-Tier Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#050505] tracking-tight">
            Choose the right theme for your business
          </h1>
          <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto font-medium">
            Look for a design with the features you need most, then customize
            from there
          </p>
        </div>

        {/* The 3-Column Features Grid */}
        <div className="bg-slate-50 rounded-3xl p-8 md:p-12 mt-12 mb-16 text-left max-w-5xl mx-auto border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold mb-8 text-center text-[#050505]">
            What every theme gets you
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                <strong className="text-[#050505]">Built for commerce</strong> —
                fast, reliable, and with the world's best-converting checkout
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                <strong className="text-[#050505]">All the essentials</strong> —
                product recommendations, reviews, discounts, and much more
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                <strong className="text-[#050505]">Developer support</strong> —
                get help when you need it, including free updates
              </p>
            </div>
          </div>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
          {THEMES.map((theme) => (
            <div
              key={theme.id}
              className="group cursor-pointer flex flex-col gap-4"
              onClick={() => setSelectedTheme(theme)}
            >
              <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 aspect-[4/5]">
                <Image
                  src={theme.images[0]}
                  alt={theme.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Sleek Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <div className="px-6 py-3 bg-white text-[#050505] font-bold rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2">
                    View theme
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="px-2">
                <h3 className="text-xl font-bold text-[#050505] tracking-tight">
                  {theme.name}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm font-medium text-slate-500">
                    {theme.category}
                  </p>
                  <p className="text-sm font-bold text-[#050505]">
                    {theme.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <GlobalFooter />

      {/* THE SHOPIFY-TIER DETAIL MODAL (Light Theme) */}
      <AnimatePresence>
        {selectedTheme && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 lg:p-12">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
              onClick={() => setSelectedTheme(null)}
            />

            {/* Modal Masterpiece Container - Light Theme */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[1400px] h-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Floating Close Button */}
              <button
                onClick={() => setSelectedTheme(null)}
                className="absolute top-6 right-6 z-50 w-12 h-12 bg-white hover:bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-[#050505] shadow-sm transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left Column (Image Gallery) */}
              <div className="w-full md:w-[65%] h-full overflow-y-auto p-6 md:p-12 hide-scrollbar bg-slate-50 border-r border-slate-200">
                <div className="flex flex-col gap-12 max-w-4xl mx-auto">
                  {selectedTheme.images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative w-full rounded-[2rem] border border-slate-200 overflow-hidden bg-white shadow-md"
                    >
                      <Image
                        src={img}
                        alt={`${selectedTheme.name} - Showcase ${idx + 1}`}
                        width={800}
                        height={1200}
                        className="w-full h-auto object-cover"
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column (Sticky Details) */}
              <div className="w-full md:w-[35%] h-full sticky top-0 p-8 md:p-10 bg-white flex flex-col overflow-y-auto hide-scrollbar text-left">
                <div className="flex-1 mt-4">
                  <div className="mb-10">
                    <h2 className="text-4xl md:text-5xl font-black text-[#050505] tracking-tight mb-2">
                      {selectedTheme.name}
                    </h2>
                    <p className="text-slate-500 font-medium mb-6">
                      by Matgarco
                    </p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm font-bold text-[#050505]">
                      {selectedTheme.price}
                    </div>
                  </div>

                  <p className="text-slate-600 text-[1.05rem] leading-relaxed mb-10">
                    {selectedTheme.overview}
                  </p>

                  <div className="space-y-6 mb-12">
                    <h4 className="text-sm font-bold text-[#050505] uppercase tracking-wider border-b border-slate-200 pb-4">
                      Theme Features
                    </h4>
                    <div className="flex flex-col gap-6 pt-2">
                      {selectedTheme.features.map(
                        (feature: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-4">
                            <div className="mt-1 shrink-0">
                              <CheckCircle2 className="w-5 h-5 text-[#000080]" />
                            </div>
                            <div>
                              <h5 className="text-[#050505] font-bold text-[15px] mb-1">
                                {feature.title}
                              </h5>
                              <p className="text-slate-600 text-sm leading-relaxed">
                                {feature.desc}
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Sticky Action Buttons at bottom of sidebar */}
                <div className="flex flex-col gap-4 mt-auto pt-8 border-t border-slate-200 bg-white">
                  <button className="w-full py-4 rounded-xl bg-[#000080] hover:bg-blue-900 text-white font-black text-lg transition-all active:scale-95 shadow-md">
                    Try theme
                  </button>
                  <button className="w-full py-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-[#050505] font-bold text-lg transition-all active:scale-95">
                    View demo store
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
