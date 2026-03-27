import { useRef, useState } from 'react';
import { CHAR_LIMITS, CHAR_IDEAL } from '../../domain/entities/Composer';
import type { ChannelId } from '../../domain/entities/Composer';
import { getInspiration } from '../../services/ai.service';
import { useWorkspace } from '../../contexts/WorkspaceContext';

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

const CHANNEL_TO_PLATFORM: Record<ChannelId, string> = {
  ig: 'meta',
  li: 'linkedin',
  fb: 'meta',
};

const STATUS_META: Record<TrafficLight, { color: string; label: string }> = {
  'too-short': { color: '#ef4444', label: 'Too short' },
  'ideal':     { color: '#22c55e', label: 'Ideal'     },
  'long':      { color: '#eab308', label: 'Long'      },
  'too-long':  { color: '#ef4444', label: 'Too long'  },
};

export default function CaptionEditor({
  caption,
  selectedChannels,
  showSuggestions,
  onCaptionChange,
  onToggleSuggestions,
}: CaptionEditorProps) {
  const { active } = useWorkspace();

  const [topic,    setTopic]    = useState('');
  const [captions, setCaptions] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const primaryPlatform = CHANNEL_TO_PLATFORM[selectedChannels[0] ?? 'ig'];
  const hasResults = captions.length > 0;

  async function handleGenerate() {
    const trimmed = topic.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getInspiration({
        topic:       trimmed,
        platform:    primaryPlatform,
        workspaceId: active?.id,
      });
      setCaptions(result.captions);
      setHashtags(result.hashtags);
    } catch (err) {
      setError((err as Error).message ?? 'Could not generate suggestions. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleGenerate();
  }

  function appendHashtag(tag: string) {
    const sep = caption.trimEnd().length > 0 ? ' ' : '';
    onCaptionChange(caption.trimEnd() + sep + tag);
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

      {/* AI panel — smooth open/close */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          showSuggestions ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-[#1c1b1b] rounded-2xl border border-[#d394ff]/20 p-3 space-y-3 mb-1">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#d394ff] text-[14px]">auto_awesome</span>
                <span className="text-[10px] font-bold text-[#d394ff] uppercase tracking-widest">AI Caption Generator</span>
              </div>
              {hasResults && (
                <span className="text-[9px] text-[#988d9c]/60 uppercase tracking-widest">
                  Powered by ChatGPT
                </span>
              )}
            </div>

            {/* Topic input */}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What's your post about? e.g. summer launch, mindset shift, new product…"
                className="flex-1 bg-[#252525] border border-[#4c4450]/40 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] placeholder:text-[#988d9c]/50 focus:outline-none focus:border-[#d394ff]/50 focus:ring-1 focus:ring-[#d394ff]/20 transition-all"
              />
              <button
                onClick={handleGenerate}
                disabled={!topic.trim() || loading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#d394ff]/15 text-[#d394ff] text-[10px] font-bold uppercase tracking-wider hover:bg-[#d394ff]/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
              >
                <span className={`material-symbols-outlined text-[13px] ${loading ? 'animate-spin' : ''}`}>
                  {loading ? 'progress_activity' : hasResults ? 'refresh' : 'bolt'}
                </span>
                {loading ? 'Generating…' : hasResults ? 'Regenerate' : 'Generate'}
              </button>
            </div>

            {/* Error */}
            {error && <p className="text-[10px] text-red-400 px-1">{error}</p>}

            {/* Loading skeletons */}
            {loading && (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map(i => <div key={i} className="h-10 rounded-xl bg-[#d394ff]/5 animate-pulse" />)}
                <div className="h-6 w-3/4 rounded-full bg-[#d394ff]/5 animate-pulse mt-1" />
              </div>
            )}

            {/* Results */}
            {!loading && hasResults && (
              <>
                {/* Caption suggestions */}
                <div className="space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#4c4450] px-1">
                    Captions — click to use
                  </p>
                  {captions.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => onCaptionChange(c)}
                      className="w-full text-left p-3 rounded-xl hover:bg-[#d394ff]/10 transition-colors text-xs text-[#cfc2d2] leading-relaxed border border-transparent hover:border-[#d394ff]/20"
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Hashtags */}
                {hashtags.length > 0 && (
                  <div className="space-y-2 pt-1 border-t border-[#4c4450]/15">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#4c4450] px-1">
                      Trending Hashtags — click to add
                    </p>
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {hashtags.map((tag, i) => (
                        <button
                          key={i}
                          onClick={() => appendHashtag(tag)}
                          title={`Add ${tag} to caption`}
                          className="px-2.5 py-1 rounded-full bg-[#d394ff]/8 border border-[#d394ff]/15 text-[#d394ff] text-[10px] font-medium hover:bg-[#d394ff]/20 hover:border-[#d394ff]/30 transition-all active:scale-95"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => onCaptionChange(
                        (caption.trimEnd() ? caption.trimEnd() + '\n\n' : '') + hashtags.join(' ')
                      )}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] text-[#988d9c] hover:text-[#d394ff] hover:bg-[#d394ff]/8 transition-all ml-1"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>select_all</span>
                      Add all hashtags
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Empty state */}
            {!loading && !hasResults && !error && (
              <p className="text-[10px] text-[#988d9c]/50 px-1 pb-1">
                Enter your topic and hit Generate. ChatGPT will write 3 captions + trending hashtags using your AI Settings context.
              </p>
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
            const limit            = CHAR_LIMITS[chId];
            const status           = getStatus(caption.length, chId);
            const { color, label } = STATUS_META[status];
            const pct              = Math.min(caption.length / limit, 1);

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
