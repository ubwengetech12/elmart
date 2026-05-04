/**
 * useBreakpoint.ts
 * Returns 'mobile' | 'tablet' | 'desktop' based on window width.
 * Mobile  : < 640px
 * Tablet  : 640px – 1023px
 * Desktop : ≥ 1024px
 */

import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'desktop';
    if (window.innerWidth < 640) return 'mobile';
    if (window.innerWidth < 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth;
      if (w < 640) setBp('mobile');
      else if (w < 1024) setBp('tablet');
      else setBp('desktop');
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return bp;
}