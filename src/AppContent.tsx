/**
 * AppContent.tsx — thin shell, layout + routing only.
 * All views and components are imported from their own files.
 */

import React, { useState, useEffect, useRef } from 'react';
import CompareBar from './components/CompareBar';
import { useCompare } from './hooks/useCompare';
import {
  Search, ShoppingCart, User, BarChart3, Package,
  Layers, X, FileText, MessageCircle, ShieldCheck,
  UploadCloud, Plus, Lock, Menu, ChevronDown, ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, VerificationStatus, Product } from './types';
import { MOCK_ORDERS } from './mockData';
import { useBreakpoint } from './hooks/useBreakpoint';
import { useAdminStore } from './admin/useAdminStore';
import LogisticsView from './views/LogisticsView';
import PaymentsView from './views/PaymentsView';

// ── Views ──────────────────────────────────────────────────────────────────────
import RetailView        from './views/RetailView';
import MarketplaceView   from './views/MarketplaceView';
import DashboardView     from './views/DashboardView';
import InventoryView     from './views/InventoryView';
import DocumentationView from './views/DocumentationView';
import AiStudioView      from './views/AiStudio';
import ShopManagerView   from './views/ShopManagerView';
import ArtisanPortalView from './views/ArtisanPortalView';
import ContactView       from './views/ContactView';

// ── Components ────────────────────────────────────────────────────────────────
import AdSection       from './components/AdSection';
import ProductDetail   from './components/ProductDetail';
import { useAdminUnlock } from './admin/AdminPanel';

// ─── Placeholder for unbuilt tabs ─────────────────────────────────────────────
function PlaceholderView({ tab }: { tab: string }) {
  return (
    <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex items-center justify-center h-64 text-center"
    >
      <div className="space-y-3">
        <div className="w-14 h-14 bg-bg border border-border-subtle rounded-2xl flex items-center justify-center mx-auto text-text-muted">
          <Package className="w-6 h-6" />
        </div>
        <p className="font-black text-sm uppercase tracking-tight">{tab.replace('-', ' ')}</p>
        <p className="text-xs text-text-muted">Module loading...</p>
      </div>
    </motion.div>
  );
}

// ─── Search Results Overlay ────────────────────────────────────────────────────
function SearchResultsOverlay({
  query,
  results,
  onSelect,
  onClose,
}: {
  query: string;
  results: Product[];
  onSelect: (p: Product) => void;
  onClose: () => void;
}) {
  if (!query || query.trim().length < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-border-subtle rounded-xl shadow-2xl z-[200] overflow-hidden"
      style={{ maxHeight: '420px' }}
    >
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border-subtle bg-slate-50/80 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </span>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
          <X className="w-3 h-3 text-text-muted" />
        </button>
      </div>

      {results.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <p className="text-sm font-bold text-text-muted">No products found</p>
          <p className="text-[10px] text-text-muted mt-1">Try searching by name, category or supplier</p>
        </div>
      ) : (
        <div className="overflow-y-auto" style={{ maxHeight: '360px' }}>
          {results.map((p) => (
            <div
              key={p.id}
              onMouseDown={() => onSelect(p)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-sky-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors group"
            >
              <div className="w-11 h-11 rounded-lg overflow-hidden border border-border-subtle shrink-0 bg-slate-100">
                <img
                  src={p.images[0]}
                  referrerPolicy="no-referrer"
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-text-main truncate">{p.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] font-bold text-brand-primary uppercase">{p.category}</span>
                  <span className="text-[9px] text-text-muted">· {p.supplierName}</span>
                  {p.isArtisan && (
                    <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase">Artisan</span>
                  )}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-black text-text-main">
                  {(p.discountPrice || p.price).toLocaleString()} RWF
                </p>
                {p.discountPrice && (
                  <p className="text-[9px] text-text-muted line-through">{p.price.toLocaleString()}</p>
                )}
              </div>
              <div className="w-5 h-5 bg-brand-primary/10 rounded-full flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-brand-primary text-[9px] font-black">→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Demand data ───────────────────────────────────────────────────────────────
const DEMAND_PREDICTIONS = [
  { region: 'Northern (Musanze)', item: 'Organic Irish Potatoes', demand: 'EXCESSIVE', remarks: 'Clients complaining about price fluctuations in Kigali markets.', confidence: 94 },
  { region: 'Kigali City', item: 'Inyange Whole Milk', demand: 'CRITICAL GAP', remarks: 'Frequent stock-outs reported in Nyarugenge convenience stores.', confidence: 89 },
  { region: 'Eastern (Nyagatare)', item: 'Construction Cement', demand: 'HIGH', remarks: 'New infrastructure projects starting; buyers seeking bulk discounts.', confidence: 92 },
];

const DEMAND_LEADS = [
  { id: 1, buyer: 'Kigali Fresh Market', item: 'Inyange Whole Milk', volume: '1000 Liters', match: 92 },
  { id: 2, buyer: 'Hotel des Mille Collines', item: 'Traditional Agaseke', volume: '200 Units', match: 88 },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AppContent() {
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet  = bp === 'tablet';

  const { state } = useAdminStore();
  const { products, navTabs, siteSettings } = state;

  type TabId = 'retail' | 'marketplace' | 'dashboard' | 'product' | 'inventory' |
               'logistics' | 'payments' | 'artisan' | 'ai-studio' | 'shop-manager' | 'documentation' | 'contact';

  const [activeTab, setActiveTab]           = useState<TabId>('marketplace');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userRole, setUserRole]             = useState<UserRole>('RETAIL_BUYER');
  const [cartCount, setCartCount]           = useState(0);

  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [headerExpanded, setHeaderExpanded] = useState(true);
  const [searchOpen, setSearchOpen]         = useState(false);

  // ── Search state ──────────────────────────────────────────────────────────
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const [searchQuery, setSearchQuery]           = useState('');
  const [searchResults, setSearchResults]       = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef  = useRef<HTMLDivElement>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }
    const q = query.toLowerCase();
    const results = products.filter(p =>
      p.stock !== -1 && (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.supplierName.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      )
    );
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    setActiveTab('product');
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchOpen(false);
    setSidebarOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Close search on outside click (desktop)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const [showSetupModal, setShowSetupModal]                   = useState(false);
  const [showConsumerVerifyModal, setShowConsumerVerifyModal] = useState(false);
  const [consumerStatus, setConsumerStatus] = useState<VerificationStatus>('UNVERIFIED');
  const [supplierStatus, setSupplierStatus] = useState<VerificationStatus>('UNVERIFIED');
  const [isAdminMode, setIsAdminMode]       = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);

  // ── Admin panel (20-click logo unlock) ────────────────────────────────────
  const { handleLogoClick, PasswordModal, Panel: AdminPanelPortal } = useAdminUnlock();

  // ── Add-product modal ──────────────────────────────────────────────────────
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', description: '', price: 0, category: 'Food',
    images: ['https://picsum.photos/seed/newproduct/600/600'],
    stock: 0, rating: 5.0, reviewsCount: 0,
    supplierName: 'System Merchant', isArtisan: false, moq: 1,
  });

  const [stockAlertsEnabled, setStockAlertsEnabled] = useState(true);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('product');
    setSidebarOpen(false);
  };

  const toggleRole = () => {
    let nextRole: UserRole;
    if (userRole === 'RETAIL_BUYER') nextRole = 'WHOLESALE_BUYER';
    else if (userRole === 'WHOLESALE_BUYER') nextRole = 'SUPPLIER';
    else nextRole = 'RETAIL_BUYER';
    setUserRole(nextRole);
    if (isAdminMode) { setIsImpersonating(true); }
    else {
      setIsImpersonating(false);
      if (nextRole === 'SUPPLIER' && supplierStatus === 'UNVERIFIED') setShowSetupModal(true);
    }
    setActiveTab(nextRole === 'RETAIL_BUYER' || nextRole === 'WHOLESALE_BUYER' ? 'marketplace' : 'dashboard');
    setSidebarOpen(false);
  };

  const handleAdminLogin = () => {
    if (!isAdminMode) { setIsAdminMode(true); setIsImpersonating(false); setUserRole('ADMIN'); setActiveTab('dashboard'); }
    else { setIsAdminMode(false); setIsImpersonating(false); setUserRole('RETAIL_BUYER'); setActiveTab('marketplace'); }
    setSidebarOpen(false);
  };

  // ── Nav ────────────────────────────────────────────────────────────────────
  const visibleNavItems = navTabs
    .filter(t => t.visible && t.roles.includes(userRole))
    .sort((a, b) => a.order - b.order);

  const mobileBottomNav = [
    visibleNavItems.find(i => i.id === 'retail') || visibleNavItems[0],
    visibleNavItems.find(i => i.id === 'marketplace') || visibleNavItems[1],
    visibleNavItems.find(i => i.id === 'dashboard'),
    visibleNavItems.find(i => i.id === 'payments'),
    { id: 'more', label: 'More', icon: 'Menu', roles: [] as string[], visible: true, order: 99 },
  ].filter(Boolean) as typeof visibleNavItems;

  // ── Sidebar outside-click ──────────────────────────────────────────────────
  const sidebarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sidebarOpen) return;
    const handler = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) setSidebarOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sidebarOpen]);

  // ─── Sidebar content ───────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 flex items-center justify-between">
        <div
          className="font-extrabold text-2xl text-brand-accent tracking-tighter cursor-pointer select-none"
          onClick={() => { handleLogoClick(); setActiveTab('marketplace'); setSidebarOpen(false); }}
        >
          {siteSettings.logoText}
        </div>
        {(isMobile || isTablet) && (
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-5 mb-4">
        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent text-[10px] font-black">
            {userRole.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Role</p>
            <p className="text-[11px] text-white font-bold truncate">{userRole.replace('_', ' ')}</p>
          </div>
          {(consumerStatus === 'VERIFIED' || supplierStatus === 'VERIFIED') && (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 overflow-y-auto">
        {visibleNavItems.map((item) => (
          <div key={item.id}
            onClick={() => { setActiveTab(item.id as TabId); setSidebarOpen(false); }}
            className={`px-3 py-2.5 text-slate-400 cursor-pointer flex items-center gap-3 rounded-lg transition-all hover:bg-white/5 hover:text-white ${activeTab === item.id ? 'bg-white/10 text-white border-l-2 border-brand-accent pl-[10px]' : ''}`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span className="font-medium text-xs">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="px-4 mt-auto pb-5 space-y-3 pt-4 border-t border-white/5">
        {isAdminMode && (
          <a href={`https://wa.me/${siteSettings.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 justify-center bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-lg text-[9px] font-black uppercase text-emerald-500 hover:bg-emerald-500/20 transition-all"
          >
            <MessageCircle className="w-3 h-3" /> Admin Support
          </a>
        )}
        <button onClick={toggleRole}
          className={`w-full text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg border transition-all ${isAdminMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="opacity-70">{isAdminMode ? 'Impersonate As:' : 'Switch Role:'}</span>
            <span>{userRole === 'RETAIL_BUYER' ? 'Wholesale' : userRole === 'WHOLESALE_BUYER' ? 'Supplier' : 'Retail'}</span>
          </div>
        </button>
        <div onClick={handleAdminLogin}
          className={`flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg cursor-pointer transition-all border ${isAdminMode ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isAdminMode ? 'Admin Active' : 'System Admin'}</span>
        </div>
        {isImpersonating && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg text-center">
            <p className="text-[8px] font-black uppercase text-amber-500 flex items-center justify-center gap-1">
              <Lock className="w-2.5 h-2.5" /> View Only Mode
            </p>
          </div>
        )}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 cursor-pointer hover:text-white transition-colors pt-1">
          <User className="w-3.5 h-3.5" /> <span>Settings</span>
        </div>
      </div>
    </div>
  );

  // ─── Tab renderer ──────────────────────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case 'retail':
        return <RetailView products={products.filter(p => p.stock !== -1)} onProductClick={handleProductClick} />;

      case 'marketplace':
        return (
          <div className="space-y-4 md:space-y-6">
            <AdSection />
            <MarketplaceView products={products.filter(p => p.stock !== -1)} onProductClick={handleProductClick} />
          </div>
        );

      case 'product':
        return selectedProduct ? (
          
          <ProductDetail
            product={selectedProduct}
            allProducts={products}
            userRole={userRole}
            onBack={() => setActiveTab('marketplace')}
            onAddToCart={() => setCartCount(c => c + 1)}
            onRelatedClick={(p) => { setSelectedProduct(p); setActiveTab('product'); }}
          />
          
        ) : null;

      case 'dashboard':
        return (
          <DashboardView
            userRole={userRole}
            isImpersonating={isImpersonating}
            orders={MOCK_ORDERS}
            demandPredictions={DEMAND_PREDICTIONS}
            onGoToInventory={() => setActiveTab('inventory')}
          />
        );

      case 'inventory':
        return (
          <InventoryView
            products={products}
            stockAlertsEnabled={stockAlertsEnabled}
            onToggleAlerts={() => setStockAlertsEnabled(v => !v)}
            demandLeads={DEMAND_LEADS}
          />
        );

      case 'shop-manager':
        return (
          <ShopManagerView
            products={products.filter(p => p.stock !== -1)}
            isImpersonating={isImpersonating}
            onAddProduct={() => setShowAddProductModal(true)}
          />
        );

      case 'ai-studio':
        return <AiStudioView products={products} />;

      case 'documentation':
        return <DocumentationView orders={MOCK_ORDERS} />;

      case 'logistics':
        return <LogisticsView orders={MOCK_ORDERS} />;

      case 'payments':
        return <PaymentsView orders={MOCK_ORDERS} isImpersonating={isImpersonating} />;

      case 'artisan':
        return <ArtisanPortalView />;

      case 'contact':
        return <ContactView />;

      default:
        return <PlaceholderView tab={activeTab} />;
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-bg">

      {/* Admin Panel — password gate + panel, managed by useAdminUnlock */}
      <PasswordModal />
      <AdminPanelPortal />

      {/* Desktop permanent sidebar */}
      {!isMobile && !isTablet && (
        <aside className="w-[210px] bg-sidebar text-white flex flex-col flex-shrink-0">
          <SidebarContent />
        </aside>
      )}

      {/* Mobile / tablet drawer */}
      <AnimatePresence>
        {(isMobile || isTablet) && sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside ref={sidebarRef}
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] bg-sidebar text-white flex flex-col z-50 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <main className="flex-grow flex flex-col overflow-hidden relative">

        {/* Impersonation banner */}
        {isImpersonating && (
          <div className="bg-amber-500 text-sidebar px-4 py-1.5 flex items-center justify-between shadow-lg z-40 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 animate-pulse shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-widest">Admin Restricted Access · View-Only Session</span>
            </div>
            <p className="text-[8px] font-bold italic opacity-80 hidden md:block">Sensitive data automatically redacted.</p>
          </div>
        )}

        {/* Modal: KYB */}
        {showSetupModal && (
          <div className="absolute inset-0 bg-sidebar/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-sidebar uppercase">ELMART Partner KYB</h2>
                <p className="text-text-muted text-xs font-bold leading-relaxed">Identity verification for Suppliers and Manufacturers.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">WhatsApp Business Number</label>
                  <input type="text" placeholder="+250 XXX XXX XXX" className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-sm font-bold outline-none focus:ring-1 focus:ring-brand-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Business Registration (RDB Certificate)</label>
                  <div className="bg-bg border border-dashed border-border-subtle p-4 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-white rounded border border-border-subtle flex items-center justify-center text-text-muted"><UploadCloud className="w-5 h-5" /></div>
                    <div>
                      <p className="text-[10px] font-bold uppercase">Upload PDF or JPG</p>
                      <p className="text-[9px] text-text-muted">Max 5MB</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-2 space-y-3">
                <button onClick={() => { setSupplierStatus('VERIFIED'); setShowSetupModal(false); }}
                  className="w-full bg-sidebar text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-lg">
                  Submit for Verification
                </button>
                <button onClick={() => setShowSetupModal(false)} className="w-full text-[10px] font-bold uppercase text-text-muted hover:text-red-500 transition-colors">
                  Remind Me Later
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal: KYC */}
        {showConsumerVerifyModal && (
          <div className="absolute inset-0 bg-sidebar/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3"><ShieldCheck className="w-6 h-6" /></div>
                <h2 className="text-2xl font-black tracking-tight text-sidebar uppercase">Consumer KYC</h2>
                <p className="text-text-muted text-xs font-bold">Security requirement for large retail purchases.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Email & Phone</label>
                  <input type="email" placeholder="email@example.rw" className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-sm font-medium outline-none mb-2" defaultValue="user@kigali.rw" />
                  <input type="text" placeholder="+250 78X XXX XXX" className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-sm font-bold outline-none" defaultValue="+250 788 000 111" />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">National ID / Passport</label>
                  <div className="bg-bg border border-dashed border-border-subtle p-6 rounded-lg flex flex-col items-center gap-2 cursor-pointer hover:bg-slate-50 group">
                    <div className="w-10 h-10 bg-white rounded border border-border-subtle flex items-center justify-center text-text-muted group-hover:text-brand-primary transition-all"><UploadCloud className="w-5 h-5" /></div>
                    <p className="text-[10px] font-bold uppercase">Click to upload photo</p>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <button onClick={() => { setConsumerStatus('VERIFIED'); setShowConsumerVerifyModal(false); }}
                  className="w-full bg-sidebar text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-lg">
                  Verify Identity
                </button>
                <button onClick={() => setShowConsumerVerifyModal(false)} className="w-full text-[10px] font-bold uppercase text-text-muted mt-4 hover:text-red-500 transition-colors">
                  Remind Me Later
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal: Add Product */}
        {showAddProductModal && (
          <div className="absolute inset-0 bg-sidebar/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4 text-left">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-lg rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-black text-sidebar italic tracking-tighter uppercase">New Product Entry</h2>
                <button onClick={() => setShowAddProductModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Product Name</label>
                  <input type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Inyange Milk" className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-brand-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Category</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value as any })}
                    className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-brand-primary h-[42px]">
                    <option>Food</option><option>Beverages</option><option>Construction</option>
                    <option>Fashion</option><option>Home</option><option>Tools</option><option>Electronics</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Price (RWF)</label>
                  <input type="number" value={newProduct.price || ''} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    placeholder="0" className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-brand-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Stock Quantity</label>
                  <input type="number" value={newProduct.stock || ''} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    placeholder="0" className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-brand-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Description</label>
                <textarea value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={3} placeholder="Tell buyers about your product..." className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-xs font-medium outline-none focus:ring-1 focus:ring-brand-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Product Image URL</label>
                <input type="text" value={newProduct.images?.[0]} onChange={e => setNewProduct({ ...newProduct, images: [e.target.value] })}
                  placeholder="https://..." className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-brand-primary" />
              </div>
              <button onClick={() => setShowAddProductModal(false)}
                className="w-full bg-sidebar text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl active:scale-95">
                Verify & Publish Entry
              </button>
            </motion.div>
          </div>
        )}

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <header className="bg-white border-b border-border-subtle flex-shrink-0 z-30 shadow-sm">
          <div className="flex items-center justify-between px-3 md:px-5 h-12 md:h-14">
            <div className="flex items-center gap-2 md:gap-3">
              {(isMobile || isTablet) && (
                <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-bg rounded-lg text-text-main transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              )}
              {(isMobile || isTablet) && (
                <span
                  className="font-extrabold text-lg text-brand-accent tracking-tighter leading-none cursor-pointer select-none"
                  onClick={handleLogoClick}
                >
                  {siteSettings.logoText}
                </span>
              )}
              {!isMobile && (
                <div className="flex items-center gap-2 text-text-main">
                  <strong className="text-sm hidden md:inline">Market Summary</strong>
                  <span className="text-text-muted text-xs border-l border-border-subtle pl-3 hidden lg:inline">{siteSettings.location}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 md:gap-3">
              {/* Mobile search toggle */}
              {isMobile && (
                <button onClick={() => { setSearchOpen(s => !s); if (searchOpen) clearSearch(); }} className="p-2 hover:bg-bg rounded-lg transition-colors">
                  <Search className="w-4 h-4 text-text-main" />
                </button>
              )}

              {/* Desktop search with dropdown */}
              {!isMobile && (
                <div ref={desktopSearchRef} className="relative hidden sm:flex">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-3.5 h-3.5 pointer-events-none z-10" />
                  <input
                    type="text"
                    value={searchQuery}
                    placeholder="Search products, suppliers..."
                    onChange={e => handleSearch(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                    className="bg-bg border border-border-subtle rounded-md py-1.5 pl-8 pr-8 text-xs w-48 lg:w-72 focus:ring-1 focus:ring-brand-primary outline-none transition-all focus:w-80"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3 text-text-muted" />
                    </button>
                  )}
                  <AnimatePresence>
                    {showSearchResults && (
                      <div className="absolute top-full left-0 w-80 mt-1">
                        <SearchResultsOverlay
                          query={searchQuery}
                          results={searchResults}
                          onSelect={handleSelectProduct}
                          onClose={clearSearch}
                        />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="hidden sm:flex bg-bg text-brand-primary px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-tight border border-brand-primary/20">
                {siteSettings.location}
              </div>

              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-bg border border-border-subtle rounded-full cursor-pointer hover:border-brand-primary transition-all"
                onClick={() => setShowConsumerVerifyModal(true)}>
                <div className={`w-1.5 h-1.5 rounded-full ${consumerStatus === 'VERIFIED' ? 'bg-brand-success' : 'bg-brand-accent animate-pulse'}`} />
                <span className="text-[9px] font-black uppercase tracking-tight text-text-main">
                  {consumerStatus === 'VERIFIED' ? 'Verified' : 'Verify ID'}
                </span>
                {consumerStatus === 'VERIFIED' && <ShieldCheck className="w-2.5 h-2.5 text-brand-success" />}
              </div>

              <div className="relative cursor-pointer hover:bg-bg p-2 rounded-full transition-colors" onClick={() => setActiveTab('payments')}>
                <ShoppingCart className="w-4 h-4 text-text-main" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-brand-primary text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">{cartCount}</span>
                )}
              </div>

              <div className="w-7 h-7 bg-slate-200 rounded-full border border-border-subtle cursor-pointer" />

              <button
                onClick={() => setHeaderExpanded(e => !e)}
                className="p-1.5 hover:bg-bg rounded-lg text-text-muted transition-colors hidden md:flex"
              >
                {headerExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expandable search bar (mobile) */}
          <AnimatePresence>
            {isMobile && searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-border-subtle"
              >
                <div ref={mobileSearchRef} className="px-3 py-2 space-y-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-3.5 h-3.5" />
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      placeholder="Search products, suppliers..."
                      onChange={e => handleSearch(e.target.value)}
                      className="w-full bg-bg border border-border-subtle rounded-md py-2 pl-8 pr-8 text-xs focus:ring-1 focus:ring-brand-primary outline-none"
                    />
                    {searchQuery && (
                      <button onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 rounded-full">
                        <X className="w-3 h-3 text-text-muted" />
                      </button>
                    )}
                  </div>
                  {/* Mobile search results */}
                  <AnimatePresence>
                    {showSearchResults && (
                      <SearchResultsOverlay
                        query={searchQuery}
                        results={searchResults}
                        onSelect={handleSelectProduct}
                        onClose={clearSearch}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsible sub-header tabs (desktop) */}
          <AnimatePresence>
            {headerExpanded && !isMobile && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-border-subtle"
              >
                <div className="flex items-center gap-1 px-4 md:px-5 overflow-x-auto scrollbar-none py-1">
                  {visibleNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as TabId)}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded whitespace-nowrap transition-all ${
                        activeTab === item.id
                          ? 'bg-brand-primary text-white'
                          : 'text-text-muted hover:text-text-main hover:bg-bg'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ── Content area ───────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-3 md:p-5 lg:p-6">
          <AnimatePresence mode="wait">
            {renderTab()}
          </AnimatePresence>
        </div>

        {/* ── Mobile bottom nav ──────────────────────────────────────────────── */}
        {isMobile && (
          <nav className="bg-white border-t border-border-subtle flex items-stretch shrink-0 z-30 shadow-[0_-1px_6px_rgba(0,0,0,0.06)]">
            {mobileBottomNav.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'more') { setSidebarOpen(true); return; }
                  setActiveTab(item.id as TabId);
                }}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                  activeTab === item.id
                    ? 'text-brand-primary border-t-2 border-brand-primary'
                    : 'text-text-muted'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </main>

   <CompareBar compareIds={compareIds} products={products} onRemove={toggleCompare} onClear={clearCompare} />   
    </div>
  );
}