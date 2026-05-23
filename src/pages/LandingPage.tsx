import { useState, useEffect, useRef, useLayoutEffect, type ForwardRefExoticComponent } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSEO } from '../hooks/useSEO';
import SiteNav from '../components/landing/SiteNav';
import ObsidianFooter from '../components/landing/ObsidianFooter';
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
        .fromTo('[data-h="strip"]',   { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.2')
        .fromTo('[data-h="preview"]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.36');

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
    <section ref={ref} className="min-h-screen flex items-center pt-24 pb-18 sm:pt-28 sm:pb-24">
      <div data-h="inner" className="grid w-full max-w-300 mx-auto items-center gap-12 px-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(390px,520px)] lg:gap-16 xl:gap-20">
        <div className="text-center sm:text-left">
          <h1 data-h="title" className="mx-auto mb-5 max-w-120 text-[44px] font-medium leading-[1.04] tracking-normal text-[#0F172A] sm:mx-0 sm:max-w-150 sm:text-[64px] sm:leading-[1.02] md:text-[78px] xl:text-[88px]">
            Plan, approve, publish.
          </h1>
          <p data-h="sub" className="mx-auto mb-7 max-w-112 text-[15px] leading-[1.7] text-[#64748B] sm:mx-0 sm:mb-9 sm:text-[16px]">
            Plan social posts across three channels.
          </p>
          <div data-h="ctas" className="mb-4 flex flex-wrap justify-center gap-2 sm:justify-start sm:gap-3">
            <Link to="/register" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 text-[14px] font-medium text-white transition-[background-color,transform] duration-150 hover:bg-[#0B1220] active:scale-[0.97]">
              Start free <IconArrow className="h-3.5 w-3.5" />
            </Link>
            <a href="#product" className="hidden min-h-11 items-center justify-center rounded-xl px-5 text-[14px] font-medium text-[#64748B] transition-[background-color,color,transform] duration-150 hover:bg-[#F1F5F9] hover:text-[#0F172A] active:scale-[0.97] lg:inline-flex">
              See the product
            </a>
          </div>
          <p data-h="meta" className="text-[12px] text-[#94A3B8]">No card required · 14-day free trial</p>
          <p data-h="strip" className="mx-auto mt-9 max-w-80 text-[12px] leading-relaxed text-[#94A3B8] sm:mx-0 sm:mt-12 sm:max-w-none sm:text-left">
            Works with <span className="font-medium text-[#64748B]">Instagram</span>
            <span className="mx-1.5 text-[#CBD5E1]">·</span>
            <span className="font-medium text-[#64748B]">LinkedIn</span>
            <span className="mx-1.5 text-[#CBD5E1]">·</span>
            <span className="font-medium text-[#64748B]">Facebook</span>
          </p>
        </div>

        <div id="product" data-h="preview" className="hidden justify-center lg:flex lg:justify-end">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}

// ─── Product Preview ──────────────────────────────────────────────────────────

type PreviewPost = {
  day: string;
  platform: 'Instagram' | 'LinkedIn' | 'Facebook';
  title: string;
  status: 'Scheduled' | 'Needs approval' | 'Published' | 'Draft';
};

const previewPosts: PreviewPost[] = [
  { day: 'Mon', platform: 'Instagram', title: 'Launch teaser', status: 'Scheduled' },
  { day: 'Tue', platform: 'LinkedIn', title: 'Founder story', status: 'Needs approval' },
  { day: 'Wed', platform: 'Facebook', title: 'Campaign post', status: 'Published' },
  { day: 'Fri', platform: 'Instagram', title: 'Behind the scenes', status: 'Draft' },
];

const previewMetrics = [
  { value: '12', label: 'scheduled posts' },
  { value: '3', label: 'pending approvals' },
  { value: '8', label: 'team comments' },
];

const platformStyles: Record<PreviewPost['platform'], string> = {
  Instagram: 'border-[#E1306C]/20 bg-[#E1306C]/8 text-[#9D174D]',
  LinkedIn: 'border-[#0A66C2]/20 bg-[#0A66C2]/8 text-[#075985]',
  Facebook: 'border-[#1877F2]/20 bg-[#1877F2]/8 text-[#1D4ED8]',
};

const statusStyles: Record<PreviewPost['status'], string> = {
  Scheduled: 'bg-[#F1F5F9] text-[#334155]',
  'Needs approval': 'bg-[#FEF3C7] text-[#92400E]',
  Published: 'bg-[#ECFDF5] text-[#047857]',
  Draft: 'bg-[#F8FAFC] text-[#64748B]',
};

function ProductPreview() {
  return (
    <aside className="relative w-full max-w-130 overflow-hidden rounded-3xl border border-[#111827]/12 bg-white p-4 shadow-[0_30px_90px_rgba(17,24,39,0.12)] ring-1 ring-[#111827]/5 sm:p-5 lg:p-6" aria-label="Vielinks product preview">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[#111827]" />
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#111827]">Weekly plan</p>
          <h2 className="text-[22px] font-medium leading-tight tracking-normal text-[#0F172A] sm:text-[24px]">Content workspace</h2>
        </div>
        <div className="rounded-full border border-[#111827]/10 bg-[#F8FAFC] px-3 py-2 text-right shadow-[0_1px_0_rgba(17,24,39,0.05)]">
          <span className="block text-[14px] font-semibold tabular-nums text-[#111827]">+18%</span>
          <span className="block text-[11px] text-[#64748B]">engagement</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
        {previewMetrics.map(metric => (
          <div key={metric.label} className="rounded-2xl border border-[#111827]/8 bg-[#F8FAFC] px-3 py-3">
            <strong className="block text-[21px] font-medium leading-none tabular-nums text-[#0F172A]">{metric.value}</strong>
            <span className="mt-1.5 block text-[11px] leading-snug text-[#64748B]">{metric.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {previewPosts.map(post => (
          <article key={`${post.day}-${post.title}`} className="grid grid-cols-[36px_1fr] gap-3 rounded-2xl border border-[#111827]/8 bg-white p-3 shadow-[0_1px_0_rgba(17,24,39,0.04)] sm:grid-cols-[42px_1fr_auto] sm:items-center">
            <div className="text-[12px] font-bold uppercase text-[#94A3B8]">{post.day}</div>
            <div className="min-w-0">
              <span className={`mb-1.5 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${platformStyles[post.platform]}`}>
                {post.platform}
              </span>
              <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-tight text-[#0F172A]">{post.title}</strong>
            </div>
            <span className={`col-start-2 w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold sm:col-start-auto ${statusStyles[post.status]}`}>
              {post.status}
            </span>
          </article>
        ))}
      </div>
    </aside>
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
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden">
      <SiteNav />
      <main>
        <Hero />
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
