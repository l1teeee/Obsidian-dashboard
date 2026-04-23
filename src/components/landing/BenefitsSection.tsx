
import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CardDecorator } from '@/components/ui/features-1';

gsap.registerPlugin(ScrollTrigger);

function useOrbParallax(sectionRef: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const run = () => {
      if (!sectionRef.current) return;
      const ctx = gsap.context(() => {
        gsap.to('[data-b-orb]', {
          yPercent: -22,
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

const benefits = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Content planning',
    headline: 'Plan everything in one calendar',
    body: 'See your entire content schedule across every platform at a glance. No spreadsheets, no sticky notes, no missed posting windows.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    label: 'Auto-publishing',
    headline: 'Publish without lifting a finger',
    body: 'Schedule weeks of content in one session. Vielinks auto-publishes at the exact right time based on when your audience is most active.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    label: 'Performance intelligence',
    headline: 'Track what actually drives results',
    body: 'Cross-platform analytics in a single view. See reach, engagement, and follower growth — and know exactly which content is worth repeating.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Team collaboration',
    headline: 'Built for teams that collaborate',
    body: 'Share workspaces, manage content approvals, and keep everyone aligned — whether you are a two-person team or a full agency.',
  },
];

export default function BenefitsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useOrbParallax(sectionRef);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('[data-b="eyebrow"],[data-b="title"],[data-b="sub"],[data-b="card"]', { opacity: 1, y: 0 });
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

      tl.fromTo('[data-b="eyebrow"]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo('[data-b="title"]',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.15')
        .fromTo('[data-b="sub"]',     { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.3')
        .fromTo('[data-b="card"]',    { opacity: 0, y: 28, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.1 }, '-=0.25');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="Benefits" className="relative overflow-hidden py-28 md:py-36">
      <div data-b-orb className="pointer-events-none absolute left-[5%] top-1/4 h-80 w-80 rounded-full bg-[#d394ff]/[0.04] blur-[110px] will-change-transform" />
      <div data-b-orb className="pointer-events-none absolute right-[4%] bottom-1/4 h-64 w-64 rounded-full bg-[#aa30fa]/[0.04] blur-[100px] will-change-transform" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d394ff]/10 to-transparent" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Header — centered */}
        <div className="mb-16 text-center">
          <span data-b="eyebrow" style={{ opacity: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d394ff]/20 bg-[#d394ff]/[0.07] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#d394ff]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
            Why teams switch to Vielinks
          </span>
          <h2 data-b="title" style={{ opacity: 0 }} className="mt-5 text-4xl font-extrabold tracking-[-0.04em] leading-[0.96] text-white md:text-5xl">
            Real benefits.{' '}
            <span className="bg-gradient-to-r from-[#d394ff] via-[#f0dcff] to-[#c97cff] bg-clip-text text-transparent">
              Not just features.
            </span>
          </h2>
          <p data-b="sub" style={{ opacity: 0 }} className="mt-5 mx-auto max-w-lg text-[1rem] font-light leading-[1.8] text-white/50">
            Every tool claims to save time. Here is exactly how Vielinks does it — and why 12,000+ teams made the switch.
          </p>
        </div>

        {/* Single row — 4 equal columns */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <div
              key={i}
              data-b="card"
              style={{ opacity: 0 }}
              className="group relative flex flex-col items-center text-center overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-[#111111]/80 p-10 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-[#d394ff]/18 hover:bg-[#161616]/80"
            >
              {/* Top sheen */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
              {/* Hover radial glow */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: 'radial-gradient(ellipse at top, rgba(211,148,255,0.07) 0%, transparent 60%)' }}
              />

              {/* Icon with grid decorator */}
              <CardDecorator>
                {b.icon}
              </CardDecorator>

              {/* Label */}
              <p className="mt-6 mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#d394ff]/60">
                {b.label}
              </p>

              {/* Headline */}
              <h3 className="mb-4 text-[1.1rem] font-extrabold leading-snug tracking-tight text-white">
                {b.headline}
              </h3>

              {/* Body */}
              <p className="text-[0.9rem] leading-[1.8] text-white/50 max-w-sm">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
