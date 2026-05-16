import { useSEO } from '../hooks/useSEO';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import ProductShell from '../components/landing/ProductShell';
import SocialBrandIcon from '../components/shared/SocialBrandIcon';
import { WorkspaceFeatureGrid, type WorkspaceFeature } from '../components/landing/WorkspaceFeatureGrid';

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
  { icon: 'visibility',    label: 'Total Reach',    value: '2.4M', change: '+18%',  up: true  },
  { icon: 'thumb_up',      label: 'Avg Engagement', value: '6.8%', change: '+3.2%', up: true  },
  { icon: 'schedule_send', label: 'Posts Published', value: '148',  change: '+22',   up: true  },
  { icon: 'trending_down', label: 'Unfollow Rate',   value: '0.4%', change: '-0.1%', up: false },
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

const MsIcon = ({ name }: { name: string }) => (
  <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>
    {name}
  </span>
);

const ANALYTICS_FEATURES: WorkspaceFeature[] = [
  {
    icon: <MsIcon name="bar_chart" />,
    title: '90-day history',
    body: 'Scroll back through three months of data to spot trends, seasonality, and growth milestones.',
  },
  {
    icon: <MsIcon name="compare_arrows" />,
    title: 'Cross-platform compare',
    body: 'See Instagram vs LinkedIn vs Facebook side by side. Know where to focus your energy.',
  },
  {
    icon: <MsIcon name="picture_as_pdf" />,
    title: 'White-label PDF reports',
    body: 'Export clean branded reports in one click. Ready for clients and stakeholders.',
  },
  {
    icon: <MsIcon name="notifications" />,
    title: 'Performance alerts',
    body: 'Get notified when a post spikes, an account drops, or you hit a follower milestone.',
  },
  {
    icon: <MsIcon name="person_search" />,
    title: 'Audience breakdown',
    body: 'Understand who is engaging — by age, location, and device. Create content they actually want.',
  },
  {
    icon: <MsIcon name="radar" />,
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
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C8553A]/20 bg-[#C8553A]/8 px-4 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#C8553A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8553A]" /> Product · Analytics
            </span>
            <h1 className="mt-5 text-[clamp(36px,5vw,60px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#15140F]">
              Know what is working<br />
              <span className="text-[#C8553A]">before the next post.</span>
            </h1>
            <p className="mt-6 text-[15px] leading-[1.65] text-[#6B655B] max-w-xl mx-auto">
              Clear, actionable numbers — broken down by platform, post, and audience. No spreadsheets required.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#C8553A] px-8 py-3 text-[14px] font-medium text-white hover:bg-[#A53F28] transition-all duration-200 active:scale-[0.98]"
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
          className="rounded-2xl border border-[rgba(21,20,15,0.10)] overflow-hidden"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#EFE9DC] border-b border-[rgba(21,20,15,0.08)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A39B8B] opacity-50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#A39B8B] opacity-50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#A39B8B] opacity-50" />
            <span className="ml-3 font-mono text-[11px] text-[#6B655B]">app.vielinks.com/analytics</span>
          </div>

          {/* Dashboard content */}
          <div className="bg-[#FBF8F2] p-5 md:p-8">
            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {METRICS.map((m) => (
                <div key={m.label} className="rounded-xl border border-[rgba(21,20,15,0.08)] bg-[#F6F2EA] p-4">
                  <span className="material-symbols-outlined text-[#C8553A] mb-2 block" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>
                    {m.icon}
                  </span>
                  <p className="text-xl font-semibold text-[#15140F] tabular-nums">{m.value}</p>
                  <p className="text-[11px] text-[#6B655B] mt-0.5 leading-snug">{m.label}</p>
                  <span className={`mt-2 inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-md ${m.up ? 'text-[#4F7A4A] bg-[#4F7A4A]/10' : 'text-[#C8553A] bg-[#C8553A]/10'}`}>
                    {m.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="rounded-xl border border-[rgba(21,20,15,0.08)] bg-[#F6F2EA] p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[13px] font-medium text-[#15140F]">Weekly overview</h3>
                  <p className="text-[11px] text-[#6B655B] mt-0.5">Reach & engagement — last 7 days</p>
                </div>
                <div className="flex gap-4 text-[11px] text-[#6B655B]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#C8553A] inline-block" />Reach
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#4A6A82] inline-block" />Engagement
                  </span>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="reach" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#C8553A" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#C8553A" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="eng" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#4A6A82" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#4A6A82" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{ background: '#FBF8F2', border: '1px solid rgba(21,20,15,0.10)', borderRadius: 10, color: '#15140F', fontSize: 11 }}
                    />
                    <Area type="monotone" dataKey="reach" stroke="#C8553A" strokeWidth={1.5} fill="url(#reach)" />
                    <Area type="monotone" dataKey="eng"   stroke="#4A6A82" strokeWidth={1.5} fill="url(#eng)"   />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
        <p className="mt-3 text-center text-[11px] text-[#A39B8B]">Sample dashboard — your data will appear after connecting your accounts.</p>
      </section>

      {/* Cross-platform overview */}
      <section className="py-16 border-y border-[rgba(21,20,15,0.08)]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#C8553A] mb-3">Cross-platform</p>
            <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#15140F]">All your channels, one view.</h2>
            <p className="mt-3 text-[15px] leading-[1.65] text-[#6B655B] max-w-md mx-auto">Compare performance across Instagram, LinkedIn, and Facebook. See where to focus your effort.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {PLATFORMS_OVERVIEW.map((p) => (
              <div key={p.name} className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${p.color}18`, border: `1px solid ${p.color}28` }}
                  >
                    <SocialBrandIcon platformId={p.platformId} size={18} color={p.color} />
                  </div>
                  <span className="text-sm font-semibold text-[#15140F]">{p.name}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#6B655B]">Reach</span>
                    <span className="text-[13px] font-semibold text-[#15140F] tabular-nums">{p.reach}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#6B655B]">Engagement</span>
                    <span className="text-[13px] font-semibold text-[#15140F] tabular-nums">{p.eng}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#6B655B]">Posts this month</span>
                    <span className="text-[13px] font-semibold text-[#15140F] tabular-nums">{p.posts}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#EFE9DC] overflow-hidden mt-1">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(p.posts / 70) * 100}%`, backgroundColor: p.color, opacity: 0.65 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[11px] text-[#A39B8B]">Sample data — connect your accounts to see your real platform breakdown.</p>
        </div>
      </section>

      {/* Top post performance */}
      <section className="py-16 mx-auto max-w-5xl px-6">
        <div className="text-center mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#C8553A] mb-3">Post performance</p>
          <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#15140F]">Your top posts, ranked.</h2>
          <p className="mt-3 text-[15px] leading-[1.65] text-[#6B655B] max-w-md mx-auto">Reach, saves, and engagement rate — side by side. Know what resonates and replicate it.</p>
        </div>
        <div className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] overflow-hidden">
          {/* Header row — hide Saves on mobile */}
          <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-[rgba(21,20,15,0.08)] text-[10px] font-bold uppercase tracking-[0.14em] text-[#A39B8B]">
            <span>Post</span>
            <span className="text-right w-16">Reach</span>
            <span className="hidden sm:block text-right w-16">Saves</span>
            <span className="text-right w-16">Eng.</span>
          </div>
          {TOP_POSTS.map((p, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-4 ${i < TOP_POSTS.length - 1 ? 'border-b border-[rgba(21,20,15,0.06)]' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: `${p.color}18` }}
                >
                  <SocialBrandIcon platformId={p.platformId} size={13} color={p.color} />
                </div>
                <span className="text-[13px] text-[#15140F] font-medium truncate">{p.label}</span>
              </div>
              <span className="text-[13px] font-semibold text-[#15140F] w-16 text-right tabular-nums">{p.reach}</span>
              <span className="hidden sm:block text-[13px] font-semibold text-[#15140F] w-16 text-right tabular-nums">{p.saves}</span>
              <span className="text-[13px] font-semibold text-[#4F7A4A] w-16 text-right tabular-nums">{p.eng}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[11px] text-[#A39B8B]">Sample data — publish posts to see your real performance ranking.</p>
      </section>

      {/* Reporting */}
      <section className="py-16 border-y border-[rgba(21,20,15,0.08)]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#C8553A] mb-3">Reporting</p>
              <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#15140F] mb-4">Share results without the work.</h2>
              <p className="text-[15px] leading-[1.65] text-[#6B655B] mb-6">
                Export white-label PDF reports in one click. Schedule automatic weekly or monthly digests for clients and stakeholders.
              </p>
              <div className="space-y-3">
                {[
                  { icon: 'picture_as_pdf', label: 'PDF export',  desc: 'Branded reports, no Vielinks logo' },
                  { icon: 'mail',           label: 'Email digest', desc: 'Scheduled weekly or monthly'       },
                  { icon: 'share',          label: 'Share link',   desc: 'Read-only link to live dashboard'  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C8553A]/8 border border-[#C8553A]/12 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                    </div>
                    <div>
                      <span className="text-[12px] font-semibold text-[#15140F]">{item.label}</span>
                      <span className="text-[12px] text-[#6B655B] ml-2">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock report preview */}
            <div className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
                  <span className="text-[12px] font-semibold text-[#15140F]">Monthly Report · April 2026</span>
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#A39B8B] border border-[rgba(21,20,15,0.10)] rounded-full px-2 py-0.5">Example</span>
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
                      <span className="text-[#6B655B]">{row.label}</span>
                      <span className="text-[#A39B8B]">{row.bar}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-[#EFE9DC]">
                      <div className="h-full rounded-full bg-[#C8553A]/55" style={{ width: `${row.bar}%` }} />
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
            <p className="text-[14px] font-semibold text-[#15140F] mb-1">Your data powers AI Insights</p>
            <p className="text-[14px] leading-[1.65] text-[#6B655B]">Everything you measure here feeds directly into Vielinks AI Insights — turning past performance into your next best action.</p>
          </div>
          <button
            onClick={() => navigate('/product/ai-insights')}
            className="shrink-0 rounded-xl border border-[#C8553A]/30 px-5 py-2.5 text-[12px] font-medium text-[#C8553A] hover:bg-[#C8553A] hover:text-white transition-all duration-200"
          >
            See AI Insights
          </button>
        </div>
      </section>

      {/* Everything in the numbers */}
      <section className="py-20 mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#C8553A] mb-3">Capabilities</p>
          <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#15140F]">Everything in the numbers</h2>
          <p className="mt-3 text-[15px] leading-[1.65] text-[#6B655B] max-w-lg mx-auto">Every analytics tool your team needs, in one workspace.</p>
        </div>
        <WorkspaceFeatureGrid features={ANALYTICS_FEATURES} />
      </section>
    </ProductShell>
  );
}
