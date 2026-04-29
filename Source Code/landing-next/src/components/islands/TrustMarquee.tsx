"use client";

import React, { useMemo } from "react";

export function TrustMarquee() {
  const logos = useMemo(() => [
    { name: "Fawry", hoverClass: "hover:text-yellow-400" },
    { name: "Paymob", hoverClass: "hover:text-blue-500" },
    { name: "Stripe", hoverClass: "hover:text-indigo-500" },
    { name: "Visa", hoverClass: "hover:text-blue-600" },
    { name: "Mastercard", hoverClass: "hover:text-orange-500" },
    { name: "PayPal", hoverClass: "hover:text-sky-500" }
  ], []);

  return (
    <div className="w-full bg-surface py-10 border-y border-white/5 flex flex-col justify-center items-center overflow-hidden">
      
      <h3 className="text-center text-[#000080] text-xl md:text-2xl font-black mb-8 drop-shadow-sm tracking-tight px-4">
        شركاء النجاح والتكامل البرمجي
      </h3>
      
      <div className="relative flex overflow-hidden w-full max-w-7xl mx-auto items-center contain-layout isolate">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes accelerated-marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .animate-accelerated-marquee {
            animation: accelerated-marquee 30s linear infinite;
          }
        `}} />

        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
        
        {/* Hardware-Accelerated Track binding exact Event Loop bounds optimizing reconciliation structures */}
        <div className="flex w-max whitespace-nowrap animate-accelerated-marquee group cursor-pointer hover:[animation-play-state:paused] will-change-transform shrink-0">
          {[...logos, ...logos].map((logo, i) => (
            <div 
              key={`${logo.name}-${i}`} 
              className="flex items-center justify-center mx-10 md:mx-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 select-none transform-gpu shrink-0"
            >
              <span className={`text-2xl md:text-3xl font-black text-foreground tracking-tighter transition-colors duration-300 ${logo.hoverClass}`}>
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
