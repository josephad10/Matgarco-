"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * PricingHero — Phase 13: V2 Final
 *
 * Architectural Justification:
 * - Pillar 5 (Islands Architecture): Purely client-side presentation component.
 * - Pillar 6 (UI/UX): OLED Black base. High-contrast radiant CTA.
 * - CRITICAL FIX 1: Bulletproof localStorage timer (syncs via Date.now() on every tick).
 * - CRITICAL FIX 2: initial={false} on all motion elements eliminates the BF-cache blank screen.
 */

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const STAGGER_CONTAINER = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function PricingHero() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const hero = t.pricingPage?.hero;

  // ── PERSISTENT TIMER ─────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const STORAGE_KEY = "matgarco_offer_end";

    const updateTimer = () => {
      let endTime = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
      const now = Date.now();

      // If no end time exists, or it has passed, set a fresh 24h window
      if (!endTime || endTime < now) {
        endTime = now + 24 * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, endTime.toString());
      }

      // Calculate remaining seconds strictly based on current real time
      setTimeLeft(Math.floor((endTime - now) / 1000));
    };

    updateTimer(); // Sync immediately on mount (picks up persisted value)
    const timer = setInterval(updateTimer, 1000); // Re-sync every second

    // BF-Cache fix: if browser restores page from cache, force a fresh load
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      clearInterval(timer);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds % 3600) / 60);
    const ss = seconds % 60;
    return {
      hh: String(hh).padStart(2, "0"),
      mm: String(mm).padStart(2, "0"),
      ss: String(ss).padStart(2, "0"),
    };
  };

  const { hh, mm, ss } = formatTime(timeLeft);

  if (!hero) return null;

  return (
    <section
      className="relative w-full bg-[#000000] overflow-hidden flex flex-col items-center px-4"
      dir={isRtl ? "rtl" : "ltr"}
      aria-labelledby="pricing-hero-title"
    >
      {/* initial={false} prevents Framer Motion from trapping elements at opacity:0 on BF-cache restore */}
      <motion.div
        initial={false}
        animate="visible"
        variants={STAGGER_CONTAINER}
        className="w-full max-w-5xl mx-auto flex flex-col items-center"
      >
        {/* ── 1. VONDERA-STYLE COUNTDOWN TIMER ────────────────────────────── */}
        <motion.div
          initial={false}
          animate="visible"
          variants={FADE_UP_VARIANTS}
          transition={SPRING}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="flex flex-col items-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-3xl md:text-4xl font-black text-white shadow-inner">
              {isMounted ? hh : "00"}
            </div>
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-3">{hero.hours}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-3xl md:text-4xl font-black text-white shadow-inner">
              {isMounted ? mm : "00"}
            </div>
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-3">{hero.minutes}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-3xl md:text-4xl font-black text-white shadow-inner">
              {isMounted ? ss : "00"}
            </div>
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-3">{hero.seconds}</span>
          </div>
        </motion.div>

        {/* ── 2. VONDERA-STYLE OFFER CARD ─────────────────────────────────── */}
        <motion.div
          initial={false}
          animate="visible"
          variants={FADE_UP_VARIANTS}
          transition={SPRING}
          className="flex flex-col md:flex-row bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 md:p-10 w-full mb-20 items-center backdrop-blur-md"
        >
          {/* Left Side: Offer Details */}
          <div className="flex-1 text-start">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#3B82F6] text-white text-[10px] font-bold tracking-wider uppercase mb-5 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse">
              {hero.offerBadge}
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              {hero.offerTitle}
            </h2>
            <p className="text-white/60 text-sm md:text-base font-medium mb-8 max-w-xl leading-relaxed">
              {hero.offerSubtitle}
            </p>
            <div className="flex flex-wrap gap-2">
              {hero.offerTags?.map((tag, idx) => {
                const isPromoTag = tag.includes("50");
                return (
                  <span
                    key={idx}
                    className={`px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-wider transition-all duration-300 ${
                      isPromoTag
                        ? "bg-[#000080] text-white shadow-[0_0_10px_rgba(0,0,128,0.8)] border-[#000080]"
                        : "border-white/10 bg-white/5 text-white/70"
                    }`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>

            {/* Claim Offer CTA */}
            <div className="mt-8">
              <a
                href="http://localhost:3002/register"
                className="inline-flex h-12 px-8 rounded-full bg-white text-black font-extrabold shadow-[0_0_20px_rgba(255,255,255,0.7)] hover:shadow-[0_0_40px_rgba(255,255,255,1)] hover:scale-105 transition-all duration-300 items-center justify-center text-sm tracking-wide"
              >
                {hero.claimOffer}
              </a>
            </div>
          </div>

          {/* Right Side: High-Contrast Price Block */}
          <div className="mt-8 md:mt-0 md:ms-8 flex-shrink-0 bg-[#050505] border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center min-w-[240px] shadow-[0_0_50px_rgba(0,0,128,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#000080]/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />

            <span className="line-through text-white/40 text-2xl font-bold mb-1">
              {hero.originalPrice} {hero.offerCurrency}
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">{hero.offerPrice}</span>
              <span className="text-xl font-bold text-white/50">{hero.offerCurrency}</span>
            </div>
            <span className="text-white/40 text-sm font-medium mt-2">{hero.offerPeriod}</span>
          </div>
        </motion.div>

        {/* ── 3. SHOPIFY-STYLE ONBOARDING ─────────────────────────────────── */}
        <motion.div
          initial={false}
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="flex flex-col items-center text-center w-full"
        >
          <motion.h1
            id="pricing-hero-title"
            initial={false}
            animate="visible"
            variants={FADE_UP_VARIANTS}
            transition={SPRING}
            className={`text-4xl md:text-6xl lg:text-7xl font-black text-white max-w-4xl mx-auto mb-6 ${
              isRtl ? "leading-[1.4] tracking-normal" : "leading-[1.1] tracking-tighter"
            }`}
          >
            {hero.title}
          </motion.h1>

          <motion.p
            initial={false}
            animate="visible"
            variants={FADE_UP_VARIANTS}
            transition={SPRING}
            className="text-base md:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto mb-12"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={false}
            animate="visible"
            variants={FADE_UP_VARIANTS}
            transition={SPRING}
            className="w-full max-w-2xl mx-auto flex flex-col items-center"
          >
            <form
              className="flex flex-col sm:flex-row items-center w-full bg-white/5 border border-white/10 rounded-full p-2 focus-within:ring-2 focus-within:ring-[#3B82F6]/50 focus-within:border-[#3B82F6]/50 transition-all shadow-lg"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="hero-email" className="sr-only">{hero.emailPlaceholder}</label>
              <input
                id="hero-email"
                type="email"
                required
                placeholder={hero.emailPlaceholder}
                className="flex-1 bg-transparent border-none focus:outline-none text-white px-6 h-14 md:h-16 w-full placeholder:text-white/30 text-base font-medium"
              />
              <a
                href="http://localhost:3002/register"
                className="w-full sm:w-auto h-14 md:h-16 px-8 rounded-full bg-white text-black font-extrabold shadow-[0_0_20px_rgba(255,255,255,0.7)] hover:shadow-[0_0_40px_rgba(255,255,255,1)] hover:scale-105 transition-all duration-300 flex items-center justify-center tracking-wide shrink-0 mt-2 sm:mt-0"
              >
                {hero.ctaButton}
              </a>
            </form>

            <p className="mt-5 text-[11px] text-white/30 font-medium">
              {hero.legalSubtext}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
