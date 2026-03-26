import type { ActivityEntry } from '../../domain/entities/Profile';

interface ActivityFeedProps {
  activity: ActivityEntry[];
}

export default function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <div data-section className="bg-[#201f1f] rounded-3xl border border-[#4c4450]/10 overflow-hidden">
      <div className="px-6 py-5 border-b border-[#4c4450]/5 bg-[#2a2a2a]/20">
        <h3 className="font-headline font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#d394ff] text-[18px]">history</span>
          Recent Activity
        </h3>
      </div>
      <div className="divide-y divide-[#4c4450]/5">
        {activity.map((a, i) => (
          <div key={i} data-activity className="px-6 py-3.5 flex gap-3 hover:bg-white/[0.02] transition-colors">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: a.color + '1a' }}>
              <span className="material-symbols-outlined text-[13px]" style={{ color: a.color }}>{a.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white leading-tight">{a.action}</p>
              <p className="text-[10px] text-[#988d9c] truncate mt-0.5">{a.detail}</p>
              <p className="text-[9px] text-[#4c4450] mt-1 uppercase tracking-wider">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
