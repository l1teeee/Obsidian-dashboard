import { useEffect, useRef, useState, type ForwardRefExoticComponent } from 'react';
import { useSEO } from '../hooks/useSEO';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroBadge from '../components/landing/HeroBadge';
import ProductShell from '../components/landing/ProductShell';
import {
  MousePointerClickIcon,
  LayoutListIcon,
  UploadIcon,
  CircleCheckBigIcon,
  GlobeIcon,
  SparklesIcon,
  BellRingIcon,
  ZapIcon,
} from '@animateicons/react/lucide';

gsap.registerPlugin(ScrollTrigger);

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const POSTS: Record<number, { platform: string; color: string; time: string; label: string; status: string }[]> = {
  0: [{ platform: 'ig', color: '#E1306C', time: '10:00', label: 'Product launch reel', status: 'Scheduled' }],
  1: [
    { platform: 'li', color: '#0A66C2', time: '09:00', label: 'Industry insights', status: 'Approved' },
    { platform: 'fb', color: '#1877F2', time: '18:00', label: 'Weekend promo', status: 'Review' },
  ],
  3: [{ platform: 'ig', color: '#E1306C', time: '12:00', label: 'Behind the scenes', status: 'Draft' }],
  4: [{ platform: 'li', color: '#0A66C2', time: '08:30', label: 'Team spotlight', status: 'Scheduled' }],
  6: [
    { platform: 'ig', color: '#E1306C', time: '11:00', label: 'Sunday recap', status: 'Approved' },
    { platform: 'fb', color: '#1877F2', time: '15:00', label: 'Community post', status: 'Scheduled' },
  ],
};

const PLATFORM_ICON: Record<string, string> = { ig: 'camera_alt', li: 'work', fb: 'thumb_up' };

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  Draft:     { color: '#94A3B8', bg: '#F1F5F9' },
  Review:    { color: '#B45309', bg: '#FDF6E8' },
  Approved:  { color: '#047857', bg: '#EBF2EA' },
  Scheduled: { color: '#111827', bg: '#F5EBE8' },
};

const APPROVAL_STAGES = [
  { key: 'draft',      label: 'Draft',      icon: 'edit_note',    color: '#94A3B8', bg: '#F1F5F9', border: '#CBD5E1' },
  { key: 'review',    label: 'In review',  icon: 'rate_review',  color: '#B45309', bg: '#FDF6E8', border: '#E8C97A' },
  { key: 'approved',  label: 'Approved',   icon: 'check_circle', color: '#047857', bg: '#EBF2EA', border: '#A8C9A4' },
  { key: 'scheduled', label: 'Scheduled',  icon: 'schedule',     color: '#111827', bg: '#F5EBE8', border: '#D4A898' },
];

const MsIcon = ({ name, size = 18, color }: { name: string; size?: number; color?: string }) => (
  <span
    className="material-symbols-outlined"
    aria-hidden="true"
    style={{ fontSize: size, color, fontVariationSettings: "'FILL' 1" }}
  >
    {name}
  </span>
);

type FeatureIconHandle = { startAnimation: () => void; stopAnimation: () => void };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FeatureItem = { Icon: ForwardRefExoticComponent<any>; title: string; body: string };

function FeatureCard({ feature }: { feature: FeatureItem }) {
  const [hovered, setHovered] = useState(false);
  const iconRef = useRef<FeatureIconHandle>(null);
  const { Icon, title, body } = feature;

  useEffect(() => {
    if (hovered) iconRef.current?.startAnimation();
    else iconRef.current?.stopAnimation();
  }, [hovered]);

  return (
    <div
      className="group bg-[#F8FAFC] p-8 flex flex-col gap-3 border-r border-b border-border transition-colors duration-200 ease-out hover:bg-[#111827]"
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
    </div>
  );
}

const SCHEDULER_FEATURES: FeatureItem[] = [
  { Icon: MousePointerClickIcon, title: 'Drag and drop scheduling',  body: 'Rearrange posts by dragging them to any slot. The queue updates instantly across all platforms.' },
  { Icon: LayoutListIcon,        title: 'Month, week, and list views', body: 'Switch between views to get the overview you need — from big-picture planning to daily execution.' },
  { Icon: UploadIcon,            title: 'Bulk scheduling',           body: 'Upload a CSV or paste a content list to schedule a full month in a single session.' },
  { Icon: CircleCheckBigIcon,    title: 'Approval queues',           body: 'Drafts route to reviewers before anything goes live. Each role sees only what they need.' },
  { Icon: GlobeIcon,             title: 'Timezone-aware publishing', body: "Schedule once. Vielinks publishes in your audience's local timezone automatically — no manual conversion." },
  { Icon: SparklesIcon,          title: 'AI-suggested timing',       body: 'Our model analyzes your audience activity and suggests the best publishing window for each platform.' },
  { Icon: BellRingIcon,          title: 'Post-live confirmations',   body: 'Receive a notification the moment each post goes live across Instagram, LinkedIn, and Facebook.' },
  { Icon: ZapIcon,               title: 'Failed-post recovery',      body: 'If a publish fails due to an API issue, Vielinks retries automatically and alerts your team.' },
];

export default function ProductScheduler() {
  useSEO({
    title: 'Vielinks Calendar - Plan your social media content',
    description: 'Plan a full month of content in one calm calendar. Vielinks schedules, approves, and publishes across Instagram, LinkedIn, and Facebook.',
    keywords: 'social media calendar, content calendar, social media scheduler, content planning, bulk scheduling',
  });

  const navigate = useNavigate();
  const [active, setActive] = useState<number | null>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('[data-sched-section]', { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-sched-section]').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.55, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%', once: true },
          }
        );
      });
    }, sectionsRef);
    return () => ctx.revert();
  }, []);

  return (
    <ProductShell>
      <div ref={sectionsRef}>
        {/* ── Hero ── */}
        <section className="pt-32 pb-12">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <HeroBadge className="mb-5">
                For teams who plan every post
              </HeroBadge>
              <h1 className="text-[clamp(44px,6.5vw,88px)] leading-[1.03] tracking-[-0.04em] font-medium text-[#0F172A] mb-5">
                A calm calendar<br />
                <em className="not-italic text-[#111827]">for every post.</em>
              </h1>
              <p className="text-[16px] leading-[1.65] text-[#64748B] max-w-xl mx-auto mb-8">
                Drag posts between days, review what is ready, and publish across Instagram, LinkedIn, and Facebook without switching tabs.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center text-[14px] font-medium bg-[#111827] text-white px-5 py-2.5 rounded-xl hover:bg-[#0B1220] transition-all duration-200 active:scale-[0.98]"
                >
                  Start free
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="inline-flex items-center text-[14px] font-medium text-[#64748B] px-5 py-2.5 rounded-xl hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-all duration-200"
                >
                  See pricing
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Calendar mockup ── */}
        <section className="pb-20 mx-auto max-w-5xl px-6" data-sched-section style={{ opacity: 0 }}>
          <div className="rounded-2xl border border-border overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[rgba(15,23,42,0.08)] bg-[#F1F5F9]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] opacity-50" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] opacity-50" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] opacity-50" />
              <span className="ml-3 font-mono text-[11px] text-[#64748B]">app.vielinks.com/calendar</span>
            </div>

            {/* Calendar header */}
            <div className="bg-[#FFFFFF] px-6 py-4 border-b border-[rgba(15,23,42,0.08)] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <MsIcon name="calendar_month" size={18} color="#111827" />
                <span className="text-[13px] font-medium text-[#0F172A]">Content calendar</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-2 text-[10px] text-[#94A3B8]">
                  <span className="w-2 h-2 rounded-full bg-[#E1306C] opacity-70" /> IG
                  <span className="w-2 h-2 rounded-full bg-[#0A66C2] opacity-70" /> LI
                  <span className="w-2 h-2 rounded-full bg-[#1877F2] opacity-70" /> FB
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#F1F5F9] text-on-surface-variant text-[11px] font-medium">April 2026</span>
              </div>
            </div>

            {/* Day headers */}
            <div className="bg-[#FFFFFF] grid grid-cols-7 border-b border-[rgba(15,23,42,0.06)]">
              {DAYS.map(d => (
                <div key={d} className="py-3 text-center text-[10px] font-medium uppercase tracking-widest text-[#94A3B8]">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-[rgba(15,23,42,0.06)]">
              {Array.from({ length: 7 }).map((_, i) => {
                const posts = POSTS[i] ?? [];
                return (
                  <button
                    key={i}
                    type="button"
                    className={`min-h-22 p-2 w-full text-left cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E9F6E]/25 focus-visible:ring-inset ${
                      active === i ? 'bg-[#F4E0D6]' : 'bg-[#FFFFFF] hover:bg-[#F8FAFC]'
                    }`}
                    onClick={() => setActive(active === i ? null : i)}
                    aria-expanded={active === i}
                    aria-label={`Day ${i + 7}${POSTS[i] ? `, ${POSTS[i].length} post${POSTS[i].length !== 1 ? 's' : ''}` : ', no posts'}`}
                  >
                    <span className="text-[10px] text-[#64748B] font-medium block mb-1.5">{i + 7}</span>
                    <div className="space-y-1">
                      {posts.map((p, j) => (
                        <div
                          key={j}
                          className="flex items-center gap-1 rounded-md px-1.5 py-1"
                          style={{ backgroundColor: `${p.color}15`, border: `1px solid ${p.color}28` }}
                        >
                          <MsIcon name={PLATFORM_ICON[p.platform]} size={10} color={p.color} />
                          <span className="text-[9px] font-medium truncate" style={{ color: p.color }}>{p.time}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Expanded post detail */}
            <AnimatePresence>
              {active !== null && POSTS[active] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden border-t border-[rgba(15,23,42,0.08)] bg-[#FFFFFF]"
                >
                  <div className="px-6 py-4 flex gap-3 flex-wrap">
                    {POSTS[active]?.map((p, j) => {
                      const st = STATUS_STYLE[p.status] ?? STATUS_STYLE['Draft'];
                      return (
                        <div
                          key={j}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl border"
                          style={{ borderColor: `${p.color}28`, backgroundColor: `${p.color}0d` }}
                        >
                          <MsIcon name={PLATFORM_ICON[p.platform]} size={16} color={p.color} />
                          <div>
                            <p className="text-[12px] font-medium" style={{ color: p.color }}>{p.label}</p>
                            <p className="text-[10px] text-[#64748B]">{p.time} · {DAYS[active]}</p>
                          </div>
                          <span
                            className="ml-1 px-2 py-0.5 rounded-full text-[9px] font-medium"
                            style={{ color: st.color, backgroundColor: st.bg }}
                          >
                            {p.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-center text-[11px] text-[#94A3B8] mt-3">Select a day to view posts</p>
        </section>

        {/* ── Approval workflow ── */}
        <section className="py-20 border-t border-[rgba(15,23,42,0.08)]" data-sched-section style={{ opacity: 0 }}>
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-12">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#111827] mb-3 inline-block">Approval workflow</span>
              <h2 className="text-[clamp(32px,4.5vw,52px)] leading-[1.1] tracking-[-0.035em] font-medium text-[#0F172A] mb-4">
                From draft to published, together.
              </h2>
              <p className="text-[15px] leading-[1.65] text-[#64748B] max-w-md mx-auto">
                Move posts through a structured review process before anything goes live. No surprises.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0 overflow-x-auto pb-2">
              {APPROVAL_STAGES.map((stage, i) => (
                <div key={stage.key} className="flex items-center gap-2 md:gap-0 shrink-0">
                  <div
                    className="flex flex-col items-center gap-2 px-6 py-5 rounded-2xl border w-36"
                    style={{ backgroundColor: stage.bg, borderColor: stage.border }}
                  >
                    <MsIcon name={stage.icon} size={20} color={stage.color} />
                    <span className="text-[11px] font-medium" style={{ color: stage.color }}>{stage.label}</span>
                  </div>
                  {i < APPROVAL_STAGES.length - 1 && (
                    <span className="material-symbols-outlined text-[#CBD5E1] shrink-0 mx-1" aria-hidden="true" style={{ fontSize: 20 }}>chevron_right</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="rounded-2xl border border-border bg-[#FFFFFF] p-6">
                <h3 className="text-[13px] font-semibold text-[#0F172A] mb-2">Role-based access</h3>
                <p className="text-[14px] leading-[1.6] text-[#64748B]">Writers create drafts. Reviewers approve. Admins publish. Each role sees only what they need.</p>
              </div>
              <div className="rounded-2xl border border-border bg-[#FFFFFF] p-6">
                <h3 className="text-[13px] font-semibold text-[#0F172A] mb-2">Comments and feedback</h3>
                <p className="text-[14px] leading-[1.6] text-[#64748B]">Leave inline comments on any post during review. Feedback stays attached to the content.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Workspace ── */}
        <section className="py-20 border-t border-[rgba(15,23,42,0.08)]" data-sched-section style={{ opacity: 0 }}>
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#111827] mb-3 inline-block">The workspace</span>
              <h2 className="text-[clamp(32px,4.5vw,52px)] leading-[1.1] tracking-[-0.035em] font-medium text-[#0F172A] mb-4">
                Built for serious publishers.
              </h2>
              <p className="text-[15px] leading-[1.65] text-[#64748B] max-w-xl mx-auto">
                Every tool you need to plan, approve, and publish reliably — from the first draft to the live confirmation.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-border rounded-2xl overflow-hidden">
              {SCHEDULER_FEATURES.map(f => <FeatureCard key={f.title} feature={f} />)}
            </div>
          </div>
        </section>
      </div>
    </ProductShell>
  );
}
