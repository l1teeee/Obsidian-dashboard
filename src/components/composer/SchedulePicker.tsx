import { useState } from 'react';
import DateTimePicker from '../shared/DateTimePicker';
import { suggestScheduleTime } from '../../services/ai.service';
import type { ChannelId } from '../../types/composer.types';
import { useAITokens } from '../../contexts/AITokenContext';

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
  timeFromAnalysis?: boolean;   // true when schedule was set by the AI analysis panel
  onDateChange:      (d: Date) => void;
  onScheduleToggle:  (v: boolean) => void;
}

export default function SchedulePicker({
  scheduleDate,
  isScheduleMode,
  caption,
  selectedChannels,
  timeFromAnalysis = false,
  onDateChange,
  onScheduleToggle,
}: SchedulePickerProps) {
  const { allowed: aiAllowed } = useAITokens();
  const [suggesting, setSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);

  const handleSuggest = async () => {
    setSuggesting(true);
    setSuggestion(null);
    setError(null);
    try {
      const now       = new Date();
      const platforms = [...new Set(selectedChannels.map(id => PLATFORM_MAP[id]))];
      const result    = await suggestScheduleTime({
        caption:     caption || undefined,
        platforms,
        currentHour: now.getHours(),
        weekday:     now.toLocaleDateString('en-US', { weekday: 'long' }),
      });

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
      <label className="text-[11px] uppercase tracking-widest text-[#64748B] font-bold">
        Distribution
      </label>

      {/* Segment control */}
      <div className="flex rounded-2xl bg-[#FFFFFF] border border-[#0F172A]/20 p-1 gap-1">
        <button
          type="button"
          onClick={() => onScheduleToggle(false)}
          className={[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all',
            !isScheduleMode
              ? 'bg-[#111827] text-white shadow-[0_0_16px_rgba(14,159,110,0.3)]'
              : 'text-[#64748B] hover:text-[#0F172A]',
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
              ? 'bg-[#111827] text-white shadow-[0_0_16px_rgba(14,159,110,0.3)]'
              : 'text-[#64748B] hover:text-[#0F172A]',
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

          {/* Suggest time button — hidden when schedule came from AI analysis */}
          {timeFromAnalysis ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111827]/8 border border-[#111827]/20">
              <span className="material-symbols-outlined text-[#111827] text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <p className="text-[10px] text-[#111827]/80 font-medium">Time suggested by AI analysis</p>
            </div>
          ) : !aiAllowed ? (
            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-[#B45309]/8 border border-[#B45309]/20">
              <span className="material-symbols-outlined text-[#B45309] shrink-0 mt-0.5" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>warning</span>
              <p className="text-[10px] text-[#B45309]/90 leading-relaxed">
                Monthly AI token limit reached. Upgrade your plan to use AI schedule suggestions.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSuggest}
              disabled={suggesting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#111827]/25 bg-[#111827]/5 text-[#111827] text-xs font-bold hover:bg-[#111827]/10 hover:border-[#111827]/40 transition-all disabled:opacity-50"
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
          )}

          {/* AI suggestion reason */}
          {suggestion && (
            <p className="text-[10px] text-[#047857] font-medium flex items-start gap-2 px-1">
              <span className="material-symbols-outlined text-[13px] shrink-0 mt-0.5">auto_awesome</span>
              {suggestion}
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-[10px] text-[#DC2626] font-medium flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-[13px]">error</span>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
