/**
 * ArtisanPortalView.tsx
 * Artisan Portal tab — artisan profiles, product showcase, certification, training.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star, MapPin, ShieldCheck, Award, BookOpen,
  ChevronDown, ChevronUp, Plus, Phone,
} from 'lucide-react';

// ── Mock artisans ─────────────────────────────────────────────────────────────
const ARTISANS = [
  {
    id: 'a1',
    name: 'Uwimana Marie',
    craft: 'Agaseke Weaving',
    location: 'Gikondo, Kigali',
    rating: 4.9,
    reviewsCount: 142,
    certified: true,
    products: 18,
    image: 'https://picsum.photos/seed/artisan1/200/200',
    bio: 'Master weaver with 12 years of experience crafting traditional Agaseke baskets. Works with a cooperative of 8 women in Gikondo.',
    phone: '+250 788 001 001',
    specialties: ['Agaseke', 'Imigongo', 'Umuseke'],
    monthlyRevenue: 420_000,
    available: true,
  },
  {
    id: 'a2',
    name: 'Habimana Jean Pierre',
    craft: 'Imigongo Painting',
    location: 'Kirehe, Eastern Province',
    rating: 4.8,
    reviewsCount: 98,
    certified: true,
    products: 24,
    image: 'https://picsum.photos/seed/artisan2/200/200',
    bio: 'Renowned Imigongo artist preserving ancient Rwandan geometric art. Supplies to hotels and international galleries.',
    phone: '+250 782 002 002',
    specialties: ['Imigongo', 'Wall Art', 'Ceramics'],
    monthlyRevenue: 380_000,
    available: true,
  },
  {
    id: 'a3',
    name: 'Mukamana Grace',
    craft: 'Rwandan Fashion',
    location: 'Kimironko, Kigali',
    rating: 4.7,
    reviewsCount: 76,
    certified: false,
    products: 31,
    image: 'https://picsum.photos/seed/artisan3/200/200',
    bio: 'Fashion designer blending traditional Kitenge prints with modern silhouettes. Popular with local boutiques and export markets.',
    phone: '+250 783 003 003',
    specialties: ['Kitenge', 'Handmade Bags', 'Jewellery'],
    monthlyRevenue: 290_000,
    available: true,
  },
  {
    id: 'a4',
    name: 'Nzeyimana Patrick',
    craft: 'Wood Carving',
    location: 'Musanze, Northern Province',
    rating: 4.6,
    reviewsCount: 54,
    certified: true,
    products: 12,
    image: 'https://picsum.photos/seed/artisan4/200/200',
    bio: 'Skilled wood carver creating masks, figurines, and furniture inspired by Rwandan cultural heritage.',
    phone: '+250 784 004 004',
    specialties: ['Masks', 'Figurines', 'Furniture'],
    monthlyRevenue: 195_000,
    available: false,
  },
];

// ── Training modules ──────────────────────────────────────────────────────────
const TRAINING = [
  { id: 't1', title: 'Digital Product Photography',   duration: '2 hrs',  level: 'Beginner',      enrolled: 34, icon: '📸' },
  { id: 't2', title: 'Pricing for Export Markets',    duration: '1.5 hrs', level: 'Intermediate',  enrolled: 21, icon: '💰' },
  { id: 't3', title: 'WhatsApp Business for Artisans', duration: '1 hr',  level: 'Beginner',      enrolled: 58, icon: '📱' },
  { id: 't4', title: 'Quality Standards & Packaging', duration: '3 hrs',  level: 'Advanced',      enrolled: 17, icon: '📦' },
];

// ── Certification steps ───────────────────────────────────────────────────────
const CERT_STEPS = [
  { step: 1, label: 'Register Profile',    done: true  },
  { step: 2, label: 'Submit ID & Craft Photos', done: true  },
  { step: 3, label: 'Quality Review',      done: false },
  { step: 4, label: 'ELMART Certified',    done: false },
];

const LEVEL_COLOR: Record<string, string> = {
  Beginner:     'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced:     'bg-purple-100 text-purple-700',
};

export default function ArtisanPortalView() {
  const [expandedArtisan, setExpandedArtisan] = useState<string | null>('a1');
  const [showApplyModal, setShowApplyModal]   = useState(false);
  const [applyName, setApplyName]             = useState('');
  const [applyCraft, setApplyCraft]           = useState('');
  const [applyPhone, setApplyPhone]           = useState('');
  const [applySubmitted, setApplySubmitted]   = useState(false);

  const handleApply = () => {
    if (!applyName || !applyCraft || !applyPhone) return;
    setApplySubmitted(true);
  };

  return (
    <motion.div
      key="artisan"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6"
    >
      {/* ── Header ── */}
      <div className="panel p-5 md:p-6 bg-sidebar text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-1 italic">ELMART Artisan Portal</h2>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              Connecting Rwanda's skilled craftspeople directly to buyers. Certified artisans get premium placement and AI marketing support.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-center">
              <p className="text-xl font-black text-brand-accent">{ARTISANS.length}</p>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Artisans</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-center">
              <p className="text-xl font-black text-emerald-400">
                {ARTISANS.filter(a => a.certified).length}
              </p>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Certified</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-center">
              <p className="text-xl font-black text-white">
                {ARTISANS.reduce((a, b) => a + b.products, 0)}
              </p>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Products</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

        {/* ── Artisan list ── */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest">Featured Artisans</h3>
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex items-center gap-1.5 bg-brand-primary text-white px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
            >
              <Plus className="w-3 h-3" /> Join as Artisan
            </button>
          </div>

          {ARTISANS.map((artisan) => {
            const isExpanded = expandedArtisan === artisan.id;
            return (
              <div key={artisan.id} className="panel overflow-hidden">
                {/* Card header */}
                <div
                  className="p-4 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedArtisan(isExpanded ? null : artisan.id)}
                >
                  <div className="relative shrink-0">
                    <img
                      src={artisan.image}
                      referrerPolicy="no-referrer"
                      alt={artisan.name}
                      className="w-12 h-12 rounded-xl object-cover border border-border-subtle"
                    />
                    {artisan.certified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center border-2 border-white">
                        <ShieldCheck className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-black text-text-main">{artisan.name}</p>
                        <p className="text-[10px] text-brand-primary font-bold">{artisan.craft}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-0.5 text-brand-accent text-[10px] font-black">
                          <Star className="w-3 h-3 fill-current" />
                          {artisan.rating}
                        </div>
                        {isExpanded
                          ? <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
                          : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                        }
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-text-muted">
                        <MapPin className="w-2.5 h-2.5" />
                        <span className="text-[9px]">{artisan.location}</span>
                      </div>
                      <span className="text-[9px] text-text-muted">{artisan.products} products</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${artisan.available ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {artisan.available ? 'Available' : 'Busy'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3 border-t border-border-subtle pt-3">
                        <p className="text-[11px] text-text-muted leading-relaxed italic">"{artisan.bio}"</p>

                        {/* Specialties */}
                        <div className="flex flex-wrap gap-1.5">
                          {artisan.specialties.map((s) => (
                            <span key={s} className="text-[9px] font-bold px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded uppercase">
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-bg rounded-lg p-2 text-center">
                            <p className="text-sm font-black text-text-main">{artisan.reviewsCount}</p>
                            <p className="text-[8px] text-text-muted uppercase font-bold">Reviews</p>
                          </div>
                          <div className="bg-bg rounded-lg p-2 text-center">
                            <p className="text-sm font-black text-text-main">{artisan.products}</p>
                            <p className="text-[8px] text-text-muted uppercase font-bold">Products</p>
                          </div>
                          <div className="bg-bg rounded-lg p-2 text-center">
                            <p className="text-sm font-black text-emerald-600">
                              {(artisan.monthlyRevenue / 1000).toFixed(0)}K
                            </p>
                            <p className="text-[8px] text-text-muted uppercase font-bold">RWF / mo</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <a
                            href={`tel:${artisan.phone}`}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 border border-emerald-200 py-2 rounded-lg text-[10px] font-black text-emerald-700 uppercase hover:bg-emerald-100 transition-colors"
                          >
                            <Phone className="w-3 h-3" /> Call
                          </a>
                          <a
                            href={`https://wa.me/${artisan.phone.replace(/\s|\+/g, '')}?text=Hello ${artisan.name}, I found you on ELMART and I am interested in your ${artisan.craft}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 bg-brand-primary text-white py-2 rounded-lg text-[10px] font-black uppercase hover:opacity-90 transition-all"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* ── Right column ── */}
        <div className="space-y-4">

          {/* Certification tracker */}
          <div className="panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-brand-accent" />
              <h3 className="text-xs font-black uppercase tracking-widest">Certification Track</h3>
            </div>
            <div className="space-y-3">
              {CERT_STEPS.map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-black ${item.done ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {item.done ? '✓' : item.step}
                  </div>
                  <div className="flex-1">
                    <p className={`text-[11px] font-bold ${item.done ? 'text-text-main' : 'text-text-muted'}`}>
                      {item.label}
                    </p>
                  </div>
                  {item.done && (
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-primary rounded-full"
                style={{ width: `${(CERT_STEPS.filter(s => s.done).length / CERT_STEPS.length) * 100}%` }}
              />
            </div>
            <p className="text-[9px] text-text-muted mt-1.5 text-right">
              {CERT_STEPS.filter(s => s.done).length}/{CERT_STEPS.length} steps complete
            </p>
          </div>

          {/* Training modules */}
          <div className="panel p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-slate-50/50 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-primary" />
              <span className="text-xs font-black uppercase tracking-tight">Training Hub</span>
            </div>
            <div className="divide-y divide-slate-100">
              {TRAINING.map((course) => (
                <div key={course.id} className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{course.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-text-main leading-tight">{course.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${LEVEL_COLOR[course.level]}`}>
                          {course.level}
                        </span>
                        <span className="text-[9px] text-text-muted">{course.duration}</span>
                        <span className="text-[9px] text-text-muted">{course.enrolled} enrolled</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-brand-primary shrink-0">Start →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Apply modal ── */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 bg-sidebar/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5"
            >
              {!applySubmitted ? (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-sidebar">Join as Artisan</h3>
                      <p className="text-[10px] text-text-muted">Get certified and sell directly on ELMART</p>
                    </div>
                    <button onClick={() => setShowApplyModal(false)} className="p-1.5 hover:bg-slate-100 rounded-full text-lg leading-none">×</button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Full Name</label>
                      <input
                        type="text"
                        value={applyName}
                        onChange={e => setApplyName(e.target.value)}
                        placeholder="e.g. Uwimana Marie"
                        className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-sm font-bold outline-none focus:ring-1 focus:ring-brand-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Craft / Skill</label>
                      <input
                        type="text"
                        value={applyCraft}
                        onChange={e => setApplyCraft(e.target.value)}
                        placeholder="e.g. Agaseke Weaving"
                        className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-sm font-bold outline-none focus:ring-1 focus:ring-brand-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        value={applyPhone}
                        onChange={e => setApplyPhone(e.target.value)}
                        placeholder="e.g. 0781234567"
                        className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-sm font-bold outline-none focus:ring-1 focus:ring-brand-primary"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleApply}
                    className="w-full bg-sidebar text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-primary transition-all"
                  >
                    Submit Application
                  </button>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center space-y-4 py-4"
                >
                  <div className="w-14 h-14 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-lg font-black uppercase text-text-main">Application Received!</p>
                    <p className="text-[10px] text-text-muted mt-1">
                      We'll contact {applyName} on {applyPhone} within 48hrs to complete your certification.
                    </p>
                  </div>
                  <button
                    onClick={() => { setShowApplyModal(false); setApplySubmitted(false); setApplyName(''); setApplyCraft(''); setApplyPhone(''); }}
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