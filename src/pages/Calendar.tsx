import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import TopBar from '../components/layout/TopBar';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// October 2024: starts on Tuesday (index 2)
const CALENDAR_DAYS = [
  // padding (prev month)
  { day: 29, current: false }, { day: 30, current: false },
  // Oct 1-31
  ...Array.from({ length: 31 }, (_, i) => ({ day: i + 1, current: true })),
  // padding (next month)
  { day: 1, current: false }, { day: 2, current: false },
];

type PlatformColor = string;
const POSTS: Record<number, PlatformColor[]> = {
  1:  ['#1DA1F2', '#E4405F'],
  3:  ['#0077B5'],
  4:  ['#E4405F', '#1DA1F2', '#FF0000'],
  7:  ['#0077B5'],
  9:  ['#FF0000'],
  11: ['#1DA1F2', '#E4405F'],
  15: ['#E4405F'],
  17: ['#0077B5'],
  23: ['#FF0000', '#1DA1F2'],
};

const PLATFORMS_FILTER = [
  { label: 'All', active: true },
  { label: 'X (Twitter)', color: '#1DA1F2', active: false },
  { label: 'Instagram',   color: '#E4405F', active: false },
  { label: 'LinkedIn',    color: '#0077B5', active: false },
  { label: 'YouTube',     color: '#FF0000', active: false },
];

export default function Calendar() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeDay, setActiveDay] = useState<number | null>(23);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-filter-bar]', { y: -12, opacity: 0, duration: 0.45, ease: 'power3.out', delay: 0.1 });

      // Calendar cells stagger by row
      const cells = gsap.utils.toArray<HTMLElement>('[data-cal-cell]');
      cells.forEach((cell, i) => {
        gsap.from(cell, {
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          delay: 0.1 + Math.floor(i / 7) * 0.06 + (i % 7) * 0.015,
          ease: 'power2.out',
        });
      });

      gsap.from('[data-insight-panel]', { x: 20, opacity: 0, duration: 0.5, ease: 'power3.out', delay: 0.5 });
    }, pageRef.current!);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <TopBar title="Content Calendar" actions={
        <div className="flex items-center bg-[#1c1b1b] px-3 py-1.5 rounded-full border border-[#4c4450]/10 gap-2">
          <span className="material-symbols-outlined text-[#d394ff] text-[16px]">event</span>
          <span className="font-mono text-xs text-[#cfc2d2] uppercase">October 2024</span>
        </div>
      } />

      <main className="p-8 min-h-screen bg-[#131313] relative">
        {/* Filter + Controls */}
        <div data-filter-bar className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            {PLATFORMS_FILTER.map((pf) => (
              <button
                key={pf.label}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  pf.active
                    ? 'bg-[#e4b9ff] text-[#2f004d] shadow-[0_0_20px_rgba(228,185,255,0.2)]'
                    : 'bg-[#201f1f] hover:bg-[#2a2a2a] text-[#cfc2d2] font-medium'
                }`}
              >
                {pf.color && <span className="w-2 h-2 rounded-full" style={{ background: pf.color }} />}
                {pf.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-[#201f1f] rounded-xl p-1 border border-[#4c4450]/10">
              {['Month', 'Week', 'List'].map((v, i) => (
                <button
                  key={v}
                  className={`px-4 py-1.5 rounded-lg text-xs font-${i === 0 ? 'bold' : 'medium'} transition-colors ${
                    i === 0 ? 'bg-[#2a2a2a] text-white' : 'text-[#988d9c] hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button className="w-10 h-10 bg-[#d394ff] text-[#5e2388] rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-[#0e0e0e] rounded-3xl overflow-hidden border border-[#494847]/40 shadow-2xl mb-8">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-[#494847]/40">
            {DAYS_OF_WEEK.map(d => (
              <div key={d} className="py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#988d9c]">{d}</div>
            ))}
          </div>
          {/* Grid */}
          <div className="calendar-grid">
            {CALENDAR_DAYS.map(({ day, current }, idx) => {
              const posts = current ? POSTS[day] : undefined;
              const isActive = current && day === activeDay;

              return (
                <div
                  key={idx}
                  data-cal-cell
                  onClick={() => current && setActiveDay(day === activeDay ? null : day)}
                  className={`calendar-day p-3 relative cursor-pointer group ${
                    !current ? 'opacity-25' : ''
                  } ${isActive ? 'ring-1 ring-[#d394ff]/30 bg-[#201f1f]' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-mono text-xs ${isActive ? 'font-bold text-[#d394ff]' : current ? 'text-[#e5e2e1]' : 'text-[#988d9c]'}`}>
                      {String(day).padStart(2, '0')}
                    </span>
                    {current && (
                      <Link to="/composer" onClick={e => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-[#d394ff]">
                        <span className="material-symbols-outlined text-[14px]">add</span>
                      </Link>
                    )}
                  </div>
                  {posts && (
                    <div className="space-y-1">
                      {posts.map((color, i) => (
                        <div key={i} className="h-2 w-full rounded-full" style={{ background: `${color}40`, border: `1px solid ${color}${isActive ? 'ff' : '60'}` }} />
                      ))}
                    </div>
                  )}

                  {/* Popup for active day */}
                  {isActive && posts && (
                    <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-64 glass-panel rounded-2xl p-4 shadow-2xl z-20 border border-[#4c4450]/30 mt-2">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#988d9c]">Scheduled Posts</h4>
                        <span className="text-[10px] font-mono text-[#d394ff] bg-[#d394ff]/10 px-2 py-0.5 rounded">Oct {day}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                          <span className="material-symbols-outlined text-[#FF0000] text-[16px]">play_circle</span>
                          <div>
                            <p className="text-[10px] font-bold text-white">Q4 Strategy Reveal</p>
                            <p className="text-[8px] text-[#988d9c]">10:00 AM • YouTube</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                          <span className="material-symbols-outlined text-[#1DA1F2] text-[16px]">chat</span>
                          <div>
                            <p className="text-[10px] font-bold text-white">Live Q&A Session Thread</p>
                            <p className="text-[8px] text-[#988d9c]">2:30 PM • X</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Insight panel */}
        <div data-insight-panel className="fixed right-8 bottom-8 w-72 space-y-4 z-30">
          <div className="glass-panel p-6 rounded-3xl border border-[#4c4450]/15 shadow-xl">
            <h3 className="font-headline font-bold text-sm mb-4 flex items-center gap-2 text-white">
              <span className="material-symbols-outlined text-[#d394ff]">auto_awesome</span>
              Lens Insight
            </h3>
            <p className="text-xs text-[#cfc2d2] leading-relaxed mb-4">
              Your post frequency is <span className="text-[#f3daff] font-semibold">15% higher</span> this week. Best engagement expected for Thursday's LinkedIn blast.
            </p>
            <div className="flex gap-2 items-center">
              <div className="flex-1 h-1 bg-[#201f1f] rounded-full overflow-hidden">
                <div className="h-full bg-[#d394ff] w-3/4 rounded-full" />
              </div>
              <span className="text-[10px] font-mono text-[#988d9c]">75% Goal</span>
            </div>
          </div>
          <div className="flex gap-4">
            {[['Total Posts', '42', ''], ['Growth', '+12%', 'text-[#c5d247]']].map(([l, v, c]) => (
              <div key={l} className="flex-1 bg-[#201f1f] p-4 rounded-2xl border border-[#4c4450]/10">
                <p className="text-[10px] uppercase tracking-wider text-[#988d9c] mb-1">{l}</p>
                <p className={`font-mono text-xl font-bold text-white ${c}`}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAB */}
        <Link to="/composer" className="fixed bottom-10 right-[320px] w-16 h-16 bg-[#d394ff] text-[#5e2388] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(211,148,255,0.4)] hover:scale-110 active:scale-95 transition-all z-50 group">
          <span className="material-symbols-outlined text-[28px] group-hover:rotate-90 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        </Link>
      </main>
    </div>
  );
}
