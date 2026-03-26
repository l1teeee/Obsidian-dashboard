import { useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, isToday } from 'date-fns';
import gsap from 'gsap';
import type { CalendarPost } from '../../domain/entities/CalendarPost';
import { PLATFORM_REGISTRY } from '../../domain/entities/Platform';
import PostPill from './PostPill';
import DayPanel from './DayPanel';

interface MonthViewProps {
  current:     Date;
  selected:    Date | null;
  onSelectDay: (d: Date) => void;
  posts:       CalendarPost[];
}

function postsForDay(posts: CalendarPost[], d: Date) {
  return posts.filter(p => isSameDay(p.date, d));
}

export default function MonthView({ current, selected, onSelectDay, posts }: MonthViewProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -12, scale: 0.98 },
        { opacity: 1, y: 0,   scale: 1,    duration: 0.28, ease: 'power2.out' },
      );
    }
  }, [selected]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(current), { weekStartsOn: 0 }),
    end:   endOfWeek(endOfMonth(current),     { weekStartsOn: 0 }),
  });

  const selectedPosts = selected ? postsForDay(posts, selected) : [];

  return (
    <div className="space-y-4">
      <div className="bg-[#0e0e0e] rounded-3xl border border-[#4c4450]/20 overflow-hidden">
        {/* Day header row */}
        <div className="grid grid-cols-7 border-b border-[#4c4450]/15">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#988d9c]">{d}</div>
          ))}
        </div>
        {/* Cells */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const dayPosts   = postsForDay(posts, day);
            const isCurrentM = isSameMonth(day, current);
            const isSel      = selected ? isSameDay(day, selected) : false;
            const isTdy      = isToday(day);

            return (
              <div
                key={i}
                onClick={() => onSelectDay(isSel ? selected! : day)}
                className={[
                  'min-h-[80px] md:min-h-[100px] p-2 border-b border-r border-[#4c4450]/10 cursor-pointer transition-colors last:border-r-0',
                  !isCurrentM ? 'opacity-30' : '',
                  isSel ? 'bg-[#d394ff]/8' : 'hover:bg-[#201f1f]/60',
                ].join(' ')}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={[
                    'w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all',
                    isTdy ? 'bg-[#d394ff] text-[#2f004d]' : isSel ? 'text-[#d394ff]' : 'text-[#cfc2d2]',
                  ].join(' ')}>
                    {format(day, 'd')}
                  </span>
                  {dayPosts.length > 0 && isCurrentM && (
                    <span className="text-[9px] font-mono text-[#988d9c]">{dayPosts.length}</span>
                  )}
                </div>
                <div className="space-y-0.5 hidden sm:block">
                  {dayPosts.slice(0, 3).map((p, j) => (
                    <PostPill key={j} post={p} compact />
                  ))}
                  {dayPosts.length > 3 && (
                    <p className="text-[9px] text-[#988d9c] pl-0.5">+{dayPosts.length - 3} more</p>
                  )}
                </div>
                <div className="flex gap-0.5 mt-1 sm:hidden">
                  {dayPosts.slice(0, 4).map((p, j) => (
                    <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: PLATFORM_REGISTRY[p.platform].color }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <DayPanel selected={selected} posts={selectedPosts} panelRef={panelRef} />
      )}
    </div>
  );
}
