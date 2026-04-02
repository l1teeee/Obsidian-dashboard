import { useRef, useState } from 'react';
import { CHAR_LIMITS, CHAR_IDEAL } from '../../domain/entities/Composer';
import type { ChannelId } from '../../domain/entities/Composer';
import type { MediaItem } from '../../hooks/useComposer';
import { getInspiration } from '../../services/ai.service';
import { useWorkspace } from '../../contexts/WorkspaceContext';

interface CaptionEditorProps {
  caption:             string;
  selectedChannels:    ChannelId[];
  showSuggestions:     boolean;
  mediaItems:          MediaItem[];
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

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB — skip larger blobs to keep payload small

/** Convert a blob: or http: URL to a data: base64 URL safe to send to the API */
async function toSendableUrl(item: MediaItem): Promise<string | null> {
  // Prefer the stored HTTP source URL (DALL-E / already uploaded)
  if (item.sourceUrl?.startsWith('http')) return item.sourceUrl;

  // For blob URLs: fetch, check size, then convert to base64
  if (item.previewUrl.startsWith('blob:')) {
    try {
      const blob = await fetch(item.previewUrl).then(r => r.blob());
      if (blob.size > MAX_IMAGE_BYTES) return null;   // skip — too large for inline payload
      const reader = new FileReader();
      return await new Promise<string>((resolve, reject) => {
        reader.onload  = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }

  // Direct HTTP preview URL (loaded draft with no sourceUrl)
  if (item.previewUrl.startsWith('http')) return item.previewUrl;

  return null;
}

export default function CaptionEditor({
  caption,
  selectedChannels,
  showSuggestions,
  mediaItems,
  onCaptionChange,
  onToggleSuggestions,
}: CaptionEditorProps) {
  const { active } = useWorkspace();

  const [topic,            setTopic]            = useState('');
  const [captions,         setCaptions]         = useState<string[]>([]);
  const [hashtags,         setHashtags]         = useState<string[]>([]);
  const [loading,          setLoading]          = useState(false);
  const [error,            setError]            = useState<string | null>(null);
  // Local selection — nothing goes to the textarea until "Apply to caption"
  const [pickedCaption,    setPickedCaption]    = useState<string | null>(null);
  const [pickedHashtags,   setPickedHashtags]   = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const primaryPlatform = CHANNEL_TO_PLATFORM[selectedChannels[0] ?? 'ig'];
  const hasResults      = captions.length > 0;

  // Images that can be sent for vision analysis (max 4)
  const imageItems = mediaItems.slice(0, 4);
  const hasImages  = imageItems.length > 0;

  async function handleGenerate() {
    const trimmed = topic.trim();
    if (!trimmed && !hasImages) return;
    if (loading) return;

    setLoading(true);
    setError(null);
    try {
      // Resolve all images to sendable URLs concurrently
      let resolvedImageUrls: string[] = [];
      if (hasImages) {
        const results = await Promise.all(imageItems.map(toSendableUrl));
        resolvedImageUrls = results.filter((u): u is string => u !== null);
      }

      const result = await getInspiration({
        topic:       trimmed || undefined,
        platform:    primaryPlatform,
        workspaceId: active?.id,
        imageUrls:   resolvedImageUrls.length > 0 ? resolvedImageUrls : undefined,
      });
      setCaptions(result.captions);
      setHashtags(result.hashtags);
      setPickedCaption(null);
      setPickedHashtags([]);
    } catch (err) {
      setError((err as Error).message ?? 'Could not generate suggestions. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleGenerate();
  }

  function toggleHashtag(tag: string) {
    setPickedHashtags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  }

  function handleApply() {
    const parts: string[] = [];
    if (pickedCaption)         parts.push(pickedCaption);
    if (pickedHashtags.length) parts.push(pickedHashtags.join(' '));
    if (parts.length === 0) return;
    // onCaptionChange already calls setShowSuggestions(false) in PostComposer — don't toggle again
    onCaptionChange(parts.join('\n\n'));
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
          {hasResults ? 'Edit inspire' : 'Inspire me'}
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

            {/* Image analysis badge */}
            {hasImages && (
              <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-[#d394ff]/8 border border-[#d394ff]/15">
                <div className="flex -space-x-1.5 shrink-0">
                  {imageItems.slice(0, 3).map((item, i) => (
                    <img
                      key={i}
                      src={item.previewUrl}
                      alt=""
                      className="w-6 h-6 rounded-md object-cover border border-[#1c1b1b]"
                    />
                  ))}
                  {imageItems.length > 3 && (
                    <div className="w-6 h-6 rounded-md bg-[#d394ff]/20 border border-[#1c1b1b] flex items-center justify-center">
                      <span className="text-[8px] font-bold text-[#d394ff]">+{imageItems.length - 3}</span>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-[#d394ff]/80 leading-tight">
                  <span className="font-bold">{imageItems.length} image{imageItems.length > 1 ? 's' : ''}</span> will be analyzed by GPT-4o Vision
                </p>
              </div>
            )}

            {/* Topic input */}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={hasImages
                  ? 'Optional: add context, mood, or message…'
                  : 'What\'s your post about? e.g. summer launch, mindset shift…'
                }
                className="flex-1 bg-[#252525] border border-[#4c4450]/40 rounded-xl px-3 py-2 text-xs text-[#e5e2e1] placeholder:text-[#988d9c]/50 focus:outline-none focus:border-[#d394ff]/50 focus:ring-1 focus:ring-[#d394ff]/20 transition-all"
              />
              <button
                onClick={handleGenerate}
                disabled={(!topic.trim() && !hasImages) || loading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#d394ff]/15 text-[#d394ff] text-[10px] font-bold uppercase tracking-wider hover:bg-[#d394ff]/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
              >
                <span className={`material-symbols-outlined text-[13px] ${loading ? 'animate-spin' : ''}`}>
                  {loading ? 'progress_activity' : hasResults ? 'refresh' : 'bolt'}
                </span>
                {loading ? 'Analyzing…' : hasResults ? 'Regenerate' : 'Generate'}
              </button>
            </div>

            {/* Error */}
            {error && <p className="text-[10px] text-red-400 px-1">{error}</p>}

            {/* Loading skeletons */}
            {loading && (
              <div className="flex flex-col gap-2">
                {hasImages && (
                  <p className="text-[10px] text-[#d394ff]/60 px-1 flex items-center gap-1.5 animate-pulse">
                    <span className="material-symbols-outlined text-[12px]">image_search</span>
                    Reading your images…
                  </p>
                )}
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
                    Captions — select one
                  </p>
                  {captions.map((c, i) => {
                    const picked = pickedCaption === c;
                    return (
                      <button
                        key={i}
                        onClick={() => { setPickedCaption(picked ? null : c); }}
                        className={[
                          'w-full text-left p-3 rounded-xl transition-all text-xs leading-relaxed border',
                          picked
                            ? 'bg-[#d394ff]/12 border-[#d394ff]/40 text-white'
                            : 'text-[#cfc2d2] border-transparent hover:bg-[#d394ff]/8 hover:border-[#d394ff]/15',
                        ].join(' ')}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={[
                              'material-symbols-outlined shrink-0 mt-0.5 transition-all',
                              picked ? 'text-[#d394ff]' : 'text-[#4c4450]',
                            ].join(' ')}
                            style={{ fontSize: 13, fontVariationSettings: picked ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            {picked ? 'radio_button_checked' : 'radio_button_unchecked'}
                          </span>
                          <span>{c}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Hashtags */}
                {hashtags.length > 0 && (
                  <div className="space-y-2 pt-1 border-t border-[#4c4450]/15">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#4c4450] px-1">
                      Trending Hashtags — click to select
                    </p>
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {hashtags.map((tag, i) => {
                        const picked = pickedHashtags.includes(tag);
                        return (
                          <button
                            key={i}
                            onClick={() => toggleHashtag(tag)}
                            title={picked ? `Remove ${tag}` : `Add ${tag}`}
                            className={[
                              'flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-medium transition-all active:scale-95',
                              picked
                                ? 'bg-[#d394ff]/20 border-[#d394ff]/50 text-[#d394ff]'
                                : 'bg-[#d394ff]/5 border-[#d394ff]/12 text-[#d394ff]/60 hover:bg-[#d394ff]/12 hover:text-[#d394ff] hover:border-[#d394ff]/25',
                            ].join(' ')}
                          >
                            {picked && (
                              <span className="material-symbols-outlined" style={{ fontSize: 10, fontVariationSettings: "'FILL' 1" }}>check</span>
                            )}
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 px-1">
                      <button
                        onClick={() => setPickedHashtags(hashtags)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] text-[#988d9c] hover:text-[#d394ff] hover:bg-[#d394ff]/8 transition-all"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 13 }}>select_all</span>
                        Select all
                      </button>
                      {pickedHashtags.length > 0 && (
                        <button
                          onClick={() => setPickedHashtags([])}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] text-[#988d9c] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/8 transition-all"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>deselect</span>
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Apply button — always visible once results are shown */}
                <div className="pt-1 border-t border-[#4c4450]/15">
                  <button
                    onClick={handleApply}
                    disabled={!pickedCaption && pickedHashtags.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#d394ff] hover:bg-[#e0a8ff] text-[#131313] text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Apply to caption
                    {(pickedCaption || pickedHashtags.length > 0) && (
                      <span className="text-[9px] font-normal opacity-70">
                        ({[pickedCaption ? '1 caption' : '', pickedHashtags.length ? `${pickedHashtags.length} hashtag${pickedHashtags.length > 1 ? 's' : ''}` : ''].filter(Boolean).join(' + ')})
                      </span>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Empty state */}
            {!loading && !hasResults && !error && (
              <p className="text-[10px] text-[#988d9c]/50 px-1 pb-1">
                {hasImages
                  ? 'Hit Generate — GPT-4o will analyze your images and write 3 captions using your AI Settings.'
                  : 'Enter your topic and hit Generate. ChatGPT will write 3 captions + trending hashtags using your AI Settings context.'
                }
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={caption}
        onChange={e => onCaptionChange(e.target.value)}
        className="w-full h-28 bg-[#1c1b1b] border border-[#4c4450]/30 rounded-2xl p-4 text-sm text-[#e5e2e1] focus:ring-2 focus:ring-[#d394ff]/20 focus:border-[#d394ff] outline-none transition-all placeholder:text-[#988d9c]/50 resize-none leading-relaxed"
        placeholder="Write your caption…"
      />

      {/* Per-channel length indicators — below the textarea */}
      <div className="flex items-center gap-4 flex-wrap px-1">
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
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
                {chId.toUpperCase()} · {label}
              </span>
              <div className="h-[2px] w-12 rounded-full bg-[#353534] overflow-hidden">
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
  );
}
