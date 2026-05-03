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

## 🌟 9. PHASE 9: FEATURES INFRASTRUCTURE & HERO (RSC)

- **Focus:** Core Layout & Streaming SSR.
- **Action:** Build the `/features` page shell. Use Server Components (RSC) for zero JS bundle size. Implement `loading.tsx` to serve high-fidelity Skeleton UIs instantly. Ensure the Hero section aligns with the side-aligned authority blueprint.

## 🍱 10. PHASE 10: INTERACTIVE BENTO SHOWCASE & TIME SLICING (ISLANDS)

- **Focus:** Concurrent Rendering & Fake UI logic.
- **Action:** Implement Islands Architecture (`"use client"`) for the interactive feature tabs. As the user switches sectors (Fashion, Electronics, Food), the Fake UI Mockup must update dynamically. You MUST use `useTransition` for these filtering/swapping mechanisms to prevent Task Starvation and ensure 60fps responsiveness.

## 🗄️ 11. PHASE 11: DEEP DIVE DRAWERS & MICRO-INTERACTIONS

- **Focus:** Accessible Overlays & Event Loop Safety.
- **Action:** Integrate `Vaul` for highly performant, accessible Drawers to show extended feature details. Ensure zero Memory Leaks (proper cleanup functions) and zero Layout Thrashing inside Drawer animations.

---

# 🚦 EXECUTION COMMAND

1. Acknowledge this plan.
2. Confirm the overwriting of `@workspace /IMPLEMENTATION_PLAN.md`.

3. State: "Master Plan V5.0 Engaged. Standing by for the Master Execution Prompt to begin coding."

---

## 💎 13. PHASE 13: SAAS PRICING ENGINE (SHOPIFY/VONDERA TIER)

- **Focus:** High-conversion billing UI, strictly synchronized state, and CSS Grid Matrix.
- **Business Logic (Strictly Locked - DO NOT RECALCULATE):**
  - **Matgar Lite (Khotwa):** 250 EGP/mo | 2500 EGP/yr. (2% Commission, 100 Products, 30 AI Credits).
  - **Matgar Pro (Intilaq):** 450 EGP/mo | 4500 EGP/yr. (0% Commission, Unlimited Products, 100 AI Credits). **(Mark as Optimal/Most Popular)**.
  - **Matgar Prime (Al Qamma):** 699 EGP/mo | 6999 EGP/yr. (0% Commission, Unlimited Products, 300 AI Credits).
  - _Note:_ Feature limits remain EXACTLY the same regardless of billing cycle. All prices are VAT inclusive.
- **Sub-Phases for Execution:**
  1. **Pricing Hero & Billing Toggle:** Dynamic state toggle (Monthly/Annual) using strict Framer Motion spring physics.
  2. **Tier Cards:** 3 Glassmorphic cards with distinct OLED Navy/Gold glows based on tier hierarchy.
  3. **Deep Comparison Matrix:** A granular, sticky-header standard CSS Grid table mapping the extensive CSV feature rows.
  4. **Trust Anchors & FAQ:** Accordion FAQ ensuring "No CC Required" and "14-Day Free Trial" are highly visible.

### Phase 13 V2 — Vondera-Tier Execution Refinement

- **Refined Business Logic (Additive Clarifications):**
  - **Lite (Khotwa):** 250 EGP/mo | 2500 EGP/yr. (2% Transaction Fee, 100 Products, 30 AI Credits).
  - **Pro (Intilaq):** 450 EGP/mo | 4500 EGP/yr. (0% Fee, Unlimited Products, 100 AI Credits). **[Optimal Choice — Scale to 1.05]**.
  - **Prime (Al Qamma):** 699 EGP/mo | 6999 EGP/yr. (0% Fee, Unlimited Products, 300 AI Credits + **Rollover**).
  - _Unified Logic (Clarification):_ All prices are VAT inclusive (14%). Features are identical across billing cycles; **only the price value toggles** — feature counts never change.
- **Execution Refinements:**
  1. **Billing Toggle:** Fluid Apple-style switch with Framer Motion spring physics, Zustand-connected global state.
  2. **Tier Cards:** Navy/Gold depth glows; Pro card receives `scale(1.05)` + `shadow-[0_0_60px_rgba(59,130,246,0.4)]`.
  3. **Comparison Matrix:** Sticky column headers, CSS Grid (zero JS layout calculations), CLS target < 0.1.
  4. **Glocal Strategy:** EN displays USD equivalents, AR displays EGP. Driven strictly by `t.pricingPage.*` dictionary — never hardcoded.
