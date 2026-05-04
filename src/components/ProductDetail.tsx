/**
 * ProductDetail.tsx
 * Full product page with image gallery, purchase options, and secure checkout overlay.
 */

import { useState } from 'react';
import { MessageCircle, ShoppingCart, X, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, UserRole } from '../types';
import SecurePaymentGateway from './SecurePaymentGateway';

interface ProductDetailProps {
  product: Product;
  userRole: UserRole;
  onBack: () => void;
  onAddToCart: () => void;
}

export default function ProductDetail({ product, userRole, onBack, onAddToCart }: ProductDetailProps) {
  const [activeImg, setActiveImg] = useState(0);
  const [purchaseType, setPurchaseType] = useState<'single' | 'bulk'>('single');
  const [quantity, setQuantity] = useState(1);
  const [showSecureOverlay, setShowSecureOverlay] = useState(false);

  const price = purchaseType === 'single'
    ? (product.discountPrice || product.price)
    : (product.bulkPrice || product.price);

  return (
    <div className="panel bg-white p-4 md:p-8 space-y-6 md:space-y-8 relative overflow-hidden">
      {showSecureOverlay && (
        <SecurePaymentGateway
          amount={price * quantity}
          buyerType={userRole === 'WHOLESALE_BUYER' ? 'LARGE_SCALE' : 'SMALL_SCALE'}
          onClose={() => setShowSecureOverlay(false)}
          onSuccess={() => { setShowSecureOverlay(false); onAddToCart(); }}
        />
      )}

      <button
        onClick={onBack}
        className="text-text-muted flex items-center gap-2 hover:text-text-main transition-colors font-bold text-xs uppercase tracking-widest"
      >
        ← Marketplace
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
        {/* Image gallery */}
        <div className="space-y-3 md:space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-slate-50 border border-slate-100 relative group">
            <img
              src={product.images[activeImg]}
              referrerPolicy="no-referrer"
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.promoVideoUrl && (
              <button
                onClick={() => alert('Launching AI Cinematic Promo (30s)...')}
                className="absolute bottom-4 right-4 bg-brand-primary text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> Play AI Promo
              </button>
            )}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded border border-slate-200">
              <p className="text-[8px] font-black uppercase text-brand-primary">ELMA-PRO CERTIFIED</p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`aspect-square rounded border-2 transition-all overflow-hidden ${
                  activeImg === i ? 'border-brand-primary' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-5 md:space-y-6">
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <span className="status-pill bg-slate-100 text-slate-600">{product.category}</span>
              {product.isArtisan && (
                <span className="status-pill bg-emerald-100 text-emerald-700">Artisan Hub</span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-main">{product.name}</h1>
            <p className="text-xs text-text-muted font-medium">
              Supplier: <span className="text-brand-primary underline">{product.supplierName}</span>
            </p>
          </div>

          <p className="text-text-muted text-xs leading-relaxed font-medium">{product.description}</p>

          <a
            href={`https://wa.me/250000000?text=Hello ELMART Supplier, I am interested in ${product.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg flex items-center justify-between group hover:bg-emerald-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 text-white p-2 rounded-full">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-tight">Direct Supplier Chat (WhatsApp)</p>
                <p className="text-[9px] opacity-70 italic">Negotiate bulk price or check stock live</p>
              </div>
            </div>
            <span className="text-xs font-bold group-hover:translate-x-1 transition-transform">→</span>
          </a>

          {/* Purchase type selector */}
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => setPurchaseType('single')}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                purchaseType === 'single' ? 'border-brand-primary bg-sky-50/30' : 'border-slate-100 grayscale opacity-60'
              }`}
            >
              <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Standard Unit</p>
              <p className="text-base md:text-lg font-bold">{(product.discountPrice || product.price).toLocaleString()} RWF</p>
            </div>
            {product.bulkPrice && (
              <div
                onClick={() => setPurchaseType('bulk')}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  purchaseType === 'bulk' ? 'border-brand-primary bg-sky-50/30' : 'border-slate-100 grayscale opacity-60'
                }`}
              >
                <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Bulk (Min {product.minBulkOrder})</p>
                <p className="text-base md:text-lg font-bold">{product.bulkPrice.toLocaleString()} RWF</p>
              </div>
            )}
          </div>

          {/* Quantity + actions */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex items-center border border-border-subtle rounded overflow-hidden h-10">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 hover:bg-slate-50 border-r border-border-subtle"
                >-</button>
                <input type="number" value={quantity} readOnly className="w-10 text-center font-bold text-xs" />
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 hover:bg-slate-50 border-l border-border-subtle"
                >+</button>
              </div>
              <button
                onClick={() => { onAddToCart(); alert('Added to cart'); }}
                className="flex-1 rounded border border-brand-primary text-brand-primary text-xs font-bold hover:bg-brand-primary hover:text-white transition-all uppercase tracking-widest"
              >
                Add to Cart
              </button>
            </div>
            <button
              onClick={() => setShowSecureOverlay(true)}
              className="momo-button w-full h-12 text-sm shadow-none uppercase tracking-widest font-extrabold"
            >
              <ShoppingCart className="w-4 h-4" /> Checkout Securely
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}