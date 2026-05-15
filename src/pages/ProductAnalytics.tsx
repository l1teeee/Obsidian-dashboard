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
  { icon: 'visibility',    label: 'Total Reach',     value: '2.4M', change: '+18%', up: true  },
  { icon: 'thumb_up',      label: 'Avg Engagement',  value: '6.8%', change: '+3.2%', up: true },
  { icon: 'schedule_send', label: 'Posts Published', value: '148',  change: '+22',  up: true  },
  { icon: 'trending_down', label: 'Unfollow Rate',   value: '0.4%', change: '-0.1%', up: true },
];

const PLATFORMS_OVERVIEW = [
  { name: 'Instagram', icon: 'camera_alt', color: '#E4405F', reach: '1.1M', eng: '8.2%', posts: 68  },
  { name: 'LinkedIn',  icon: 'work',       color: '#0a66c2', reach: '890K', eng: '5.1%', posts: 42  },
  { name: 'Facebook',  icon: 'thumb_up',   color: '#1877f2', reach: '420K', eng: '4.8%', posts: 38  },
];

const TOP_POSTS = [
  { platform: 'ig', color: '#E4405F', label: 'Product launch reel',   reach: '38.4K', eng: '9.1%', saves: '2.1K' },
  { platform: 'li', color: '#0a66c2', label: 'State of B2B content',   reach: '22.7K', eng: '6.8%', saves: '890'  },
  { platform: 'fb', color: '#1877f2', label: 'Community Q&A thread',   reach: '15.2K', eng: '5.4%', saves: '340'  },
];

const PLATFORM_ICON: Record<string, string> = { ig: 'camera_alt', li: 'work', fb: 'thumb_up' };

const FEATURES = [
  { icon: 'bar_chart',       title: '90-day history',          body: 'Scroll back through three months of data to spot trends, seasonality, and growth milestones.' },
  { icon: 'compare_arrows',  title: 'Cross-platform compare',  body: 'See Instagram vs LinkedIn vs Facebook side by side. Know where to focus your energy.' },
  { icon: 'picture_as_pdf',  title: 'White-label PDF reports', body: 'Export clean branded reports in one click. Ready for clients and stakeholders.' },
  { icon: 'notifications',   title: 'Performance alerts',      body: 'Get notified when a post spikes, an account drops, or you hit a follower milestone.' },
  { icon: 'person_search',   title: 'Audience breakdown',      body: 'Understand who is engaging — by age, location, and device. Create content they actually want.' },
  { icon: 'radar',           title: 'Rival monitoring',        body: 'Track competitor accounts and benchmark your performance against similar creators.' },
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
    description: 'Know what is working before the next post. Vielinks breaks down reach, engagement, and saves by platform, post, and audience.',
    keywords: 'social media analytics, cross-platform metrics, social reporting, engagement tracking, Instagram analytics',
  });

  const navigate = useNavigate();
  const featRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-feat]',
        { opacity: 0, y: 28 },
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
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8553A]" /> Product · Analytics
            </span>
            <h1 className="mt-5 text-5xl md:text-[4rem] font-extrabold leading-[0.96] tracking-[-0.04em] text-[#15140F]">
              Know what is working<br />
              <span className="text-[#C8553A]">before the next post.</span>
            </h1>
            <p className="mt-6 text-lg font-light text-[#6B655B] max-w-xl mx-auto leading-relaxed">
              Clear, actionable numbers — broken down by platform, post, and audience. No spreadsheets required.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="mt-8 rounded-full bg-[#C8553A] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#A53F28] hover:shadow-[0_0_32px_rgba(200,85,58,0.4)] transition-all active:scale-[0.98]"
            >
              Start free — see your analytics
            </button>
          </motion.div>
        </div>
      </section>

      {/* Metric cards */}
      <section className="py-12 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {METRICS.map((m) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-5"
            >
              <span className="material-symbols-outlined text-[#C8553A] mb-3 block" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>
                {m.icon}
              </span>
              <p className="text-2xl font-extrabold text-[#15140F]">{m.value}</p>
              <p className="text-xs text-[#6B655B] mt-0.5">{m.label}</p>
              <span className={`mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${m.up ? 'text-[#4F7A4A] bg-[#4F7A4A]/12' : 'text-[#C8553A] bg-[#C8553A]/10'}`}>
                {m.change}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-3xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#15140F]">Weekly overview</h3>
              <p className="text-xs text-[#6B655B] mt-0.5">Reach & engagement — last 7 days</p>
            </div>
            <div className="flex gap-4 text-xs text-[#6B655B]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C8553A] inline-block" />Reach
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4A6A82] inline-block" />Engagement
              </span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="reach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#C8553A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C8553A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="eng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4A6A82" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4A6A82" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{ background: '#FBF8F2', border: '1px solid rgba(21,20,15,0.12)', borderRadius: 12, color: '#15140F', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="reach" stroke="#C8553A" strokeWidth={2} fill="url(#reach)" />
                <Area type="monotone" dataKey="eng"   stroke="#4A6A82" strokeWidth={2} fill="url(#eng)"   />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Cross-platform overview */}
      <section className="py-16 border-y border-[rgba(21,20,15,0.08)]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-10">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C8553A] mb-3">Cross-platform</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#15140F]">All your channels, one view.</h2>
            <p className="mt-3 text-[#6B655B] max-w-md mx-auto text-sm leading-relaxed">Compare performance across Instagram, LinkedIn, and Facebook. See where to focus your effort.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {PLATFORMS_OVERVIEW.map((p) => (
              <div key={p.name} className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${p.color}18`, border: `1px solid ${p.color}28` }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: p.color, fontVariationSettings: "'FILL' 1" }}>{p.icon}</span>
                  </div>
                  <span className="text-sm font-bold text-[#15140F]">{p.name}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6B655B]">Reach</span>
                    <span className="text-sm font-bold text-[#15140F]">{p.reach}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6B655B]">Engagement</span>
                    <span className="text-sm font-bold text-[#15140F]">{p.eng}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6B655B]">Posts this month</span>
                    <span className="text-sm font-bold text-[#15140F]">{p.posts}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#EFE9DC] overflow-hidden mt-1">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(p.posts / 70) * 100}%`, backgroundColor: p.color, opacity: 0.7 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top post performance */}
      <section className="py-16 mx-auto max-w-5xl px-6">
        <div className="text-center mb-10">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C8553A] mb-3">Post performance</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#15140F]">Your top posts, ranked.</h2>
          <p className="mt-3 text-[#6B655B] max-w-md mx-auto text-sm leading-relaxed">Reach, saves, and engagement rate — side by side. Know what resonates and replicate it.</p>
        </div>
        <div className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-[rgba(21,20,15,0.08)] text-[10px] font-bold uppercase tracking-[0.14em] text-[#A39B8B]">
            <span>Post</span>
            <span className="text-right w-16">Reach</span>
            <span className="text-right w-16">Saves</span>
            <span className="text-right w-16">Eng.</span>
          </div>
          {TOP_POSTS.map((p, i) => (
            <div key={i} className={`grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-4 ${i < TOP_POSTS.length - 1 ? 'border-b border-[rgba(21,20,15,0.06)]' : ''}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: `${p.color}18` }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: p.color, fontVariationSettings: "'FILL' 1" }}>{PLATFORM_ICON[p.platform]}</span>
                </div>
                <span className="text-sm text-[#15140F] font-medium truncate">{p.label}</span>
              </div>
              <span className="text-sm font-bold text-[#15140F] w-16 text-right">{p.reach}</span>
              <span className="text-sm font-bold text-[#15140F] w-16 text-right">{p.saves}</span>
              <span className="text-sm font-bold text-[#4F7A4A] w-16 text-right">{p.eng}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Reporting */}
      <section className="py-16 border-y border-[rgba(21,20,15,0.08)]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C8553A] mb-3">Reporting</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#15140F] mb-4">Share results without the work.</h2>
              <p className="text-[#6B655B] text-sm leading-relaxed mb-6">
                Export white-label PDF reports in one click. Schedule automatic weekly or monthly digests for clients and stakeholders.
              </p>
              <div className="space-y-3">
                {[
                  { icon: 'picture_as_pdf', label: 'PDF export', desc: 'Branded reports, no Vielinks logo' },
                  { icon: 'mail',           label: 'Email digest', desc: 'Scheduled weekly or monthly' },
                  { icon: 'share',          label: 'Share link',   desc: 'Read-only link to live dashboard' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C8553A]/8 border border-[#C8553A]/12 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#15140F]">{item.label}</span>
                      <span className="text-xs text-[#6B655B] ml-2">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
                <span className="text-xs font-bold text-[#15140F]">Monthly Report · April 2026</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Total reach',      value: '2.4M',  bar: 80 },
                  { label: 'Posts published',  value: '148',   bar: 60 },
                  { label: 'Avg engagement',   value: '6.8%',  bar: 70 },
                  { label: 'New followers',    value: '+3.2K', bar: 45 },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#6B655B]">{row.label}</span>
                      <span className="font-bold text-[#15140F]">{row.value}</span>
                    </div>
                    <div className="h-1 rounded-full bg-[#EFE9DC]">
                      <div className="h-full rounded-full bg-[#C8553A]/60" style={{ width: `${row.bar}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#A39B8B] mt-4">Exported as white-label PDF — ready to send.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI handoff */}
      <section className="py-12 mx-auto max-w-5xl px-6">
        <div className="rounded-2xl border border-[#C8553A]/20 bg-[#F5EBE8] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-[#C8553A]/15 border border-[#C8553A]/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>auto_fix_high</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-[#15140F] mb-1">Your data powers AI Insights</p>
            <p className="text-sm text-[#6B655B] leading-relaxed">Everything you measure here feeds directly into Vielinks AI Insights — turning past performance into your next best action.</p>
          </div>
          <button
            onClick={() => navigate('/product/ai-insights')}
            className="shrink-0 rounded-full border border-[#C8553A]/30 px-5 py-2.5 text-xs font-bold text-[#C8553A] hover:bg-[#C8553A] hover:text-white transition-all duration-200"
          >
            See AI Insights
          </button>
        </div>
      </section>

      {/* Big stats */}
      <section className="py-16 border-y border-[rgba(21,20,15,0.08)]">
        <div className="mx-auto max-w-5xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: 2400000, s: '+', label: 'Posts analyzed per month' },
            { n: 99,      s: '.9%', label: 'Uptime guarantee' },
            { n: 90,      s: ' days', label: 'Data history on Pro' },
            { n: 4,       s: 'h', label: 'Priority support response' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-4xl font-extrabold text-[#15140F]">
                <AnimatedNumber target={item.n} />{item.s}
              </p>
              <p className="text-sm text-[#6B655B] mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20 mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#15140F]">Everything in the numbers</h2>
          <p className="mt-3 text-[#6B655B] max-w-lg mx-auto">Every analytics feature you need, without the spreadsheet nightmare.</p>
        </div>
        <div ref={featRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              data-feat
              style={{ opacity: 0 }}
              className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6 hover:border-[#C8553A]/20 hover:bg-[#EFE9DC] transition-all duration-300"
            >
              <span className="material-symbols-outlined text-[#C8553A] mb-4 block" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>
                {f.icon}
              </span>
              <h3 className="text-sm font-bold text-[#15140F] mb-2">{f.title}</h3>
              <p className="text-sm text-[#6B655B] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </ProductShell>
  );
}
