import { useState, useEffect, useRef, useLayoutEffect, type ForwardRefExoticComponent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSEO } from '../hooks/useSEO';
import { scrollToId } from '../components/landing/SiteNav';
import PublicShell from '../components/landing/PublicShell';
import { ContainerScroll } from '../components/ui/container-scroll-animation';
import { AuroraBackground } from '../components/ui/aurora-background';
import { ScrollLegend } from '../components/ui/scroll-legend';
import SmoothScrollSections from '../components/ui/smooth-scroll';
import { CalendarSection, PostsSection, DashboardSection, ConfigureSection, InsightsSection } from '../components/ui/dash-sections';
import {
  LayoutListIcon,
  CircleCheckIcon,
  SendIcon,
  TrendingUpIcon,
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

const IconCalSm = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="1" y="2.5" width="12" height="10" rx="2" /><path d="M1 6h12" /><path d="M4.5 1v3" /><path d="M9.5 1v3" />
  </svg>
);
const IconClockSm = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="7" cy="7" r="6" /><path d="M7 4v3l2 2" />
  </svg>
);
const IconLayersSm = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M7 1l6 3-6 3-6-3z" /><path d="M1 7l6 3 6-3" /><path d="M1 10l6 3 6-3" />
  </svg>
);
const IconCheckSm = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M2 7l4 4 6-6" />
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

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const ref = useRef<HTMLElement>(null);

  return (
    <AuroraBackground className="min-h-[100svh] bg-white px-6 pt-28 pb-16 sm:px-8 sm:pt-32">
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
      >
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#64748B]">
          Social publishing workspace
        </p>
        <h1 className="max-w-4xl text-[clamp(56px,10vw,132px)] font-medium leading-[0.92] tracking-[-0.055em] text-[#0F172A]">
          Vielinks.
        </h1>
        <p className="mt-7 max-w-2xl text-[16px] leading-[1.75] text-[#475569] sm:text-[18px]">
          Plan, approve, publish, and measure posts for Instagram, LinkedIn, and Facebook from one quiet workspace.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex min-h-11 min-w-36 items-center justify-center rounded-md bg-[#111827] px-5 text-[14px] font-medium text-white transition-[background-color,transform] duration-150 hover:bg-[#0B1220] active:scale-[0.98]"
          >
            Start free
          </Link>
          <button
            type="button"
            onClick={() => scrollToId('features')}
            className="inline-flex min-h-11 min-w-36 items-center justify-center rounded-md border border-[#CBD5E1] bg-white/70 px-5 text-[14px] font-medium text-[#334155] transition-[background-color,border-color,transform] duration-150 hover:border-[#94A3B8] hover:bg-white active:scale-[0.98]"
          >
            View product
          </button>
        </div>
        <ProductPreview />
      </motion.section>
    </AuroraBackground>
  );

  return (
    <section ref={ref} className="min-h-screen flex items-center pt-24 pb-18 sm:pt-28 sm:pb-24">
      <div data-h="inner" className="grid w-full max-w-310 mx-auto items-center gap-12 px-6 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,560px)] lg:gap-16 xl:gap-20">
        <div className="text-center sm:text-left">

          <h1 data-h="title" className="mx-auto mb-5 max-w-130 text-[44px] font-medium leading-[1.04] tracking-normal text-[#0F172A] sm:mx-0 sm:max-w-165 sm:text-[64px] sm:leading-[1.02] md:text-[76px] xl:text-[86px]">
            A cleaner way to run <span className="text-[#0E9F6E]">every post.</span>
          </h1>

          <p data-h="sub" className="mx-auto mb-4 max-w-118 text-[15px] leading-[1.7] text-[#64748B] sm:mx-0 sm:text-[16px]">
            Vielinks keeps your calendar, approvals, captions, and analytics in one calm workspace for Instagram, LinkedIn, and Facebook.
          </p>

          {/* Social proof */}
          <div data-h="proof" className="mb-7 flex items-center justify-center gap-2.5 sm:justify-start sm:mb-9">
            <div className="flex -space-x-1.5">
              {[
                { bg: '#6366F1', init: 'M' },
                { bg: '#EC4899', init: 'S' },
                { bg: '#F59E0B', init: 'K' },
                { bg: '#10B981', init: 'J' },
                { bg: '#3B82F6', init: 'A' },
              ].map(({ bg, init }) => (
                <div key={init} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white" style={{ background: bg }}>
                  {init}
                </div>
              ))}
            </div>
            <span className="text-[13px] text-[#64748B]">
              Calendar, approvals, publishing, analytics
            </span>
          </div>

          {/* CTAs */}
          <div data-h="ctas" className="mb-4 flex flex-wrap justify-center gap-2 sm:justify-start sm:gap-3">
            <Link
              to="/register"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#111827] to-[#0a2a1a] px-5 text-[14px] font-medium text-white shadow-[0_2px_12px_rgba(15,23,42,0.22)] transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.97]"
            >
              Start free <IconArrow className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => scrollToId('features')}
              className="hidden min-h-11 items-center justify-center rounded-xl border border-[#CBD5E1] px-5 text-[14px] font-medium text-[#64748B] transition-[background-color,color,border-color,transform] duration-150 hover:border-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A] active:scale-[0.97] lg:inline-flex"
            >
              See the product
            </button>
          </div>

          <p data-h="meta" className="text-[12px] text-[#94A3B8]">No card required · 14-day free trial</p>

          {/* Stats strip — 4 items */}
          <div data-h="strip" className="mx-auto mt-9 grid max-w-96 grid-cols-4 overflow-hidden rounded-2xl border border-[#0F172A]/10 bg-white text-left shadow-[0_1px_0_rgba(15,23,42,0.04)] sm:mx-0 sm:mt-12">
            {[
              { value: '3', label: 'channels',   Icon: IconCalSm   },
              { value: '14', label: 'trial days', Icon: IconClockSm },
              { value: '1', label: 'workspace',   Icon: IconLayersSm },
              { value: 'Free', label: 'to start', Icon: IconCheckSm },
            ].map(({ value, label, Icon }) => (
              <div key={label} className="border-r border-[#0F172A]/8 px-3 py-3 last:border-r-0">
                <Icon className="mb-1.5 h-3 w-3 text-[#94A3B8]" />
                <strong className="block text-[16px] font-medium leading-none text-[#0F172A]">{value}</strong>
                <span className="mt-1 block text-[10px] text-[#64748B]">{label}</span>
              </div>
            ))}
          </div>

          {/* Works with */}
          <div data-h="logos" className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start sm:mt-6">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#94A3B8]">Works with</span>
            <span className="text-[#94A3B8]">·</span>
            {['Instagram', 'LinkedIn', 'Facebook'].map((name, i, arr) => (
              <span key={name} className="text-[12px] font-medium text-[#64748B]">
                {name}{i < arr.length - 1 ? <span className="ml-2 text-[#94A3B8]">·</span> : null}
              </span>
            ))}
          </div>
        </div>

        <div id="product" data-h="preview" className="flex justify-center lg:justify-end">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}

// ─── Post Composer Preview ────────────────────────────────────────────────────

const COMPOSER_POSTS = [
  {
    platform: 'Instagram',
    color: '#E1306C',
    caption: 'Plan content in one calendar before it goes live.',
    day: 'Calendar',
    time: 'Planning',
    status: 'Scheduled',
  },
  {
    platform: 'LinkedIn',
    color: '#0A66C2',
    caption: 'Review drafts with your team before publishing.',
    day: 'Approval',
    time: 'Review',
    status: 'Needs approval',
  },
  {
    platform: 'Facebook',
    color: '#1877F2',
    caption: 'Publish and measure posts across connected channels.',
    day: 'Publishing',
    time: 'Analytics',
    status: 'Draft',
  },
] as const;

const STATUS_STYLES = {
  'Scheduled':     'bg-[#F1F5F9] text-[#334155]',
  'Needs approval':'bg-[#FEF3C7] text-[#92400E]',
  'Draft':         'bg-[#F8FAFC] text-[#64748B]',
} as const;

const HERO_FEATURES = [
  { name: 'Calendar',   Icon: LayoutListIcon,  body: 'Plan posts before the week fills up.'     },
  { name: 'Approval',   Icon: CircleCheckIcon, body: 'Review drafts before anything goes live.' },
  { name: 'Publishing', Icon: SendIcon,        body: 'Send content to the connected channels.'  },
  { name: 'Analytics',  Icon: TrendingUpIcon,  body: 'Read post performance in context.'        },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HeroFeatureCard({ name, Icon, body }: { name: string; Icon: ForwardRefExoticComponent<any>; body: string }) {
  const iconRef = useRef<FeatureIconHandle>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) iconRef.current?.startAnimation();
    else iconRef.current?.stopAnimation();
  }, [hovered]);

  return (
    <div
      className="group bg-[#F8FAFC] p-6 flex flex-col gap-3 transition-colors duration-200 ease-out hover:bg-[#111827]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-[#F1F5F9] text-[#0F172A] mb-1 transition-colors duration-200 ease-out group-hover:bg-white/15 group-hover:text-white">
        <Icon ref={iconRef} size={18} />
      </div>
      <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[#0F172A] transition-colors duration-200 ease-out group-hover:text-white">
        {name}
      </h3>
      <p className="text-[13px] leading-[1.6] text-[#64748B] transition-colors duration-200 ease-out group-hover:text-[#F8FAFC]">
        {body}
      </p>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="mt-12 w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#E2E8F0] border border-[#E2E8F0] rounded-2xl overflow-hidden text-left">
      {HERO_FEATURES.map(f => <HeroFeatureCard key={f.name} {...f} />)}
    </div>
  );

  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState(0);
  const [visible, setVisible] = useState(true);

  const post = COMPOSER_POSTS[active];

  useEffect(() => { setTyped(0); }, [active]);

  useEffect(() => {
    if (typed >= post.caption.length) return;
    const t = setTimeout(() => setTyped(n => n + 1), 26);
    return () => clearTimeout(t);
  }, [typed, post.caption.length]);

  useEffect(() => {
    let nextTimer: ReturnType<typeof setTimeout>;
    const hideTimer = setTimeout(() => {
      setVisible(false);
      nextTimer = setTimeout(() => {
        setActive(a => (a + 1) % COMPOSER_POSTS.length);
        setVisible(true);
      }, 350);
    }, 5200);
    return () => { clearTimeout(hideTimer); clearTimeout(nextTimer); };
  }, [active]);

  return (
    <div className="relative w-full max-w-130">
      {/* Floating metric */}
      <div
        data-h="floating"
        className="absolute -top-3 right-3 z-10 rounded-2xl border border-[#0F172A]/10 bg-white px-3.5 py-2.5 shadow-[0_8px_28px_rgba(17,24,39,0.14)] sm:-right-4"
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#94A3B8]">This week</p>
        <p className="mt-0.5 text-[13px] font-semibold text-[#0F172A]">
          Plan · approve · publish
        </p>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-3xl border border-[#111827]/12 bg-white shadow-[0_40px_100px_rgba(17,24,39,0.16),0_8px_32px_rgba(17,24,39,0.08)] ring-1 ring-[#111827]/6"
        aria-label="Vielinks post composer"
      >
        {/* Accent bar — transitions color with platform */}
        <div
          className="h-1.5 w-full transition-[background-color] duration-500"
          style={{ background: post.color }}
        />

        <div className="p-5 lg:p-6">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[10px] font-bold text-white">J</div>
              <span className="text-[13px] font-medium text-[#0F172A]">Jul's workspace</span>
            </div>
            <div className="flex items-center gap-1.5">
              {COMPOSER_POSTS.map((p, i) => (
                <div
                  key={p.platform}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: i === active ? '18px' : '6px', background: i === active ? post.color : '#E2E8F0' }}
                />
              ))}
            </div>
          </div>

          {/* Animated content block */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            {/* Platform + AI label */}
            <div className="mb-3 flex items-center gap-2">
              <span
                className="rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em]"
                style={{ borderColor: `${post.color}35`, background: `${post.color}0D`, color: post.color }}
              >
                {post.platform}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                  <path d="M6 1l1.2 3.5H11L8.1 6.6l1.1 3.4L6 8.2l-3.2 1.8 1.1-3.4L1 4.5h3.8z" />
                </svg>
                AI draft
              </span>
            </div>

            {/* Image placeholder */}
            <div
              className="mb-4 flex h-28 w-full items-center justify-center rounded-2xl transition-[background-color,border-color] duration-500"
              style={{ background: `${post.color}0C`, border: `1px solid ${post.color}22` }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9 transition-[color] duration-500" style={{ color: `${post.color}55` }}>
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>

            {/* Caption with typing cursor */}
            <div className="mb-4 min-h-[76px] rounded-2xl border border-[#0F172A]/8 bg-[#F8FAFC] px-4 py-3">
              <p className="text-[13px] leading-[1.65] text-[#334155]">
                {post.caption.slice(0, typed)}
                {typed < post.caption.length && (
                  <span className="ml-px inline-block h-[14px] w-[2px] translate-y-[2px] animate-pulse rounded-sm bg-[#0E9F6E]" />
                )}
              </p>
            </div>

            {/* Schedule row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
                <IconClockSm className="h-3.5 w-3.5 text-[#94A3B8]" />
                {post.day} · {post.time}
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[post.status]}`}>
                {post.status}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-[#0F172A]/6 bg-[#F8FAFC] px-5 py-3 lg:px-6">
          <div className="flex items-center gap-1.5 text-[12px] text-[#94A3B8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0E9F6E]" />
            3 accounts connected
          </div>
          <div
            className="rounded-xl px-3.5 py-1.5 text-[12px] font-medium text-white transition-[background-color] duration-500"
            style={{ background: post.color }}
          >
            Schedule →
          </div>
        </div>
      </div>
    </div>
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
            <button
              onClick={() => scrollToId('pricing')}
              className="inline-flex w-full sm:w-auto min-w-40 items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.18)] px-6 py-3.5 text-[15px] font-medium transition-all duration-200 hover:bg-[rgba(255,255,255,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F8FAFC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              See pricing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


// ─── Dashboard Preview (static) ───────────────────────────────────────────────

type DashSection = 'dashboard' | 'posts' | 'calendar' | 'insights' | 'configure';
const SECTION_TITLE: Record<DashSection, string> = { dashboard: 'Home', posts: 'Posts', calendar: 'Calendar', insights: 'Insights', configure: 'Configure' };

function DashboardPreview() {
  const [active, setActive] = useState<DashSection>('dashboard');

  const SBtn = ({ id, icon, label, sub }: { id: DashSection; icon: string; label: string; sub?: boolean }) => (
    <button onClick={() => setActive(id)} className={`w-full flex items-center gap-2 rounded-lg text-left transition-colors duration-150 ${sub ? 'px-3 py-1 ml-5' : 'px-3 py-1.5'} ${active === id ? 'bg-[#F1F5F9]' : 'hover:bg-[#F8FAFC]'}`}>
      <span className={`material-symbols-outlined ${active === id ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`} style={{ fontSize: sub ? 12 : 15 }}>{icon}</span>
      <span className={`${sub ? 'text-[10px]' : 'text-[11px] font-medium'} ${active === id ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>{label}</span>
    </button>
  );

  return (
    <div className="h-full w-full flex overflow-hidden bg-[#F8FAFC] select-none text-[#0F172A]">

      {/* ── Sidebar ── */}
      <aside className="flex flex-col w-36 shrink-0 border-r border-[#0F172A]/8 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-[#0F172A]/8">
          <span className="font-bold text-[13px] tracking-[-0.02em]">Vielinks</span>
        </div>
        <div className="px-3 py-2 border-b border-[#0F172A]/8">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#F8FAFC]">
            <div className="w-5 h-5 rounded-md bg-[#0F172A] flex items-center justify-center shrink-0">
              <span className="text-white font-bold" style={{ fontSize: 9 }}>P</span>
            </div>
            <span className="text-[11px] font-medium truncate">prueba</span>
          </div>
        </div>
        <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-hidden">
          <SBtn id="dashboard" icon="dashboard"      label="Dashboard" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg pointer-events-none">
            <span className="material-symbols-outlined text-[#94A3B8]" style={{ fontSize: 15 }}>edit_note</span>
            <span className="text-[11px] font-medium text-[#94A3B8]">Publish</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <SBtn id="posts"    icon="article"        label="Posts"    sub />
            <SBtn id="calendar" icon="calendar_month" label="Calendar" sub />
          </div>
          <SBtn id="insights"  icon="monitoring" label="Insights"  />
          <SBtn id="configure" icon="settings"   label="Configure" />
        </nav>
        <div className="px-3 py-2.5 border-t border-[#0F172A]/8 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#0F172A] flex items-center justify-center shrink-0">
            <span className="text-white font-bold" style={{ fontSize: 7 }}>JM</span>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold truncate">Julian Mendez</p>
            <p className="text-[8px] text-[#94A3B8] uppercase tracking-wide">Starter Plan</p>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#0F172A]/8 bg-white shrink-0 pointer-events-none">
          <span className="font-bold text-[13px] tracking-[-0.01em]">{SECTION_TITLE[active]}</span>
          <span className="material-symbols-outlined text-[#94A3B8]" style={{ fontSize: 18 }}>notifications</span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {active === 'dashboard' && <DashboardSection />}
          {active === 'posts'     && <PostsSection />}
          {active === 'calendar'  && <CalendarSection />}
          {active === 'insights'  && <InsightsSection />}
          {active === 'configure' && <ConfigureSection />}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  useSEO({
    title: 'Vielinks — Plan, approve, and publish posts',
    description: 'Plan, approve, publish, and measure Instagram, LinkedIn, and Facebook posts from one clean workspace.',
    keywords: 'social media management, post scheduler, social analytics, content calendar, Instagram, LinkedIn, Facebook',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Vielinks',
      applicationCategory: 'Social Networking Application',
      operatingSystem: 'Web',
      description: 'Workspace for planning, approving, publishing, and measuring social posts across Instagram, LinkedIn, and Facebook.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  });

  return (
    <PublicShell>
      <ScrollLegend
        items={[
          { id: 'how-it-works',  name: 'How it works'  },
          { id: 'the-workspace', name: 'The workspace' },
          { id: 'features',      name: 'Features'      },
          { id: 'pricing',       name: 'Pricing'       },
          { id: 'faq',           name: 'FAQ'            },
        ]}
      />
      <main>
        <Hero />
        <SmoothScrollSections />
        <div className="h-24 bg-linear-to-b from-[#FFFFFF] to-[#F8FAFC]" />
        <section id="the-workspace">
        <ContainerScroll
          titleComponent={
            <div className="text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#64748B] mb-4">The workspace</p>
              <h2 className="text-[clamp(28px,4vw,52px)] leading-[1.08] tracking-[-0.035em] font-medium text-[#0F172A] mb-4">
                Every post.<br />
                <em className="not-italic text-[#64748B] font-normal">One workspace.</em>
              </h2>
              <p className="text-[15px] leading-[1.65] text-[#64748B] max-w-lg mx-auto">
                Plan the week, review what is ready, and publish across three platforms without switching tabs.
              </p>
            </div>
          }
        >
          <DashboardPreview />
        </ContainerScroll>
        </section>
        <Features />
        <div className="h-20 bg-linear-to-b from-[#F8FAFC] to-[#FFFFFF]" />
        <Pricing />
        <div className="h-20 bg-linear-to-b from-[#FFFFFF] to-[#F8FAFC]" />
        <FAQ />
        <BigCTA />
      </main>
    </PublicShell>
  );
}
