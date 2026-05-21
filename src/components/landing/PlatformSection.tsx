
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const platforms = [
  {
    name: 'Instagram',
    tag: 'Stories · Reels · Feed',
    desc: 'Schedule Stories, plan Reels, and preview your grid before publishing.',
    color: '#e1306c',
    features: ['Grid preview', 'Carousel scheduling', 'Hashtag analytics'],
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    tag: 'Posts · Articles · Analytics',
    desc: 'Schedule posts at peak times and track impressions, follower growth, and engagement.',
    color: '#0a66c2',
    features: ['AI caption drafting', 'Best-time engine', 'Impressions tracking'],
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    tag: 'Pages · Campaigns · Reach',
    desc: 'Manage brand Pages, schedule campaigns, and monitor reach, reactions, and shares.',
    color: '#1877f2',
    features: ['Page analytics', 'Audience reach data', 'Campaign monitoring'],
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function PlatformSection() {
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('[data-pf="eyebrow"],[data-pf="title"],[data-pf="sub"],[data-pf="card"]', { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 72%',
          toggleActions: 'play none none none',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo('[data-pf="eyebrow"]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo('[data-pf="title"]',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.15')
        .fromTo('[data-pf="sub"]',     { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 },  '-=0.3')
        .fromTo('[data-pf="card"]',    { opacity: 0, y: 24, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 }, '-=0.25');
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="Platform" className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#111827]/[0.04] blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#0B1220]/[0.03] blur-[80px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span data-pf="eyebrow" style={{ opacity: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(15,23,42,0.14)] bg-[#FFFFFF] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#64748B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#111827]" />
            Platform Coverage
          </span>
          <h2 data-pf="title" style={{ opacity: 0 }} className="text-4xl font-extrabold tracking-[-0.04em] leading-[0.96] text-[#0F172A] md:text-5xl">
            One dashboard.{' '}
            <span className="text-[#111827]">
              Core platforms.
            </span>
          </h2>
          <p data-pf="sub" style={{ opacity: 0 }} className="mx-auto mt-5 max-w-lg text-[1rem] font-light leading-[1.8] text-[#0F172A]/50">
            Connect Instagram, LinkedIn, and Facebook once — then manage everything from a single workspace without switching tabs.
          </p>
        </div>

        {/* Platform cards — horizontal stacked rows */}
        <div className="flex flex-col gap-4">
          {platforms.map((p) => (
            <div
              key={p.name}
              data-pf="card"
              style={{ opacity: 0 }}
              className="group relative flex flex-col gap-5 overflow-hidden rounded-[1.5rem] border border-[rgba(15,23,42,0.14)] bg-[#FFFFFF] p-7 transition-all duration-500 hover:border-[#111827]/30 hover:bg-[#F1F5F9] sm:flex-row sm:items-center sm:gap-8"
            >
              {/* Top sheen */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />
              {/* Left accent bar */}
              <div className="absolute inset-y-0 left-0 w-[3px] rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ backgroundColor: p.color }} />

              {/* Icon + name */}
              <div className="flex shrink-0 items-center gap-4 sm:w-[200px]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${p.color}18`, color: p.color }}>
                  {p.icon}
                </div>
                <div>
                  <p className="text-[0.95rem] font-bold text-[#0F172A]">{p.name}</p>
                  <p className="text-[0.62rem] text-[#64748B]">{p.tag}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden h-10 w-px shrink-0 bg-[rgba(15,23,42,0.10)] sm:block" />

              {/* Description */}
              <p className="flex-1 text-[0.875rem] leading-[1.75] text-[#0F172A]/55">
                {p.desc}
              </p>

              {/* Divider */}
              <div className="hidden h-10 w-px shrink-0 bg-[rgba(15,23,42,0.10)] sm:block" />

              {/* Feature pills */}
              <div className="flex shrink-0 flex-wrap gap-2 sm:w-[260px]">
                {p.features.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold"
                    style={{ borderColor: `${p.color}28`, backgroundColor: `${p.color}0f`, color: `${p.color}cc` }}
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* Connected badge */}
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[0.6rem] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Connected
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-[0.78rem] text-[#0F172A]/50">
          OAuth-secured · Connects in under 2 minutes · More platforms coming soon
        </p>
      </div>
    </section>
  );
}
