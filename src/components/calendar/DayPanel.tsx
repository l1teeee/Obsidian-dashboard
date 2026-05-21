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
    <div ref={panelRef} className="bg-[#F1F5F9] rounded-2xl border border-[#0F172A]/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#0F172A]/5 flex items-center justify-between bg-[#E2E8F0]/30">
        <h3 className="font-headline font-bold text-[#0F172A] flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-[#111827] text-[16px]">event</span>
          {format(selected, 'EEEE, MMMM d')}
          {isToday(selected) && (
            <span className="text-[10px] bg-[#111827]/15 text-[#111827] border border-[#111827]/20 px-2 py-0.5 rounded-full font-bold">Today</span>
          )}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#64748B]">{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
          <Link
            to="/composer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] text-white text-xs font-bold hover:bg-[#0B1220] transition-all"
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
          <span className="material-symbols-outlined text-[#CBD5E1] text-[32px]">event_busy</span>
          <p className="text-xs text-[#64748B] mt-2">No posts scheduled for this day.</p>
        </div>
      )}
    </div>
  );
}
