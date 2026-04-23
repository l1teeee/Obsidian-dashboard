
import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function useOrbParallax(sectionRef: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const run = () => {
      if (!sectionRef.current) return;
      const ctx = gsap.context(() => {
        gsap.to('[data-d-orb]', {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }, sectionRef.current);
      return () => ctx.revert();
    };

    const w = window as Window & { __lenis?: unknown };
    let cleanup: (() => void) | undefined;
    if (w.__lenis) {
      cleanup = run() ?? undefined;
    } else {
      const h = () => { cleanup = run() ?? undefined; };
      window.addEventListener('lenis:ready', h, { once: true });
      return () => { window.removeEventListener('lenis:ready', h); cleanup?.(); };
    }
    return () => cleanup?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

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

export default function DifferentiatorsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useOrbParallax(sectionRef);

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
        .fromTo('[data-d="left"]',    { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.65 }, '-=0.25')
        .fromTo('[data-d="pain"]',    { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.38, stagger: 0.07 }, '-=0.45')
        .fromTo('[data-d="card"]',    { opacity: 0, y: 28, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.09 }, '-=0.8');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="Differentiators" className="relative overflow-hidden py-28 md:py-36">
      {/* Ambient orbs — parallax driven */}
      <div data-d-orb className="pointer-events-none absolute right-[4%] top-20 h-96 w-96 rounded-full bg-[#d394ff]/[0.04] blur-[120px] will-change-transform" />
      <div data-d-orb className="pointer-events-none absolute left-[3%] bottom-10 h-72 w-72 rounded-full bg-[#aa30fa]/[0.03] blur-[100px] will-change-transform" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d394ff]/10 to-transparent" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <span
            data-d="eyebrow"
            style={{ opacity: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d394ff]/20 bg-[#d394ff]/[0.07] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#d394ff]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
            Why Vielinks is different
          </span>
          <h2
            data-d="title"
            style={{ opacity: 0 }}
            className="text-4xl font-extrabold tracking-[-0.04em] leading-[0.96] text-white md:text-5xl"
          >
            A cleaner workflow.{' '}
            <span className="bg-gradient-to-r from-[#d394ff] via-[#f0dcff] to-[#c97cff] bg-clip-text text-transparent">
              Not just another tool.
            </span>
          </h2>
          <p
            data-d="sub"
            style={{ opacity: 0 }}
            className="mt-5 max-w-lg text-[1rem] font-light leading-[1.8] text-white/50"
          >
            Most social media tools add complexity. Vielinks removes it. Here is the difference that matters.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-10">

          {/* Left: The old way */}
          <div
            data-d="left"
            style={{ opacity: 0 }}
            className="rounded-[1.75rem] border border-white/[0.06] bg-[#0d0d0d]/60 p-7 md:p-8 backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <svg className="h-4 w-4 text-white/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-[0.78rem] font-bold uppercase tracking-[0.18em] text-white/30">Without Vielinks</p>
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
                  <span className="text-[0.875rem] leading-[1.6] text-white/40">{item}</span>
                </li>
              ))}
            </ul>

            {/* Simulated chaos visual */}
            <div className="mt-8 rounded-xl border border-white/[0.04] bg-white/[0.01] p-4">
              <p className="mb-3 text-[0.55rem] font-bold uppercase tracking-[0.18em] text-white/18">Your current stack</p>
              <div className="flex flex-wrap gap-2">
                {['Hootsuite', 'Buffer', 'Sprout', 'Google Sheets', 'Canva', 'Notion', '...'].map((t) => (
                  <span key={t} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[0.6rem] font-medium text-white/25">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[0.58rem] text-white/20">$180–$320 /mo combined · 6+ tabs open at once</p>
            </div>
          </div>

          {/* Right: differentiator cards */}
          <div className="flex flex-col gap-5">
            {differentiators.map((d, i) => (
              <div
                key={i}
                data-d="card"
                style={{ opacity: 0 }}
                className="group relative flex items-start gap-5 overflow-hidden rounded-[1.5rem] border border-[#d394ff]/12 bg-[#141414]/80 p-6 backdrop-blur-xl transition-all duration-500 hover:border-[#d394ff]/25 hover:bg-[#181818]/80"
              >
                {/* Top sheen */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                {/* Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d394ff]/18 bg-[#d394ff]/10 text-[#d394ff] transition-all duration-300 group-hover:bg-[#d394ff]/20">
                  {d.icon}
                </div>

                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-3 flex-wrap">
                    <h3 className="text-[0.95rem] font-bold tracking-tight text-white">{d.title}</h3>
                    <span className="rounded-full border border-[#d394ff]/20 bg-[#d394ff]/[0.08] px-2.5 py-0.5 text-[0.55rem] font-bold text-[#d394ff]/70">
                      {d.badge}
                    </span>
                  </div>
                  <p className="text-[0.875rem] leading-[1.75] text-white/50">{d.body}</p>
                </div>

                {/* Check */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d394ff]/10 border border-[#d394ff]/20">
                  <svg className="h-3.5 w-3.5 text-[#d394ff]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
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
