/**
 * useWishlist.ts
 * Wishlist hook — persists product IDs to localStorage.
 * Survives page refresh.
 *
 * USAGE
 *   const { isWishlisted, toggleWishlist, wishlistIds } = useWishlist();
 */

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'elmart_wishlist';

function loadFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set<string>(parsed);
  } catch {
    // corrupted storage — start fresh
  }
  return new Set();
}

function saveToStorage(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // storage full or unavailable — fail silently
  }
}

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => loadFromStorage());

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.has(productId),
    [wishlistIds]
  );

  const toggleWishlist = useCallback((productId: string) => {
    setWishlistIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      saveToStorage(next);
      return next;
    });
  }, []);

  return { isWishlisted, toggleWishlist, wishlistIds };
}