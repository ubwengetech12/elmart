/**
 * InventoryView.tsx
 * Stock Intelligence tab view.
 */

import { motion } from 'motion/react';
import { Package, BarChart3 } from 'lucide-react';
import { Product } from '../types';

interface DemandLead {
  id: number;
  buyer: string;
  item: string;
  volume: string;
  match: number;
}

interface InventoryViewProps {
  products: Product[];
  stockAlertsEnabled: boolean;
  onToggleAlerts: () => void;
  demandLeads: DemandLead[];
}

export default function InventoryView({
  products,
  stockAlertsEnabled,
  onToggleAlerts,
  demandLeads,
}: InventoryViewProps) {
  return (
    <motion.div
      key="inventory"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6"
    >
      {/* Header with toggle */}
      <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-4 rounded-xl border border-border-subtle shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 text-brand-primary rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black uppercase tracking-tight text-sidebar">
              Stock Intelligence
            </h2>
            <p className="text-xs text-text-muted font-bold">AI-Powered monitoring.</p>
          </div>
        </div>
        <div
          onClick={onToggleAlerts}
          className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${
            stockAlertsEnabled ? 'bg-brand-success' : 'bg-slate-300'
          }`}
        >
          <div
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
              stockAlertsEnabled ? 'left-5.5' : 'left-0.5'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Stock table */}
        <div className="lg:col-span-2 panel p-0 overflow-hidden">
          <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-slate-50/50">
            <span className="text-xs font-black uppercase tracking-tight">Active Stock Registry</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg text-text-muted border-b border-border-subtle">
                  <th className="px-4 py-2 text-[9px] font-black uppercase">Product</th>
                  <th className="px-4 py-2 text-[9px] font-black uppercase">Stock</th>
                  <th className="px-4 py-2 text-[9px] font-black uppercase hidden md:table-cell">AI Prediction</th>
                  <th className="px-4 py-2 text-[9px] font-black uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.slice(0, 8).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-text-main">{p.name}</span>
                        <span className="text-[9px] text-text-muted uppercase">Min: {p.moq || 5}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          defaultValue={p.stock}
                          className="w-14 bg-bg border border-border-subtle p-1 rounded text-xs font-bold focus:ring-1 focus:ring-brand-primary outline-none"
                        />
                        <span
                          className={`text-[9px] font-bold hidden sm:inline ${
                            p.stock < 10 ? 'text-brand-accent animate-pulse' : 'text-emerald-500'
                          }`}
                        >
                          {p.stock < 10 ? 'LOW' : 'OK'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-[10px] font-black text-brand-primary">Out in 4 days</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-[10px] font-black uppercase text-brand-primary underline">
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead intelligence sidebar */}
        <div className="panel p-5 bg-sidebar text-white shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-brand-accent/20 text-brand-accent rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest italic">Lead Intelligence</h3>
          </div>
          <div className="space-y-3">
            {demandLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[10px] font-black uppercase text-brand-accent">{lead.match}% Match</span>
                  <span className="text-[8px] bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded uppercase">NEW</span>
                </div>
                <p className="text-[11px] font-extrabold text-white">{lead.buyer}</p>
                <p className="text-[9px] text-slate-400">{lead.volume} of {lead.item}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-brand-accent text-sidebar py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
            Apply for Partnership
          </button>
        </div>
      </div>
    </motion.div>
  );
}