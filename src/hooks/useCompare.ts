/**
 * useCompare.ts
 * Product comparison hook — persists up to 3 product IDs to localStorage.
 * Survives page refresh.
 *
 * USAGE
 *   const { isComparing, toggleCompare, compareIds, clearCompare } = useCompare();
 */

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'elmart_compare';
const MAX_COMPARE = 3;

function loadFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.slice(0, MAX_COMPARE);
  } catch {
    // corrupted — start fresh
  }
  return [];
}

function saveToStorage(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // fail silently
  }
}

export function useCompare() {
  const [compareIds, setCompareIds] = useState<string[]>(() => loadFromStorage());

  const isComparing = useCallback(
    (productId: string) => compareIds.includes(productId),
    [compareIds]
  );

  const toggleCompare = useCallback((productId: string) => {
    setCompareIds(prev => {
      let next: string[];
      if (prev.includes(productId)) {
        next = prev.filter(id => id !== productId);
      } else {
        if (prev.length >= MAX_COMPARE) return prev; // max reached
        next = [...prev, productId];
      }
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
    saveToStorage([]);
  }, []);

  return { isComparing, toggleCompare, compareIds, clearCompare, maxReached: compareIds.length >= MAX_COMPARE };
}