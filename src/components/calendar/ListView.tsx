import { Link } from 'react-router-dom';
import { format, isSameDay, isToday, eachDayOfInterval, addDays } from 'date-fns';
import { PLATFORM_REGISTRY } from '../../domain/entities/Platform';
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
      <div className="bg-[#201f1f] rounded-3xl border border-[#4c4450]/10 p-12 text-center">
        <span className="material-symbols-outlined text-[#353534] text-[40px]">event_busy</span>
        <p className="text-[#988d9c] mt-3">No posts in this period.</p>
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
              <p className={`text-xs font-bold uppercase tracking-wider ${isToday(day) ? 'text-[#d394ff]' : isPast ? 'text-[#4c4450]' : 'text-[#988d9c]'}`}>
                {format(day, 'EEE')}
              </p>
              <p className={`font-mono text-2xl font-bold leading-none mt-0.5 ${isToday(day) ? 'text-[#d394ff]' : isPast ? 'text-[#353534]' : 'text-white'}`}>
                {format(day, 'd')}
              </p>
              <p className={`text-[10px] uppercase tracking-wider ${isPast ? 'text-[#353534]' : 'text-[#988d9c]'}`}>
                {format(day, 'MMM')}
              </p>
              {isToday(day) && (
                <span className="inline-block mt-1 w-1.5 h-1.5 rounded-full bg-[#d394ff] shadow-[0_0_6px_rgba(211,148,255,0.8)]" />
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
                    className="flex items-center gap-4 p-4 rounded-2xl border border-[#4c4450]/10 bg-[#201f1f] hover:bg-[#2a2a2a] hover:border-[#d394ff]/20 transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: pl.color }}>
                      <span className="material-symbols-outlined text-white" style={{ fontSize: 16 }}>{pl.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{p.title}</p>
                      <p className="text-[10px] text-[#988d9c] mt-0.5">{pl.name} · {p.time}</p>
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
