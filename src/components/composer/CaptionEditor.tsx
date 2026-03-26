import { useState } from 'react';
import { CHAR_LIMITS, CHAR_IDEAL, AI_SUGGESTIONS } from '../../domain/entities/Composer';
import type { ChannelId } from '../../domain/entities/Composer';

interface CaptionEditorProps {
  caption:             string;
  selectedChannels:    ChannelId[];
  showSuggestions:     boolean;
  onCaptionChange:     (val: string) => void;
  onToggleSuggestions: () => void;
}

type TrafficLight = 'too-short' | 'ideal' | 'long' | 'too-long';

function getStatus(len: number, chId: ChannelId): TrafficLight {
  const { min, softMax, hardMax } = CHAR_IDEAL[chId];
  if (len < min)      return 'too-short';
  if (len <= softMax) return 'ideal';
  if (len <= hardMax) return 'long';
  return 'too-long';
}

const STATUS_META: Record<TrafficLight, { color: string; label: string }> = {
  'too-short': { color: '#ef4444', label: 'Too short' },
  'ideal':     { color: '#22c55e', label: 'Ideal'     },
  'long':      { color: '#eab308', label: 'Long'      },
  'too-long':  { color: '#ef4444', label: 'Too long'  },
};

/** Rotate through suggestion sets to simulate regeneration */
const SUGGESTION_SETS = [
  AI_SUGGESTIONS,
  [
    'Less is more. This visual speaks for itself. ✦',
    'The quiet ones always have the loudest stories. #ObsidianLens 🖤',
    'Crafted with intention. Shared with purpose. What do you see?',
  ],
  [
    'Some moments are too beautiful not to share. 📷',
    'Behind every scroll-stop is a story worth telling. Tell yours.',
    'Authenticity is the rarest filter. No edits needed. ✨',
  ],
];

export default function CaptionEditor({
  caption,
  selectedChannels,
  showSuggestions,
  onCaptionChange,
  onToggleSuggestions,
}: CaptionEditorProps) {
  const [setIndex, setSetIndex]   = useState(0);
  const [loading,  setLoading]    = useState(false);

  const currentSuggestions = SUGGESTION_SETS[setIndex % SUGGESTION_SETS.length];

  function handleRegenerate() {
    setLoading(true);
    setTimeout(() => {
      setSetIndex(i => i + 1);
      setLoading(false);
    }, 900);
  }

  return (
    <div data-editor-section className="space-y-3">
      {/* Label + toggle button */}
      <div className="flex justify-between items-end">
        <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">Caption</label>
        <button
          onClick={onToggleSuggestions}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${
            showSuggestions
              ? 'bg-[#d394ff]/20 text-[#d394ff] border border-[#d394ff]/30'
              : 'bg-[#d394ff]/10 text-[#d394ff] hover:bg-[#d394ff]/20'
          }`}
        >
          <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
          Inspire me
        </button>
      </div>

      {/* AI suggestions panel — smooth open/close */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          showSuggestions ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-[#1c1b1b] rounded-2xl border border-[#d394ff]/20 p-3 space-y-1 mb-1">

            {/* Header row */}
            <div className="flex items-center justify-between px-1 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#d394ff] text-[14px]">auto_awesome</span>
                <span className="text-[10px] font-bold text-[#d394ff] uppercase tracking-widest">AI Suggestions</span>
              </div>
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d394ff]/10 text-[#d394ff] text-[10px] font-bold uppercase tracking-wider hover:bg-[#d394ff]/20 disabled:opacity-50 transition-all active:scale-95"
              >
                <span className={`material-symbols-outlined text-[12px] ${loading ? 'animate-spin' : ''}`}>
                  {loading ? 'progress_activity' : 'refresh'}
                </span>
                Regenerate
              </button>
            </div>

            {/* Suggestions list */}
            {loading ? (
              <div className="flex flex-col gap-2 px-1 py-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 rounded-xl bg-[#d394ff]/5 animate-pulse" />
                ))}
              </div>
            ) : (
              currentSuggestions.map((s, i) => (
                <button
                  key={`${setIndex}-${i}`}
                  onClick={() => onCaptionChange(s)}
                  className="w-full text-left p-3 rounded-xl hover:bg-[#d394ff]/10 transition-colors text-xs text-[#cfc2d2] leading-relaxed border border-transparent hover:border-[#d394ff]/20"
                >
                  {s}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={caption}
          onChange={e => onCaptionChange(e.target.value)}
          className="w-full h-28 bg-[#1c1b1b] border border-[#4c4450]/30 rounded-2xl p-4 pb-12 text-sm text-[#e5e2e1] focus:ring-2 focus:ring-[#d394ff]/20 focus:border-[#d394ff] outline-none transition-all placeholder:text-[#988d9c]/50 resize-none leading-relaxed"
          placeholder="Write your caption…"
        />

        {/* Per-channel indicators */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3 flex-wrap">
          {selectedChannels.map(chId => {
            const limit              = CHAR_LIMITS[chId];
            const status             = getStatus(caption.length, chId);
            const { color, label }   = STATUS_META[status];
            const pct                = Math.min(caption.length / limit, 1);

            return (
              <div key={chId} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0 transition-colors duration-300"
                  style={{ background: color, boxShadow: `0 0 6px ${color}99` }}
                />
                <span className="text-[10px] font-mono leading-none" style={{ color }}>
                  {chId.toUpperCase()} {caption.length}/{limit}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color }}>
                  · {label}
                </span>
                <div className="h-[2px] w-10 rounded-full bg-[#353534] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-150"
                    style={{ width: `${pct * 100}%`, background: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
