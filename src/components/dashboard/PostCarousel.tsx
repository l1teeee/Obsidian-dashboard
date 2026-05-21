import type { RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { PLATFORM_REGISTRY } from '../../domain/entities/Platform';
import type { UpcomingPost } from '../../domain/entities/Post';

interface PostCarouselProps {
  upcoming:       UpcomingPost[];
  carouselIdx:    number;
  setCarouselIdx: (i: number) => void;
  scrollCarousel: (dir: 1 | -1) => void;
  pageCount:      number;
  visible:        number;
  maxIdx:         number;
  carouselRef:    RefObject<HTMLDivElement | null>;
  containerRef:   RefObject<HTMLDivElement | null>;
  upcomingRefs:   RefObject<(HTMLDivElement | null)[]>;
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|webm|avi)(\?|#|$)/i.test(url);
}

/** Interpolate between warm gray and teal based on queue fill. */
function scheduleColor(total: number): string {
  const fill = Math.min(total / 10, 1);
  const r = Math.round(73  + (125 - 73)  * fill);
  const g = Math.round(72  + (211 - 72)  * fill);
  const b = Math.round(71  + (199 - 71)  * fill);
  return `rgb(${r},${g},${b})`;
}

function UpcomingCard({
  item,
  total,
  cardRef,
  className = '',
}: {
  item:       UpcomingPost;
  total:      number;
  cardRef?:   (el: HTMLDivElement | null) => void;
  className?: string;
}) {
  const navigate  = useNavigate();
  const p         = PLATFORM_REGISTRY[item.platform];
  const firstUrl  = item.mediaUrls[0] ?? '';
  const hasMedia  = !!firstUrl;
  const isVideo   = hasMedia && isVideoUrl(firstUrl);
  const isMulti   = item.mediaUrls.length > 1;
  const color     = scheduleColor(total);

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/posts/${item.id}`)}
      className={`surface-card p-5 transition-all cursor-pointer hover:border-[#111827]/30 hover:bg-[#F1F5F9] ${className}`}
    >
      {/* Header row — date + platform badge */}
      <div className="flex justify-between items-start mb-3">
        <span className="bg-[#111827]/10 text-[#111827] px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.12em]">
          {item.date}
        </span>
        <div
          className="w-6 h-6 rounded-md font-bold text-xs text-[#0F172A] flex items-center justify-center shrink-0"
          style={{ background: p.color }}
        >
          {p.abbr}
        </div>
      </div>

      {/* Thumbnail — only when media exists */}
      {hasMedia && (
        <div className="relative mb-3 rounded-xl overflow-hidden bg-black" style={{ height: 80 }}>
          {isVideo ? (
            <video
              src={firstUrl}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={firstUrl}
              className="w-full h-full object-cover"
              alt=""
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          )}

          {/* Video badge */}
          {isVideo && (
            <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
              <span className="material-symbols-outlined text-[#0F172A]" style={{ fontSize: 9, fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Video</span>
            </div>
          )}

          {/* Multi-media count */}
          {isMulti && (
            <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
              <span className="text-xs font-bold text-[#0F172A]">+{item.mediaUrls.length - 1}</span>
            </div>
          )}
        </div>
      )}

      {/* Caption */}
      <p className="text-[#334155] text-sm line-clamp-3 italic leading-relaxed">
        {item.caption || 'No caption'}
      </p>

      {/* Bottom bar */}
      <div className="mt-4 h-0.5 w-8 rounded-full" style={{ background: color }} />
    </div>
  );
}

export default function PostCarousel({
  upcoming,
  carouselIdx,
  setCarouselIdx,
  scrollCarousel,
  pageCount,
  visible,
  maxIdx,
  carouselRef,
  containerRef,
  upcomingRefs,
}: PostCarouselProps) {
  return (
    <>
      {/* Mobile: horizontal scroll */}
      <div className="lg:hidden flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {upcoming.map((item, i) => (
          <UpcomingCard
            key={i}
            item={item}
            total={upcoming.length}
            className="snap-start shrink-0 w-[82vw] sm:w-[45vw]"
          />
        ))}
      </div>

      {/* Desktop: paginated carousel */}
      <div ref={containerRef} className="hidden lg:block overflow-hidden">
        <div
          ref={carouselRef}
          className="flex"
          style={{ width: `calc(${pageCount} * 100%)` }}
        >
          {Array.from({ length: pageCount }, (_, pageI) => (
            <div
              key={pageI}
              className="grid grid-cols-3 gap-4"
              style={{ flex: `0 0 ${100 / pageCount}%` }}
            >
              {upcoming.slice(pageI * visible, (pageI + 1) * visible).map((item, i) => (
                <UpcomingCard
                  key={i}
                  item={item}
                  total={upcoming.length}
                  cardRef={el => { upcomingRefs.current[pageI * visible + i] = el; }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="hidden lg:flex justify-center gap-1.5 mt-4">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCarouselIdx(i)}
            aria-label={`Go to upcoming posts page ${i + 1}`}
            className="rounded-full transition-all"
            style={{
              width:      i === carouselIdx ? 20 : 6,
              height:     6,
              background: i === carouselIdx ? '#111827' : 'rgba(73,72,71,0.68)',
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="hidden lg:flex gap-2">
        <button
          onClick={() => scrollCarousel(-1)}
          disabled={carouselIdx === 0}
          aria-label="Previous upcoming posts"
          className="w-8 h-8 rounded-full border border-[#0F172A]/30 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:border-[#111827]/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
        </button>
        <button
          onClick={() => scrollCarousel(1)}
          disabled={carouselIdx >= maxIdx}
          aria-label="Next upcoming posts"
          className="w-8 h-8 rounded-full border border-[#0F172A]/30 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:border-[#111827]/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
        </button>
      </div>
    </>
  );
}

