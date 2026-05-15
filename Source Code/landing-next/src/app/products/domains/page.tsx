"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { GlobalFooter } from "@/components/sections/GlobalFooter";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Shield,
  Zap,
  Lock,
  RefreshCw,
  ArrowRight,
  Globe,
  Link as LinkIcon,
  CheckCircle2,
  DollarSign,
  MapPin,
  CreditCard,
  Check,
  ShieldCheck,
  Wrench,
  Plus,
  Minus,
} from "lucide-react";
import { DomainSearchHero } from "@/components/sections/DomainSearchHero";
import { useState } from "react";

export default function DomainsPage() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const dp = t.mdomainPage;
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Islamic Star SVG Pattern
  const IslamicPattern = () => (
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none">
      <defs>
        <pattern id="islamic-star" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M20 0L24.5 15.5L40 20L24.5 24.5L20 40L15.5 24.5L0 20L15.5 15.5Z" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-star)" />
    </svg>
  );

  return (
    <div
      className="min-h-screen bg-[#000000] text-white font-sans selection:bg-white/20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Navbar />

      <main className="flex flex-col w-full">
        {/* 1. HERO SECTION */}
        <DomainSearchHero />

        {/* 2. MARKETING PROMO */}
        <div className="w-full max-w-6xl mx-auto px-6 py-12 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter">
            {dp?.extensionPromoTitle || "Stand out with the right domain extension"}
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            {dp?.extensionPromoDesc || "Pick from hundreds of TLDs to target a specific audience, establish a niche, or expand into global markets with a local flare."}
          </p>
          <div className="relative w-full rounded-3xl overflow-hidden bg-[#000000]">
            <img
              src="https://res.cloudinary.com/do4jgu68v/image/upload/v1778774957/e8e5607247dfc18f7fb045ee5bea0f77_tzmvwu.webp"
              alt="Domain Extensions Setup"
              className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-700 ease-out"
            />
          </div>
        </div>

        {/* 3. POPULAR EXTENSIONS GRID */}
        <div className="w-full py-12 bg-[#000000]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter">
                {dp?.popularExtensions || "Popular Domain Extensions"}
              </h2>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {dp?.popularExtensionsDesc || "Choose from a variety of domain extensions at great prices"}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dp?.extensionsList?.map((item: any, idx: number) => (
                <div key={idx} className="bg-white/[0.03] hover:bg-white/[0.05] rounded-[32px] p-8 md:p-10 flex flex-col items-start transition-all duration-300 relative overflow-hidden group">
                  {item.badge && (
                    <div className={`absolute top-6 right-6 px-4 py-1.5 text-xs font-black rounded-full uppercase tracking-widest ${
                      item.badgeType === 'popular' 
                        ? 'bg-blue-500/10 text-blue-400' 
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {item.badge}
                    </div>
                  )}
                  <h3 className="text-4xl font-black text-white mb-4 tracking-tight">{item.ext}</h3>
                  <p className="text-slate-400 text-lg font-bold mb-10">{item.price}</p>
                  
                  <button className="mt-auto w-full py-4 bg-white/[0.05] group-hover:bg-white/10 text-white font-black rounded-2xl transition-colors">
                    {dp?.buyBtn || "Register Now"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. EASY PAYMENT SECTION */}
        <div className="w-full max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left" dir={isRtl ? "rtl" : "ltr"}>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-tight">
                {dp?.easyPayment?.benefits?.payInEGP} <br className="hidden md:block" />
                <span className="text-emerald-400">{dp?.easyPayment?.benefits?.noCreditCard}</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-10">
                {dp?.easyPayment?.paragraph}
              </p>
              
              {/* 6 Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                {[
                  dp?.easyPayment?.benefits?.payInEGP,
                  dp?.easyPayment?.benefits?.noCreditCard,
                  dp?.easyPayment?.benefits?.bankTransfers,
                  dp?.easyPayment?.benefits?.mobileWallets,
                  dp?.easyPayment?.benefits?.transparentPricing,
                  dp?.easyPayment?.benefits?.securePayment
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Payment Methods Card */}
            <div className="w-full lg:w-1/2 bg-white text-[#050505] rounded-3xl p-6 md:p-10 shadow-2xl">
              <h3 className="text-2xl font-black text-center mb-8 text-slate-900 tracking-tight">
                {dp?.paymentMethods?.title}
              </h3>

              <div className="space-y-4">
                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 flex items-center gap-5">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-xl text-slate-900 leading-none mb-1">
                      {dp?.paymentMethods?.egp?.title}
                    </div>
                    <div className="text-sm font-bold text-slate-500">
                      {dp?.paymentMethods?.egp?.subtitle}
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-5 text-slate-600 grayscale hover:grayscale-0 transition-all cursor-default">
                  <CreditCard className="w-6 h-6 shrink-0" />
                  <div className="font-black text-lg flex-1 tracking-tight">
                    {dp?.paymentMethods?.bankTransfer}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-5 text-slate-600 grayscale hover:grayscale-0 transition-all cursor-default">
                  <Shield className="w-6 h-6 shrink-0" />
                  <div className="font-black text-lg flex-1 tracking-tight">
                    {dp?.paymentMethods?.mobileWallets}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-5 text-slate-600 grayscale hover:grayscale-0 transition-all cursor-default">
                  <Lock className="w-6 h-6 shrink-0" />
                  <div className="font-black text-lg flex-1 tracking-tight">
                    {dp?.paymentMethods?.debitCards}
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 text-blue-800 rounded-xl py-4 px-6 text-center text-xs font-black border border-blue-100 tracking-tight leading-relaxed">
                {dp?.paymentMethods?.footerNote}
              </div>
            </div>
          </div>
        </div>

        {/* 5. MANAGE DOMAIN SECTION */}
        <div className="w-full bg-[#000000] py-12">
          <div className="max-w-6xl mx-auto px-6" dir={isRtl ? "rtl" : "ltr"}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-10 tracking-tighter text-white">
              {dp?.shopifyTierPromo?.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
              {dp?.shopifyTierPromo?.features?.map((item: any, idx: number) => (
                <div key={idx} className={`border-blue-600 transition-transform hover:translate-x-2 ${isRtl ? 'pr-6 border-r-[3px]' : 'pl-6 border-l-[3px]'}`}>
                  <h3 className="text-2xl font-black mb-3 text-white tracking-tight">{item.title}</h3>
                  <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. REST EASY SECTION */}
        <div className="w-full bg-[#000000] py-12">
          <div className="max-w-6xl mx-auto px-6" dir={isRtl ? "rtl" : "ltr"}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-10 tracking-tighter text-white text-center leading-[1.1]">
              {dp?.domainManagementSection?.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dp?.domainManagementSection?.features?.map((item: any, idx: number) => {
                const Icon = idx === 0 ? ShieldCheck : idx === 1 ? Lock : Wrench;
                return (
                  <div key={idx} className="bg-white/[0.03] rounded-[40px] p-10 md:p-12 flex flex-col items-center text-center hover:bg-white/[0.05] transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 shadow-inner">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-bold tracking-tight">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 6.1 FAQ SECTION */}
        <div className="w-full max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-12 tracking-tighter">
            {dp?.faqSection?.title}
          </h2>
          <div className="flex flex-col border-t border-white/10">
            {dp?.faqSection?.items?.map((item: any, idx: number) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border-b border-white/10">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="flex items-center justify-between w-full py-8 text-left group"
                  >
                    <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-slate-300 transition-colors pr-6 tracking-tight">
                      {item.q}
                    </span>
                    <span className="flex-shrink-0 text-slate-400 group-hover:text-white transition-transform duration-500 ease-in-out">
                      {isOpen ? (
                        <Minus className="w-8 h-8 rotate-180 transition-transform duration-500" />
                      ) : (
                        <Plus className="w-8 h-8 transition-transform duration-500" />
                      )}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      isOpen ? "grid-rows-[1fr] opacity-100 mb-8" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-lg md:text-xl text-slate-400 leading-relaxed pr-10">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. INFINITE NAVY TRANSFER BAR WITH ISLAMIC ORNAMENTATION */}
        <div className="w-full relative overflow-hidden bg-[#000080] py-10 mt-12 border-y border-white/10">
          {/* Islamic Geometric Overlay */}
          <IslamicPattern />
          
          <a 
            href="http://localhost:3002/register"
            className="block w-full relative z-10 cursor-pointer group"
          >
            {/* Force LTR here to prevent RTL transform coordinate bugs */}
            <div className="flex whitespace-nowrap animate-scroll" dir="ltr">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-center gap-12 px-6">
                  {/* Decorative Star Separator */}
                  <div className="w-8 h-8 flex items-center justify-center opacity-50">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-white">
                      <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
                    </svg>
                  </div>
                  
                  <span className="text-white text-xl md:text-3xl font-medium tracking-tight">
                    {dp?.transferMarquee?.text}
                  </span>
                  
                  <div className="inline-flex items-center gap-3 bg-white text-[#000080] px-8 py-3.5 rounded-full font-black text-lg md:text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-300 mx-6">
                    {dp?.transferMarquee?.button}
                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                  </div>
                </div>
              ))}
            </div>
          </a>

          <style jsx>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              animation: scroll 40s linear infinite;
            }
          `}</style>
        </div>

        {/* 8. GET STARTED STEPS */}
        <div className="w-full py-16 bg-[#000000]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 tracking-tighter">
                {dp?.stepsSection?.title}
              </h2>
              <p className="text-xl text-slate-400">
                {dp?.stepsSection?.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {dp?.stepsSection?.steps?.map((step: any, idx: number) => {
                const Icon = idx === 0 ? Globe : idx === 1 ? CreditCard : Zap;
                return (
                  <div key={idx} className="relative flex flex-col items-center text-center group bg-white/[0.02] p-10 rounded-[40px] hover:bg-white/[0.05] hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-white/[0.05] hover:border-[#000080]/50 hover:shadow-[0_0_40px_rgba(0,0,128,0.25)]">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-10 relative z-10 group-hover:bg-white/10 transition-colors">
                      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-[#000080] text-white font-black flex items-center justify-center text-lg shadow-2xl group-hover:scale-110 transition-transform duration-300 ring-4 ring-black">
                        {idx + 1}
                      </div>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-[#000080] transition-colors">{step.title}</h3>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-xs">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
