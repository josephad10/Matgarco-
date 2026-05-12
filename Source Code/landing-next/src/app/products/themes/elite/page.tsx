"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { GlobalFooter } from "@/components/sections/GlobalFooter";
import MatgarcoImage from "@/components/ui/MatgarcoImage";

export default function EliteThemePage() {
  const { t, lang } = useLanguage();

  // Statically assign Elite data as this is a dedicated page
  const themeData = t.themeDetails?.elite;

  if (!themeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-[#050505]">
        <h1 className="text-3xl font-bold">Theme not found</h1>
      </div>
    );
  }

  const isRtl = lang === "ar";

  return (
    <div
      className="min-h-screen bg-white text-[#050505] flex flex-col"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Navbar />

      {/* Sticky Theme Header */}
      <div className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 py-5 px-6 md:px-12 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-black leading-tight">
            {themeData.name}
          </h1>
          <span className="text-sm text-slate-500 mt-0.5">
            {themeData.developer}
          </span>
        </div>
        <div>
          <Link href="http://localhost:3002/register">
            <button className="bg-[#050505] text-white px-8 py-3 rounded-md font-bold hover:bg-slate-800 transition-all">
              {themeData.buttons.tryTheme}
            </button>
          </Link>
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-16 pb-24 text-start">
        {/* Main Hero Overview */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl flex flex-col gap-4 mb-10">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-black leading-normal pt-4 pb-6 overflow-visible">
              {themeData.name}
            </h1>
            <span className="text-xl text-slate-500 font-bold uppercase tracking-widest">
              {themeData.developer}
            </span>
            <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed mt-4">
              {themeData.overview}
            </p>
          </div>
          <div
            className={`flex flex-col ${isRtl ? "md:text-start" : "md:text-end"}`}
          >
            <span className="text-2xl font-black tracking-tighter text-black">
              {themeData.price}
            </span>
            <span className="text-sm text-slate-500">
              {themeData.developer}
            </span>
          </div>
        </div>

        {/* Master Hero Cover Image - Natural Scaling to Prevent Cropping */}
        <div className="w-full mb-16">
          <MatgarcoImage
            src={themeData.images[0]}
            alt={`${themeData.name} Cover`}
            priority={true}
            aspectRatio="auto"
            className="w-full h-auto object-contain rounded-2xl border border-slate-200 shadow-sm"
          />
        </div>

        {/* Highlights 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {themeData.highlights.map((highlight: any, idx: number) => (
            <div
              key={idx}
              className="bg-slate-50 p-10 rounded-2xl border border-slate-100"
            >
              <h3 className="font-black tracking-tighter text-black text-xl mb-4">
                {highlight.title}
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                {highlight.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Rich Section: About this Theme - 100% Dictionary-Driven */}
        <div className="mb-24 flex flex-col md:flex-row gap-12 items-start border-y border-slate-100 py-20">
          <div className="md:w-1/3">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-[#000080] animate-pulse shadow-[0_0_12px_#000080]" />
              <h2 className="text-2xl font-black tracking-tighter text-black uppercase">
                {isRtl ? "حول هذا القالب" : "About this theme"}
              </h2>
            </div>
          </div>
          <div className="md:w-2/3">
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
              {themeData.overview}
            </p>
          </div>
        </div>

        {/* Design Philosophy Section */}
        <div className="mb-24 bg-[#050505] text-white rounded-3xl p-12 md:p-16">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6">
              {themeData.philosophy.title}
            </h2>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
              {themeData.philosophy.desc}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {themeData.philosophy.points.map((pt: any, i: number) => (
              <div key={i} className="border-t border-white/20 pt-6">
                <h4 className="text-xl font-bold mb-3 text-white">{pt.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Image Gallery - Natural Scaling Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {themeData.images.slice(1).map((img: string, idx: number) => (
            <div key={idx} className="w-full">
              <MatgarcoImage
                src={img}
                alt={`Theme Showcase ${idx + 1}`}
                aspectRatio="auto"
                className="w-full h-auto object-contain rounded-2xl border border-slate-200 shadow-sm"
              />
            </div>
          ))}
        </div>

        {/* What's Included Section (Documentation Style) */}
        <div className="border-t border-slate-100 pt-24">
          <div className="mb-20">
            <span className="inline-block px-5 py-2 rounded-full border border-slate-200 text-xs font-bold tracking-widest uppercase text-slate-500 mb-6">
              {themeData.whatsIncluded}
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black">
              {themeData.featuresTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
            {Object.values(themeData.featuresList).map(
              (category: any, idx: number) => (
                <div key={idx}>
                  <h4 className="text-xl font-black text-black mb-8 border-b-2 border-black w-fit pb-2 uppercase tracking-tight">
                    {category.title}
                  </h4>
                  <ul className="flex flex-col">
                    {category.items.map((item: string, i: number) => (
                      <li
                        key={i}
                        className="text-base text-slate-600 py-3 border-b border-slate-50 last:border-0 font-medium"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
