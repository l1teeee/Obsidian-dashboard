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

/** Interpolate between #4c4450 (gray) and #d394ff (purple) based on queue fill 0–10 */
function scheduleColor(total: number): string {
  const fill = Math.min(total / 10, 1);
  const r = Math.round(76  + (211 - 76)  * fill);
  const g = Math.round(68  + (148 - 68)  * fill);
  const b = Math.round(80  + (255 - 80)  * fill);
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
      className={`glass-card rounded-3xl p-5 border border-[#4c4450]/10 hover:border-[#d394ff]/30 transition-all cursor-pointer ${className}`}
    >
      {/* Header row — date + platform badge */}
      <div className="flex justify-between items-start mb-3">
        <span className="bg-[#d394ff]/10 text-[#d394ff] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          {item.date}
        </span>
        <div
          className="w-6 h-6 rounded font-bold text-[8px] text-white flex items-center justify-center shrink-0"
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
              <span className="material-symbols-outlined text-white" style={{ fontSize: 9, fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              <span className="text-[8px] font-bold text-white uppercase tracking-wide">Video</span>
            </div>
          )}

          {/* Multi-media count */}
          {isMulti && (
            <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
              <span className="text-[8px] font-bold text-white">+{item.mediaUrls.length - 1}</span>
            </div>
          )}
        </div>
      )}

      {/* Caption */}
      <p className="text-[#cfc2d2] text-sm line-clamp-3 italic leading-relaxed">
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
            className="snap-start shrink-0 w-[75vw] sm:w-[45vw]"
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
            className="rounded-full transition-all"
            style={{
              width:      i === carouselIdx ? 20 : 6,
              height:     6,
              background: i === carouselIdx ? '#d394ff' : 'rgba(76,68,80,0.6)',
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="hidden lg:flex gap-2">
        <button
          onClick={() => scrollCarousel(-1)}
          disabled={carouselIdx === 0}
          className="w-8 h-8 rounded-full border border-[#4c4450]/30 flex items-center justify-center text-[#988d9c] hover:text-white hover:border-[#d394ff]/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
        </button>
        <button
          onClick={() => scrollCarousel(1)}
          disabled={carouselIdx >= maxIdx}
          className="w-8 h-8 rounded-full border border-[#4c4450]/30 flex items-center justify-center text-[#988d9c] hover:text-white hover:border-[#d394ff]/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
        </button>
      </div>
    </>
  );
}
