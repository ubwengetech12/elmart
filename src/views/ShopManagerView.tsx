/**
 * ShopManagerView.tsx
 * Supplier Storefront Editor tab view.
 */

import { motion } from 'motion/react';
import { Layers, Plus } from 'lucide-react';
import { Product } from '../types';

interface ShopManagerViewProps {
  products: Product[];
  isImpersonating: boolean;
  onAddProduct: () => void;
}

export default function ShopManagerView({
  products,
  isImpersonating,
  onAddProduct,
}: ShopManagerViewProps) {
  return (
    <motion.div
      key="shop-manager"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-base md:text-lg font-bold">Supplier Storefront Editor</h2>
        <button
          onClick={onAddProduct}
          className="bg-brand-primary text-white px-3 md:px-4 py-2 rounded text-xs font-bold hover:bg-brand-primary/90 transition-all active:scale-95"
        >
          + New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Catalog table */}
        <div className="md:col-span-2 panel">
          <div className="panel-header">
            <div className="panel-title">My Digital Catalog</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-border-subtle text-text-muted">
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase">Product</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase hidden md:table-cell">Status</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase text-right">Price</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase text-right hidden sm:table-cell">Stock</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 italic">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-bold">{p.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="text-[10px] font-bold text-emerald-800">Published</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-right font-mono font-bold">
                      {(p.discountPrice || p.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-right hidden sm:table-cell">{p.stock}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        disabled={isImpersonating}
                        className={`font-black text-[9px] uppercase underline ${
                          isImpersonating
                            ? 'text-text-muted cursor-not-allowed opacity-50'
                            : 'text-brand-primary hover:text-sidebar'
                        }`}
                      >
                        {isImpersonating ? 'Restricted' : 'Studio'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Bulk Media panel */}
        <div className="panel p-5 bg-gradient-to-br from-sidebar to-sidebar/90 text-white border-none shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-brand-primary/20 text-brand-primary rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest italic">AI Bulk Media</h3>
          </div>
          <div className="border-2 border-dashed border-white/20 rounded h-20 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-all mb-4">
            <Plus className="w-5 h-5 text-slate-400 mb-1" />
            <p className="text-[9px] text-slate-400">Drop Video (Max 30s)</p>
          </div>
          <button
            disabled={isImpersonating}
            className={`w-full py-3 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${
              isImpersonating
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-brand-primary text-white hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isImpersonating ? 'Locked' : 'Generate All Promos'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}