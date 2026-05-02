# 👑 Matgarco Landing Page: Directory Architecture Map

**Version:** 1.0 (Strict Islands Architecture)

## 📌 The Immutable Directory Tree

This map enforces a strict separation between Server Components (RSC) and Client Components (Islands) to ensure zero SEO degradation and LCP optimization.

```text
src/
├── app/                  (Core App Router)
│   ├── features/
│   │   ├── page.tsx               (Phase 9: RSC Main Features Page)
│   │   └── loading.tsx            (Phase 9: Streaming SSR Skeletons)
│   ├── api/lead/         (Phase 8: Backend Lead capture endpoint)
│   │   └── route.ts
│   ├── globals.css       (Phase 0: Dark Authority Theme variables)
│   ├── layout.tsx        (Phase 0: Root Server Layout + HTML Dark forced)
│   └── page.tsx          (Phase 0: RSC Main Page assembling all sections)
├── store/                (Global Client State)
│   └── useUIStore.ts     (Phase 0: Zustand store for Mobile Menu/Modals)
├── i18n/                 (Localization Dictionaries)
│   ├── ar.ts
│   ├── en.ts
│   └── LanguageContext.tsx (Context Provider for Lang state)
└── components/
    ├── layout/           (Global Layout Elements)
    │   ├── Navbar.tsx    (Client Component - connects to useUIStore)
    │   └── Footer.tsx    (RSC - Pure Server Component - Phase 8)
    ├── sections/         (STRICTLY Server Components / RSC Wrappers)
    │   ├── HeroSection.tsx          (Phase 1 Wrapper)
    │   ├── TrustMarquee.tsx         (Phase 3+4 Wrapper: Galaxy + Feature Pills)
    │   ├── BentoFeaturesSection.tsx (Phase 4 Wrapper)
    │   ├── SectorShowcaseSection.tsx(Phase 5 Wrapper)
    │   ├── PricingSection.tsx       (Phase 6 Wrapper)
    │   └── SocialProofSection.tsx   (Phase 7 Wrapper for Mobile & Testimonials)
    ├── features-sections/         (RSC Wrappers)
    │   ├── FeaturesHero.tsx       (Phase 9)
    │   └── SectorDeepDive.tsx     (Phase 11)
    ├── islands/          (STRICTLY Client Components / "use client")
        ├── LangToggle.tsx           (Phase 0: Language switcher)
        ├── HeroWordFlip.tsx         (Phase 1: Dynamic text animation)
        ├── ParallaxWrapper.tsx      (Phase 2: Mouse tracking physics)
        ├── StoreMockup.tsx          (Phase 2: 3D interactive dashboard)
        ├── MarqueeEngine.tsx        (Phase 3: Card-based infinite marquee)
        ├── SectorTabs.tsx           (Phase 5: Framer motion cross-fades)
        └── TestimonialsCarousel.tsx (Phase 7: Embla Carousel engine)
    └── features-islands/          (Client Components)
        ├── InteractiveMockup.tsx  (Phase 10: JSON-driven Fake UI)
        └── FeatureDrawer.tsx      (Phase 11: Vaul integration)
```

> **⚠️ i18n ENFORCEMENT:** ALL user-visible strings MUST be sourced from `src/i18n/ar.ts` and `src/i18n/en.ts`. Hardcoded text in JSX is a CONSTITUTIONAL VIOLATION. Client Islands access strings via `useLanguage()` hook.
