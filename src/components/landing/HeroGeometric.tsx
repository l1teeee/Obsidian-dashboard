import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFadeNav } from '@/hooks/useFadeNav';

gsap.registerPlugin(ScrollTrigger);

/* ── Platform pill strip ─────────────────────────────────── */
function PlatformStrip() {
  const platforms = [
    {
      name: 'Instagram', color: '#e1306c',
      icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
    },
    {
      name: 'LinkedIn', color: '#0a66c2',
      icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
    },
    {
      name: 'Facebook', color: '#1877f2',
      icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
    },
  ];
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      <span className="text-[0.65rem] font-medium text-white/25 tracking-wide mr-1">Works with</span>
      {platforms.map((p) => (
        <div
          key={p.name}
          className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 backdrop-blur-sm"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" style={{ color: p.color }}>
            {p.icon}
          </svg>
          <span className="text-[0.65rem] font-semibold text-white/45">{p.name}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Floating notification cards ─────────────────────────── */
function FloatingCard({
  children, className, delay,
}: { children: React.ReactNode; className?: string; delay: number }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, scale: 0.88, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={`pointer-events-none absolute z-20 ${className ?? ''}`}
    >
      {children}
    </motion.div>
  );
}

/* ── Mini dashboard mockup ───────────────────────────────── */
function DashboardMockup() {
  const kpis = [
    { label: 'Total Reach', value: '2.4M', delta: '+18.2%', up: true },
    { label: 'Engagement', value: '342K', delta: '+12.4%', up: true },
    { label: 'Scheduled', value: '28', delta: 'posts', up: null },
  ];

  const upcoming = [
    { platform: 'IG', label: 'Product launch carousel', time: 'Today · 9:00 AM', color: '#e1306c' },
    { platform: 'LI', label: 'Q2 industry insights', time: 'Today · 12:30 PM', color: '#0a66c2' },
    { platform: 'FB', label: 'Weekend community poll', time: 'Tomorrow · 10:00 AM', color: '#1877f2' },
  ];

  const bars = [32, 58, 41, 75, 53, 88, 67];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div
      className="relative mx-auto w-full max-w-[900px] overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#0d0d0d] shadow-[0_40px_120px_rgba(0,0,0,0.6),0_0_0_1px_rgba(211,148,255,0.06)]"
      style={{ transform: 'perspective(1400px) rotateX(4deg)', transformOrigin: 'top center' }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#111111] px-5 py-3.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] opacity-75" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e] opacity-75" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#28c840] opacity-75" />
        </div>
        <div className="mx-auto flex items-center gap-2 rounded-md border border-white/[0.05] bg-white/[0.03] px-4 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-[#d394ff]/50" />
          <span className="text-[0.58rem] font-medium text-white/30">app.vielinks.com</span>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-6 rounded-md bg-white/[0.04]" />
        </div>
      </div>

      {/* App layout */}
      <div className="flex" style={{ height: '380px' }}>
        {/* Sidebar */}
        <div className="flex w-[52px] shrink-0 flex-col items-center gap-1 border-r border-white/[0.05] bg-[#0a0a0a] py-4">
          {/* Logo mark */}
          <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-xl bg-[#d394ff]/15">
            <div className="h-3.5 w-3.5 rounded-full bg-[#d394ff]" />
          </div>
          {/* Nav icons */}
          {[
            'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            'M13 10V3L4 14h7v7l9-11h-7z',
          ].map((d, i) => (
            <div
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${i === 0 ? 'bg-[#d394ff]/12 text-[#d394ff]' : 'text-white/20 hover:text-white/40'}`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={d} />
              </svg>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-3">
            <div>
              <p className="text-[0.7rem] font-bold text-white/80">Dashboard</p>
              <p className="text-[0.55rem] text-white/25">April 2026 · All platforms</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
                <span className="text-[0.55rem] font-medium text-white/40">My Workspace</span>
              </div>
              <div className="h-6 w-6 rounded-full bg-[#d394ff]/20 ring-1 ring-[#d394ff]/30" />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 gap-4 overflow-hidden p-4">
            {/* Left: KPIs + Chart */}
            <div className="flex flex-1 flex-col gap-3">
              {/* KPI cards */}
              <div className="grid grid-cols-3 gap-2.5">
                {kpis.map((k) => (
                  <div key={k.label} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                    <p className="mb-1.5 text-[0.5rem] font-bold uppercase tracking-[0.18em] text-white/25">{k.label}</p>
                    <p className="text-[1.05rem] font-bold tracking-tight text-white">{k.value}</p>
                    <span className={`text-[0.52rem] font-semibold ${k.up === true ? 'text-[#d394ff]' : k.up === false ? 'text-red-400' : 'text-white/30'}`}>
                      {k.delta}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="flex-1 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[0.52rem] font-bold uppercase tracking-[0.18em] text-white/25">Weekly Engagement</p>
                  <div className="flex gap-1">
                    {['7D', '30D', '90D'].map((r, i) => (
                      <span key={r} className={`rounded px-1.5 py-0.5 text-[0.45rem] font-bold ${i === 0 ? 'bg-[#d394ff]/15 text-[#d394ff]' : 'text-white/20'}`}>{r}</span>
                    ))}
                  </div>
                </div>
                <div className="flex h-[90px] items-end gap-1">
                  {bars.map((h, i) => (
                    <div key={i} className="flex flex-1 flex-col justify-end">
                      <div
                        className="rounded-t-[3px] border-t border-[#d394ff]/30 bg-gradient-to-t from-[#d394ff]/55 via-[#d394ff]/20 to-[#d394ff]/5"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 flex gap-1">
                  {days.map((d, i) => (
                    <span key={i} className="flex-1 text-center text-[0.4rem] font-bold uppercase text-white/20">{d}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Upcoming posts */}
            <div className="w-[190px] shrink-0">
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 h-full">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[0.52rem] font-bold uppercase tracking-[0.18em] text-white/25">Upcoming Posts</p>
                  <span className="rounded-full bg-[#d394ff]/12 px-1.5 py-0.5 text-[0.45rem] font-bold text-[#d394ff]">28</span>
                </div>
                <div className="space-y-2.5">
                  {upcoming.map((post) => (
                    <div key={post.label} className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5">
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <div className="flex h-4 w-4 items-center justify-center rounded-md text-[0.45rem] font-bold text-white" style={{ backgroundColor: `${post.color}22`, color: post.color }}>
                          {post.platform}
                        </div>
                        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: post.color, opacity: 0.7 }} />
                      </div>
                      <p className="mb-1 text-[0.52rem] font-medium text-white/60 leading-tight">{post.label}</p>
                      <p className="text-[0.45rem] text-white/25">{post.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </div>
  );
}

/* ── Shapes ──────────────────────────────────────────────── */
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-white/[0.08]',
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: -100, rotate: rotate - 10 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={prefersReduced ? { duration: 0 } : { duration: 2.6, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.4 } }}
      className={`absolute pointer-events-none ${className ?? ''}`}
    >
      <motion.div
        animate={prefersReduced ? {} : { y: [0, 16, 0] }}
        transition={{ duration: 10 + delay * 3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        style={{ width, height }}
        className="relative"
      >
        <div className={[
          'absolute inset-0 rounded-full',
          'bg-gradient-to-r to-transparent',
          gradient,
          'backdrop-blur-[2px] border border-[#d394ff]/[0.15]',
          'shadow-[0_8px_40px_0_rgba(211,148,255,0.10)]',
          'after:absolute after:inset-0 after:rounded-full',
          'after:bg-[radial-gradient(circle_at_40%_40%,rgba(211,148,255,0.14),transparent_65%)]',
        ].join(' ')} />
      </motion.div>
    </motion.div>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
export default function HeroGeometric() {
  const fadeNav = useFadeNav();
  const prefersReduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  /* ── Parallax background layers on scroll ─────────────── */
  useLayoutEffect(() => {
    if (prefersReduced) return;

    const run = () => {
      const hero = heroRef.current;
      if (!hero) return;

      const ctx = gsap.context(() => {
        const shared = {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        };

        // Layer 1 — deepest: ambient glow (slowest)
        gsap.to('[data-hero-parallax="glow"]', {
          yPercent: 28,
          ease: 'none',
          scrollTrigger: shared,
        });

        // Layer 2 — floating shapes (medium)
        gsap.to('[data-hero-parallax="shapes"]', {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: shared,
        });

        // Layer 3 — dot grid (subtle, near-mid)
        gsap.to('[data-hero-parallax="grid"]', {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: shared,
        });
      }, hero);

      return () => ctx.revert();
    };

    const w = window as Window & { __lenis?: unknown };
    let cleanup: (() => void) | undefined;

    if (w.__lenis) {
      cleanup = run() ?? undefined;
    } else {
      const handler = () => { cleanup = run() ?? undefined; };
      window.addEventListener('lenis:ready', handler, { once: true });
      return () => {
        window.removeEventListener('lenis:ready', handler);
        cleanup?.();
      };
    }

    return () => cleanup?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced]);

  /* Rotating title words */
  const titles = useMemo(
    () => ['publishing smarter', 'growing faster', 'saving 5 hours weekly', 'scaling with ease', 'performing better'],
    []
  );
  const [titleIndex, setTitleIndex] = useState(0);
  useEffect(() => {
    if (prefersReduced) return;
    const id = setTimeout(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 2400);
    return () => clearTimeout(id);
  }, [titleIndex, titles.length, prefersReduced]);

  const fade = (i: number) => ({
    hidden:  prefersReduced ? {} : { opacity: 0, y: 22, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: prefersReduced ? { duration: 0 } : { duration: 0.9, delay: 0.3 + i * 0.14, ease: [0.25, 0.4, 0.25, 1] as const } },
  });

  return (
    <div ref={heroRef} className="relative w-full overflow-hidden bg-[#0a0a0a]" style={{ minHeight: '100vh' }}>
      {/* Ambient background — static, no parallax needed */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d394ff]/[0.03] via-transparent to-[#6b0fa0]/[0.05]" />

      {/* Parallax layer 1 — deepest glow (slowest) */}
      <div
        data-hero-parallax="glow"
        className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-[#d394ff]/[0.04] blur-[130px] pointer-events-none will-change-transform"
      />

      {/* Parallax layer 2 — floating shapes */}
      <div data-hero-parallax="shapes" className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform">
        <ElegantShape delay={0.2}  width={580} height={130} rotate={ 12} gradient="from-[#d394ff]/[0.10]" className="left-[-10%] top-[14%]" />
        <ElegantShape delay={0.45} width={420} height={100} rotate={-13} gradient="from-[#aa30fa]/[0.09]" className="right-[-6%] top-[55%]" />
        <ElegantShape delay={0.65} width={180} height={ 46} rotate={ 20} gradient="from-[#d394ff]/[0.08]" className="right-[16%] top-[7%]" />
      </div>

      {/* Parallax layer 3 — dot grid (subtle near-mid) */}
      <div
        data-hero-parallax="grid"
        className="absolute inset-0 pointer-events-none opacity-[0.12] will-change-transform"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(211,148,255,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 55% at 50% 40%, black 20%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-36 pb-0 text-center flex flex-col items-center">

        {/* Eyebrow badge */}
        <motion.div
          variants={fade(0)} initial="hidden" animate="visible"
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d394ff]/22 bg-[#d394ff]/[0.08] px-4 py-1.5"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d394ff] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
          </span>
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#d394ff]/80">
            Trusted by 12,000+ social media teams
          </span>
        </motion.div>

        {/* Headline with animated rotating second line */}
        <motion.h1
          variants={fade(1)} initial="hidden" animate="visible"
          className="text-4xl sm:text-5xl md:text-[4.5rem] font-extrabold tracking-[-0.03em] leading-[1.06] mb-6 max-w-4xl"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/75">
            Stop switching tools.
          </span>
          {/* Animated rotating line */}
          <span
            className="relative flex w-full justify-center overflow-hidden"
            style={{ height: '1.2em', marginTop: '0.08em' }}
          >
            &nbsp;
            {titles.map((title, index) => (
              <motion.span
                key={index}
                className="absolute inset-x-0 flex justify-center font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#c97cff] via-[#f0dcff] to-[#aa30fa]"
                initial={{ opacity: 0, y: 80 }}
                transition={{ type: 'spring', stiffness: 55, damping: 14 }}
                animate={
                  titleIndex === index
                    ? { y: 0, opacity: 1 }
                    : { y: titleIndex > index ? -80 : 80, opacity: 0 }
                }
              >
                Start {title}.
              </motion.span>
            ))}
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fade(2)} initial="hidden" animate="visible"
          className="text-[1rem] md:text-[1.12rem] text-white/50 leading-[1.8] font-light max-w-[520px] mb-10"
        >
          One workspace for your entire social media workflow. Plan content, schedule posts, and track what performs — without jumping between tabs.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fade(3)} initial="hidden" animate="visible"
          className="flex flex-col sm:flex-row items-center gap-3 mb-6"
        >
          <button
            onClick={() => fadeNav('/register')}
            className="group relative rounded-full bg-[#d394ff] px-9 py-4 text-sm font-bold tracking-wide text-[#3a0060] overflow-hidden transition-all duration-300 hover:shadow-[0_0_48px_rgba(211,148,255,0.5)] w-full sm:w-auto"
          >
            <span className="relative z-10">Start Free Trial</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#d394ff] to-[#f0dcff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button
            onClick={() => fadeNav('/login')}
            className="group rounded-full border border-white/[0.12] bg-white/[0.03] px-9 py-4 text-sm font-semibold tracking-wide text-white/50 backdrop-blur-xl hover:border-[#d394ff]/30 hover:text-white/75 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            Book a Demo
            <svg className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>

        {/* Platform strip */}
        <motion.div
          variants={fade(4)} initial="hidden" animate="visible"
          className="mb-8"
        >
          <PlatformStrip />
        </motion.div>

        {/* Trust strip with avatars */}
        <motion.div
          variants={fade(5)} initial="hidden" animate="visible"
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          {/* Avatar stack */}
          <div className="flex items-center">
            {[
              { initials: 'SM', bg: '#7c3aed' },
              { initials: 'AK', bg: '#0a66c2' },
              { initials: 'RL', bg: '#e1306c' },
              { initials: 'JD', bg: '#059669' },
            ].map((av, i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0a0a0a] text-[0.52rem] font-bold text-white"
                style={{ backgroundColor: av.bg, marginLeft: i > 0 ? '-8px' : '0', zIndex: 4 - i }}
              >
                {av.initials}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className="h-3 w-3 text-[#d394ff]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[0.72rem] text-white/40">
              <span className="font-semibold text-white/60">4.8/5</span> from 2,400+ reviews · No credit card required
            </span>
          </div>
        </motion.div>

        {/* Dashboard mockup with floating notification cards */}
        <motion.div
          variants={{
            hidden:  { opacity: 0, y: 48, filter: 'blur(12px)' },
            visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 1.1, delay: 0.85, ease: [0.25, 0.4, 0.25, 1] } },
          }}
          initial="hidden" animate="visible"
          className="relative w-full"
        >
          {/* Floating card — published notification (bottom-left) */}
          <FloatingCard delay={1.6} className="bottom-10 -left-4 md:-left-10 hidden sm:block">
            <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-[#0d0d0d]/90 px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-[0.65rem] font-semibold text-white/70">Published to Instagram</p>
                <p className="text-[0.55rem] text-white/35">Just now · 2,400+ accounts notified</p>
              </div>
            </div>
          </FloatingCard>

          {/* Floating card — reach spike (top-right) */}
          <FloatingCard delay={1.9} className="top-8 -right-4 md:-right-10 hidden sm:block">
            <div className="flex items-center gap-2.5 rounded-2xl border border-[#d394ff]/20 bg-[#0d0d0d]/90 px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d394ff]/12">
                <svg className="h-3.5 w-3.5 text-[#d394ff]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <div>
                <p className="text-[0.65rem] font-semibold text-white/70">Reach up <span className="text-[#d394ff]">+18.2%</span> this week</p>
                <p className="text-[0.55rem] text-white/35">vs. last week · All platforms</p>
              </div>
            </div>
          </FloatingCard>

          {/* Floating card — scheduled (right side, mid) */}
          <FloatingCard delay={2.1} className="top-1/2 -translate-y-1/2 -right-4 md:-right-12 hidden lg:block">
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-[#0d0d0d]/90 px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.08]">
                <svg className="h-3.5 w-3.5 text-white/50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[0.65rem] font-semibold text-white/70"><span className="text-white/90">28 posts</span> queued</p>
                <p className="text-[0.55rem] text-white/35">Next: Today at 9:00 AM</p>
              </div>
            </div>
          </FloatingCard>

          <DashboardMockup />
        </motion.div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none z-20" />
    </div>
  );
}
