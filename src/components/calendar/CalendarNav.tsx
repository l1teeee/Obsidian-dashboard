import type { View } from '../../hooks/useCalendar';

interface CalendarNavProps {
  navLabel:     string;
  view:         View;
  onBack:       () => void;
  onForward:    () => void;
  onToday:      () => void;
  onViewChange: (v: View) => void;
}

export default function CalendarNav({ navLabel, view, onBack, onForward, onToday, onViewChange }: CalendarNavProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F1F5F9] border border-[#0F172A]/15 text-[#64748B] hover:text-[#0F172A] hover:border-[#111827]/30 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
        </button>
        <button
          onClick={onToday}
          className="px-3 py-1.5 rounded-xl bg-[#F1F5F9] border border-[#0F172A]/15 text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:border-[#111827]/30 transition-all"
        >
          Today
        </button>
        <button
          onClick={onForward}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F1F5F9] border border-[#0F172A]/15 text-[#64748B] hover:text-[#0F172A] hover:border-[#111827]/30 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
        </button>
        <h2 className="font-headline text-lg font-bold text-[#0F172A] ml-2">{navLabel}</h2>
      </div>

      {/* View switcher */}
      <div className="flex bg-[#F1F5F9] rounded-xl p-1 border border-[#0F172A]/10 self-start sm:self-auto">
        {(['month', 'week', 'list'] as View[]).map(v => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={[
              'px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
              view === v
                ? 'bg-[#111827] text-white shadow-[0_0_12px_rgba(14,159,110,0.2)]'
                : 'text-[#64748B] hover:text-[#0F172A]',
            ].join(' ')}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
