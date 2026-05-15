import { useNavigate } from 'react-router-dom';
import SocialBrandIcon from '../shared/SocialBrandIcon';
import type { ConnectedPlatformEntry } from '../../domain/entities/Profile';

interface ConnectedPlatformsListProps {
  platforms: ConnectedPlatformEntry[];
}

export default function ConnectedPlatformsList({ platforms }: ConnectedPlatformsListProps) {
  const navigate = useNavigate();

  return (
    <div data-section className="bg-[#EFE9DC] rounded-3xl border border-[#15140F]/10 overflow-hidden">
      <div className="px-8 py-5 border-b border-[#15140F]/5 flex items-center justify-between bg-[#E7E0D0]/20">
        <h3 className="font-headline font-bold text-[#15140F] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#C8553A] text-[18px]">hub</span>
          Connected Platforms
        </h3>
        <button
          onClick={() => navigate('/platforms')}
          className="text-[10px] text-[#C8553A] font-bold uppercase tracking-widest hover:text-[#15140F] transition-colors"
        >
          Manage
        </button>
      </div>
      <div className="divide-y divide-[#15140F]/5">
        {platforms.length === 0 ? (
          <div className="px-8 py-8 flex flex-col items-center gap-2 text-center">
            <span className="material-symbols-outlined text-[#15140F] text-[32px]">hub</span>
            <p className="text-sm text-[#6B655B]">No platforms connected</p>
            <button
              onClick={() => navigate('/platforms')}
              className="mt-1 text-[10px] text-[#C8553A] font-bold uppercase tracking-widest hover:text-[#15140F] transition-colors"
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
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[#15140F] shrink-0" style={{ background: p.color }}>
                    <SocialBrandIcon platformId={p.platformId} size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#15140F]">{p.name}</p>
                    <p className="text-[10px] text-[#6B655B]">{p.handle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-[#4F7A4A]' : 'bg-[#ffb4ab] animate-pulse'}`} />
                  <span className={`text-[10px] uppercase tracking-wider font-medium ${ok ? 'text-[#4F7A4A]' : 'text-[#ffb4ab]'}`}>
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
