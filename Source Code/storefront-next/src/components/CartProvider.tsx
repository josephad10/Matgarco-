'use client';

import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD';    item: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE'; productId: string; variant?: string }
  | { type: 'UPDATE'; productId: string; quantity: number; variant?: string }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: CartItem[] };

// ─── Reducer ───────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.items };
    case 'ADD': {
      const key = action.item.productId + (action.item.variant || '');
      const exists = state.items.find(
        (i) => i.productId + (i.variant || '') === key
      );
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.productId + (i.variant || '') === key
              ? { ...i, quantity: i.quantity + (action.item.quantity ?? 1) }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: action.item.quantity ?? 1 }] };
    }
    case 'REMOVE':
      return {
        items: state.items.filter(
          (i) => !(i.productId === action.productId && (i.variant || '') === (action.variant || ''))
        ),
      };
    case 'UPDATE':
      return {
        items: action.quantity <= 0
          ? state.items.filter(
              (i) => !(i.productId === action.productId && (i.variant || '') === (action.variant || ''))
            )
          : state.items.map((i) =>
              i.productId === action.productId && (i.variant || '') === (action.variant || '')
                ? { ...i, quantity: action.quantity }
                : i
            ),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

const CART_KEY = 'matgarco_cart';

// ─── Context ───────────────────────────────────────────────────────────────────
const CartContext = createContext<{
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQty: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];
        if (Array.isArray(parsed)) {
          dispatch({ type: 'HYDRATE', items: parsed });
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    } catch { /* ignore */ }
  }, [state.items]);

  const addItem    = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => dispatch({ type: 'ADD', item }), []);
  const removeItem = useCallback((productId: string, variant?: string) => dispatch({ type: 'REMOVE', productId, variant }), []);
  const updateQty  = useCallback((productId: string, quantity: number, variant?: string) => dispatch({ type: 'UPDATE', productId, quantity, variant }), []);
  const clearCart  = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
