"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // variantId
  productId: string;
  name: string;
  flavor: string;
  weight: string;
  packSize: string;
  price: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== variantId),
        }));
      },
      updateQuantity: (variantId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === variantId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce(
          (sum, item) => sum + parseFloat(item.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
