import type { RefObject } from 'react';
import { PLATFORM_REGISTRY } from '../../domain/entities/Platform';
import type { UpcomingPost } from '../../domain/entities/Post';

interface PostCarouselProps {
  upcoming:      UpcomingPost[];
  carouselIdx:   number;
  setCarouselIdx: (i: number) => void;
  scrollCarousel: (dir: 1 | -1) => void;
  pageCount:     number;
  visible:       number;
  maxIdx:        number;
  carouselRef:   RefObject<HTMLDivElement | null>;
  containerRef:  RefObject<HTMLDivElement | null>;
  upcomingRefs:  RefObject<(HTMLDivElement | null)[]>;
}

/** Interpolate between #4c4450 (gray) and #d394ff (purple) based on fill 0–1 */
function scheduleColor(total: number): string {
  const MAX  = 10;
  const fill = Math.min(total / MAX, 1);
  // gray: rgb(76, 68, 80)  purple: rgb(211, 148, 255)
  const r = Math.round(76  + (211 - 76)  * fill);
  const g = Math.round(68  + (148 - 68)  * fill);
  const b = Math.round(80  + (255 - 80)  * fill);
  return `rgb(${r},${g},${b})`;
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
      {/* Mobile: scrollable row of cards */}
      <div className="lg:hidden flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {upcoming.map((item, i) => {
          const p = PLATFORM_REGISTRY[item.platform];
          return (
            <div
              key={i}
              className="glass-card rounded-3xl p-5 border border-[#4c4450]/10 cursor-pointer snap-start shrink-0 w-[75vw] sm:w-[45vw]"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="bg-[#d394ff]/10 text-[#d394ff] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {item.date}
                </span>
                <div className="w-6 h-6 rounded font-bold text-[8px] text-white flex items-center justify-center shrink-0"
                  style={{ background: p.color }}>
                  {p.abbr}
                </div>
              </div>
              <p className="text-[#cfc2d2] text-sm line-clamp-3 italic leading-relaxed">{item.caption || 'No caption'}</p>
              <div className="mt-4 h-0.5 w-8 rounded-full" style={{ background: scheduleColor(upcoming.length) }} />
            </div>
          );
        })}
      </div>

      {/* Desktop: paginated carousel — 3 cards per page */}
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
              {upcoming.slice(pageI * visible, (pageI + 1) * visible).map((item, i) => {
                const p = PLATFORM_REGISTRY[item.platform];
                return (
                  <div
                    key={i}
                    ref={el => { upcomingRefs.current[pageI * visible + i] = el; }}
                    className="glass-card rounded-3xl p-5 border border-[#4c4450]/10 hover:border-[#d394ff]/30 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-[#d394ff]/10 text-[#d394ff] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {item.date}
                      </span>
                      <div className="w-6 h-6 rounded font-bold text-[8px] text-white flex items-center justify-center shrink-0"
                        style={{ background: p.color }}>
                        {p.abbr}
                      </div>
                    </div>
                    <p className="text-[#cfc2d2] text-sm line-clamp-3 italic leading-relaxed">{item.caption || 'No caption'}</p>
                    <div className="mt-4 h-0.5 w-8 rounded-full" style={{ background: scheduleColor(upcoming.length) }} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Dots — desktop only */}
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

      {/* Carousel controls for header — passed as fragment, rendered in page */}
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
