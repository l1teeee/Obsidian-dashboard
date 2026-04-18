import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { RefObject } from 'react';
import type { MediaItem } from '../../hooks/useComposer';
import type { ChannelId } from '../../types/composer.types';
import AIGeneratorModal from './AIGeneratorModal';
import AnalyzeModal     from './AnalyzeModal';
import EditImageModal   from './EditImageModal';

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_MEDIA        = 10;
const MAX_IMAGE_BYTES  = 20 * 1024 * 1024;
const MAX_VIDEO_BYTES  = 50 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface MediaUploadProps {
  mediaItems:          MediaItem[];
  selectedChannels:    ChannelId[];
  fileInputRef:        RefObject<HTMLInputElement | null>;
  onRemove:            (index: number) => void;
  onFilesSelected:     (files: File[]) => void;
  onAIImageGenerated:  (blobUrl: string, sourceUrl: string, prompt?: string) => void;
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
  const canAddMore = mediaItems.length < MAX_MEDIA;

  // ── Drag & drop ───────────────────────────────────────────────────────────
  const [isDragOver,  setIsDragOver]  = useState(false);
  const [sizeErrors,  setSizeErrors]  = useState<string[]>([]);
  const dragCounterRef                = useRef(0);

  // ── Thumbnail carousel scroll ─────────────────────────────────────────────
  const scrollStripRef                       = useRef<HTMLDivElement>(null);
  const [canScrollLeft,  setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight]  = useState(false);

  // ── Per-tile loading skeleton ─────────────────────────────────────────────
  const [loadedSet, setLoadedSet] = useState<Set<number>>(new Set());
  const markLoaded = (i: number) =>
    setLoadedSet(prev => { const s = new Set(prev); s.add(i); return s; });

  // ── Video preview modal ───────────────────────────────────────────────────
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isVideoVisible,  setIsVideoVisible]  = useState(false);

  function openVideoPreview(url: string) {
    setVideoPreviewUrl(url);
    requestAnimationFrame(() => requestAnimationFrame(() => setIsVideoVisible(true)));
  }
  function closeVideoPreview() {
    setIsVideoVisible(false);
    setTimeout(() => setVideoPreviewUrl(null), 220);
  }

  // ── Image lightbox ────────────────────────────────────────────────────────
  const [lightboxIndex,   setLightboxIndex]   = useState<number | null>(null);
  const [showPrompt,      setShowPrompt]      = useState(false);
  const [promptCopied,    setPromptCopied]    = useState(false);

  function openLightbox(idx: number) {
    setLightboxIndex(idx);
    setShowPrompt(false);
    setPromptCopied(false);
  }

  function copyPrompt(text: string) {
    navigator.clipboard.writeText(text);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  }

  // ── AI modal state ────────────────────────────────────────────────────────
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [showAnalyzeModal,   setShowAnalyzeModal]   = useState(false);
  const [editingIndex,       setEditingIndex]       = useState<number | null>(null);

  // ── Scroll helpers ────────────────────────────────────────────────────────
  function updateScrollButtons() {
    const el = scrollStripRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  function scrollStrip(dir: 'left' | 'right') {
    scrollStripRef.current?.scrollBy({ left: dir === 'left' ? -104 : 104, behavior: 'smooth' });
  }

  useEffect(() => {
    const id = requestAnimationFrame(updateScrollButtons);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaItems.length]);

  // ── File validation ───────────────────────────────────────────────────────
  function processFileList(files: File[]) {
    const valid: File[]    = [];
    const errors: string[] = [];
    for (const f of files) {
      const isVideo = f.type.startsWith('video/');
      const limit   = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
      if (f.size > limit) {
        errors.push(`"${f.name}" exceeds the ${isVideo ? '50 MB' : '20 MB'} limit`);
      } else {
        valid.push(f);
      }
    }
    if (errors.length) setSizeErrors(errors);
    if (valid.length)  onFilesSelected(valid);
  }

  // ── Drag handlers ─────────────────────────────────────────────────────────
  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    dragCounterRef.current++;
    setIsDragOver(true);
  }
  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    if (--dragCounterRef.current === 0) setIsDragOver(false);
  }
  function handleDragOver(e: React.DragEvent) { e.preventDefault(); }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(
      f => f.type.startsWith('image/') || f.type.startsWith('video/'),
    );
    if (files.length) processFileList(files);
  }

  const hasMedia     = mediaItems.length > 0;
  const totalBytes   = mediaItems.reduce((sum, i) => sum + (i.fileSize ?? 0), 0);

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
            <span className="text-[10px] text-[#988d9c]/70 tabular-nums">{formatBytes(totalBytes)}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Analyze button — only when there is media */}
          {hasMedia && (
            <button
              onClick={() => setShowAnalyzeModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d394ff]/10 text-[#d394ff] hover:bg-[#d394ff]/20 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[13px]">psychology</span>
              Analyze
            </button>
          )}
          {/* Generate button */}
          <button
            onClick={() => { if (canAddMore) setShowGeneratorModal(true); }}
            disabled={!canAddMore}
            title={!canAddMore ? `Max ${MAX_MEDIA} files reached` : undefined}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d394ff]/10 text-[#d394ff] hover:bg-[#d394ff]/20 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
            Generate
          </button>
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
        <div className="flex items-center gap-2 bg-[#161515] border border-[#4c4450]/25 rounded-2xl px-3 py-3">
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
              {mediaItems.map((item, i) => {
                const isLoaded     = loadedSet.has(i);
                const isVideo      = item.mediaType === 'video';
                const showSkeleton = !isLoaded && !item.uploading && !item.uploadError;

                return (
                  <div
                    key={i}
                    className={`relative group w-24 h-24 shrink-0 snap-start rounded-xl overflow-hidden bg-[#1a1a1a] ${!item.uploading && !item.uploadError ? 'cursor-pointer' : ''}`}
                    onClick={!item.uploading && !item.uploadError ? (
                      isVideo ? () => openVideoPreview(item.previewUrl) : () => openLightbox(i)
                    ) : undefined}
                  >
                    {/* Skeleton shimmer */}
                    {showSkeleton && (
                      <div className="absolute inset-0 rounded-xl overflow-hidden">
                        <div className="w-full h-full bg-[#252424] relative overflow-hidden">
                          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                        </div>
                      </div>
                    )}

                    {!item.uploading && !item.uploadError && (
                      isVideo ? (
                        <video
                          src={item.previewUrl}
                          className={`w-full h-full object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                          muted playsInline preload="metadata"
                          onLoadedData={() => markLoaded(i)}
                        />
                      ) : (
                        <img
                          src={item.previewUrl}
                          className={`w-full h-full object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                          alt=""
                          onLoad={() => markLoaded(i)}
                        />
                      )
                    )}

                    {/* Video badge */}
                    {isVideo && !item.uploading && (
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

                    {/* AI badge */}
                    {item.isAIGenerated && !item.uploading && !item.uploadError && (
                      <div className="absolute top-0.5 left-0.5 bg-[#d394ff]/40 rounded px-1 py-px">
                        <span className="text-[7px] font-bold text-white/80 uppercase tracking-wide">AI</span>
                      </div>
                    )}

                    {/* Index badge */}
                    {!item.uploading && (
                      <div className="absolute top-1 right-1 bg-black/50 rounded-full w-4 h-4 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">{i + 1}</span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    {!item.uploading && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                        {isVideo ? (
                          /* Videos: play hint + delete */
                          <>
                            <div />
                            <div className="flex items-center justify-center gap-1">
                              <div className="w-7 h-7 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center pointer-events-none">
                                <span className="material-symbols-outlined text-white" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                              </div>
                              <button
                                onClick={e => { e.stopPropagation(); onRemove(i); }}
                                className="w-7 h-7 rounded-lg bg-red-500/25 border border-red-400/40 flex items-center justify-center hover:bg-red-500/50 transition-all"
                              >
                                <span className="material-symbols-outlined text-red-300" style={{ fontSize: 14 }}>delete</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          /* Images: 3 action buttons */
                          <>
                            <div />
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={e => { e.stopPropagation(); setShowAnalyzeModal(true); }}
                                title="Analyze & generate caption"
                                className="w-7 h-7 rounded-lg bg-[#d394ff]/25 border border-[#d394ff]/40 flex items-center justify-center hover:bg-[#d394ff]/50 transition-all"
                              >
                                <span className="material-symbols-outlined text-white" style={{ fontSize: 13 }}>psychology</span>
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); setEditingIndex(i); }}
                                title="Edit with AI"
                                className="w-7 h-7 rounded-lg bg-[#ffd166]/20 border border-[#ffd166]/40 flex items-center justify-center hover:bg-[#ffd166]/40 transition-all"
                              >
                                <span className="material-symbols-outlined text-[#ffd166]" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>auto_fix_high</span>
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); onRemove(i); }}
                                title="Remove"
                                className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-400/40 flex items-center justify-center hover:bg-red-500/45 transition-all"
                              >
                                <span className="material-symbols-outlined text-red-300" style={{ fontSize: 13 }}>delete</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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

          {/* Add more — pinned right */}
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
        /* ── Empty drop zone ── */
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

      {/* ── Hidden file input ── */}
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

      {/* ── Image lightbox ── */}
      {lightboxIndex !== null && mediaItems[lightboxIndex] && !mediaItems[lightboxIndex].uploading && createPortal(
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative w-full max-w-xl bg-[#1c1b1b] rounded-2xl shadow-2xl flex flex-col my-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>

            {/* Image */}
            <div className="rounded-t-2xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={mediaItems[lightboxIndex].previewUrl}
                alt=""
                className="w-full object-contain"
                style={{ maxHeight: '65vh' }}
              />
            </div>

            {/* Prompt row — AI generated only, collapsible */}
            {mediaItems[lightboxIndex].isAIGenerated && (
              <div className="border-t border-[#4c4450]/20 bg-[#161515]">
                {/* Toggle row */}
                <button
                  onClick={() => setShowPrompt(p => !p)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-[#1c1b1b] transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[#d394ff]/50 text-[13px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <span className="flex-1 text-[10px] text-[#988d9c]/70 font-medium">
                    {mediaItems[lightboxIndex].prompt ? 'AI Prompt' : 'AI-generated image'}
                  </span>
                  {mediaItems[lightboxIndex].prompt && (
                    <span
                      className="material-symbols-outlined text-[#988d9c]/40 text-[15px] transition-transform duration-200"
                      style={{ transform: showPrompt ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >expand_more</span>
                  )}
                </button>

                {/* Expanded prompt */}
                {mediaItems[lightboxIndex].prompt && (
                  <div
                    className="overflow-hidden transition-all duration-200 ease-out"
                    style={{ maxHeight: showPrompt ? '200px' : '0px' }}
                  >
                    <div className="px-4 pb-3 space-y-2">
                      <p className="text-[11px] text-[#988d9c] italic leading-relaxed">
                        "{mediaItems[lightboxIndex].prompt}"
                      </p>
                      <button
                        onClick={() => copyPrompt(mediaItems[lightboxIndex].prompt!)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#252424] border border-[#4c4450]/25 text-[10px] font-semibold text-[#988d9c] hover:text-white hover:border-[#4c4450]/50 transition-all active:scale-[0.97]"
                      >
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: promptCopied ? "'FILL' 1" : "'FILL' 0" }}>
                          {promptCopied ? 'check' : 'content_copy'}
                        </span>
                        {promptCopied ? 'Copied!' : 'Copy prompt'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2 px-4 py-3.5 border-t border-[#4c4450]/20">
              <button
                onClick={() => { setLightboxIndex(null); setShowAnalyzeModal(true); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#d394ff]/12 border border-[#d394ff]/25 text-[#d394ff] text-[11px] font-bold hover:bg-[#d394ff]/22 transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                Analyze
              </button>
              <button
                onClick={() => { const idx = lightboxIndex; setLightboxIndex(null); setEditingIndex(idx); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#ffd166]/10 border border-[#ffd166]/25 text-[#ffd166] text-[11px] font-bold hover:bg-[#ffd166]/20 transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_fix_high</span>
                Edit with AI
              </button>
              <button
                onClick={() => { const idx = lightboxIndex; setLightboxIndex(null); onRemove(idx); }}
                className="flex items-center justify-center p-2.5 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all active:scale-[0.98]"
                title="Remove"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* ── Video preview modal ── */}
      {videoPreviewUrl && createPortal(
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-6 transition-all duration-200 ${isVideoVisible ? 'bg-black/75 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}`}
          onClick={closeVideoPreview}
        >
          <div
            className={`relative w-full max-w-2xl bg-[#1c1b1b] rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 ${isVideoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#4c4450]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d394ff] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                <span className="text-white text-sm font-semibold">Video Preview</span>
              </div>
              <button
                onClick={closeVideoPreview}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[#988d9c] hover:text-white hover:bg-white/10 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <video src={videoPreviewUrl} controls autoPlay className="w-full max-h-[70vh] bg-black" />
          </div>
        </div>,
        document.body,
      )}

      {/* ── AI Modals ── */}
      <AIGeneratorModal
        isOpen={showGeneratorModal}
        onClose={() => setShowGeneratorModal(false)}
        onImageGenerated={onAIImageGenerated}
        availableSlots={MAX_MEDIA - mediaItems.length}
      />

      <AnalyzeModal
        isOpen={showAnalyzeModal}
        onClose={() => setShowAnalyzeModal(false)}
        mediaItems={mediaItems}
        selectedChannels={selectedChannels}
        onApply={onAnalysisApplied}
        onRequestEditMedia={idx => {
          setShowAnalyzeModal(false);
          setEditingIndex(idx);
        }}
      />

      <EditImageModal
        isOpen={editingIndex !== null}
        onClose={() => setEditingIndex(null)}
        item={editingIndex !== null ? mediaItems[editingIndex] ?? null : null}
        onReplaced={(blobUrl, sourceUrl) => {
          if (editingIndex !== null) onReplaceMedia(editingIndex, blobUrl, sourceUrl);
          setEditingIndex(null);
        }}
      />
    </div>
  );
}
