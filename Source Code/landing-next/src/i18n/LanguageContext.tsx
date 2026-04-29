"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ar, type Translations } from "@/i18n/ar";
import { en } from "@/i18n/en";

type Lang = "ar" | "en";

interface LanguageContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  t: ar,
  toggleLang: () => {},
  isRTL: true,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [isMounted, setIsMounted] = useState(false);

  // Initialize language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("matgarco_lang") as Lang;
    if (savedLang && (savedLang === "ar" || savedLang === "en")) {
      setLang(savedLang);
    }
    setIsMounted(true);
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "ar" ? "en" : "ar";
      localStorage.setItem("matgarco_lang", next);
      return next;
    });
  }, []);

  const t = lang === "ar" ? ar : en;
  const isRTL = lang === "ar";

  // Update <html> attributes when language changes
  useEffect(() => {
    if (!isMounted) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [lang, isRTL, isMounted]);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue = React.useMemo(() => ({
    lang,
    t,
    toggleLang,
    isRTL
  }), [lang, t, toggleLang, isRTL]);

  // Prevent hydration mismatch by only rendering after mount
  if (!isMounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
