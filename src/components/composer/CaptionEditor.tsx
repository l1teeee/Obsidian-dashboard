import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CHAR_LIMITS, CHAR_IDEAL } from '../../domain/entities/Composer';
import type { ChannelId } from '../../types/composer.types';
import type { MediaItem } from '../../hooks/useComposer';
import { getInspiration } from '../../services/ai.service';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useAITokens } from '../../contexts/AITokenContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface CaptionEditorProps {
  caption:             string;
  selectedChannels:    ChannelId[];
  showSuggestions:     boolean;
  mediaItems:          MediaItem[];
  preferred:           ChannelId | null;
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

const CHANNEL_NAMES: Record<ChannelId, string> = {
  ig: 'Instagram',
  li: 'LinkedIn',
  fb: 'Facebook',
};

const STATUS_META: Record<TrafficLight, { color: string; label: string }> = {
  'too-short': { color: '#94A3B8', label: 'Keep writing' },
  'ideal':     { color: '#047857', label: 'Ideal'        },
  'long':      { color: '#B45309', label: 'Long'         },
  'too-long':  { color: '#DC2626', label: 'Too long'     },
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
  preferred,
  onCaptionChange,
  onToggleSuggestions,
}: CaptionEditorProps) {
  const { active } = useWorkspace();
  const { allowed: aiAllowed } = useAITokens();

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

  // Only non-AI images for vision analysis (max 4) — AI-generated images are excluded
  const imageItems  = mediaItems.filter(i => !i.isAIGenerated).slice(0, 4);
  const hasImages   = imageItems.length > 0;
  const hasAIImages = mediaItems.some(i => i.isAIGenerated);

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
      const raw = err as Error & { errorCode?: string };
      if (raw.errorCode === 'AI_NOT_CONFIGURED') {
        setError('AI is not configured on this server. Please contact support.');
      } else {
        setError('The AI didn\'t respond correctly. Hit Generate to try again.');
      }
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
    <div data-editor-section className="space-y-2">

      {/* Unified caption card */}
      <div className="bg-[#FFFFFF] border border-[#0F172A]/30 rounded-2xl overflow-hidden">

        {/* Card header — always visible */}
        <div className="flex justify-between items-center px-4 pt-3 pb-2.5">
          <label className="text-[11px] uppercase tracking-widest text-[#64748B] font-bold">Caption</label>
          {!hasAIImages && (
            <button
              onClick={onToggleSuggestions}
              disabled={!aiAllowed}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 border bg-[#111827]/15 text-[#111827] border-[#111827]/30 hover:bg-[#111827]/25 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[11px]">auto_awesome</span>
              {aiAllowed ? (hasResults ? 'Edit AI' : 'Generate with AI') : 'AI limit reached'}
            </button>
          )}
        </div>

        {/* AI section — smooth expand/collapse */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            showSuggestions ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-3 pt-1 pb-3 space-y-3 border-t border-[#0F172A]/15">

              {/* Token limit banner */}
              {!aiAllowed && (
                <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-[#B45309]/8 border border-[#B45309]/20 mt-2">
                  <span className="material-symbols-outlined text-[#B45309] shrink-0 mt-0.5" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>warning</span>
                  <p className="text-[10px] text-[#B45309]/90 leading-relaxed">
                    Monthly AI token limit reached. Upgrade your plan to keep using AI features.
                  </p>
                </div>
              )}

              {/* Image analysis badge */}
              {hasImages && (
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-[#111827]/8 border border-[#111827]/15 mt-2">
                  <div className="flex -space-x-1.5 shrink-0">
                    {imageItems.slice(0, 3).map((item, i) => (
                      <img
                        key={i}
                        src={item.previewUrl}
                        alt=""
                        className="w-6 h-6 rounded-md object-cover border border-[#0F172A]/15"
                      />
                    ))}
                    {imageItems.length > 3 && (
                      <div className="w-6 h-6 rounded-md bg-[#111827]/20 border border-[#0F172A]/15 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-[#111827]">+{imageItems.length - 3}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-[#111827]/80 leading-tight">
                    <span className="font-bold">{imageItems.length} image{imageItems.length > 1 ? 's' : ''}</span> will be analyzed by GPT-4o Vision
                  </p>
                </div>
              )}

              {/* Topic input */}
              <div className={`flex gap-2 ${hasImages ? '' : 'mt-2'}`}>
                <input
                  ref={inputRef}
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={hasImages
                    ? 'Optional: add context, mood or message…'
                    : "What's your post about? e.g. summer launch, mindset shift…"
                  }
                  className="flex-1 bg-white border border-border rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder:text-[#64748B]/50 focus:outline-none focus:border-[#111827]/50 focus:ring-1 focus:ring-[#0E9F6E]/20 transition-all"
                />
                <button
                  onClick={handleGenerate}
                  disabled={(!topic.trim() && !hasImages) || loading || !aiAllowed}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111827]/15 text-[#111827] border border-[#111827]/30 text-[10px] font-bold uppercase tracking-wider hover:bg-[#111827]/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
                >
                  <span className={`material-symbols-outlined text-[13px] ${loading ? 'animate-spin' : ''}`}>
                    {loading ? 'progress_activity' : hasResults ? 'refresh' : 'auto_awesome'}
                  </span>
                  {loading ? 'Analyzing…' : hasResults ? 'Regenerate' : 'Generate'}
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-[#DC2626]/8 border border-[#DC2626]/20">
                  <span className="material-symbols-outlined text-[#DC2626] text-[13px] shrink-0 mt-0.5">
                    info
                  </span>
                  <p className="flex-1 text-[10px] text-[#DC2626]/90 leading-relaxed">{error}</p>
                </div>
              )}

              {/* Loading skeletons */}
              {loading && (
                <div className="flex flex-col gap-2">
                  {hasImages && (
                    <p className="text-[10px] text-[#111827]/60 px-1 flex items-center gap-1.5 animate-pulse">
                      <span className="material-symbols-outlined text-[12px]">image_search</span>
                      Reading your images…
                    </p>
                  )}
                  {[1, 2, 3].map(i => <div key={i} className="h-10 rounded-xl bg-[#111827]/5 animate-pulse" />)}
                  <div className="h-6 w-3/4 rounded-full bg-[#111827]/5 animate-pulse mt-1" />
                </div>
              )}

              {/* Results */}
              {!loading && hasResults && (
                <>
                  {/* Caption suggestions */}
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#0F172A] px-1">
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
                              ? 'bg-[#111827]/12 border-[#111827]/40 text-[#0F172A]'
                              : 'text-[#334155] border-transparent hover:bg-[#111827]/8 hover:border-[#111827]/15',
                          ].join(' ')}
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className={[
                                'material-symbols-outlined shrink-0 mt-0.5 transition-all',
                                picked ? 'text-[#111827]' : 'text-[#0F172A]',
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
                    <div className="space-y-2 pt-1 border-t border-[#0F172A]/15">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#0F172A] px-1">
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
                                  ? 'bg-[#111827]/20 border-[#111827]/50 text-[#111827]'
                                  : 'bg-[#111827]/5 border-[#111827]/12 text-[#111827]/60 hover:bg-[#111827]/12 hover:text-[#111827] hover:border-[#111827]/25',
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
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] text-[#64748B] hover:text-[#111827] hover:bg-[#111827]/8 transition-all"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>select_all</span>
                          Select all
                        </button>
                        {pickedHashtags.length > 0 && (
                          <button
                            onClick={() => setPickedHashtags([])}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] text-[#64748B] hover:text-[#DC2626] hover:bg-[#DC2626]/8 transition-all"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>deselect</span>
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Apply button */}
                  <div className="pt-1 border-t border-[#0F172A]/15">
                    <button
                      onClick={handleApply}
                      disabled={!pickedCaption && pickedHashtags.length === 0}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#111827] hover:bg-[#0B1220] text-white text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
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
                <p className="text-[10px] text-[#64748B]/50 px-1 pb-1">
                  {hasImages
                    ? 'Hit Generate — GPT-4o will analyze your images and write 3 captions.'
                    : 'Enter your topic and hit Generate. ChatGPT will write 3 captions + trending hashtags.'
                  }
                </p>
              )}
            </div>

            {/* Separator before textarea */}
            <div className="border-t border-[#0F172A]/15 mx-3" />
          </div>
        </div>

        {/* Textarea — always visible */}
        <div className="px-3 py-3">
          <textarea
            value={caption}
            onChange={e => onCaptionChange(e.target.value)}
            className="w-full h-28 bg-[#F8FAFC] border border-[#0F172A]/15 rounded-xl p-3 text-sm text-[#0F172A] focus:ring-2 focus:ring-[#0E9F6E]/20 focus:border-[#111827] outline-none transition-all placeholder:text-[#94A3B8] resize-none leading-relaxed"
            placeholder="Write your caption…"
          />
        </div>
      </div>

      {/* Character count pills — solo cuando hay caption escrito */}
      <AnimatePresence>
        {selectedChannels.length > 0 && caption.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: 6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <TooltipProvider delayDuration={200}>
              <div className="grid grid-cols-3 gap-2">
                <AnimatePresence mode="popLayout">
                  {[...selectedChannels].sort((a, b) => {
                    if (a === preferred) return -1;
                    if (b === preferred) return 1;
                    return 0;
                  }).map(chId => {
                    const status = getStatus(caption.length, chId);
                    const limit  = CHAR_LIMITS[chId];
                    const ideal  = CHAR_IDEAL[chId];
                    const { color, label: statusLabel } = STATUS_META[status];
                    const pct  = Math.min((caption.length / limit) * 100, 100);
                    const name = CHANNEL_NAMES[chId];

                    return (
                      <Tooltip key={chId}>
                        <TooltipTrigger asChild>
                          <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1    }}
                            exit={{    opacity: 0, scale: 0.92 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            className="min-w-0 rounded-xl border p-3 cursor-default"
                            style={{
                              borderColor:     `${color}25`,
                              backgroundColor: `${color}08`,
                            }}
                          >
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <div
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: color }}
                              />
                              <span className="text-[10px] font-bold text-[#334155] truncate">{name}</span>
                            </div>
                            <div className="h-[5px] rounded-full bg-[#CBD5E1] overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${pct}%`, background: color }}
                              />
                            </div>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="top" showArrow>
                          <div className="space-y-1.5 min-w-[130px]">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[#64748B]">Characters</span>
                              <span className="font-semibold tabular-nums" style={{ color }}>
                                {caption.length}<span className="text-[#0F172A]">/{limit}</span>
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[#64748B]">Status</span>
                              <span className="font-semibold" style={{ color }}>{statusLabel}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[#64748B]">Ideal</span>
                              <span className="text-[#334155]">{ideal.min}–{ideal.softMax}</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </AnimatePresence>
              </div>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
