import { useState, useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import { generateImage, analyzeImageForPost, editImage } from '../../services/ai.service';
import type { AnalyzeImageResult } from '../../services/ai.service';
import { uploadFile } from '../../services/media.service';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import type { MediaItem } from '../../hooks/useComposer';
import type { ChannelId } from '../../types/composer.types';

const MAX_MEDIA        = 10;
const ANALYZE_MAX_PX   = 1024;  // longest side after resize before sending to API
const ANALYZE_QUALITY  = 0.75;  // JPEG compression quality for analysis payload
const MAX_IMAGE_BYTES  = 20 * 1024 * 1024;  // 20 MB
const MAX_VIDEO_BYTES  = 50 * 1024 * 1024;  // 50 MB

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Convert a base64 data URL returned by the AI backend into a File for S3 upload. */
async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res  = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'image/png' });
}

// ── Platform mapping ─────────────────────────────────────────────────────────
const CHANNEL_TO_PLATFORM: Record<ChannelId, string> = {
  ig: 'meta',
  li: 'linkedin',
  fb: 'meta',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format best-time into a human-readable string (12h format). */
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

/** Resize an image blob to fit within ANALYZE_MAX_PX and return a compressed JPEG data URL. */
async function resizeImageBlob(blob: Blob): Promise<string | null> {
  return new Promise((resolve) => {
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

/**
 * Extract a representative frame from a video blob URL via Canvas.
 * Caps the seek position at 15 seconds so the frame always comes from
 * the opening segment of the video, which keeps payloads small and relevant.
 */
async function extractVideoFrame(videoUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    const video  = document.createElement('video');
    video.preload = 'metadata';
    video.muted   = true;
    video.src     = videoUrl;

    video.addEventListener('loadedmetadata', () => {
      // Seek to at most 15 s (or 30 % of a short clip)
      video.currentTime = Math.min(15, video.duration * 0.3);
    });

    video.addEventListener('seeked', () => {
      try {
        const scale   = Math.min(1, ANALYZE_MAX_PX / Math.max(video.videoWidth || ANALYZE_MAX_PX, video.videoHeight || ANALYZE_MAX_PX));
        const canvas  = document.createElement('canvas');
        canvas.width  = Math.round((video.videoWidth  || ANALYZE_MAX_PX) * scale);
        canvas.height = Math.round((video.videoHeight || 576)            * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', ANALYZE_QUALITY));
      } catch {
        resolve(null);
      }
    });

    video.addEventListener('error', () => resolve(null));
    video.load();
  });
}

/** Convert a MediaItem to a payload-safe string (base64 JPEG or HTTPS URL). */
async function toSendableUrl(item: MediaItem): Promise<string | null> {
  // Videos: extract a resized frame via canvas
  if (item.mediaType === 'video' && item.previewUrl.startsWith('blob:')) {
    return extractVideoFrame(item.previewUrl);
  }

  // Images via blob: — resize + compress to stay well under body limits
  if (item.previewUrl.startsWith('blob:')) {
    try {
      const blob = await fetch(item.previewUrl).then(r => r.blob());
      return await resizeImageBlob(blob);
    } catch {
      return null;
    }
  }

  // Already a usable HTTP URL (DALL-E source or previously uploaded)
  if (item.sourceUrl?.startsWith('http')) return item.sourceUrl;
  if (item.previewUrl.startsWith('http'))  return item.previewUrl;

  // AI-generated images arrive as data: URLs — resize + compress before sending
  const dataUrl = item.sourceUrl?.startsWith('data:image/') ? item.sourceUrl : item.previewUrl;
  if (dataUrl.startsWith('data:image/')) {
    try {
      const res  = await fetch(dataUrl);
      const blob = await res.blob();
      return await resizeImageBlob(blob);
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Converts a blob/object URL to a 1024×1024 PNG (letterboxed on black)
 * and generates a fully-transparent mask of the same size.
 * DALL-E 2 edit requires both files to be square PNGs.
 */
async function prepareForEdit(blobUrl: string): Promise<{ image: string; mask: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const SIZE = 1024;
      const imgC = document.createElement('canvas');
      imgC.width = imgC.height = SIZE;
      const ctx = imgC.getContext('2d')!;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, SIZE, SIZE);
      const scale = Math.min(SIZE / img.naturalWidth, SIZE / img.naturalHeight);
      const w = img.naturalWidth  * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);

      // Fully-transparent mask → DALL-E treats the entire image as editable
      const maskC = document.createElement('canvas');
      maskC.width = maskC.height = SIZE;
      // left empty = all pixels transparent

      resolve({ image: imgC.toDataURL('image/png'), mask: maskC.toDataURL('image/png') });
    };
    img.onerror = reject;
    img.src = blobUrl;
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────

type ImageSize = '1024x1024' | '1792x1024' | '1024x1792';

const SIZE_OPTIONS: { value: ImageSize; label: string; icon: string }[] = [
  { value: '1024x1024', label: 'Square',    icon: 'crop_square'    },
  { value: '1792x1024', label: 'Landscape', icon: 'crop_landscape' },
  { value: '1024x1792', label: 'Portrait',  icon: 'crop_portrait'  },
];

interface MediaUploadProps {
  mediaItems:          MediaItem[];
  selectedChannels:    ChannelId[];
  fileInputRef:        RefObject<HTMLInputElement | null>;
  onRemove:            (index: number) => void;
  onFilesSelected:     (files: File[]) => void;
  onAIImageGenerated:  (blobUrl: string, sourceUrl: string) => void;
  onReplaceMedia:      (index: number, blobUrl: string, sourceUrl: string) => void;
  onAnalysisApplied:   (
    caption:   string,
    hashtags:  string[],
    bestTime?: { hour: number; minute: number; dayOffset: number },
  ) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MediaUpload({
  mediaItems,
  selectedChannels,
  fileInputRef,
  onRemove,
  onFilesSelected,
  onAIImageGenerated,
  onReplaceMedia,
  onAnalysisApplied,
}: MediaUploadProps) {
  const { active: workspace } = useWorkspace();
  const canAddMore = mediaItems.length < MAX_MEDIA;

  // ── Drag & drop state ─────────────────────────────────────────────────────
  const [isDragOver,  setIsDragOver]  = useState(false);
  const [sizeErrors,  setSizeErrors]  = useState<string[]>([]);
  const dragCounterRef                = useRef(0);

  // ── Carousel scroll state ─────────────────────────────────────────────────
  const scrollStripRef                    = useRef<HTMLDivElement>(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollButtons() {
    const el = scrollStripRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  function scrollStrip(dir: 'left' | 'right') {
    const el = scrollStripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -104 : 104, behavior: 'smooth' });
  }

  // Recalculate arrow visibility whenever items change or on next paint
  useEffect(() => {
    // requestAnimationFrame lets the DOM settle before measuring
    const id = requestAnimationFrame(updateScrollButtons);
    return () => cancelAnimationFrame(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaItems.length]);

  // ── Edit image state ─────────────────────────────────────────────────────
  const [editingIndex,  setEditingIndex]  = useState<number | null>(null);
  const [editPrompt,    setEditPrompt]    = useState('');
  const [editLoading,   setEditLoading]   = useState(false);
  const [editError,     setEditError]     = useState<string | null>(null);

  async function handleEditImage() {
    if (editingIndex === null || !editPrompt.trim() || editLoading) return;
    const item = mediaItems[editingIndex];
    if (!item || item.mediaType === 'video') return;

    setEditLoading(true);
    setEditError(null);
    try {
      const { image, mask } = await prepareForEdit(item.previewUrl);
      const result  = await editImage({ imageDataUrl: image, maskDataUrl: mask, instruction: editPrompt.trim() });
      const file    = await dataUrlToFile(result.dataUrl, 'ai-edit.png');
      const upload  = await uploadFile(file);
      onReplaceMedia(editingIndex, result.dataUrl, upload.url);
      setEditingIndex(null);
      setEditPrompt('');
    } catch (err) {
      setEditError((err as Error).message ?? 'Edit failed. Try again.');
    } finally {
      setEditLoading(false);
    }
  }

  // ── DALL-E panel state ────────────────────────────────────────────────────
  const [showAI,        setShowAI]        = useState(false);
  const [prompt,        setPrompt]        = useState('');
  const [size,          setSize]          = useState<ImageSize>('1024x1024');
  const [genLoading,    setGenLoading]    = useState(false);
  const [genError,      setGenError]      = useState<string | null>(null);
  const [revisedPrompt, setRevisedPrompt] = useState<string | null>(null);

  // ── Analysis panel state ──────────────────────────────────────────────────
  type AnalysisScope = 'images' | 'videos' | 'both';
  const [showAnalysis,    setShowAnalysis]    = useState(false);
  const [analysisScope,   setAnalysisScope]   = useState<AnalysisScope | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError,   setAnalysisError]   = useState<string | null>(null);
  const [analysisResult,  setAnalysisResult]  = useState<AnalyzeImageResult | null>(null);
  const [pickedCaption,   setPickedCaption]   = useState<string | null>(null);
  const [pickedHashtags,  setPickedHashtags]  = useState<string[]>([]);
  const [applyTime,       setApplyTime]       = useState(true);

  // ── File size validation + drop processing ────────────────────────────────
  function processFileList(files: File[]) {
    const valid: File[]   = [];
    const errors: string[] = [];
    for (const f of files) {
      const isVideo = f.type.startsWith('video/');
      const limit   = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
      if (f.size > limit) {
        errors.push(`"${f.name}" excede el límite de ${isVideo ? '50 MB' : '20 MB'}`);
      } else {
        valid.push(f);
      }
    }
    if (errors.length) setSizeErrors(errors);
    if (valid.length)  onFilesSelected(valid);
  }

  // ── Drag handlers ────────────────────────────────────────────────────────
  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    dragCounterRef.current++;
    setIsDragOver(true);
  }
  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) setIsDragOver(false);
  }
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(
      f => f.type.startsWith('image/') || f.type.startsWith('video/'),
    );
    if (files.length) processFileList(files);
  }

  // ── DALL-E generate ───────────────────────────────────────────────────────
  async function handleGenerate() {
    const trimmed = prompt.trim();
    if (!trimmed || genLoading || !canAddMore) return;
    setGenLoading(true);
    setGenError(null);
    setRevisedPrompt(null);
    try {
      const result = await generateImage({ prompt: trimmed, size });
      const file   = await dataUrlToFile(result.dataUrl, 'ai-generated.png');
      const upload = await uploadFile(file);
      onAIImageGenerated(result.dataUrl, upload.url);
      setRevisedPrompt(result.revised_prompt);
    } catch (err) {
      setGenError((err as Error).message ?? 'Image generation failed. Try again.');
    } finally {
      setGenLoading(false);
    }
  }

  // ── Image/video analysis ──────────────────────────────────────────────────
  async function runAnalysis(scope: AnalysisScope = analysisScope ?? 'both') {
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
      const resolved = await Promise.all(scopedItems.slice(0, 4).map(toSendableUrl));
      const imageUrls = resolved.filter((u): u is string => u !== null);

      if (imageUrls.length === 0) {
        setAnalysisError('Could not read your media files. Try re-uploading them.');
        return;
      }

      const now       = new Date();
      const platforms = [...new Set(selectedChannels.map(ch => CHANNEL_TO_PLATFORM[ch]))];

      const result = await analyzeImageForPost({
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

  function handleToggleAnalysis() {
    if (!showAnalysis) {
      setShowAnalysis(true);
      const hasBothTypes = hasImages && hasVideos;
      if (!hasBothTypes) {
        // Single media type — auto-select scope and run if no result yet
        const scope: AnalysisScope = hasVideos ? 'videos' : 'images';
        if (!analysisResult && !analysisLoading) runAnalysis(scope);
      }
      // If both types present: show scope selector and wait for user to pick
    } else {
      setShowAnalysis(false);
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
    onAnalysisApplied(pickedCaption ?? '', pickedHashtags, bestTime);
    setShowAnalysis(false);
  }

  const hasMedia   = mediaItems.length > 0;
  const hasImages  = mediaItems.some(i => i.mediaType !== 'video');
  const hasVideos  = mediaItems.some(i => i.mediaType === 'video');
  const hasBothTypes = hasImages && hasVideos;
  const hasResults = !!analysisResult;
  const totalBytes = mediaItems.reduce((sum, i) => sum + (i.fileSize ?? 0), 0);

  return (
    <div
      data-editor-section
      className="space-y-3 relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* ── Drag-over overlay ── */}
      {isDragOver && (
        <div className="absolute inset-0 z-20 rounded-2xl border-2 border-dashed border-[#d394ff] bg-[#131313]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 pointer-events-none">
          <div className="w-16 h-16 rounded-2xl bg-[#d394ff]/15 border border-[#d394ff]/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>cloud_upload</span>
          </div>
          <p className="text-sm font-semibold text-[#d394ff]">Drop to add</p>
          <p className="text-[10px] text-[#d394ff]/60">Images · max 20 MB &nbsp;·&nbsp; Videos · max 50 MB</p>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">Creative Assets</label>
          {hasMedia && (
            <span className="text-[10px] font-bold text-[#d394ff] bg-[#d394ff]/10 px-2 py-0.5 rounded-full">
              {mediaItems.length}/{MAX_MEDIA}
            </span>
          )}
          {totalBytes > 0 && (
            <span className="text-[10px] text-[#988d9c]/70 tabular-nums">
              {formatBytes(totalBytes)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Analyze button — only when media exists */}
          {hasMedia && (
            <button
              onClick={handleToggleAnalysis}
              disabled={analysisLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 disabled:cursor-not-allowed ${
                showAnalysis
                  ? 'bg-[#d394ff]/20 text-[#d394ff] border border-[#d394ff]/30'
                  : 'bg-[#d394ff]/10 text-[#d394ff] hover:bg-[#d394ff]/20'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[13px] ${analysisLoading ? 'animate-spin' : ''}`}
              >
                {analysisLoading ? 'progress_activity' : 'psychology'}
              </span>
              {analysisLoading ? 'Analyzing…' : hasResults ? 'Re-analyze' : 'Analyze'}
            </button>
          )}
          <button
            onClick={() => { if (canAddMore) setShowAI(p => !p); }}
            disabled={!canAddMore}
            title={!canAddMore ? `Max ${MAX_MEDIA} images reached` : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
              showAI
                ? 'bg-[#d394ff]/20 text-[#d394ff] border border-[#d394ff]/30'
                : 'bg-[#d394ff]/10 text-[#d394ff] hover:bg-[#d394ff]/20 disabled:hover:bg-[#d394ff]/10'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">image_search</span>
            Generate
          </button>
        </div>
      </div>

      {/* ── Analysis panel ── */}
      <div className={`grid transition-all duration-300 ease-in-out ${showAnalysis && hasMedia ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="bg-[#1c1b1b] border border-[#d394ff]/20 rounded-2xl p-4 space-y-3 mb-1">

            {/* Panel header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d394ff] text-[16px]">psychology</span>
                <span className="text-[11px] font-bold text-[#d394ff] uppercase tracking-widest">
                  {hasBothTypes ? 'Visual Analysis' : hasVideos ? 'Video Analysis' : 'Image Analysis'}
                </span>
              </div>
              <span className="text-[9px] text-[#988d9c]/60 uppercase tracking-widest">GPT-4o Vision</span>
            </div>

            {/* Scope selector — only when both images and videos are present */}
            {hasBothTypes && (
              <div className="flex items-center gap-1 p-1 bg-[#252424] rounded-xl">
                {([
                  { value: 'images', label: 'Images only', icon: 'image'      },
                  { value: 'videos', label: 'Video frames', icon: 'play_circle' },
                  { value: 'both',   label: 'Both',         icon: 'perm_media' },
                ] as const).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => runAnalysis(opt.value)}
                    disabled={analysisLoading}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 ${
                      analysisScope === opt.value
                        ? 'bg-[#d394ff]/20 text-[#d394ff] border border-[#d394ff]/30'
                        : 'text-[#988d9c] hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* No scope selected yet — prompt to pick */}
            {hasBothTypes && !analysisScope && !analysisLoading && (
              <p className="text-[10px] text-[#988d9c] text-center py-1">
                Select what to analyze above
              </p>
            )}

            {/* Media previews being analyzed — filtered by current scope */}
            {(analysisScope || !hasBothTypes) && (
            <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-[#d394ff]/[0.06] border border-[#d394ff]/12">
              <div className="flex -space-x-1.5 shrink-0">
                {(analysisScope === 'images'
                  ? mediaItems.filter(i => i.mediaType !== 'video')
                  : analysisScope === 'videos'
                    ? mediaItems.filter(i => i.mediaType === 'video')
                    : mediaItems
                ).slice(0, 4).map((item, i) => (
                  <div key={i} className="relative w-7 h-7 rounded-md overflow-hidden border border-[#1c1b1b]">
                    {item.mediaType === 'video' ? (
                      <video src={item.previewUrl} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                    ) : (
                      <img src={item.previewUrl} alt="" className="w-full h-full object-cover" />
                    )}
                    {item.mediaType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="material-symbols-outlined text-white" style={{ fontSize: 10 }}>play_arrow</span>
                      </div>
                    )}
                  </div>
                ))}
                {mediaItems.length > 4 && (
                  <div className="w-7 h-7 rounded-md bg-[#d394ff]/20 border border-[#1c1b1b] flex items-center justify-center">
                    <span className="text-[8px] font-bold text-[#d394ff]">+{mediaItems.length - 4}</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-[#d394ff]/80 leading-tight">
                <span className="font-bold">
                  {Math.min(
                    analysisScope === 'images' ? mediaItems.filter(i => i.mediaType !== 'video').length
                    : analysisScope === 'videos' ? mediaItems.filter(i => i.mediaType === 'video').length
                    : mediaItems.length,
                    4,
                  )}
                </span>{' '}
                {analysisScope === 'videos' ? 'video(s) · frames extracted for analysis' : 'image(s) analyzed by GPT-4o Vision'}
              </p>
            </div>
            )}

            {/* Loading skeleton */}
            {analysisLoading && (
              <div className="space-y-3">
                {/* Status line */}
                <div className="flex items-center gap-2 px-1">
                  <span className="material-symbols-outlined text-[#d394ff] text-[14px] animate-spin">progress_activity</span>
                  <span className="text-[10px] text-[#d394ff]/70 font-medium">
                    {analysisScope === 'videos' ? 'Extracting frame & analyzing…' : 'Analyzing your image…'}
                  </span>
                </div>

                {/* Caption skeletons */}
                <div className="space-y-2">
                  <div className="h-[9px] w-28 rounded bg-[#d394ff]/10 animate-pulse" />
                  {[70, 90, 55].map((w, i) => (
                    <div key={i} className="p-3 rounded-xl border border-[#d394ff]/8 bg-[#d394ff]/[0.04] space-y-1.5">
                      <div className={`h-2.5 rounded-full bg-[#d394ff]/10 animate-pulse`} style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }} />
                      <div className={`h-2.5 rounded-full bg-[#d394ff]/10 animate-pulse`} style={{ width: `${w - 20}%`, animationDelay: `${i * 120 + 60}ms` }} />
                    </div>
                  ))}
                </div>

                {/* Hashtag skeletons */}
                <div className="pt-1 border-t border-[#4c4450]/15 space-y-2">
                  <div className="h-[9px] w-20 rounded bg-[#d394ff]/10 animate-pulse" />
                  <div className="flex flex-wrap gap-1.5">
                    {[40, 55, 48, 62, 38, 50, 44].map((w, i) => (
                      <div key={i} className="h-6 rounded-full bg-[#d394ff]/8 animate-pulse" style={{ width: w, animationDelay: `${i * 80}ms` }} />
                    ))}
                  </div>
                </div>

                {/* Best time skeleton */}
                <div className="flex gap-3 rounded-xl border border-[#d394ff]/10 bg-[#d394ff]/[0.03] p-3">
                  <div className="w-8 h-8 rounded-lg bg-[#d394ff]/10 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2 w-20 rounded bg-[#d394ff]/10 animate-pulse" />
                    <div className="h-4 w-32 rounded bg-[#d394ff]/10 animate-pulse" />
                    <div className="h-2 w-full rounded bg-[#d394ff]/8 animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {!analysisLoading && analysisError && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/8 border border-red-500/15">
                <span className="material-symbols-outlined text-red-400 text-[14px] shrink-0 mt-0.5">error</span>
                <p className="text-[10px] text-red-400 leading-relaxed">{analysisError}</p>
              </div>
            )}

            {/* Results */}
            {!analysisLoading && hasResults && analysisResult && (
              <>
                {/* Caption suggestions */}
                <div className="space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#4c4450] px-1">
                    Captions — select one
                  </p>
                  {analysisResult.captions.map((c, i) => {
                    const picked = pickedCaption === c;
                    return (
                      <button
                        key={i}
                        onClick={() => setPickedCaption(picked ? null : c)}
                        className={[
                          'w-full text-left p-3 rounded-xl transition-all text-xs leading-relaxed border',
                          picked
                            ? 'bg-[#d394ff]/12 border-[#d394ff]/40 text-white'
                            : 'text-[#cfc2d2] border-transparent hover:bg-[#d394ff]/8 hover:border-[#d394ff]/15',
                        ].join(' ')}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={`material-symbols-outlined shrink-0 mt-0.5 transition-all ${picked ? 'text-[#d394ff]' : 'text-[#4c4450]'}`}
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
                {analysisResult.hashtags.length > 0 && (
                  <div className="space-y-2 pt-1 border-t border-[#4c4450]/15">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#4c4450] px-1">
                      Hashtags — click to select
                    </p>
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {analysisResult.hashtags.map((tag, i) => {
                        const picked = pickedHashtags.includes(tag);
                        return (
                          <button
                            key={i}
                            onClick={() => toggleHashtag(tag)}
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
                    <div className="flex gap-2 px-1">
                      <button
                        onClick={() => setPickedHashtags(analysisResult.hashtags)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] text-[#988d9c] hover:text-[#d394ff] hover:bg-[#d394ff]/8 transition-all"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 13 }}>select_all</span>
                        Select all
                      </button>
                      {pickedHashtags.length > 0 && (
                        <button
                          onClick={() => setPickedHashtags([])}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] text-[#988d9c] hover:text-red-400 hover:bg-red-400/8 transition-all"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>deselect</span>
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Best time — with apply checkbox */}
                <button
                  onClick={() => setApplyTime(p => !p)}
                  className={`w-full text-left flex gap-3 rounded-xl border p-3 transition-all ${
                    applyTime
                      ? 'border-[#d394ff]/35 bg-[#d394ff]/[0.08]'
                      : 'border-[#4c4450]/20 bg-[#d394ff]/[0.02] opacity-60'
                  }`}
                >
                  {/* Schedule icon */}
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 transition-colors ${applyTime ? 'bg-[#d394ff]/20' : 'bg-[#4c4450]/20'}`}>
                    <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
                      schedule
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#d394ff]/70 mb-0.5">
                      Best time to post
                    </p>
                    <p className="text-sm font-semibold text-white leading-tight">
                      {formatBestTime(
                        analysisResult.bestTime.hour,
                        analysisResult.bestTime.minute,
                        analysisResult.bestTime.dayOffset,
                      )}
                    </p>
                    <p className="text-[10px] text-[#988d9c] mt-1 leading-relaxed">
                      {analysisResult.bestTime.reason}
                    </p>
                  </div>

                  {/* Checkbox */}
                  <div className={`shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    applyTime
                      ? 'bg-[#d394ff] border-[#d394ff]'
                      : 'bg-transparent border-[#4c4450]/50'
                  }`}>
                    {applyTime && (
                      <span className="material-symbols-outlined text-[#131313]" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1, 'wght' 700" }}>check</span>
                    )}
                  </div>
                </button>

                {/* Apply button */}
                <div className="pt-1 border-t border-[#4c4450]/15">
                  <button
                    onClick={handleApply}
                    disabled={!pickedCaption && pickedHashtags.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#d394ff] hover:bg-[#e0a8ff] text-[#131313] text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
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
                  {hasResults && (
                    <button
                      onClick={() => { setAnalysisResult(null); runAnalysis(analysisScope ?? 'both'); }}
                      className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] text-[#988d9c] hover:text-[#d394ff] hover:bg-[#d394ff]/8 transition-all"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>refresh</span>
                      Re-analyze
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── DALL-E panel ── */}
      <div className={`grid transition-all duration-300 ease-in-out ${showAI ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="bg-[#1c1b1b] border border-[#d394ff]/20 rounded-2xl p-4 space-y-3 mb-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d394ff] text-[16px]">auto_awesome</span>
                <span className="text-[11px] font-bold text-[#d394ff] uppercase tracking-widest">AI Image Generator</span>
              </div>
              <span className="text-[9px] text-[#988d9c]/60 uppercase tracking-widest">DALL·E 3</span>
            </div>

            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="Describe the image you want to generate…"
              className="w-full bg-[#252424] border border-[#4c4450]/30 rounded-xl px-4 py-2.5 text-sm text-[#e5e2e1] placeholder:text-[#988d9c]/50 outline-none focus:border-[#d394ff]/50 transition-colors"
            />

            <div className="flex gap-2">
              {SIZE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSize(opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                    size === opt.value
                      ? 'bg-[#d394ff]/20 text-[#d394ff] border border-[#d394ff]/30'
                      : 'bg-[#252424] text-[#988d9c] border border-[#4c4450]/20 hover:border-[#d394ff]/20 hover:text-[#cfc2d2]'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || genLoading || !canAddMore}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#d394ff] text-[#5e2388] text-xs font-bold uppercase tracking-wider disabled:opacity-40 hover:brightness-110 transition-all active:scale-[0.98]"
            >
              {genLoading ? (
                <>
                  <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                  Generating — this may take a moment…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  {!canAddMore ? `Max ${MAX_MEDIA} images reached` : revisedPrompt ? 'Generate Another' : 'Generate Image'}
                </>
              )}
            </button>

            {genError && <p className="text-[10px] text-red-400">{genError}</p>}
            {revisedPrompt && !genLoading && (
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#4c4450]">DALL·E revised your prompt to:</p>
                <p className="text-[10px] text-[#988d9c] leading-relaxed italic">"{revisedPrompt}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Size errors ── */}
      {sizeErrors.length > 0 && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-[#ffb4ab]/8 border border-[#ffb4ab]/20">
          <span className="material-symbols-outlined text-[#ffb4ab] shrink-0 mt-0.5" style={{ fontSize: 14 }}>error</span>
          <div className="flex-1 min-w-0">
            {sizeErrors.map((err, i) => (
              <p key={i} className="text-[10px] text-[#ffb4ab] leading-relaxed">{err}</p>
            ))}
          </div>
          <button onClick={() => setSizeErrors([])} className="shrink-0 text-[#ffb4ab]/50 hover:text-[#ffb4ab] transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
          </button>
        </div>
      )}

      {/* ── Media carousel ── */}
      {hasMedia ? (
        <div className="flex items-center gap-2">
          {/* Scroll left */}
          <button
            onClick={() => scrollStrip('left')}
            disabled={!canScrollLeft}
            className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg border border-[#4c4450]/30 bg-[#1c1b1b] text-[#988d9c] hover:text-white hover:border-[#4c4450]/60 transition-all disabled:opacity-20 disabled:cursor-default"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          </button>

          {/* Horizontal scrollable strip */}
          <div
            ref={scrollStripRef}
            className="flex-1 min-w-0 overflow-x-auto snap-x snap-mandatory scroll-smooth"
            onScroll={updateScrollButtons}
          >
            <div className="flex gap-2 pb-0.5">
              {mediaItems.map((item, i) => (
                <div key={i} className="relative group w-24 h-24 shrink-0 snap-start rounded-xl overflow-hidden bg-black">
                  {/* Render image or video only after upload completes */}
                  {!item.uploading && !item.uploadError && (
                    item.mediaType === 'video' ? (
                      <video
                        src={item.previewUrl}
                        className="w-full h-full object-contain"
                        muted
                        playsInline
                        preload="auto"
                        onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
                        onMouseLeave={e => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                      />
                    ) : (
                      <img src={item.previewUrl} className="w-full h-full object-contain" alt="" />
                    )
                  )}

                  {/* Video play icon badge */}
                  {item.mediaType === 'video' && !item.uploading && (
                    <div className="absolute bottom-1 left-1 flex items-center gap-1 bg-black/60 rounded-md px-1.5 py-0.5">
                      <span className="material-symbols-outlined text-white" style={{ fontSize: 10, fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                      <span className="text-[7px] font-bold text-white uppercase tracking-wide">Video</span>
                    </div>
                  )}

                  {/* Uploading overlay */}
                  {item.uploading && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-white text-[20px] animate-spin">progress_activity</span>
                      <span className="text-[8px] text-white/80 font-bold uppercase tracking-wider">Uploading…</span>
                    </div>
                  )}

                  {/* Upload error overlay */}
                  {item.uploadError && !item.uploading && (
                    <div className="absolute inset-0 bg-red-900/70 flex flex-col items-center justify-center gap-1 p-1">
                      <span className="material-symbols-outlined text-red-300 text-[18px]">cloud_off</span>
                      <span className="text-[7px] text-red-200 font-bold text-center leading-tight">Upload failed</span>
                    </div>
                  )}

                  {/* AI badge (DALL-E generated) */}
                  {item.isAIGenerated && !item.uploading && !item.uploadError && (
                    <div className="absolute top-1 left-1 bg-[#d394ff]/80 rounded-md px-1 py-0.5">
                      <span className="text-[7px] font-bold text-[#131313] uppercase tracking-wide">AI</span>
                    </div>
                  )}

                  {/* Index badge */}
                  {!item.uploading && (
                    <div className="absolute top-1 right-1 bg-black/50 rounded-full w-4 h-4 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">{i + 1}</span>
                    </div>
                  )}

                  {/* Hover overlay — edit (images only) + delete */}
                  {!item.uploading && (
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {item.mediaType !== 'video' && (
                        <button
                          onClick={e => { e.stopPropagation(); setEditingIndex(i); setEditPrompt(''); setEditError(null); }}
                          title="Edit with AI"
                          className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-[#ffd166]/25 hover:border-[#ffd166]/50 transition-all"
                        >
                          <span className="material-symbols-outlined text-white text-[16px]">edit</span>
                        </button>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); onRemove(i); }}
                        title="Remove"
                        className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-red-500/25 hover:border-red-400/50 transition-all"
                      >
                        <span className="material-symbols-outlined text-white text-[16px]">delete</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scroll right */}
          <button
            onClick={() => scrollStrip('right')}
            disabled={!canScrollRight}
            className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg border border-[#4c4450]/30 bg-[#1c1b1b] text-[#988d9c] hover:text-white hover:border-[#4c4450]/60 transition-all disabled:opacity-20 disabled:cursor-default"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>

          {/* Add more — pinned to the right */}
          {canAddMore && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 shrink-0 rounded-xl border-2 border-dashed border-[#4c4450]/40 bg-[#1c1b1b] flex flex-col items-center justify-center gap-1 hover:border-[#d394ff]/50 hover:bg-[#201f1f] transition-all"
            >
              <span className="material-symbols-outlined text-[#d394ff] text-[20px]">add_photo_alternate</span>
              <span className="text-[9px] text-[#988d9c]">Add more</span>
            </button>
          )}
        </div>
      ) : (
        <div
          className={`min-h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
            isDragOver
              ? 'border-[#d394ff]/70 bg-[#d394ff]/8'
              : 'border-[#4c4450]/40 bg-[#1c1b1b] hover:border-[#d394ff]/50 hover:bg-[#201f1f]'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragOver ? 'bg-[#d394ff]/15 border border-[#d394ff]/30' : 'bg-[#d394ff]/10'}`}>
            <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>cloud_upload</span>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#e5e2e1]">Drop or <span className="text-[#d394ff]">browse</span></p>
            <p className="text-[10px] text-[#988d9c] mt-0.5">Images · max 20 MB &nbsp;·&nbsp; Videos · max 50 MB</p>
            <p className="text-[10px] text-[#988d9c]/50">JPG, PNG, MP4, MOV · up to {MAX_MEDIA} files</p>
          </div>
        </div>
      )}

      {/* ── Edit image panel ── */}
      {editingIndex !== null && mediaItems[editingIndex] && (
        <div className="bg-[#1c1b1b] border border-[#ffd166]/25 rounded-2xl p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffd166] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
              <span className="text-[11px] font-bold text-[#ffd166] uppercase tracking-widest">Edit Image</span>
              <span className="text-[9px] text-[#988d9c]/60 uppercase tracking-widest">DALL·E 2</span>
            </div>
            <button
              onClick={() => { setEditingIndex(null); setEditError(null); }}
              className="text-[#988d9c] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          {/* Preview of the image being edited */}
          <div className="flex items-center gap-3 px-2.5 py-2 rounded-xl bg-[#ffd166]/[0.06] border border-[#ffd166]/12">
            <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-black">
              <img
                src={mediaItems[editingIndex].previewUrl}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[10px] text-[#ffd166]/80 leading-relaxed">
              Only this image will be edited. All other elements will be preserved.
            </p>
          </div>

          {/* Instruction input */}
          <input
            type="text"
            value={editPrompt}
            onChange={e => setEditPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEditImage()}
            placeholder='Describe what to change, e.g. "Make the sky sunset colors"'
            disabled={editLoading}
            className="w-full bg-[#252424] border border-[#4c4450]/30 rounded-xl px-4 py-2.5 text-sm text-[#e5e2e1] placeholder:text-[#988d9c]/50 outline-none focus:border-[#ffd166]/40 transition-colors disabled:opacity-50"
          />

          {editError && (
            <p className="text-[10px] text-red-400 px-1">{editError}</p>
          )}

          {/* Apply button */}
          <button
            onClick={handleEditImage}
            disabled={!editPrompt.trim() || editLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#ffd166] text-[#1a1400] text-xs font-bold uppercase tracking-wider disabled:opacity-40 hover:brightness-110 transition-all active:scale-[0.98] disabled:cursor-not-allowed"
          >
            {editLoading ? (
              <>
                <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                Editing — this may take a moment…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_fix_high</span>
                Apply Edit
              </>
            )}
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={e => {
          const files = Array.from(e.target.files ?? []);
          if (fileInputRef.current) fileInputRef.current.value = '';
          processFileList(files);
        }}
      />
    </div>
  );
}
