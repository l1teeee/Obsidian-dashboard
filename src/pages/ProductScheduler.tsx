import { useEffect, useRef, useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductShell from '../components/landing/ProductShell';

gsap.registerPlugin(ScrollTrigger);

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const POSTS: Record<number, { platform: string; color: string; time: string; label: string }[]> = {
  0: [{ platform: 'ig', color: '#E4405F', time: '10:00', label: 'Product launch reel' }],
  1: [{ platform: 'li', color: '#0a66c2', time: '09:00', label: 'Industry insights' }, { platform: 'fb', color: '#1877f2', time: '18:00', label: 'Weekend promo' }],
  3: [{ platform: 'ig', color: '#E4405F', time: '12:00', label: 'Behind the scenes' }],
  4: [{ platform: 'li', color: '#0a66c2', time: '08:30', label: 'Team spotlight' }],
  6: [{ platform: 'ig', color: '#E4405F', time: '11:00', label: 'Sunday recap' }, { platform: 'fb', color: '#1877f2', time: '15:00', label: 'Community post' }],
};

const PLATFORM_ICON: Record<string, string> = { ig: 'camera_alt', li: 'work', fb: 'thumb_up' };

const FEATURES = [
  { icon: 'drag_pan',         title: 'Drag & drop calendar',     body: 'Rearrange posts by dragging them to any slot. The queue updates instantly across all platforms.' },
  { icon: 'schedule',         title: 'Best-time AI engine',       body: 'Our AI analyzes your audience activity and suggests the exact time that maximizes reach.' },
  { icon: 'stack_group',      title: 'Bulk scheduling',           body: 'Upload a CSV or paste a content list and schedule a full month in one session.' },
  { icon: 'public',           title: 'Timezone-aware',            body: 'Schedule once, publish in your audience\'s local timezone automatically.' },
  { icon: 'repeat',           title: 'Recurring content',         body: 'Set evergreen posts to repeat weekly or monthly without lifting a finger.' },
  { icon: 'notifications_active', title: 'Publishing alerts',    body: 'Get a push or email confirmation every time a post goes live — or if something fails.' },
];

export default function ProductScheduler() {
  useSEO({
    title: 'Vielinks Scheduler - Schedule Posts Across All Platforms',
    description: 'Plan a full month of content in one session. Vielinks posts at the right time on the right platform automatically.',
    keywords: 'social media scheduler, post scheduler, content calendar, bulk scheduling, best time to post',
  });

  const navigate   = useNavigate();
  const [active, setActive] = useState<number | null>(null);
  const featRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-feat]',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: featRef.current, start: 'top 78%', once: true } }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <ProductShell>
      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#d394ff]/[0.06] blur-[130px]" />
        <div className="mx-auto max-w-5xl px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d394ff]/20 bg-[#d394ff]/8 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#d394ff]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d394ff]" /> Product · Scheduler
            </span>
            <h1 className="mt-5 text-5xl md:text-[4rem] font-extrabold leading-[0.96] tracking-[-0.04em] text-white">
              Schedule once,<br />
              <span className="bg-gradient-to-r from-[#d394ff] via-[#f0dcff] to-[#aa30fa] bg-clip-text text-transparent">
                publish everywhere.
              </span>
            </h1>
            <p className="mt-6 text-lg font-light text-white/55 max-w-xl mx-auto leading-relaxed">
              Plan a full month of content in one session. Vielinks posts it at the right time, on the right platform — automatically.
            </p>
            <button onClick={() => navigate('/register')} className="mt-8 rounded-full bg-[#d394ff] px-8 py-3.5 text-sm font-bold text-[#4a0076] hover:shadow-[0_0_32px_rgba(211,148,255,0.4)] transition-all active:scale-[0.98]">
              Start scheduling free
            </button>
          </motion.div>
        </div>
      </section>

      {/* Interactive calendar preview */}
      <section className="py-12 mx-auto max-w-5xl px-6">
        <div className="rounded-3xl border border-white/[0.07] bg-[#111]/70 overflow-hidden">
          {/* Calendar header */}
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 18 }}>calendar_month</span>
              <span className="text-sm font-bold text-white">Content Calendar</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="px-2.5 py-1 rounded-full bg-[#d394ff]/10 text-[#d394ff] font-semibold">April 2026</span>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-white/[0.06]">
            {DAYS.map(d => (
              <div key={d} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-white/30">{d}</div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-px bg-white/[0.03]">
            {Array.from({ length: 7 }).map((_, i) => {
              const posts = POSTS[i] ?? [];
              return (
                <div
                  key={i}
                  className={`bg-[#0f0f0f] min-h-[90px] p-2 cursor-pointer transition-all duration-200 ${active === i ? 'bg-[#1a1919]' : 'hover:bg-[#141313]'}`}
                  onClick={() => setActive(active === i ? null : i)}
                >
                  <span className="text-[10px] text-white/30 font-semibold block mb-1.5">{i + 7}</span>
                  <div className="space-y-1">
                    {posts.map((p, j) => (
                      <div key={j} className="flex items-center gap-1 rounded-md px-1.5 py-1" style={{ backgroundColor: `${p.color}18`, border: `1px solid ${p.color}30` }}>
                        <span className="material-symbols-outlined shrink-0" style={{ fontSize: 10, color: p.color, fontVariationSettings: "'FILL' 1" }}>
                          {PLATFORM_ICON[p.platform]}
                        </span>
                        <span className="text-[9px] font-medium truncate" style={{ color: p.color }}>{p.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          <AnimatePresence>
            {active !== null && POSTS[active] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-white/[0.06]"
              >
                <div className="px-6 py-4 flex gap-4">
                  {POSTS[active]?.map((p, j) => (
                    <div key={j} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border" style={{ borderColor: `${p.color}30`, backgroundColor: `${p.color}10` }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: p.color, fontVariationSettings: "'FILL' 1" }}>
                        {PLATFORM_ICON[p.platform]}
                      </span>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: p.color }}>{p.label}</p>
                        <p className="text-[10px] text-white/40">{p.time} · {DAYS[active]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-center text-xs text-white/30 mt-3">Click a day to see scheduled posts</p>
      </section>

      {/* Features */}
      <section className="py-20 mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Built for serious publishers</h2>
          <p className="mt-3 text-white/45 max-w-lg mx-auto">Every tool you need to maintain a consistent publishing cadence.</p>
        </div>
        <div ref={featRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} data-feat style={{ opacity: 0 }} className="rounded-2xl border border-white/[0.07] bg-[#111]/70 p-6 hover:border-[#d394ff]/20 hover:bg-[#181818]/80 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#d394ff]/8 border border-[#d394ff]/12 flex items-center justify-center mb-4 group-hover:bg-[#d394ff]/15 transition-colors">
                <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </ProductShell>
  );
}
