import { useNavigate } from 'react-router-dom';
import SocialBrandIcon from '../shared/SocialBrandIcon';
import type { ConnectedPlatformEntry } from '../../domain/entities/Profile';

interface ConnectedPlatformsListProps {
  platforms: ConnectedPlatformEntry[];
}

export default function ConnectedPlatformsList({ platforms }: ConnectedPlatformsListProps) {
  const navigate = useNavigate();

  return (
    <div data-section className="bg-[#F0EBE2] rounded-3xl border border-[#1C1814]/10 overflow-hidden">
      <div className="px-8 py-5 border-b border-[#1C1814]/5 flex items-center justify-between bg-[#E5DFD6]/20">
        <h3 className="font-headline font-bold text-[#1C1814] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7DD3C7] text-[18px]">hub</span>
          Connected Platforms
        </h3>
        <button
          onClick={() => navigate('/platforms')}
          className="text-[10px] text-[#7DD3C7] font-bold uppercase tracking-widest hover:text-[#1C1814] transition-colors"
        >
          Manage
        </button>
      </div>
      <div className="divide-y divide-[#1C1814]/5">
        {platforms.length === 0 ? (
          <div className="px-8 py-8 flex flex-col items-center gap-2 text-center">
            <span className="material-symbols-outlined text-[#1C1814] text-[32px]">hub</span>
            <p className="text-sm text-[#6A6470]">No platforms connected</p>
            <button
              onClick={() => navigate('/platforms')}
              className="mt-1 text-[10px] text-[#7DD3C7] font-bold uppercase tracking-widest hover:text-[#1C1814] transition-colors"
            >
              Connect now
            </button>
          </div>
        ) : (
          platforms.map((p) => {
            const ok = p.status === 'connected';
            return (
              <div key={p.platformId} className="px-8 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[#1C1814] shrink-0" style={{ background: p.color }}>
                    <SocialBrandIcon platformId={p.platformId} size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1C1814]">{p.name}</p>
                    <p className="text-[10px] text-[#6A6470]">{p.handle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-[#c5d247]' : 'bg-[#ffb4ab] animate-pulse'}`} />
                  <span className={`text-[10px] uppercase tracking-wider font-medium ${ok ? 'text-[#c5d247]' : 'text-[#ffb4ab]'}`}>
                    {ok ? 'Connected' : p.status === 'needs-reauth' ? 'Needs Re-auth' : 'Disconnected'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
