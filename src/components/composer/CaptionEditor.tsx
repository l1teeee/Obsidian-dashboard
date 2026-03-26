import { CHAR_LIMITS, AI_SUGGESTIONS } from '../../domain/entities/Composer';
import type { ChannelId } from '../../domain/entities/Composer';

interface CaptionEditorProps {
  caption:          string;
  selectedChannels: ChannelId[];
  showSuggestions:  boolean;
  onCaptionChange:  (val: string) => void;
  onToggleSuggestions: () => void;
}

export default function CaptionEditor({
  caption,
  selectedChannels,
  showSuggestions,
  onCaptionChange,
  onToggleSuggestions,
}: CaptionEditorProps) {
  return (
    <div data-editor-section className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">Caption & Context</label>
        <button
          onClick={onToggleSuggestions}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d394ff]/10 text-[#d394ff] text-[10px] font-bold uppercase tracking-wider hover:bg-[#d394ff]/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
          AI Suggestions
        </button>
      </div>

      {showSuggestions && (
        <div className="bg-[#1c1b1b] rounded-2xl border border-[#d394ff]/20 p-3 space-y-1">
          {AI_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => onCaptionChange(s)}
              className="w-full text-left p-3 rounded-xl hover:bg-[#d394ff]/10 transition-colors text-xs text-[#cfc2d2] leading-relaxed border border-transparent hover:border-[#d394ff]/20"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <textarea
          value={caption}
          onChange={e => onCaptionChange(e.target.value)}
          className="w-full h-48 bg-[#1c1b1b] border border-[#4c4450]/30 rounded-3xl p-6 pb-14 text-[#e5e2e1] focus:ring-2 focus:ring-[#d394ff]/20 focus:border-[#d394ff] outline-none transition-all placeholder:text-[#988d9c]/50 resize-none leading-relaxed"
          placeholder="What's the story behind this post?"
        />
        {/* Per-channel char counters */}
        <div className="absolute bottom-4 right-5 flex gap-4">
          {selectedChannels.map(chId => {
            const limit = CHAR_LIMITS[chId] ?? 2200;
            const pct   = caption.length / limit;
            const color = pct > 0.9 ? '#ffb4ab' : pct > 0.7 ? '#c5d247' : '#d394ff';
            return (
              <div key={chId} className="flex flex-col items-end">
                <span className="text-[10px] font-mono" style={{ color }}>{chId.toUpperCase()}: {caption.length}/{limit}</span>
                <div className="h-[2px] w-8 mt-1 rounded-full bg-[#353534] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-150" style={{ width: `${Math.min(pct * 100, 100)}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
