import { useNavigate } from 'react-router-dom';
import type { ActivityEntry } from '../../domain/entities/Profile';

interface ActivityFeedProps {
  activity: ActivityEntry[];
}

export default function ActivityFeed({ activity }: ActivityFeedProps) {
  const navigate = useNavigate();

  return (
    <div data-section className="bg-[#EFE9DC] rounded-3xl border border-[#15140F]/10 overflow-hidden">
      <div className="px-6 py-5 border-b border-[#15140F]/5 bg-[#E7E0D0]/20 flex items-center justify-between">
        <h3 className="font-headline font-bold text-[#15140F] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#C8553A] text-[18px]">history</span>
          Recent Activity
        </h3>
        <button
          onClick={() => navigate('/activity')}
          className="text-[10px] text-[#C8553A] font-bold uppercase tracking-widest hover:text-[#15140F] transition-colors flex items-center gap-1"
        >
          View All
          <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
        </button>
      </div>
      <div className="divide-y divide-[#15140F]/5">
        {activity.length === 0 ? (
          <div className="px-6 py-8 flex flex-col items-center gap-2 text-center">
            <span className="material-symbols-outlined text-[#15140F] text-[32px]">history</span>
            <p className="text-sm text-[#6B655B]">No recent activity</p>
          </div>
        ) : (
          activity.map((a, i) => (
            <div key={i} data-activity className="px-6 py-3.5 flex gap-3 hover:bg-white/[0.02] transition-colors">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: a.color + '1a' }}>
                <span className="material-symbols-outlined text-[13px]" style={{ color: a.color }}>{a.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#15140F] leading-tight">{a.action}</p>
                <p className="text-[10px] text-[#6B655B] truncate mt-0.5">{a.detail}</p>
                <p className="text-[9px] text-[#15140F] mt-1 uppercase tracking-wider">{a.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
