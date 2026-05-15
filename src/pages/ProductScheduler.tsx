import { useEffect, useRef, useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductShell from '../components/landing/ProductShell';

gsap.registerPlugin(ScrollTrigger);

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const POSTS: Record<number, { platform: string; color: string; time: string; label: string; status: string }[]> = {
  0: [{ platform: 'ig', color: '#E4405F', time: '10:00', label: 'Product launch reel', status: 'Scheduled' }],
  1: [
    { platform: 'li', color: '#0a66c2', time: '09:00', label: 'Industry insights', status: 'Approved' },
    { platform: 'fb', color: '#1877f2', time: '18:00', label: 'Weekend promo', status: 'Review' },
  ],
  3: [{ platform: 'ig', color: '#E4405F', time: '12:00', label: 'Behind the scenes', status: 'Draft' }],
  4: [{ platform: 'li', color: '#0a66c2', time: '08:30', label: 'Team spotlight', status: 'Scheduled' }],
  6: [
    { platform: 'ig', color: '#E4405F', time: '11:00', label: 'Sunday recap', status: 'Approved' },
    { platform: 'fb', color: '#1877f2', time: '15:00', label: 'Community post', status: 'Scheduled' },
  ],
};

const PLATFORM_ICON: Record<string, string> = { ig: 'camera_alt', li: 'work', fb: 'thumb_up' };

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  Draft:     { color: '#A39B8B', bg: '#EFE9DC' },
  Review:    { color: '#B7841E', bg: '#FDF6E8' },
  Approved:  { color: '#4F7A4A', bg: '#EBF2EA' },
  Scheduled: { color: '#C8553A', bg: '#F5EBE8' },
};

const APPROVAL_STAGES = [
  { key: 'draft',     label: 'Draft',      icon: 'edit_note',    color: '#A39B8B', bg: '#EFE9DC',  border: '#D8D2C4' },
  { key: 'review',   label: 'In Review',  icon: 'rate_review',  color: '#B7841E', bg: '#FDF6E8',  border: '#E8C97A' },
  { key: 'approved', label: 'Approved',   icon: 'check_circle', color: '#4F7A4A', bg: '#EBF2EA',  border: '#A8C9A4' },
  { key: 'scheduled',label: 'Scheduled',  icon: 'schedule',     color: '#C8553A', bg: '#F5EBE8',  border: '#D4A898' },
];

const CONFIDENCE = [
  {
    icon: 'public',
    title: 'Timezone-aware publishing',
    body: 'Schedule once and Vielinks publishes in your audience\'s local timezone automatically — no manual conversion needed.',
    color: '#4A6A82',
  },
  {
    icon: 'notifications_active',
    title: 'Post-live confirmations',
    body: 'Receive an alert the moment each post goes live across Instagram, LinkedIn, and Facebook.',
    color: '#4F7A4A',
  },
  {
    icon: 'refresh',
    title: 'Failed-post recovery',
    body: 'If a publish fails due to an API or connectivity issue, Vielinks retries automatically and notifies your team.',
    color: '#C8553A',
  },
];

const FEATURES = [
  { icon: 'drag_pan',       title: 'Drag & drop scheduling',  body: 'Rearrange posts by dragging them to any slot. The queue updates instantly across all platforms.' },
  { icon: 'view_week',      title: 'Month, week, list views', body: 'Switch between calendar views to get the overview you need — from big-picture planning to daily execution.' },
  { icon: 'stack_group',    title: 'Bulk scheduling',         body: 'Upload a CSV or paste a content list to schedule a full month in a single session.' },
  { icon: 'repeat',         title: 'Recurring content',       body: 'Set evergreen posts to repeat weekly or monthly without any extra work.' },
  { icon: 'group',          title: 'Team collaboration',      body: 'Assign posts, leave comments, and move content through your approval flow with your team.' },
  { icon: 'auto_fix_high',  title: 'AI-suggested timing',    body: 'Our model analyzes your audience activity and suggests the exact publishing window for each platform.' },
];

export default function ProductScheduler() {
  useSEO({
    title: 'Vielinks Calendar - Plan Your Social Media Content',
    description: 'Plan a full month of content in one calm calendar. Vielinks schedules, approves, and publishes across Instagram, LinkedIn, and Facebook.',
    keywords: 'social media calendar, content calendar, social media scheduler, content planning, bulk scheduling',
  });

  const navigate = useNavigate();
  const [active, setActive] = useState<number | null>(null);
  const featRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-feat]',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: featRef.current, start: 'top 78%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <ProductShell>
      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#C8553A]/[0.06] blur-[130px]" />
        <div className="mx-auto max-w-5xl px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C8553A]/20 bg-[#C8553A]/8 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#C8553A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8553A]" /> Product · Calendar
            </span>
            <h1 className="mt-5 text-5xl md:text-[4rem] font-extrabold leading-[0.96] tracking-[-0.04em] text-[#15140F]">
              Plan the month<br />
              <span className="text-[#C8553A]">in one calm calendar.</span>
            </h1>
            <p className="mt-6 text-lg font-light text-[#6B655B] max-w-xl mx-auto leading-relaxed">
              Plan, move, and publish across Instagram, LinkedIn, and Facebook from a single view — without juggling apps or tabs.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="mt-8 rounded-full bg-[#C8553A] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#A53F28] hover:shadow-[0_0_32px_rgba(200,85,58,0.4)] transition-all active:scale-[0.98]"
            >
              Open your calendar
            </button>
          </motion.div>
        </div>
      </section>

      {/* Calendar preview */}
      <section className="py-12 mx-auto max-w-5xl px-6">
        <div className="rounded-3xl border border-[rgba(21,20,15,0.10)] bg-[#FFFFFF] overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(21,20,15,0.08)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 18 }}>calendar_month</span>
              <span className="text-sm font-bold text-[#15140F]">Content Calendar</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-2 text-[10px] text-[#A39B8B]">
                <span className="w-2 h-2 rounded-full bg-[#E4405F] opacity-70" />IG
                <span className="w-2 h-2 rounded-full bg-[#0a66c2] opacity-70" />LI
                <span className="w-2 h-2 rounded-full bg-[#1877f2] opacity-70" />FB
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#C8553A]/10 text-[#C8553A] text-xs font-semibold">April 2026</span>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-[rgba(21,20,15,0.08)]">
            {DAYS.map(d => (
              <div key={d} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#A39B8B]">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-[rgba(21,20,15,0.04)]">
            {Array.from({ length: 7 }).map((_, i) => {
              const posts = POSTS[i] ?? [];
              return (
                <div
                  key={i}
                  className={`min-h-[90px] p-2 cursor-pointer transition-all duration-200 ${active === i ? 'bg-[#F5EBE8]' : 'bg-[#FBF8F2] hover:bg-[#F6F2EA]'}`}
                  onClick={() => setActive(active === i ? null : i)}
                >
                  <span className="text-[10px] text-[#6B655B] font-semibold block mb-1.5">{i + 7}</span>
                  <div className="space-y-1">
                    {posts.map((p, j) => (
                      <div key={j} className="flex items-center gap-1 rounded-md px-1.5 py-1" style={{ backgroundColor: `${p.color}18`, border: `1px solid ${p.color}30` }}>
                        <span className="material-symbols-outlined shrink-0" style={{ fontSize: 10, color: p.color, fontVariationSettings: "'FILL' 1" }}>
                          {PLATFORM_ICON[p.platform]}
                        </span>
                        <span className="text-[9px] font-medium truncate" style={{ color: p.color }}>{p.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {active !== null && POSTS[active] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-[rgba(21,20,15,0.08)]"
              >
                <div className="px-6 py-4 flex gap-3 flex-wrap">
                  {POSTS[active]?.map((p, j) => {
                    const st = STATUS_STYLE[p.status] ?? STATUS_STYLE['Draft'];
                    return (
                      <div key={j} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border" style={{ borderColor: `${p.color}30`, backgroundColor: `${p.color}10` }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: p.color, fontVariationSettings: "'FILL' 1" }}>
                          {PLATFORM_ICON[p.platform]}
                        </span>
                        <div>
                          <p className="text-xs font-semibold" style={{ color: p.color }}>{p.label}</p>
                          <p className="text-[10px] text-[#6B655B]">{p.time} · {DAYS[active]}</p>
                        </div>
                        <span className="ml-1 px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ color: st.color, backgroundColor: st.bg }}>{p.status}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-center text-xs text-[#A39B8B] mt-3">Select a day to view and manage posts</p>
      </section>

      {/* Approval flow */}
      <section className="py-16 border-y border-[rgba(21,20,15,0.08)]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-12">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C8553A] mb-3">Approval workflow</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#15140F]">From draft to published, together.</h2>
            <p className="mt-3 text-[#6B655B] max-w-md mx-auto text-sm leading-relaxed">Move posts through a structured review process before anything goes live. No surprises.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 overflow-x-auto pb-2">
            {APPROVAL_STAGES.map((stage, i) => (
              <div key={stage.key} className="flex items-center gap-2 sm:gap-0 shrink-0">
                <div
                  className="flex flex-col items-center gap-2 px-6 py-5 rounded-2xl border w-36"
                  style={{ backgroundColor: stage.bg, borderColor: stage.border }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: stage.color, fontVariationSettings: "'FILL' 1" }}>{stage.icon}</span>
                  <span className="text-xs font-bold" style={{ color: stage.color }}>{stage.label}</span>
                </div>
                {i < APPROVAL_STAGES.length - 1 && (
                  <span className="material-symbols-outlined text-[#D8D2C4] shrink-0 mx-1" style={{ fontSize: 20 }}>chevron_right</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-5">
              <p className="text-xs font-bold text-[#15140F] mb-1.5">Role-based access</p>
              <p className="text-sm text-[#6B655B] leading-relaxed">Writers create drafts. Reviewers approve. Admins publish. Each role sees only what they need.</p>
            </div>
            <div className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-5">
              <p className="text-xs font-bold text-[#15140F] mb-1.5">Comments & feedback</p>
              <p className="text-sm text-[#6B655B] leading-relaxed">Leave inline comments on any post during review. Feedback stays attached to the content.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Publishing confidence */}
      <section className="py-16 mx-auto max-w-5xl px-6">
        <div className="text-center mb-10">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C8553A] mb-3">Reliability</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#15140F]">Publish without anxiety.</h2>
          <p className="mt-3 text-[#6B655B] max-w-md mx-auto text-sm leading-relaxed">Every post is confirmed, monitored, and recovered if something goes wrong.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {CONFIDENCE.map((c) => (
            <div key={c.title} className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${c.color}12`, border: `1px solid ${c.color}22` }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: c.color, fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-[#15140F] mb-2">{c.title}</h3>
              <p className="text-sm text-[#6B655B] leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#15140F]">Built for serious publishers</h2>
          <p className="mt-3 text-[#6B655B] max-w-lg mx-auto">Every tool you need to maintain a consistent publishing cadence across platforms.</p>
        </div>
        <div ref={featRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              data-feat
              style={{ opacity: 0 }}
              className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6 hover:border-[#C8553A]/20 hover:bg-[#EFE9DC] transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#C8553A]/8 border border-[#C8553A]/12 flex items-center justify-center mb-4 group-hover:bg-[#C8553A]/15 transition-colors">
                <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-[#15140F] mb-2">{f.title}</h3>
              <p className="text-sm text-[#6B655B] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </ProductShell>
  );
}
