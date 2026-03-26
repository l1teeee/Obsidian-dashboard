import type { PlatformBreakdown } from '../../domain/entities/Analytics';

interface PlatformStatCardProps {
  stat: PlatformBreakdown;
}

export default function PlatformStatCard({ stat: p }: PlatformStatCardProps) {
  const isInstagram = p.name === 'Instagram';

  return (
    <div data-platform-stat className="glass-card p-6 rounded-3xl border border-[#4c4450]/5">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isInstagram ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' : p.platformId === 'linkedin' ? 'bg-[#0077b5]' : 'bg-[#1877f2]'}`}>
          <span className="material-symbols-outlined text-white text-[18px]">
            {p.platformId === 'instagram' ? 'camera' : p.platformId === 'linkedin' ? 'work' : 'group'}
          </span>
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
