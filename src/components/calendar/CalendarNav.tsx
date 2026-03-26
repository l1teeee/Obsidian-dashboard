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
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#201f1f] border border-[#4c4450]/15 text-[#988d9c] hover:text-white hover:border-[#d394ff]/30 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
        </button>
        <button
          onClick={onToday}
          className="px-3 py-1.5 rounded-xl bg-[#201f1f] border border-[#4c4450]/15 text-xs font-bold text-[#988d9c] hover:text-white hover:border-[#d394ff]/30 transition-all"
        >
          Today
        </button>
        <button
          onClick={onForward}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#201f1f] border border-[#4c4450]/15 text-[#988d9c] hover:text-white hover:border-[#d394ff]/30 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
        </button>
        <h2 className="font-headline text-lg font-bold text-white ml-2">{navLabel}</h2>
      </div>

      {/* View switcher */}
      <div className="flex bg-[#201f1f] rounded-xl p-1 border border-[#4c4450]/10 self-start sm:self-auto">
        {(['month', 'week', 'list'] as View[]).map(v => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={[
              'px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
              view === v
                ? 'bg-[#d394ff] text-[#2f004d] shadow-[0_0_12px_rgba(211,148,255,0.2)]'
                : 'text-[#988d9c] hover:text-white',
            ].join(' ')}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
