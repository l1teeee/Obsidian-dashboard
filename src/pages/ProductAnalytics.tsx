import { useEffect, useRef, useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductShell from '../components/landing/ProductShell';

gsap.registerPlugin(ScrollTrigger);

const CHART_DATA = [
  { d: 'Mon', reach: 1200, eng: 340 },
  { d: 'Tue', reach: 1900, eng: 480 },
  { d: 'Wed', reach: 1600, eng: 390 },
  { d: 'Thu', reach: 2800, eng: 720 },
  { d: 'Fri', reach: 3200, eng: 890 },
  { d: 'Sat', reach: 2600, eng: 650 },
  { d: 'Sun', reach: 4100, eng: 1100 },
];

const METRICS = [
  { icon: 'visibility',      label: 'Total Reach',       value: '2.4M',  change: '+18%', up: true  },
  { icon: 'thumb_up',        label: 'Avg Engagement',    value: '6.8%',  change: '+3.2%', up: true },
  { icon: 'schedule_send',   label: 'Posts Published',   value: '148',   change: '+22',  up: true  },
  { icon: 'trending_down',   label: 'Unfollow Rate',     value: '0.4%',  change: '-0.1%', up: true },
];

const FEATURES = [
  { icon: 'bar_chart',       title: '90-day history',         body: 'Scroll back through three months of data to spot trends, seasonality, and growth milestones.' },
  { icon: 'compare_arrows',  title: 'Cross-platform compare',  body: 'See Instagram vs LinkedIn vs Facebook side by side. Know where to focus your energy.' },
  { icon: 'picture_as_pdf',  title: 'White-label PDF reports', body: 'Export beautiful branded reports in one click. Perfect for clients and stakeholders.' },
  { icon: 'notifications',   title: 'Performance alerts',     body: 'Get notified when a post spikes, an account drops, or you hit a follower milestone.' },
  { icon: 'person_search',   title: 'Audience breakdown',     body: "Understand who's engaging — by age, location, and device. Create content they actually want." },
  { icon: 'radar',           title: 'Rival monitoring',       body: 'Track competitor accounts and benchmark your performance against similar creators.' },
];

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        start = Math.min(start + step, target);
        setVal(Math.round(start));
        if (start >= target) clearInterval(timer);
      }, 16);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

export default function ProductAnalytics() {
  useSEO({
    title: 'Vielinks Analytics - Cross-Platform Social Media Metrics',
    description: 'Stop guessing. Vielinks gives you exact numbers to grow - broken down by platform, post, and audience with 90-day history.',
    keywords: 'social media analytics, cross-platform metrics, social reporting, engagement tracking',
  });

  const navigate   = useNavigate();
  const featRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-feat]',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: featRef.current, start: 'top 78%', once: true } }
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
              <span className="h-1.5 w-1.5 rounded-full bg-[#7DD3C7]" /> Product · Analytics
            </span>
            <h1 className="mt-5 text-5xl md:text-[4rem] font-extrabold leading-[0.96] tracking-[-0.04em] text-[#1C1814]">
              Data that tells you<br />
              <span className="bg-gradient-to-r from-[#7DD3C7] via-[#f0dcff] to-inverse-primary bg-clip-text text-transparent">
                what to do next.
              </span>
            </h1>
            <p className="mt-6 text-lg font-light text-[#1C1814]/55 max-w-xl mx-auto leading-relaxed">
              Stop guessing. Vielinks gives you the exact numbers you need to grow — broken down by platform, post, and audience.
            </p>
            <button onClick={() => navigate('/register')} className="mt-8 rounded-full bg-[#7DD3C7] px-8 py-3.5 text-sm font-bold text-[#0B0B0A] hover:shadow-[0_0_32px_rgba(125,211,199,0.4)] transition-all active:scale-[0.98]">
              Start free — see your analytics
            </button>
          </motion.div>
        </div>
      </section>

      {/* Live metric cards */}
      <section className="py-12 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {METRICS.map((m) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-white/[0.07] bg-[#111]/80 p-5"
            >
              <span className="material-symbols-outlined text-[#7DD3C7] mb-3 block" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>
                {m.icon}
              </span>
              <p className="text-2xl font-extrabold text-[#1C1814]">{m.value}</p>
              <p className="text-xs text-[#1C1814]/40 mt-0.5">{m.label}</p>
              <span className={`mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${m.up ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                {m.change}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Chart preview */}
        <div className="rounded-3xl border border-white/[0.07] bg-[#111]/70 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#1C1814]">Weekly overview</h3>
              <p className="text-xs text-[#1C1814]/40 mt-0.5">Reach & engagement — last 7 days</p>
            </div>
            <div className="flex gap-4 text-xs text-[#1C1814]/50">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7DD3C7] inline-block" />Reach</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#a78bfa] inline-block" />Engagement</span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="reach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7DD3C7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7DD3C7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="eng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{ background: '#1a1919', border: '1px solid rgba(76,68,80,0.3)', borderRadius: 12, color: '#e5e2e1', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="reach" stroke="#7DD3C7" strokeWidth={2} fill="url(#reach)" />
                <Area type="monotone" dataKey="eng"   stroke="#a78bfa" strokeWidth={2} fill="url(#eng)"   />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Big stats */}
      <section className="py-16 border-y border-white/[0.05]">
        <div className="mx-auto max-w-5xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: 2400000, s: '+', label: 'Posts analyzed/month' },
            { n: 99, s: '.9%', label: 'Uptime guarantee' },
            { n: 90, s: ' days', label: 'Data history on Pro' },
            { n: 4, s: 'h', label: 'Priority support response' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-4xl font-extrabold text-[#1C1814]">
                <AnimatedNumber target={item.n} />{item.s}
              </p>
              <p className="text-sm text-[#1C1814]/40 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20 mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1C1814]">Everything in the numbers</h2>
          <p className="mt-3 text-[#1C1814]/45 max-w-lg mx-auto">Every analytics feature you need, without the spreadsheet nightmare.</p>
        </div>
        <div ref={featRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} data-feat style={{ opacity: 0 }} className="rounded-2xl border border-white/[0.07] bg-[#111]/70 p-6 hover:border-[#7DD3C7]/20 hover:bg-[#181818]/80 transition-all duration-300">
              <span className="material-symbols-outlined text-[#7DD3C7] mb-4 block" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>
                {f.icon}
              </span>
              <h3 className="text-sm font-bold text-[#1C1814] mb-2">{f.title}</h3>
              <p className="text-sm text-[#1C1814]/45 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </ProductShell>
  );
}
