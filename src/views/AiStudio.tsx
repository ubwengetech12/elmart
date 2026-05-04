/**
 * AiStudioView.tsx
 * AI Marketing Studio tab view.
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Download, Plus } from 'lucide-react';
import { Product } from '../types';

interface AiStudioViewProps {
  products: Product[];
}

export default function AiStudioView({ products }: AiStudioViewProps) {
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('Kinyarwanda');

  const handleGenerate = () => {
    setIsAiGenerating(true);
    setAiProgress(0);
    const interval = setInterval(() => {
      setAiProgress((p) => {
        if (p >= 100) { clearInterval(interval); setIsAiGenerating(false); return 100; }
        return p + 5;
      });
    }, 200);
  };

  return (
    <motion.div
      key="ai-studio"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6"
    >
      {/* Header */}
      <div className="panel p-5 md:p-6 bg-sidebar text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-lg md:text-xl font-bold mb-2 italic">ELMART AI Marketing Studio</h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
            Generate cinematic AI product videos and multilingual promotional content for your listings.
            Powered by ELMA-PRO neural engine.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Language selector + generate */}
        <div className="space-y-4">
          <div className="panel p-4 md:p-5">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Language & Target</h3>
            <div className="space-y-3">
              {['Kinyarwanda', 'French', 'English', 'Swahili'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`w-full py-2 text-xs font-bold rounded border transition-all text-left px-3 ${
                    selectedLanguage === lang
                      ? 'border-brand-primary bg-sky-50 text-brand-primary'
                      : 'border-slate-100 text-text-muted hover:border-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={isAiGenerating}
              className="w-full mt-4 bg-brand-primary text-white py-3 rounded-lg font-black text-[10px] uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isAiGenerating ? `Producing... ${aiProgress}%` : 'Initialize AI Production'}
            </button>
            {isAiGenerating && (
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${aiProgress}%` }}
                  className="h-full bg-brand-primary shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Video hub */}
        <div className="md:col-span-2 panel p-0 overflow-hidden">
          <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-xs font-black uppercase tracking-tight">Commodity Video Hub</h3>
              <p className="text-[9px] text-text-muted italic">AI-generated commodity promotions.</p>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded uppercase">BETA v2.1</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-h-[500px] overflow-y-auto">
            {products.filter((p) => p.promoVideoUrl).map((product) => (
              <div key={product.id} className="relative aspect-video bg-sidebar rounded-xl overflow-hidden group shadow-lg border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <img
                  src={product.images[0]}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-2xl">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 z-30">
                  <p className="text-[10px] font-black text-white italic truncate pr-8">{product.name} PROMO</p>
                </div>
                <button className="absolute top-3 right-3 z-30 p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all border border-white/10">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <div className="aspect-video border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-4">
              <Plus className="w-5 h-5 text-slate-300 mb-2" />
              <p className="text-[10px] font-bold text-slate-400">More Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}