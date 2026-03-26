import type { PlatformBreakdown } from '../../domain/entities/Analytics';
import SocialBrandIcon from '../shared/SocialBrandIcon';

interface PlatformStatCardProps {
  stat: PlatformBreakdown;
}

function getCardBg(id: string): string {
  if (id === 'instagram') return 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]';
  if (id === 'linkedin')  return 'bg-[#0A66C2]';
  if (id === 'facebook')  return 'bg-[#1877F2]';
  if (id === 'twitter')   return 'bg-[#000000]';
  if (id === 'tiktok')    return 'bg-gradient-to-br from-[#010101] via-[#69C9D0] to-[#EE1D52]';
  if (id === 'youtube')   return 'bg-[#FF0000]';
  return 'bg-[#4c4450]';
}

export default function PlatformStatCard({ stat: p }: PlatformStatCardProps) {
  return (
    <div data-platform-stat className="glass-card p-6 rounded-3xl border border-[#4c4450]/5">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCardBg(p.platformId)}`}>
          <SocialBrandIcon platformId={p.platformId} size={18} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-white">{p.name}</h4>
          <p className="text-xs text-[#988d9c]">{p.handle}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-xs text-[#cfc2d2]">Follower Growth</span>
          <span className="text-xs font-mono text-[#d394ff]">{p.growthLabel}</span>
        </div>
        <div className="w-full h-1 bg-[#353534] rounded-full overflow-hidden">
          <div data-stat-bar className="h-full bg-[#d394ff] rounded-full" style={{ width: `${p.barPct}%` }} />
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-[#cfc2d2]">Total Reach</span>
          <span className="text-xs font-mono text-white">{p.reach}</span>
        </div>
      </div>
    </div>
  );
}
