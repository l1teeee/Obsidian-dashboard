
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const platforms = [
  {
    name: 'Instagram',
    headline: 'Visual-first publishing',
    desc: 'Schedule Stories, plan Reels, and preview your grid before publishing. Keep your aesthetic consistent without leaving the dashboard.',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    accent: false,
    tag: 'Stories · Reels · Feed',
    features: ['Grid preview before publishing', 'Multi-image carousel support', 'Hashtag performance tracking'],
    color: '#e1306c',
  },
  {
    name: 'LinkedIn',
    headline: 'Thought leadership at scale',
    desc: 'Draft articles, schedule posts at peak times, and track impressions and follower growth. Built for professionals who publish with intention.',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    accent: true,
    tag: 'Most used',
    features: ['AI-assisted caption drafting', 'Best-time scheduling engine', 'Engagement & impressions tracking'],
    color: '#0a66c2',
  },
  {
    name: 'Facebook',
    headline: 'Pages and communities',
    desc: 'Manage brand Pages, schedule campaigns, and monitor community engagement. See reach, reactions, and shares from one central view.',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    accent: false,
    tag: 'Pages · Campaigns',
    features: ['Multi-image & link post scheduling', 'Page performance analytics', 'Audience reach tracking'],
    color: '#1877f2',
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

      tl.fromTo('[data-pf="eyebrow"]',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4 }
      )
      .fromTo('[data-pf="title"]',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.15'
      )
      .fromTo('[data-pf="sub"]',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45 },
        '-=0.3'
      )
      .fromTo('[data-pf="card"]',
        { opacity: 0, y: 28, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.09 },
        '-=0.3'
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="Platform" className="relative overflow-hidden py-28 md:py-36">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#d394ff]/[0.04] blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#aa30fa]/[0.03] blur-[80px]" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <span
            data-pf="eyebrow"
            style={{ opacity: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d394ff]/20 bg-[#d394ff]/[0.07] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#d394ff]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
            Platform Coverage
          </span>
          <h2
            data-pf="title"
            style={{ opacity: 0 }}
            className="text-4xl font-extrabold tracking-[-0.04em] leading-[0.96] text-white md:text-5xl"
          >
            One dashboard.{' '}
            <span className="bg-gradient-to-r from-[#d394ff] via-[#f0dcff] to-[#c97cff] bg-clip-text text-transparent">
              Every platform.
            </span>
          </h2>
          <p
            data-pf="sub"
            style={{ opacity: 0 }}
            className="mt-5 text-[1rem] font-light leading-7 text-white/55 max-w-lg"
          >
            Connect Instagram, LinkedIn, and Facebook once — then manage everything from a single workspace without switching tabs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {platforms.map((p) => (
            <div
              key={p.name}
              data-pf="card"
              style={{ opacity: 0 }}
              className={`group relative flex flex-col overflow-hidden rounded-[1.5rem] border p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 ${
                p.accent
                  ? 'border-[#d394ff]/22 bg-[#181818]/85 shadow-[0_0_60px_rgba(211,148,255,0.06)]'
                  : 'border-white/[0.07] bg-[#111111]/70 hover:bg-[#181818]/70'
              }`}
            >
              {/* Top sheen */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

              {/* Hover glow */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-[1.5rem]"
                style={{ background: 'radial-gradient(ellipse at top left, rgba(211,148,255,0.06) 0%, transparent 65%)' }}
              />

              <div className="relative z-10 flex flex-col flex-1">
                {/* Tag */}
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex w-fit rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/55">
                    {p.tag}
                  </span>
                  {p.accent && (
                    <span className="inline-flex w-fit rounded-full border border-[#d394ff]/25 bg-[#d394ff]/10 px-2.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[#d394ff]">
                      {p.tag === 'Most used' ? 'Most used' : ''}
                    </span>
                  )}
                </div>

                {/* Icon + Name */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${p.color}18`, color: p.color }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-white">{p.name}</h3>
                </div>

                <p className="mb-1 text-sm font-semibold text-white/70">{p.headline}</p>
                <p className="mb-6 flex-1 text-[0.875rem] leading-[1.7] text-white/55">{p.desc}</p>

                {/* Feature list */}
                <ul className="mb-6 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <div
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${p.color}18` }}
                      >
                        <svg className="h-2.5 w-2.5" fill="none" stroke={p.color} strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[0.8rem] text-white/55">{f}</span>
                    </li>
                  ))}
                </ul>

                <button className="group/btn inline-flex items-center gap-2 text-[0.78rem] font-semibold text-[#d394ff]/65 transition-all duration-300 hover:gap-3 hover:text-[#d394ff]">
                  Connect {p.name}
                  <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
