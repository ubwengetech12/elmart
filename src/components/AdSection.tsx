/**
 * AdSection.tsx
 * Auto-rotating advertisement banner.
 * Reads ads from useAdminStore so admin changes reflect instantly.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdminStore } from '../admin/useAdminStore';

export default function AdSection() {
  const { state } = useAdminStore();
  const advertisements = state.ads;

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (advertisements.length === 0) return;
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % advertisements.length),
      5000
    );
    return () => clearInterval(timer);
  }, [advertisements.length]);

  if (advertisements.length === 0) return null;

  const ad = advertisements[current];

  return (
    <div className="relative rounded-xl overflow-hidden shadow-md border border-border-subtle h-28 sm:h-32 md:h-40 bg-sidebar">
      <AnimatePresence mode="wait">
        <motion.div
          key={ad.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <img
            src={ad.imageUrl}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
            alt={ad.title}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sidebar via-sidebar/40 to-transparent p-4 md:p-8 flex flex-col justify-center">
            <div className="max-w-md space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-accent bg-white/10 px-2 py-0.5 rounded w-fit inline-block mb-1">
                SPONSORED · {ad.companyName}
              </span>
              <h3 className="text-lg md:text-2xl font-black text-white italic tracking-tighter leading-tight">
                {ad.title}
              </h3>
              <p className="text-[10px] md:text-xs text-slate-300 line-clamp-1 hidden sm:block">
                {ad.description}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {advertisements.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              current === i ? 'bg-brand-accent w-4' : 'bg-white/30 w-1.5'
            }`}
          />
        ))}
      </div>
    </div>
  );
}