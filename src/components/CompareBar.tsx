/**
 * CompareBar.tsx
 * Sticky bottom bar that appears when 2–3 products are selected for comparison.
 * Opens a side-by-side specs modal.
 */

import { useState } from 'react';
import { X, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface CompareBarProps {
  compareIds: string[];
  products: Product[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

function SpecRow({ label, values }: { label: string; values: (string | number | undefined)[] }) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-text-muted w-28 shrink-0">
        {label}
      </td>
      {values.map((val, i) => (
        <td key={i} className="px-3 py-2.5 text-xs font-bold text-text-main text-center">
          {val ?? <span className="text-slate-300">—</span>}
        </td>
      ))}
    </tr>
  );
}

export default function CompareBar({ compareIds, products, onRemove, onClear }: CompareBarProps) {
  const [showModal, setShowModal] = useState(false);

  const selected = compareIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[];

  if (selected.length < 2) return null;

  return (
    <>
      {/* Sticky bottom bar */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-white/10 shadow-2xl px-4 py-3 flex items-center gap-3"
      >
        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {selected.map(p => (
            <div
              key={p.id}
              className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 shrink-0"
            >
              <img
                src={p.images[0]}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded object-cover"
                alt={p.name}
              />
              <span className="text-[10px] font-bold text-white max-w-[80px] truncate">{p.name}</span>
              <button
                onClick={() => onRemove(p.id)}
                className="text-slate-400 hover:text-white transition-colors ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {selected.length < 3 && (
            <div className="flex items-center justify-center w-10 h-10 border-2 border-dashed border-white/20 rounded-lg shrink-0 text-slate-500 text-[10px] font-bold">
              +1
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClear}
            className="text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Compare ({selected.length})
          </button>
        </div>
      </motion.div>

      {/* Side-by-side modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] bg-sidebar/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-slate-50">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs font-black uppercase tracking-widest">Product Comparison</span>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                {/* Product image headers */}
                <div className="grid border-b border-border-subtle"
                  style={{ gridTemplateColumns: `112px repeat(${selected.length}, 1fr)` }}
                >
                  <div className="p-3 bg-slate-50" />
                  {selected.map(p => (
                    <div key={p.id} className="p-4 flex flex-col items-center gap-2 border-l border-border-subtle">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-100">
                        <img
                          src={p.images[0]}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          alt={p.name}
                        />
                      </div>
                      <p className="text-xs font-black text-center text-text-main line-clamp-2">{p.name}</p>
                      {p.isArtisan && (
                        <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase">
                          Artisan
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Specs table */}
                <table className="w-full">
                  <tbody>
                    <SpecRow
                      label="Price"
                      values={selected.map(p => `${(p.discountPrice || p.price).toLocaleString()} RWF`)}
                    />
                    <SpecRow
                      label="Bulk Price"
                      values={selected.map(p => p.bulkPrice ? `${p.bulkPrice.toLocaleString()} RWF` : undefined)}
                    />
                    <SpecRow
                      label="Min Order"
                      values={selected.map(p => p.moq ? `${p.moq} units` : undefined)}
                    />
                    <SpecRow
                      label="Rating"
                      values={selected.map(p => `★ ${p.rating} (${p.reviewsCount})`)}
                    />
                    <SpecRow
                      label="Category"
                      values={selected.map(p => p.category)}
                    />
                    <SpecRow
                      label="Stock"
                      values={selected.map(p => p.stock > 0 ? `${p.stock} units` : 'Out of stock')}
                    />
                    <SpecRow
                      label="Supplier"
                      values={selected.map(p => p.supplierName)}
                    />
                    <SpecRow
                      label="Discount"
                      values={selected.map(p => p.discountPercentage ? `-${p.discountPercentage}%` : undefined)}
                    />
                    {selected.some(p => p.intelligence) && (
                      <SpecRow
                        label="AI Score"
                        values={selected.map(p =>
                          p.intelligence
                            ? (Object.values(p.intelligence).reduce((a, b) => a + b, 0) / 4).toFixed(1)
                            : undefined
                        )}
                      />
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border-subtle bg-slate-50 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-sidebar text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}