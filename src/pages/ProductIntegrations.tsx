import { useEffect, useRef } from 'react';
import { useSEO } from '../hooks/useSEO';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductShell from '../components/landing/ProductShell';

gsap.registerPlugin(ScrollTrigger);

const PLATFORMS = [
  { name: 'Instagram',  icon: 'camera_alt',    color: '#E4405F',  status: 'live',    desc: 'Feed posts, Reels, Stories scheduling' },
  { name: 'LinkedIn',   icon: 'work',           color: '#0a66c2',  status: 'live',    desc: 'Posts, articles, and company pages' },
  { name: 'Facebook',   icon: 'thumb_up',       color: '#1877f2',  status: 'live',    desc: 'Pages, groups, and ad integration' },
  { name: 'X / Twitter', icon: 'tag',           color: '#1da1f2',  status: 'soon',    desc: 'Tweets, threads and media posts' },
  { name: 'TikTok',     icon: 'music_note',     color: '#ff0050',  status: 'soon',    desc: 'Video scheduling and analytics' },
  { name: 'YouTube',    icon: 'play_circle',    color: '#ff0000',  status: 'soon',    desc: 'Shorts and long-form video posts' },
  { name: 'Pinterest',  icon: 'push_pin',       color: '#e60023',  status: 'roadmap', desc: 'Pins, boards, and idea pins' },
  { name: 'Threads',    icon: 'forum',          color: '#101010',  status: 'roadmap', desc: 'Text and media threads' },
  { name: 'Bluesky',    icon: 'cloud',          color: '#0085ff',  status: 'roadmap', desc: 'Decentralized social posts' },
];

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  live:    { label: 'Live',     color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  soon:    { label: 'Coming',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  roadmap: { label: 'Roadmap',  color: '#6b7280', bg: 'rgba(107,114,128,0.12)'},
};

const HOW = [
  { icon: 'link',        step: '01', title: 'Connect in one click', body: 'OAuth 2.0 — no passwords stored. Connect Instagram, LinkedIn, and Facebook in under 30 seconds.' },
  { icon: 'lock',        step: '02', title: 'Secure by design',     body: 'Read/write scopes only. We request the minimum permissions needed. You can revoke access at any time.' },
  { icon: 'sync',        step: '03', title: 'Always in sync',       body: 'Account data, follower counts, and post performance sync automatically every hour.' },
];

const ALSO = [
  { icon: 'webhook',         name: 'Webhooks',     desc: 'Receive real-time events when posts publish or fail.' },
  { icon: 'api',             name: 'REST API',     desc: 'Full programmatic access for custom workflows. Agency plan.' },
  { icon: 'table_chart',     name: 'CSV import',   desc: 'Bulk-upload scheduled posts from a spreadsheet.' },
  { icon: 'notifications',   name: 'Slack alerts', desc: 'Publishing confirmations and error notifications in Slack.' },
];

export default function ProductIntegrations() {
  useSEO({
    title: 'Vielinks Integrations - Connect Instagram, LinkedIn & Facebook',
    description: 'Connect Instagram, LinkedIn, and Facebook in one click. Vielinks keeps publishing, analytics, and AI workflows in one dashboard.',
    keywords: 'social media integrations, Instagram API, LinkedIn scheduler, Facebook management, OAuth social',
  });

  const navigate  = useNavigate();
  const howRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-platform]',
        { opacity: 0, scale: 0.92, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out',
          scrollTrigger: { trigger: '[data-grid]', start: 'top 78%', once: true } }
      );
      gsap.fromTo('[data-how]',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: howRef.current, start: 'top 80%', once: true } }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <ProductShell>
      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#7DD3C7]/[0.06] blur-[130px]" />
        <div className="mx-auto max-w-5xl px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#7DD3C7]/20 bg-[#7DD3C7]/8 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#7DD3C7]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7DD3C7]" /> Product · Integrations
            </span>
            <h1 className="mt-5 text-5xl md:text-[4rem] font-extrabold leading-[0.96] tracking-[-0.04em] text-[#1C1814]">
              Connect your core<br />
              <span className="bg-gradient-to-r from-[#7DD3C7] via-[#f0dcff] to-inverse-primary bg-clip-text text-transparent">
                social platforms.
              </span>
            </h1>
            <p className="mt-6 text-lg font-light text-[#1C1814]/55 max-w-xl mx-auto leading-relaxed">
              Vielinks connects to the social networks that matter. More integrations are on the roadmap.
            </p>
            <button onClick={() => navigate('/register')} className="mt-8 rounded-full bg-[#7DD3C7] px-8 py-3.5 text-sm font-bold text-[#0B0B0A] hover:shadow-[0_0_32px_rgba(125,211,199,0.4)] transition-all active:scale-[0.98]">
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
                className="group rounded-3xl border border-white/[0.07] bg-[#111]/70 p-6 hover:border-white/[0.12] hover:bg-[#181818]/80 transition-all duration-300 relative overflow-hidden"
              >
                <div className="pointer-events-none absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: `${p.color}18` }} />
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ backgroundColor: `${p.color}18`, borderColor: `${p.color}28` }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: p.color, fontVariationSettings: "'FILL' 1" }}>
                      {p.icon}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ color: st.color, backgroundColor: st.bg }}>
                    {st.label}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1C1814] mb-1">{p.name}</h3>
                <p className="text-xs text-[#1C1814]/40">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-5 mt-8">
          {Object.entries(STATUS_STYLE).map(([key, val]) => (
            <span key={key} className="flex items-center gap-2 text-xs text-[#1C1814]/40">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: val.color }} />
              {val.label}
            </span>
          ))}
        </div>
      </section>

      {/* How connecting works */}
      <section className="py-16 border-y border-white/[0.05] mx-auto max-w-5xl px-6" ref={howRef}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1C1814]">Connect in 3 steps</h2>
          <p className="mt-2 text-[#1C1814]/45">No developers. No API keys. No headaches.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {HOW.map((h) => (
            <div key={h.step} data-how style={{ opacity: 0 }} className="flex gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#7DD3C7]/10 border border-[#7DD3C7]/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#7DD3C7]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>{h.icon}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#7DD3C7]/60 uppercase tracking-widest">{h.step}</span>
                <h3 className="text-sm font-bold text-[#1C1814] mt-0.5 mb-1">{h.title}</h3>
                <p className="text-xs text-[#1C1814]/45 leading-relaxed">{h.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Also integrates with */}
      <section className="py-20 mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#1C1814]">Also works with</h2>
          <p className="mt-2 text-[#1C1814]/45 text-sm">Beyond social networks — Vielinks connects to your workflow.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ALSO.map((a) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/[0.07] bg-[#111]/70 p-5 text-center hover:border-[#7DD3C7]/20 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#7DD3C7]/8 border border-[#7DD3C7]/12 flex items-center justify-center mb-3 mx-auto group-hover:bg-[#7DD3C7]/15 transition-colors">
                <span className="material-symbols-outlined text-[#7DD3C7]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
              </div>
              <p className="text-sm font-bold text-[#1C1814] mb-1">{a.name}</p>
              <p className="text-[11px] text-[#1C1814]/40 leading-snug">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </ProductShell>
  );
}
