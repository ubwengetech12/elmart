/**
 * PaymentsView.tsx
 * Payments tab — transaction history, MoMo wallet, escrow status, payout requests.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck, Clock, CheckCircle, AlertCircle,
  ArrowDownLeft, ArrowUpRight, Wallet, RefreshCw,
} from 'lucide-react';
import { Order } from '../types';

interface PaymentsViewProps {
  orders: Order[];
  isImpersonating: boolean;
}

// ── Mock wallet data ───────────────────────────────────────────────────────────
const WALLET = {
  balance:    1_820_000,
  escrow:       480_000,
  pending:      125_000,
  currency:   'RWF',
};

// ── Mock transactions ─────────────────────────────────────────────────────────
const TRANSACTIONS = [
  { id: 'TXN-9041', type: 'IN',  method: 'MOMO', amount: 520_000, label: 'Payment from Kigali Fresh Market',    status: 'SUCCESS',  date: '2025-07-14 09:12' },
  { id: 'TXN-9038', type: 'OUT', method: 'MOMO', amount: 125_000, label: 'Payout to supplier — Cimerwa PLC',   status: 'SUCCESS',  date: '2025-07-13 16:40' },
  { id: 'TXN-9035', type: 'IN',  method: 'CARD', amount: 340_000, label: 'Wholesale order — Hotel Mille Collines', status: 'SUCCESS', date: '2025-07-12 11:05' },
  { id: 'TXN-9030', type: 'IN',  method: 'MOMO', amount: 98_000,  label: 'Retail sale — Nyarugenge Shop',      status: 'PENDING',  date: '2025-07-12 08:30' },
  { id: 'TXN-9021', type: 'OUT', method: 'MOMO', amount: 60_000,  label: 'Logistics — Mobiride Freight',       status: 'SUCCESS',  date: '2025-07-11 14:20' },
  { id: 'TXN-9018', type: 'IN',  method: 'MOMO', amount: 210_000, label: 'Bulk order — Musanze Agri Co.',      status: 'FAILED',   date: '2025-07-10 17:55' },
];

// ── Escrow items ──────────────────────────────────────────────────────────────
const ESCROW_ITEMS = [
  { id: 'ESC-441', buyer: 'Kigali Fresh Market',    amount: 320_000, product: 'Inyange Milk (200L)',       releaseDate: 'On delivery · ETA Jul 15', status: 'HELD' },
  { id: 'ESC-438', buyer: 'Hotel des Mille Collines', amount: 160_000, product: 'Traditional Agaseke (50)', releaseDate: 'On delivery · ETA Jul 16', status: 'HELD' },
];

// ── Status styles ─────────────────────────────────────────────────────────────
const txnStatus: Record<string, { color: string; icon: any }> = {
  SUCCESS: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  PENDING: { color: 'bg-yellow-100 text-yellow-700',   icon: Clock },
  FAILED:  { color: 'bg-red-100 text-red-600',         icon: AlertCircle },
};

export default function PaymentsView({ orders, isImpersonating }: PaymentsViewProps) {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutPhone, setPayoutPhone] = useState('');
  const [payoutStep, setPayoutStep] = useState<'FORM' | 'SUCCESS'>('FORM');

  const filtered = TRANSACTIONS.filter(t =>
    activeFilter === 'ALL' ? true : t.type === activeFilter
  );

  const handlePayout = () => {
    if (!payoutAmount || !payoutPhone) return;
    setPayoutStep('SUCCESS');
  };

  return (
    <motion.div
      key="payments"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6"
    >
      {/* ── Wallet cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {/* Main balance */}
        <div className="sm:col-span-1 bg-sidebar text-white rounded-xl p-5 relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-4 h-4 text-brand-accent" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">MoMo Wallet</p>
            </div>
            {isImpersonating ? (
              <p className="text-2xl font-black blur-sm select-none">RWF ••••••</p>
            ) : (
              <p className="text-2xl md:text-3xl font-black text-white">
                RWF {WALLET.balance.toLocaleString()}
              </p>
            )}
            <p className="text-[10px] text-slate-400 mt-1">Available balance</p>
          </div>
          <button
            disabled={isImpersonating}
            onClick={() => !isImpersonating && setShowPayoutModal(true)}
            className={`mt-4 w-full py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${
              isImpersonating
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-brand-accent text-sidebar hover:opacity-90'
            }`}
          >
            Request Payout
          </button>
        </div>

        {/* Escrow held */}
        <div className="bg-white rounded-xl p-5 border border-border-subtle shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-brand-primary" />
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">In Escrow</p>
            </div>
            {isImpersonating ? (
              <p className="text-2xl font-black blur-sm select-none text-text-main">RWF ••••••</p>
            ) : (
              <p className="text-2xl font-black text-text-main">
                RWF {WALLET.escrow.toLocaleString()}
              </p>
            )}
            <p className="text-[10px] text-text-muted mt-1">Released on delivery confirmation</p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
            <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-brand-primary uppercase">{ESCROW_ITEMS.length} active holds</span>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl p-5 border border-border-subtle shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Pending</p>
            </div>
            {isImpersonating ? (
              <p className="text-2xl font-black blur-sm select-none text-text-main">RWF ••••••</p>
            ) : (
              <p className="text-2xl font-black text-text-main">
                RWF {WALLET.pending.toLocaleString()}
              </p>
            )}
            <p className="text-[10px] text-text-muted mt-1">Awaiting confirmation</p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
            <RefreshCw className="w-3 h-3 text-yellow-600 animate-spin" />
            <span className="text-[9px] font-bold text-yellow-700 uppercase">Processing…</span>
          </div>
        </div>
      </div>

      {/* ── Escrow items ── */}
      <div className="panel p-0 overflow-hidden">
        <div className="p-4 border-b border-border-subtle bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-primary" />
            <span className="text-xs font-black uppercase tracking-tight">Escrow Protection Active</span>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded uppercase">
            EPG v3.1
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {ESCROW_ITEMS.map((item) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold text-brand-primary uppercase">{item.id}</p>
                <p className="text-xs font-black text-text-main">{item.product}</p>
                <p className="text-[10px] text-text-muted">Buyer: {item.buyer}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  {isImpersonating ? (
                    <p className="text-sm font-black blur-sm select-none">RWF ••••••</p>
                  ) : (
                    <p className="text-sm font-black text-text-main">RWF {item.amount.toLocaleString()}</p>
                  )}
                  <p className="text-[9px] text-text-muted italic">{item.releaseDate}</p>
                </div>
                <span className="status-pill bg-blue-100 text-blue-700">HELD</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Transaction history ── */}
      <div className="panel p-0 overflow-hidden">
        <div className="p-4 border-b border-border-subtle bg-slate-50/50 flex flex-wrap justify-between items-center gap-3">
          <span className="text-xs font-black uppercase tracking-tight">Transaction History</span>
          <div className="flex gap-1">
            {(['ALL', 'IN', 'OUT'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded text-[9px] font-black uppercase transition-all ${
                  activeFilter === f
                    ? 'bg-brand-primary text-white'
                    : 'bg-bg text-text-muted hover:bg-slate-100'
                }`}
              >
                {f === 'ALL' ? 'All' : f === 'IN' ? '↓ Received' : '↑ Sent'}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.map((txn) => {
            const cfg = txnStatus[txn.status];
            const Icon = cfg.icon;
            return (
              <div key={txn.id} className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${txn.type === 'IN' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                    {txn.type === 'IN'
                      ? <ArrowDownLeft className="w-4 h-4" />
                      : <ArrowUpRight className="w-4 h-4" />
                    }
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-text-main leading-tight">{txn.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-mono text-text-muted">{txn.id}</span>
                      <span className="text-[9px] text-text-muted">·</span>
                      <span className="text-[9px] text-text-muted">{txn.date}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${txn.method === 'MOMO' ? 'bg-yellow-100 text-yellow-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {txn.method}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {isImpersonating ? (
                    <span className="text-sm font-black blur-sm select-none">RWF ••••</span>
                  ) : (
                    <span className={`text-sm font-black ${txn.type === 'IN' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {txn.type === 'IN' ? '+' : '-'} RWF {txn.amount.toLocaleString()}
                    </span>
                  )}
                  <span className={`status-pill ${cfg.color} hidden sm:inline-flex items-center gap-1`}>
                    <Icon className="w-2.5 h-2.5" />
                    {txn.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Payout modal ── */}
      <AnimatePresence>
        {showPayoutModal && (
          <div className="fixed inset-0 bg-sidebar/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5"
            >
              {payoutStep === 'FORM' ? (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-sidebar">Request Payout</h3>
                      <p className="text-[10px] text-text-muted">Funds sent via MTN MoMo within 24hrs</p>
                    </div>
                    <button onClick={() => { setShowPayoutModal(false); setPayoutStep('FORM'); }} className="p-1.5 hover:bg-slate-100 rounded-full">
                      ×
                    </button>
                  </div>

                  <div className="bg-bg border border-border-subtle rounded-lg p-3">
                    <p className="text-[9px] font-black uppercase text-text-muted">Available Balance</p>
                    <p className="text-xl font-black text-text-main">RWF {WALLET.balance.toLocaleString()}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Amount (RWF)</label>
                      <input
                        type="number"
                        value={payoutAmount}
                        onChange={e => setPayoutAmount(e.target.value)}
                        placeholder="e.g. 500000"
                        className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-sm font-bold outline-none focus:ring-1 focus:ring-brand-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary">MoMo Phone Number</label>
                      <input
                        type="tel"
                        value={payoutPhone}
                        onChange={e => setPayoutPhone(e.target.value)}
                        placeholder="e.g. 0781234567"
                        className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-sm font-bold outline-none focus:ring-1 focus:ring-brand-primary"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePayout}
                    className="w-full bg-sidebar text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-primary transition-all"
                  >
                    Confirm Payout
                  </button>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center space-y-4 py-4"
                >
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-lg font-black uppercase text-text-main">Payout Requested</p>
                    <p className="text-[10px] text-text-muted mt-1">
                      RWF {Number(payoutAmount).toLocaleString()} will be sent to {payoutPhone} within 24hrs.
                    </p>
                  </div>
                  <button
                    onClick={() => { setShowPayoutModal(false); setPayoutStep('FORM'); setPayoutAmount(''); setPayoutPhone(''); }}
                    className="w-full bg-bg border border-border-subtle py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}