import React, { useEffect, useRef, useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  LockIcon, type LockIconHandle,
  SlidersHorizontalIcon,
  ShieldXIcon,
  EyeIcon,
} from '@animateicons/react/lucide';
import HeroBadge from '../components/landing/HeroBadge';
import ProductShell from '../components/landing/ProductShell';
import SocialBrandIcon from '../components/shared/SocialBrandIcon';

gsap.registerPlugin(ScrollTrigger);

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram',   color: '#E4405F', status: 'live',    desc: 'Feed posts, Reels, and Stories scheduling' },
  { id: 'linkedin',  name: 'LinkedIn',    color: '#0A66C2', status: 'live',    desc: 'Posts, articles, and company pages' },
  { id: 'facebook',  name: 'Facebook',    color: '#1877F2', status: 'live',    desc: 'Pages, groups, and ad integration' },
  { id: 'twitter',   name: 'X / Twitter', color: '#0F172A', status: 'soon',    desc: 'Tweets, threads, and media posts' },
  { id: 'tiktok',    name: 'TikTok',      color: '#010101', status: 'soon',    desc: 'Video scheduling and analytics' },
  { id: 'youtube',   name: 'YouTube',     color: '#FF0000', status: 'soon',    desc: 'Shorts and long-form video posts' },
  { id: 'pinterest', name: 'Pinterest',   color: '#E60023', status: 'roadmap', desc: 'Pins, boards, and idea pins' },
  { id: 'threads',   name: 'Threads',     color: '#0F172A', status: 'roadmap', desc: 'Text and media threads' },
  { id: 'bluesky',   name: 'Bluesky',     color: '#0085FF', status: 'roadmap', desc: 'Decentralized social posts' },
];

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  live:    { label: 'Live',    color: '#047857', bg: '#EBF2EA', border: '#A8C9A4' },
  soon:    { label: 'Coming',  color: '#B45309', bg: '#FDF6E8', border: '#E8C97A' },
  roadmap: { label: 'Roadmap', color: '#64748B', bg: '#F1F5F9', border: '#CBD5E1' },
};

const HOW = [
  { icon: 'link',  step: '01', title: 'Connect in one click', body: 'OAuth 2.0 — no passwords stored. Connect Instagram, LinkedIn, and Facebook in under 30 seconds.' },
  { icon: 'lock',  step: '02', title: 'Secure by design',     body: 'Read/write scopes only. We request the minimum permissions needed. Revoke access at any time.' },
  { icon: 'sync',  step: '03', title: 'Always in sync',       body: 'Account data, follower counts, and post performance sync automatically every hour.' },
];

type SecurityIconHandle = LockIconHandle;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SecurityFeatureItem = { Icon: React.ForwardRefExoticComponent<any>; title: string; body: string };

const SECURITY_FEATURES: SecurityFeatureItem[] = [
  { Icon: LockIcon,              title: 'OAuth 2.0 only',   body: "We never ask for your password. Every connection goes through the platform's official OAuth flow." },
  { Icon: SlidersHorizontalIcon, title: 'Minimal scopes',   body: 'We request only the permissions required to schedule and read analytics. Nothing more.' },
  { Icon: ShieldXIcon,           title: 'Revoke anytime',   body: "Disconnect any platform instantly from your dashboard or directly from the platform's own settings." },
  { Icon: EyeIcon,               title: 'Access audit log', body: 'Every permission grant and connection event is logged. Know exactly what was accessed and when.' },
];

function SecurityCard({ feature }: { feature: SecurityFeatureItem }) {
  const [hovered, setHovered] = useState(false);
  const iconRef = useRef<SecurityIconHandle>(null);
  const { Icon, title, body } = feature;

  useEffect(() => {
    if (hovered) iconRef.current?.startAnimation();
    else iconRef.current?.stopAnimation();
  }, [hovered]);

  return (
    <div
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
    </div>
  );
}

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
            <h1 className="mt-5 text-[clamp(36px,5vw,60px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#0F172A]">
              Connect the channels<br />
              <span className="text-[#111827]">your team already uses.</span>
            </h1>
            <p className="mt-6 text-[15px] leading-[1.65] text-[#64748B] max-w-xl mx-auto">
              Instagram, LinkedIn, and Facebook — live today. More platforms are on the roadmap, and they connect in seconds.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#111827] px-8 py-3 text-[14px] font-medium text-white hover:bg-[#0B1220] transition-all duration-200 active:scale-[0.98]"
            >
              Connect your accounts
            </button>
          </motion.div>
        </div>
      </section>

      {/* Platform grid */}
      <section className="py-12 mx-auto max-w-6xl px-6">
        <div data-grid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PLATFORMS.map((p) => {
            const st = STATUS_STYLE[p.status];
            return (
              <div
                key={p.name}
                data-platform
                style={{ opacity: 0 }}
                className="rounded-2xl border border-[rgba(15,23,42,0.10)] bg-[#FFFFFF] p-6 transition-[background-color,border-color,transform] duration-200 ease-out hover:border-[#0F172A]/20 hover:bg-[#F8FAFC] hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center text-[#0F172A]">
                    <SocialBrandIcon platformId={p.id} size={26} color={p.color} />
                  </div>
                  <span
                    className="rounded-full border px-2.5 py-1 text-[10px] font-bold"
                    style={{ color: st.color, backgroundColor: st.bg, borderColor: st.border }}
                  >
                    {st.label}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-1">{p.name}</h3>
                <p className="text-xs text-[#64748B]">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          {Object.entries(STATUS_STYLE).map(([, val]) => (
            <span key={val.label} className="flex items-center gap-2 text-xs text-[#64748B]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: val.color }} />
              {val.label}
            </span>
          ))}
        </div>
      </section>

      {/* How connecting works */}
      <section className="py-16 border-y border-[rgba(15,23,42,0.08)]" ref={howRef}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-12">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#111827] mb-3">Setup</p>
            <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#0F172A]">Connected in 3 steps.</h2>
            <p className="mt-2 text-[#64748B] text-sm">No developers. No API keys. No headaches.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW.map((h) => (
              <div key={h.step} data-how style={{ opacity: 0 }} className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#111827]/10 border border-[#111827]/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#111827]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>{h.icon}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#111827]/60 uppercase tracking-widest">{h.step}</span>
                  <h3 className="text-sm font-bold text-[#0F172A] mt-0.5 mb-1">{h.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{h.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-16 mx-auto max-w-5xl px-6">
        <div className="text-center mb-10">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#111827] mb-3">Security</p>
          <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#0F172A]">Built with trust by default.</h2>
          <p className="mt-3 text-[#64748B] max-w-md mx-auto text-sm leading-relaxed">Connecting your social accounts should feel safe. Here is exactly how we handle your access.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border rounded-2xl overflow-hidden">
          {SECURITY_FEATURES.map((f) => (
            <SecurityCard key={f.title} feature={f} />
          ))}
        </div>
      </section>

      {/* Workflow integrations */}
      <section className="py-16 border-t border-[rgba(15,23,42,0.08)] mx-auto max-w-5xl px-6">
        <div className="text-center mb-10">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#111827] mb-3">Workflow</p>
          <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#0F172A]">Also works with your stack.</h2>
          <p className="mt-3 text-[#64748B] max-w-md mx-auto text-sm leading-relaxed">Beyond social networks — Vielinks connects to your existing workflow tools.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {WORKFLOW.map((a) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[rgba(15,23,42,0.10)] bg-[#FFFFFF] p-5 text-center hover:border-[#111827]/20 hover:bg-[#F1F5F9] transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#111827]/8 border border-[#111827]/12 flex items-center justify-center mb-3 mx-auto group-hover:bg-[#111827]/15 transition-colors">
                <span className="material-symbols-outlined text-[#111827]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
              </div>
              <p className="text-sm font-bold text-[#0F172A] mb-1">{a.name}</p>
              <p className="text-[11px] text-[#64748B] leading-snug">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </ProductShell>
  );
}
