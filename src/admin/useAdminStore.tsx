/**
 * useAdminStore.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for ELMART.
 * Every view and component reads from here.
 * Admin panel writes to here.
 * Uses React Context + useReducer so all components re-render on change.
 *
 * USAGE
 *   // wrap app once (already done in App.tsx):
 *   <AdminStoreProvider> ... </AdminStoreProvider>
 *
 *   // read anywhere:
 *   const { state } = useAdminStore();
 *
 *   // write anywhere (admin panel):
 *   const { dispatch } = useAdminStore();
 *   dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, useReducer } from 'react';
import { Product, Advertisement } from '../types';
import { MOCK_PRODUCTS, MOCK_ADS } from '../mockData';

// ─── NAV TAB ─────────────────────────────────────────────────────────────────

export type TabId =
  | 'retail'
  | 'marketplace'
  | 'dashboard'
  | 'product'
  | 'inventory'
  | 'logistics'
  | 'payments'
  | 'artisan'
  | 'ai-studio'
  | 'shop-manager'
  | 'documentation';

export interface NavTab {
  id: TabId | string;   // string allows admin-created custom tabs
  label: string;
  icon: string;         // lucide icon name as string — rendered dynamically
  roles: string[];
  visible: boolean;
  order: number;
}

// ─── SITE SETTINGS ───────────────────────────────────────────────────────────

export interface SiteSettings {
  appName: string;
  logoText: string;
  tagline: string;
  primaryColor: string;       // hex
  accentColor: string;        // hex
  whatsappNumber: string;
  location: string;
  currency: string;
  adminEmail: string;
  maintenanceMode: boolean;
}

// ─── STATE ───────────────────────────────────────────────────────────────────

export interface AdminState {
  products: Product[];
  ads: Advertisement[];
  navTabs: NavTab[];
  siteSettings: SiteSettings;
}

// ─── DEFAULT VALUES ───────────────────────────────────────────────────────────

const DEFAULT_NAV_TABS: NavTab[] = [
  { id: 'retail',        label: 'Daily Deals',       icon: 'Layers',      roles: ['RETAIL_BUYER','WHOLESALE_BUYER','SUPPLIER','ADMIN'], visible: true,  order: 1 },
  { id: 'marketplace',   label: 'Wholesale Hub',     icon: 'Layers',      roles: ['RETAIL_BUYER','WHOLESALE_BUYER','SUPPLIER','ADMIN'], visible: true,  order: 2 },
  { id: 'dashboard',     label: 'Dashboard',         icon: 'BarChart3',   roles: ['SUPPLIER','ADMIN'],                                  visible: true,  order: 3 },
  { id: 'inventory',     label: 'Inventory',         icon: 'Package',     roles: ['SUPPLIER','ADMIN'],                                  visible: true,  order: 4 },
  { id: 'logistics',     label: 'Logistics Hub',     icon: 'Package',     roles: ['SUPPLIER','RETAIL_BUYER','WHOLESALE_BUYER','ADMIN'], visible: true,  order: 5 },
  { id: 'payments',      label: 'Payments',          icon: 'ShoppingCart',roles: ['SUPPLIER','RETAIL_BUYER','WHOLESALE_BUYER','ADMIN'], visible: true,  order: 6 },
  { id: 'artisan',       label: 'Artisan Portal',    icon: 'User',        roles: ['SUPPLIER','ADMIN'],                                  visible: true,  order: 7 },
  { id: 'shop-manager',  label: 'Storefront Editor', icon: 'Layers',      roles: ['SUPPLIER','ADMIN'],                                  visible: true,  order: 8 },
  { id: 'documentation', label: 'Legal & Invoices',  icon: 'FileText',    roles: ['SUPPLIER','RETAIL_BUYER','WHOLESALE_BUYER','ADMIN'], visible: true,  order: 9 },
  { id: 'ai-studio',     label: 'AI Marketing',      icon: 'BarChart3',   roles: ['SUPPLIER','ADMIN'],                                  visible: true,  order: 10 },
];

const DEFAULT_SETTINGS: SiteSettings = {
  appName:         'ELMART',
  logoText:        'ELMART',
  tagline:         'Direct artisan connection.',
  primaryColor:    '#2563EB',
  accentColor:     '#F97316',
  whatsappNumber:  '250798582533',
  location:        'Kigali · LIVE',
  currency:        'RWF',
  adminEmail:      'admin@elmart.rw',
  maintenanceMode: false,
};

const INITIAL_STATE: AdminState = {
  products:     MOCK_PRODUCTS,
  ads:          MOCK_ADS,
  navTabs:      DEFAULT_NAV_TABS,
  siteSettings: DEFAULT_SETTINGS,
};

// ─── ACTION TYPES ─────────────────────────────────────────────────────────────

export type AdminAction =
  // Products
  | { type: 'ADD_PRODUCT';    payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }          // id
  | { type: 'TOGGLE_PRODUCT_VISIBILITY'; payload: string } // id (uses stock=0 as hidden flag)

  // Ads
  | { type: 'ADD_AD';    payload: Advertisement }
  | { type: 'UPDATE_AD'; payload: Advertisement }
  | { type: 'DELETE_AD'; payload: string }               // id
  | { type: 'REORDER_ADS'; payload: Advertisement[] }

  // Nav Tabs
  | { type: 'ADD_TAB';          payload: NavTab }
  | { type: 'UPDATE_TAB';       payload: NavTab }
  | { type: 'DELETE_TAB';       payload: string }        // id
  | { type: 'TOGGLE_TAB';       payload: string }        // toggle visible
  | { type: 'REORDER_TABS';     payload: NavTab[] }

  // Site Settings
  | { type: 'UPDATE_SETTINGS'; payload: Partial<SiteSettings> }

  // Reset
  | { type: 'RESET_ALL' };

// ─── REDUCER ─────────────────────────────────────────────────────────────────

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {

    // ── Products ──
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };

    case 'TOGGLE_PRODUCT_VISIBILITY':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload ? { ...p, stock: p.stock === -1 ? 10 : -1 } : p
        ),
      };

    // ── Ads ──
    case 'ADD_AD':
      return { ...state, ads: [...state.ads, action.payload] };

    case 'UPDATE_AD':
      return {
        ...state,
        ads: state.ads.map(a => a.id === action.payload.id ? action.payload : a),
      };

    case 'DELETE_AD':
      return { ...state, ads: state.ads.filter(a => a.id !== action.payload) };

    case 'REORDER_ADS':
      return { ...state, ads: action.payload };

    // ── Nav Tabs ──
    case 'ADD_TAB':
      return { ...state, navTabs: [...state.navTabs, action.payload] };

    case 'UPDATE_TAB':
      return {
        ...state,
        navTabs: state.navTabs.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'DELETE_TAB':
      return { ...state, navTabs: state.navTabs.filter(t => t.id !== action.payload) };

    case 'TOGGLE_TAB':
      return {
        ...state,
        navTabs: state.navTabs.map(t =>
          t.id === action.payload ? { ...t, visible: !t.visible } : t
        ),
      };

    case 'REORDER_TABS':
      return { ...state, navTabs: action.payload };

    // ── Site Settings ──
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        siteSettings: { ...state.siteSettings, ...action.payload },
      };

    // ── Reset ──
    case 'RESET_ALL':
      return INITIAL_STATE;

    default:
      return state;
  }
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

interface AdminContextValue {
  state:    AdminState;
  dispatch: React.Dispatch<AdminAction>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

// ─── PROVIDER ────────────────────────────────────────────────────────────────

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, INITIAL_STATE);
  return (
    <AdminContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminContext.Provider>
  );
}

// ─── HOOK ────────────────────────────────────────────────────────────────────

export function useAdminStore(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdminStore must be used inside <AdminStoreProvider>');
  return ctx;
}

// ─── HELPERS (used by AdminPanel and views) ───────────────────────────────────

/** Generate a unique id with a given prefix */
export function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Empty product template for the "Add Product" form */
export function emptyProduct(): Omit<Product, 'id'> {
  return {
    name:          '',
    description:   '',
    price:         0,
    category:      'Food',
    images:        ['https://picsum.photos/seed/newproduct/600/600'],
    supplierId:    's_admin',
    supplierName:  'ELMART Direct',
    stock:         0,
    rating:        5.0,
    reviewsCount:  0,
    isArtisan:     false,
    moq:           1,
  };
}

/** Empty ad template */
export function emptyAd(): Omit<Advertisement, 'id'> {
  return {
    companyName: '',
    title:       '',
    description: '',
    imageUrl:    'https://picsum.photos/seed/newad/1200/300',
    ctaUrl:      '#',
    type:        'banner',
  };
}

/** Empty nav tab template */
export function emptyTab(): Omit<NavTab, 'id'> {
  return {
    label:   'New Tab',
    icon:    'Layers',
    roles:   ['ADMIN'],
    visible: true,
    order:   99,
  };
}