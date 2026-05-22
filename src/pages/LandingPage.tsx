import { useState, useEffect, useRef, useLayoutEffect, type ForwardRefExoticComponent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSEO } from '../hooks/useSEO';
import SiteNav from '../components/landing/SiteNav';
import ObsidianFooter from '../components/landing/ObsidianFooter';
import { ContainerScroll } from '../components/ui/container-scroll-animation';
import {
  LayoutGridIcon,
  SparklesIcon,
  ChartColumnIcon,
  ShareIcon,
  LoaderCircleIcon,
  LinkIcon,
} from '@animateicons/react/lucide';

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

// ─── SectionTitleLink ─────────────────────────────────────────────────────────

// Spring easing via CSS linear() — simulates a real spring without JS physics.
// Overshoots by ~0.7% at 61% progress then settles, giving the arrow a
// natural "alive" feel on a 4px translate without any bounce on opacity.
const ARROW_SPRING =
  'opacity 180ms ease, transform 420ms linear(0,0.006,0.025 2.8%,0.101 6.1%,0.539 18.9%,0.721 25%,0.849 31.1%,0.938 38.9%,0.968 44.4%,1.001 55.6%,1.007 61.1%,0.999 72.2%,1)';

function SectionTitleLink({ children, to, ariaLabel }: { children: React.ReactNode; to: string; ariaLabel: string }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#111827] mb-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E9F6E]/30 focus-visible:ring-offset-2"
    >
      {children}
      <svg
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-2.5 h-2.5 shrink-0 opacity-40 translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 group-focus-visible:opacity-100 group-focus-visible:translate-x-1"
        style={{ transition: prefersReducedMotion ? 'none' : ARROW_SPRING }}
        aria-hidden="true"
      >
        <line x1="1" y1="6" x2="11" y2="6" />
        <polyline points="6.5 1.5 11 6 6.5 10.5" />
      </svg>
    </Link>
  );
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PREVIEW_BARS = [32, 58, 41, 75, 53, 88, 67];
const PREVIEW_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      // Entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('[data-h="eyebrow"]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5  })
        .fromTo('[data-h="title"]',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6  }, '-=0.3')
        .fromTo('[data-h="sub"]',     { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5  }, '-=0.38')
        .fromTo('[data-h="ctas"]',    { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.3')
        .fromTo('[data-h="meta"]',    { opacity: 0 },         { opacity: 1,        duration: 0.35 }, '-=0.15')
        .fromTo('[data-h="strip"]',   { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.2');

      if (window.innerWidth > 768) {
        gsap.to('[data-h="inner"]', {
          opacity: 0,
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'center top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="min-h-screen flex items-center text-center">
      <div data-h="inner" className="w-full max-w-300 mx-auto px-6 pt-10 sm:px-8 sm:pt-16">
        <h1 data-h="title" className="text-3xl sm:text-5xl md:text-[clamp(44px,6.5vw,88px)] leading-[1.08] sm:leading-[1.03] tracking-[-0.03em] sm:tracking-[-0.04em] text-[#0F172A] max-w-225 mx-auto mb-4 sm:mb-5 font-medium">
          One workspace<br />for your <em className="not-italic text-[#111827]">posts.</em>
        </h1>
        <p data-h="sub" className="max-w-140 mx-auto mb-6 sm:mb-9 text-[14px] sm:text-[16px] leading-[1.65] text-[#64748B]">
          Schedule, analyze, and collaborate across Instagram, LinkedIn, and Facebook — without switching tabs.
        </p>
        <div data-h="ctas" className="flex gap-2 sm:gap-3 justify-center mb-4 sm:mb-5">
          <Link to="/register" className="inline-flex items-center gap-2 text-[14px] font-medium bg-[#111827] text-white px-5 py-2.5 rounded-xl hover:bg-[#0B1220] active:scale-[0.97] transition-[background-color,transform] duration-150">
            Start free <IconArrow className="w-3.5 h-3.5" />
          </Link>
          <a href="#features" className="inline-flex items-center gap-2 text-[14px] font-medium text-[#64748B] px-5 py-2.5 rounded-xl hover:bg-[#F1F5F9] hover:text-[#0F172A] active:scale-[0.97] transition-[background-color,color,transform] duration-150">
            See the product
          </a>
        </div>
        <p data-h="meta" className="text-[12px] text-[#94A3B8]">No card required · 14-day paid trial</p>

        <div data-h="strip" className="mt-14 flex flex-col items-center gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#94A3B8]">Works with</span>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#64748B]">
            <span className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-[#111827]">
              <IconInstagram className="w-4 h-4 text-[#94A3B8] transition-colors duration-200 group-hover:text-[#111827]" /> Instagram
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-[#D8D0C0] sm:block" />
            <span className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-[#111827]">
              <IconLinkedIn className="w-4 h-4 text-[#94A3B8] transition-colors duration-200 group-hover:text-[#111827]" /> LinkedIn
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-[#D8D0C0] sm:block" />
            <span className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-[#111827]">
              <IconFacebook className="w-4 h-4 text-[#94A3B8] transition-colors duration-200 group-hover:text-[#111827]" /> Facebook
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Product Preview ──────────────────────────────────────────────────────────

const CAL_EVENTS: Record<number, string[]> = {
  5:  ['#E1306C'],
  8:  ['#0A66C2'],
  12: ['#E1306C', '#1877F2'],
  15: ['#0A66C2'],
  19: ['#E1306C'],
  22: ['#1877F2'],
  26: ['#0A66C2', '#E1306C'],
  29: ['#1877F2'],
};

function DashboardContent() {
  return (
    <div className="p-3 md:p-4 flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between rounded-xl bg-[#F1F5F9] border border-[#0F172A]/8 px-3.5 py-2.5 shrink-0">
        <div>
          <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-[#111827] mb-0.5">Workspace overview</p>
          <p className="text-[12px] font-semibold tracking-tight text-[#0F172A]">Plan, publish, and measure today.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 shrink-0">
        {([
          { label: 'Total Reach', value: '2.4M', delta: '↑ 18.2%', positive: true,  type: 'bar',       bar: 72, barColor: '#047857' },
          { label: 'Engagement',  value: '342K', delta: '↑ 12.4%', positive: true,  type: 'bar',       bar: 58, barColor: '#111827' },
          { label: 'Scheduled',   value: '28',   delta: 'this week',positive: null,  type: 'dots'                                   },
          { label: 'Platforms',   value: '3',                                        type: 'platforms'                              },
        ] as Array<{label:string;value:string;delta?:string;positive?:boolean|null;type:string;bar?:number;barColor?:string}>).map(k => (
          <div key={k.label} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5">
            <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#64748B] mb-1.5">{k.label}</p>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-[16px] font-medium tracking-tight text-[#0F172A]">{k.value}</span>
              {k.delta && <span className={`text-[8.5px] font-semibold ${k.positive ? 'text-[#047857]' : 'text-[#64748B]'}`}>{k.delta}</span>}
            </div>
            {k.type === 'bar' && <div className="mt-2 h-[3px] w-full bg-[#CBD5E1] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${k.bar}%`, background: k.barColor }} /></div>}
            {k.type === 'dots' && <div className="mt-2 flex gap-1">{Array.from({ length: 5 }, (_, j) => <div key={j} className="h-[3px] flex-1 rounded-full" style={{ background: j < 4 ? '#111827' : '#CBD5E1' }} />)}</div>}
            {k.type === 'platforms' && <div className="mt-2 flex gap-1.5">{([{abbr:'IG',c:'#E1306C'},{abbr:'LI',c:'#0A66C2'},{abbr:'FB',c:'#1877F2'}] as Array<{abbr:string;c:string}>).map(p=><div key={p.abbr} className="w-5 h-5 rounded-md flex items-center justify-center text-[7.5px] font-bold" style={{background:p.c+'33',color:p.c}}>{p.abbr}</div>)}</div>}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-2.5 flex-1 min-h-0">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 flex flex-col gap-2.5 min-h-0">
          <div className="flex justify-between items-baseline shrink-0">
            <span className="text-[11px] font-medium text-[#0F172A]">Weekly engagement</span>
            <span className="text-[9.5px] text-[#64748B]">Last 7 days</span>
          </div>
          <div className="flex gap-1.5 flex-1 items-end min-h-0">
            {PREVIEW_BARS.map((h, i) => <div key={i} className="flex-1 flex flex-col justify-end h-full"><div className="bg-[#F4E0D6] rounded-t-sm w-full" style={{ height: `${h}%` }} /></div>)}
          </div>
          <div className="flex gap-1.5 shrink-0">
            {PREVIEW_DAYS.map((d, i) => <span key={i} className="flex-1 text-center text-[8.5px] font-medium text-[#94A3B8] uppercase">{d}</span>)}
          </div>
        </div>
        <div className="hidden lg:flex flex-col gap-2 min-h-0 overflow-auto">
          <p className="text-[10.5px] font-semibold text-[#0F172A] shrink-0">Upcoming</p>
          {([
            { p:'IG', c:'#E1306C', title:'Product launch',    time:'Today · 2PM',    s:'Pending'  },
            { p:'LI', c:'#0A66C2', title:'Q2 highlights',     time:'Tomorrow · 9AM', s:'Approved' },
            { p:'FB', c:'#1877F2', title:'Behind the scenes',  time:'Wed · 6PM',      s:'Draft'    },
          ] as Array<{p:string;c:string;title:string;time:string;s:string}>).map(post => (
            <div key={post.title} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2.5 py-2">
              <div className="flex items-center justify-between mb-1">
                <div className="w-4 h-4 rounded-[4px] flex items-center justify-center text-[7px] font-bold" style={{ background: post.c+'33', color: post.c }}>{post.p}</div>
                <span className="text-[7.5px] font-medium text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded-full">{post.s}</span>
              </div>
              <p className="text-[10.5px] font-medium text-[#0F172A] leading-tight">{post.title}</p>
              <p className="text-[8.5px] text-[#94A3B8] mt-0.5">{post.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CalendarContent() {
  const calCells = [...Array(4).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)];
  return (
    <div className="p-3 flex flex-col gap-2.5 h-full overflow-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button className="w-5 h-5 rounded-md bg-[#F1F5F9] flex items-center justify-center text-[#64748B] text-[10px]">‹</button>
          <span className="text-[11px] font-semibold text-[#0F172A] px-2">May 2025</span>
          <button className="w-5 h-5 rounded-md bg-[#F1F5F9] flex items-center justify-center text-[#64748B] text-[10px]">›</button>
        </div>
        <div className="flex rounded-lg overflow-hidden border border-[#E2E8F0]">
          {['Month', 'Week', 'List'].map((v, i) => (
            <span key={v} className={`text-[8.5px] font-medium px-2 py-1 ${i === 0 ? 'bg-[#0F172A] text-[#F8FAFC]' : 'text-[#64748B] bg-[#F8FAFC]'}`}>{v}</span>
          ))}
        </div>
      </div>
      <div className="flex gap-1.5">
        {([{label:'IG',c:'#E1306C'},{label:'LI',c:'#0A66C2'},{label:'FB',c:'#1877F2'}] as Array<{label:string;c:string}>).map(p => (
          <div key={p.label} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-medium border" style={{ borderColor: p.c+'40', color: p.c, background: p.c+'12' }}>
            <span className="w-1 h-1 rounded-full shrink-0" style={{ background: p.c }} />{p.label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} className="text-center text-[8px] font-semibold text-[#94A3B8] py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-[2px] flex-1">
        {calCells.map((day, i) => (
          <div key={i} className={`min-h-6 p-[3px] rounded-md flex flex-col ${day === 15 ? 'bg-[#F1F5F9]' : ''}`}>
            {day && <span className={`text-[8px] font-medium leading-none ${day === 15 ? 'text-[#111827]' : 'text-[#64748B]'}`}>{day}</span>}
            {day && CAL_EVENTS[day] && (
              <div className="flex gap-[2px] mt-[2px] flex-wrap">
                {CAL_EVENTS[day].map((c, j) => <div key={j} className="w-1 h-1 rounded-full" style={{ background: c }} />)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsContent() {
  return (
    <div className="p-3 flex flex-col gap-2.5 h-full overflow-auto">
      <div className="grid grid-cols-3 gap-2 shrink-0">
        {([
          { label: 'Total Reach', value: '2.4M', delta: '↑ 18.2%', c: '#047857' },
          { label: 'Engagements', value: '342K',  delta: '↑ 12.4%', c: '#111827' },
          { label: 'Avg Score',   value: '7.8',   delta: '↑ 0.4',   c: '#7C3AED' },
        ] as Array<{label:string;value:string;delta:string;c:string}>).map(k => (
          <div key={k.label} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2.5 py-2">
            <p className="text-[7.5px] font-bold uppercase tracking-[0.14em] text-[#64748B] mb-1">{k.label}</p>
            <p className="text-[14px] font-semibold text-[#0F172A] leading-none">{k.value}</p>
            <p className="text-[8px] font-semibold mt-1" style={{ color: k.c }}>{k.delta}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_90px] gap-2 flex-1 min-h-0">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 flex flex-col min-h-0">
          <div className="flex justify-between items-baseline mb-2 shrink-0">
            <span className="text-[10px] font-medium text-[#0F172A]">Reach over time</span>
            <span className="text-[8px] text-[#64748B]">30 days</span>
          </div>
          <svg className="flex-1 w-full" viewBox="0 0 200 70" preserveAspectRatio="none">
            <defs>
              <linearGradient id="anaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#111827" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#111827" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 55 C25 50,45 35,70 30 S100 18,125 16 S155 24,175 12 S190 6,200 5" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M0 55 C25 50,45 35,70 30 S100 18,125 16 S155 24,175 12 S190 6,200 5 L200 70 L0 70Z" fill="url(#anaGrad)" />
          </svg>
        </div>
        <div className="flex flex-col gap-1.5">
          {([
            { abbr:'IG', c:'#E1306C', pct:68, reach:'1.6M' },
            { abbr:'LI', c:'#0A66C2', pct:24, reach:'580K' },
            { abbr:'FB', c:'#1877F2', pct:8,  reach:'210K' },
          ] as Array<{abbr:string;c:string;pct:number;reach:string}>).map(p => (
            <div key={p.abbr} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2 flex-1">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-4 h-4 rounded-md flex items-center justify-center text-[6px] font-bold shrink-0" style={{ background: p.c+'22', color: p.c }}>{p.abbr}</div>
                <span className="text-[8px] font-semibold text-[#0F172A]">{p.reach}</span>
              </div>
              <div className="h-[2px] bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.c }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlatformsContent() {
  return (
    <div className="p-3 flex flex-col gap-2 h-full overflow-auto">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[11px] font-semibold text-[#0F172A]">Connected platforms</span>
        <span className="text-[8.5px] font-medium text-white bg-[#111827] px-2.5 py-1 rounded-lg">+ Connect</span>
      </div>
      {([
        { name:'acme_brand', platform:'Instagram', abbr:'IG', c:'#E1306C', type:'Business', followers:'12.4K' },
        { name:'Acme Corp',  platform:'LinkedIn',  abbr:'LI', c:'#0A66C2', type:'Company',  followers:'8.2K'  },
        { name:'Acme Brand', platform:'Facebook',  abbr:'FB', c:'#1877F2', type:'Page',     followers:'5.7K'  },
      ] as Array<{name:string;platform:string;abbr:string;c:string;type:string;followers:string}>).map(p => (
        <div key={p.platform} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[8px] font-black text-white shrink-0" style={{ background: p.c }}>{p.abbr}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[10.5px] font-semibold text-[#0F172A] truncate">{p.name}</p>
                <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{ background: p.c+'18', color: p.c }}>Connected</span>
              </div>
              <p className="text-[8px] text-[#64748B]">{p.platform} · {p.type} · {p.followers} followers</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <span className="text-[8px] text-[#64748B] font-medium border border-[#E2E8F0] rounded-lg px-2 py-0.5">Reconnect</span>
            <span className="text-[8px] text-[#111827] font-medium border border-[#E2E8F0] rounded-lg px-2 py-0.5">Disconnect</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AiInsightsContent() {
  const fields = [
    { label: 'Brand Persona',    value: 'A bold, modern brand that champions creativity for visual storytellers.' },
    { label: 'Brand Voice',      value: 'Conversational, inspiring, confident — never corporate or jargon-heavy.' },
    { label: 'Target Audience',  value: 'Creative professionals, 25-40, primarily Instagram and LinkedIn.' },
    { label: 'Content Pillars',  value: 'Education · Inspiration · Behind-the-scenes · Product showcases' },
  ];
  return (
    <div className="p-3 flex flex-col gap-2 h-full overflow-auto">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[11px] font-semibold text-[#0F172A]">AI Configuration</span>
        <span className="text-[8.5px] font-medium text-[#047857] bg-[#047857]/10 px-2 py-0.5 rounded-full">Ready</span>
      </div>
      {fields.map(f => (
        <div key={f.label} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5">
          <p className="text-[7.5px] font-bold uppercase tracking-[0.14em] text-[#111827] mb-1">{f.label}</p>
          <p className="text-[9.5px] text-[#334155] leading-relaxed">{f.value}</p>
        </div>
      ))}
    </div>
  );
}

const URL_MAP: Record<string, string> = {
  Dashboard:    'app.vielinks.com/dashboard',
  Calendar:     'app.vielinks.com/calendar',
  Analytics:    'app.vielinks.com/analytics',
  Platforms:    'app.vielinks.com/platforms',
  'AI Insights':'app.vielinks.com/ai-insights',
};

function ProductPreview() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const navItems = [
    { icon: <IconDashboard className="w-3.5 h-3.5" />, label: 'Dashboard'  },
    { icon: <IconCalendar  className="w-3.5 h-3.5" />, label: 'Calendar'   },
    { icon: <IconAnalytics className="w-3.5 h-3.5" />, label: 'Analytics'  },
    { icon: <IconHub       className="w-3.5 h-3.5" />, label: 'Platforms'  },
    { icon: <IconSparkle   className="w-3.5 h-3.5" />, label: 'AI Insights'},
  ];

  const titleComponent = (
    <div className="max-w-2xl mx-auto px-4">
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#111827] mb-4 inline-block">
        Live preview
      </span>
      <h2 className="text-[clamp(28px,4.5vw,52px)] leading-[1.1] tracking-[-0.04em] font-medium text-[#0F172A] mb-4">
        Your workspace,<br />
        <em className="not-italic text-[#111827]">at a glance.</em>
      </h2>
      <p className="text-[16px] leading-[1.65] text-[#64748B]">
        Real metrics, real scheduling, real analytics — all in one clean interface.
      </p>
    </div>
  );

  const appShell = (
    <div className="h-full flex flex-col bg-[#FFFFFF] overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F1F5F9] shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] opacity-50" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] opacity-50" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] opacity-50" />
        <span className="ml-3 font-mono text-[11px] text-[#64748B]">{URL_MAP[activeTab]}</span>
      </div>

      {/* App layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — desktop only */}
        <div className="hidden md:flex flex-col w-44 shrink-0 border-r border-[#E2E8F0] bg-[#F8FAFC] p-3 gap-1">
          <div className="flex items-center gap-2 px-2.5 pb-2.5 mb-1.5 border-b border-[#E2E8F0]">
            <div className="w-5 h-5 rounded-md bg-[#111827] flex items-center justify-center shrink-0">
              <span className="text-white text-[9px] font-black">V</span>
            </div>
            <span className="text-[12px] font-bold tracking-tight text-[#0F172A]">Vielinks</span>
          </div>
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`flex items-center gap-2.5 px-2.5 py-2 text-[11.5px] rounded-[9px] text-left w-full transition-colors ${
                activeTab === item.label
                  ? 'bg-[#F1F5F9] text-[#0F172A] font-medium'
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="h-full"
            >
              {activeTab === 'Dashboard'   && <DashboardContent />}
              {activeTab === 'Calendar'    && <CalendarContent />}
              {activeTab === 'Analytics'   && <AnalyticsContent />}
              {activeTab === 'Platforms'   && <PlatformsContent />}
              {activeTab === 'AI Insights' && <AiInsightsContent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  /* ── Mobile: static card, zero scroll hooks ── */
  if (isMobile) {
    return (
      <section className="py-16 px-4">
        <div className="text-center mb-8">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#111827] mb-4 inline-block">
            Live preview
          </span>
          <h2 className="text-[clamp(28px,8vw,40px)] leading-[1.1] tracking-[-0.04em] font-medium text-[#0F172A] mb-4">
            Your workspace,<br />
            <em className="not-italic text-[#111827]">at a glance.</em>
          </h2>
          <p className="text-[15px] leading-[1.65] text-[#64748B]">
            Real metrics, real scheduling, real analytics — all in one clean interface.
          </p>
        </div>
        <div className="border-4 border-[#2A2825] rounded-3xl bg-[#0F172A] p-2 overflow-hidden">
          <div className="rounded-2xl bg-[#FFFFFF] overflow-hidden" style={{ height: '420px' }}>
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F1F5F9]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] opacity-50" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] opacity-50" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] opacity-50" />
              <span className="ml-3 font-mono text-[11px] text-[#64748B]">app.vielinks.com/dashboard</span>
            </div>
            <div className="h-[calc(100%-41px)] overflow-hidden">
              <DashboardContent />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── Desktop: full scroll animation ── */
  return (
    <ContainerScroll titleComponent={titleComponent}>
      {appShell}
    </ContainerScroll>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────

type FeatureIconHandle = { startAnimation: () => void; stopAnimation: () => void };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FeatureItem = { Icon: ForwardRefExoticComponent<any>; title: string; body: string; route?: string | null };

function FeatureCard({ feature }: { feature: FeatureItem }) {
  const [hovered, setHovered] = useState(false);
  const iconRef = useRef<FeatureIconHandle>(null);
  const { Icon, title, body, route } = feature;

  useEffect(() => {
    if (hovered) iconRef.current?.startAnimation();
    else iconRef.current?.stopAnimation();
  }, [hovered]);

  return (
    <div
      data-f="card"
      className="group bg-[#F8FAFC] p-8 flex flex-col gap-3 transition-colors duration-200 ease-out hover:bg-[#111827]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-[#F1F5F9] text-[#0F172A] mb-2 transition-colors duration-200 ease-out group-hover:bg-white/15 group-hover:text-white">
        <Icon ref={iconRef} size={18} />
      </div>
      <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[#0F172A] transition-colors duration-200 ease-out group-hover:text-white">
        {title}
      </h3>
      <p className="text-[14px] leading-[1.6] text-[#64748B] transition-colors duration-200 ease-out group-hover:text-[#F8FAFC]">
        {body}
      </p>
      {route && (
        <Link
          to={route}
          onClick={e => e.stopPropagation()}
          className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium tracking-wide text-[#94A3B8] transition-[color,opacity,transform] duration-150 ease-out group-hover:text-white/50 hover:text-white/80! active:scale-[0.96] active:opacity-70 w-fit"
        >
          Learn more
          <IconArrow className="w-2.5 h-2.5" />
        </Link>
      )}
    </div>
  );
}

function Features() {
  const ref = useRef<HTMLElement>(null);
  const featureItems: FeatureItem[] = [
    { Icon: LayoutGridIcon,   title: 'Calendar that just plans', body: 'Drag posts between days. See the whole month in one view. Every platform on one timeline, color-coded but quiet.', route: '/planner' },
    { Icon: SparklesIcon,     title: 'AI that drafts captions',  body: "Stuck on a caption? Drop in the image and a brief, get three options in your tone. Edit, post, move on.", route: '/ai-studio' },
    { Icon: ChartColumnIcon,  title: 'Numbers, not dashboards',  body: "What got reach, when. What got engagement, why. Per platform, per post, per week. No vanity metrics.", route: '/insights' },
    { Icon: ShareIcon,        title: 'Three platforms, one tab', body: 'Instagram, LinkedIn, Facebook. Connect once, post everywhere, with previews that show what each network will actually render.', route: '/connections' },
    { Icon: LoaderCircleIcon, title: 'Approval queues',          body: 'A reviewer, a clock, a green checkmark. Drafts route to whoever needs to see them before they go out.', route: '/planner' },
    { Icon: LinkIcon,         title: 'Link in bio, but quiet',   body: "A small, hosted page you can update from the same workspace. No third-party tools, no extra subscriptions.", route: null },
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
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: st }
      );
      gsap.fromTo('[data-f="card"]',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { ...st, start: 'top 72%' } }
      );

      if (innerEl) {
        gsap.to(innerEl, {
          opacity: 0,
          y: -32,
          filter: 'blur(2px)',
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
          <SectionTitleLink to="/overview" ariaLabel="View workspace details">The workspace</SectionTitleLink>
          <h2 className="text-[clamp(32px,4.5vw,52px)] leading-[1.1] tracking-[-0.035em] mb-3 max-w-180 font-medium text-[#0F172A]">
            A tool that <em className="not-italic text-[#111827]">respects</em> your week.
          </h2>
          <p className="text-[16px] leading-[1.65] text-[#64748B] max-w-140 mb-12">
            Fewer dashboards, fewer features that don't matter, fewer popups. The list, the calendar, the numbers, the AI when you want it.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
          {featureItems.map(f => <FeatureCard key={f.title} feature={f} />)}
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
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: st }
      );
      gsap.fromTo('[data-pr="card"]',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { ...st, start: 'top 72%' } }
      );

      if (innerEl) {
        gsap.to(innerEl, {
          opacity: 0,
          y: -32,
          filter: 'blur(2px)',
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
    <section ref={ref} id="pricing" className="py-24 bg-[#FFFFFF]">
      <div data-pr="inner" className="max-w-300 mx-auto px-8">
        <div data-pr="head">
          <SectionTitleLink to="/pricing" ariaLabel="View pricing details">Pricing</SectionTitleLink>
          <h2 className="text-[clamp(32px,4.5vw,52px)] leading-[1.1] tracking-[-0.035em] mb-3 max-w-180 font-medium text-[#0F172A]">
            Three plans. <em className="not-italic text-[#111827]">No surprises.</em>
          </h2>
          <p className="text-[16px] leading-[1.65] text-[#64748B] max-w-140 mb-12">
            A free tier that's actually useful, a paid tier priced for working teams, and a studio tier for agencies. No "contact sales" until the studio plan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(p => (
            <div
              key={p.name}
              data-pr="card"
              className={`group rounded-2xl p-8 flex flex-col gap-4 border transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-1 ${p.featured ? 'bg-[#0F172A] border-[#0F172A] hover:border-[#111827] hover:shadow-[0_20px_50px_rgba(14,159,110,0.20)]' : 'bg-[#F8FAFC] border-border hover:border-[#111827] hover:bg-[#FFFFFF] hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]'}`}
            >
              <div className="text-[22px] font-medium tracking-[-0.02em]" style={{ color: p.featured ? '#F8FAFC' : '#0F172A' }}>{p.name}</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[56px] font-medium tracking-[-0.04em] leading-none" style={{ color: p.featured ? '#F8FAFC' : '#0F172A' }}>${p.price}</span>
                <span className="text-[13px]" style={{ color: p.featured ? 'rgba(255,255,255,0.6)' : '#64748B' }}>{p.unit}</span>
              </div>
              <p className="text-[14px] leading-normal" style={{ color: p.featured ? 'rgba(255,255,255,0.7)' : '#64748B' }}>{p.desc}</p>
              <ul className="list-none flex flex-col gap-2 my-2">
                {p.items.map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-[14px]" style={{ color: p.featured ? 'rgba(255,255,255,0.85)' : '#334155' }}>
                    <span className="w-1 h-1 rounded-full bg-current opacity-40 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-auto w-full inline-flex justify-center items-center text-[14px] font-medium px-4.5 py-2.5 rounded-[10px] transition-[background-color,color,transform] duration-150 active:scale-[0.97] group-hover:-translate-y-0.5"
                style={p.featured ? { background: '#FFFFFF', color: '#0F172A' } : { background: '#0F172A', color: '#F8FAFC' }}>
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
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', scrollTrigger: st }
      );
      gsap.fromTo('[data-faq="item"]',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out',
          scrollTrigger: { ...st, start: 'top 75%' } }
      );

      if (innerEl) {
        gsap.to(innerEl, {
          opacity: 0,
          y: -32,
          filter: 'blur(2px)',
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
          <SectionTitleLink to="/faq" ariaLabel="View frequently asked questions">Questions</SectionTitleLink>
          <h2 className="text-[clamp(32px,4.5vw,52px)] leading-[1.1] tracking-[-0.035em] mb-12 max-w-180 font-medium text-[#0F172A]">
            Answered, <em className="not-italic text-[#111827]">without the fluff.</em>
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
              <div className="flex justify-between items-center text-[17px] font-medium text-[#0F172A]">
                {item.q}
                <IconChevron className={`w-4 h-4 shrink-0 ml-4 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </div>
              <div
                className="overflow-hidden transition-[max-height,padding-top] duration-300 text-[15px] leading-[1.65] text-[#64748B]"
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
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
        }
      );

      if (innerEl) {
        gsap.to(innerEl, {
          opacity: 0,
          y: -32,
          filter: 'blur(2px)',
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
        <div data-cta="box" className="bg-[#0F172A] text-[#F8FAFC] rounded-3xl px-8 md:px-16 py-20 text-center">
          <h2 className="text-[clamp(36px,5.5vw,64px)] leading-[1.05] tracking-[-0.04em] mb-5 font-medium">
            Start the <em className="not-italic text-[#0E9F6E]">quiet</em> way.
          </h2>
          <p className="text-[16px] max-w-120 mx-auto mb-7" style={{ color: 'rgba(255,255,255,0.7)' }}>
            One workspace, three networks, fourteen days free. Cancel with one click.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              aria-label="Start free trial"
              className="group inline-flex w-full sm:w-auto min-w-40 items-center justify-center gap-2 rounded-xl bg-[#FFFFFF] px-6 py-3.5 text-[15px] font-medium text-[#0F172A] transition-colors duration-200 hover:bg-[#F1F5F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F8FAFC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
            >
              Start free <IconArrow className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex w-full sm:w-auto min-w-40 items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.18)] px-6 py-3.5 text-[15px] font-medium transition-all duration-200 hover:bg-[rgba(255,255,255,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F8FAFC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              See pricing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


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
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden">
      <SiteNav />
      <main>
        <Hero />
        <ProductPreview />
        <Features />
        <div className="h-20 bg-linear-to-b from-[#F8FAFC] to-[#FFFFFF]" />
        <Pricing />
        <div className="h-20 bg-linear-to-b from-[#FFFFFF] to-[#F8FAFC]" />
        <FAQ />
        <BigCTA />
      </main>
      <ObsidianFooter />
    </div>
  );
}
