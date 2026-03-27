import { useState } from 'react';
import DateTimePicker from '../shared/DateTimePicker';
import { suggestScheduleTime } from '../../services/ai.service';
import type { ChannelId } from '../../domain/entities/Composer';

const PLATFORM_MAP: Record<ChannelId, string> = {
  ig: 'meta',
  li: 'linkedin',
  fb: 'meta',
};

interface SchedulePickerProps {
  scheduleDate:      Date;
  isScheduleMode:    boolean;
  caption:           string;
  selectedChannels:  ChannelId[];
  onDateChange:      (d: Date) => void;
  onScheduleToggle:  (v: boolean) => void;
}

export default function SchedulePicker({
  scheduleDate,
  isScheduleMode,
  caption,
  selectedChannels,
  onDateChange,
  onScheduleToggle,
}: SchedulePickerProps) {
  const [suggesting, setSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);

  const handleSuggest = async () => {
    setSuggesting(true);
    setSuggestion(null);
    setError(null);
    try {
      const platforms = [...new Set(selectedChannels.map(id => PLATFORM_MAP[id]))];
      const result    = await suggestScheduleTime({ caption: caption || undefined, platforms });

      const suggested = new Date();
      suggested.setDate(suggested.getDate() + result.dayOffset);
      suggested.setHours(result.hour, result.minute, 0, 0);

      onDateChange(suggested);
      setSuggestion(result.reason);
    } catch {
      setError('Could not generate suggestion. Try again.');
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div data-editor-section className="space-y-3 pb-10">
      <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">
        Distribution
      </label>

      {/* Segment control */}
      <div className="flex rounded-2xl bg-[#1c1b1b] border border-[#4c4450]/20 p-1 gap-1">
        <button
          type="button"
          onClick={() => onScheduleToggle(false)}
          className={[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all',
            !isScheduleMode
              ? 'bg-[#d394ff] text-[#2f004d] shadow-[0_0_16px_rgba(211,148,255,0.3)]'
              : 'text-[#988d9c] hover:text-white',
          ].join(' ')}
        >
          <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            bolt
          </span>
          Publish now
        </button>

        <button
          type="button"
          onClick={() => onScheduleToggle(true)}
          className={[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all',
            isScheduleMode
              ? 'bg-[#d394ff] text-[#2f004d] shadow-[0_0_16px_rgba(211,148,255,0.3)]'
              : 'text-[#988d9c] hover:text-white',
          ].join(' ')}
        >
          <span className="material-symbols-outlined text-[15px]">schedule</span>
          Schedule
        </button>
      </div>

      {/* Date picker — only when schedule is selected */}
      <div
        className={[
          'transition-all duration-300 ease-in-out',
          isScheduleMode
            ? 'max-h-[500px] opacity-100 mt-1'
            : 'max-h-0 overflow-hidden opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <div className="space-y-2 pt-1">
          <DateTimePicker value={scheduleDate} onChange={onDateChange} />

          {/* Suggest time button */}
          <button
            type="button"
            onClick={handleSuggest}
            disabled={suggesting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#d394ff]/25 bg-[#d394ff]/5 text-[#d394ff] text-xs font-bold hover:bg-[#d394ff]/10 hover:border-[#d394ff]/40 transition-all disabled:opacity-50"
          >
            {suggesting ? (
              <>
                <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                Analyzing caption…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                Suggest best time
              </>
            )}
          </button>

          {/* AI suggestion reason */}
          {suggestion && (
            <p className="text-[10px] text-[#c5d247] font-medium flex items-start gap-2 px-1">
              <span className="material-symbols-outlined text-[13px] shrink-0 mt-0.5">bolt</span>
              {suggestion}
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-[10px] text-[#ffb4ab] font-medium flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-[13px]">error</span>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
