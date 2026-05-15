
import { useLayoutEffect, useRef, useState } from 'react';
import { Lightbulb, TrendingUp, Tag } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const tabs = [
  {
    label: 'Analytics',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    tagline: 'Know what works, instantly.',
    description: 'Real-time metrics across all platforms. Reach, engagement rate, impressions, and growth — visible from one panel.',
  },
  {
    label: 'Scheduler',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    tagline: 'Every post, in its place.',
    description: 'Drag-and-drop calendar, queue management, and AI-suggested posting times. Plan weeks of content in minutes.',
  },
  {
    label: 'AI Insights',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    tagline: 'Post smarter, not harder.',
    description: 'AI-powered caption drafting, hashtag recommendations, best-time predictions, and content scoring before you publish.',
  },
];

/* ─── Mockups ─────────────────────────────────────────────── */
function AnalyticsMockup() {
  const bars = [42, 65, 48, 82, 58, 94, 71];
  const platforms = [
    { name: 'Instagram', reach: '64.2K', eng: '8.1%', color: '#e1306c' },
    { name: 'LinkedIn',  reach: '41.7K', eng: '5.3%', color: '#0a66c2' },
    { name: 'Facebook',  reach: '38.4K', eng: '4.8%', color: '#1877f2' },
  ];
  return (
    <div className="space-y-3">
      {/* Top metrics row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Total Reach',  value: '144.3K', delta: '+18.2%' },
          { label: 'Engagement',  value: '6.8%',   delta: '+1.4pp'  },
          { label: 'Impressions', value: '312K',    delta: '+22.1%'  },
          { label: 'Followers',   value: '+1,842',  delta: 'this week'},
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FFFFFF] p-3">
            <p className="mb-1.5 text-[0.52rem] font-bold uppercase tracking-[0.18em] text-[#15140F]/40">{m.label}</p>
            <p className="text-[1.1rem] font-bold tracking-tight text-[#15140F]">{m.value}</p>
            <span className="text-[0.58rem] font-semibold text-[#C8553A]">{m.delta}</span>
          </div>
        ))}
      </div>

      {/* Chart + platform breakdown */}
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FFFFFF] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#15140F]/45">Weekly Reach · Apr 1–7</p>
            <div className="flex gap-1">
              {['7D', '30D', '90D'].map((r, i) => (
                <span key={r} className={`rounded px-2 py-0.5 text-[0.5rem] font-bold ${i === 0 ? 'bg-[#C8553A]/15 text-[#C8553A]' : 'text-[#15140F]/20'}`}>{r}</span>
              ))}
            </div>
          </div>
          <div className="flex h-[100px] items-end gap-1.5">
            {bars.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col justify-end">
                <div
                  className="rounded-t-[4px] border-t border-[#C8553A]/30 bg-[#C8553A]/45"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1.5">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
              <span key={d} className="flex-1 text-center text-[0.45rem] font-bold uppercase text-[#15140F]/35">{d}</span>
            ))}
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="w-[140px] rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FFFFFF] p-4">
          <p className="mb-3 text-[0.52rem] font-bold uppercase tracking-[0.18em] text-[#15140F]/45">By Platform</p>
          <div className="space-y-3">
            {platforms.map((p) => (
              <div key={p.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[0.52rem] font-medium text-[#15140F]/45">{p.name}</span>
                  <span className="text-[0.52rem] font-bold text-[#15140F]/60">{p.eng}</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-[#E7E0D0]">
                  <div className="h-full rounded-full" style={{ width: `${p.name === 'Instagram' ? 67 : p.name === 'LinkedIn' ? 44 : 40}%`, backgroundColor: p.color, opacity: 0.7 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SchedulerMockup() {
  const scheduled = [3, 7, 12, 17, 21, 25, 28];
  const queue = [
    { platform: 'IG', title: 'Product launch carousel', time: 'Today · 9:00 AM',     color: '#e1306c', status: 'scheduled' },
    { platform: 'LI', title: 'Q2 industry insights',    time: 'Today · 12:30 PM',   color: '#0a66c2', status: 'scheduled' },
    { platform: 'FB', title: 'Weekend community poll',  time: 'Tomorrow · 10:00 AM', color: '#1877f2', status: 'draft'     },
    { platform: 'IG', title: 'Behind the scenes Reel',  time: 'Apr 10 · 5:00 PM',   color: '#e1306c', status: 'draft'     },
  ];

  return (
    <div className="grid grid-cols-[auto_1fr] gap-3">
      {/* Calendar */}
      <div className="w-[190px] rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FFFFFF] p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#15140F]/30">April 2026</p>
          <div className="flex gap-1">
            {['‹', '›'].map((a) => (
              <button key={a} className="flex h-5 w-5 items-center justify-center rounded-md bg-[#EFE9DC] text-[0.6rem] text-[#A39B8B]">{a}</button>
            ))}
          </div>
        </div>
        <div className="mb-1.5 grid grid-cols-7 gap-0.5 text-center">
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <span key={i} className="text-[0.48rem] font-bold text-[#15140F]/35">{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: 35 }, (_, i) => {
            const day = i;
            const valid = day >= 1 && day <= 30;
            const has = scheduled.includes(day);
            const today = day === 8;
            return (
              <div key={i} className={`flex h-6 w-full items-center justify-center rounded-md text-[0.5rem] font-medium
                ${valid ? (has ? 'bg-[#C8553A]/15 text-[#C8553A] font-bold' : today ? 'bg-[#EFE9DC] text-[#15140F] ring-1 ring-[#D8D2C4]' : 'text-[#A39B8B]') : 'text-transparent'}`}>
                {valid ? day : '·'}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-1.5 border-t border-[rgba(21,20,15,0.10)] pt-3">
          <div className="h-2 w-2 rounded-full bg-[#C8553A]/60" />
          <span className="text-[0.48rem] text-[#15140F]/30">7 posts this month</span>
        </div>
      </div>

      {/* Queue */}
      <div className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FFFFFF] p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#15140F]/30">Post Queue</p>
          <button className="rounded-lg border border-[#C8553A]/25 bg-[#C8553A]/10 px-2.5 py-1 text-[0.52rem] font-bold text-[#C8553A]">+ New post</button>
        </div>
        <div className="space-y-2">
          {queue.map((post) => (
            <div key={post.title} className="flex items-center gap-3 rounded-xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[0.52rem] font-bold" style={{ backgroundColor: `${post.color}20`, color: post.color }}>
                {post.platform}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.62rem] font-medium text-[#15140F]/65 truncate">{post.title}</p>
                <p className="text-[0.52rem] text-[#15140F]/45">{post.time}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[0.5rem] font-bold ${post.status === 'scheduled' ? 'bg-[#C8553A]/12 text-[#C8553A]' : 'bg-[#EFE9DC] text-[#A39B8B]'}`}>
                {post.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightsMockup() {
  const heat = [
    [1,2,5,8,9,7,4,2,1],
    [2,4,7,10,9,8,5,3,1],
    [1,3,5,8,9,10,7,4,2],
    [2,4,6,9,10,9,6,3,1],
    [0,2,4,6,7,6,4,2,0],
  ];
  const suggestions = [
    { Icon: Lightbulb, text: 'Post Wednesday at 11AM for 34% higher reach on LinkedIn' },
    { Icon: TrendingUp, text: 'Carousel posts get 2.4x more saves than single images' },
    { Icon: Tag,        text: '#branding posts reach 12K more on Instagram this week' },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_auto] gap-3">
        {/* Heatmap */}
        <div className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FFFFFF] p-4">
          <p className="mb-3 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#15140F]/30">Best Time to Post — All Platforms</p>
          <div className="flex gap-3">
            <div className="flex flex-col justify-around pt-1">
              {['Mon','Tue','Wed','Thu','Fri'].map((d) => (
                <span key={d} className="text-[0.48rem] font-bold text-[#15140F]/25">{d}</span>
              ))}
            </div>
            <div className="flex-1 space-y-1">
              {heat.map((row, ri) => (
                <div key={ri} className="flex gap-0.5">
                  {row.map((val, ci) => (
                    <div
                      key={ci}
                      className="flex-1 rounded-[2px]"
                      style={{ height: '16px', backgroundColor: `rgba(200,85,58,${val / 12})` }}
                    />
                  ))}
                </div>
              ))}
              <div className="flex gap-0.5 pt-1">
                {['9','10','11','12','1','2','3','4','5'].map((h) => (
                  <span key={h} className="flex-1 text-center text-[0.42rem] text-[#15140F]/35">{h}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Score */}
        <div className="flex w-[130px] flex-col items-center justify-center gap-2 rounded-2xl border border-[#C8553A]/15 bg-[#C8553A]/[0.04] p-4">
          <p className="text-[0.52rem] font-bold uppercase tracking-[0.18em] text-[#15140F]/30">Content Score</p>
          <p className="text-[2.6rem] font-extrabold leading-none tracking-tight text-[#C8553A]">94</p>
          <p className="text-center text-[0.5rem] text-[#15140F]/30">Predicted engagement percentile</p>
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[#E7E0D0]">
            <div className="h-full w-[94%] rounded-full bg-[#C8553A]" />
          </div>
        </div>
      </div>

      {/* AI suggestions */}
      <div className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FFFFFF] p-4">
        <p className="mb-3 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#15140F]/30">AI Recommendations</p>
        <div className="space-y-2">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-3">
              <s.Icon aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C8553A]" />
              <p className="text-[0.62rem] leading-relaxed text-on-surface-variant">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const mockups = [<AnalyticsMockup />, <SchedulerMockup />, <InsightsMockup />];

/* ─── Component ───────────────────────────────────────────── */
export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(['[data-sc="orb"]','[data-sc="eyebrow"]','[data-sc="title"]','[data-sc="sub"]','[data-sc="tabs"]','[data-sc="window"]'], {
        willChange: 'transform, opacity, filter',
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none none',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo('[data-sc="orb"]',    { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0)
        .fromTo('[data-sc="eyebrow"]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, 0.05)
        .fromTo('[data-sc="title"]',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.2')
        .fromTo('[data-sc="sub"]',     { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
        .fromTo('[data-sc="tabs"]',    { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, '-=0.2')
        .fromTo('[data-sc="window"]',  { opacity: 0, y: 28, scale: 0.988 }, { opacity: 1, y: 0, scale: 1, duration: 0.65 }, '-=0.25');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const switchTab = (index: number) => {
    if (index === activeTab || !contentRef.current) return;
    gsap.to(contentRef.current, {
      opacity: 0, y: 6, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        setActiveTab(index);
        gsap.fromTo(contentRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' }
        );
      },
    });
  };

  return (
    <section ref={sectionRef} id="Showcase" className="relative overflow-hidden py-28 md:py-36">
      <div data-sc="orb" style={{ opacity: 0 }} className="pointer-events-none absolute right-[8%] top-24 h-80 w-80 rounded-full bg-[#C8553A]/[0.05] blur-[110px]" />
      <div data-sc="orb" style={{ opacity: 0 }} className="pointer-events-none absolute bottom-16 left-[5%] h-72 w-72 rounded-full bg-[#A53F28]/[0.05] blur-[100px]" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span
            data-sc="eyebrow"
            style={{ opacity: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C8553A]/18 bg-[#C8553A]/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#C8553A]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#C8553A]" />
            Product Modules
          </span>
          <h2
            data-sc="title"
            style={{ opacity: 0 }}
            className="text-4xl font-extrabold leading-[0.96] tracking-[-0.04em] text-[#15140F] sm:text-5xl md:text-[3.4rem]"
          >
            Everything you need.{' '}
            <span className="text-[#C8553A]">
              Nothing you don't.
            </span>
          </h2>
          <p data-sc="sub" style={{ opacity: 0 }} className="mx-auto mt-5 max-w-lg text-[1rem] font-light leading-[1.8] text-on-surface-variant">
            Analytics, scheduling, and AI recommendations — each module designed to replace a separate tool. One subscription replaces four.
          </p>
        </div>

        {/* Tabs */}
        <div
          data-sc="tabs"
          style={{ opacity: 0 }}
          role="tablist"
          aria-label="Product modules"
          className="mb-6 flex flex-wrap justify-center gap-2"
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              role="tab"
              id={`showcase-tab-${i}`}
              aria-selected={activeTab === i}
              aria-controls="showcase-panel"
              onClick={() => switchTab(i)}
              className={`flex items-center gap-2.5 rounded-2xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                activeTab === i
                  ? 'border-[#C8553A]/30 bg-[#C8553A]/12 text-[#C8553A] shadow-[0_0_24px_rgba(200,85,58,0.15)]'
                  : 'border-[rgba(21,20,15,0.12)] bg-[#FBF8F2] text-[#6B655B] hover:border-[#C8553A]/25 hover:text-[#3D3A30]'
              }`}
            >
              <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active tab description */}
        <div data-sc="tabs" style={{ opacity: 0 }} className="mb-8 flex items-start gap-3">
          <div className="rounded-xl border border-[#C8553A]/15 bg-[#C8553A]/[0.06] px-4 py-3">
            <p className="text-[0.78rem] font-bold text-[#C8553A] mb-0.5">{tabs[activeTab].tagline}</p>
            <p className="text-[0.75rem] text-[#6B655B]">{tabs[activeTab].description}</p>
          </div>
        </div>

        {/* Window */}
        <div
          data-sc="window"
          style={{ opacity: 0 }}
          className="relative overflow-hidden rounded-[2rem] border border-[rgba(21,20,15,0.16)] bg-[#FFFFFF] shadow-[0_20px_60px_rgba(21,20,15,0.10)]"
        >
          {/* Chrome */}
          <div className="flex items-center gap-2 border-b border-[rgba(21,20,15,0.10)] bg-[#EFE9DC] px-6 py-4">
            <div className="flex gap-1.5">
              {['bg-[#ff5f57]', 'bg-[#febc2e]', 'bg-[#28c840]'].map((c) => (
                <div key={c} className={`h-3 w-3 rounded-full ${c} opacity-70`} />
              ))}
            </div>
            <div className="mx-auto flex items-center gap-2 rounded-lg border border-[rgba(21,20,15,0.10)] bg-[#FFFFFF] px-4 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[#C8553A]/50" />
              <span className="text-[0.6rem] font-medium text-[#15140F]/30">app.vielinks.com/{tabs[activeTab].label.toLowerCase().replace(' ', '-')}</span>
            </div>
          </div>

          {/* Sidebar + Content */}
          <div className="flex">
            {/* Sidebar */}
            <div className="hidden w-14 shrink-0 flex-col items-center gap-3 border-r border-[rgba(21,20,15,0.10)] py-6 md:flex">
              {tabs.map((tab, i) => (
                <div
                  key={tab.label}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl cursor-pointer transition-all duration-200 ${i === activeTab ? 'bg-[#C8553A]/15 text-[#C8553A]' : 'text-[#15140F]/35 hover:text-[#15140F]/60'}`}
                  onClick={() => switchTab(i)}
                >
                  <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                  </svg>
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-5 md:p-6">
              {/* Section header inside mockup */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[0.72rem] font-bold text-[#15140F]/70">{tabs[activeTab].label}</p>
                  <p className="text-[0.55rem] text-[#15140F]/45">Vielinks - IG, LI, FB - April 2026</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg border border-[rgba(21,20,15,0.10)] bg-[#FFFFFF] px-2.5 py-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#C8553A]" />
                    <span className="text-[0.52rem] text-[#15140F]/35">My Workspace</span>
                  </div>
                </div>
              </div>
              <div
                ref={contentRef}
                id="showcase-panel"
                role="tabpanel"
                aria-labelledby={`showcase-tab-${activeTab}`}
              >
                <div aria-hidden="true">{mockups[activeTab]}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
