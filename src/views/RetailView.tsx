/**
 * RetailView.tsx
 * Daily Deals / Retail tab view.
 */

import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface RetailViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const CATEGORIES = [
  { name: 'Food', icon: '🌽' },
  { name: 'Beverages', icon: '🥤' },
  { name: 'Home', icon: '🏠' },
  { name: 'Artisan', icon: '🎨' },
  { name: 'Electronics', icon: '📱' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Tools', icon: '🛠️' },
];

export default function RetailView({ products, onProductClick }: RetailViewProps) {
  return (
    <motion.div
      key="retail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4 md:space-y-6"
    >
      {/* Hero banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 h-36 sm:h-44 md:h-48">
        <div className="sm:col-span-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 p-5 md:p-8 text-white relative overflow-hidden group">
          <div className="relative z-10 space-y-1.5">
            <span className="text-[9px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded tracking-widest">
              Kigali Flash Sale
            </span>
            <h2 className="text-2xl md:text-3xl font-black italic transform -skew-x-6">UP TO 50% OFF</h2>
            <p className="text-[10px] md:text-xs font-medium opacity-90">
              Best prices for everyday essentials. Valid for MoMo payments only.
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 transform scale-150 rotate-12 pointer-events-none">
            <ShoppingCart className="w-full h-full" />
          </div>
        </div>

        <div className="hidden sm:flex rounded-xl bg-brand-primary p-6 text-white flex-col justify-center gap-2">
          <p className="text-[10px] font-bold uppercase tracking-tight opacity-70">Bulk Savings</p>
          <h3 className="text-lg md:text-xl font-bold leading-tight line-clamp-2">
            Small retailers buy together, save more!
          </h3>
          <button className="bg-white text-brand-primary py-1.5 rounded-lg text-[10px] font-black uppercase mt-2">
            Join Group Buy
          </button>
        </div>
      </div>



      {/* Product grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-center border-b border-border-subtle pb-2">
          <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2 text-text-main">
            <span className="w-1 h-4 bg-brand-accent rounded-full" /> Hot Deals for You
          </h3>
          <span className="text-[10px] font-bold text-brand-primary cursor-pointer">VIEW ALL →</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}