
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Weekly data — realistic engagement values */
const weekData = [
  { day: 'Mon', reach: 18400, eng: 1240 },
  { day: 'Tue', reach: 12900, eng:  870 },
  { day: 'Wed', reach: 29100, eng: 2100 },
  { day: 'Thu', reach: 21600, eng: 1490 },
  { day: 'Fri', reach: 34200, eng: 2580 },
  { day: 'Sat', reach: 16800, eng: 1120 },
  { day: 'Sun', reach: 11300, eng:  760 },
];
const maxReach = Math.max(...weekData.map((d) => d.reach));

const metrics = [
  { label: 'Total Reach',    value: '144.3K', delta: '+18.2%', up: true  },
  { label: 'Avg. Eng. Rate', value: '6.8%',   delta: '+1.4pp', up: true  },
  { label: 'Posts Published',value: '28',     delta: 'this week', up: null },
];

const features = [
  { icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', label: 'Predictive Engagement Modeling' },
  { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Cross-Platform Attribution Metrics' },
  { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Best-Time Posting Intelligence' },
];

export default function AnalyticsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(
        ['[data-a="eyebrow"]','[data-a="title"]','[data-a="desc"]','[data-a="feature"]',
         '[data-a="chart-shell"]','[data-a="metric"]','[data-a="bar-wrap"]','[data-a="day"]'],
        { willChange: 'transform, opacity, filter' }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none none',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      tl
        .to('[data-a="orb-1"]', { opacity: 1, duration: 0.8 }, 0)
        .to('[data-a="orb-2"]', { opacity: 1, duration: 0.8 }, 0.1)
        .fromTo('[data-a="eyebrow"]',
          { opacity: 0, y: 12, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4 }, 0.05)
        .fromTo('[data-a="title"]',
          { opacity: 0, y: 20, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55 }, '-=0.2')
        .fromTo('[data-a="desc"]',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.45 }, '-=0.3')
        .fromTo('[data-a="feature"]',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.38, stagger: 0.06 }, '-=0.25')
        .fromTo('[data-a="chart-shell"]',
          { opacity: 0, y: 28, scale: 0.988, filter: 'blur(12px)' },
          { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.65 }, '-=0.55')
        .fromTo('[data-a="metric"]',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 }, '-=0.4')
        .fromTo('[data-a="bar-wrap"]',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 }, '-=0.25')
        .fromTo('[data-a="bar-fill"]',
          { scaleY: 0, transformOrigin: 'bottom center' },
          { scaleY: 1, duration: 0.65, stagger: 0.06, ease: 'power4.out' }, '-=0.3')
        .fromTo('[data-a="day"]',
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.28, stagger: 0.04 }, '-=0.4')
        .add(() => {
          gsap.to('[data-a="orb-1"]', { y: -16, x: 10, duration: 4.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
          gsap.to('[data-a="orb-2"]', { y: 18, x: -12, duration: 5.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
          gsap.to('[data-a="chart-glow"]', { opacity: 0.7, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="Analytics" className="relative overflow-hidden py-28 md:py-36">
      <div data-a="orb-1" style={{ opacity: 0 }} className="pointer-events-none absolute left-[6%] top-20 h-72 w-72 rounded-full bg-[#d394ff]/[0.06] blur-[110px]" />
      <div data-a="orb-2" style={{ opacity: 0 }} className="pointer-events-none absolute bottom-10 right-[4%] h-72 w-72 rounded-full bg-[#aa30fa]/[0.06] blur-[110px]" />

      <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-6 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">

        {/* ── Left column — copy ── */}
        <div className="order-1 max-w-[600px]">
          <span
            data-a="eyebrow"
            style={{ opacity: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d394ff]/18 bg-[#d394ff]/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#d394ff]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
            Performance Intelligence
          </span>

          <h2
            data-a="title"
            style={{ opacity: 0 }}
            className="text-4xl font-extrabold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl md:text-[3.4rem]"
          >
            Know exactly what's
            <br />
            <span className="bg-gradient-to-b from-white via-[#f0dcff] to-[#c97cff] bg-clip-text text-transparent">
              working and why.
            </span>
          </h2>

          <p
            data-a="desc"
            style={{ opacity: 0 }}
            className="mt-6 max-w-[520px] text-[1rem] font-light leading-[1.8] text-white/45"
          >
            Real-time metrics across every platform — reach, engagement rate, impressions, and follower growth. All in one view, updated continuously.
          </p>

          <ul className="mt-9 space-y-4">
            {features.map((f) => (
              <li key={f.label} data-a="feature" style={{ opacity: 0 }} className="group flex items-center gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d394ff]/18 bg-[#d394ff]/10 text-[#d394ff] transition-all duration-300 group-hover:bg-[#d394ff] group-hover:text-[#4a0076]">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/65">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right column — chart ── */}
        <div className="order-2">
          <div data-a="chart-shell" style={{ opacity: 0 }} className="relative mx-auto max-w-[520px]">
            <div
              data-a="chart-glow"
              className="pointer-events-none absolute inset-x-10 top-8 h-32 rounded-full bg-[#d394ff]/10 blur-[80px]"
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#111111]/80 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-7">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025)_0%,rgba(255,255,255,0.00)_40%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-white/[0.09]" />

              <div className="relative z-10">
                {/* Header row */}
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div>
                    <p data-a="metric" style={{ opacity: 0 }} className="mb-1 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/30">
                      Weekly Reach · Apr 1–7, 2026
                    </p>
                    <div className="flex items-end gap-2.5">
                      <p data-a="metric" style={{ opacity: 0 }} className="text-[2rem] font-extrabold tracking-[-0.04em] text-white md:text-[2.4rem]">
                        144.3K
                      </p>
                      <span data-a="metric" style={{ opacity: 0 }} className="mb-1 inline-flex items-center gap-1 rounded-full border border-[#d394ff]/16 bg-[#d394ff]/10 px-2.5 py-0.5 text-[0.7rem] font-semibold text-[#d394ff]">
                        <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        +18.2%
                      </span>
                    </div>
                  </div>

                  <div data-a="metric" style={{ opacity: 0 }} className="flex gap-1.5 pt-1">
                    {['7D', '30D', '90D'].map((r, i) => (
                      <button key={r} className={`rounded-lg px-2.5 py-1 text-[0.58rem] font-bold transition-colors duration-200 ${i === 0 ? 'bg-[#d394ff]/15 text-[#d394ff]' : 'text-white/25 hover:text-white/50'}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secondary metrics row */}
                <div data-a="metric" style={{ opacity: 0 }} className="mb-6 grid grid-cols-3 gap-2">
                  {metrics.map((m) => (
                    <div key={m.label} className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
                      <p className="mb-1 text-[0.52rem] font-bold uppercase tracking-[0.16em] text-white/25">{m.label}</p>
                      <p className="text-[0.92rem] font-bold text-white">{m.value}</p>
                      <span className={`text-[0.58rem] font-semibold ${m.up === true ? 'text-[#d394ff]' : 'text-white/30'}`}>{m.delta}</span>
                    </div>
                  ))}
                </div>

                {/* Bar chart */}
                <div className="mb-2 flex h-[130px] items-end gap-2">
                  {weekData.map((bar) => (
                    <div
                      key={bar.day}
                      data-a="bar-wrap"
                      style={{ opacity: 0 }}
                      className="group/bar relative flex flex-1 flex-col justify-end"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="rounded-md border border-white/[0.08] bg-[#1a1a1a] px-2 py-1 text-[0.5rem] font-semibold text-white whitespace-nowrap shadow-lg">
                          {(bar.reach / 1000).toFixed(1)}K
                        </div>
                      </div>
                      <div className="relative h-[118px] overflow-hidden rounded-[10px] border border-white/[0.04] bg-white/[0.02]">
                        <div
                          data-a="bar-fill"
                          className="absolute inset-x-0 bottom-0 rounded-[9px] border-t border-[#d394ff]/30 bg-gradient-to-t from-[#d394ff]/60 via-[#d394ff]/25 to-[#d394ff]/5"
                          style={{ height: `${(bar.reach / maxReach) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Day labels */}
                <div className="flex gap-2">
                  {weekData.map((bar) => (
                    <span
                      key={bar.day}
                      data-a="day"
                      style={{ opacity: 0 }}
                      className="flex-1 text-center text-[0.58rem] font-bold uppercase tracking-[0.18em] text-white/22"
                    >
                      {bar.day}
                    </span>
                  ))}
                </div>

                {/* Platform breakdown */}
                <div data-a="metric" style={{ opacity: 0 }} className="mt-5 flex items-center gap-4 border-t border-white/[0.05] pt-4">
                  <span className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-white/25">By platform</span>
                  <div className="flex flex-1 items-center gap-3">
                    {[
                      { name: 'Instagram', pct: 47, color: '#e1306c' },
                      { name: 'LinkedIn',  pct: 31, color: '#0a66c2' },
                      { name: 'Facebook',  pct: 22, color: '#1877f2' },
                    ].map((p) => (
                      <div key={p.name} className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-[0.58rem] text-white/40">{p.name} {p.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
