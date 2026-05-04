/**
 * ProductCard.tsx
 * Product tile used in RetailView and MarketplaceView.
 */

import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
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