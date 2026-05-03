import { create } from 'zustand';

/**
 * UIState — Global client-side UI state store (Zustand).
 *
 * Pillar 3: Isolated Business Logic — all UI state mutations live here,
 * never scattered across component useState calls.
 */
interface UIState {
  // Mobile navigation
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;

  // Phase 13: Pricing billing cycle — single source of truth for all pricing islands.
  // A discriminated union prevents invalid cycle values at compile time.
  billingCycle: "monthly" | "annual";
  setBillingCycle: (cycle: "monthly" | "annual") => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Mobile navigation — defaults to closed
  isMobileMenuOpen: false,
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),

  // Billing cycle — defaults to monthly (lower commitment, higher conversion entry point)
  billingCycle: "monthly",
  setBillingCycle: (cycle) => set({ billingCycle: cycle }),
}));
