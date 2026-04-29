# ROLE: Principal Enterprise Architect & Engineering Manager

# MISSION: UPGRADE THE IMPLEMENTATION PLAN TO V5.0 (THE MASTER BLUEPRINT) 🔴

# CONTEXT: We have locked the AI Constitution V9.0 and SKILL V7.0. Now, the Implementation Plan must be updated with exact file paths, strict boundaries, and technical precision to guide the actual coding phases.

### 🛠️ EXECUTION TASK:

Overwrite the contents of `@workspace /IMPLEMENTATION_PLAN.md` with the exact markdown text provided below.

---

# 👑 Matgarco Landing Page: Master Implementation Plan (V5.0)

## 🎯 THE MISSION

Deploy a world-class, side-aligned B2B2C SaaS Landing Page mirroring Shopify/Vondera. Strict adherence to Constitution V9.0 (No Vibe Coding, O(n) diffing, Idempotency) and SKILL V7.0 (Dark/Navy only, Spring Physics, 8pt Grid).

## 🗂️ 0. THE ARCHITECTURAL BASELINE (PRE-FLIGHT)

- **Files:** `src/app/layout.tsx`, `src/app/globals.css`, `src/store/useUIStore.ts`
- **Actions:** - Purge `next-themes` and force `.dark` class.
  - Apply 100% Logical CSS (`ms-`, `pe-`).
  - Set up `Zustand` for client-state (e.g., Modals, Mobile Menu) to prevent React Context re-renders.

> **⚠️ CRITICAL i18n ENFORCEMENT (ALL PHASES):** Every user-visible string MUST be sourced from `src/i18n/ar.ts` and `src/i18n/en.ts` via the `useLanguage()` hook (Client Components) or Server-side cookie reading (RSCs). **Hardcoded English text in JSX is a CONSTITUTIONAL VIOLATION.** RSC wrappers must pass `t.*` dictionary props to Client Islands when needed.

## 🚀 1. PHASE 1: BRAND AUTHORITY (NAVBAR & HERO)

- **Files:** `src/components/layout/Navbar.tsx`, `src/components/sections/HeroSection.tsx`, `src/components/islands/HeroWordFlip.tsx`
- **Actions:**
  - **Navbar:** Apply advanced glassmorphism (Navy #000080, `backdrop-blur-xl`, inner white shadow).
  - **Hero Layout:** Side-aligned (Start-aligned text, End-aligned empty space for 3D).
  - **No-Jitter Flip:** Use the "Invisible Reference Word" technique in `HeroWordFlip.tsx`. Animate only `translateY` and `opacity`.
  - **Cosmic Engine:** Inject optimized `<Image priority />` Nebula background + 3-layer twinkling CSS stars.

## 🎮 2. PHASE 2: 3D STOREFRONT BUILDER (INTERACTIVE)

- **Files:** `src/components/islands/ParallaxWrapper.tsx`, `src/components/islands/StoreMockup.tsx`
- **Actions:**
  - Build a glassmorphic mock window (Sidebar + Skeletal Grid).
  - Add floating absolute widgets ("Conversion +8.5%" card).
  - **Physics:** Bind mouse movement to `rotateX` and `rotateY` via `requestAnimationFrame`. Ensure event cleanup on unmount.

## 🤝 3. PHASE 3 + 4: COSMIC GALAXY (TRUST MARQUEE + FEATURE PILLS)

- **Files:** `src/components/sections/TrustMarquee.tsx` (RSC), `src/components/islands/MarqueeEngine.tsx` (Client)
- **i18n Keys:** `t.galaxy.partnerBadge`, `t.galaxy.partnerTitle`, `t.galaxy.featuresTitle1`, `t.galaxy.featuresTitle2`, `t.galaxy.featuresSubtitle`, `t.galaxy.featurePills[]`
- **Actions:**
  - Void Black (#000000) cosmic background with 4-layer CSS star field.
  - Card-based typographical marquee using CSS `translate3d(-50%)` infinite loop. 12 partner wordmarks with Brand-Color Hover Physics.
  - Glassmorphic Feature Pills with `lucide-react` icons.

## 🍱 4. PHASE 4: ASYMMETRICAL BENTO GRID

- **Files:** `src/components/sections/EdgeBentoSection.tsx`, `src/components/ui/BentoCard.tsx`
- **Actions:**
  - Map real documentation features: Subdomain Routing, AI-Powered Auto-Gen, 10-Minute Velocity. Use CSS Grid for the asymmetrical layout.

## 🏢 5. PHASE 5: MULTI-SECTOR SHOWCASE

- **Files:** `src/components/sections/SectorShowcaseSection.tsx` (RSC), `src/components/islands/SectorTabs.tsx` (Client)
- **i18n Keys:** `t.sectors.badge`, `t.sectors.title1`, `t.sectors.title2`, `t.sectors.subtitle`, `t.sectors.tabs[].title`, `t.sectors.tabs[].desc`, `t.sectors.tabs[].features[]`, `t.sectors.tabs[].cta`
- **Actions:**
  - Interactive tabs (Retail, Wholesale, Services) using `AnimatePresence mode="wait"` for zero-CLS cross-fades.
  - Apple-grade sliding tab indicator via `layoutId`. Spring physics `{ stiffness: 300, damping: 30 }`.
  - Glassmorphic image container. RTL-ready logical CSS. `min-h-[520px]` content canvas.

## 💳 6. PHASE 6: ENGINEERING AUTHORITY

- **Files:** `src/components/sections/EngineeringAuthoritySection.tsx` (RSC), `src/components/islands/CommandShipVisual.tsx` (Client)
- **i18n Keys:** `t.engineering.title`, `t.engineering.subtitle`, `t.engineering.card1.*`, `t.engineering.card2.*`
- **Actions:**
  - Asymmetrical SWE Bento Grid. Zero-compromise performance layout.
  - Bento cards use `#000080/20` backgrounds, `backdrop-blur-xl`, and `border-white/10`.
  - Floating `command-ship.png` animated via Framer Motion spring physics.

## 📱 7. PHASE 7: MOBILE & SOCIAL PROOF

- **Files:** `src/components/sections/MobileReadiness.tsx`, `src/components/sections/Testimonials.tsx`
- **Actions:**
  - Floating PWA mobile frames. Efficiently cached testimonial carousel (Embla Carousel) to prevent Main Thread blocking.

## ⚓ 8. PHASE 8: SUPREME FOOTER & GATEWAY API

- **Files:** `src/components/layout/Footer.tsx`, `src/app/api/lead/route.ts`
- **Actions:**
  - **Footer:** 4-column semantic grid. 1px gradient top border.
  - **API Contract:** Build the lead capture endpoint enforcing `Zod` validation and `Idempotency-Key` via Upstash/Redis.

---

# 🚦 EXECUTION COMMAND

1. Acknowledge this plan.
2. Confirm the overwriting of `@workspace /IMPLEMENTATION_PLAN.md`.
3. State: "Master Plan V5.0 Engaged. Standing by for the Master Execution Prompt to begin coding."
