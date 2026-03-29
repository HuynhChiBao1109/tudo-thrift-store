"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { CartItem, Product } from "@/types";
import { cartApi } from "@/lib/api";

const CART_STORAGE_KEY = "tudo_cart";

/** Returns true when an admin/user token is available in localStorage. */
const getToken = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("admin_token") || "";
};

/** Load raw items from localStorage, fall back to []. */
const loadFromStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

/** Persist items to localStorage. */
const saveToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore write errors */
  }
};

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on the client
  useEffect(() => {
    setItems(loadFromStorage());
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever items change (after first hydration)
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(items);
  }, [items, hydrated]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      const next = existing
        ? prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { product, quantity: 1 }];

      // If logged in → also sync to server (fire-and-forget)
      if (getToken()) {
        cartApi.addItem(product.id, existing ? existing.quantity + 1 : 1).catch(() => {
          /* server unavailable – localStorage is source of truth */
        });
      }

      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.product.id !== productId);
      if (getToken()) {
        cartApi.removeItem(productId).catch(() => {});
      }
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      let next: CartItem[];
      if (quantity <= 0) {
        next = prev.filter((i) => i.product.id !== productId);
      } else {
        next = prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
      }
      if (getToken()) {
        if (quantity <= 0) {
          cartApi.removeItem(productId).catch(() => {});
        } else {
          cartApi.addItem(productId, quantity).catch(() => {});
        }
      }
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    if (getToken()) {
      cartApi.clear().catch(() => {});
    }
  }, []);

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
