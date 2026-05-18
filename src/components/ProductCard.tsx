/**
 * ProductCard.tsx
 * Product tile used in RetailView and MarketplaceView.
 * Includes wishlist heart button and compare toggle.
 * Both persist across page reloads via localStorage.
 */

import { motion } from 'motion/react';
import { Heart, BarChart2 } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../hooks/useWishlist';
import { useCompare } from '../hooks/useCompare';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isComparing, toggleCompare, maxReached } = useCompare();

  const wishlisted = isWishlisted(product.id);
  const comparing  = isComparing(product.id);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-white rounded-lg border border-border-subtle overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all h-full flex flex-col"
    >
      <div className="h-32 sm:h-36 md:h-40 overflow-hidden relative grayscale-[30%] group-hover:grayscale-0 transition-all duration-500">
        <img
          src={product.images[0]}
          referrerPolicy="no-referrer"
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Wishlist button */}
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow transition-all backdrop-blur-sm border ${
            wishlisted
              ? 'bg-rose-500 border-rose-400 text-white'
              : 'bg-white/80 border-white/60 text-slate-400 hover:text-rose-500'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Compare button */}
        <button
          onClick={e => {
            e.stopPropagation();
            if (!comparing && maxReached) return;
            toggleCompare(product.id);
          }}
          className={`absolute top-10 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow transition-all backdrop-blur-sm border ${
            comparing
              ? 'bg-brand-primary border-brand-primary text-white'
              : maxReached
              ? 'bg-white/50 border-white/40 text-slate-300 cursor-not-allowed'
              : 'bg-white/80 border-white/60 text-slate-400 hover:text-brand-primary'
          }`}
          aria-label={comparing ? 'Remove from compare' : 'Add to compare'}
        >
          <BarChart2 className="w-3.5 h-3.5" />
        </button>

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isArtisan && (
            <span className="bg-brand-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Artisan
            </span>
          )}
          {product.intelligence && (
            <span className="bg-sidebar/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase backdrop-blur-sm border border-white/20">
              Score: {(Object.values(product.intelligence).reduce((a, b) => a + b, 0) / 4).toFixed(1)}
            </span>
          )}
        </div>
      </div>

      <div className="p-2.5 md:p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-0.5 md:space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[8px] md:text-[9px] text-text-muted uppercase font-bold tracking-tighter">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 text-brand-accent text-[9px] md:text-[10px] font-bold">
              ★ {product.rating}
            </div>
          </div>
          <h3 className="font-bold text-text-main text-xs md:text-sm line-clamp-1">{product.name}</h3>
        </div>

        <div className="mt-2 md:mt-3 flex items-center justify-between pt-2 border-t border-slate-50">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-[11px] md:text-xs font-bold text-text-main">
                {(product.discountPrice || product.price).toLocaleString()} RWF
              </span>
              {product.discountPrice && (
                <span className="text-[9px] text-text-muted line-through hidden sm:inline">
                  {product.price.toLocaleString()}
                </span>
              )}
            </div>
            {product.bulkPrice && (
              <span className="text-[9px] text-brand-primary font-bold hidden sm:block">
                Bulk: {product.bulkPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.discountPercentage && (
            <div className="bg-brand-accent/20 text-brand-accent px-1.5 py-0.5 rounded text-[8px] font-black">
              -{product.discountPercentage}%
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}