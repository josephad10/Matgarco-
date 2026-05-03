"use client";

import { useLanguage } from "@/i18n/LanguageContext";

/**
 * ComparisonMatrix — Phase 13 Step 3.0: Pristine White Matrix
 *
 * Architectural Justification:
 * - Pillar 1 (Performance): Uses pure CSS Grid (`grid-cols-[2fr_1fr_1fr_1fr]`) to enforce horizontal symmetry.
 * - Pillar 6 (UX/UI): A clean, high-contrast "Shopify-tier" white design. 
 *   Focuses on readability with zero grid noise, utilizing hover states for row tracking.
 */
export function ComparisonMatrix() {
  const { t, lang } = useLanguage();
  const matrix = t.pricingPage?.matrix;
  const isRtl = lang === "ar";

  if (!matrix) return null;

  // Helper to split "Name (Sub)" into ["Name", "(Sub)"] for symmetrical styling
  const splitHeader = (header: string) => {
    const parts = header.split(" (");
    if (parts.length > 1) {
      return [parts[0], `(${parts[1]}`];
    }
    return [header, ""];
  };

  const starterHeader = splitHeader(matrix.headers[0]);
  const proHeader = splitHeader(matrix.headers[1]);
  const primeHeader = splitHeader(matrix.headers[2]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-24 mb-32 overflow-x-auto" dir={isRtl ? "rtl" : "ltr"}>
      {/* ── ROOT TABLE WRAPPER (Pristine White Card) ── */}
      <div className="min-w-[900px] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* ── STICKY HEADER ROW ── */}
        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-xl py-6 grid grid-cols-[2fr_1fr_1fr_1fr] shadow-sm">
          
          {/* Col 1: Features Comparison Header */}
          <div className="flex items-center px-8">
            <span className="text-[#050505] text-xl md:text-2xl font-black tracking-tight">
              {matrix.featureColumnLabel}
            </span>
          </div>

          {/* Col 2: Starter */}
          <div className="flex flex-col items-center justify-end px-4 text-center h-full">
            <span className="text-xl lg:text-2xl font-black text-[#050505] leading-none mb-1">{starterHeader[0]}</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{starterHeader[1]}</span>
          </div>

          {/* Col 3: Professional (Most Popular Nudge) */}
          <div className="flex flex-col items-center justify-end px-4 text-center h-full">
            <div className="bg-[#000080] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md whitespace-nowrap mb-3">
              {lang === "ar" ? "الأكثر اختياراً" : "Most Popular"}
            </div>
            <span className="text-xl lg:text-2xl font-black text-[#050505] leading-none mb-1">
              {proHeader[0]}
            </span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              {proHeader[1]}
            </span>
          </div>

          {/* Col 4: Business */}
          <div className="flex flex-col items-center justify-end px-4 text-center h-full">
            <span className="text-xl lg:text-2xl font-black text-[#050505] leading-none mb-1">{primeHeader[0]}</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{primeHeader[1]}</span>
          </div>
        </div>

        {/* ── CATEGORIES & FEATURES ── */}
        <div className="pb-10">
          {matrix.categories.map((category: any, catIdx: number) => (
            <div key={catIdx}>
              {/* Category Section Header */}
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr]">
                <div className="col-span-4 bg-gray-50 text-[#000080] font-black uppercase tracking-widest py-5 px-8 mt-4 rounded-xl">
                  {category.name}
                </div>
              </div>

              {/* Feature Rows (Borderless Minimalism) */}
              {category.features.map((feature: any, featIdx: number) => (
                <div
                  key={featIdx}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr] hover:bg-gray-50/80 transition-colors duration-200 cursor-default rounded-xl border-none divide-none"
                >
                  {/* Feature Label */}
                  <div className="text-gray-600 text-sm font-semibold py-6 px-8 flex items-center">
                    {feature.name}
                  </div>

                  {/* Starter Value */}
                  <div className="flex items-center justify-center text-[#050505] text-sm font-extrabold text-center py-6 px-4">
                    <FeatureValue value={feature.lite} />
                  </div>

                  {/* Professional Value */}
                  <div className="flex items-center justify-center text-[#050505] text-sm font-extrabold text-center py-6 px-4">
                    <FeatureValue value={feature.pro} />
                  </div>

                  {/* Business Value */}
                  <div className="flex items-center justify-center text-[#050505] text-sm font-extrabold text-center py-6 px-4">
                    <FeatureValue value={feature.prime} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * FeatureValue — Renders value as Text, Checkmark SVG, or Muted Minus
 */
function FeatureValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <svg
        className="w-5 h-5 text-[#3B82F6] mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg
        className="w-5 h-5 text-gray-300 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
      </svg>
    );
  }
  return <span>{value}</span>;
}
