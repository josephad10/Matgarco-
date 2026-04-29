import { cookies } from "next/headers";
import { MobileEngineVisual } from "@/components/islands/MobileEngineVisual";
import { TestimonialsCarousel } from "@/components/islands/TestimonialsCarousel";
import { en } from "@/i18n/en";
import { ar } from "@/i18n/ar";

export async function SocialProofSection() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const t = lang === "ar" ? ar : en;

  return (
    <section className="relative py-32 bg-[#000000] border-t border-white/5 overflow-hidden isolate">
      {/* Background Radial Gradients */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-[#000080]/20 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#000080]/15 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Start Column: Content & Testimonials */}
          <div className="flex flex-col gap-12 order-2 lg:order-1" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                {t.phase7?.title || "Run your empire from your pocket."}
              </h2>
              <p className="text-lg md:text-xl text-white/60 max-w-xl font-light leading-relaxed">
                {t.phase7?.subtitle || "Full-featured mobile management. Because commerce never sleeps."}
              </p>
            </div>
            
            <div className="w-full">
              <TestimonialsCarousel />
            </div>
          </div>

          {/* End Column: Mobile Engine Visual */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2 w-full perspective-[1000px]">
            <MobileEngineVisual />
          </div>

        </div>
      </div>
    </section>
  );
}
