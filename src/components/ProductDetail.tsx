/**
 * ProductDetail.tsx
 * Full product page with image gallery, purchase options, secure checkout overlay,
 * wishlist toggle, customer reviews/ratings, and related products section.
 */

import { useState } from 'react';
import { MessageCircle, ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, UserRole, Review } from '../types';
import SecurePaymentGateway from './SecurePaymentGateway';
import { useWishlist } from '../hooks/useWishlist';

// ── Sandbox mock reviews ──────────────────────────────────────────────────────
const MOCK_REVIEWS: Review[] = [
  { id: 'r1', productId: 'any', userId: 'u1', userName: 'Uwimana Claire',  rating: 5, comment: 'Excellent quality! Delivered fast and exactly as described. Will order again.',          date: '2025-04-10' },
  { id: 'r2', productId: 'any', userId: 'u2', userName: 'Habimana Eric',   rating: 4, comment: 'Good product, packaging could be better but the item itself is great value for money.', date: '2025-03-28' },
  { id: 'r3', productId: 'any', userId: 'u3', userName: 'Mukamana Diane',  rating: 5, comment: 'Bought bulk for my shop in Nyarugenge. Customers love it. Highly recommend.',           date: '2025-03-15' },
  { id: 'r4', productId: 'any', userId: 'u4', userName: 'Nzeyimana Paul',  rating: 3, comment: 'Decent quality but arrived a day late. Supplier was responsive when I followed up.',     date: '2025-02-20' },
  { id: 'r5', productId: 'any', userId: 'u5', userName: 'Ingabire Sandra', rating: 5, comment: 'Perfect for wholesale. The bulk price is unbeatable in Kigali.',                         date: '2025-02-05' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function StarRow({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < rating ? 'fill-brand-accent text-brand-accent' : 'text-slate-200'}`}
        />
      ))}
    </div>
  );
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-bold text-text-muted w-3">{star}</span>
      <Star className="w-2.5 h-2.5 fill-brand-accent text-brand-accent shrink-0" />
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-brand-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[9px] text-text-muted w-4 text-right">{count}</span>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface ProductDetailProps {
  product: Product;
  allProducts: Product[];   // pass all products so we can find related ones
  userRole: UserRole;
  onBack: () => void;
  onAddToCart: () => void;
  onRelatedClick: (product: Product) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProductDetail({
  product,
  allProducts,
  userRole,
  onBack,
  onAddToCart,
  onRelatedClick,
}: ProductDetailProps) {
  const [activeImg, setActiveImg]                 = useState(0);
  const [purchaseType, setPurchaseType]           = useState<'single' | 'bulk'>('single');
  const [quantity, setQuantity]                   = useState(1);
  const [showSecureOverlay, setShowSecureOverlay] = useState(false);
  const [showAllReviews, setShowAllReviews]       = useState(false);

  // Review form
  const [newRating, setNewRating]     = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment]   = useState('');
  const [reviews, setReviews]         = useState<Review[]>(MOCK_REVIEWS);
  const [submitted, setSubmitted]     = useState(false);

  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const price = purchaseType === 'single'
    ? (product.discountPrice || product.price)
    : (product.bulkPrice || product.price);

  // Rating summary
  const totalReviews = reviews.length;
  const avgRating    = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : product.rating;
  const breakdown    = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  // Related products — same category, exclude current, max 4
  const related = allProducts
    .filter(p => p.id !== product.id && p.category === product.category && p.stock !== -1)
    .slice(0, 4);

  const handleSubmitReview = () => {
    if (!newRating || !newComment.trim()) return;
    const review: Review = {
      id:        `r_${Date.now()}`,
      productId: product.id,
      userId:    'current_user',
      userName:  'You',
      rating:    newRating,
      comment:   newComment.trim(),
      date:      new Date().toISOString().split('T')[0],
    };
    setReviews(prev => [review, ...prev]);
    setNewRating(0);
    setNewComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

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

      {/* Back + wishlist */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-text-muted flex items-center gap-2 hover:text-text-main transition-colors font-bold text-xs uppercase tracking-widest"
        >
          ← Marketplace
        </button>
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
            wishlisted
              ? 'bg-rose-50 border-rose-300 text-rose-500'
              : 'bg-white border-border-subtle text-text-muted hover:border-rose-300 hover:text-rose-400'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
          {wishlisted ? 'Wishlisted' : 'Save'}
        </button>
      </div>

      {/* Gallery + info */}
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
            <div className="flex items-center gap-2">
              <StarRow rating={Math.round(avgRating)} />
              <span className="text-xs font-bold text-text-main">{avgRating.toFixed(1)}</span>
              <span className="text-[10px] text-text-muted">({totalReviews} reviews)</span>
            </div>
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

          {/* Purchase type */}
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
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 hover:bg-slate-50 border-r border-border-subtle">-</button>
                <input type="number" value={quantity} readOnly className="w-10 text-center font-bold text-xs" />
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 hover:bg-slate-50 border-l border-border-subtle">+</button>
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

      {/* ── Reviews section ───────────────────────────────────────────────── */}
      <div className="border-t border-border-subtle pt-6 space-y-5">
        <h2 className="text-sm font-black uppercase tracking-widest text-text-main">Customer Reviews</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Score summary */}
          <div className="bg-slate-50 border border-border-subtle rounded-xl p-5 flex items-center gap-5">
            <div className="text-center">
              <p className="text-5xl font-black text-text-main">{avgRating.toFixed(1)}</p>
              <StarRow rating={Math.round(avgRating)} />
              <p className="text-[9px] text-text-muted mt-1">{totalReviews} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {breakdown.map(({ star, count }) => (
                <RatingBar key={star} star={star} count={count} total={totalReviews} />
              ))}
            </div>
          </div>

          {/* Write a review */}
          <div className="bg-slate-50 border border-border-subtle rounded-xl p-5 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Write a Review</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setNewRating(star)}
                  className="transition-transform hover:scale-125"
                >
                  <Star className={`w-5 h-5 transition-colors ${star <= (hoverRating || newRating) ? 'fill-brand-accent text-brand-accent' : 'text-slate-300'}`} />
                </button>
              ))}
              {newRating > 0 && (
                <span className="text-[10px] font-bold text-text-muted ml-1">
                  {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][newRating]}
                </span>
              )}
            </div>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
              className="w-full bg-white border border-border-subtle rounded-lg p-2.5 text-xs font-medium text-text-main placeholder:text-slate-300 outline-none focus:ring-1 focus:ring-brand-primary resize-none"
            />
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-3 py-2 rounded-lg">
                ✓ Review submitted — thank you!
              </div>
            ) : (
              <button
                onClick={handleSubmitReview}
                disabled={!newRating || !newComment.trim()}
                className="w-full bg-sidebar text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
            )}
          </div>
        </div>

        {/* Review list */}
        <div className="space-y-3">
          {visibleReviews.map(review => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-border-subtle rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-[10px] font-black uppercase">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-text-main">{review.userName}</p>
                    <p className="text-[9px] text-text-muted">{new Date(review.date).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <StarRow rating={review.rating} />
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{review.comment}</p>
            </motion.div>
          ))}
        </div>

        {reviews.length > 3 && (
          <button
            onClick={() => setShowAllReviews(v => !v)}
            className="w-full py-2.5 border border-border-subtle rounded-lg text-[10px] font-black uppercase tracking-widest text-text-muted hover:border-brand-primary hover:text-brand-primary transition-all"
          >
            {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
          </button>
        )}
      </div>

      {/* ── Related products section ──────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="border-t border-border-subtle pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-text-main">
              You May Also Like
            </h2>
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
              {product.category}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map(p => (
              <motion.div
                key={p.id}
                whileHover={{ y: -2 }}
                onClick={() => onRelatedClick(p)}
                className="bg-white rounded-lg border border-border-subtle overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all group"
              >
                <div className="h-24 sm:h-28 overflow-hidden relative">
                  <img
                    src={p.images[0]}
                    referrerPolicy="no-referrer"
                    alt={p.name}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  {p.discountPercentage && (
                    <div className="absolute top-1.5 left-1.5 bg-brand-accent/90 text-white text-[8px] font-black px-1.5 py-0.5 rounded">
                      -{p.discountPercentage}%
                    </div>
                  )}
                </div>
                <div className="p-2.5 space-y-1">
                  <p className="text-xs font-bold text-text-main line-clamp-1">{p.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-text-main">
                      {(p.discountPrice || p.price).toLocaleString()} RWF
                    </span>
                    <div className="flex items-center gap-0.5 text-brand-accent text-[9px] font-bold">
                      ★ {p.rating}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}