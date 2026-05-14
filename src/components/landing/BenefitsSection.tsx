
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ── Calendar mini UI ─────────────────────────────── */
function CalendarMicro() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const posts = [
    { day: 2, platform: 'IG', color: '#e1306c' },
    { day: 4, platform: 'LI', color: '#0a66c2' },
    { day: 6, platform: 'FB', color: '#1877f2' },
    { day: 9, platform: 'IG', color: '#e1306c' },
    { day: 11, platform: 'LI', color: '#0a66c2' },
    { day: 13, platform: 'IG', color: '#e1306c' },
    { day: 16, platform: 'FB', color: '#1877f2' },
    { day: 18, platform: 'LI', color: '#0a66c2' },
    { day: 20, platform: 'IG', color: '#e1306c' },
    { day: 23, platform: 'FB', color: '#1877f2' },
  ];
  const postMap = new Map(posts.map(p => [p.day, p]));
  return (
    <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#F4F0E8]/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#1C1814]/30">April 2026</span>
        <div className="flex gap-1">
          {['IG', 'LI', 'FB'].map((p, i) => (
            <span key={p} className="rounded px-1.5 py-0.5 text-[0.48rem] font-bold"
              style={{ backgroundColor: [['#e1306c', '#0a66c2', '#1877f2'][i] + '22'][0], color: ['#e1306c', '#0a66c2', '#1877f2'][i] }}>
              {p}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {days.map((d, i) => (
          <div key={i} className="text-center text-[0.45rem] font-bold uppercase text-[#1C1814]/20">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 28 }, (_, i) => {
          const day = i + 1;
          const post = postMap.get(day);
          const isToday = day === 9;
          return (
            <div key={i} className={`relative flex h-7 items-center justify-center rounded-lg text-[0.5rem] font-semibold transition-colors ${
              isToday ? 'bg-[#7DD3C7]/20 text-[#7DD3C7]' : post ? 'text-[#1C1814]/60' : 'text-[#1C1814]/20'
            }`}>
              {day}
              {post && (
                <div className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                  style={{ backgroundColor: post.color }} />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-white/[0.05] pt-3">
        <div className="h-1.5 w-1.5 rounded-full bg-[#7DD3C7]" />
        <span className="text-[0.58rem] text-[#1C1814]/35">28 posts scheduled this month</span>
      </div>
    </div>
  );
}

/* ── Approval micro UI ────────────────────────────── */
function ApprovalMicro() {
  const items = [
    { title: 'Product launch carousel', platform: 'IG', color: '#e1306c', status: 'approved', by: 'CM' },
    { title: 'Q2 industry insights', platform: 'LI', color: '#0a66c2', status: 'pending', by: 'AK' },
    { title: 'Community poll', platform: 'FB', color: '#1877f2', status: 'review', by: 'RL' },
  ];
  const badge = (status: string) => {
    if (status === 'approved') return <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[0.5rem] font-bold text-emerald-400">Approved</span>;
    if (status === 'pending')  return <span className="flex items-center gap-1 rounded-full border border-[#D6A86A]/20 bg-[#D6A86A]/10 px-2 py-0.5 text-[0.5rem] font-bold text-[#D6A86A]">Pending</span>;
    return <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.5rem] font-bold text-[#1C1814]/40">Review</span>;
  };
  return (
    <div className="mt-5 space-y-2">
      {items.map((item) => (
        <div key={item.title} className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-[#F4F0E8]/60 px-3 py-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[0.45rem] font-bold"
            style={{ backgroundColor: item.color + '22', color: item.color }}>
            {item.platform}
          </div>
          <p className="flex-1 truncate text-[0.6rem] font-medium text-[#1C1814]/55">{item.title}</p>
          {badge(item.status)}
        </div>
      ))}
      <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] px-3 py-2 text-center">
        <span className="text-[0.55rem] text-[#1C1814]/25">3 posts awaiting your review</span>
      </div>
    </div>
  );
}

/* ── Analytics micro UI ───────────────────────────── */
function AnalyticsMicro() {
  const bars = [42, 58, 51, 75, 61, 88, 74];
  const metrics = [
    { label: 'Reach', value: '144K', delta: '+18%', up: true },
    { label: 'Engagement', value: '6.8%', delta: '+1.4pp', up: true },
  ];
  return (
    <div className="mt-5 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {metrics.map(m => (
          <div key={m.label} className="rounded-xl border border-white/[0.06] bg-[#F4F0E8]/60 p-3">
            <p className="mb-1 text-[0.48rem] font-bold uppercase tracking-[0.16em] text-[#1C1814]/25">{m.label}</p>
            <p className="text-[0.95rem] font-bold text-[#1C1814]">{m.value}</p>
            <span className="text-[0.5rem] font-semibold text-[#7DD3C7]">{m.delta}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/[0.06] bg-[#F4F0E8]/60 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.48rem] font-bold uppercase tracking-[0.16em] text-[#1C1814]/25">Weekly Reach</span>
          <span className="rounded px-1.5 py-0.5 text-[0.45rem] font-bold bg-[#7DD3C7]/15 text-[#7DD3C7]">7D</span>
        </div>
        <div className="flex h-[52px] items-end gap-1">
          {bars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col justify-end">
              <div className="rounded-t-sm border-t border-[#7DD3C7]/30 bg-[#7DD3C7]/40"
                style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── AI micro UI ──────────────────────────────────── */
function AIMicro() {
  return (
    <div className="flex items-start gap-4 mt-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7DD3C7]/15">
        <svg className="h-4 w-4 text-[#7DD3C7]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl border border-white/[0.07] bg-[#F4F0E8]/60 p-3.5">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#7DD3C7]/70 mb-1.5">AI Suggestion</p>
          <p className="text-[0.72rem] leading-relaxed text-[#1C1814]/60">
            Your Instagram carousels from Tuesday 9–11 AM get <span className="text-[#1C1814]/85 font-semibold">2.3x more reach</span>. Schedule your next campaign in that window.
          </p>
          <div className="mt-2.5 flex gap-2">
            <span className="rounded-full border border-[#7DD3C7]/20 bg-[#7DD3C7]/8 px-2 py-0.5 text-[0.5rem] font-bold text-[#7DD3C7]/70">Apply suggestion</span>
            <span className="rounded-full border border-white/[0.07] bg-white/[0.02] px-2 py-0.5 text-[0.5rem] font-bold text-[#1C1814]/30">Dismiss</span>
          </div>
        </div>
        <div className="mt-2 rounded-2xl border border-white/[0.05] bg-white/[0.01] p-3">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#1C1814]/20 mb-1">Caption draft</p>
          <div className="space-y-1">
            <div className="h-1.5 w-5/6 rounded-full bg-white/[0.07]" />
            <div className="h-1.5 w-4/6 rounded-full bg-white/[0.05]" />
            <div className="h-1.5 w-3/6 rounded-full bg-white/[0.04]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────── */
export default function BenefitsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('[data-b]', { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
        defaults: { ease: 'power3.out' },
      })
        .fromTo('[data-b="head"]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo('[data-b="card"]', { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 }, '-=0.25');
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="Benefits" className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute left-[5%] top-1/4 h-80 w-80 rounded-full bg-[#7DD3C7]/[0.04] blur-[110px]" />
      <div className="pointer-events-none absolute right-[4%] bottom-1/4 h-64 w-64 rounded-full bg-[#D6A86A]/[0.04] blur-[100px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        {/* Header */}
        <div data-b="head" style={{ opacity: 0 }} className="mb-14 text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-[#1C1814]/[0.05] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#1C1814]/45">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7DD3C7]" />
            Why teams switch to Vielinks
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.04em] leading-[0.96] text-[#1C1814] md:text-5xl">
            Real capabilities.{' '}
            <span className="text-[#7DD3C7]">Built for teams.</span>
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {/* Large card — Calendar */}
          <div data-b="card" style={{ opacity: 0 }}
            className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-[#F3EEE6]/80 p-7 backdrop-blur-xl transition-all duration-500 hover:border-[#7DD3C7]/15 hover:bg-[#1C1B1A]/80 lg:row-span-2">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: 'radial-gradient(ellipse at top left, rgba(125,211,199,0.06) 0%, transparent 60%)' }} />
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#7DD3C7]/20 bg-[#7DD3C7]/8 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[#7DD3C7]/80">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Content Calendar
            </span>
            <h3 className="text-[1.25rem] font-extrabold leading-snug tracking-tight text-[#1C1814]">
              Plan everything in one view
            </h3>
            <p className="mt-2 text-[0.85rem] leading-[1.75] text-[#1C1814]/45">
              See your entire content schedule across Instagram, LinkedIn, and Facebook. No spreadsheets, no missed windows.
            </p>
            <CalendarMicro />
          </div>

          {/* Medium card — Approvals */}
          <div data-b="card" style={{ opacity: 0 }}
            className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-[#F3EEE6]/80 p-7 backdrop-blur-xl transition-all duration-500 hover:border-[#D6A86A]/15 hover:bg-[#1C1B1A]/80">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#D6A86A]/20 bg-[#D6A86A]/8 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[#D6A86A]/80">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Team Approvals
            </span>
            <h3 className="text-[1.1rem] font-extrabold leading-snug tracking-tight text-[#1C1814]">
              Review before it goes live
            </h3>
            <p className="mt-2 text-[0.82rem] leading-[1.75] text-[#1C1814]/45">
              Share workspaces and manage approvals. Keep everyone aligned before publishing.
            </p>
            <ApprovalMicro />
          </div>

          {/* Medium card — Analytics */}
          <div data-b="card" style={{ opacity: 0 }}
            className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-[#F3EEE6]/80 p-7 backdrop-blur-xl transition-all duration-500 hover:border-[#7DD3C7]/15 hover:bg-[#1C1B1A]/80">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#7DD3C7]/20 bg-[#7DD3C7]/8 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[#7DD3C7]/80">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Performance
            </span>
            <h3 className="text-[1.1rem] font-extrabold leading-snug tracking-tight text-[#1C1814]">
              Track what drives results
            </h3>
            <p className="mt-2 text-[0.82rem] leading-[1.75] text-[#1C1814]/45">
              Cross-platform analytics in a single view. Know exactly which content is worth repeating.
            </p>
            <AnalyticsMicro />
          </div>

          {/* Full-width — AI */}
          <div data-b="card" style={{ opacity: 0 }}
            className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-[#F3EEE6]/80 p-7 backdrop-blur-xl transition-all duration-500 hover:border-white/[0.12] hover:bg-[#1C1B1A]/80 md:col-span-2 lg:col-span-2">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: 'radial-gradient(ellipse at bottom right, rgba(214,168,106,0.05) 0%, transparent 55%)' }} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-10">
              <div className="shrink-0 sm:max-w-[280px]">
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#D6A86A]/20 bg-[#D6A86A]/8 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[#D6A86A]/80">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI Assistance
                </span>
                <h3 className="text-[1.1rem] font-extrabold leading-snug tracking-tight text-[#1C1814]">
                  Smarter publishing, less guesswork
                </h3>
                <p className="mt-2 text-[0.82rem] leading-[1.75] text-[#1C1814]/45">
                  AI drafts captions, suggests hashtags, recommends optimal posting windows, and learns from your audience data.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Caption drafting', 'Best-time engine', 'Hashtag suggestions', 'Performance insights'].map(tag => (
                    <span key={tag} className="rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 text-[0.58rem] font-semibold text-[#1C1814]/35">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <AIMicro />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
