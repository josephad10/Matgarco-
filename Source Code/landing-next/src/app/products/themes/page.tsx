"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { GlobalFooter } from "@/components/sections/GlobalFooter";
import { useLanguage } from "@/i18n/LanguageContext";
import MatgarcoImage from "@/components/ui/MatgarcoImage";

export default function ThemesPage() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const tg = t.themesGallery;

  const allThemes = t.themeDetails ? Object.values(t.themeDetails) : [];
  const limitedEditionIds = ["autox", "furnique", "nelly"];
  const standardThemes = allThemes.filter(
    (theme: any) => !limitedEditionIds.includes(theme.id),
  );
  const premiumThemes = allThemes.filter((theme: any) =>
    limitedEditionIds.includes(theme.id),
  );

  return (
    <div
      className="min-h-screen bg-white text-[#050505]"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Navbar />

      <main className="pt-36 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto text-start">
        {/* Shopify-Tier Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-[#050505] mb-4 overflow-visible">
            {tg?.title || "Choose the right theme for your business"}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
            {tg?.subtitle ||
              "Look for a design with the features you need most, then customize from there"}
          </p>
        </div>

        {/* Top Themes Section Header */}
        <div className="mt-12 mb-8">
          <h2 className="text-3xl font-bold text-[#050505] mb-2">
            {tg?.topThemes || "Top themes"}
          </h2>
          <p className="text-slate-500 font-medium">
            {tg?.topThemesDesc ||
              "Fully flexible and regularly updated with Matgarco's latest features"}
          </p>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-rtl {
            0% { transform: translateX(0%); }
            100% { transform: translateX(50%); }
          }
          @keyframes text-glow {
            0% { text-shadow: 0 0 10px rgba(0, 0, 0, 0.05); }
            50% { text-shadow: 0 0 20px rgba(0, 0, 0, 0.25), 0 0 10px rgba(0, 0, 0, 0.15); }
            100% { text-shadow: 0 0 10px rgba(0, 0, 0, 0.05); }
          }
          .animate-marquee {
            display: flex;
            white-space: nowrap;
            /* SLOWED DOWN TO 60s FOR CALM MOTION */
            animation: marquee 60s linear infinite;
          }
          .animate-marquee-rtl {
            display: flex;
            white-space: nowrap;
            /* SLOWED DOWN TO 60s FOR CALM MOTION */
            animation: marquee-rtl 60s linear infinite;
          }
          .animate-text-glow {
            /* GLOWING TEXT EFFECT */
            animation: text-glow 3s ease-in-out infinite;
          }
        `}</style>

        {/* Standard Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 text-left">
          {standardThemes.map((theme: any) => (
            <Link
              key={theme.id}
              href={`/products/themes/${theme.id}`}
              className="flex flex-col gap-4 cursor-pointer group"
            >
              <div className="relative w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-sm transition-all duration-300 group-hover:scale-[1.02]">
                <MatgarcoImage
                  src={theme.images[0]}
                  alt={theme.name}
                  aspectRatio="video"
                  objectFit="cover"
                  priority={true}
                />
              </div>
              <div className="flex flex-col gap-1 px-1">
                <h3 className="text-xl font-bold text-[#050505] tracking-tight">
                  {theme.name}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm font-medium text-slate-500">
                    {theme.category || (isRtl ? "قالب مميز" : "Premium Theme")}
                  </p>
                  <p className="text-[#050505] font-bold text-sm">
                    {theme.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* The Animated Navy Marquee Separator with Decorative Pattern */}
        {/* Breakout technique: relative, max-w-none, w-screen, -mx-[50vw] to make it full width in Dom flow */}
        <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-[#000080] py-6 my-24 shadow-2xl border-y border-slate-800 overflow-hidden flex items-center justify-center">
          {/* Subtle Geometric Dot Pattern Background Decoration */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "16px 16px",
            }}
          ></div>
          {/* Soft Edge Gradients to blend the scrolling text seamlessly */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#000080] via-transparent to-[#000080] z-10 pointer-events-none"></div>

          <div
            className={`${isRtl ? "animate-marquee-rtl" : "animate-marquee"} flex items-center z-0`}
          >
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="text-white text-2xl md:text-3xl font-black tracking-widest uppercase mx-12 drop-shadow-md whitespace-nowrap"
              >
                {tg?.marquee || "✦ LIMITED EDITIONS ✦ ONE-TIME PURCHASE ✦"}
              </span>
            ))}
          </div>
        </div>

        {/* Premium Themes Header (Properly flow-sequenced below the marquee) */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-[#050505] mb-2 uppercase tracking-tight">
            {tg?.limitedTitle || "Limited Editions"}
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-3xl">
            {tg?.limitedSubtitle ||
              "Exclusive themes available as a one-time purchase"}
          </p>
        </div>

        {/* Premium Themes Grid (Fixed Currency Display) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 text-left">
          {premiumThemes.map((theme: any) => (
            <Link
              key={theme.id}
              href={`/products/themes/${theme.id}`}
              className="flex flex-col gap-4 cursor-pointer group"
            >
              <div className="relative w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-md transition-all duration-300 group-hover:scale-[1.02]">
                {/* Golden Exclusive Badge */}
                <div
                  className={`absolute top-4 ${isRtl ? "right-4" : "left-4"} z-10 bg-[#D4AF37] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider`}
                >
                  {isRtl ? "نسخة محدودة" : "Limited"}
                </div>
                <MatgarcoImage
                  src={theme.images[0]}
                  alt={theme.name}
                  aspectRatio="video"
                  objectFit="cover"
                  priority={true}
                />
              </div>
              <div className="flex flex-col gap-1 px-1">
                <h3 className="text-2xl font-black text-[#050505] tracking-tight">
                  {theme.name}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm font-medium text-slate-500">
                    {theme.category ||
                      (isRtl ? "شراء لمرة واحدة" : "One-Time Purchase")}
                  </p>
                  {/* FIXED: Now shows the Price AND the Currency (slice 0, 2) */}
                  <p className="text-[#050505] font-black text-lg">
                    {theme.price.split(" ").slice(0, 2).join(" ")}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* The Center-Aligned, Soft Black Glowing "Coming Soon" Title */}
        <div className="w-full flex flex-col items-center justify-center my-32 text-center px-6 relative">
          {/* Subtle ambient background glow (Smoky Black) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-[#000000] opacity-[0.03] blur-3xl rounded-full pointer-events-none"></div>

          <h2 className="text-4xl md:text-5xl font-black text-[#000000] tracking-tighter mb-5 animate-text-glow relative z-10">
            {tg?.comingSoonTitle || "More themes coming soon..."}
          </h2>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed font-medium relative z-10">
            {tg?.comingSoonDesc ||
              "Our designers are currently building new exclusive themes. The current 27 templates are just the beginning of a continuously growing library to fit every business need."}
          </p>
        </div>

        {/* The 3-Column Features Area (Flush and Flat) */}
        <div className="border-y border-slate-200 py-12 bg-white">
          <h3 className="text-2xl font-bold mb-10 text-[#050505]">
            {tg?.perksTitle || "What every theme gets you"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <p className="text-base font-medium text-slate-600 leading-relaxed">
                <strong className="text-[#050505]">
                  {tg?.perk1Title || "Built for commerce"}
                </strong>{" "}
                —{" "}
                {tg?.perk1Desc ||
                  "fast, reliable, and with the world's best-converting checkout"}
              </p>
            </div>
            <div>
              <p className="text-base font-medium text-slate-600 leading-relaxed">
                <strong className="text-[#050505]">
                  {tg?.perk2Title || "All the essentials"}
                </strong>{" "}
                —{" "}
                {tg?.perk2Desc ||
                  "product recommendations, reviews, discounts, and much more"}
              </p>
            </div>
            <div>
              <p className="text-base font-medium text-slate-600 leading-relaxed">
                <strong className="text-[#050505]">
                  {tg?.perk3Title || "Developer support"}
                </strong>{" "}
                —{" "}
                {tg?.perk3Desc ||
                  "get help when you need it, including free updates"}
              </p>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
