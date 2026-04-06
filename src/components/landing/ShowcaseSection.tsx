
import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const tabs = ['Analytics', 'Scheduler', 'AI Insights'];

/* ─── CSS Mockups ─────────────────────────────────────── */

function AnalyticsMockup() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Reach', value: '2.4M', delta: '+18.2%' },
          { label: 'Engagement', value: '342K', delta: '+12.4%' },
          { label: 'Conversions', value: '8,291', delta: '+6.1%' },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
            <p className="mb-2 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#adaaaa]/45">{m.label}</p>
            <p className="font-headline text-[1.4rem] font-bold tracking-tight text-white">{m.value}</p>
            <span className="text-[0.65rem] font-semibold text-[#d394ff]">{m.delta}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#adaaaa]/45">Weekly Engagement</p>
          <div className="flex gap-1.5">
            {['7D', '30D', '90D'].map((r, i) => (
              <span key={r} className={`rounded-full px-2.5 py-0.5 text-[0.55rem] font-bold ${i === 0 ? 'bg-[#d394ff]/15 text-[#d394ff]' : 'text-[#adaaaa]/30'}`}>{r}</span>
            ))}
          </div>
        </div>
        <div className="flex h-28 items-end gap-1.5">
          {[42, 68, 47, 83, 58, 91, 72].map((h, i) => (
            <div key={i} className="flex flex-1 flex-col justify-end">
              <div
                className="rounded-t-[4px] border-t border-[#d394ff]/30 bg-gradient-to-t from-[#d394ff]/55 via-[#d394ff]/25 to-[#d394ff]/5"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <span key={d} className="flex-1 text-center text-[0.52rem] font-bold uppercase tracking-widest text-[#adaaaa]/25">{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SchedulerMockup() {
  const scheduled = [3, 7, 12, 17, 21, 25, 28];
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#adaaaa]/45">March 2026</p>
          <div className="flex gap-1">
            {['‹', '›'].map((a) => (
              <button key={a} className="flex h-5 w-5 items-center justify-center rounded-md bg-white/[0.04] text-[0.6rem] text-[#adaaaa]/40">{a}</button>
            ))}
          </div>
        </div>
        <div className="mb-1 grid grid-cols-7 gap-0.5 text-center">
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <span key={i} className="text-[0.5rem] font-bold text-[#adaaaa]/25">{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 1;
            const valid = day >= 1 && day <= 31;
            const has = scheduled.includes(day);
            const today = day === 25;
            return (
              <div key={i} className={`flex h-6 items-center justify-center rounded-md text-[0.52rem] font-medium transition-colors
                ${valid ? (has ? 'bg-[#d394ff]/15 text-[#d394ff] font-bold' : today ? 'bg-white/8 text-white ring-1 ring-white/12' : 'text-[#adaaaa]/45') : 'text-transparent'}`}>
                {valid ? day : '·'}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 flex-1">
          <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#adaaaa]/45">Next Post</p>
          <div className="mb-3 space-y-1.5">
            <div className="h-1.5 w-4/5 rounded-full bg-white/10" />
            <div className="h-1.5 w-3/5 rounded-full bg-white/8" />
            <div className="h-1.5 w-2/3 rounded-full bg-white/8" />
          </div>
          <div className="mb-3 flex gap-1.5">
            {['IG', 'LI', 'FB'].map((p) => (
              <span key={p} className="flex items-center gap-1 rounded-full border border-[#d394ff]/20 bg-[#d394ff]/8 px-2 py-0.5">
                <span className="h-1 w-1 rounded-full bg-[#d394ff]" />
                <span className="text-[0.52rem] font-bold text-[#d394ff]">{p}</span>
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
            <div>
              <p className="text-[0.5rem] text-[#adaaaa]/35">Scheduled for</p>
              <p className="text-[0.62rem] font-semibold text-[#e5e2e1]">Mar 25 · 9:00 AM</p>
            </div>
            <span className="rounded-full border border-[#d394ff]/25 bg-[#d394ff]/12 px-2.5 py-0.5 text-[0.55rem] font-bold text-[#d394ff]">Ready</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
          <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#adaaaa]/45">Queue</p>
          {['Instagram Reel', 'LinkedIn Article', 'FB Campaign'].map((item, i) => (
            <div key={item} className="flex items-center gap-2 py-1.5">
              <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${i === 0 ? 'bg-[#d394ff]' : 'bg-white/20'}`} />
              <span className="text-[0.58rem] text-[#adaaaa]/55">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightsMockup() {
  const heat = [
    [1,3,7,9,8,5,2,1,0],
    [2,4,6,10,9,7,4,2,1],
    [0,2,4,7,8,9,6,3,1],
    [1,3,5,9,10,8,5,2,1],
    [0,1,3,5,6,5,3,1,0],
  ];
  const tags = ['#branding','#creative','#social','#design','#CRM','#growth'];
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5">
        <p className="mb-4 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#adaaaa]/45">Best Time to Post</p>
        <div className="flex gap-3">
          <div className="flex flex-col justify-around">
            {['Mon','Tue','Wed','Thu','Fri'].map((d) => (
              <span key={d} className="text-[0.5rem] font-bold text-[#adaaaa]/30">{d}</span>
            ))}
          </div>
          <div className="flex-1 space-y-1">
            {heat.map((row, ri) => (
              <div key={ri} className="flex gap-1">
                {row.map((val, ci) => (
                  <div key={ci} className="flex-1 rounded-[3px]" style={{ height: '14px', backgroundColor: `rgba(211,148,255,${val / 12})` }} />
                ))}
              </div>
            ))}
            <div className="flex gap-1 pt-1">
              {['9','10','11','12','1','2','3','4','5'].map((h) => (
                <span key={h} className="flex-1 text-center text-[0.45rem] text-[#adaaaa]/25">{h}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
          <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#adaaaa]/45">Trending Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="rounded-full border border-[#d394ff]/15 bg-[#d394ff]/8 px-2.5 py-0.5 text-[0.55rem] font-medium text-[#d394ff]/70">{t}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-[#d394ff]/15 bg-[#d394ff]/5 p-4">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#adaaaa]/45">AI Score</p>
          <p className="font-headline text-4xl font-extrabold text-[#d394ff]">94</p>
          <p className="text-[0.58rem] text-[#adaaaa]/40">Engagement Prediction</p>
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-[#d394ff] to-[#aa30fa]" />
          </div>
        </div>
      </div>
    </div>
  );
}

const mockups = [<AnalyticsMockup />, <SchedulerMockup />, <InsightsMockup />];

/* ─── Component ───────────────────────────────────────── */

export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Entrance animation
  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(['[data-sc="orb"]', '[data-sc="eyebrow"]', '[data-sc="title"]', '[data-sc="sub"]', '[data-sc="tabs"]', '[data-sc="window"]'], {
        willChange: 'transform, opacity, filter',
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none none',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo('[data-sc="orb"]', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0)
        .fromTo('[data-sc="eyebrow"]', { opacity: 0, y: 12, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4 }, 0.05)
        .fromTo('[data-sc="title"]', { opacity: 0, y: 20, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55 }, '-=0.2')
        .fromTo('[data-sc="sub"]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
        .fromTo('[data-sc="tabs"]', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, '-=0.2')
        .fromTo('[data-sc="window"]', { opacity: 0, y: 28, scale: 0.988, filter: 'blur(10px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.65 }, '-=0.25');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const switchTab = (index: number) => {
    if (index === activeTab || !contentRef.current) return;
    gsap.to(contentRef.current, {
      opacity: 0, y: 6, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        setActiveTab(index);
        gsap.fromTo(contentRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' }
        );
      },
    });
  };

  return (
    <section ref={sectionRef} id="Showcase" className="relative overflow-hidden py-36">
      {/* Orbs */}
      <div data-sc="orb" style={{ opacity: 0 }} className="pointer-events-none absolute right-[8%] top-24 h-80 w-80 rounded-full bg-[#d394ff]/7 blur-[110px]" />
      <div data-sc="orb" style={{ opacity: 0 }} className="pointer-events-none absolute bottom-16 left-[5%] h-72 w-72 rounded-full bg-[#aa30fa]/7 blur-[100px]" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <span
            data-sc="eyebrow"
            style={{ opacity: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d394ff]/18 bg-[#d394ff]/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#d394ff]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
            Product Showcase
          </span>
          <h2
            data-sc="title"
            style={{ opacity: 0 }}
            className="font-headline text-4xl font-extrabold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl md:text-[3.6rem]"
          >
            Every tool you need,{' '}
            <span className="bg-gradient-to-b from-white via-[#f0dcff] to-[#c97cff] bg-clip-text text-transparent">
              beautifully unified.
            </span>
          </h2>
          <p data-sc="sub" style={{ opacity: 0 }} className="mt-6 text-[1.02rem] font-light leading-8 text-[#adaaaa]">
            From deep analytics to AI-powered scheduling — Vielinks puts your entire social universe in one cinematic interface.
          </p>
        </div>

        {/* Tabs */}
        <div data-sc="tabs" style={{ opacity: 0 }} className="mb-6 flex gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1.5 w-fit">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => switchTab(i)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                activeTab === i
                  ? 'bg-[#d394ff] text-[#4a0076] shadow-[0_0_20px_rgba(211,148,255,0.2)]'
                  : 'text-[#adaaaa]/60 hover:text-[#e5e2e1]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Window */}
        <div
          data-sc="window"
          style={{ opacity: 0 }}
          className="relative overflow-hidden rounded-[2rem] border border-[#494847]/20 bg-[#1a1919]/80 shadow-[0_40px_140px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-white/[0.05] px-6 py-4">
            <div className="flex gap-1.5">
              {['bg-[#ff5f57]', 'bg-[#febc2e]', 'bg-[#28c840]'].map((c) => (
                <div key={c} className={`h-3 w-3 rounded-full ${c} opacity-70`} />
              ))}
            </div>
            <div className="mx-auto flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[#d394ff]/60" />
              <span className="text-[0.6rem] font-medium text-[#adaaaa]/40">app.obsidianlens.com</span>
            </div>
          </div>

          {/* Sidebar + Content */}
          <div className="flex">
            {/* Sidebar */}
            <div className="hidden w-14 shrink-0 flex-col items-center gap-4 border-r border-white/[0.04] py-6 md:flex">
              {[
                <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
                <path key="b" strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                <path key="c" strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
                <path key="d" strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
              ].map((icon, i) => (
                <div key={i} className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${i === activeTab ? 'bg-[#d394ff]/15 text-[#d394ff]' : 'text-[#adaaaa]/25 hover:text-[#adaaaa]/50'}`}>
                  <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">{icon}</svg>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
              <div ref={contentRef}>
                {mockups[activeTab]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
