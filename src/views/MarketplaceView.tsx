/**
 * MarketplaceView.tsx
 * Wholesale Hub tab view.
 */

import { motion } from 'motion/react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface MarketplaceViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function MarketplaceView({ products, onProductClick }: MarketplaceViewProps) {
  return (
    <motion.div
      key="marketplace"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4 md:space-y-6"
    >
      {/* Hero banner */}
      <div className="relative rounded-xl overflow-hidden h-40 md:h-56 bg-sidebar flex items-center p-5 md:p-12 shadow-lg border border-white/10">
        <div className="z-10 text-white max-w-lg space-y-2 md:space-y-3">
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Direct artisan connection.</h1>
          <p className="text-slate-400 text-xs hidden sm:block">
            Wholesale prices at consumer quantities. Connecting manufacturers to retailers across Rwanda.
          </p>
          <button className="bg-brand-primary text-white px-4 py-2 rounded-md font-bold text-xs hover:bg-brand-primary/90 transition-all flex items-center gap-2">
            Browse Full Catalog
          </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none">
          <img
            src="https://picsum.photos/seed/kigali/800/800"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
        ))}
      </div>
    </motion.div>
  );
}