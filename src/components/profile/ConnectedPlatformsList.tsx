import { useNavigate } from 'react-router-dom';
import SocialBrandIcon from '../shared/SocialBrandIcon';
import type { ConnectedPlatformEntry } from '../../domain/entities/Profile';

interface ConnectedPlatformsListProps {
  platforms: ConnectedPlatformEntry[];
}

export default function ConnectedPlatformsList({ platforms }: ConnectedPlatformsListProps) {
  const navigate = useNavigate();

  return (
    <div data-section className="bg-[#201f1f] rounded-3xl border border-[#4c4450]/10 overflow-hidden">
      <div className="px-8 py-5 border-b border-[#4c4450]/5 flex items-center justify-between bg-[#2a2a2a]/20">
        <h3 className="font-headline font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#d394ff] text-[18px]">hub</span>
          Connected Platforms
        </h3>
        <button
          onClick={() => navigate('/platforms')}
          className="text-[10px] text-[#d394ff] font-bold uppercase tracking-widest hover:text-white transition-colors"
        >
          Manage
        </button>
      </div>
      <div className="divide-y divide-[#4c4450]/5">
        {platforms.map((p) => {
          const ok = p.status === 'connected';
          return (
            <div key={p.platformId} className="px-8 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: p.color }}>
                  <SocialBrandIcon platformId={p.platformId} size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{p.name}</p>
                  <p className="text-[10px] text-[#988d9c]">{p.handle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-[#c5d247]' : 'bg-[#ffb4ab] animate-pulse'}`} />
                <span className={`text-[10px] uppercase tracking-wider font-medium ${ok ? 'text-[#c5d247]' : 'text-[#ffb4ab]'}`}>
                  {p.status === 'connected' ? 'Connected' : p.status === 'needs-reauth' ? 'Needs Re-auth' : 'Disconnected'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
