"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Loader2, X, Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useDebounce } from "@/hooks/useDebounce";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Suggestion {
  domain: string;
  price: string;
  available: boolean;
  category: string;
}

interface DomainResult {
  exactMatch: {
    domain: string;
    available: boolean;
  } | null;
  suggestions: Suggestion[];
}

// ─── Sub-Component: HighlightedText ──────────────────────────────────────────
// Splits a domain string at the boundary of the typed keyword, applying
// distinct styling to the matched portion vs the TLD/prefix remainder.

interface HighlightedTextProps {
  text: string;
  highlight: string;
}

function HighlightedText({ text, highlight }: HighlightedTextProps) {
  if (!highlight) {
    return <span className="text-white font-bold">{text}</span>;
  }

  const lowerText = text.toLowerCase();
  const lowerHighlight = highlight.toLowerCase();
  const startIndex = lowerText.indexOf(lowerHighlight);

  if (startIndex === -1) {
    return <span className="text-slate-400">{text}</span>;
  }

  const before = text.slice(0, startIndex);
  const match = text.slice(startIndex, startIndex + highlight.length);
  const after = text.slice(startIndex + highlight.length);

  return (
    <span>
      {before && <span className="text-slate-500">{before}</span>}
      <span className="text-white font-black">{match}</span>
      {after && <span className="text-slate-500">{after}</span>}
    </span>
  );
}

// ─── Sub-Component: SkeletonResultsLoader ────────────────────────────────────
// High-fidelity skeleton that mirrors the exact match + 4 suggestion rows
// to eliminate layout shift (CLS = 0) while the API call is in-flight.

function SkeletonResultsLoader() {
  return (
    <div
      className="w-full mt-2 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      aria-hidden="true"
      role="status"
      aria-label="Loading domain results"
    >
      {/* Skeleton: Exact Match */}
      <div className="p-6 md:p-8 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-16 bg-white/10 rounded-full animate-pulse" />
          <div className="h-8 w-64 bg-white/10 rounded-lg animate-pulse" />
        </div>
        <div className="h-12 w-32 bg-white/10 rounded-xl animate-pulse" />
      </div>
      <div className="w-full h-px bg-white/10" />
      {/* Skeleton: Suggestion Rows */}
      <div className="p-6 md:p-8 flex flex-col gap-5">
        <div className="h-5 w-56 bg-white/10 rounded-full animate-pulse mb-1" />
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
          >
            <div
              className="h-5 bg-white/10 rounded-lg animate-pulse"
              style={{ width: `${130 + idx * 25}px` }}
            />
            <div className="flex items-center gap-4">
              <div className="h-4 w-20 bg-white/10 rounded-full animate-pulse" />
              <div className="h-10 w-20 bg-white/10 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Inner Component (requires Suspense for useSearchParams) ─────────────────

function DomainSearchHeroInner() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hydrate query state from URL on mount → enables back-button result restoration
  const [query, setQuery] = useState<string>(() => searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(query, 600);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<DomainResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  // ── URL Sync Effect (Guarded against infinite loops) ────────────────────
  useEffect(() => {
    const currentQueryFromUrl = searchParams.get("q") || "";

    // GUARD: Only call router.replace if the value actually changed in the URL.
    // Without this guard, router.replace updates searchParams → re-triggers
    // this effect → infinite loop.
    if (debouncedQuery !== currentQueryFromUrl) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedQuery) {
        params.set("q", debouncedQuery);
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedQuery, pathname, router, searchParams]);

  // ── Domain Fetch Effect (with AbortController for stale request cancellation) ──
  useEffect(() => {
    const abortController = new AbortController();

    async function checkDomain() {
      if (!debouncedQuery.trim()) {
        setResult(null);
        setSearchError(null);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const response = await fetch(
          `/api/v1/domains/check?q=${encodeURIComponent(debouncedQuery)}`,
          { signal: abortController.signal },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.error || `Server error (${response.status})`,
          );
        }

        const data = await response.json();
        setResult(data);
      } catch (error: unknown) {
        // Ignore aborted requests (user typed a new query before this one resolved)
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        console.error("Domain search failed:", message);
        setSearchError(message);
        setResult(null);
      } finally {
        if (!abortController.signal.aborted) {
          setIsSearching(false);
        }
      }
    }

    checkDomain();

    // Cleanup: abort in-flight request if debouncedQuery changes before it resolves
    return () => abortController.abort();
  }, [debouncedQuery]);

  // ── Input Validation with Shake Animation ────────────────────────────────
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const isInvalid = /[^a-zA-Z0-9\-.]/.test(rawValue);

      if (isInvalid) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 350);
        // Strip invalid chars instead of rejecting the whole string
        setQuery(rawValue.replace(/[^a-zA-Z0-9\-.]/g, ""));
      } else {
        setQuery(rawValue);
      }
    },
    [],
  );

  // ── Buy / Get Domain Micro-interaction ───────────────────────────────────
  const handleBuyClick = useCallback((domain: string) => {
    setSelectedDomain(domain);
    setTimeout(() => {
      window.location.href = "http://localhost:3002/register";
    }, 400);
  }, []);

  // Base name for keyword highlighting (strip TLD)
  const baseQuery = debouncedQuery.split(".")[0].toLowerCase();

  return (
    <section className="w-full min-h-[70vh] bg-[#050505] flex flex-col items-center justify-center pt-32 pb-24 px-6 relative overflow-hidden">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero copy */}
      <div className="max-w-4xl w-full z-10 flex flex-col items-center mb-10">
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-4 text-center">
          {t?.domainsPage?.heroTitle || "Set up shop with the perfect domain"}
        </h1>
        <p className="text-xl text-slate-400 text-center">
          {t?.domainsPage?.heroSubtitle ||
            "Register, host, and manage it from the same place you do business."}
        </p>
      </div>

      {/* ── Search Bar & Results: Single flex-col container for pixel-perfect alignment ── */}
      <div className="w-full max-w-4xl mx-auto flex flex-col relative z-20">
        {/* Search Input */}
        <div
          className={`relative flex items-center w-full bg-[#0a0a0a] rounded-2xl border border-white/10 hover:border-white/20 transition-colors shadow-2xl focus-within:border-white/40 focus-within:ring-4 focus-within:ring-[#000080]/30 overflow-hidden ${isShaking ? "animate-shake" : ""}`}
        >
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={
              t?.domainsPage?.searchPlaceholder ||
              "Search domains (e.g. yourstore.com)"
            }
            className={`w-full bg-transparent text-white text-lg md:text-2xl px-8 py-6 outline-none placeholder:text-slate-600 font-medium ${isShaking ? "text-red-400" : ""}`}
            style={{ direction: "ltr" }}
            autoComplete="off"
            spellCheck={false}
            aria-label="Search for a domain name"
            aria-invalid={isShaking}
            aria-busy={isSearching}
          />
          {isSearching && (
            <div className="absolute right-36 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
            </div>
          )}
          <button
            className="absolute right-2 top-2 bottom-2 bg-white text-black px-8 rounded-xl font-bold text-base hover:bg-slate-200 transition-transform active:scale-95 whitespace-nowrap"
            aria-label="Search domains"
          >
            {t?.domainsPage?.searchButton || "Search"}
          </button>
        </div>

        {/* Error State */}
        {searchError && !isSearching && (
          <div
            className="w-full mt-2 bg-rose-500/10 border border-rose-500/30 rounded-2xl px-6 py-4 flex items-center gap-3"
            role="alert"
            aria-live="assertive"
          >
            <X className="w-5 h-5 text-rose-400 flex-shrink-0" aria-hidden="true" />
            <p className="text-rose-300 font-medium text-sm">{searchError}</p>
          </div>
        )}

        {/* Results Container: mt-2 for a flush, flush-aligned dropdown feel */}
        {isSearching ? (
          <SkeletonResultsLoader />
        ) : (
          result && (
            <div
              className="w-full mt-2 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-300"
              role="region"
              aria-label="Domain search results"
            >
              {/* Exact Match Row */}
              {result.exactMatch && (
                <div className="p-6 md:p-8 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {t?.domainsPage?.exactMatchLabel || "Top Pick"}
                    </span>
                    <span
                      className={`text-2xl md:text-3xl font-black tracking-tight ${result.exactMatch.available ? "text-white" : "text-slate-500 line-through"}`}
                    >
                      {result.exactMatch.domain}
                    </span>
                  </div>

                  {result.exactMatch.available ? (
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-emerald-400 font-bold flex items-center gap-2">
                        <Check className="w-5 h-5" /> Available
                      </span>
                      <button
                        onClick={() =>
                          handleBuyClick(result.exactMatch!.domain)
                        }
                        className={`px-8 py-3 rounded-xl font-black text-base transition-all duration-300 flex items-center justify-center min-w-[130px] ${selectedDomain === result.exactMatch.domain ? "bg-emerald-500 text-white scale-95" : "bg-white text-black hover:bg-slate-200"}`}
                        aria-label={`Get domain ${result.exactMatch!.domain}`}
                      >
                        {selectedDomain === result.exactMatch.domain ? (
                          <Check className="w-6 h-6" aria-hidden="true" />
                        ) : (
                          t?.domainsPage?.getDomainBtn || "Get domain"
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <div className="flex items-center gap-2 text-rose-500 font-bold">
                        <X className="w-6 h-6" />
                        <span className="text-lg">
                          {t?.domainsPage?.unavailable || "Unavailable"}
                        </span>
                      </div>
                      {/* Shopify-style Transfer Link */}
                      <a
                        href="http://localhost:3002/register"
                        className="text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60"
                      >
                        {isRtl
                          ? "هل تمتلك هذا النطاق؟ قم بربطه"
                          : "Already own this? Connect it"}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Divider */}
              {result.suggestions?.length > 0 && (
                <div className="w-full h-px bg-white/10" />
              )}

              {/* Suggestions List */}
              {result.suggestions?.length > 0 && (
                <div className="p-6 md:p-8 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-6">
                    {t?.domainsPage?.suggestionsTitle ||
                      "Included with Matgarco domains"}
                  </h3>
                  <div className="flex flex-col" role="list" aria-label="Alternative domain suggestions">
                    {result.suggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        role="listitem"
                        className="flex items-center justify-between py-5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-4 -mx-4 rounded-xl transition-colors"
                      >
                        {/* Left: domain name with keyword highlighting */}
                        <span className="text-xl">
                          <HighlightedText
                            text={suggestion.domain}
                            highlight={baseQuery}
                          />
                        </span>

                        {/* Right: price + action button */}
                        <div className="flex items-center gap-6 flex-shrink-0">
                          <span className="text-slate-400 font-medium text-sm whitespace-nowrap">
                            {suggestion.price}
                          </span>
                          <button
                            onClick={() => handleBuyClick(suggestion.domain)}
                            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center min-w-[72px] ${selectedDomain === suggestion.domain ? "bg-emerald-500 text-white scale-95" : "bg-white text-black hover:bg-slate-200"}`}
                            aria-label={`Buy ${suggestion.domain} for ${suggestion.price}`}
                          >
                            {selectedDomain === suggestion.domain ? (
                              <Check className="w-5 h-5" aria-hidden="true" />
                            ) : (
                              t?.domainsPage?.buyBtn || "Buy"
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Feature chips */}
      <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-slate-500 font-medium text-sm max-w-4xl w-full">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-slate-600" />
          <span>Powerful online store</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-slate-600" />
          <span>Instant domain configuration</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-slate-600" />
          <span>No technical setup</span>
        </div>
      </div>
    </section>
  );
}

// ─── Export: Suspense boundary required by Next.js App Router for useSearchParams ──

export function DomainSearchHero() {
  return (
    <Suspense fallback={null}>
      <DomainSearchHeroInner />
    </Suspense>
  );
}
