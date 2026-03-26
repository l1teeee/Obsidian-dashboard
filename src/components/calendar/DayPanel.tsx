import { Link } from 'react-router-dom';
import { format, isToday } from 'date-fns';
import type { RefObject } from 'react';
import type { CalendarPost } from '../../domain/entities/CalendarPost';
import PostPill from './PostPill';

interface DayPanelProps {
  selected: Date;
  posts:    CalendarPost[];
  panelRef: RefObject<HTMLDivElement | null>;
}

export default function DayPanel({ selected, posts, panelRef }: DayPanelProps) {
  return (
    <div ref={panelRef} className="bg-[#201f1f] rounded-2xl border border-[#4c4450]/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#4c4450]/5 flex items-center justify-between bg-[#2a2a2a]/30">
        <h3 className="font-headline font-bold text-white flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-[#d394ff] text-[16px]">event</span>
          {format(selected, 'EEEE, MMMM d')}
          {isToday(selected) && (
            <span className="text-[10px] bg-[#d394ff]/15 text-[#d394ff] border border-[#d394ff]/20 px-2 py-0.5 rounded-full font-bold">Today</span>
          )}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#988d9c]">{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
          <Link
            to="/composer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d394ff] text-[#2f004d] text-xs font-bold hover:shadow-[0_0_16px_rgba(211,148,255,0.4)] transition-all"
          >
            <span className="material-symbols-outlined text-[13px]">add</span>
            Schedule
          </Link>
        </div>
      </div>
      {posts.length > 0 ? (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {posts.map(p => <PostPill key={p.id} post={p} />)}
        </div>
      ) : (
        <div className="px-6 py-8 text-center">
          <span className="material-symbols-outlined text-[#353534] text-[32px]">event_busy</span>
          <p className="text-xs text-[#988d9c] mt-2">No posts scheduled for this day.</p>
        </div>
      )}
    </div>
  );
}
