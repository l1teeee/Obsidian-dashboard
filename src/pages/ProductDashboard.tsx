import { useEffect, useRef } from 'react';
import { useSEO } from '../hooks/useSEO';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroBadge from '../components/landing/HeroBadge';
import ProductShell from '../components/landing/ProductShell';

gsap.registerPlugin(ScrollTrigger);

const BENTO = [
  {
    span: 'col-span-2',
    icon: 'monitoring',
    title: 'Live performance feed',
    desc: 'Watch likes, comments and reach update in real-time — no refresh needed.',
    stat: '↑ 34%',
    statLabel: 'avg. engagement this week',
    accent: true,
  },
  {
    span: 'col-span-1',
    icon: 'hub',
    title: 'Core platforms, one view',
    desc: 'Instagram, LinkedIn and Facebook in a single unified dashboard.',
    stat: '3',
    statLabel: 'platforms connected',
  },
  {
    span: 'col-span-1',
    icon: 'schedule',
    title: 'Upcoming queue',
    desc: 'See every scheduled post at a glance. Drag to reorder, click to edit.',
    stat: '12',
    statLabel: 'posts queued this week',
  },
  {
    span: 'col-span-1',
    icon: 'emoji_events',
    title: 'Top content',
    desc: 'Your highest-performing posts surfaced automatically so you can double down.',
    stat: '#1',
    statLabel: 'post reached 8.4k people',
  },
  {
    span: 'col-span-2',
    icon: 'auto_awesome',
    title: 'AI-powered suggestions',
    desc: 'Get actionable tips — best caption length, optimal posting times, trending hashtags — tailored to each platform.',
    stat: '10x',
    statLabel: 'faster content decisions',
    accent: true,
  },
];

const STEPS = [
  { n: '01', title: 'Connect your accounts', body: 'Link Instagram, LinkedIn and Facebook in under 60 seconds. No developer credentials required.' },
  { n: '02', title: 'Import or create content', body: 'Upload media, write captions with AI assistance, and preview exactly how each post will look.' },
  { n: '03', title: 'Publish or schedule', body: 'Go live instantly or queue posts for the optimal time. Vielinks handles the rest.' },
];

export default function ProductDashboard() {
  useSEO({
    title: 'Vielinks Dashboard - Manage All Social Media in One Place',
    description: 'One dashboard to see every metric, manage every post, and act on every insight across Instagram, LinkedIn, and Facebook.',
    keywords: 'social media dashboard, multi-platform management, social analytics dashboard, post management',
  });

  const navigate = useNavigate();
  const gridRef  = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-bento]',
        { opacity: 0, y: 32, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 75%', once: true } }
      );
      gsap.fromTo('[data-step]',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: stepsRef.current, start: 'top 78%', once: true } }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <ProductShell>
      {/* Hero */}
      <section className="pt-36 pb-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <HeroBadge className="mb-5">
              For teams who keep work in view
            </HeroBadge>
            <h1 className="mt-5 text-[clamp(36px,5vw,60px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#0F172A]">
              Your social media,<br />
              <span className="text-[#111827]">finally under control.</span>
            </h1>
            <p className="mt-6 text-[15px] leading-[1.65] text-[#64748B] max-w-xl mx-auto">
              One dashboard to see every metric, manage every post, and act on every insight — across all your platforms.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate('/register')} className="inline-flex items-center justify-center rounded-xl bg-[#111827] px-7 py-3 text-[14px] font-medium text-white hover:bg-[#0B1220] transition-all duration-200 active:scale-[0.98]">
                Start for free
              </button>
              <button onClick={() => navigate('/pricing')} className="inline-flex items-center justify-center rounded-xl border border-[#CBD5E1] px-7 py-3 text-[14px] font-medium text-[#334155] hover:border-[#111827]/30 hover:bg-[#F1F5F9] transition-all duration-200">
                See pricing
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento grid */}
      <section className="py-16 mx-auto max-w-6xl px-6">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BENTO.map((card, i) => (
            <div
              key={i}
              data-bento
              style={{ opacity: 0 }}
              className={`${card.span} rounded-2xl border p-7 flex flex-col gap-4 ${
                card.accent
                  ? 'border-[#111827]/20 bg-[#F1F5F9]'
                  : 'border-[rgba(15,23,42,0.10)] bg-[#FFFFFF]'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-[#111827]/10 border border-[#111827]/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#111827]" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>
                  {card.icon}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#0F172A] mb-1">{card.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{card.desc}</p>
              </div>
              <div className="pt-3 border-t border-[rgba(15,23,42,0.08)]">
                <span className="text-2xl font-semibold text-[#0F172A] tracking-tight">{card.stat}</span>
                <span className="ml-2 text-xs text-[#334155]">{card.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 mx-auto max-w-5xl px-6">
        <div className="text-center mb-14">
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#111827]">How it works</span>
          <h2 className="mt-3 text-[clamp(28px,4vw,44px)] font-medium tracking-[-0.03em] text-[#0F172A]">Up and running in minutes</h2>
        </div>
        <div ref={stepsRef} className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} data-step style={{ opacity: 0 }} className="rounded-2xl border border-[rgba(15,23,42,0.10)] bg-[#FFFFFF] p-8">
              <span className="text-5xl font-semibold text-[#111827]/20 leading-none block mb-4">{s.n}</span>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">{s.title}</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </ProductShell>
  );
}
