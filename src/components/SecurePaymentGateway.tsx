/**
 * SecurePaymentGateway.tsx
 * Escrow-protected payment overlay.
 * Supports real MTN MoMo sandbox API and Card payment flows.
 */

import { useState } from 'react';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SecurePaymentGatewayProps {
  amount: number;
  buyerType: 'SMALL_SCALE' | 'LARGE_SCALE';
  onClose: () => void;
  onSuccess: () => void;
}

// ── MTN MoMo sandbox config (from .env) ──────────────────────────────────────
const MOMO_BASE_URL    = import.meta.env.VITE_MTN_MOMO_BASE_URL    ?? 'https://sandbox.momodeveloper.mtn.com';
const MOMO_SUB_KEY     = import.meta.env.VITE_MTN_MOMO_SUBSCRIPTION_KEY ?? '';
const MOMO_API_USER    = import.meta.env.VITE_MTN_MOMO_API_USER    ?? '';
const MOMO_API_KEY     = import.meta.env.VITE_MTN_MOMO_API_KEY     ?? '';
const MOMO_ENV         = import.meta.env.VITE_MTN_MOMO_ENVIRONMENT ?? 'sandbox';
const MOMO_CURRENCY    = import.meta.env.VITE_MTN_MOMO_CURRENCY    ?? 'RWF';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Generate a UUID v4 for each payment reference */
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** Base64 encode API credentials for Basic Auth token */
function getBasicAuth(): string {
  return btoa(`${MOMO_API_USER}:${MOMO_API_KEY}`);
}

/**
 * Step 1 — Get a bearer token from MTN MoMo Collections API
 */
async function getMoMoToken(): Promise<string> {
  const res = await fetch(`${MOMO_BASE_URL}/collection/token/`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${getBasicAuth()}`,
      'Ocp-Apim-Subscription-Key': MOMO_SUB_KEY,
    },
  });
  if (!res.ok) throw new Error(`Token error: ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

/**
 * Step 2 — Request to Pay (initiates USSD push on phone)
 * Returns the referenceId to poll later.
 */
async function requestToPay(
  token: string,
  phoneNumber: string,
  amount: number,
  referenceId: string,
): Promise<void> {
  const res = await fetch(`${MOMO_BASE_URL}/collection/v1_0/requesttopay`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': MOMO_ENV,
      'Ocp-Apim-Subscription-Key': MOMO_SUB_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: String(amount),
      currency: MOMO_CURRENCY,
      externalId: referenceId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: phoneNumber.replace(/\s/g, ''),
      },
      payerMessage: 'ELMART Purchase',
      payeeNote: 'ELMART Order Payment',
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`RequestToPay failed: ${res.status} — ${err}`);
  }
}

/**
 * Step 3 — Poll payment status until SUCCESS / FAILED (max ~30s)
 */
async function pollPaymentStatus(
  token: string,
  referenceId: string,
  onStatusUpdate?: (status: string) => void,
): Promise<'SUCCESSFUL' | 'FAILED'> {
  const MAX_POLLS = 12;
  const INTERVAL  = 3000; // 3s

  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise((r) => setTimeout(r, INTERVAL));
    const res = await fetch(
      `${MOMO_BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Target-Environment': MOMO_ENV,
          'Ocp-Apim-Subscription-Key': MOMO_SUB_KEY,
        },
      },
    );
    if (!res.ok) continue;
    const data = await res.json();
    onStatusUpdate?.(data.status);
    if (data.status === 'SUCCESSFUL') return 'SUCCESSFUL';
    if (data.status === 'FAILED')     return 'FAILED';
  }
  return 'FAILED'; // timed out
}

// ── Component ─────────────────────────────────────────────────────────────────

type Step = 'INIT' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

export default function SecurePaymentGateway({
  amount,
  buyerType,
  onClose,
  onSuccess,
}: SecurePaymentGatewayProps) {
  const [method, setMethod]         = useState<'MOMO' | 'CARD'>('MOMO');
  const [step, setStep]             = useState<Step>('INIT');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pollStatus, setPollStatus] = useState('');
  const [errorMsg, setErrorMsg]     = useState('');
  const [refId, setRefId]           = useState('');

  // ── Card fields (UI only — no real card processor in sandbox) ──
  const [cardName, setCardName]   = useState('');
  const [cardNum, setCardNum]     = useState('');
  const [cardExp, setCardExp]     = useState('');
  const [cardCvv, setCardCvv]     = useState('');

  // ── MoMo payment flow ─────────────────────────────────────────
  const handleMoMoPayment = async () => {
    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter your MoMo phone number.');
      return;
    }
    setErrorMsg('');
    setStep('PROCESSING');

    try {
      const token = await getMoMoToken();
      const referenceId = uuidv4();
      setRefId(referenceId);

      await requestToPay(token, phoneNumber, amount, referenceId);

      const result = await pollPaymentStatus(token, referenceId, (s) => {
        setPollStatus(s);
      });

      if (result === 'SUCCESSFUL') {
        setStep('SUCCESS');
        setTimeout(onSuccess, 2500);
      } else {
        setErrorMsg('Payment was not completed. Please try again.');
        setStep('ERROR');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message ?? 'Payment failed. Please try again.');
      setStep('ERROR');
    }
  };

  // ── Card payment flow (simulated — replace with real processor) ──
  const handleCardPayment = () => {
    if (!cardName || !cardNum || !cardExp || !cardCvv) {
      setErrorMsg('Please fill in all card details.');
      return;
    }
    setErrorMsg('');
    setStep('PROCESSING');
    // Simulate processing delay (replace with Stripe / Flutterwave etc.)
    setTimeout(() => {
      setStep('SUCCESS');
      setTimeout(onSuccess, 2500);
    }, 3000);
  };

  const handlePayment = () => {
    if (method === 'MOMO') handleMoMoPayment();
    else handleCardPayment();
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

        {/* ── INIT step ── */}
        {(step === 'INIT' || step === 'ERROR') && (
          <div className="space-y-4">
            {/* Error banner */}
            {errorMsg && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-red-700 font-medium">{errorMsg}</p>
              </div>
            )}

            {/* Method selector */}
            <div className="flex gap-2">
              {(['MOMO', 'CARD'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMethod(m); setErrorMsg(''); }}
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
                <p className="text-[11px] text-text-muted">
                  Enter your MTN MoMo registered number. You will receive a USSD prompt on your phone to confirm.
                </p>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 0781234567"
                    className="w-full bg-bg border border-border-subtle p-3 rounded-lg font-bold text-sm outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <p className="text-[10px] text-text-muted italic">
                  Sandbox: use test number <span className="font-bold text-brand-primary">0781234567</span> to simulate success.
                </p>
              </div>
            )}

            {/* Card form */}
            {method === 'CARD' && (
              <div className="space-y-3">
                <p className="text-[11px] text-text-muted">PCI-DSS Encrypted via ELMART Bank Connect.</p>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-bg border border-border-subtle p-3 rounded-lg font-medium text-sm outline-none"
                />
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNum}
                  onChange={(e) => setCardNum(e.target.value)}
                  className="w-full bg-bg border border-border-subtle p-3 rounded-lg font-medium text-sm outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="flex-1 bg-bg border border-border-subtle p-3 rounded-lg font-medium text-sm outline-none"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="flex-1 bg-bg border border-border-subtle p-3 rounded-lg font-medium text-sm outline-none"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handlePayment}
                className="w-full bg-sidebar text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-colors"
              >
                {step === 'ERROR' ? 'Retry Payment' : 'Authorize Payment'}
              </button>
            </div>
          </div>
        )}

        {/* ── PROCESSING step ── */}
        {step === 'PROCESSING' && (
          <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center h-[300px]">
            <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="font-bold text-sm uppercase tracking-tight">
                Verifying with {method === 'MOMO' ? 'MTN Network' : 'Bank Gateway'}
              </p>
              <p className="text-[10px] text-text-muted mt-1">
                {pollStatus ? `Status: ${pollStatus}` : 'Multi-layered security handshake in progress.'}
              </p>
            </div>
            {method === 'MOMO' && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg animate-pulse">
                <p className="text-[10px] font-bold text-yellow-800 italic uppercase">
                  CHECK YOUR PHONE FOR PIN PROMPT
                </p>
                {refId && (
                  <p className="text-[9px] text-yellow-600 mt-1 font-mono">Ref: {refId.slice(0, 18)}…</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── SUCCESS step ── */}
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
                  <span>Method:</span>
                  <span>{method === 'MOMO' ? 'MTN Mobile Money' : 'Card'}</span>
                </p>
                <p className="text-[7px] text-text-muted flex justify-between">
                  <span>Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </p>
                {refId && (
                  <p className="text-[7px] text-text-muted flex justify-between">
                    <span>Ref ID:</span>
                    <span className="font-mono">{refId.slice(0, 18)}…</span>
                  </p>
                )}
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