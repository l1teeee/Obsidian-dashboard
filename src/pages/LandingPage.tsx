import { useState, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSEO } from '../hooks/useSEO';

gsap.registerPlugin(ScrollTrigger);

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconArrow = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconChevron = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconDashboard = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);

const IconCalendar = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconAnalytics = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IconHub = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const IconSparkle = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z" />
  </svg>
);

const IconClock = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconLinkIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const IconInstagram = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const IconLinkedIn = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const IconFacebook = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PREVIEW_BARS = [32, 58, 41, 75, 53, 88, 67];
const PREVIEW_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { y: -48, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.05 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <nav ref={ref} className="fixed top-0 left-0 right-0 z-50 w-full bg-[rgba(246,242,234,0.82)] backdrop-blur-lg border-b border-border">
      <div className="max-w-300 mx-auto px-8 flex items-center justify-between h-16">
        <a href="/" className="flex items-center">
          <span className="font-medium text-[18px] text-[#15140F] tracking-[-0.02em]">Vielinks</span>
        </a>
        <div className="hidden md:flex gap-9">
          {[['Product', '#features'], ['Pricing', '#pricing'], ['FAQ', '#faq'], ['Changelog', '#']].map(([label, href]) => (
            <a key={label} href={href} className="text-[14px] text-[#6B655B] hover:text-[#15140F] transition-colors duration-200">{label}</a>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <Link to="/login" className="inline-flex items-center text-[14px] font-medium text-[#3D3A30] px-[18px] py-2.5 rounded-[10px] hover:bg-[#EFE9DC] transition-all duration-200">
            Sign in
          </Link>
          <Link to="/register" className="inline-flex items-center text-[14px] font-medium bg-[#15140F] text-[#F6F2EA] px-[18px] py-2.5 rounded-[10px] hover:bg-[#3D3A30] transition-all duration-200">
            Start free
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      // Entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('[data-h="eyebrow"]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55 })
        .fromTo('[data-h="title"]',   { opacity: 0, y: 52 }, { opacity: 1, y: 0, duration: 0.75 }, '-=0.35')
        .fromTo('[data-h="sub"]',     { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.45')
        .fromTo('[data-h="ctas"]',    { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.5  }, '-=0.35')
        .fromTo('[data-h="meta"]',    { opacity: 0 },         { opacity: 1,        duration: 0.4  }, '-=0.15')
        .fromTo('[data-h="strip"]',   { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5  }, '-=0.25');

      gsap.to('[data-h="inner"]', {
        opacity: 0,
        y: -72,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'center top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="min-h-screen flex items-center text-center">
      <div data-h="inner" className="w-full max-w-300 mx-auto px-8 pt-16">
        <span data-h="eyebrow" className="inline-flex items-center rounded-full bg-[#EFE9DC] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655B] mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#C8553A]" />
          For social teams who care about craft
        </span>
        <h1 data-h="title" className="text-[clamp(44px,6.5vw,88px)] leading-[1.03] tracking-[-0.04em] text-[#15140F] max-w-225 mx-auto mb-5 font-medium">
          One workspace<br />for your <em className="not-italic text-[#C8553A]">posts.</em>
        </h1>
        <p data-h="sub" className="max-w-140 mx-auto mb-9 text-[16px] leading-[1.65] text-[#6B655B]">
          Schedule, analyze, and collaborate across Instagram, LinkedIn, and Facebook — without switching tabs.
        </p>
        <div data-h="ctas" className="flex gap-3 justify-center mb-5">
          <Link to="/register" className="inline-flex items-center gap-2 text-[14px] font-medium bg-[#C8553A] text-white px-5 py-2.5 rounded-xl hover:bg-[#A53F28] transition-all duration-200">
            Start free <IconArrow className="w-3.5 h-3.5" />
          </Link>
          <a href="#features" className="inline-flex items-center gap-2 text-[14px] font-medium text-[#6B655B] px-5 py-2.5 rounded-xl hover:bg-[#EFE9DC] hover:text-[#15140F] transition-all duration-200">
            See the product
          </a>
        </div>
        <p data-h="meta" className="text-[12px] text-[#A39B8B]">No card required · 14-day paid trial</p>

        <div data-h="strip" className="mt-14 flex flex-col items-center gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#A39B8B]">Works with</span>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655B]">
            <span className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-[#C8553A]">
              <IconInstagram className="w-4 h-4 text-[#A39B8B] transition-colors duration-200 group-hover:text-[#C8553A]" /> Instagram
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-[#D8D0C0] sm:block" />
            <span className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-[#C8553A]">
              <IconLinkedIn className="w-4 h-4 text-[#A39B8B] transition-colors duration-200 group-hover:text-[#C8553A]" /> LinkedIn
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-[#D8D0C0] sm:block" />
            <span className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-[#C8553A]">
              <IconFacebook className="w-4 h-4 text-[#A39B8B] transition-colors duration-200 group-hover:text-[#C8553A]" /> Facebook
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Product Preview ──────────────────────────────────────────────────────────

function ProductPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const navItems = [
    { icon: <IconDashboard className="w-4 h-4" />, label: 'Dashboard', active: true },
    { icon: <IconCalendar className="w-4 h-4" />, label: 'Calendar' },
    { icon: <IconAnalytics className="w-4 h-4" />, label: 'Analytics' },
    { icon: <IconHub className="w-4 h-4" />, label: 'Platforms' },
    { icon: <IconSparkle className="w-4 h-4" />, label: 'AI Insights' },
  ];
  const kpis = [
    { label: 'Total reach', value: '2.4M', delta: '↑ 18.2%', color: '#4F7A4A' },
    { label: 'Engagement', value: '342K', delta: '↑ 12.4%', color: '#4F7A4A' },
    { label: 'Scheduled', value: '28', delta: 'this week', color: '#6B655B' },
  ];

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      const innerEl = ref.current?.querySelector<HTMLElement>('[data-pp="inner"]');
      if (innerEl) gsap.set(innerEl, { opacity: 1, y: 0, filter: 'blur(0px)' });

      if (innerEl) {
        gsap.fromTo(innerEl,
          { opacity: 0.96, y: 18, filter: 'blur(2px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
          }
        );
      }

      // Frame slides up
      gsap.fromTo('[data-pp="frame"]',
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
        }
      );
      // Bars grow from 0
      barsRef.current.forEach((el, i) => {
        if (!el) return;
        const target = PREVIEW_BARS[i];
        gsap.fromTo(el,
          { height: '0%', opacity: 0 },
          {
            height: `${target}%`, opacity: 1, duration: 0.6, ease: 'power2.out',
            delay: i * 0.06,
            scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
          }
        );
      });

      if (innerEl) {
        gsap.to(innerEl, {
          opacity: 0,
          y: -60,
          filter: 'blur(6px)',
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'bottom 50%',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="max-w-275 mx-auto px-8 mt-24">
      <div data-pp="inner">
        <div data-pp="frame" className="bg-[#FBF8F2] border border-border rounded-[20px] overflow-hidden shadow-[0_4px_0_rgba(21,20,15,0.02),0_32px_80px_rgba(21,20,15,0.10)]">
          <div className="flex items-center gap-2 px-[18px] py-3.5 border-b border-border bg-[#EFE9DC]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A39B8B] opacity-50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#A39B8B] opacity-50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#A39B8B] opacity-50" />
            <span className="ml-4 font-mono text-[12px] text-[#6B655B]">app.vielinks.com/dashboard</span>
          </div>
          <div className="p-8 min-h-[480px] grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
            <div className="hidden md:flex flex-col gap-1">
              {navItems.map(item => (
                <div key={item.label} className={`flex items-center gap-2.5 px-3 py-2.5 text-[13px] rounded-[10px] ${item.active ? 'bg-[#EFE9DC] text-[#15140F] font-medium' : 'text-[#6B655B]'}`}>
                  {item.icon} {item.label}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B655B] mb-1.5">Workspace overview</p>
                <p className="text-[28px] tracking-[-0.03em] font-medium text-[#15140F]">Plan, publish, measure.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {kpis.map(k => (
                  <div key={k.label} className="bg-[#F6F2EA] border border-border rounded-xl px-4 py-3.5">
                    <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#6B655B] mb-1.5">{k.label}</div>
                    <div className="text-[24px] font-semibold tracking-[-0.02em] text-[#15140F]">{k.value}</div>
                    <div className="text-[11px] mt-1" style={{ color: k.color }}>{k.delta}</div>
                  </div>
                ))}
              </div>
              <div className="bg-[#F6F2EA] border border-border rounded-xl p-4 flex flex-col gap-3 flex-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-[13px] font-medium text-[#15140F]">Weekly engagement</span>
                  <span className="text-[11px] text-[#6B655B]">Last 7 days</span>
                </div>
                <div className="flex gap-1.5 h-[90px] items-end">
                  {PREVIEW_BARS.map((_, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end h-full">
                      <div
                        ref={el => { barsRef.current[i] = el; }}
                        className="bg-[#F4E0D6] rounded-t-[3px] w-full"
                        style={{ height: `${PREVIEW_BARS[i]}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {PREVIEW_DAYS.map((d, i) => (
                    <span key={i} className="flex-1 text-center text-[10px] font-medium text-[#A39B8B] uppercase">{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────

function Features() {
  const ref = useRef<HTMLElement>(null);
  const features = [
    { icon: <IconCalendar className="w-4.5 h-4.5" />, title: 'Calendar that just plans', body: 'Drag posts between days. See the whole month in one view. Every platform on one timeline, color-coded but quiet.' },
    { icon: <IconSparkle className="w-4.5 h-4.5" />, title: 'AI that drafts captions', body: "Stuck on a caption? Drop in the image and a brief, get three options in your tone. Edit, post, move on." },
    { icon: <IconAnalytics className="w-4.5 h-4.5" />, title: 'Numbers, not dashboards', body: "What got reach, when. What got engagement, why. Per platform, per post, per week. No vanity metrics." },
    { icon: <IconHub className="w-4.5 h-4.5" />, title: 'Three platforms, one tab', body: 'Instagram, LinkedIn, Facebook. Connect once, post everywhere, with previews that show what each network will actually render.' },
    { icon: <IconClock className="w-4.5 h-4.5" />, title: 'Approval queues', body: 'A reviewer, a clock, a green checkmark. Drafts route to whoever needs to see them before they go out.' },
    { icon: <IconLinkIcon className="w-4.5 h-4.5" />, title: 'Link in bio, but quiet', body: "A small, hosted page you can update from the same workspace. No third-party tools, no extra subscriptions." },
  ];

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      const innerEl = ref.current?.querySelector<HTMLElement>('[data-f="inner"]');
      if (innerEl) gsap.set(innerEl, { opacity: 1, y: 0, filter: 'blur(0px)' });

      if (innerEl) {
        gsap.fromTo(innerEl,
          { opacity: 0.96, y: 18, filter: 'blur(2px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
          }
        );
      }

      const st = { trigger: ref.current, start: 'top 78%', once: true };
      gsap.fromTo('[data-f="head"]',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', scrollTrigger: st }
      );
      gsap.fromTo('[data-f="card"]',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { ...st, start: 'top 72%' } }
      );

      if (innerEl) {
        gsap.to(innerEl, {
          opacity: 0,
          y: -60,
          filter: 'blur(6px)',
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'bottom 50%',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="features" className="py-24">
      <div data-f="inner" className="max-w-300 mx-auto px-8">
        <div data-f="head">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#C8553A] mb-3 inline-block">The workspace</span>
          <h2 className="text-[clamp(32px,4.5vw,52px)] leading-[1.1] tracking-[-0.035em] mb-3 max-w-180 font-medium text-[#15140F]">
            A tool that <em className="not-italic text-[#C8553A]">respects</em> your week.
          </h2>
          <p className="text-[16px] leading-[1.65] text-[#6B655B] max-w-140 mb-12">
            Fewer dashboards, fewer features that don't matter, fewer popups. The list, the calendar, the numbers, the AI when you want it.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(21,20,15,0.10)] border border-border rounded-2xl overflow-hidden">
          {features.map(f => (
            <div key={f.title} data-f="card" className="group bg-[#F6F2EA] p-8 flex flex-col gap-3 transition-colors duration-300 ease-out hover:bg-[#C8553A]">
              <div className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-[#EFE9DC] text-[#15140F] mb-2 transition-colors duration-300 ease-out group-hover:bg-white/15 group-hover:text-white">
                {f.icon}
              </div>
              <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[#15140F] transition-colors duration-300 ease-out group-hover:text-white">{f.title}</h3>
              <p className="text-[14px] leading-[1.6] text-[#6B655B] transition-colors duration-300 ease-out group-hover:text-[#F6F2EA]">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const plans = [
    { name: 'Starter', price: 0, unit: '/ forever', desc: 'One person, one workspace, three connected accounts.', items: ['Up to 30 posts / month', '7-day analytics window', 'Email-only support'], cta: 'Start free', featured: false },
    { name: 'Pro', price: 18, unit: '/ user / mo', desc: 'For teams of 2–8 who post weekly across all three networks.', items: ['Unlimited posts', 'Full analytics history', 'AI caption drafts', 'Approval workflows'], cta: 'Start 14-day trial', featured: true },
    { name: 'Studio', price: 64, unit: '/ user / mo', desc: 'For agencies and in-house teams managing multiple brands.', items: ['Everything in Pro', 'Multiple brand workspaces', 'Client review portals', 'Priority support'], cta: 'Talk to us', featured: false },
  ];

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      const innerEl = ref.current?.querySelector<HTMLElement>('[data-pr="inner"]');
      if (innerEl) gsap.set(innerEl, { opacity: 1, y: 0, filter: 'blur(0px)' });

      if (innerEl) {
        gsap.fromTo(innerEl,
          { opacity: 0.96, y: 18, filter: 'blur(2px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
          }
        );
      }

      const st = { trigger: ref.current, start: 'top 78%', once: true };
      gsap.fromTo('[data-pr="head"]',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', scrollTrigger: st }
      );
      gsap.fromTo('[data-pr="card"]',
        { opacity: 0, y: 44, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { ...st, start: 'top 72%' } }
      );

      if (innerEl) {
        gsap.to(innerEl, {
          opacity: 0,
          y: -60,
          filter: 'blur(6px)',
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'bottom 50%',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="pricing" className="py-24 bg-[#FBF8F2] border-t border-b border-border">
      <div data-pr="inner" className="max-w-300 mx-auto px-8">
        <div data-pr="head">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#C8553A] mb-3 inline-block">Pricing</span>
          <h2 className="text-[clamp(32px,4.5vw,52px)] leading-[1.1] tracking-[-0.035em] mb-3 max-w-180 font-medium text-[#15140F]">
            Three plans. <em className="not-italic text-[#C8553A]">No surprises.</em>
          </h2>
          <p className="text-[16px] leading-[1.65] text-[#6B655B] max-w-140 mb-12">
            A free tier that's actually useful, a paid tier priced for working teams, and a studio tier for agencies. No "contact sales" until the studio plan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(p => (
            <div
              key={p.name}
              data-pr="card"
              className={`group rounded-2xl p-8 flex flex-col gap-4 border transition-all duration-300 ease-out hover:-translate-y-1 ${p.featured ? 'bg-[#15140F] border-[#15140F] hover:border-[#C8553A] hover:shadow-[0_20px_50px_rgba(200,85,58,0.20)]' : 'bg-[#F6F2EA] border-border hover:border-[#C8553A] hover:bg-[#FBF8F2] hover:shadow-[0_18px_45px_rgba(21,20,15,0.10)]'}`}
            >
              <div className="text-[22px] font-medium tracking-[-0.02em]" style={{ color: p.featured ? '#F6F2EA' : '#15140F' }}>{p.name}</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[56px] font-medium tracking-[-0.04em] leading-none" style={{ color: p.featured ? '#F6F2EA' : '#15140F' }}>${p.price}</span>
                <span className="text-[13px]" style={{ color: p.featured ? 'rgba(251,248,242,0.6)' : '#6B655B' }}>{p.unit}</span>
              </div>
              <p className="text-[14px] leading-[1.5]" style={{ color: p.featured ? 'rgba(251,248,242,0.7)' : '#6B655B' }}>{p.desc}</p>
              <ul className="list-none flex flex-col gap-2 my-2">
                {p.items.map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-[14px]" style={{ color: p.featured ? 'rgba(251,248,242,0.85)' : '#3D3A30' }}>
                    <span className="w-1 h-1 rounded-full bg-current opacity-40 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-auto w-full inline-flex justify-center items-center text-[14px] font-medium px-[18px] py-2.5 rounded-[10px] transition-all duration-200 group-hover:-translate-y-0.5"
                style={p.featured ? { background: '#C8553A', color: 'white' } : { background: '#15140F', color: '#F6F2EA' }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number>(0);
  const items = [
    { q: 'Which platforms do you support today?', a: "Instagram, LinkedIn, and Facebook. We're intentionally focused — the goal is to do three well rather than seven badly. TikTok and Threads are on the roadmap, but we won't announce dates until they're close." },
    { q: 'Do I need to install anything?', a: 'No. Vielinks runs in your browser. Mobile apps for iOS and Android are scheduled for later this year.' },
    { q: 'How is this different from Buffer or Hootsuite?', a: "Fewer features, more care. We don't try to be a CRM, a CMS, or a help desk. We help teams plan, publish, and measure across three networks — that's it." },
    { q: 'What happens to my data if I cancel?', a: 'You can export everything (posts, drafts, media, analytics) as JSON and CSV at any time, before or after cancellation. We keep your data for 60 days after cancellation, then delete it.' },
    { q: 'Is there a free trial?', a: 'Starter is free forever. Pro and Studio have a 14-day trial — no card required.' },
  ];

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      const innerEl = ref.current?.querySelector<HTMLElement>('[data-faq="inner"]');
      if (innerEl) gsap.set(innerEl, { opacity: 1, y: 0, filter: 'blur(0px)' });

      if (innerEl) {
        gsap.fromTo(innerEl,
          { opacity: 0.96, y: 18, filter: 'blur(2px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
          }
        );
      }

      const st = { trigger: ref.current, start: 'top 80%', once: true };
      gsap.fromTo('[data-faq="head"]',
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: st }
      );
      gsap.fromTo('[data-faq="item"]',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.45, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { ...st, start: 'top 75%' } }
      );

      if (innerEl) {
        gsap.to(innerEl, {
          opacity: 0,
          y: -60,
          filter: 'blur(6px)',
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'bottom 50%',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="faq" className="py-24">
      <div data-faq="inner" className="max-w-300 mx-auto px-8">
        <div data-faq="head">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#C8553A] mb-3 inline-block">Questions</span>
          <h2 className="text-[clamp(32px,4.5vw,52px)] leading-[1.1] tracking-[-0.035em] mb-12 max-w-180 font-medium text-[#15140F]">
            Answered, <em className="not-italic text-[#C8553A]">without the fluff.</em>
          </h2>
        </div>
        <div className="flex flex-col">
          {items.map((item, i) => (
            <div
              key={i}
              data-faq="item"
              className={`border-t border-border py-6 cursor-pointer ${i === items.length - 1 ? 'border-b' : ''}`}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              <div className="flex justify-between items-center text-[17px] font-medium text-[#15140F]">
                {item.q}
                <IconChevron className={`w-4 h-4 shrink-0 ml-4 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </div>
              <div
                className="overflow-hidden transition-all duration-300 text-[15px] leading-[1.65] text-[#6B655B]"
                style={{ maxHeight: open === i ? '200px' : '0', paddingTop: open === i ? '12px' : '0' }}
              >
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BigCTA ───────────────────────────────────────────────────────────────────

function BigCTA() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      const innerEl = ref.current?.querySelector<HTMLElement>('[data-cta="inner"]');
      if (innerEl) gsap.set(innerEl, { opacity: 1, y: 0, filter: 'blur(0px)' });

      if (innerEl) {
        gsap.fromTo(innerEl,
          { opacity: 0.96, y: 18, filter: 'blur(2px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
          }
        );
      }

      gsap.fromTo('[data-cta="box"]',
        { opacity: 0, y: 48, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
        }
      );

      if (innerEl) {
        gsap.to(innerEl, {
          opacity: 0,
          y: -60,
          filter: 'blur(6px)',
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'bottom 50%',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-14">
      <div data-cta="inner" className="max-w-300 mx-auto px-8">
        <div data-cta="box" className="bg-[#15140F] text-[#F6F2EA] rounded-3xl px-8 md:px-16 py-20 text-center">
          <h2 className="text-[clamp(36px,5.5vw,64px)] leading-[1.05] tracking-[-0.04em] mb-5 font-medium">
            Start the <em className="not-italic text-[#C8553A]">quiet</em> way.
          </h2>
          <p className="text-[16px] max-w-120 mx-auto mb-7" style={{ color: 'rgba(251,248,242,0.7)' }}>
            One workspace, three networks, fourteen days free. Cancel with one click.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              aria-label="Start free trial"
              className="group inline-flex w-full sm:w-auto min-w-40 items-center justify-center gap-2 rounded-xl bg-[#C8553A] px-6 py-3.5 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-[#A53F28] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6F2EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15140F]"
            >
              Start free <IconArrow className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex w-full sm:w-auto min-w-40 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-medium transition-all duration-200 hover:bg-[rgba(251,248,242,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6F2EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15140F]"
              style={{ color: 'rgba(251,248,242,0.7)' }}
            >
              See pricing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const ref = useRef<HTMLElement>(null);
  const cols = [
    { heading: 'Product', links: ['Calendar', 'Analytics', 'AI Insights', 'Integrations'] },
    { heading: 'Company', links: ['About', 'Pricing', 'Changelog', 'Contact'] },
    { heading: 'Legal', links: ['Terms', 'Privacy', 'Security', 'DPA'] },
  ];

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-ft="col"]',
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.09, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={ref} className="pt-24 pb-12 bg-[#15140F] text-[#F6F2EA]">
      <div className="max-w-300 mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-16 pb-16 border-b border-[rgba(251,248,242,0.12)]">
          <div data-ft="col">
            <p className="font-medium text-[28px] tracking-[-0.03em] mb-4">Vielinks</p>
            <p className="text-[14px] leading-[1.6] max-w-[320px]" style={{ color: 'rgba(251,248,242,0.6)' }}>
              One workspace for your posts. Schedule, analyze, collaborate — across Instagram, LinkedIn, and Facebook.
            </p>
          </div>
          {cols.map(col => (
            <div key={col.heading} data-ft="col">
              <p className="text-[12px] font-medium uppercase tracking-[0.18em] mb-4" style={{ color: 'rgba(251,248,242,0.4)' }}>{col.heading}</p>
              <ul className="list-none flex flex-col gap-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-[14px] transition-colors duration-200 hover:text-[#F6F2EA]" style={{ color: 'rgba(251,248,242,0.7)' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-[12px]" style={{ color: 'rgba(251,248,242,0.4)' }}>
          <span>© 2026 Vielinks. Made for teams who post on purpose.</span>
          <span>v 2.0 · Rebrand draft</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  useSEO({
    title: 'Vielinks — One workspace for your posts',
    description: 'Manage Instagram, LinkedIn, and Facebook from one dashboard. Schedule posts, track analytics, and grow your audience with AI-powered insights.',
    keywords: 'social media management, post scheduler, social analytics, content calendar, Instagram, LinkedIn, Facebook',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Vielinks',
      applicationCategory: 'Social Networking Application',
      operatingSystem: 'Web',
      description: 'Social media management dashboard for managing multiple platforms from one place.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  });

  return (
    <div className="min-h-screen w-full bg-[#F6F2EA] text-[#15140F] overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <ProductPreview />
        <Features />
        <Pricing />
        <FAQ />
        <BigCTA />
      </main>
      <Footer />
    </div>
  );
}
