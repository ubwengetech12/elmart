/**
 * StatCard.tsx
 * KPI stat tile used in DashboardView.
 * Supports admin impersonation blur mode.
 */

import { Lock } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subValue: string;
  kind: 'up' | 'neutral';
  isPrivate?: boolean;
}

export default function StatCard({ title, value, subValue, kind, isPrivate }: StatCardProps) {
  return (
    <div className={`stat-card relative overflow-hidden ${isPrivate ? 'border-amber-500/20' : ''}`}>
      {isPrivate && (
        <div className="absolute top-2 right-2">
          <Lock className="w-2.5 h-2.5 text-amber-500 opacity-60" />
        </div>
      )}
      <span className="text-[9px] md:text-[10px] uppercase font-bold text-text-muted tracking-tight">
        {title}
      </span>
      {isPrivate ? (
        <div className="flex items-center gap-2">
          <span className="text-lg md:text-xl font-bold text-text-muted blur-[2px] select-none">
            RWF ****
          </span>
          <span className="text-[7px] font-black uppercase text-amber-600 bg-amber-100 px-1 rounded">
            Hidden
          </span>
        </div>
      ) : (
        <span className="text-xl md:text-2xl font-bold text-text-main tabular-nums">{value}</span>
      )}
      <span className={`text-[10px] font-bold ${kind === 'up' ? 'text-brand-success' : 'text-text-muted'}`}>
        {subValue}
      </span>
    </div>
  );
}