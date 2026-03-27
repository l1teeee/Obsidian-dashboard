import { useEffect, useRef, useState } from 'react';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval,
  isSameMonth, isSameDay, isToday, isBefore, startOfDay,
} from 'date-fns';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DateTimePickerProps {
  value:    Date;
  onChange: (d: Date) => void;
  minDate?: Date;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildCalendarDays(month: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end:   endOfWeek(endOfMonth(month),     { weekStartsOn: 1 }),
  });
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** If `next` is today and in the past, snap it to the current time. */
function clampToNow(next: Date): Date {
  const now = new Date();
  if (isToday(next) && next < now) {
    const clamped = new Date(next);
    clamped.setHours(now.getHours(), now.getMinutes(), 0, 0);
    return clamped;
  }
  return next;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CalendarGrid({
  month, selected, minDate, onSelect,
}: {
  month:    Date;
  selected: Date;
  minDate:  Date;
  onSelect: (d: Date) => void;
}) {
  const days = buildCalendarDays(month);
  const DOW  = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  return (
    <div>
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DOW.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-[#4c4450] py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map(day => {
          const isSelected    = isSameDay(day, selected);
          const isCurrentMonth = isSameMonth(day, month);
          const isPast        = isBefore(startOfDay(day), minDate);
          const isTodayDate   = isToday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(day)}
              className={[
                'h-8 w-8 mx-auto flex items-center justify-center rounded-full text-[12px] font-medium transition-all',
                isSelected
                  ? 'bg-[#d394ff] text-[#2f004d] font-bold'
                  : isPast
                  ? 'text-[#4c4450] cursor-not-allowed'
                  : !isCurrentMonth
                  ? 'text-[#4c4450]/50 hover:text-[#988d9c]'
                  : isTodayDate
                  ? 'text-[#d394ff] font-bold hover:bg-[#d394ff]/15'
                  : 'text-[#e5e2e1] hover:bg-[#d394ff]/15',
              ].join(' ')}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Defined outside TimeSelector so React never remounts it on re-render
function Stepper({
  draft, onDraftChange, onUp, onDown, onCommit, label,
}: {
  draft: string;
  onDraftChange: (v: string) => void;
  onUp: () => void;
  onDown: () => void;
  onCommit: (v: string) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button" onClick={onUp}
        className="w-8 h-6 flex items-center justify-center rounded-lg text-[#988d9c] hover:text-[#d394ff] hover:bg-[#d394ff]/10 transition-all"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>keyboard_arrow_up</span>
      </button>
      <input
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={draft}
        onChange={e => onDraftChange(e.target.value.replace(/\D/g, ''))}
        onBlur={e => onCommit(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
        onFocus={e => e.target.select()}
        className="w-12 text-center text-xl font-bold font-mono text-white bg-[#131313] border border-[#4c4450]/30 rounded-lg py-1 focus:outline-none focus:border-[#d394ff]/50 transition-colors"
      />
      <button
        type="button" onClick={onDown}
        className="w-8 h-6 flex items-center justify-center rounded-lg text-[#988d9c] hover:text-[#d394ff] hover:bg-[#d394ff]/10 transition-all"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>keyboard_arrow_down</span>
      </button>
      <span className="text-[9px] uppercase tracking-widest text-[#4c4450] font-bold">{label}</span>
    </div>
  );
}

function TimeSelector({
  value,
  onChange,
}: {
  value:    Date;
  onChange: (d: Date) => void;
}) {
  const hours   = value.getHours();
  const minutes = value.getMinutes();

  const [hrDraft,  setHrDraft]  = useState(pad(hours));
  const [minDraft, setMinDraft] = useState(pad(minutes));

  // Sync drafts when value changes (e.g., day selected → time clamped)
  useEffect(() => {
    setHrDraft(pad(value.getHours()));
    setMinDraft(pad(value.getMinutes()));
  }, [value]);

  const applyHours = (raw: string) => {
    const n = parseInt(raw, 10);
    if (isNaN(n)) { setHrDraft(pad(hours)); return; }
    const clamped = Math.min(23, Math.max(0, n));
    const next = new Date(value);
    next.setHours(clamped);
    const final = clampToNow(next);
    onChange(final);
    setHrDraft(pad(final.getHours()));
    setMinDraft(pad(final.getMinutes()));
  };

  const applyMinutes = (raw: string) => {
    const n = parseInt(raw, 10);
    if (isNaN(n)) { setMinDraft(pad(minutes)); return; }
    const clamped = Math.min(59, Math.max(0, n));
    const next = new Date(value);
    next.setMinutes(clamped);
    const final = clampToNow(next);
    onChange(final);
    setHrDraft(pad(final.getHours()));
    setMinDraft(pad(final.getMinutes()));
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-3 mt-3 border-t border-[#4c4450]/20">
      <Stepper
        draft={hrDraft}
        onDraftChange={setHrDraft}
        onUp={() => applyHours(String((hours + 1) % 24))}
        onDown={() => applyHours(String((hours - 1 + 24) % 24))}
        onCommit={applyHours}
        label="hr"
      />
      <span className="text-xl font-bold text-[#4c4450] mb-5">:</span>
      <Stepper
        draft={minDraft}
        onDraftChange={setMinDraft}
        onUp={() => applyMinutes(String((minutes + 1) % 60))}
        onDown={() => applyMinutes(String((minutes - 1 + 60) % 60))}
        onCommit={applyMinutes}
        label="min"
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DateTimePicker({ value, onChange, minDate }: DateTimePickerProps) {
  const [open,  setOpen]  = useState(false);
  const [month, setMonth] = useState<Date>(startOfMonth(value));
  const containerRef      = useRef<HTMLDivElement>(null);
  const min               = minDate ?? startOfDay(new Date());

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleDaySelect = (day: Date) => {
    const next = new Date(day);
    next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    onChange(clampToNow(next));
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Single trigger card */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={[
          'w-full flex items-center gap-0 bg-[#1c1b1b] border rounded-2xl overflow-hidden transition-colors text-left',
          open ? 'border-[#d394ff]/50' : 'border-[#4c4450]/30 hover:border-[#d394ff]/40',
        ].join(' ')}
      >
        {/* Date side */}
        <div className="flex items-center gap-3 px-4 py-3.5 flex-1">
          <div className="w-8 h-8 rounded-xl bg-[#d394ff]/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 16 }}>calendar_today</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#4c4450]">Date</span>
            <span className="text-sm font-semibold text-white leading-tight">{format(value, 'MMM d, yyyy')}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch bg-[#4c4450]/25" />

        {/* Time side */}
        <div className="flex items-center gap-3 px-4 py-3.5 flex-1">
          <div className="w-8 h-8 rounded-xl bg-[#d394ff]/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 16 }}>schedule</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#4c4450]">Time</span>
            <span className="text-sm font-semibold text-white leading-tight">{format(value, 'h:mm a')}</span>
          </div>
        </div>

        {/* Chevron */}
        <div className="pr-3">
          <span className={`material-symbols-outlined text-[#988d9c] transition-transform duration-200 ${open ? '[transform:rotate(180deg)]' : ''}`} style={{ fontSize: 18 }}>
            expand_more
          </span>
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute bottom-full mb-3 left-0 z-50 w-[300px] bg-[#1c1b1b] border border-[#4c4450]/30 rounded-2xl shadow-[0_16px_60px_rgba(0,0,0,0.7)] p-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setMonth(m => subMonths(m, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-[#988d9c] hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
            </button>
            <span className="text-sm font-bold text-white">{format(month, 'MMMM yyyy')}</span>
            <button
              type="button"
              onClick={() => setMonth(m => addMonths(m, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-[#988d9c] hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
            </button>
          </div>

          {/* Calendar grid */}
          <CalendarGrid
            month={month}
            selected={value}
            minDate={min}
            onSelect={handleDaySelect}
          />

          {/* Time stepper */}
          <TimeSelector value={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
