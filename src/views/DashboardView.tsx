/**
 * DashboardView.tsx
 * Supplier / Admin dashboard tab view.
 */

import { motion } from 'motion/react';
import { BarChart3, ShieldCheck } from 'lucide-react';
import { UserRole, Order } from '../types';
import StatCard from '../components/StatCard';

interface DashboardViewProps {
  userRole: UserRole;
  isImpersonating: boolean;
  orders: Order[];
  demandPredictions: {
    region: string;
    item: string;
    demand: string;
    remarks: string;
    confidence: number;
  }[];
  onGoToInventory: () => void;
}

export default function DashboardView({
  userRole,
  isImpersonating,
  orders,
  demandPredictions,
  onGoToInventory,
}: DashboardViewProps) {
  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6"
    >
      {/* AI alert banner (supplier only) */}
      {userRole === 'SUPPLIER' && (
        <div className="bg-gradient-to-r from-sidebar to-sidebar/90 p-4 rounded-xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-accent/20 text-brand-accent rounded-full flex items-center justify-center animate-pulse shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-white italic">AI Market Alert: High Demand Detected</p>
              <p className="text-[10px] text-slate-400">Wholesale buyer in Kigali seeking 200kg Cement. Match: 98%.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-brand-primary text-white px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-widest hover:opacity-90">
              Respond to Lead
            </button>
            <button
              onClick={onGoToInventory}
              className="bg-white/10 text-white px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-widest border border-white/10"
            >
              View Inventory
            </button>
          </div>
        </div>
      )}

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Monthly Revenue" value="RWF 4.2M" subValue="↑ 12.4% vs last month" kind="up" isPrivate={isImpersonating} />
        <StatCard title="Account Balance" value="RWF 1.8M" subValue="MoMo Wallet" kind="neutral" isPrivate={isImpersonating} />
        <StatCard title="MoMo Success" value="98.2%" subValue="↑ Optimized Gateway" kind="up" />
        <StatCard title="Active Artisans" value="42" subValue="Gikondo District" kind="neutral" />
      </div>

      {/* AI demand predictions (supplier only) */}
      {userRole === 'SUPPLIER' && (
        <div className="panel col-span-full bg-white border-l-4 border-l-brand-primary overflow-hidden">
          <div className="panel-header bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="panel-title text-brand-primary">AI Market Prediction & Demand Intelligence</div>
            </div>
            <span className="text-[10px] font-black uppercase text-text-muted bg-slate-100 px-2 py-0.5 rounded hidden md:block">
              Rwanda Nationwide Analysis
            </span>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {demandPredictions.map((pred, i) => (
              <div key={i} className="space-y-3 p-3 rounded-xl bg-slate-50 border border-slate-100 relative hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-black uppercase text-brand-primary tracking-widest">{pred.region}</p>
                    <p className="text-sm font-black text-sidebar italic tracking-tight">{pred.item}</p>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    pred.demand === 'CRITICAL GAP'
                      ? 'bg-red-100 text-red-600 animate-pulse'
                      : pred.demand === 'EXCESSIVE'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {pred.demand}
                  </div>
                </div>
                <p className="text-[10px] text-text-muted italic bg-white p-2 rounded-lg border border-slate-100 shadow-sm leading-relaxed">
                  "{pred.remarks}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-primary" style={{ width: `${pred.confidence}%` }} />
                    </div>
                    <span className="text-[9px] font-bold text-text-muted">{pred.confidence}%</span>
                  </div>
                  <button className="text-[9px] font-black uppercase text-brand-primary hover:underline">Plan →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders table */}
      <div className="panel overflow-hidden">
        <div className="panel-header">
          <div className="panel-title">Recent Order Flow</div>
          <span className="text-[11px] text-brand-primary font-bold cursor-pointer hover:underline">View All</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-border-subtle text-text-muted">
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-tight">Order ID</th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-tight">Buyer</th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-tight hidden md:table-cell">Location</th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-tight">Payment</th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-tight text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 italic">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono font-medium text-text-main">#{order.id.toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-text-main">{order.buyerName}</span>
                      <span className={`text-[9px] font-black uppercase ${order.buyerType === 'LARGE_SCALE' ? 'text-brand-primary' : 'text-emerald-600'}`}>
                        {order.buyerType === 'LARGE_SCALE' ? 'Wholesale' : 'Retail'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted hidden md:table-cell">
                    {order.status === 'DELIVERED' ? 'Complete' : 'Kigali Hub'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`status-pill ${order.paymentMethod === 'CARD' ? 'bg-indigo-100 text-indigo-700' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-right text-text-main">
                    RWF {order.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}