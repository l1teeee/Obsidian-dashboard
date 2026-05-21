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
      className="surface-card p-5 transition-all hover:border-[#111827]/24 md:p-6"
    >
      <p className="text-[#64748B] text-xs uppercase tracking-[0.14em] font-bold mb-4">{kpi.label}</p>

      <div className="flex items-baseline gap-2 flex-wrap">
        <span ref={countRef} className="font-mono text-3xl font-medium text-[#0F172A]">
          {kpi.display}
        </span>

        {kpi.delta && kpi.positive !== null && (
          <span className={`font-mono text-xs font-semibold flex items-center gap-0.5 ${kpi.positive ? 'text-[#047857]' : 'text-[#64748B]'}`}>
            {kpi.positive && (
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>arrow_upward</span>
            )}
            {kpi.delta}
          </span>
        )}
        {kpi.delta && kpi.positive === null && (
          <span className="text-xs text-[#64748B]">{kpi.delta}</span>
        )}
      </div>

      {/* Active Platforms badges */}
      {kpi.type === 'platforms' && (
        <div className="flex items-center gap-1.5 mt-3">
          {(kpi.platforms ?? []).map(({ abbr, color }) => (
            <div key={abbr} className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
              style={{ background: color + '33', color }}>
              {abbr}
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {kpi.type === 'bar' && (
        <div className="mt-4 h-1 w-full bg-[#CBD5E1] rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${kpi.bar}%`, background: kpi.barColor, boxShadow: `0 0 10px ${kpi.glow}` }} />
        </div>
      )}

      {/* Dot bars (Scheduled Posts) — fills based on real count, max 10 = full */}
      {kpi.type === 'dots' && (
        <div className="mt-4 flex gap-1">
          {Array.from({ length: 5 }, (_, j) => {
            const filled = kpi.countEnd > j * 2;
            return (
              <div key={j} className="h-1 flex-1 rounded-full transition-all duration-500"
                style={{ background: filled ? '#111827' : '#CBD5E1' }} />
            );
          })}
        </div>
      )}
    </div>
  );
}
