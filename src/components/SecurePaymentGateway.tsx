/**
 * SecurePaymentGateway.tsx
 * Escrow-protected payment overlay.
 * Supports MoMo and Card payment flows.
 */

import { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface SecurePaymentGatewayProps {
  amount: number;
  buyerType: 'SMALL_SCALE' | 'LARGE_SCALE';
  onClose: () => void;
  onSuccess: () => void;
}

export default function SecurePaymentGateway({
  amount,
  buyerType,
  onClose,
  onSuccess,
}: SecurePaymentGatewayProps) {
  const [method, setMethod] = useState<'MOMO' | 'CARD'>('MOMO');
  const [step, setStep] = useState<'INIT' | 'PROCESSING' | 'SUCCESS'>('INIT');

  const handlePayment = () => {
    setStep('PROCESSING');
    setTimeout(() => {
      setStep('SUCCESS');
      setTimeout(onSuccess, 2000);
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-white z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-sidebar text-white">
        <div>
          <h2 className="text-sm font-bold tracking-tight">ELMART SECURE PAY</h2>
          <p className="text-[10px] text-slate-400">Escrow-Protected Gateway (EPG v3.1)</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        {/* Amount */}
        <div className="bg-bg p-4 rounded-lg border border-border-subtle flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase">Total Payable</p>
            <p className="text-xl font-black text-text-main">RWF {amount.toLocaleString()}</p>
          </div>
          <span className="status-pill bg-brand-success/10 text-brand-success text-[9px] font-black">
            ESCROW ACTIVE
          </span>
        </div>

        {/* INIT step */}
        {step === 'INIT' && (
          <div className="space-y-4">
            {/* Method selector */}
            <div className="flex gap-2">
              {(['MOMO', 'CARD'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`flex-1 py-3 border-2 rounded-lg transition-all flex flex-col items-center gap-1 ${
                    method === m
                      ? 'border-brand-primary bg-sky-50'
                      : 'border-slate-100 grayscale opacity-60'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">
                    {m === 'MOMO' ? 'Mobile Money' : 'Credit Card'}
                  </span>
                </button>
              ))}
            </div>

            {/* MoMo form */}
            {method === 'MOMO' && (
              <div className="space-y-3">
                <p className="text-[11px] text-text-muted">Enter your MoMo registered number.</p>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="078 XXX XXXX"
                    className="w-full bg-bg border border-border-subtle p-3 rounded-lg font-bold text-sm outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-brand-primary underline cursor-pointer">
                    Verify
                  </span>
                </div>
              </div>
            )}

            {/* Card form */}
            {method === 'CARD' && (
              <div className="space-y-3">
                <p className="text-[11px] text-text-muted">PCI-DSS Encrypted via ELMART Bank Connect.</p>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  className="w-full bg-bg border border-border-subtle p-3 rounded-lg font-medium text-sm outline-none"
                />
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full bg-bg border border-border-subtle p-3 rounded-lg font-medium text-sm outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="flex-1 bg-bg border border-border-subtle p-3 rounded-lg font-medium text-sm outline-none"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="flex-1 bg-bg border border-border-subtle p-3 rounded-lg font-medium text-sm outline-none"
                  />
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handlePayment}
                className="w-full bg-sidebar text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-colors"
              >
                Authorize Payment
              </button>
            </div>
          </div>
        )}

        {/* PROCESSING step */}
        {step === 'PROCESSING' && (
          <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center h-[300px]">
            <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="font-bold text-sm uppercase tracking-tight">
                Verifying with {method === 'MOMO' ? 'MTN Network' : 'Bank Gateway'}
              </p>
              <p className="text-[10px] text-text-muted mt-1">
                Multi-layered security handshake in progress.
              </p>
            </div>
            {method === 'MOMO' && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg animate-pulse">
                <p className="text-[10px] font-bold text-yellow-800 italic uppercase">
                  CHECK YOUR PHONE FOR PIN PROMPT
                </p>
              </div>
            )}
          </div>
        )}

        {/* SUCCESS step */}
        {step === 'SUCCESS' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center p-6 space-y-4 text-center h-full"
          >
            <div className="w-16 h-16 bg-brand-success text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-success/30">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-black text-text-main uppercase tracking-tighter italic">
                Transaction Secure
              </p>
              <p className="text-[10px] text-text-muted">
                Invoice #INV-{Math.floor(Math.random() * 100000)} generated and sent to email.
              </p>
            </div>

            {/* Receipt */}
            <div
              className={`w-full bg-white border border-border-subtle rounded-xl p-4 shadow-sm text-left scale-90 ${
                buyerType === 'LARGE_SCALE'
                  ? 'border-t-4 border-t-brand-primary'
                  : 'border-t-4 border-t-emerald-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-[8px] font-black uppercase tracking-widest text-brand-primary leading-none">
                  ELMART OFFICIAL {buyerType === 'LARGE_SCALE' ? 'TAX INVOICE' : 'RECEIPT'}
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded border flex items-center justify-center text-[6px] font-black italic">
                  ELMART STAMP
                </div>
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-[10px] font-bold text-text-main flex justify-between">
                  <span>Total:</span>
                  <span>RWF {amount.toLocaleString()}</span>
                </p>
                <p className="text-[7px] text-text-muted flex justify-between">
                  <span>Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </p>
              </div>
              <div className="flex justify-end pt-2 border-t border-slate-100 items-end gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-[5px] font-bold uppercase text-slate-300">Auth Signature</span>
                  <div className="h-4 w-12 bg-slate-50 border border-dashed rounded font-serif text-[6px] flex items-center justify-center opacity-50 italic">
                    Digital Sig
                  </div>
                </div>
                {buyerType === 'LARGE_SCALE' && (
                  <div className="flex flex-col items-center">
                    <span className="text-[5px] font-bold uppercase text-slate-300">RRA EBM V2</span>
                    <div className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center">
                      <ShieldCheck className="w-3 h-3 text-brand-primary" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}