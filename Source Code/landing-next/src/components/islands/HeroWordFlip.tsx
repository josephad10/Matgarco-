"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * HeroWordFlip — Animated word rotator with 0.0 CLS guarantee.
 *
 * The invisible longest-word wrapper reserves the maximum width at
 * paint time so the layout never shifts when words swap.
 */
export function HeroWordFlip() {
  const { lang } = useLanguage();

  /* ── Strict i18n isolation ── */
  const prefix = lang === "ar" ? "كن "       : "Be the next ";
  const suffix = lang === "ar" ? " القادم"   : "";
  const words  = lang === "ar"
    ? ["العلامة الرائدة", "الإمبراطورية العالمية", "الاسم الأبرز", "الحدث الأكبر"]
    : ["category creator.", "global empire.", "household name.", "big thing."];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [words.length]);

  /* CLS structural brace — the longest word holds space invisibly */
  const longestWord = [...words].sort((a, b) => b.length - a.length)[0];

  const typographyClass = lang === "ar"
    ? "leading-[1.6] tracking-normal"
    : "tracking-tighter";

  return (
    <h1
      className={`text-4xl md:text-5xl lg:text-[4.5rem] font-black text-white mb-6 drop-shadow-lg flex flex-wrap items-center gap-x-3 ${typographyClass}`}
    >
      <span>{prefix}</span>

      {/* Inline grid: invisible brace + absolutely positioned active word */}
      <span className="relative inline-grid items-center">
        <span className="invisible col-start-1 row-start-1 whitespace-nowrap">
          {longestWord}
        </span>

        <AnimatePresence mode="popLayout">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="col-start-1 row-start-1 absolute start-0 text-start w-full whitespace-nowrap text-[#3B82F6]"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>

      {/* Arabic grammatical suffix — only rendered when non-empty */}
      {suffix && <span>{suffix}</span>}
    </h1>
  );
}
