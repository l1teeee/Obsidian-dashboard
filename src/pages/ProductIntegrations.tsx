import { useEffect, useRef } from 'react';
import { useSEO } from '../hooks/useSEO';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroBadge from '../components/landing/HeroBadge';
import ProductShell from '../components/landing/ProductShell';

gsap.registerPlugin(ScrollTrigger);

const PLATFORMS = [
  { name: 'Instagram',  icon: 'camera_alt',  color: '#E4405F', status: 'live',    desc: 'Feed posts, Reels, and Stories scheduling' },
  { name: 'LinkedIn',   icon: 'work',         color: '#0a66c2', status: 'live',    desc: 'Posts, articles, and company pages' },
  { name: 'Facebook',   icon: 'thumb_up',     color: '#1877f2', status: 'live',    desc: 'Pages, groups, and ad integration' },
  { name: 'X / Twitter',icon: 'tag',          color: '#15140F', status: 'soon',    desc: 'Tweets, threads, and media posts' },
  { name: 'TikTok',     icon: 'music_note',   color: '#ff0050', status: 'soon',    desc: 'Video scheduling and analytics' },
  { name: 'YouTube',    icon: 'play_circle',  color: '#ff0000', status: 'soon',    desc: 'Shorts and long-form video posts' },
  { name: 'Pinterest',  icon: 'push_pin',     color: '#e60023', status: 'roadmap', desc: 'Pins, boards, and idea pins' },
  { name: 'Threads',    icon: 'forum',        color: '#6B655B', status: 'roadmap', desc: 'Text and media threads' },
  { name: 'Bluesky',    icon: 'cloud',        color: '#0085ff', status: 'roadmap', desc: 'Decentralized social posts' },
];

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  live:    { label: 'Live',    color: '#4F7A4A', bg: '#EBF2EA', border: '#A8C9A4' },
  soon:    { label: 'Coming',  color: '#B7841E', bg: '#FDF6E8', border: '#E8C97A' },
  roadmap: { label: 'Roadmap', color: '#6B655B', bg: '#EFE9DC', border: '#D8D2C4' },
};

const HOW = [
  { icon: 'link',  step: '01', title: 'Connect in one click', body: 'OAuth 2.0 — no passwords stored. Connect Instagram, LinkedIn, and Facebook in under 30 seconds.' },
  { icon: 'lock',  step: '02', title: 'Secure by design',     body: 'Read/write scopes only. We request the minimum permissions needed. Revoke access at any time.' },
  { icon: 'sync',  step: '03', title: 'Always in sync',       body: 'Account data, follower counts, and post performance sync automatically every hour.' },
];

const SECURITY = [
  { icon: 'lock',            title: 'OAuth 2.0 only',         body: 'We never ask for your password. Every connection goes through the platform\'s official OAuth flow.',  color: '#4A6A82' },
  { icon: 'tune',            title: 'Minimal scopes',         body: 'We request only the permissions required to schedule and read analytics. Nothing more.',              color: '#4F7A4A' },
  { icon: 'cancel',          title: 'Revoke anytime',         body: 'Disconnect any platform instantly from your dashboard or directly from the platform\'s own settings.', color: '#C8553A' },
  { icon: 'history',         title: 'Access audit log',       body: 'Every permission grant and connection event is logged. Know exactly what was accessed and when.',      color: '#B7841E' },
];

const WORKFLOW = [
  { icon: 'webhook',       name: 'Webhooks',     desc: 'Receive real-time events when posts publish or fail.' },
  { icon: 'api',           name: 'REST API',     desc: 'Full programmatic access for custom workflows. Agency plan.' },
  { icon: 'table_chart',   name: 'CSV import',   desc: 'Bulk-upload scheduled posts from a spreadsheet.' },
  { icon: 'notifications', name: 'Slack alerts', desc: 'Publishing confirmations and error notifications in Slack.' },
];

export default function ProductIntegrations() {
  useSEO({
    title: 'Vielinks Integrations - Connect Instagram, LinkedIn & Facebook',
    description: 'Connect the channels your team already uses. Instagram, LinkedIn, and Facebook — live. X, TikTok, YouTube, and more on the roadmap.',
    keywords: 'social media integrations, Instagram API, LinkedIn scheduler, Facebook management, OAuth social',
  });

  const navigate = useNavigate();
  const howRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-platform]',
        { opacity: 0, scale: 0.94, y: 16 },
        {
          opacity: 1, scale: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out',
          scrollTrigger: { trigger: '[data-grid]', start: 'top 78%', once: true },
        }
      );
      gsap.fromTo('[data-how]',
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: howRef.current, start: 'top 80%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <ProductShell>
      {/* Hero */}
      <section className="pt-36 pb-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <HeroBadge className="mb-5">
              For teams who connect once
            </HeroBadge>
            <h1 className="mt-5 text-[clamp(36px,5vw,60px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#15140F]">
              Connect the channels<br />
              <span className="text-[#C8553A]">your team already uses.</span>
            </h1>
            <p className="mt-6 text-[15px] leading-[1.65] text-[#6B655B] max-w-xl mx-auto">
              Instagram, LinkedIn, and Facebook — live today. More platforms are on the roadmap, and they connect in seconds.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#C8553A] px-8 py-3 text-[14px] font-medium text-white hover:bg-[#A53F28] transition-all duration-200 active:scale-[0.98]"
            >
              Connect your accounts
            </button>
          </motion.div>
        </div>
      </section>

      {/* Platform grid */}
      <section className="py-12 mx-auto max-w-6xl px-6">
        <div data-grid className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PLATFORMS.map((p) => {
            const st = STATUS_STYLE[p.status];
            return (
              <div
                key={p.name}
                data-platform
                style={{ opacity: 0 }}
                className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6 hover:border-[#C8553A]/20 hover:bg-[#EFE9DC] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                    style={{ backgroundColor: `${p.color}18`, borderColor: `${p.color}28` }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: p.color, fontVariationSettings: "'FILL' 1" }}>
                      {p.icon}
                    </span>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold border"
                    style={{ color: st.color, backgroundColor: st.bg, borderColor: st.border }}
                  >
                    {st.label}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#15140F] mb-1">{p.name}</h3>
                <p className="text-xs text-[#6B655B]">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          {Object.entries(STATUS_STYLE).map(([, val]) => (
            <span key={val.label} className="flex items-center gap-2 text-xs text-[#6B655B]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: val.color }} />
              {val.label}
            </span>
          ))}
        </div>
      </section>

      {/* How connecting works */}
      <section className="py-16 border-y border-[rgba(21,20,15,0.08)]" ref={howRef}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-12">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C8553A] mb-3">Setup</p>
            <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#15140F]">Connected in 3 steps.</h2>
            <p className="mt-2 text-[#6B655B] text-sm">No developers. No API keys. No headaches.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW.map((h) => (
              <div key={h.step} data-how style={{ opacity: 0 }} className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#C8553A]/10 border border-[#C8553A]/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>{h.icon}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#C8553A]/60 uppercase tracking-widest">{h.step}</span>
                  <h3 className="text-sm font-bold text-[#15140F] mt-0.5 mb-1">{h.title}</h3>
                  <p className="text-xs text-[#6B655B] leading-relaxed">{h.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-16 mx-auto max-w-5xl px-6">
        <div className="text-center mb-10">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C8553A] mb-3">Security</p>
          <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#15140F]">Built with trust by default.</h2>
          <p className="mt-3 text-[#6B655B] max-w-md mx-auto text-sm leading-relaxed">Connecting your social accounts should feel safe. Here is exactly how we handle your access.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {SECURITY.map((s) => (
            <div key={s.title} className="flex gap-4 rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${s.color}12`, border: `1px solid ${s.color}22` }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: s.color, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#15140F] mb-1.5">{s.title}</h3>
                <p className="text-sm text-[#6B655B] leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow integrations */}
      <section className="py-16 border-t border-[rgba(21,20,15,0.08)] mx-auto max-w-5xl px-6">
        <div className="text-center mb-10">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C8553A] mb-3">Workflow</p>
          <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#15140F]">Also works with your stack.</h2>
          <p className="mt-3 text-[#6B655B] max-w-md mx-auto text-sm leading-relaxed">Beyond social networks — Vielinks connects to your existing workflow tools.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {WORKFLOW.map((a) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-5 text-center hover:border-[#C8553A]/20 hover:bg-[#EFE9DC] transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#C8553A]/8 border border-[#C8553A]/12 flex items-center justify-center mb-3 mx-auto group-hover:bg-[#C8553A]/15 transition-colors">
                <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
              </div>
              <p className="text-sm font-bold text-[#15140F] mb-1">{a.name}</p>
              <p className="text-[11px] text-[#6B655B] leading-snug">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </ProductShell>
  );
}
