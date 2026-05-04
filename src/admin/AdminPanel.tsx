/**
 * AdminPanel.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Secret admin UI for ELMART.
 * Access: click the ELMART logo 20 times → password modal → VITE_ADMIN_PASSWORD
 *
 * Controls:
 *  - Products  : add / edit price & stock / delete / toggle visibility
 *  - Ads       : add / edit / delete
 *  - Nav Tabs  : rename / toggle visible / reorder
 *  - Site Settings : app name, WhatsApp, location, currency, maintenance mode
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, ShieldCheck, Package, BarChart3, Layers, FileText,
  Trash2, Eye, EyeOff, Plus, Settings, AlertTriangle,
} from 'lucide-react';
import {
  useAdminStore,
  genId,
  emptyProduct,
  emptyAd,
  NavTab,
} from '../admin/useAdminStore';
import { Product, Advertisement } from '../types';

// ─── Password gate ────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'valentin';

interface AdminPanelProps {
  onClose: () => void;
}

type AdminTab = 'products' | 'ads' | 'tabs' | 'settings';

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const { state, dispatch } = useAdminStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  // ── Editing state ──────────────────────────────────────────────────────────
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(emptyProduct());
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [newAd, setNewAd] = useState<Omit<Advertisement, 'id'>>(emptyAd());
  const [showAddAd, setShowAddAd] = useState(false);

  const [settingsDraft, setSettingsDraft] = useState(state.siteSettings);

  // ── Handlers: Products ─────────────────────────────────────────────────────
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    dispatch({ type: 'ADD_PRODUCT', payload: { ...newProduct, id: genId('p') } });
    setNewProduct(emptyProduct());
    setShowAddProduct(false);
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;
    dispatch({ type: 'UPDATE_PRODUCT', payload: editingProduct });
    setEditingProduct(null);
  };

  // ── Handlers: Ads ──────────────────────────────────────────────────────────
  const handleAddAd = () => {
    if (!newAd.title || !newAd.companyName) return;
    dispatch({ type: 'ADD_AD', payload: { ...newAd, id: genId('ad') } });
    setNewAd(emptyAd());
    setShowAddAd(false);
  };

  const handleSaveAd = () => {
    if (!editingAd) return;
    dispatch({ type: 'UPDATE_AD', payload: editingAd });
    setEditingAd(null);
  };

  // ── Handlers: Settings ─────────────────────────────────────────────────────
  const handleSaveSettings = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settingsDraft });
    alert('Settings saved.');
  };

  // ─── UI ────────────────────────────────────────────────────────────────────
  const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { id: 'ads',      label: 'Ads',      icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'tabs',     label: 'Nav Tabs', icon: <Layers className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-3 md:p-6"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-sidebar text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-accent/20 text-brand-accent rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest">ELMART Admin Panel</h2>
              <p className="text-[9px] text-slate-400">Full control over site content</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-border-subtle bg-slate-50 shrink-0 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${
                activeTab === t.id
                  ? 'border-brand-primary text-brand-primary bg-white'
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">

          {/* ── PRODUCTS ──────────────────────────────────────────────────── */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-black uppercase tracking-widest text-text-muted">
                  {state.products.length} products
                </p>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center gap-1.5 bg-brand-primary text-white px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/90"
                >
                  <Plus className="w-3 h-3" /> Add Product
                </button>
              </div>

              {/* Add product form */}
              <AnimatePresence>
                {showAddProduct && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-50 border border-border-subtle rounded-xl p-4 space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">New Product</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <input placeholder="Name" value={newProduct.name}
                          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                          className="col-span-2 md:col-span-1 input-field" />
                        <input placeholder="Price (RWF)" type="number" value={newProduct.price || ''}
                          onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                          className="input-field" />
                        <input placeholder="Stock" type="number" value={newProduct.stock || ''}
                          onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                          className="input-field" />
                        <input placeholder="Image URL" value={newProduct.images?.[0] ?? ''}
                          onChange={e => setNewProduct({ ...newProduct, images: [e.target.value] })}
                          className="col-span-2 md:col-span-3 input-field" />
                        <textarea placeholder="Description" value={newProduct.description}
                          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                          rows={2} className="col-span-2 md:col-span-3 input-field resize-none" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleAddProduct} className="bg-brand-primary text-white px-4 py-2 rounded text-[10px] font-black uppercase">Save</button>
                        <button onClick={() => setShowAddProduct(false)} className="text-[10px] font-bold text-text-muted uppercase hover:text-red-500">Cancel</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Product list */}
              <div className="space-y-2">
                {state.products.map((p) => (
                  <div key={p.id} className="bg-white border border-border-subtle rounded-xl p-3 flex flex-col md:flex-row md:items-center gap-3">
                    {editingProduct?.id === p.id ? (
                      // Edit row
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                        <input value={editingProduct.name}
                          onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="col-span-2 input-field" />
                        <input type="number" value={editingProduct.price}
                          onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                          className="input-field" placeholder="Price" />
                        <input type="number" value={editingProduct.stock}
                          onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                          className="input-field" placeholder="Stock" />
                        <div className="col-span-2 md:col-span-4 flex gap-2">
                          <button onClick={handleSaveProduct} className="bg-brand-primary text-white px-3 py-1.5 rounded text-[10px] font-black uppercase">Save</button>
                          <button onClick={() => setEditingProduct(null)} className="text-[10px] font-bold text-text-muted uppercase hover:text-red-500">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      // View row
                      <>
                        <img src={p.images[0]} className="w-10 h-10 rounded object-cover border border-border-subtle shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">{p.name}</p>
                          <p className="text-[9px] text-text-muted">{p.price.toLocaleString()} RWF · Stock: {p.stock}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => dispatch({ type: 'TOGGLE_PRODUCT_VISIBILITY', payload: p.id })}
                            className="p-1.5 hover:bg-slate-100 rounded transition-colors text-text-muted hover:text-sidebar">
                            {p.stock === -1 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => setEditingProduct(p)}
                            className="text-[9px] font-black uppercase text-brand-primary hover:underline">
                            Edit
                          </button>
                          <button onClick={() => { if (confirm(`Delete "${p.name}"?`)) dispatch({ type: 'DELETE_PRODUCT', payload: p.id }); }}
                            className="p-1.5 hover:bg-red-50 rounded transition-colors text-red-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ADS ───────────────────────────────────────────────────────── */}
          {activeTab === 'ads' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-black uppercase tracking-widest text-text-muted">{state.ads.length} ads</p>
                <button onClick={() => setShowAddAd(true)}
                  className="flex items-center gap-1.5 bg-brand-primary text-white px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/90">
                  <Plus className="w-3 h-3" /> Add Ad
                </button>
              </div>

              <AnimatePresence>
                {showAddAd && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <div className="bg-slate-50 border border-border-subtle rounded-xl p-4 space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">New Ad</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input placeholder="Company Name" value={newAd.companyName}
                          onChange={e => setNewAd({ ...newAd, companyName: e.target.value })}
                          className="input-field" />
                        <input placeholder="Ad Title" value={newAd.title}
                          onChange={e => setNewAd({ ...newAd, title: e.target.value })}
                          className="input-field" />
                        <input placeholder="Image URL" value={newAd.imageUrl}
                          onChange={e => setNewAd({ ...newAd, imageUrl: e.target.value })}
                          className="col-span-1 md:col-span-2 input-field" />
                        <textarea placeholder="Description" value={newAd.description}
                          onChange={e => setNewAd({ ...newAd, description: e.target.value })}
                          rows={2} className="col-span-1 md:col-span-2 input-field resize-none" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleAddAd} className="bg-brand-primary text-white px-4 py-2 rounded text-[10px] font-black uppercase">Save</button>
                        <button onClick={() => setShowAddAd(false)} className="text-[10px] font-bold text-text-muted uppercase hover:text-red-500">Cancel</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                {state.ads.map((ad) => (
                  <div key={ad.id} className="bg-white border border-border-subtle rounded-xl p-3 flex flex-col md:flex-row md:items-center gap-3">
                    {editingAd?.id === ad.id ? (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input value={editingAd.companyName}
                          onChange={e => setEditingAd({ ...editingAd, companyName: e.target.value })}
                          className="input-field" placeholder="Company" />
                        <input value={editingAd.title}
                          onChange={e => setEditingAd({ ...editingAd, title: e.target.value })}
                          className="input-field" placeholder="Title" />
                        <input value={editingAd.imageUrl}
                          onChange={e => setEditingAd({ ...editingAd, imageUrl: e.target.value })}
                          className="col-span-1 md:col-span-2 input-field" placeholder="Image URL" />
                        <div className="col-span-1 md:col-span-2 flex gap-2">
                          <button onClick={handleSaveAd} className="bg-brand-primary text-white px-3 py-1.5 rounded text-[10px] font-black uppercase">Save</button>
                          <button onClick={() => setEditingAd(null)} className="text-[10px] font-bold text-text-muted uppercase hover:text-red-500">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img src={ad.imageUrl} className="w-16 h-10 rounded object-cover border border-border-subtle shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">{ad.title}</p>
                          <p className="text-[9px] text-text-muted">{ad.companyName}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => setEditingAd(ad)} className="text-[9px] font-black uppercase text-brand-primary hover:underline">Edit</button>
                          <button onClick={() => { if (confirm(`Delete ad "${ad.title}"?`)) dispatch({ type: 'DELETE_AD', payload: ad.id }); }}
                            className="p-1.5 hover:bg-red-50 rounded transition-colors text-red-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NAV TABS ──────────────────────────────────────────────────── */}
          {activeTab === 'tabs' && (
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-text-muted">Toggle tab visibility</p>
              {state.navTabs.sort((a, b) => a.order - b.order).map((tab) => (
                <div key={tab.id} className="bg-white border border-border-subtle rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold">{tab.label}</p>
                    <p className="text-[9px] text-text-muted uppercase">{tab.roles.join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => dispatch({ type: 'TOGGLE_TAB', payload: tab.id })}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${tab.visible ? 'bg-brand-primary' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow ${tab.visible ? 'left-5' : 'left-0.5'}`} />
                    </div>
                    <span className={`text-[9px] font-black uppercase ${tab.visible ? 'text-brand-primary' : 'text-slate-400'}`}>
                      {tab.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── SETTINGS ──────────────────────────────────────────────────── */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-lg">
              <p className="text-xs font-black uppercase tracking-widest text-text-muted">Site Settings</p>

              {[
                { label: 'App Name',        key: 'appName'        },
                { label: 'Logo Text',        key: 'logoText'       },
                { label: 'Tagline',          key: 'tagline'        },
                { label: 'WhatsApp Number',  key: 'whatsappNumber' },
                { label: 'Location Label',   key: 'location'       },
                { label: 'Currency',         key: 'currency'       },
                { label: 'Admin Email',      key: 'adminEmail'     },
              ].map(({ label, key }) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">{label}</label>
                  <input
                    value={(settingsDraft as any)[key]}
                    onChange={e => setSettingsDraft({ ...settingsDraft, [key]: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
              ))}

              {/* Maintenance mode toggle */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs font-bold">Maintenance Mode</p>
                  <p className="text-[9px] text-text-muted">Shows a "down for maintenance" banner</p>
                </div>
                <div
                  onClick={() => setSettingsDraft(s => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${settingsDraft.maintenanceMode ? 'bg-brand-accent' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${settingsDraft.maintenanceMode ? 'left-5' : 'left-0.5'}`} />
                </div>
              </div>

              <button onClick={handleSaveSettings}
                className="w-full bg-sidebar text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-primary transition-all">
                Save Settings
              </button>

              {/* Danger zone */}
              <div className="border border-red-200 rounded-xl p-4 space-y-3 bg-red-50">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Danger Zone</p>
                </div>
                <button
                  onClick={() => { if (confirm('Reset ALL data to defaults? This cannot be undone.')) dispatch({ type: 'RESET_ALL' }); }}
                  className="w-full border border-red-300 text-red-600 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all"
                >
                  Reset Everything to Defaults
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Hook: 20-click logo unlock ───────────────────────────────────────────────
export function useAdminUnlock() {
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);

  const handleLogoClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 20) {
      setClickCount(0);
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setShowPasswordModal(false);
      setPasswordInput('');
      setError(false);
      setShowPanel(true);
    } else {
      setError(true);
    }
  };

  const PasswordModal = () => (
    <AnimatePresence>
      {showPasswordModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
        >
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl space-y-5"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-sidebar text-brand-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-sidebar">Admin Access</h2>
              <p className="text-[10px] text-text-muted mt-1">Enter your admin password to continue.</p>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setError(false); }}
              onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
              className={`input-field w-full ${error ? 'border-red-400 ring-1 ring-red-400' : ''}`}
              autoFocus
            />
            {error && <p className="text-[10px] text-red-500 font-bold -mt-2">Incorrect password.</p>}
            <button onClick={handlePasswordSubmit}
              className="w-full bg-sidebar text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-primary transition-all">
              Unlock
            </button>
            <button onClick={() => { setShowPasswordModal(false); setPasswordInput(''); setError(false); }}
              className="w-full text-[10px] font-bold uppercase text-text-muted hover:text-red-500 transition-colors">
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const Panel = () => (
    <AnimatePresence>
      {showPanel && <AdminPanel onClose={() => setShowPanel(false)} />}
    </AnimatePresence>
  );

  return { handleLogoClick, PasswordModal, Panel, clickCount };
}