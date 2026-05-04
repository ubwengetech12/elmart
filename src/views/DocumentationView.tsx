/**
 * DocumentationView.tsx
 * Legal & Invoices tab view.
 */

import { motion } from 'motion/react';
import { FileText, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface DocumentationViewProps {
  orders: Order[];
}

export default function DocumentationView({ orders }: DocumentationViewProps) {
  return (
    <motion.div
      key="documentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6"
    >
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold">Registry of Documentation</h2>
          <p className="text-text-muted text-xs font-medium">Verified invoices, tax documents, and legal proofs.</p>
        </div>
        <button className="bg-bg border border-border-subtle px-4 py-2 rounded text-[10px] font-bold uppercase tracking-tight flex items-center gap-2">
          <FileText className="w-3 h-3" /> Export Archive
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div key={order.id} className="panel p-4 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-50 pb-3">
              <div>
                <p className="text-[10px] font-bold text-brand-primary uppercase">Order ref: {order.id}</p>
                <p className="text-sm font-bold">{order.buyerName}</p>
              </div>
              <span className={`status-pill ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {order.invoices.map((inv) => (
                <div key={inv.id} className="bg-bg border border-border-subtle p-3 rounded-lg group cursor-pointer hover:border-brand-primary transition-all">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white border border-border-subtle rounded flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase truncate">{inv.type.replace('_', ' ')}</p>
                      <p className="text-[9px] text-text-muted">{new Date(inv.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-brand-primary">VIEW PDF</span>
                    <span className="text-[9px] text-text-muted">ID: {inv.id}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order progress steps */}
            <div className="flex items-center gap-1 pt-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex-1 flex flex-col gap-1 items-center">
                  <div className={`h-1 w-full rounded-full ${order.currentStep >= s ? 'bg-brand-primary' : 'bg-slate-200'}`} />
                  <span className={`text-[8px] font-bold uppercase ${order.currentStep >= s ? 'text-brand-primary' : 'text-slate-400'}`}>
                    {['Init', 'Paid', 'Ship', 'Rcvd'][s - 1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}