import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { analyzeImageForPost } from '../../services/ai.service';
import type { AnalyzeImageResult } from '../../services/ai.service';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useAITokens } from '../../contexts/AITokenContext';
import type { MediaItem } from '../../hooks/useComposer';
import type { ChannelId } from '../../types/composer.types';

// ── Constants ─────────────────────────────────────────────────────────────────

const ANALYZE_MAX_PX  = 1024;
const ANALYZE_QUALITY = 0.75;

const CHANNEL_TO_PLATFORM: Record<ChannelId, string> = {
  ig: 'meta',
  li: 'linkedin',
  fb: 'meta',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBestTime(hour: number, minute: number, dayOffset: number): string {
  const ampm    = hour < 12 ? 'AM' : 'PM';
  const h12     = hour % 12 || 12;
  const minStr  = minute > 0 ? `:${String(minute).padStart(2, '0')}` : '';
  const timeStr = `${h12}${minStr} ${ampm}`;
  if (dayOffset === 0) return `Today at ${timeStr}`;
  if (dayOffset === 1) return `Tomorrow at ${timeStr}`;
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return `${d.toLocaleDateString('en-US', { weekday: 'long' })} at ${timeStr}`;
}

async function resizeImageBlob(blob: Blob): Promise<string | null> {
  return new Promise(resolve => {
    const img    = new Image();
    const tmpUrl = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(tmpUrl);
      const scale   = Math.min(1, ANALYZE_MAX_PX / Math.max(img.naturalWidth, img.naturalHeight, 1));
      const canvas  = document.createElement('canvas');
      canvas.width  = Math.round(img.naturalWidth  * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', ANALYZE_QUALITY));
    };
    img.onerror = () => { URL.revokeObjectURL(tmpUrl); resolve(null); };
    img.src = tmpUrl;
  });
}

async function extractVideoFrame(videoUrl: string): Promise<string | null> {
  return new Promise(resolve => {
    const video   = document.createElement('video');
    video.preload = 'metadata';
    video.muted   = true;
    video.src     = videoUrl;
    video.addEventListener('loadedmetadata', () => { video.currentTime = Math.min(15, video.duration * 0.3); });
    video.addEventListener('seeked', () => {
      try {
        const scale   = Math.min(1, ANALYZE_MAX_PX / Math.max(video.videoWidth || ANALYZE_MAX_PX, video.videoHeight || ANALYZE_MAX_PX));
        const canvas  = document.createElement('canvas');
        canvas.width  = Math.round((video.videoWidth  || ANALYZE_MAX_PX) * scale);
        canvas.height = Math.round((video.videoHeight || 576) * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', ANALYZE_QUALITY));
      } catch { resolve(null); }
    });
    video.addEventListener('error', () => resolve(null));
    video.load();
  });
}

async function toSendableUrl(item: MediaItem): Promise<string | null> {
  if (item.mediaType === 'video' && item.previewUrl.startsWith('blob:')) return extractVideoFrame(item.previewUrl);
  if (item.previewUrl.startsWith('blob:')) {
    try { const blob = await fetch(item.previewUrl).then(r => r.blob()); return await resizeImageBlob(blob); }
    catch { return null; }
  }
  if (item.sourceUrl?.startsWith('http')) return item.sourceUrl;
  if (item.previewUrl.startsWith('http'))  return item.previewUrl;
  const dataUrl = item.sourceUrl?.startsWith('data:image/') ? item.sourceUrl : item.previewUrl;
  if (dataUrl.startsWith('data:image/')) {
    try { const blob = await (await fetch(dataUrl)).blob(); return await resizeImageBlob(blob); }
    catch { return null; }
  }
  return null;
}

// ── Types ─────────────────────────────────────────────────────────────────────

type AnalysisScope = 'images' | 'videos' | 'both';

interface AnalyzeModalProps {
  isOpen:              boolean;
  onClose:             () => void;
  mediaItems:          MediaItem[];
  selectedChannels:    ChannelId[];
  onApply: (
    caption:   string,
    hashtags:  string[],
    bestTime?: { hour: number; minute: number; dayOffset: number },
  ) => void;
  onRequestEditMedia?: (itemIndex: number) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AnalyzeModal({
  isOpen,
  onClose,
  mediaItems,
  selectedChannels,
  onApply,
  onRequestEditMedia,
}: AnalyzeModalProps) {
  const { active: workspace } = useWorkspace();
  const { allowed: aiAllowed } = useAITokens();

  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
    } else {
      setIsVisible(false);
      const t = setTimeout(() => setIsMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const hasImages    = mediaItems.some(i => i.mediaType !== 'video');
  const hasVideos    = mediaItems.some(i => i.mediaType === 'video');
  const hasBothTypes = hasImages && hasVideos;

  const [analysisScope,   setAnalysisScope]   = useState<AnalysisScope | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError,   setAnalysisError]   = useState<string | null>(null);
  const [analysisResult,  setAnalysisResult]  = useState<AnalyzeImageResult | null>(null);
  const [pickedCaption,   setPickedCaption]   = useState<string | null>(null);
  const [pickedHashtags,  setPickedHashtags]  = useState<string[]>([]);
  const [applyTime,       setApplyTime]       = useState(true);

  // Auto-run on first open for single media type
  useEffect(() => {
    if (isOpen && !hasBothTypes && !analysisResult && !analysisLoading && aiAllowed) {
      runAnalysis(hasVideos ? 'videos' : 'images');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function runAnalysis(scope: AnalysisScope) {
    const scopedItems = scope === 'images'
      ? mediaItems.filter(i => i.mediaType !== 'video')
      : scope === 'videos'
        ? mediaItems.filter(i => i.mediaType === 'video')
        : mediaItems;

    if (scopedItems.length === 0 || analysisLoading) return;

    setAnalysisScope(scope);
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    setPickedCaption(null);
    setPickedHashtags([]);

    try {
      const resolved  = await Promise.all(scopedItems.slice(0, 4).map(toSendableUrl));
      const imageUrls = resolved.filter((u): u is string => u !== null);

      if (imageUrls.length === 0) {
        setAnalysisError('Could not read your media files. Try re-uploading them.');
        return;
      }

      const now       = new Date();
      const platforms = [...new Set(selectedChannels.map(ch => CHANNEL_TO_PLATFORM[ch]))];
      const result    = await analyzeImageForPost({
        imageUrls,
        platforms,
        workspaceId: workspace?.id,
        currentHour: now.getHours(),
        weekday:     now.toLocaleDateString('en-US', { weekday: 'long' }),
      });
      setAnalysisResult(result);
    } catch (err) {
      setAnalysisError((err as Error).message ?? 'Analysis failed. Try again.');
    } finally {
      setAnalysisLoading(false);
    }
  }

  function toggleHashtag(tag: string) {
    setPickedHashtags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  function handleApply() {
    if (!pickedCaption && pickedHashtags.length === 0) return;
    const bestTime = applyTime && analysisResult
      ? { hour: analysisResult.bestTime.hour, minute: analysisResult.bestTime.minute, dayOffset: analysisResult.bestTime.dayOffset }
      : undefined;
    onApply(pickedCaption ?? '', pickedHashtags, bestTime);
    onClose();
  }

  const hasResults  = !!analysisResult;
  const scopedItems = analysisScope === 'images'
    ? mediaItems.filter(i => i.mediaType !== 'video')
    : analysisScope === 'videos'
      ? mediaItems.filter(i => i.mediaType === 'video')
      : mediaItems;

  const images = mediaItems.filter(i => i.mediaType !== 'video');

  if (!isMounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 transition-all duration-200 ${
        isVisible ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full sm:max-w-lg bg-[#FBF8F2] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] transition-all duration-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-2.5 pb-0 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#15140F]/40" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#15140F]/25 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C8553A]/15 border border-[#C8553A]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 18 }}>search</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#15140F] leading-none mb-0.5">Visual Analysis</h2>
              <p className="text-[10px] text-[#6B655B]">GPT-4o Vision</p>
            </div>
          </div>
          <button onClick={onClose} disabled={analysisLoading} className="w-8 h-8 flex items-center justify-center rounded-xl text-[#6B655B] hover:text-[#15140F] hover:bg-white/8 transition-all disabled:opacity-30">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">

          {/* Token limit banner */}
          {!aiAllowed && (
            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-[#B7841E]/8 border border-[#B7841E]/20">
              <span className="material-symbols-outlined text-[#B7841E] shrink-0 mt-0.5" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>warning</span>
              <p className="text-[10px] text-[#B7841E]/90 leading-relaxed">
                Monthly AI token limit reached. Upgrade your plan to analyze media with AI.
              </p>
            </div>
          )}

          {/* ── Media being analyzed — with edit buttons ── */}
          {images.length > 0 && onRequestEditMedia && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B655B]/70">Media in this post</p>
              <div className="flex gap-2 flex-wrap">
                {images.map((item, i) => (
                  <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden bg-[#EFE9DC] border border-[#15140F]/15">
                    <img src={item.previewUrl} alt="" className="w-full h-full object-cover" />
                    {item.isAIGenerated && (
                      <div className="absolute bottom-0.5 left-0.5 w-[13px] h-[13px] rounded bg-[#C8553A]/90 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white" style={{ fontSize: 8, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                      </div>
                    )}
                    {/* Hover: edit button */}
                    <div className="absolute inset-0 bg-[#15140F]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => { onRequestEditMedia(mediaItems.indexOf(item)); }}
                        title="Edit with AI"
                        className="w-8 h-8 rounded-lg bg-[#B7841E]/20 border border-[#B7841E]/40 flex items-center justify-center hover:bg-[#B7841E]/40 transition-all"
                      >
                        <span className="material-symbols-outlined text-[#B7841E]" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>edit</span>
                      </button>
                    </div>
                  </div>
                ))}
                {images.length > 0 && (
                  <div className="flex items-center">
                    <p className="text-[10px] text-[#6B655B]/50 leading-snug">
                      Hover an image<br />to edit with AI
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Scope selector ── */}
          {hasBothTypes && (
            <div className="flex items-center gap-1 p-1 bg-[#EFE9DC] rounded-xl">
              {([
                { value: 'images', label: 'Images',       icon: 'image'       },
                { value: 'videos', label: 'Video frames', icon: 'play_circle' },
                { value: 'both',   label: 'Both',         icon: 'perm_media'  },
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => runAnalysis(opt.value)}
                  disabled={analysisLoading || !aiAllowed}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 ${
                    analysisScope === opt.value
                      ? 'bg-[#C8553A]/20 text-[#C8553A] border border-[#C8553A]/30'
                      : 'text-[#6B655B] hover:text-[#15140F]'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* ── Media thumbnails being analyzed ── */}
          {(analysisScope || !hasBothTypes) && scopedItems.length > 0 && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#C8553A]/[0.06] border border-[#C8553A]/12">
              <div className="flex -space-x-1.5 shrink-0">
                {scopedItems.slice(0, 4).map((item, i) => (
                  <div key={i} className="relative w-8 h-8 rounded-lg overflow-hidden border-2 border-[#15140F]/18">
                    {item.mediaType === 'video'
                      ? <video src={item.previewUrl} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                      : <img src={item.previewUrl} alt="" className="w-full h-full object-cover" />
                    }
                    {item.mediaType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#15140F]/45">
                        <span className="material-symbols-outlined text-white" style={{ fontSize: 10 }}>play_arrow</span>
                      </div>
                    )}
                  </div>
                ))}
                {scopedItems.length > 4 && (
                  <div className="w-8 h-8 rounded-lg bg-[#C8553A]/20 border-2 border-[#15140F]/18 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-[#C8553A]">+{scopedItems.length - 4}</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-[#C8553A]/80 leading-tight">
                <span className="font-bold">{Math.min(scopedItems.length, 4)}</span>{' '}
                {analysisScope === 'videos' ? 'video frame(s) sent to GPT-4o Vision' : 'image(s) analyzed by GPT-4o Vision'}
              </p>
            </div>
          )}

          {/* ── Select scope prompt ── */}
          {hasBothTypes && !analysisScope && !analysisLoading && (
            <div className="flex flex-col items-center gap-2 py-8">
              <span className="material-symbols-outlined text-[#6B655B]/25 text-[36px]">perm_media</span>
              <p className="text-sm text-[#6B655B]/60">Choose what to analyze above</p>
            </div>
          )}

          {/* ── Loading skeleton ── */}
          {analysisLoading && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className="material-symbols-outlined text-[#C8553A] text-[14px] animate-spin">progress_activity</span>
                <span className="text-[10px] text-[#C8553A]/70 font-medium">
                  {analysisScope === 'videos' ? 'Extracting frames & analyzing…' : 'Analyzing your media…'}
                </span>
              </div>
              <div className="space-y-2">
                {[75, 90, 60].map((w, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-[#C8553A]/8 bg-[#C8553A]/[0.04] space-y-2">
                    <div className="h-2.5 rounded-full bg-[#C8553A]/10 animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 100}ms` }} />
                    <div className="h-2.5 rounded-full bg-[#C8553A]/10 animate-pulse" style={{ width: `${w - 22}%`, animationDelay: `${i * 100 + 50}ms` }} />
                    <div className="h-2.5 rounded-full bg-[#C8553A]/10 animate-pulse" style={{ width: `${w - 10}%`, animationDelay: `${i * 100 + 100}ms` }} />
                  </div>
                ))}
              </div>
              <div className="pt-1 border-t border-[#15140F]/15 flex flex-wrap gap-1.5">
                {[40, 55, 48, 62, 38, 50, 44].map((w, i) => (
                  <div key={i} className="h-7 rounded-full bg-[#C8553A]/8 animate-pulse" style={{ width: w, animationDelay: `${i * 70}ms` }} />
                ))}
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {!analysisLoading && analysisError && (
            <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-[#A8362A]/8 border border-[#A8362A]/15">
              <span className="material-symbols-outlined text-[#A8362A] text-[15px] shrink-0 mt-0.5">error</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#A8362A] leading-relaxed">{analysisError}</p>
                <button onClick={() => runAnalysis(analysisScope ?? (hasVideos ? 'videos' : 'images'))} className="mt-1.5 text-[10px] text-[#A8362A]/60 hover:text-[#A8362A] underline transition-colors">
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* ── Results ── */}
          {!analysisLoading && hasResults && analysisResult && (
            <>
              {/* Captions */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B655B]/70 px-0.5">Captions — pick one</p>
                {analysisResult.captions.map((c, i) => {
                  const picked = pickedCaption === c;
                  return (
                    <button
                      key={i}
                      onClick={() => setPickedCaption(picked ? null : c)}
                      className={[
                        'w-full text-left p-3.5 rounded-xl transition-all text-sm leading-relaxed border',
                        picked ? 'bg-[#C8553A]/12 border-[#C8553A]/40 text-[#15140F]' : 'text-[#3D3A30] border-transparent bg-[#EFE9DC] hover:bg-[#C8553A]/8 hover:border-[#C8553A]/15',
                      ].join(' ')}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`material-symbols-outlined shrink-0 mt-0.5 transition-all ${picked ? 'text-[#C8553A]' : 'text-[#15140F]'}`}
                          style={{ fontSize: 15, fontVariationSettings: picked ? "'FILL' 1" : "'FILL' 0" }}>
                          {picked ? 'radio_button_checked' : 'radio_button_unchecked'}
                        </span>
                        <span>{c}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Hashtags */}
              {analysisResult.hashtags.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-[#15140F]/15">
                  <div className="flex items-center justify-between px-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B655B]/70">Hashtags</p>
                    <div className="flex gap-0.5">
                      <button onClick={() => setPickedHashtags(analysisResult.hashtags)} className="text-[9px] text-[#6B655B] hover:text-[#C8553A] transition-colors px-2 py-1 rounded-lg hover:bg-[#C8553A]/8">Select all</button>
                      {pickedHashtags.length > 0 && <button onClick={() => setPickedHashtags([])} className="text-[9px] text-[#6B655B] hover:text-[#A8362A] transition-colors px-2 py-1 rounded-lg hover:bg-[#A8362A]/8">Clear</button>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.hashtags.map((tag, i) => {
                      const picked = pickedHashtags.includes(tag);
                      return (
                        <button key={i} onClick={() => toggleHashtag(tag)}
                          className={[
                            'flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-[10px] font-medium transition-all active:scale-95',
                            picked
                              ? 'bg-[#C8553A]/20 border-[#C8553A]/50 text-[#C8553A]'
                              : 'bg-[#C8553A]/5 border-[#C8553A]/12 text-[#C8553A]/60 hover:bg-[#C8553A]/12 hover:text-[#C8553A] hover:border-[#C8553A]/25',
                          ].join(' ')}
                        >
                          {picked && <span className="material-symbols-outlined" style={{ fontSize: 10, fontVariationSettings: "'FILL' 1" }}>check</span>}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Best time */}
              <div className="pt-2 border-t border-[#15140F]/15">
                <button
                  onClick={() => setApplyTime(p => !p)}
                  className={`w-full text-left flex gap-3 rounded-xl border p-3.5 transition-all ${applyTime ? 'border-[#C8553A]/30 bg-[#C8553A]/[0.07]' : 'border-[#15140F]/20 bg-transparent opacity-55'}`}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 transition-colors ${applyTime ? 'bg-[#C8553A]/20' : 'bg-[#15140F]/20'}`}>
                    <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>schedule</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#C8553A]/70 mb-0.5">Best time to post</p>
                    <p className="text-sm font-semibold text-[#15140F] leading-tight">
                      {formatBestTime(analysisResult.bestTime.hour, analysisResult.bestTime.minute, analysisResult.bestTime.dayOffset)}
                    </p>
                    <p className="text-[10px] text-[#6B655B] mt-1 leading-relaxed">{analysisResult.bestTime.reason}</p>
                  </div>
                  <div className={`shrink-0 mt-1 w-4 h-4 rounded border flex items-center justify-center transition-all ${applyTime ? 'bg-[#C8553A] border-[#C8553A]' : 'bg-transparent border-[#15140F]/50'}`}>
                    {applyTime && <span className="material-symbols-outlined text-white" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1, 'wght' 700" }}>check</span>}
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        {hasResults && !analysisLoading && (
          <div className="px-5 py-4 border-t border-[#15140F]/25 shrink-0 space-y-2">
            <button
              onClick={handleApply}
              disabled={!pickedCaption && pickedHashtags.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C8553A] hover:bg-[#A53F28] text-white text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Apply to composer
              {(pickedCaption || pickedHashtags.length > 0) && (
                <span className="text-[9px] font-normal opacity-70">
                  ({[
                    pickedCaption ? '1 caption' : '',
                    pickedHashtags.length ? `${pickedHashtags.length} tag${pickedHashtags.length > 1 ? 's' : ''}` : '',
                    applyTime ? 'schedule' : '',
                  ].filter(Boolean).join(' + ')})
                </span>
              )}
            </button>
            <button
              onClick={() => runAnalysis(analysisScope ?? (hasVideos ? 'videos' : 'images'))}
              disabled={!aiAllowed}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] text-[#6B655B] hover:text-[#C8553A] hover:bg-[#C8553A]/8 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>refresh</span>
              Re-analyze
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
