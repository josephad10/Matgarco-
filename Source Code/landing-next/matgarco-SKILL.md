# ROLE: Principal UI/UX Architect & Design System Lead

# MISSION: UPGRADE THE SKILL BLUEPRINT TO V7.0 (THE VISUAL MASTERPIECE) 🔴

# CONTEXT: We are finalizing the absolute visual truth for Matgarco. This version patches typography scaling, 8pt grid systems, and advanced glassmorphism to achieve Apple/Shopify level aesthetics.

### 🛠️ EXECUTION TASK:

Overwrite the contents of `@workspace /matgarco-landing-SKILL.md` with the exact markdown text provided below.

---

name: matgarco-landing-master-skill
description: The Supreme Dark-Authority Blueprint V7.0. Fusing Vondera's side-aligned layout with Shopify's physics, fluid typography, and advanced glassmorphism.
version: 7.0.0

---

# 👑 Matgarco Landing Master Blueprint: The Visual Masterpiece

## 🎨 1. THE SUPREME UNIFIED PALETTE (Strictly Dark Mode)

Matgarco operates EXCLUSIVELY in the Dark/Navy spectrum.

- **The Void (Base):** `#050505` (Deep Black).
- **The Core (Navy):** `#000080` (Royal Blue Navy). Used for key backgrounds, deep glows, and primary CTAs.
- **The Beacon (White):** `#FFFFFF`. Used for H1 headings, SVG Logos, and primary icons.
- **The Atmosphere (Text):** `#F8FAFC` at `opacity-70` to `opacity-90` for body text.
- **The Energy (Accents):** `#3B82F6` (Electric Blue). Used for hover states, star twinkles, and strict `focus-visible:ring-2` for a11y.

## 📐 2. TYPOGRAPHY & SPACING PHYSICS

- **RTL vs LTR Font Physics:**
  - **English (LTR):** Use strict negative tracking for massive headings (`tracking-tighter`) and tight line-height (`leading-[1.1]`).
  - **Arabic (RTL):** Use normal tracking (`tracking-normal`) and relaxed line-height (`leading-relaxed` or `leading-[1.6]`) to accommodate Arabic diacritics (Tashkeel).
- **The 8pt Grid System:** Absolutely NO random spacing. Use strict Tailwind spacing scales (e.g., `gap-4`, `gap-8`, `py-16`, `py-24`, `mt-12`).
- **Fluid Scaling:** Avoid hardcoded pixel fonts for Hero headings. Utilize Tailwind's fluid responsive classes (e.g., `text-4xl md:text-6xl lg:text-[5rem]`).

## 🧱 3. ARCHITECTURE: SIDE-ALIGNED AUTHORITY

The Hero section is inspired by Vondera/Shopify.

- **Start Side (Content):** Typography, Dynamic Flip-Words, and CTAs strictly aligned to `start` (`text-start`, `items-start`).
- **End Side (Visuals):** The 3D Interactive Storefront Builder mockup.
- **Directional CSS:** 100% Logical Properties (`ms-`, `pe-`, `inset-inline-start`). ZERO physical directions (`ml`, `pr`, `left`).

## 🌌 4. THE COSMIC BACKGROUND ENGINE & LCP

- **Layer 1 (Nebula Image):** Abstract cloud/nebula texture at `opacity-15`. MUST use `<Image priority formats={['image/avif', 'image/webp']} />` to guarantee LCP < 2.5s.
- **Layer 2 (Star System):** 3-layered hardware-accelerated CSS radial gradients (1px, 2px, 3.5px). 15% of stars must `twinkle` using `opacity` animations only.
- **Layer 3 (Spatial Depth):** `#000080` Mesh Gradients acting as background lights (`mix-blend-screen`, `blur-[150px]`).

## 🪄 5. ADVANCED MATERIAL & MICRO-INTERACTIONS

- **Premium Glassmorphism:** Never just use `backdrop-blur`. Always pair it with a semi-transparent border and an inner shadow: `bg-surface/50 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`.
- **Framer Motion Springs:** Eradicate generic `ease` transitions. Use Spring Physics: `{ type: "spring", stiffness: 300, damping: 30 }` for all interactive element entrances.
- **The "No-Jitter" Flip:** Dynamic changing text MUST be wrapped in a "Stable Dimension Wrapper" (Invisible Longest Word) to ensure ZERO Layout Thrashing (CLS = 0.0).
- **Fake UI & Mockups:** Guidelines for rendering complex "Fake UIs" (Dashboards/Storefronts) using Real JSON Data Components instead of heavy SVGs, utilizing Framer Motion for `LayoutId` cross-fades and smooth state transitions.
- **Active States:** Enforce strict visual hierarchies for interactive elements (e.g., active tabs receive a `#3B82F6` border glow and elevated glassmorphism, inactive tabs remain muted at `opacity-70`).

## 🌐 6. i18n & ACCESSIBILITY (a11y)

- **Zero Hardcoded Text:** Map EVERYTHING to `ar.ts` and `en.ts`.
- **WCAG 2.1 AA:** Ensure mathematical contrast ratios. Provide `aria-label` for all icon-only buttons. Ensure keyboard focus does not get trapped.

---

# 🚦 EXECUTION COMMAND

1. Analyze this V7.0 blueprint and confirm your understanding of the RTL/LTR typography differences and the 8pt grid.
2. Confirm overwriting of `@workspace /matgarco-landing-SKILL.md`.
3. State: "Visual Masterpiece SKILL V7.0 Engaged. Ready for final Implementation Plan update."

---

## 🏦 7. SAAS BILLING & CONVERSION ARCHITECTURE

- **SaaS Billing Architecture:** Capable of engineering complex Pricing Matrices, Toggle-based Price Injectors, and Vondera-grade comparative UI.
- **Card Hierarchy Aesthetics:** Master of scaling and glowing elements to drive conversion (e.g., scaling the "Pro" card by `1.05`, adding a radiant `#3B82F6` inner shadow, and rendering standard tiers with muted `border-white/10`).
- **SaaS Billing Engineering (V2):** Expert in complex Pricing Matrices, Zustand-connected Toggle-based Price Injectors, and conversion-optimized Card Hierarchies with tier-aware visual differentiation.
- **Atmospheric Depth:** Skilled in applying OLED Navy glows (`shadow-[0_0_60px_rgba(0,0,128,0.4)]`) and `backdrop-blur-2xl` to ensure pricing cards "float" within the dark cosmic void — creating a premium sense of depth without borders.
