import { useState } from 'react';
import { PLATFORM_REGISTRY } from '../../domain/entities/Platform';
import type { PlatformId } from '../../domain/entities/Platform';

interface PostPreviewCardProps {
  platform:   PlatformId;
  caption:    string | null;
  mediaUrls:  string[] | null;
  date:       string;
  status:     string;
  permalink?: string | null;
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|webm|avi)(\?|#|$)/i.test(url);
}

export default function PostPreviewCard({ platform, caption, mediaUrls, date, status, permalink }: PostPreviewCardProps) {
  const p        = PLATFORM_REGISTRY[platform] ?? PLATFORM_REGISTRY.instagram;
  const urls     = mediaUrls?.filter(Boolean) ?? [];
  const hasMedia = urls.length > 0;
  const isMulti  = urls.length > 1;

  const [current, setCurrent] = useState(0);

  const currentUrl  = urls[current] ?? '';
  const currentIsVideo = isVideoUrl(currentUrl);
  const hasAnyVideo = urls.some(isVideoUrl);

  function prev() { setCurrent(i => (i - 1 + urls.length) % urls.length); }
  function next() { setCurrent(i => (i + 1) % urls.length); }

  return (
    <div className="rounded-3xl overflow-hidden border border-[#4c4450]/15 bg-[#161515] shadow-[0_0_60px_rgba(0,0,0,0.5)]">

      {/* ── Media area ── */}
      {hasMedia ? (
        <div className="relative bg-black" style={{ aspectRatio: currentIsVideo ? '16/9' : '4/5' }}>

          {/* Current media */}
          {currentIsVideo ? (
            <video
              key={currentUrl}
              src={currentUrl}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              key={currentUrl}
              src={currentUrl}
              className="w-full h-full object-cover"
              alt="Post media"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          )}

          {/* Video type badge */}
          {currentIsVideo && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
              <span className="material-symbols-outlined text-white" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>play_circle</span>
              <span className="text-[10px] font-bold text-white uppercase tracking-wide">Video</span>
            </div>
          )}

          {/* Carousel navigation */}
          {isMulti && (
            <>
              {/* Prev */}
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              {/* Next */}
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>

              {/* Counter badge */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-white/10">
                {current + 1} / {urls.length}
              </div>

              {/* Dot indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {urls.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`rounded-full transition-all ${
                      i === current
                        ? 'w-4 h-1.5 bg-white'
                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        /* Text-only visual */
        <div
          className="relative aspect-[4/5] w-full flex items-center justify-center p-8"
          style={{ background: `linear-gradient(135deg, ${p.color}18 0%, #0e0e0e 100%)` }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{ background: `radial-gradient(circle at 30% 40%, ${p.color}, transparent 60%)` }}
          />
          <p className="relative text-[#cfc2d2] text-base leading-relaxed text-center line-clamp-[12] font-medium">
            {caption ?? <span className="text-[#988d9c] italic">No caption</span>}
          </p>
        </div>
      )}

      {/* ── Thumbnail strip for multi-media ── */}
      {isMulti && (
        <div className="flex gap-1.5 px-4 pt-3 overflow-x-auto scrollbar-hide">
          {urls.map((url, i) => {
            const isVid = isVideoUrl(url);
            return (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === current ? 'border-[#d394ff]' : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                {isVid ? (
                  <video src={url} className="w-full h-full object-cover" muted preload="metadata" />
                ) : (
                  <img src={url} className="w-full h-full object-cover" alt="" />
                )}
                {isVid && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="material-symbols-outlined text-white" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="px-5 py-4 space-y-3">

        {/* Platform + date + link */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
              style={{ color: p.color, background: p.color + '1a' }}
            >
              {p.name}
            </span>
            {hasAnyVideo && (
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md text-[#988d9c] bg-[#252424]">
                {urls.every(isVideoUrl) ? 'Video' : 'Mixed'}
              </span>
            )}
            <span className="text-[10px] text-[#988d9c] truncate">{date}</span>
          </div>
          {permalink && status === 'published' && (
            <a
              href={permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-[#d394ff] hover:text-[#e8c4ff] transition-colors"
            >
              <span className="material-symbols-outlined text-[12px]">open_in_new</span>
              View post
            </a>
          )}
        </div>

        {/* Caption */}
        {hasMedia && (
          <p className={`text-sm leading-relaxed line-clamp-4 ${caption ? 'text-[#cfc2d2]' : 'text-[#988d9c] italic'}`}>
            {caption ?? 'No caption'}
          </p>
        )}
      </div>
    </div>
  );
}
