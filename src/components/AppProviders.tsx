"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";

/* -------------------------------------------------------------------------- */
/*                                    Types                                    */
/* -------------------------------------------------------------------------- */

import { type Product } from "@/data/products";

/* -------------------------------------------------------------------------- */
/*                                 Wishlist                                    */
/* -------------------------------------------------------------------------- */

interface WishlistContextValue {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
  toggleWishlist: (product: Product | string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const addToWishlist = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items]
  );

  const getWishlistCount = useCallback(() => items.length, [items]);

  const toggleWishlist = useCallback((productOrId: Product | string) => {
    const id = typeof productOrId === 'string' ? productOrId : productOrId.id;
    setItems((prev) => {
      if (prev.some((item) => item.id === id)) {
        return prev.filter((item) => item.id !== id);
      }
      if (typeof productOrId === 'object') {
        return [...prev, productOrId];
      }
      return prev;
    });
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      getWishlistCount,
      toggleWishlist,
    }),
    [items, addToWishlist, removeFromWishlist, isInWishlist, getWishlistCount, toggleWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    return {
      items: [],
      addToWishlist: () => {},
      removeFromWishlist: () => {},
      isInWishlist: () => false,
      getWishlistCount: () => 0,
      toggleWishlist: () => {},
    };
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*                                  Compare                                    */
/* -------------------------------------------------------------------------- */

const MAX_COMPARE = 4;

interface CompareContextValue {
  items: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  getCompareCount: () => number;
  canAdd: () => boolean;
  toggleCompare: (product: Product | string) => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const addToCompare = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const isInCompare = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items]
  );

  const clearCompare = useCallback(() => setItems([]), []);

  const getCompareCount = useCallback(() => items.length, [items]);

  const canAdd = useCallback(() => items.length < MAX_COMPARE, [items]);

  const toggleCompare = useCallback((productOrId: Product | string) => {
    const id = typeof productOrId === 'string' ? productOrId : productOrId.id;
    setItems((prev) => {
      if (prev.some((item) => item.id === id)) {
        return prev.filter((item) => item.id !== id);
      }
      if (prev.length >= MAX_COMPARE) return prev;
      if (typeof productOrId === 'object') {
        return [...prev, productOrId];
      }
      return prev;
    });
  }, []);

  const value = useMemo<CompareContextValue>(
    () => ({
      items,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare,
      getCompareCount,
      canAdd,
      toggleCompare,
    }),
    [
      items,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare,
      getCompareCount,
      canAdd,
      toggleCompare,
    ]
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    return {
      items: [],
      addToCompare: () => {},
      removeFromCompare: () => {},
      isInCompare: () => false,
      clearCompare: () => {},
      getCompareCount: () => 0,
      canAdd: () => true,
      toggleCompare: () => {},
    };
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*                               Recently Viewed                               */
/* -------------------------------------------------------------------------- */

const MAX_RECENTLY_VIEWED = 10;

interface RecentlyViewedContextValue {
  items: Product[];
  addRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
  getRecentlyViewedCount: () => number;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(
  null
);

function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const addRecentlyViewed = useCallback((product: Product) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      const updated = [product, ...filtered];
      return updated.slice(0, MAX_RECENTLY_VIEWED);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => setItems([]), []);

  const getRecentlyViewedCount = useCallback(() => items.length, [items]);

  const value = useMemo<RecentlyViewedContextValue>(
    () => ({
      items,
      addRecentlyViewed,
      clearRecentlyViewed,
      getRecentlyViewedCount,
    }),
    [items, addRecentlyViewed, clearRecentlyViewed, getRecentlyViewedCount]
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed(): RecentlyViewedContextValue {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) {
    return {
      items: [],
      addRecentlyViewed: () => {},
      clearRecentlyViewed: () => {},
      getRecentlyViewedCount: () => 0,
    };
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*                                AppProviders                                 */
/* -------------------------------------------------------------------------- */

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <WishlistProvider>
      <CompareProvider>
        <RecentlyViewedProvider>{children}</RecentlyViewedProvider>
      </CompareProvider>
    </WishlistProvider>
  );
}
