import type { RefObject } from 'react';
import type { ConnectedPlatform } from '../../domain/entities/Platform';

interface PlatformHealthCardProps {
  platform: ConnectedPlatform;
  cardRef:  RefObject<HTMLDivElement | null>;
}

export default function PlatformHealthCard({ platform: p, cardRef }: PlatformHealthCardProps) {
  const ok = p.status === 'connected';

  return (
    <div
      ref={cardRef}
      className="surface-card p-5 relative overflow-hidden group"
    >
      <div
        className="absolute top-0 right-0 w-28 h-28 rounded-full -mr-14 -mt-14 blur-3xl transition-all pointer-events-none"
        style={{ background: p.color + '1a' }}
      />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#15140F] font-bold text-sm shrink-0"
            style={{ background: p.color }}
          >
            {p.abbr}
          </div>
          <div>
            <h4 className="font-bold text-[#15140F] text-sm">{p.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-[#4F7A4A]' : 'bg-[#A8362A] animate-pulse'}`} />
              <span className="text-xs text-[#6B655B] uppercase tracking-[0.12em]">
                {ok ? 'Connected' : 'Auth Expired'}
              </span>
            </div>
          </div>
        </div>
        <span className="material-symbols-outlined text-[#6B655B]" style={{ fontSize: 18 }}>
          {ok ? 'more_vert' : 'sync_problem'}
        </span>
      </div>
      {!ok && (
        <button className="mt-3 w-full bg-[#E7E0D0] hover:bg-[#D8D2C4] text-[#15140F] py-2 rounded-xl text-xs font-bold transition-all border border-[#15140F]/10">
          Reconnect Account
        </button>
      )}
    </div>
  );
}
