"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star } from "lucide-react";
import { useEffect } from "react";

export function TestimonialsCarousel() {
  const { t, lang } = useLanguage();
  
  // Configure Embla direction based on language
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "start",
      direction: lang === "ar" ? "rtl" : "ltr"
    },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  // Fallback safety for testimonials array
  const testimonials = t.phase7?.testimonials || [
    { name: "Ahmed T.", role: "CEO", text: "Great platform." }
  ];

  // Re-initialize Embla when language changes to apply RTL correctly
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit({ direction: lang === "ar" ? "rtl" : "ltr" });
    }
  }, [lang, emblaApi]);

  return (
    <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={emblaRef} dir={lang === "ar" ? "rtl" : "ltr"}>
      <div 
        className="flex" 
        style={{ 
          marginLeft: lang === 'ar' ? '0' : '-1rem', 
          marginRight: lang === 'ar' ? '-1rem' : '0' 
        }}
      >
        {testimonials.map((testimonial: any, index: number) => (
          <div 
            key={`testimonial-${index}`} 
            className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_90%] md:flex-[0_0_80%]"
            style={{ 
              paddingLeft: lang === 'ar' ? '0' : '1rem', 
              paddingRight: lang === 'ar' ? '1rem' : '0' 
            }}
          >
            <div className="bg-[#000080]/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full flex flex-col transition-colors duration-300 hover:bg-[#000080]/20">
              <div className="flex items-center gap-1 mb-6 text-[#3B82F6]">
                {[...Array(5)].map((_, i) => (
                  <Star key={`star-${index}-${i}`} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="text-white/90 text-lg md:text-xl mb-8 flex-grow leading-relaxed font-light">
                "{testimonial.text}"
              </p>
              <div className="mt-auto">
                <p className="text-white font-medium">{testimonial.name}</p>
                <p className="text-[#3B82F6] text-sm mt-1">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
