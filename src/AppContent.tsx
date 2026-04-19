import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, BarChart3, Package, Layers, X, FileText, MessageCircle, ShieldCheck, UploadCloud, Play, Download, Plus, AlertTriangle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, UserRole, Order, Advertisement, VerificationStatus } from './types';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_ADS } from './mockData';

export default function AppContent() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'dashboard' | 'product' | 'inventory' | 'logistics' | 'payments' | 'artisan' | 'ai-studio' | 'shop-manager' | 'retail' | 'documentation'>('marketplace');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('RETAIL_BUYER');
  const [cartCount, setCartCount] = useState(0);
  const [hasSetupProfile, setHasSetupProfile] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  
  const [showConsumerVerifyModal, setShowConsumerVerifyModal] = useState(false);
  const [consumerStatus, setConsumerStatus] = useState<VerificationStatus>('UNVERIFIED');
  const [supplierStatus, setSupplierStatus] = useState<VerificationStatus>('UNVERIFIED');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [stockAlertsEnabled, setStockAlertsEnabled] = useState(true);
  const [demandLeads, setDemandLeads] = useState([
    { id: 1, buyer: 'Kigali Fresh Market', item: 'Inyange Whole Milk', volume: '1000 Liters', match: 92 },
    { id: 2, buyer: 'Hotel des Mille Collines', item: 'Traditional Agaseke', volume: '200 Units', match: 88 },
  ]);

  const toggleRole = () => {
    let nextRole: UserRole;
    if (userRole === 'RETAIL_BUYER') nextRole = 'WHOLESALE_BUYER';
    else if (userRole === 'WHOLESALE_BUYER') nextRole = 'SUPPLIER';
    else nextRole = 'RETAIL_BUYER';

    setUserRole(nextRole);
    // If Admin switches role, it counts as impersonation
    if (isAdminMode) {
      setIsImpersonating(true);
    } else {
      setIsImpersonating(false);
      // If not Admin, check for verification
      if (nextRole === 'SUPPLIER' && supplierStatus === 'UNVERIFIED') {
        setShowSetupModal(true);
      }
    }
    
    if (nextRole === 'RETAIL_BUYER' || nextRole === 'WHOLESALE_BUYER') setActiveTab('marketplace');
    else setActiveTab('dashboard');
  };

  const handleAdminLogin = () => {
    if (!isAdminMode) {
      setIsAdminMode(true);
      setIsImpersonating(false);
      setUserRole('ADMIN');
      setActiveTab('dashboard');
    } else {
      setIsAdminMode(false);
      setIsImpersonating(false);
      setUserRole('RETAIL_BUYER');
      setActiveTab('marketplace');
    }
  };

  if (!isLoggedIn) {
     return <SecurityScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('product');
  };

  const navItems = [
    { id: 'retail', label: 'Daily Deals', icon: <Layers className="w-4 h-4" />, roles: ['RETAIL_BUYER', 'WHOLESALE_BUYER', 'SUPPLIER', 'ADMIN'] },
    { id: 'marketplace', label: 'Wholesale Hub', icon: <Layers className="w-4 h-4" />, roles: ['RETAIL_BUYER', 'WHOLESALE_BUYER', 'SUPPLIER', 'ADMIN'] },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" />, roles: ['SUPPLIER', 'ADMIN'] },
    { id: 'inventory', label: 'Inventory', icon: <Package className="w-4 h-4" />, roles: ['SUPPLIER', 'ADMIN'] },
    { id: 'logistics', label: 'Logistics Hub', icon: <Package className="w-4 h-4" />, roles: ['SUPPLIER', 'RETAIL_BUYER', 'WHOLESALE_BUYER', 'ADMIN'] },
    { id: 'payments', label: 'Payments', icon: <ShoppingCart className="w-4 h-4" />, roles: ['SUPPLIER', 'RETAIL_BUYER', 'WHOLESALE_BUYER', 'ADMIN'] },
    { id: 'artisan', label: 'Artisan Portal', icon: <User className="w-4 h-4" />, roles: ['SUPPLIER', 'ADMIN'] },
    { id: 'shop-manager', label: 'Storefront Editor', icon: <Layers className="w-4 h-4" />, roles: ['SUPPLIER', 'ADMIN'] },
    { id: 'documentation', label: 'Legal & Invoices', icon: <FileText className="w-4 h-4" />, roles: ['SUPPLIER', 'RETAIL_BUYER', 'WHOLESALE_BUYER', 'ADMIN'] },
    { id: 'ai-studio', label: 'AI Marketing', icon: <BarChart3 className="w-4 h-4" />, roles: ['SUPPLIER', 'ADMIN'] },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Sidebar */}
      <aside className="w-[200px] bg-sidebar text-white flex flex-col py-5 flex-shrink-0">
        <div className="logo px-5 mb-8 font-extrabold text-2xl text-brand-accent tracking-tighter cursor-pointer" onClick={() => setActiveTab('marketplace')}>
          ELMART
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.filter(item => item.roles.includes(userRole)).map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`nav-item px-5 py-3 text-slate-400 cursor-pointer flex items-center gap-3 border-l-4 transition-all hover:bg-white/5 hover:text-white ${activeTab === item.id ? 'bg-white/10 text-white border-brand-accent' : 'border-transparent'}`}
            >
              {item.icon}
              <span className="font-medium text-xs">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="px-5 mt-auto text-center space-y-4">
          {isAdminMode && (
             <a 
               href="https://wa.me/250798582533" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-2 justify-center bg-emerald-500/10 border border-emerald-500/20 py-2 rounded text-[9px] font-black uppercase text-emerald-500 hover:bg-emerald-500/20 transition-all shadow-sm"
             >
                <MessageCircle className="w-3 h-3" />
                <span>Admin Support</span>
             </a>
          )}

          <button 
            onClick={toggleRole}
            className={`w-full text-[10px] font-bold uppercase tracking-widest py-2 rounded border transition-all mb-4 ${isAdminMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
          >
            <div className="flex flex-col items-center justify-center gap-1">
               <span className="opacity-70">{isAdminMode ? 'Impersonate As:' : 'Switch Role:'}</span>
               <div className="flex items-center gap-2">
                  {userRole === 'RETAIL_BUYER' ? 'Wholesale' : userRole === 'WHOLESALE_BUYER' ? 'Supplier' : 'Retail'}
                  {((userRole === 'RETAIL_BUYER' && consumerStatus === 'VERIFIED') || 
                    (userRole === 'WHOLESALE_BUYER' && consumerStatus === 'VERIFIED') ||
                    (userRole === 'SUPPLIER' && supplierStatus === 'VERIFIED')) && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 drop-shadow-sm" />
                  )}
               </div>
            </div>
          </button>
          <div className="text-slate-400 flex flex-col gap-2 py-2">
            <div 
              onClick={handleAdminLogin}
              className={`flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest py-2 rounded cursor-pointer transition-all border ${isAdminMode ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' : 'bg-white/5 border-white/10 hover:text-white'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdminMode ? 'Admin Portal Active' : 'System Admin Login'}</span>
            </div>
            
            {isImpersonating && (
              <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded text-center">
                 <p className="text-[8px] font-black uppercase text-amber-500 flex items-center justify-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> View Only Mode
                 </p>
                 <p className="text-[7px] text-amber-400 opacity-70">Admin Restricted Access</p>
              </div>
            )}
            <div className="flex items-center justify-center gap-2 text-xs cursor-pointer hover:text-white transition-colors mt-2">
              <User className="w-4 h-4" />
              <span>Settings</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-grow flex flex-col overflow-hidden relative">
        {isImpersonating && (
          <div className="bg-amber-500 text-sidebar px-6 py-2 flex items-center justify-between shadow-lg z-40 relative">
             <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Administrative Restricted Access • View-Only Session</span>
             </div>
             <p className="text-[9px] font-bold italic opacity-80">Sensitive data like account balance is automatically redacted for security.</p>
          </div>
        )}
        {showSetupModal && (
          <div className="absolute inset-0 bg-sidebar/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
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
                         <div className="w-10 h-10 bg-white rounded border border-border-subtle flex items-center justify-center text-text-muted">
                            <UploadCloud className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold uppercase">Upload PDF or JPG</p>
                            <p className="text-[9px] text-text-muted">Must be valid for the current fiscal year.</p>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Digital Signature</label>
                         <div className="h-24 bg-bg border border-dashed border-border-subtle rounded-lg flex flex-col items-center justify-center text-slate-400 gap-1 cursor-pointer hover:bg-slate-50 transition-colors">
                            <User className="w-6 h-6" />
                            <span className="text-[8px] font-bold uppercase tracking-tighter">Upload Sig</span>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Official Stamp</label>
                         <div className="h-24 bg-bg border border-dashed border-border-subtle rounded-lg flex flex-col items-center justify-center text-slate-400 gap-1 cursor-pointer hover:bg-slate-50 transition-colors">
                            <Layers className="w-6 h-6" />
                            <span className="text-[8px] font-bold uppercase tracking-tighter">Upload Stamp</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="pt-2">
                   <button 
                     onClick={() => { setSupplierStatus('VERIFIED'); setHasSetupProfile(true); setShowSetupModal(false); }}
                     className="w-full bg-sidebar text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-lg shadow-sidebar/20 active:translate-y-0"
                   >
                     Submit Business Credentials
                   </button>
                   <button onClick={() => setShowSetupModal(false)} className="w-full text-[10px] font-bold uppercase text-text-muted mt-4 hover:text-red-500 transition-colors">Cancel</button>
                </div>
             </motion.div>
          </div>
        )}

        {showConsumerVerifyModal && (
          <div className="absolute inset-0 bg-sidebar/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-white w-full max-w-sm rounded-2xl p-8 shadow-2xl space-y-6"
             >
                <div className="text-center">
                   <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck className="w-6 h-6" />
                   </div>
                   <h2 className="text-2xl font-black tracking-tight text-sidebar uppercase">Consumer KYC</h2>
                   <p className="text-text-muted text-xs font-bold leading-relaxed">Security requirement for large retail purchases.</p>
                </div>
                
                <div className="space-y-4">
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Email & Phone</label>
                      <input type="email" placeholder="email@example.rw" className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-sm font-medium outline-none mb-2" defaultValue="user@kigali.rw" />
                      <input type="text" placeholder="+250 78X XXX XXX" className="w-full bg-bg border border-border-subtle p-3 rounded-lg text-sm font-bold outline-none" defaultValue="+250 788 000 111" />
                   </div>

                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">National ID card / Passport</label>
                      <div className="bg-bg border border-dashed border-border-subtle p-6 rounded-lg flex flex-col items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors group">
                         <div className="w-10 h-10 bg-white rounded border border-border-subtle flex items-center justify-center text-text-muted group-hover:text-brand-primary transition-all">
                            <UploadCloud className="w-5 h-5" />
                         </div>
                         <p className="text-[10px] font-bold uppercase">Click to upload photo</p>
                      </div>
                   </div>
                </div>

                <div className="pt-2">
                   <button 
                     onClick={() => { setConsumerStatus('VERIFIED'); setShowConsumerVerifyModal(false); }}
                     className="w-full bg-sidebar text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-lg active:translate-y-0"
                   >
                     Verify Identity
                   </button>
                   <button onClick={() => setShowConsumerVerifyModal(false)} className="w-full text-[10px] font-bold uppercase text-text-muted mt-4 hover:text-red-500 transition-colors">Remind Me Later</button>
                </div>
             </motion.div>
          </div>
        )}
        {/* Header */}
        <header className="h-15 bg-white border-b border-border-subtle flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3 text-text-main">
            <strong className="text-sm">Market Summary</strong>
            <span className="text-text-muted text-xs border-l border-border-subtle pl-3">Kigali Sector B</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-bg border border-border-subtle rounded-full cursor-pointer hover:border-brand-primary transition-all group" onClick={() => setShowConsumerVerifyModal(true)}>
               <div className={`w-2 h-2 rounded-full ${consumerStatus === 'VERIFIED' ? 'bg-brand-success' : 'bg-brand-accent animate-pulse'}`} />
               <span className="text-[10px] font-black uppercase tracking-tight text-text-main">
                  {consumerStatus === 'VERIFIED' ? 'Verified Account' : 'Action Required: Identity Verification'}
               </span>
               {consumerStatus === 'VERIFIED' && <ShieldCheck className="w-3 h-3 text-brand-success" />}
            </div>

            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-bg border border-border-subtle rounded-md py-1.5 pl-9 pr-4 text-xs w-64 focus:ring-1 focus:ring-brand-primary outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-bg text-brand-primary px-3 py-1 rounded text-[11px] font-bold uppercase tracking-tight border border-brand-primary/20">
                KIGALI - LIVE
              </div>
              
              <div className="relative cursor-pointer hover:bg-bg p-2 rounded-full transition-colors" onClick={() => setActiveTab('payments')}>
                <ShoppingCart className="w-5 h-5 text-text-main" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-brand-primary text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </div>

              <div className="w-8 h-8 bg-slate-200 rounded-full border border-border-subtle" />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Ad Section - Ozon.by Style */}
          <div className="mb-4">
             <AdSection advertisements={MOCK_ADS} />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'retail' && (
              <motion.div 
                key="retail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Kikuu Style Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-40 md:h-48">
                   <div className="md:col-span-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 p-8 text-white relative overflow-hidden group">
                      <div className="relative z-10 space-y-2">
                         <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded tracking-widest">Kigali Flash Sale</span>
                         <h2 className="text-3xl font-black italic transform -skew-x-6">UP TO 50% OFF</h2>
                         <p className="text-xs font-medium opacity-90">Best prices for everyday essentials. Valid for MoMo payments only.</p>
                      </div>
                      <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 transform scale-150 rotate-12 pointer-events-none group-hover:scale-175 transition-transform duration-700">
                         <ShoppingCart className="w-full h-full" />
                      </div>
                   </div>
                   <div className="hidden md:flex rounded-xl bg-brand-primary p-6 text-white flex-col justify-center gap-2">
                       <p className="text-[10px] font-bold uppercase tracking-tight opacity-70">Bulk Savings</p>
                       <h3 className="text-xl font-bold leading-tight line-clamp-2">Small retailers buy together, save more!</h3>
                       <button className="bg-white text-brand-primary py-1.5 rounded-lg text-[10px] font-black uppercase mt-2">Join Group Buy</button>
                   </div>
                </div>

                {/* Categories - Kikuu Style Icons */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                   {[
                     { name: 'Food', icon: '🌽' },
                     { name: 'Beverages', icon: '🥤' },
                     { name: 'Home', icon: '🏠' },
                     { name: 'Artisan', icon: '🎨' },
                     { name: 'Electronics', icon: '📱' },
                     { name: 'Fashion', icon: '👕' },
                     { name: 'Tools', icon: '🛠️' },
                   ].map(cat => (
                     <div key={cat.name} className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-border-subtle flex items-center justify-center text-xl group-hover:bg-brand-primary group-hover:text-white group-hover:-translate-y-1 transition-all shadow-sm">
                           {cat.icon}
                        </div>
                        <span className="text-[10px] font-bold uppercase text-text-muted">{cat.name}</span>
                     </div>
                   ))}
                </div>

                {/* Retail Grid */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                     <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2 text-text-main">
                        <span className="w-1 h-4 bg-brand-accent rounded-full" /> Hot Deals for You
                     </h3>
                     <span className="text-[10px] font-bold text-brand-primary cursor-pointer">VIEW ALL →</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {MOCK_PRODUCTS.map((product) => (
                      <ProductCard key={product.id} product={product} onClick={() => handleProductClick(product)} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'marketplace' && (
              <motion.div 
                key="marketplace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Hero */}
                <div className="relative rounded-xl overflow-hidden h-48 md:h-56 bg-sidebar flex items-center p-8 md:p-12 shadow-lg border border-white/10">
                  <div className="z-10 text-white max-w-lg space-y-3">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Direct artisan connection.</h1>
                    <p className="text-slate-400 text-sm">Wholesale prices at consumer quantities. Connecting manufacturers to retailers and individuals across Rwanda.</p>
                    <button className="bg-brand-primary text-white px-5 py-2 rounded-md font-bold text-xs hover:bg-brand-primary/90 transition-all flex items-center gap-2">
                      Browse Full Catalog
                    </button>
                  </div>
                  <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none">
                    <img src="https://picsum.photos/seed/kigali/800/800" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MOCK_PRODUCTS.map((product) => (
                    <ProductCard key={product.id} product={product} onClick={() => handleProductClick(product)} />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* AI Intelligence Banner */}
                {userRole === 'SUPPLIER' && (
                  <div className="bg-gradient-to-r from-sidebar to-sidebar/90 p-4 rounded-xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 border border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-accent/20 text-brand-accent rounded-full flex items-center justify-center animate-pulse">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-white italic">AI Market Alert: High Demand Detected</p>
                        <p className="text-[10px] text-slate-400">Wholesale buyer in Kigali is seeking 200kg of Cement. Match: 98%.</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="bg-brand-primary text-white px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-widest hover:opacity-90">Respond to Lead</button>
                       <button className="bg-white/10 text-white px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-widest border border-white/10" onClick={() => setActiveTab('inventory')}>View Inventory Health</button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Monthly Revenue" value="RWF 4.2M" subValue="↑ 12.4% vs last month" kind="up" isPrivate={isImpersonating} />
                <StatCard title="Account Balance" value="RWF 1.8M" subValue="MoMo Wallet" kind="neutral" isPrivate={isImpersonating} />
                <StatCard title="MoMo Success Rate" value="98.2%" subValue="↑ Optimized Gateway" kind="up" />
                <StatCard title="Active Artisans" value="42" subValue="Gikondo District" kind="neutral" />

                <div className="panel col-span-1 md:col-span-2 lg:col-span-3">
                  <div className="panel-header">
                    <div className="panel-title">Recent Order Flow (Hybrid Market)</div>
                    <span className="text-[11px] text-brand-primary font-bold cursor-pointer hover:underline">View All Orders</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-border-subtle text-text-muted">
                          <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-tight">Order ID</th>
                          <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-tight">Buyer Type</th>
                          <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-tight">Location</th>
                          <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-tight">Payment</th>
                          <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-tight text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 italic">
                        {MOCK_ORDERS.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 text-xs font-mono font-medium text-text-main">#{order.id.toUpperCase()}</td>
                            <td className="px-4 py-3">
                               <div className="flex flex-col">
                                  <span className="text-xs font-bold text-text-main">{order.buyerName}</span>
                                  <span className={`text-[9px] font-black uppercase tracking-tighter ${order.buyerType === 'LARGE_SCALE' ? 'text-brand-primary' : 'text-emerald-600'}`}>
                                     {order.buyerType === 'LARGE_SCALE' ? 'Wholesale Account' : 'Retail Client'}
                                  </span>
                               </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-text-muted">{order.status === 'DELIVERED' ? 'Complete' : 'Kigali Hub'}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`status-pill ${order.paymentMethod === 'CARD' ? 'bg-indigo-100 text-indigo-700' : 'bg-yellow-100 text-yellow-800'}`}>
                                {order.paymentMethod}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs font-extra-bold text-right text-text-main">RWF {order.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="panel col-span-1 md:col-span-2 lg:col-span-1">
                  <div className="panel-header">
                    <div className="panel-title">Stock Alerts</div>
                  </div>
                  <div className="p-4 space-y-4">
                    {[
                      { name: 'Cassava Flour (Bulk)', pct: 12, low: true },
                      { name: 'Handmade Soap', pct: 65, low: false },
                      { name: 'Cooking Oil (10L)', pct: 42, low: false },
                      { name: 'Solar Lamps', pct: 5, low: true }
                    ].map((item) => (
                      <div key={item.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-muted">{item.name}</span>
                          <span className={`font-bold ${item.low ? 'text-red-500' : 'text-text-main'}`}>{item.pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${item.low ? 'bg-red-400' : 'bg-brand-primary'}`}
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel col-span-1 md:col-span-2 lg:col-span-4">
                  <div className="panel-header">
                    <div className="panel-title">Logistics & Recent Feedback</div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border-subtle">
                    <div className="p-4 space-y-3">
                      <div className="h-32 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-400 uppercase tracking-widest text-[10px]">LOCAL DELIVERY MAP VIEW</div>
                      <div className="flex justify-between items-end pt-3">
                         <div>
                            <p className="text-[10px] text-text-muted uppercase font-bold tracking-tight">Active Riders</p>
                            <p className="text-xl font-bold">24 Drivers</p>
                         </div>
                         <button className="bg-brand-success text-white px-4 py-1.5 rounded text-[11px] font-bold shadow-sm hover:opacity-90 transition-opacity">OPEN WHATSAPP CHAT</button>
                      </div>
                    </div>
                    <div className="p-4 overflow-y-auto max-h-48 space-y-4">
                      {[
                        { user: "Marie-Claire K.", text: "MoMo payment was seamless. Wholesale prices for my shop are better than the central market!"},
                        { user: "Jean de Dieu", text: "Quality of the handicrafts is superb. Fast logistics to Musanze."}
                      ].map((review, i) => (
                        <div key={i} className="pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-xs text-text-main">{review.user}</span>
                            <span className="text-brand-accent text-xs">★★★★★</span>
                          </div>
                          <p className="text-[11px] text-text-muted leading-relaxed font-medium italic">"{review.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'product' && selectedProduct && (
              <motion.div 
                key="product-detail"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-4xl mx-auto"
              >
                <ProductDetail product={selectedProduct} userRole={userRole} onBack={() => setActiveTab('marketplace')} onAddToCart={() => setCartCount(c => c + 1)} />
              </motion.div>
            )}

            {activeTab === 'ai-studio' && (
              <motion.div key="ai-studio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="panel p-6 bg-sidebar text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-2 italic">ELMART AI Marketing Studio</h2>
                    <p className="text-slate-400 text-xs font-medium">Generate localized video ads, social media assets, and cinematic commodity promos using ELMA-PRO Gen-AI.</p>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-full bg-brand-primary/10 blur-3xl rounded-full translate-x-1/2" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 space-y-6">
                    <div className="panel p-4">
                      <h3 className="panel-title mb-4 flex items-center gap-2">
                         <BarChart3 className="w-4 h-4 text-brand-primary" />
                         Ad Generator
                      </h3>
                      <div className="space-y-4">
                         <div>
                           <label className="text-[10px] font-bold uppercase text-text-muted mb-1 block">Select Product</label>
                           <select className="w-full bg-bg border border-border-subtle p-2 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-brand-primary">
                              {MOCK_PRODUCTS.map(p => <option key={p.id}>{p.name}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="text-[10px] font-bold uppercase text-text-muted mb-1 block">Campaign Mood</label>
                           <div className="grid grid-cols-2 gap-2">
                              {['Vibrant', 'Kinematik', 'Heritage', 'Minimal'].map(t => (
                                <button key={t} className="px-3 py-2 bg-bg border border-border-subtle rounded text-[9px] font-black uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all">{t}</button>
                              ))}
                           </div>
                         </div>
                         <div>
                            <label className="text-[10px] font-bold uppercase text-text-muted mb-1 block">Voiceover Language</label>
                            <select className="w-full bg-bg border border-border-subtle p-2 rounded text-xs">
                               <option>Kinyarwanda</option>
                               <option>English</option>
                               <option>French</option>
                            </select>
                         </div>
                         <button className="w-full bg-brand-primary text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20">
                           Initialize AI Production
                         </button>
                      </div>
                    </div>

                    <div className="panel p-5 border-t-4 border-t-brand-accent">
                       <h3 className="text-xs font-black uppercase tracking-widest mb-3 italic">Production Status</h3>
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 bg-brand-success rounded-full animate-pulse" />
                             <p className="text-[10px] font-medium text-text-main">AI Engine Warm: Ready for batch processing</p>
                          </div>
                          <div className="p-3 bg-bg border border-border-subtle rounded-lg">
                             <p className="text-[9px] text-text-muted mb-1">Max Video Length: **30 Seconds**</p>
                             <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-brand-success" />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    <div className="panel p-0 overflow-hidden">
                       <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-slate-50/50">
                          <div>
                             <h3 className="text-xs font-black uppercase tracking-tight">Commodity Video Hub</h3>
                             <p className="text-[9px] text-text-muted italic">All AI-generated commodity promotions in one cinematic grid.</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-bold px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded uppercase">BETA v2.1</span>
                          </div>
                       </div>
                       <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                          {MOCK_PRODUCTS.filter(p => p.promoVideoUrl).map(product => (
                            <div key={product.id} className="relative aspect-video bg-sidebar rounded-xl overflow-hidden group shadow-lg border border-white/5">
                               {/* Mock Video Element */}
                               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                               <img src={product.images[0]} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                               
                               <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-2xl">
                                     <Play className="w-6 h-6 fill-current" />
                                  </div>
                               </div>

                               <div className="absolute bottom-3 left-3 z-30">
                                  <p className="text-[10px] font-black text-white italic truncate pr-8">{product.name} PROMO</p>
                                  <div className="flex items-center gap-2 mt-1">
                                     <span className="text-[8px] font-bold text-slate-400">30s HD</span>
                                     <span className="text-[8px] font-bold text-brand-accent">9.8 Score</span>
                                  </div>
                               </div>

                               <button className="absolute top-3 right-3 z-30 p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all border border-white/10">
                                  <Download className="w-3.5 h-3.5" />
                               </button>
                            </div>
                          ))}
                          {/* Placeholder for others */}
                          <div className="aspect-video border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-4">
                             <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                                <Plus className="w-5 h-5" />
                             </div>
                             <p className="text-[10px] font-bold text-slate-400">More Commodity Videos Coming Soon</p>
                          </div>
                       </div>
                    </div>

                    <div className="panel p-5 flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-br from-white to-slate-50">
                       <div className="w-16 h-16 bg-brand-primary/5 rounded-full flex items-center justify-center text-brand-primary shadow-inner">
                          <Layers className="w-8 h-8" />
                       </div>
                       <div className="max-w-xs">
                          <p className="text-sm font-black italic tracking-tight uppercase">AI Creative Insights</p>
                          <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                             Products with **Cinematic Promos** see a **42% increase** in wholesale inquiries from the Southern Province.
                          </p>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'documentation' && (
              <motion.div key="documentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <div className="flex justify-between items-center">
                    <div>
                       <h2 className="text-xl font-bold">Registry of Documentation</h2>
                       <p className="text-text-muted text-xs font-medium">Verified invoices, tax documents, and legal proofs for all transactions.</p>
                    </div>
                    <button className="bg-bg border border-border-subtle px-4 py-2 rounded text-[10px] font-bold uppercase tracking-tight flex items-center gap-2">
                       <FileText className="w-3 h-3" /> Export Archive
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-4">
                    {MOCK_ORDERS.map(order => (
                      <div key={order.id} className="panel p-4 space-y-4">
                         <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                            <div>
                               <p className="text-[10px] font-bold text-brand-primary uppercase">Order ref: {order.id}</p>
                               <p className="text-sm font-bold">{order.buyerName}</p>
                            </div>
                            <span className={`status-pill ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                               {order.status}
                            </span>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {order.invoices.map(inv => (
                              <div key={inv.id} className="bg-bg border border-border-subtle p-3 rounded-lg group cursor-pointer hover:border-brand-primary transition-all">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white border border-border-subtle rounded flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                                       <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-bold uppercase truncate">{inv.type.replace('_', ' ')}</p>
                                       <p className="text-[9px] text-text-muted">{new Date(inv.createdAt).toLocaleDateString()}</p>
                                    </div>
                                 </div>
                                 <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                                    <span className="text-[9px] font-bold text-brand-primary">VIEW PDF</span>
                                    <span className="text-[9px] text-text-muted">ID: {inv.id}</span>
                                 </div>
                              </div>
                            ))}
                            {/* Visual representation of steps */}
                            <div className="flex items-center gap-1 col-span-full pt-2">
                               {[1, 2, 3, 4].map(s => (
                                 <div key={s} className="flex-1 flex flex-col gap-1 items-center">
                                    <div className={`h-1 w-full rounded-full ${order.currentStep >= s ? 'bg-brand-primary' : 'bg-slate-200'}`} />
                                    <span className={`text-[8px] font-bold uppercase ${order.currentStep >= s ? 'text-brand-primary' : 'text-slate-400'}`}>
                                       {['Init', 'Paid', 'Ship', 'Rcvd'][s-1]}
                                    </span>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-border-subtle shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-brand-primary rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tight text-sidebar">Stock Intelligence</h2>
                      <p className="text-xs text-text-muted font-bold">AI-Powered monitoring for high-volume trade.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-bg px-4 py-2 rounded-lg border border-border-subtle">
                     <div className="flex flex-col text-right">
                        <span className="text-[9px] font-black uppercase text-brand-primary">WhatsApp Alerts</span>
                        <span className="text-[10px] font-bold text-brand-success">ACTIVE (+250 78x)</span>
                     </div>
                     <div 
                       onClick={() => setStockAlertsEnabled(!stockAlertsEnabled)}
                       className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${stockAlertsEnabled ? 'bg-brand-success' : 'bg-slate-300'}`}
                     >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${stockAlertsEnabled ? 'left-5.5' : 'left-0.5'}`} />
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   <div className="lg:col-span-2 space-y-4">
                      <div className="panel p-0 overflow-hidden">
                         <div className="p-4 border-b border-border-subtle flex justify-between items-center italic bg-slate-50/50">
                            <span className="text-xs font-black uppercase tracking-tight">Active Stock Registry</span>
                            <span className="text-[10px] font-bold text-text-muted italic">Syncing with ELMART Cloud...</span>
                         </div>
                         <div className="overflow-x-auto">
                            <table className="w-full text-left">
                               <thead>
                                  <tr className="bg-bg text-text-muted border-b border-border-subtle">
                                     <th className="px-4 py-2 text-[9px] font-black uppercase">Product</th>
                                     <th className="px-4 py-2 text-[9px] font-black uppercase">Current Stock</th>
                                     <th className="px-4 py-2 text-[9px] font-black uppercase">AI Prediction</th>
                                     <th className="px-4 py-2 text-[9px] font-black uppercase text-right">Action</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100">
                                  {MOCK_PRODUCTS.slice(0, 8).map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                       <td className="px-4 py-4">
                                          <div className="flex flex-col">
                                             <span className="text-xs font-bold text-text-main">{p.name}</span>
                                             <span className="text-[9px] text-text-muted uppercase">Min Alert: {p.moq || 5}</span>
                                          </div>
                                       </td>
                                       <td className="px-4 py-4">
                                          <div className="flex items-center gap-2">
                                             <input 
                                               type="number" 
                                               defaultValue={p.stock} 
                                               className="w-16 bg-bg border border-border-subtle p-1 rounded text-xs font-bold focus:ring-1 focus:ring-brand-primary outline-none"
                                             />
                                             <span className={`text-[10px] font-bold ${p.stock < 10 ? 'text-brand-accent animate-pulse' : 'text-emerald-500'}`}>
                                                {p.stock < 10 ? 'CRITICAL' : 'STABLE'}
                                             </span>
                                          </div>
                                       </td>
                                       <td className="px-4 py-4">
                                          <div className="flex flex-col">
                                             <span className="text-[10px] font-black text-brand-primary">Out in 4 days</span>
                                             <span className="text-[8px] text-text-muted uppercase tracking-tighter italic">Based on market trends</span>
                                          </div>
                                       </td>
                                       <td className="px-4 py-4 text-right">
                                          <button className="text-[10px] font-black uppercase text-brand-primary underline hover:text-sidebar transition-colors">Update Logs</button>
                                       </td>
                                    </tr>
                                  ))}
                               </tbody>
                            </table>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="panel p-5 bg-sidebar text-white shadow-xl">
                         <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-brand-accent/20 text-brand-accent rounded-lg flex items-center justify-center">
                               <BarChart3 className="w-4 h-4" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest italic">Lead Intelligence AI</h3>
                         </div>
                         <p className="text-[10px] text-slate-400 mb-4 font-medium leading-relaxed italic">
                            Our AI detected high-volume buyers currently searching for your category in the **Eastern Province**.
                         </p>
                         <div className="space-y-3">
                            {demandLeads.map(lead => (
                              <div key={lead.id} className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer group">
                                 <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-black uppercase text-brand-accent">{lead.match}% Global Match</span>
                                    <span className="text-[8px] bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded uppercase">NEW LEAD</span>
                                 </div>
                                 <p className="text-[11px] font-extrabold text-white group-hover:text-brand-accent transition-colors">{lead.buyer}</p>
                                 <p className="text-[9px] text-slate-400">Looking for: <span className="text-white">{lead.volume}</span> of {lead.item}</p>
                              </div>
                            ))}
                         </div>
                         <button className="w-full mt-4 bg-brand-accent text-sidebar py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-accent/20">
                            Apply for Partnership
                         </button>
                      </div>

                      <div className="panel p-5 border-t-4 border-t-amber-400">
                         <div className="flex items-center gap-2 mb-3 text-amber-700">
                            <ShieldCheck className="w-5 h-5" />
                            <h3 className="text-xs font-black uppercase">Alert Configuration</h3>
                         </div>
                         <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs border-b border-slate-50 pb-2">
                               <span className="text-text-muted font-bold">Email Notifications</span>
                               <span className="text-brand-success font-black uppercase tracking-tighter">Verified</span>
                            </div>
                            <div className="flex items-center justify-between text-xs border-b border-slate-50 pb-2">
                               <span className="text-text-muted font-bold">WhatsApp Hook</span>
                               <span className="text-brand-success font-black uppercase tracking-tighter">Connected</span>
                            </div>
                            <p className="text-[9px] text-text-muted italic leading-tight">
                               High-demand leads and critical stock levels are pushed instantly to your mobile.
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'shop-manager' && (
              <motion.div key="shop-manager" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Supplier Storefront Editor</h2>
                  <button className="bg-brand-primary text-white px-4 py-2 rounded text-xs font-bold font-mono">+ New Entry</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 panel">
                    <div className="panel-header">
                      <div className="panel-title">My Digital Catalog</div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-border-subtle text-text-muted">
                             <th className="px-4 py-2.5 text-[10px] font-bold uppercase">Product</th>
                             <th className="px-4 py-2.5 text-[10px] font-bold uppercase">Status</th>
                             <th className="px-4 py-2.5 text-[10px] font-bold uppercase text-right">Price (RWF)</th>
                             <th className="px-4 py-2.5 text-[10px] font-bold uppercase text-right">Images</th>
                             <th className="px-4 py-2.5 text-[10px] font-bold uppercase text-right">Stock</th>
                             <th className="px-4 py-2.5 text-[10px] font-bold uppercase text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic">
                          {MOCK_PRODUCTS.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3 text-xs font-bold">{p.name}</td>
                              <td className="px-4 py-3">
                                 <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    <span className="text-[10px] font-bold text-emerald-800">Published</span>
                                 </div>
                              </td>
                              <td className="px-4 py-3 text-xs text-right font-mono font-bold">
                                 {(p.discountPrice || p.price).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-xs text-right">
                                 <span className={`font-black ${p.images.length >= 5 ? 'text-brand-success' : 'text-brand-accent animate-pulse'}`}>
                                    {p.images.length}/5
                                 </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-right">{p.stock}</td>
                              <td className="px-4 py-3 text-right">
                                 <button 
                                   disabled={isImpersonating}
                                   className={`font-black text-[9px] uppercase underline ${isImpersonating ? 'text-text-muted cursor-not-allowed opacity-50' : 'text-brand-primary hover:text-sidebar'}`}
                                 >
                                   {isImpersonating ? 'Restricted' : 'Media Studio'}
                                 </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="panel p-5 bg-gradient-to-br from-sidebar to-sidebar/90 text-white border-none shadow-2xl">
                       <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-brand-primary/20 text-brand-primary rounded-lg flex items-center justify-center">
                             <Layers className="w-4 h-4" />
                          </div>
                          <h3 className="text-xs font-black uppercase tracking-widest italic">AI Bulk Media Processor</h3>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                             <p className="text-[10px] font-black uppercase text-brand-accent mb-2">Upload Short Promos</p>
                             <div className="border-2 border-dashed border-white/20 rounded h-24 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-all">
                                <Plus className="w-5 h-5 text-slate-400 mb-1" />
                                <p className="text-[9px] text-slate-400">Drag & Drop Video<br/>(Max 30s-MP4/MOV)</p>
                             </div>
                          </div>

                          <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                             <p className="text-[10px] font-black uppercase text-brand-primary mb-2">AI Media Optimization</p>
                             <div className="space-y-2">
                                <div className="flex justify-between text-[9px] font-bold">
                                   <span className="text-slate-400">Cinematic Score</span>
                                   <span className="text-brand-success">A++ Grade</span>
                                </div>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                   <div className="w-full h-full bg-brand-success" />
                                </div>
                             </div>
                          </div>
                          
                          <button 
                            disabled={isImpersonating}
                            onClick={() => isImpersonating ? alert('Action Restricted: Admin cannot modify supplier media.') : alert('Launching AI Production...')}
                            className={`w-full py-3 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-xl transition-all ${isImpersonating ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50' : 'bg-brand-primary text-white shadow-brand-primary/20 hover:scale-[1.02] active:scale-95'}`}
                          >
                             {isImpersonating ? 'Locked By Privacy Protocol' : 'Generate All Promos'}
                          </button>
                       </div>
                    </div>

                    <div className="panel p-5 border-t-4 border-t-amber-400 flex items-center gap-4">
                       <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-amber-700">Media Compliance</p>
                          <p className="text-[9px] text-text-muted italic leading-tight">Your products must have at least 5 High-Res images to be eligible for AI Premium ranking.</p>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Shared WhatsApp floating button */}
      <a 
        href={isAdminMode ? "https://wa.me/250798582533" : "https://wa.me/250780000000"} 
        className="fixed bottom-6 right-6 bg-brand-success text-white p-3.5 rounded-full shadow-lg z-50 hover:scale-105 transition-transform flex items-center gap-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-widest ml-1">{isAdminMode ? 'System Admin Chat' : 'Logistics Support'}</span>
      </a>
    </div>
  );
}

function AdSection({ advertisements }: { advertisements: Advertisement[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % advertisements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [advertisements.length]);

  return (
    <div className="relative rounded-xl overflow-hidden group shadow-md border border-border-subtle h-32 md:h-40 bg-sidebar">
      <AnimatePresence mode="wait">
        <motion.div 
          key={advertisements[current].id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <img 
            src={advertisements[current].imageUrl} 
            referrerPolicy="no-referrer" 
            className="w-full h-full object-cover opacity-60" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sidebar via-sidebar/40 to-transparent p-6 md:p-8 flex flex-col justify-center">
             <div className="max-w-md space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent bg-white/10 px-2 py-0.5 rounded w-fit inline-block mb-1">SPONSORED BY {advertisements[current].companyName}</span>
                <h3 className="text-xl md:text-2xl font-black text-white italic tracking-tighter leading-tight">{advertisements[current].title}</h3>
                <p className="text-[10px] md:text-xs text-slate-300 line-clamp-1">{advertisements[current].description}</p>
             </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-3 right-4 flex gap-2">
         {advertisements.map((_, i) => (
           <button 
             key={i} 
             onClick={() => setCurrent(i)}
             className={`w-1.5 h-1.5 rounded-full transition-all ${current === i ? 'bg-brand-accent w-4' : 'bg-white/30'}`}
           />
         ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, subValue, kind, isPrivate }: { title: string, value: string, subValue: string, kind: 'up' | 'neutral', isPrivate?: boolean }) {
  return (
    <div className={`stat-card relative overflow-hidden group ${isPrivate ? 'border-amber-500/20 shadow-amber-500/5' : ''}`}>
      {isPrivate && (
        <div className="absolute top-2 right-2">
           <Lock className="w-2.5 h-2.5 text-amber-500 opacity-60" />
        </div>
      )}
      <span className="text-[10px] uppercase font-bold text-text-muted tracking-tight">{title}</span>
      {isPrivate ? (
        <div className="flex items-center gap-2">
           <span className="text-xl font-bold text-text-muted blur-[2px] select-none">RWF ******</span>
           <span className="text-[7px] font-black uppercase text-amber-600 bg-amber-100 px-1 rounded">Hidden</span>
        </div>
      ) : (
        <span className="text-2xl font-bold text-text-main tabular-nums">{value}</span>
      )}
      <span className={`text-[10px] font-bold ${kind === 'up' ? 'text-brand-success' : 'text-text-muted'}`}>{subValue}</span>
    </div>
  );
}

function SecurityScreen({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = React.useState('');
  
  return (
    <div className="fixed inset-0 bg-sidebar z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl text-center space-y-8 shadow-2xl"
      >
        <div className="space-y-2">
          <div className="w-16 h-16 bg-brand-accent/20 text-brand-accent rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">ELMART SECURE</h2>
          <p className="text-xs text-slate-400 font-medium tracking-tight">Identity verified access strictly for ELMART Partners & Authorized Admins.</p>
        </div>

        <div className="space-y-4">
           <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`w-3 h-3 rounded-full border border-white/20 transition-all duration-300 ${pin.length >= i ? 'bg-brand-accent scale-110 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-white/5'}`} />
              ))}
           </div>
           
           <div className="grid grid-cols-3 gap-4 max-w-[240px] mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map(n => (
                <button 
                  key={n}
                  onClick={() => {
                    if (n === 'C') setPin('');
                    else if (n === '✓') { if (pin.length >= 4) onLogin(); }
                    else if (pin.length < 6) setPin(p => p + n);
                  }}
                  className="w-full aspect-square rounded-xl bg-white/5 border border-white/10 text-white font-black hover:bg-brand-accent hover:text-sidebar hover:scale-105 transition-all active:scale-95"
                >
                  {n}
                </button>
              ))}
           </div>
        </div>

        <div className="pt-4 space-y-3">
           <p className="text-[10px] text-slate-500 italic font-medium">Standard encryption active. All sessions are monitored.</p>
           <div className="flex items-center justify-center gap-2 opacity-50 grayscale">
              <img src="https://picsum.photos/seed/visa/40/25" className="h-4" />
              <img src="https://picsum.photos/seed/mc/40/25" className="h-4" />
              <img src="https://picsum.photos/seed/momo/40/25" className="h-4" />
           </div>
        </div>
      </motion.div>
    </div>
  );
}

function ProductCard({ product, onClick }: { product: Product, onClick: () => void, [key: string]: any }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-white rounded-lg border border-border-subtle overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all h-full flex flex-col"
    >
      <div className="h-40 overflow-hidden relative grayscale-[30%] group-hover:grayscale-0 transition-all duration-500">
        <img src={product.images[0]} referrerPolicy="no-referrer" alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isArtisan && (
            <span className="bg-brand-primary text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Artisan</span>
          )}
          {product.intelligence && (
            <span className="bg-sidebar/90 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-sm border border-white/20">
              Score: {(Object.values(product.intelligence).reduce((a,b) => a+b, 0) / 4).toFixed(1)}
            </span>
          )}
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">{product.category}</span>
            <div className="flex items-center gap-0.5 text-brand-accent text-[10px] font-bold">
              ★ {product.rating}
            </div>
          </div>
          <h3 className="font-bold text-text-main text-sm line-clamp-1">{product.name}</h3>
        </div>
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-50">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
               <span className="text-xs font-bold text-text-main">
                  {(product.discountPrice || product.price).toLocaleString()} RWF
               </span>
               {product.discountPrice && (
                  <span className="text-[9px] text-text-muted line-through">
                     {product.price.toLocaleString()}
                  </span>
               )}
            </div>
            {product.bulkPrice && (
              <span className="text-[9px] text-brand-primary font-bold">Bulk: {product.bulkPrice.toLocaleString()}</span>
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

function ProductDetail({ product, userRole, onBack, onAddToCart }: { product: Product, userRole: UserRole, onBack: () => void, onAddToCart: () => void }) {
  const [activeImg, setActiveImg] = useState(0);
  const [purchaseType, setPurchaseType] = useState<'single' | 'bulk'>('single');
  const [quantity, setQuantity] = useState(1);
  const [showSecureOverlay, setShowSecureOverlay] = useState(false);

  return (
    <div className="panel bg-white p-6 md:p-8 space-y-8 relative overflow-hidden">
      {showSecureOverlay && (
        <SecurePaymentGateway 
          amount={purchaseType === 'single' ? (product.discountPrice || product.price) * quantity : (product.bulkPrice || product.price) * quantity} 
          buyerType={userRole === 'WHOLESALE_BUYER' ? 'LARGE_SCALE' : 'SMALL_SCALE'}
          onClose={() => setShowSecureOverlay(false)}
          onSuccess={() => {
            setShowSecureOverlay(false);
            onAddToCart();
          }}
        />
      )}

      <button onClick={onBack} className="text-text-muted flex items-center gap-2 hover:text-text-main transition-colors font-bold text-xs uppercase tracking-widest">
        ← Marketplace
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-slate-50 border border-slate-100 relative group">
            <img src={product.images[activeImg]} referrerPolicy="no-referrer" alt={product.name} className="w-full h-full object-cover" />
            {product.promoVideoUrl && (
              <button 
                onClick={() => alert('Launching AI Cinematic Promo (30s)...')}
                className="absolute bottom-4 right-4 bg-brand-primary text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Play AI Promo
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
                className={`aspect-square rounded border-2 transition-all overflow-hidden ${activeImg === i ? 'border-brand-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex gap-2">
               <span className="status-pill bg-slate-100 text-slate-600 tracking-tight">{product.category}</span>
               {product.isArtisan && <span className="status-pill bg-emerald-100 text-emerald-700 tracking-tight">Artisan Hub</span>}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-main">{product.name}</h1>
            <p className="text-xs text-text-muted font-medium">Supplier: <span className="text-brand-primary underline">{product.supplierName}</span></p>
          </div>

          <p className="text-text-muted text-xs leading-relaxed font-medium">{product.description}</p>

          <div className="flex flex-col gap-3">
             <a 
               href={`https://wa.me/250000000?text=Hello ELMART Supplier, I am interested in ${product.name}`}
               target="_blank"
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
          </div>

          {product.intelligence && (
            <div className="panel p-3 bg-bg/50 space-y-2 border-brand-primary/20">
              <p className="text-[10px] font-bold uppercase text-brand-primary flex items-center gap-1">
                <BarChart3 className="w-3 h-3" /> Smart Intelligence Index
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {[
                  { label: 'Durability', val: product.intelligence.durabilityScore },
                  { label: 'Market Value', val: product.intelligence.valueForMoney },
                  { label: 'Efficiency', val: product.intelligence.priceCompetitiveness },
                  { label: 'Return Rate', val: product.intelligence.returnRate, inv: true }
                ].map(stat => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-[10px] text-text-muted">{stat.label}</span>
                    <span className={`text-[10px] font-bold ${stat.inv ? (stat.val > 2 ? 'text-red-500' : 'text-brand-success') : (stat.val > 8 ? 'text-brand-success' : 'text-text-main')}`}>
                      {stat.val}{stat.inv ? '%' : '/10'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
             <div 
               onClick={() => setPurchaseType('single')}
               className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${purchaseType === 'single' ? 'border-brand-primary bg-sky-50/30' : 'border-slate-100 grayscale opacity-60'}`}
             >
               <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Standard Unit</p>
               <div className="flex items-center gap-2">
                 <p className="text-lg font-bold">{(product.discountPrice || product.price).toLocaleString()} RWF</p>
                 {product.discountPrice && (
                   <span className="text-xs text-text-muted line-through">{product.price.toLocaleString()} RWF</span>
                 )}
               </div>
             </div>
             {product.bulkPrice && (
               <div 
                 onClick={() => setPurchaseType('bulk')}
                 className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${purchaseType === 'bulk' ? 'border-brand-primary bg-sky-50/30' : 'border-slate-100 grayscale opacity-60'}`}
               >
                 <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Bulk Case (Min {product.minBulkOrder})</p>
                 <p className="text-lg font-bold">{product.bulkPrice.toLocaleString()} RWF</p>
               </div>
             )}
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex items-center border border-border-subtle rounded overflow-hidden h-10">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-3 hover:bg-slate-50 border-r border-border-subtle">-</button>
                <input type="number" value={quantity} readOnly className="w-10 text-center font-bold text-xs" />
                <button onClick={() => setQuantity(q => q+1)} className="px-3 hover:bg-slate-50 border-l border-border-subtle">+</button>
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
              className="momo-button w-full h-12 text-sm shadow-none uppercase tracking-widest font-extrabold flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Checkout Securely
            </button>

            <div className="flex items-center justify-center gap-4 pt-2 opacity-50 grayscale">
               <img src="https://picsum.photos/seed/visa/60/20" className="h-3" referrerPolicy="no-referrer" />
               <img src="https://picsum.photos/seed/mtn/60/20" className="h-4" referrerPolicy="no-referrer" />
               <img src="https://picsum.photos/seed/pci/60/20" className="h-4" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurePaymentGateway({ amount, buyerType, onClose, onSuccess }: { amount: number, buyerType: 'SMALL_SCALE' | 'LARGE_SCALE', onClose: () => void, onSuccess: () => void }) {
   const [method, setMethod] = useState<'MOMO' | 'CARD'>('MOMO');
   const [step, setStep] = useState<'INIT' | 'PROCESSING' | 'SUCCESS'>('INIT');
   const [paymentInfo, setPaymentInfo] = useState({ name: '', email: '' });
  
  const handlePayment = () => {
    setStep('PROCESSING');
    setTimeout(() => {
      setStep('SUCCESS');
      setTimeout(onSuccess, 2000);
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-white z-50 flex flex-col"
    >
      <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-sidebar text-white">
        <div>
          <h2 className="text-sm font-bold tracking-tight">ELMART SECURE PAY</h2>
          <p className="text-[10px] text-slate-400">Escrow-Protected Gateway (EPG v3.1)</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="bg-bg p-4 rounded-lg border border-border-subtle flex justify-between items-center italic">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase">Total Payable</p>
            <p className="text-xl font-black text-text-main">RWF {amount.toLocaleString()}</p>
          </div>
          <div className="text-right">
             <span className="status-pill bg-brand-success/10 text-brand-success text-[9px] font-black tracking-tighter">ESCROW ACTIVE</span>
          </div>
        </div>

        {step === 'INIT' && (
          <div className="space-y-4">
            <div className="flex gap-2">
               <button 
                 onClick={() => setMethod('MOMO')}
                 className={`flex-1 py-3 border-2 rounded-lg transition-all flex flex-col items-center gap-1 ${method === 'MOMO' ? 'border-brand-primary bg-sky-50' : 'border-slate-100 grayscale opacity-60'}`}
               >
                 <span className="text-[10px] font-bold uppercase">Mobile Money</span>
                 <img src="https://picsum.photos/seed/mtn/40/40" className="w-8 h-8 rounded" referrerPolicy="no-referrer" />
               </button>
               <button 
                 onClick={() => setMethod('CARD')}
                 className={`flex-1 py-3 border-2 rounded-lg transition-all flex flex-col items-center gap-1 ${method === 'CARD' ? 'border-brand-primary bg-sky-50' : 'border-slate-100 grayscale opacity-60'}`}
               >
                 <span className="text-[10px] font-bold uppercase">Credit Card</span>
                 <Layers className="w-8 h-8 text-slate-400" />
               </button>
            </div>

            <div className="space-y-3">
               {method === 'MOMO' ? (
                 <div className="space-y-3">
                   <p className="text-[11px] text-text-muted">Enter your MoMo registered number to trigger a secure USSD push.</p>
                   <div className="relative">
                      <input type="text" placeholder="078 XXX XXXX" className="w-full bg-bg border border-border-subtle p-3 rounded-lg font-bold text-sm outline-none focus:ring-1 focus:ring-brand-primary" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-brand-primary underline cursor-pointer">Verify</span>
                   </div>
                 </div>
               ) : (
                 <div className="space-y-3">
                    <p className="text-[11px] text-text-muted">PCI-DSS Encrypted Merchant processing via ELMART Bank Connect.</p>
                    <input type="text" placeholder="Cardholder Name" className="w-full bg-bg border border-border-subtle p-3 rounded-lg font-medium text-sm outline-none mb-2" onChange={(e) => setPaymentInfo(p => ({...p, name: e.target.value}))} />
                    <input type="text" placeholder="Card Number" className="w-full bg-bg border border-border-subtle p-3 rounded-lg font-medium text-sm outline-none" />
                    <div className="flex gap-2">
                       <input type="text" placeholder="MM/YY" className="flex-1 bg-bg border border-border-subtle p-3 rounded-lg font-medium text-sm outline-none" />
                       <input type="text" placeholder="CVV" className="flex-1 bg-bg border border-border-subtle p-3 rounded-lg font-medium text-sm outline-none" />
                    </div>
                 </div>
               )}
            </div>

            <div className="pt-4">
               <button 
                 onClick={handlePayment}
                 className="w-full bg-sidebar text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-colors"
               >
                 Authorize Payment
               </button>
               <p className="text-[9px] text-center text-text-muted mt-3">
                 By paying, you accept the **ELMART Escrow Agreement**. Your funds are held until you confirm delivery.
               </p>
            </div>
          </div>
        )}

        {step === 'PROCESSING' && (
          <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center h-[300px]">
             <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
             <div>
                <p className="font-bold text-sm uppercase tracking-tight">Verifying with {method === 'MOMO' ? 'MTN Network' : 'Bank Gateway'}</p>
                <p className="text-[10px] text-text-muted mt-1">Please do not refresh. This is a multi-layered security handshake.</p>
             </div>
             {method === 'MOMO' && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg animate-pulse">
                   <p className="text-[10px] font-bold text-yellow-800 italic uppercase">CHECK YOUR PHONE FOR PIN PROMPT</p>
                </div>
             )}
          </div>
        )}

        {step === 'SUCCESS' && (
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="flex flex-col items-center justify-center p-6 space-y-4 text-center h-full"
           >
              <div className="w-16 h-16 bg-brand-success text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-success/30">
                 <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
              <div className="space-y-1">
                 <p className="text-lg font-black text-text-main uppercase tracking-tighter italic">Transaction Secure</p>
                 <p className="text-[10px] text-text-muted">Invoice #INV-{Math.floor(Math.random()*100000)} generated and sent to email.</p>
              </div>
              
              <div className={`w-full bg-white border border-border-subtle rounded-xl p-4 shadow-sm text-left scale-90 ${buyerType === 'LARGE_SCALE' ? 'border-t-4 border-t-brand-primary' : 'border-t-4 border-t-emerald-500'}`}>
                 <div className="flex justify-between items-start mb-4">
                    <div className="text-[8px] font-black uppercase tracking-widest text-brand-primary leading-none">ELMART OFFICIAL {buyerType === 'LARGE_SCALE' ? 'TAX INVOICE' : 'RECEIPT'}</div>
                    <div className="w-10 h-10 bg-slate-100 rounded border flex items-center justify-center text-[6px] font-black italic">ELMART STAMP</div>
                 </div>
                 <div className="space-y-1 mb-4">
                    <p className="text-[10px] font-bold text-text-main flex justify-between items-center">
                       <span>Total Payable:</span>
                       <span>RWF {amount.toLocaleString()}</span>
                    </p>
                    <p className="text-[7px] text-text-muted flex justify-between items-center">
                       <span>Transaction Type:</span>
                       <span className="font-bold">{buyerType === 'LARGE_SCALE' ? 'WHOLESALE B2B' : 'RETAIL B2C'}</span>
                    </p>
                    <p className="text-[7px] text-text-muted flex justify-between items-center">
                       <span>Date:</span>
                       <span>{new Date().toLocaleDateString()}</span>
                    </p>
                 </div>
                 <div className="flex justify-end pt-2 border-t border-slate-100 items-end gap-3">
                    <div className="flex flex-col items-center">
                       <span className="text-[5px] font-bold uppercase text-slate-300">Auth Signature</span>
                       <div className="h-4 w-12 bg-slate-50 border border-dashed rounded font-serif text-[6px] flex items-center justify-center opacity-50 italic">Digital Sig</div>
                    </div>
                    {buyerType === 'LARGE_SCALE' && (
                       <div className="flex flex-col items-center">
                          <span className="text-[5px] font-bold uppercase text-slate-300">RRA EBM V2</span>
                          <div className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center">
                             <ShieldCheck className="w-3 h-3 text-brand-primary" />
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           </motion.div>
        )}
      </div>
    </motion.div>
  );
}
