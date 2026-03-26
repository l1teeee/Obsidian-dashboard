import type { RefObject } from 'react';
import type { KpiCard as KpiCardData } from '../../hooks/useDashboard';

interface KpiCardProps {
  kpi:      KpiCardData;
  cardRef:  RefObject<HTMLDivElement | null>;
  countRef: RefObject<HTMLSpanElement | null>;
}

export default function KpiCard({ kpi, cardRef, countRef }: KpiCardProps) {
  return (
    <div
      ref={cardRef}
      className="glass-card rounded-3xl p-6 border border-[#4c4450]/10 hover:shadow-[0_0_40px_rgba(211,148,255,0.08)] transition-all"
    >
      <p className="text-[#988d9c] text-xs uppercase tracking-widest font-semibold mb-4">{kpi.label}</p>

      <div className="flex items-baseline gap-2 flex-wrap">
        <span ref={countRef} className="font-mono text-3xl font-medium text-white">
          {kpi.display}
        </span>

        {kpi.delta && kpi.positive !== null && (
          <span className={`font-mono text-xs font-medium flex items-center gap-0.5 ${kpi.positive ? 'text-[#c5d247]' : 'text-[#988d9c]'}`}>
            {kpi.positive && (
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>arrow_upward</span>
            )}
            {kpi.delta}
          </span>
        )}
        {kpi.delta && kpi.positive === null && (
          <span className="text-xs text-[#988d9c]">{kpi.delta}</span>
        )}
      </div>

      {/* Active Platforms badges */}
      {kpi.type === 'platforms' && (
        <div className="flex items-center gap-1.5 mt-3">
          {[['IG','#E1306C'],['LI','#0077B5'],['FB','#1877F2']].map(([p, c]) => (
            <div key={p} className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[9px]"
              style={{ background: c + '33', color: c }}>
              {p}
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {kpi.type === 'bar' && (
        <div className="mt-4 h-1 w-full bg-[#353534] rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${kpi.bar}%`, background: kpi.barColor, boxShadow: `0 0 10px ${kpi.glow}` }} />
        </div>
      )}

      {/* Dot bars (Scheduled Posts) */}
      {kpi.type === 'dots' && (
        <div className="mt-4 flex gap-1">
          {[100, 80, 60, 40, 0].map((o, j) => (
            <div key={j} className="h-1 flex-1 rounded-full"
              style={{ background: o > 0 ? `rgba(211,148,255,${o / 100})` : '#353534' }} />
          ))}
        </div>
      )}
    </div>
  );
}
