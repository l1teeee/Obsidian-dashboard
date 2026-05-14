
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const pain = [
  'Paying for Hootsuite, Buffer, AND a separate analytics tool',
  'Writing captions in Google Docs, then copy-pasting everywhere',
  'Losing track of scheduled posts across multiple tabs',
  'Guessing the best time to post without real data',
  'Reporting performance from different platform dashboards',
];

const differentiators = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Simpler, not stripped down',
    body: 'Professional-grade features designed to be intuitive. You get the power without the learning curve — set up in minutes, not days.',
    badge: 'No onboarding call needed',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'One subscription. Four tools replaced.',
    body: 'Scheduling, analytics, AI copywriting, and collaboration — all in one platform. Cancel your other subscriptions and simplify your stack.',
    badge: 'Avg. $180/mo saved',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Built for teams with real deadlines',
    body: 'Not a solo-creator hobby tool. Vielinks is built for agencies, growing brands, and social media teams that publish consistently and need reliable systems.',
    badge: 'Trusted by agencies',
  },
];

const workflowSteps = [
  { step: '01', title: 'Plan', body: 'Map posts, owners, and dates in one shared calendar.', accent: '#7DD3C7' },
  { step: '02', title: 'Draft', body: 'Write captions, adapt channels, and keep approvals visible.', accent: '#D6A86A' },
  { step: '03', title: 'Publish', body: 'Queue Instagram, LinkedIn, and Facebook without tab switching.', accent: '#7DD3C7' },
  { step: '04', title: 'Report', body: 'Review performance signals before the next content cycle.', accent: '#F4F1EC' },
];

export default function DifferentiatorsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('[data-d="eyebrow"],[data-d="title"],[data-d="sub"],[data-d="pain"],[data-d="card"]', { opacity: 1, y: 0, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
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
        .fromTo('[data-d="eyebrow"]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo('[data-d="title"]',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.15')
        .fromTo('[data-d="sub"]',     { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.3')
        .fromTo('[data-d="workflow"]', { opacity: 0, y: 24, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '-=0.25')
        .fromTo('[data-d="left"]',    { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.65 }, '-=0.25')
        .fromTo('[data-d="pain"]',    { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.38, stagger: 0.07 }, '-=0.45')
        .fromTo('[data-d="card"]',    { opacity: 0, y: 28, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.09 }, '-=0.8');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="Differentiators" className="relative overflow-hidden py-28 md:py-36">
      {/* Static ambient color, kept intentionally subtle for performance */}
      <div className="pointer-events-none absolute right-[4%] top-20 h-80 w-80 rounded-full bg-[#7DD3C7]/[0.03] blur-[72px]" />
      <div className="pointer-events-none absolute left-[3%] bottom-10 h-64 w-64 rounded-full bg-[#D6A86A]/[0.025] blur-[64px]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span
            data-d="eyebrow"
            style={{ opacity: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-[#1C1814]/[0.05] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#1C1814]/45"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#7DD3C7]" />
            Why Vielinks is different
          </span>
          <h2
            data-d="title"
            style={{ opacity: 0 }}
            className="text-4xl font-extrabold tracking-[-0.04em] leading-[0.96] text-[#1C1814] md:text-5xl"
          >
            A cleaner workflow.{' '}
            <span className="text-[#7DD3C7]">
              Not just another tool.
            </span>
          </h2>
          <p
            data-d="sub"
            style={{ opacity: 0 }}
            className="mx-auto mt-5 max-w-lg text-[1rem] font-light leading-[1.8] text-[#1C1814]/50"
          >
            Most social media tools add complexity. Vielinks removes it. Here is the difference that matters.
          </p>
        </div>

        <div
          data-d="workflow"
          style={{ opacity: 0 }}
          className="relative mb-10 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#F3EEE6]/80 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-5"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />
          <div className="grid gap-3 md:grid-cols-4">
            {workflowSteps.map((item, index) => (
              <div
                key={item.step}
                className="group relative overflow-hidden rounded-[1.25rem] border border-white/[0.07] bg-[#F4F0E8]/55 p-5 transition-all duration-300 hover:border-white/[0.14] hover:bg-[#1F1D1B]/70"
              >
                {index < workflowSteps.length - 1 && (
                  <div className="pointer-events-none absolute right-[-18px] top-1/2 hidden h-px w-9 bg-white/[0.12] md:block" />
                )}
                <div className="mb-5 flex items-center justify-between">
                  <span
                    className="rounded-full border px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em]"
                    style={{ borderColor: `${item.accent}35`, backgroundColor: `${item.accent}12`, color: item.accent }}
                  >
                    {item.step}
                  </span>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.accent, boxShadow: `0 0 18px ${item.accent}55` }}
                  />
                </div>
                <h3 className="text-base font-extrabold tracking-tight text-[#1C1814]">{item.title}</h3>
                <p className="mt-2 text-[0.82rem] leading-[1.65] text-[#1C1814]/45">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ['One queue', 'All scheduled content in one operational view'],
              ['Fewer tabs', 'Planning, publishing, and reporting stay connected'],
              ['Clear handoff', 'Teams can see what is drafted, approved, and live'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                <p className="text-[0.72rem] font-bold text-[#1C1814]">{title}</p>
                <p className="mt-1 text-[0.68rem] leading-relaxed text-[#1C1814]/35">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-10">

          {/* Left: The old way */}
          <div
            data-d="left"
            style={{ opacity: 0 }}
            className="rounded-[1.75rem] border border-white/[0.06] bg-[#F4F0E8]/60 p-7 md:p-8 backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <svg className="h-4 w-4 text-[#1C1814]/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-[0.78rem] font-bold uppercase tracking-[0.18em] text-[#1C1814]/30">Without Vielinks</p>
            </div>

            <ul className="space-y-4">
              {pain.map((item, i) => (
                <li
                  key={i}
                  data-d="pain"
                  style={{ opacity: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 border border-red-500/15">
                    <svg className="h-2.5 w-2.5 text-red-400/70" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-[0.875rem] leading-[1.6] text-[#1C1814]/40">{item}</span>
                </li>
              ))}
            </ul>

            {/* Simulated chaos visual */}
            <div className="mt-8 rounded-xl border border-white/[0.04] bg-white/[0.01] p-4">
              <p className="mb-3 text-[0.55rem] font-bold uppercase tracking-[0.18em] text-[#1C1814]/18">Your current stack</p>
              <div className="flex flex-wrap gap-2">
                {['Hootsuite', 'Buffer', 'Sprout', 'Google Sheets', 'Canva', 'Notion', '...'].map((t) => (
                  <span key={t} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[0.6rem] font-medium text-[#1C1814]/25">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[0.58rem] text-[#1C1814]/20">$180–$320 /mo combined · 6+ tabs open at once</p>
            </div>
          </div>

          {/* Right: differentiator cards */}
          <div className="flex flex-col gap-5">
            {differentiators.map((d, i) => (
              <div
                key={i}
                data-d="card"
                style={{ opacity: 0 }}
                className="group relative flex items-start gap-5 overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-[#F3EEE6]/80 p-6 backdrop-blur-xl transition-all duration-500 hover:border-white/[0.15] hover:bg-[#1F1D1B]/80"
              >
                {/* Top sheen */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                {/* Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.05] text-[#1C1814]/60 transition-all duration-300 group-hover:bg-white/[0.09] group-hover:text-[#1C1814]/80">
                  {d.icon}
                </div>

                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-3 flex-wrap">
                    <h3 className="text-[0.95rem] font-bold tracking-tight text-[#1C1814]">{d.title}</h3>
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[0.55rem] font-bold text-[#1C1814]/35">
                      {d.badge}
                    </span>
                  </div>
                  <p className="text-[0.875rem] leading-[1.75] text-[#1C1814]/50">{d.body}</p>
                </div>

                {/* Check */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08]">
                  <svg className="h-3.5 w-3.5 text-[#1C1814]/45" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
