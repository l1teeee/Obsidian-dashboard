import { useNavigate } from 'react-router-dom';
import type { ActivityEntry } from '../../domain/entities/Profile';

interface ActivityFeedProps {
  activity: ActivityEntry[];
}

export default function ActivityFeed({ activity }: ActivityFeedProps) {
  const navigate = useNavigate();

  return (
    <div data-section className="bg-[#F1F5F9] rounded-3xl border border-[#0F172A]/10 overflow-hidden">
      <div className="px-6 py-5 border-b border-[#0F172A]/5 bg-[#E2E8F0]/20 flex items-center justify-between">
        <h3 className="font-headline font-bold text-[#0F172A] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#111827] text-[18px]">history</span>
          Recent Activity
        </h3>
        <button
          onClick={() => navigate('/activity')}
          className="text-[10px] text-[#111827] font-bold uppercase tracking-widest hover:text-[#0F172A] transition-colors flex items-center gap-1"
        >
          View All
          <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
        </button>
      </div>
      <div className="divide-y divide-[#0F172A]/5">
        {activity.length === 0 ? (
          <div className="px-6 py-8 flex flex-col items-center gap-2 text-center">
            <span className="material-symbols-outlined text-[#0F172A] text-[32px]">history</span>
            <p className="text-sm text-[#64748B]">No recent activity</p>
          </div>
        ) : (
          activity.map((a, i) => (
            <div key={i} data-activity className="px-6 py-3.5 flex gap-3 hover:bg-white/[0.02] transition-colors">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: a.color + '1a' }}>
                <span className="material-symbols-outlined text-[13px]" style={{ color: a.color }}>{a.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#0F172A] leading-tight">{a.action}</p>
                <p className="text-[10px] text-[#64748B] truncate mt-0.5">{a.detail}</p>
                <p className="text-[9px] text-[#0F172A] mt-1 uppercase tracking-wider">{a.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
