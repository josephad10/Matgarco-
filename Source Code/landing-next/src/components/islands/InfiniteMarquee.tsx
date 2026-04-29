"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { Star } from "lucide-react";
import React from "react";

export function InfiniteMarquee() {
  const { t, lang } = useLanguage();

  const reviews = t.testimonials?.reviews;
  if (!reviews || !Array.isArray(reviews)) return null;

  // Double the array for seamless infinite scroll
  const doubledReviews = [...reviews, ...reviews];

  const renderCard = (review: any, index: number) => {
    const initials = review.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    return (
      <div 
        key={index}
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="bg-[#050510] border border-white/5 rounded-2xl p-6 w-[350px] md:w-[400px] flex-shrink-0 shadow-[0_4px_20px_rgba(0,0,128,0.15)] mx-4 flex flex-col justify-between overflow-hidden"
      >
        <div>
          <div className="flex text-yellow-500 mb-4 gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-normal break-words text-start mb-6">"{review.text}"</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-900/50 border border-blue-500 text-white font-bold flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div>
            <h4 className="text-white font-bold">{review.name}</h4>
            <p className="text-[#3B82F6] text-sm">{review.store}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 40s linear infinite;
        }
        .group:hover .animate-marquee-left,
        .group:hover .animate-marquee-right {
          animation-play-state: paused;
        }
      `}</style>
      <div className="flex flex-col gap-8 w-full overflow-hidden py-10" dir="ltr">
        {/* Row 1 (Scrolls Left) */}
        <div className="flex w-full group">
          <div className="flex whitespace-nowrap animate-marquee-left" style={{ width: "max-content" }}>
            {doubledReviews.map((review: any, index: number) => renderCard(review, index))}
          </div>
        </div>

        {/* Row 2 (Scrolls Right) */}
        <div className="flex w-full group">
          <div className="flex whitespace-nowrap animate-marquee-right" style={{ width: "max-content" }}>
            {/* Reverse the doubled array for visual variation */}
            {[...doubledReviews].reverse().map((review: any, index: number) => renderCard(review, index))}
          </div>
        </div>
      </div>
    </>
  );
}
