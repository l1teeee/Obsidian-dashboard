import { useSEO } from '../hooks/useSEO';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import HeroBadge from '../components/landing/HeroBadge';
import ProductShell from '../components/landing/ProductShell';
import SocialBrandIcon from '../components/shared/SocialBrandIcon';
import { WorkspaceFeatureGrid, type WorkspaceFeature } from '../components/landing/WorkspaceFeatureGrid';
import { Eye, ThumbsUp, Send, TrendingDown, BarChart2, ArrowLeftRight, FileText, Bell, Users, Activity, Mail, Share2 } from 'lucide-react';

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
  { Icon: Eye,          label: 'Total Reach',    value: '2.4M', change: '+18%',  up: true  },
  { Icon: ThumbsUp,     label: 'Avg Engagement', value: '6.8%', change: '+3.2%', up: true  },
  { Icon: Send,         label: 'Posts Published', value: '148',  change: '+22',   up: true  },
  { Icon: TrendingDown, label: 'Unfollow Rate',   value: '0.4%', change: '-0.1%', up: false },
];

const PLATFORMS_OVERVIEW = [
  { name: 'Instagram', platformId: 'instagram', color: '#E1306C', reach: '1.1M', eng: '8.2%', posts: 68 },
  { name: 'LinkedIn',  platformId: 'linkedin',  color: '#0A66C2', reach: '890K', eng: '5.1%', posts: 42 },
  { name: 'Facebook',  platformId: 'facebook',  color: '#1877F2', reach: '420K', eng: '4.8%', posts: 38 },
];

const TOP_POSTS = [
  { platformId: 'instagram', color: '#E1306C', label: 'Product launch reel',  reach: '38.4K', eng: '9.1%', saves: '2.1K' },
  { platformId: 'linkedin',  color: '#0A66C2', label: 'State of B2B content', reach: '22.7K', eng: '6.8%', saves: '890'  },
  { platformId: 'facebook',  color: '#1877F2', label: 'Community Q&A thread', reach: '15.2K', eng: '5.4%', saves: '340'  },
];

const ANALYTICS_FEATURES: WorkspaceFeature[] = [
  {
    icon: <BarChart2 size={18} aria-hidden="true" />,
    title: '90-day history',
    body: 'Scroll back through three months of data to spot trends, seasonality, and growth milestones.',
  },
  {
    icon: <ArrowLeftRight size={18} aria-hidden="true" />,
    title: 'Cross-platform compare',
    body: 'See Instagram vs LinkedIn vs Facebook side by side. Know where to focus your energy.',
  },
  {
    icon: <FileText size={18} aria-hidden="true" />,
    title: 'White-label PDF reports',
    body: 'Export clean branded reports in one click. Ready for clients and stakeholders.',
  },
  {
    icon: <Bell size={18} aria-hidden="true" />,
    title: 'Performance alerts',
    body: 'Get notified when a post spikes, an account drops, or you hit a follower milestone.',
  },
  {
    icon: <Users size={18} aria-hidden="true" />,
    title: 'Audience breakdown',
    body: 'Understand who is engaging — by age, location, and device. Create content they actually want.',
  },
  {
    icon: <Activity size={18} aria-hidden="true" />,
    title: 'Rival monitoring',
    body: 'Track competitor accounts and benchmark your performance against similar creators.',
  },
];

export default function ProductAnalytics() {
  useSEO({
    title: 'Vielinks Analytics - Cross-Platform Social Media Metrics',
    description: 'Know what is working before the next post. Vielinks breaks down reach, engagement, and saves by platform, post, and audience.',
    keywords: 'social media analytics, cross-platform metrics, social reporting, engagement tracking, Instagram analytics',
  });

  const navigate = useNavigate();

  return (
    <ProductShell>
      {/* Hero */}
      <section className="pt-36 pb-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.25, 0.4, 0.25, 1] }}>
            <HeroBadge className="mb-5">
              For teams who read the signal
            </HeroBadge>
            <h1 className="mt-5 text-[clamp(36px,5vw,60px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#0F172A]">
              Know what is working<br />
              <span className="text-[#111827]">before the next post.</span>
            </h1>
            <p className="mt-6 text-[15px] leading-[1.65] text-[#64748B] max-w-xl mx-auto">
              Clear, actionable numbers — broken down by platform, post, and audience. No spreadsheets required.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#111827] px-8 py-3 text-[14px] font-medium text-white hover:bg-[#0B1220] transition-all duration-200 active:scale-[0.98]"
            >
              Start free — see your analytics
            </button>
          </motion.div>
        </div>
      </section>

      {/* Dashboard mockup — metric KPIs + chart */}
      <section className="pb-20 mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
          className="rounded-2xl border border-[rgba(15,23,42,0.10)] overflow-hidden"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F1F5F9] border-b border-[rgba(15,23,42,0.08)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] opacity-50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] opacity-50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] opacity-50" />
            <span className="ml-3 font-mono text-[11px] text-[#64748B]">app.vielinks.com/analytics</span>
          </div>

          {/* Dashboard content */}
          <div className="bg-[#FFFFFF] p-5 md:p-8">
            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {METRICS.map((m) => (
                <div key={m.label} className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFC] p-4">
                  <m.Icon size={18} className="text-[#111827] mb-2" aria-hidden="true" />
                  <p className="text-xl font-semibold text-[#0F172A] tabular-nums">{m.value}</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">{m.label}</p>
                  <span className={`mt-2 inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-md ${m.up ? 'text-[#047857] bg-[#047857]/10' : 'text-[#111827] bg-[#111827]/10'}`}>
                    {m.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFC] p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[13px] font-medium text-[#0F172A]">Weekly overview</h3>
                  <p className="text-[11px] text-[#64748B] mt-0.5">Reach & engagement — last 7 days</p>
                </div>
                <div className="flex gap-4 text-[11px] text-[#64748B]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#111827] inline-block" />Reach
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB] inline-block" />Engagement
                  </span>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="reach" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#111827" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="eng" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.10)', borderRadius: 10, color: '#0F172A', fontSize: 11 }}
                    />
                    <Area type="monotone" dataKey="reach" stroke="#111827" strokeWidth={1.5} fill="url(#reach)" />
                    <Area type="monotone" dataKey="eng"   stroke="#2563EB" strokeWidth={1.5} fill="url(#eng)"   />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
        <p className="mt-3 text-center text-[11px] text-[#94A3B8]">Sample dashboard — your data will appear after connecting your accounts.</p>
      </section>

      {/* Cross-platform overview */}
      <section className="py-16 border-y border-[rgba(15,23,42,0.08)]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#111827] mb-3">Cross-platform</p>
            <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#0F172A]">All your channels, one view.</h2>
            <p className="mt-3 text-[15px] leading-[1.65] text-[#64748B] max-w-md mx-auto">Compare performance across Instagram, LinkedIn, and Facebook. See where to focus your effort.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {PLATFORMS_OVERVIEW.map((p) => (
              <div key={p.name} className="rounded-2xl border border-[rgba(15,23,42,0.10)] bg-[#FFFFFF] p-6">
                <div className="flex items-center gap-3 mb-5">
                  <SocialBrandIcon platformId={p.platformId} size={22} color={p.color} />
                  <span className="text-sm font-semibold text-[#0F172A]">{p.name}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748B]">Reach</span>
                    <span className="text-[13px] font-semibold text-[#0F172A] tabular-nums">{p.reach}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748B]">Engagement</span>
                    <span className="text-[13px] font-semibold text-[#0F172A] tabular-nums">{p.eng}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748B]">Posts this month</span>
                    <span className="text-[13px] font-semibold text-[#0F172A] tabular-nums">{p.posts}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden mt-1">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(p.posts / 70) * 100}%`, backgroundColor: p.color, opacity: 0.65 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[11px] text-[#94A3B8]">Sample data — connect your accounts to see your real platform breakdown.</p>
        </div>
      </section>

      {/* Top post performance */}
      <section className="py-16 mx-auto max-w-5xl px-6">
        <div className="text-center mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#111827] mb-3">Post performance</p>
          <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#0F172A]">Your top posts, ranked.</h2>
          <p className="mt-3 text-[15px] leading-[1.65] text-[#64748B] max-w-md mx-auto">Reach, saves, and engagement rate — side by side. Know what resonates and replicate it.</p>
        </div>
        <div className="rounded-2xl border border-[rgba(15,23,42,0.10)] bg-[#FFFFFF] overflow-hidden">
          {/* Header row — hide Saves on mobile */}
          <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-[rgba(15,23,42,0.08)] text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
            <span>Post</span>
            <span className="text-right w-16">Reach</span>
            <span className="hidden sm:block text-right w-16">Saves</span>
            <span className="text-right w-16">Eng.</span>
          </div>
          {TOP_POSTS.map((p, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-4 ${i < TOP_POSTS.length - 1 ? 'border-b border-[rgba(15,23,42,0.06)]' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <SocialBrandIcon platformId={p.platformId} size={16} color={p.color} />
                <span className="text-[13px] text-[#0F172A] font-medium truncate">{p.label}</span>
              </div>
              <span className="text-[13px] font-semibold text-[#0F172A] w-16 text-right tabular-nums">{p.reach}</span>
              <span className="hidden sm:block text-[13px] font-semibold text-[#0F172A] w-16 text-right tabular-nums">{p.saves}</span>
              <span className="text-[13px] font-semibold text-[#047857] w-16 text-right tabular-nums">{p.eng}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[11px] text-[#94A3B8]">Sample data — publish posts to see your real performance ranking.</p>
      </section>

      {/* Reporting */}
      <section className="py-16 border-y border-[rgba(15,23,42,0.08)]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#111827] mb-3">Reporting</p>
              <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#0F172A] mb-4">Share results without the work.</h2>
              <p className="text-[15px] leading-[1.65] text-[#64748B] mb-6">
                Export white-label PDF reports in one click. Schedule automatic weekly or monthly digests for clients and stakeholders.
              </p>
              <div className="space-y-3">
                {[
                  { Icon: FileText, label: 'PDF export',  desc: 'Branded reports, no Vielinks logo' },
                  { Icon: Mail,     label: 'Email digest', desc: 'Scheduled weekly or monthly'       },
                  { Icon: Share2,   label: 'Share link',   desc: 'Read-only link to live dashboard'  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#111827]/8 border border-[#111827]/12 flex items-center justify-center shrink-0">
                      <item.Icon size={15} className="text-[#111827]" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-[12px] font-semibold text-[#0F172A]">{item.label}</span>
                      <span className="text-[12px] text-[#64748B] ml-2">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock report preview */}
            <div className="rounded-2xl border border-[rgba(15,23,42,0.10)] bg-[#FFFFFF] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#111827]" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
                  <span className="text-[12px] font-semibold text-[#0F172A]">Monthly Report · April 2026</span>
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#94A3B8] border border-[rgba(15,23,42,0.10)] rounded-full px-2 py-0.5">Example</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Total reach',     bar: 80 },
                  { label: 'Posts published', bar: 60 },
                  { label: 'Avg engagement',  bar: 70 },
                  { label: 'New followers',   bar: 45 },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#64748B]">{row.label}</span>
                      <span className="text-[#94A3B8]">{row.bar}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-[#F1F5F9]">
                      <div className="h-full rounded-full bg-[#111827]/55" style={{ width: `${row.bar}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#94A3B8] mt-4">Exported as white-label PDF — ready to send.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI handoff */}
      <section className="py-12 mx-auto max-w-5xl px-6">
        <div className="rounded-2xl border border-[#111827]/20 bg-[#F5EBE8] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-[#111827]/15 border border-[#111827]/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#111827]" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>auto_fix_high</span>
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#0F172A] mb-1">Your data powers AI Insights</p>
            <p className="text-[14px] leading-[1.65] text-[#64748B]">Everything you measure here feeds directly into Vielinks AI Insights — turning past performance into your next best action.</p>
          </div>
          <button
            onClick={() => navigate('/ai-studio')}
            className="shrink-0 rounded-xl border border-[#111827]/30 px-5 py-2.5 text-[12px] font-medium text-[#111827] hover:bg-[#111827] hover:text-white transition-all duration-200"
          >
            See AI Insights
          </button>
        </div>
      </section>

      {/* Everything in the numbers */}
      <section className="py-20 mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#111827] mb-3">Capabilities</p>
          <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#0F172A]">Everything in the numbers</h2>
          <p className="mt-3 text-[15px] leading-[1.65] text-[#64748B] max-w-lg mx-auto">Every analytics tool your team needs, in one workspace.</p>
        </div>
        <WorkspaceFeatureGrid features={ANALYTICS_FEATURES} />
      </section>
    </ProductShell>
  );
}
