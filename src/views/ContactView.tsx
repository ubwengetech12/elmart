/**
 * ContactView.tsx
 * Contact Support tab — loads the Visme animated contact form inline on page.
 */

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

export default function ContactView() {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Avoid loading the script more than once
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    const existing = document.querySelector(
      'script[src="https://static-bundles.visme.co/forms/vismeforms-embed.js"]'
    );
    if (existing) return;

    const script = document.createElement('script');
    script.src = 'https://static-bundles.visme.co/forms/vismeforms-embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // cleanup not needed — visme script is global
    };
  }, []);

  return (
    <motion.div
      key="contact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6"
    >
      {/* Header */}
      <div className="panel p-5 md:p-6 bg-sidebar text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-1 italic">Contact & Support</h2>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              Reach the ELMART team for help with orders, supplier onboarding, or technical issues.
              We respond within 24 hours.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-center">
              <p className="text-xl font-black text-emerald-400">24h</p>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Response</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-center">
              <p className="text-xl font-black text-brand-accent">RW</p>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Kigali</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href="https://wa.me/250798582533"
          target="_blank"
          rel="noopener noreferrer"
          className="panel p-4 flex items-center gap-3 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black text-text-main">WhatsApp</p>
            <p className="text-[10px] text-text-muted">+250 798 582 533</p>
          </div>
        </a>

        <a
          href="tel:+250798582533"
          className="panel p-4 flex items-center gap-3 hover:border-brand-primary/30 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 bg-blue-100 text-brand-primary rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black text-text-main">Call Us</p>
            <p className="text-[10px] text-text-muted">+250 798 582 533</p>
          </div>
        </a>

        <a
          href="mailto:admin@elmart.rw"
          className="panel p-4 flex items-center gap-3 hover:border-brand-accent/30 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 bg-yellow-100 text-yellow-700 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black text-text-main">Email</p>
            <p className="text-[10px] text-text-muted">admin@elmart.rw</p>
          </div>
        </a>
      </div>

      {/* Visme animated contact form — scaled to fill width */}
      <div className="panel overflow-hidden">
        <div className="px-4 py-3 border-b border-border-subtle bg-slate-50/50 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs font-black uppercase tracking-tight">Send Us a Message</span>
        </div>
        <div style={{ width: '100%', minHeight: '750px', overflow: 'hidden' }}>
          <div style={{
            transform: 'scale(2.0)',
            transformOrigin: 'top left',
            width: '50%',
            marginBottom: '380px'
          }}>
            <div
              className="visme_d"
              data-title="Contact Form"
              data-url="33po9z1q-contact-form"
              data-domain="forms"
              data-form-id="179039"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="panel p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 text-text-muted rounded-xl flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-black text-text-main">Visit Us</p>
          <p className="text-[10px] text-text-muted">Kigali, Rwanda · ELMART Trade Center</p>
        </div>
      </div>
    </motion.div>
  );
}