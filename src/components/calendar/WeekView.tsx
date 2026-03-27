import { Link } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { PLATFORM_REGISTRY } from '../../domain/entities/Platform';
import type { CalendarPost } from '../../domain/entities/CalendarPost';

interface WeekViewProps {
  current: Date;
  posts:   CalendarPost[];
}

function postsForDay(posts: CalendarPost[], d: Date) {
  return posts.filter(p => isSameDay(p.date, d));
}

export default function WeekView({ current, posts }: WeekViewProps) {
  const days = eachDayOfInterval({
    start: startOfWeek(current, { weekStartsOn: 1 }),
    end:   endOfWeek(current,   { weekStartsOn: 1 }),
  });

  return (
    <div className="bg-[#0e0e0e] rounded-3xl border border-[#4c4450]/20 overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[#4c4450]/15">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={[
              'py-3 px-2 text-center border-r border-[#4c4450]/10 last:border-r-0',
              isToday(day) ? 'bg-[#d394ff]/8' : '',
            ].join(' ')}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#988d9c]">{format(day, 'EEE')}</p>
            <div className={[
              'w-8 h-8 rounded-full flex items-center justify-center mx-auto mt-1 text-sm font-bold',
              isToday(day) ? 'bg-[#d394ff] text-[#2f004d]' : 'text-white',
            ].join(' ')}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      {/* Post columns */}
      <div className="grid grid-cols-7 min-h-[400px]">
        {days.map((day) => {
          const dayPosts = postsForDay(posts, day);
          return (
            <div
              key={day.toISOString()}
              className={[
                'p-2 border-r border-[#4c4450]/10 last:border-r-0 space-y-1.5',
                isToday(day) ? 'bg-[#d394ff]/5' : '',
              ].join(' ')}
            >
              {dayPosts.length === 0 && (
                <Link
                  to="/composer"
                  className="flex items-center justify-center w-full h-12 rounded-xl border border-dashed border-[#4c4450]/20 text-[#4c4450] hover:border-[#d394ff]/30 hover:text-[#d394ff] transition-all opacity-0 hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </Link>
              )}
              {dayPosts.map(p => {
                const pl = PLATFORM_REGISTRY[p.platform];
                return (
                  <Link
                    key={p.id}
                    to={`/posts/${p.id}`}
                    className="block rounded-lg overflow-hidden transition-all hover:brightness-125"
                    style={{ background: pl.color + '18', borderLeft: `2px solid ${pl.color}` }}
                  >
                    <div className="px-1.5 py-1">
                      <p className="text-[8px] font-mono leading-none mb-0.5" style={{ color: pl.color }}>{p.time}</p>
                      <p className="text-[9px] font-semibold text-white leading-tight truncate">{p.title}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
