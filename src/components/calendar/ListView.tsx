import { Link } from 'react-router-dom';
import { format, isSameDay, isToday, eachDayOfInterval, addDays } from 'date-fns';
import { PLATFORM_REGISTRY } from '../../domain/entities/Platform';
import SocialBrandIcon from '../shared/SocialBrandIcon';
import StatusBadge from '../shared/StatusBadge';
import type { CalendarPost } from '../../domain/entities/CalendarPost';

interface ListViewProps {
  posts: CalendarPost[];
}

function postsForDay(posts: CalendarPost[], d: Date) {
  return posts.filter(p => isSameDay(p.date, d));
}

function hasPostsDay(posts: CalendarPost[], d: Date) {
  return postsForDay(posts, d).length > 0;
}

export default function ListView({ posts }: ListViewProps) {
  const start   = addDays(new Date(), -7);
  const end     = addDays(new Date(), 30);
  const allDays = eachDayOfInterval({ start, end }).filter(d => hasPostsDay(posts, d));

  if (allDays.length === 0) {
    return (
      <div className="bg-[#F1F5F9] rounded-3xl border border-[#0F172A]/10 p-12 text-center">
        <span className="material-symbols-outlined text-[#CBD5E1] text-[40px]">event_busy</span>
        <p className="text-[#64748B] mt-3">No posts in this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allDays.map(day => {
        const dayPosts = postsForDay(posts, day);
        const isPast   = day < new Date() && !isToday(day);

        return (
          <div key={day.toISOString()} className="flex gap-4">
            {/* Date column */}
            <div className="w-20 shrink-0 pt-1 text-right">
              <p className={`text-xs font-bold uppercase tracking-wider ${isToday(day) ? 'text-[#111827]' : isPast ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
                {format(day, 'EEE')}
              </p>
              <p className={`font-mono text-2xl font-bold leading-none mt-0.5 ${isToday(day) ? 'text-[#111827]' : isPast ? 'text-[#CBD5E1]' : 'text-[#0F172A]'}`}>
                {format(day, 'd')}
              </p>
              <p className={`text-[10px] uppercase tracking-wider ${isPast ? 'text-[#CBD5E1]' : 'text-[#64748B]'}`}>
                {format(day, 'MMM')}
              </p>
              {isToday(day) && (
                <span className="inline-block mt-1 w-1.5 h-1.5 rounded-full bg-[#111827] shadow-[0_0_6px_rgba(14,159,110,0.8)]" />
              )}
            </div>

            {/* Posts */}
            <div className={`flex-1 space-y-2 ${isPast ? 'opacity-50' : ''}`}>
              {dayPosts.map(p => {
                const pl = PLATFORM_REGISTRY[p.platform];
                return (
                  <Link
                    key={p.id}
                    to={`/posts/${p.id}`}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-[#0F172A]/10 bg-[#F1F5F9] hover:bg-[#E2E8F0] hover:border-[#111827]/20 transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: pl.color }}>
                      <SocialBrandIcon platformId={p.platform} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">{p.title}</p>
                      <p className="text-[10px] text-[#64748B] mt-0.5">{pl.name} · {p.time}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
