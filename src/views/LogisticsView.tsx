/**
 * LogisticsView.tsx
 * Logistics Hub tab view — shipment tracking, delivery partners, route map.
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Package, Truck, MapPin, Clock, CheckCircle, AlertCircle, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { Order } from '../types';

interface LogisticsViewProps {
  orders: Order[];
}

// ── Mock delivery partners ─────────────────────────────────────────────────────
const DELIVERY_PARTNERS = [
  {
    id: 'd1',
    name: 'Zipline Rwanda',
    type: 'Drone Delivery',
    coverage: 'Nationwide',
    avgTime: '35 min',
    rating: 4.9,
    price: 'RWF 2,500',
    available: true,
    color: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'd2',
    name: 'Charis UAS',
    type: 'Motorcycle Express',
    coverage: 'Kigali + surroundings',
    avgTime: '1–2 hrs',
    rating: 4.7,
    price: 'RWF 1,200',
    available: true,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'd3',
    name: 'Mobiride Logistics',
    type: 'Truck Freight',
    coverage: 'All provinces',
    avgTime: '1–3 days',
    rating: 4.5,
    price: 'RWF 8,000+',
    available: true,
    color: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'd4',
    name: 'Rwanda Post',
    type: 'Standard Post',
    coverage: 'Nationwide',
    avgTime: '3–7 days',
    rating: 4.1,
    price: 'RWF 500',
    available: false,
    color: 'bg-slate-100 text-slate-500',
  },
];

// ── Mock live shipments ────────────────────────────────────────────────────────
const LIVE_SHIPMENTS = [
  {
    id: 'SHP-0041',
    product: 'Cimerwa Cement (x10 bags)',
    origin: 'Cimerwa Factory, Muganza',
    destination: 'Nyarugenge, Kigali',
    status: 'IN_TRANSIT',
    eta: 'Today, 4:30 PM',
    driver: 'Jean de Dieu M.',
    phone: '+250 788 123 456',
    progress: 65,
  },
  {
    id: 'SHP-0039',
    product: 'Inyange Milk (200L)',
    origin: 'Inyange Industries, Kigali',
    destination: 'Musanze District',
    status: 'DELIVERED',
    eta: 'Delivered at 10:15 AM',
    driver: 'Claudine U.',
    phone: '+250 782 654 321',
    progress: 100,
  },
  {
    id: 'SHP-0038',
    product: 'Traditional Agaseke (50 units)',
    origin: 'Gikondo Artisan Hub',
    destination: 'Hotel des Mille Collines',
    status: 'PENDING',
    eta: 'Scheduled: Tomorrow 9 AM',
    driver: 'Pending assignment',
    phone: '',
    progress: 10,
  },
];

// ── Shipment status styles ─────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  IN_TRANSIT: { label: 'In Transit', color: 'bg-blue-100 text-blue-700',    icon: Truck },
  DELIVERED:  { label: 'Delivered',  color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  FAILED:     { label: 'Failed',     color: 'bg-red-100 text-red-600',      icon: AlertCircle },
};

// ── Rwanda delivery zones ──────────────────────────────────────────────────────
const ZONES = [
  { name: 'Kigali City',      hubs: 8,  coverage: '100%', avgDelivery: '2 hrs'  },
  { name: 'Northern Province', hubs: 3, coverage: '74%',  avgDelivery: '6 hrs'  },
  { name: 'Southern Province', hubs: 3, coverage: '68%',  avgDelivery: '8 hrs'  },
  { name: 'Eastern Province',  hubs: 4, coverage: '81%',  avgDelivery: '5 hrs'  },
  { name: 'Western Province',  hubs: 2, coverage: '55%',  avgDelivery: '10 hrs' },
];

export default function LogisticsView({ orders }: LogisticsViewProps) {
  const [expandedShipment, setExpandedShipment] = useState<string | null>('SHP-0041');
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [searchResult, setSearchResult] = useState<typeof LIVE_SHIPMENTS[0] | null>(null);

  const handleTrack = () => {
    const found = LIVE_SHIPMENTS.find(s =>
      s.id.toLowerCase() === trackingInput.trim().toLowerCase()
    );
    setSearchResult(found ?? null);
    if (!found && trackingInput) setSearchResult({ id: 'NOT_FOUND' } as any);
  };

  return (
    <motion.div
      key="logistics"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6"
    >
      {/* ── Header ── */}
      <div className="panel p-5 md:p-6 bg-sidebar text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-1 italic">ELMART Logistics Hub</h2>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              Real-time shipment tracking, delivery partner management, and Rwanda coverage intelligence.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-center">
              <p className="text-xl font-black text-brand-accent">{LIVE_SHIPMENTS.length}</p>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Active</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-center">
              <p className="text-xl font-black text-emerald-400">
                {LIVE_SHIPMENTS.filter(s => s.status === 'DELIVERED').length}
              </p>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Delivered</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-center">
              <p className="text-xl font-black text-white">5</p>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Zones</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Shipment Tracker ── */}
      <div className="panel p-4 md:p-5">
        <h3 className="text-xs font-black uppercase tracking-widest mb-3">Track a Shipment</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={trackingInput}
            onChange={e => setTrackingInput(e.target.value)}
            placeholder="Enter Shipment ID (e.g. SHP-0041)"
            className="flex-1 bg-bg border border-border-subtle p-3 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-brand-primary"
            onKeyDown={e => e.key === 'Enter' && handleTrack()}
          />
          <button
            onClick={handleTrack}
            className="bg-brand-primary text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
          >
            Track
          </button>
        </div>

        {/* Search result */}
        {searchResult && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3"
          >
            {(searchResult as any).id === 'NOT_FOUND' ? (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-[11px] text-red-700 font-medium">No shipment found with that ID.</p>
              </div>
            ) : (
              <div className="bg-bg border border-border-subtle p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-black">{searchResult.id}</p>
                  <span className={`status-pill ${statusConfig[searchResult.status]?.color}`}>
                    {statusConfig[searchResult.status]?.label}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted">{searchResult.product}</p>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-primary rounded-full transition-all"
                    style={{ width: `${searchResult.progress}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold text-brand-primary">{searchResult.eta}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* ── Live Shipments ── */}
        <div className="lg:col-span-2 panel p-0 overflow-hidden">
          <div className="p-4 border-b border-border-subtle bg-slate-50/50 flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-tight">Live Shipments</span>
            <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded uppercase">
              {LIVE_SHIPMENTS.filter(s => s.status === 'IN_TRANSIT').length} In Transit
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {LIVE_SHIPMENTS.map((shipment) => {
              const cfg = statusConfig[shipment.status];
              const Icon = cfg.icon;
              const isExpanded = expandedShipment === shipment.id;

              return (
                <div key={shipment.id} className="p-4">
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => setExpandedShipment(isExpanded ? null : shipment.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-text-main">{shipment.id}</p>
                        <p className="text-[10px] text-text-muted">{shipment.product}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`status-pill ${cfg.color}`}>{cfg.label}</span>
                      {isExpanded
                        ? <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
                        : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                      }
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${shipment.progress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${shipment.status === 'DELIVERED' ? 'bg-emerald-500' : shipment.status === 'IN_TRANSIT' ? 'bg-brand-primary' : 'bg-yellow-400'}`}
                    />
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
                        <div className="mt-4 space-y-3 bg-bg rounded-lg p-3 border border-border-subtle">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-[9px] font-black uppercase text-text-muted">Origin</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-brand-primary shrink-0" />
                                <p className="text-[10px] font-bold text-text-main">{shipment.origin}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase text-text-muted">Destination</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-brand-accent shrink-0" />
                                <p className="text-[10px] font-bold text-text-main">{shipment.destination}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase text-text-muted">ETA</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-text-muted shrink-0" />
                                <p className="text-[10px] font-bold text-brand-primary">{shipment.eta}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase text-text-muted">Driver</p>
                              <p className="text-[10px] font-bold text-text-main mt-0.5">{shipment.driver}</p>
                            </div>
                          </div>
                          {shipment.phone && (
                            <a
                              href={`tel:${shipment.phone}`}
                              className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 p-2 rounded-lg hover:bg-emerald-100 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[10px] font-bold text-emerald-800">{shipment.phone}</span>
                              <span className="text-[9px] text-emerald-600 ml-auto">Call Driver →</span>
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Delivery Partners ── */}
        <div className="space-y-4">
          <div className="panel p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-slate-50/50">
              <span className="text-xs font-black uppercase tracking-tight">Delivery Partners</span>
            </div>
            <div className="divide-y divide-slate-100">
              {DELIVERY_PARTNERS.map((partner) => (
                <div
                  key={partner.id}
                  onClick={() => partner.available && setSelectedPartner(partner.id)}
                  className={`p-3 transition-colors ${partner.available ? 'cursor-pointer hover:bg-slate-50' : 'opacity-50 cursor-not-allowed'} ${selectedPartner === partner.id ? 'bg-sky-50 border-l-2 border-l-brand-primary' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="text-[11px] font-black text-text-main">{partner.name}</p>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${partner.color}`}>
                        {partner.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-text-main">{partner.price}</p>
                      <p className="text-[9px] text-brand-accent font-bold">★ {partner.rating}</p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-[9px] text-text-muted">{partner.coverage}</p>
                    <p className="text-[9px] font-bold text-text-muted">{partner.avgTime}</p>
                  </div>
                </div>
              ))}
            </div>
            {selectedPartner && (
              <div className="p-3 border-t border-border-subtle">
                <button className="w-full bg-brand-primary text-white py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">
                  Book Selected Partner
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Rwanda Coverage Zones ── */}
      <div className="panel p-0 overflow-hidden">
        <div className="p-4 border-b border-border-subtle bg-slate-50/50 flex justify-between items-center">
          <span className="text-xs font-black uppercase tracking-tight">Rwanda Delivery Coverage</span>
          <span className="text-[9px] text-text-muted font-bold">5 provinces · {ZONES.reduce((a, b) => a + b.hubs, 0)} hubs</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg text-text-muted border-b border-border-subtle">
                <th className="px-4 py-2.5 text-[9px] font-black uppercase">Province</th>
                <th className="px-4 py-2.5 text-[9px] font-black uppercase">Hubs</th>
                <th className="px-4 py-2.5 text-[9px] font-black uppercase">Coverage</th>
                <th className="px-4 py-2.5 text-[9px] font-black uppercase">Avg Delivery</th>
                <th className="px-4 py-2.5 text-[9px] font-black uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ZONES.map((zone) => {
                const cov = parseInt(zone.coverage);
                return (
                  <tr key={zone.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-brand-primary shrink-0" />
                        <span className="text-xs font-bold text-text-main">{zone.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-text-muted">{zone.hubs}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cov >= 90 ? 'bg-emerald-500' : cov >= 70 ? 'bg-brand-primary' : 'bg-yellow-400'}`}
                            style={{ width: zone.coverage }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-text-main">{zone.coverage}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-text-muted" />
                        <span className="text-[10px] font-bold text-text-main">{zone.avgDelivery}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`status-pill ${cov >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {cov >= 70 ? 'Active' : 'Partial'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// Need AnimatePresence import
import { AnimatePresence } from 'motion/react';