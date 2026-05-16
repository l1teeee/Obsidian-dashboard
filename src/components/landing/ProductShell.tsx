import { type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SiteNav from './SiteNav';
import ObsidianFooter from './ObsidianFooter';

interface ProductShellProps {
  children: ReactNode;
}

type Nav = ReturnType<typeof useNavigate>;

const MsIcon = ({ name, size = 18, color }: { name: string; size?: number; color?: string }) => (
  <span
    className="material-symbols-outlined"
    aria-hidden="true"
    style={{ fontSize: size, color, fontVariationSettings: "'FILL' 1" }}
  >
    {name}
  </span>
);

function CTAButtons({
  navigate,
  primaryLabel = 'Start free',
  align = 'left',
}: {
  navigate: Nav;
  primaryLabel?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={`mt-8 flex flex-wrap gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
      <button
        type="button"
        onClick={() => navigate('/register')}
        className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-[#C8553A] px-6 py-2.5 text-[14px] font-medium text-white transition-all duration-200 hover:bg-[#A53F28] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8553A] focus-visible:ring-offset-2 active:scale-[0.98]"
      >
        {primaryLabel}
      </button>
      <button
        type="button"
        onClick={() => navigate('/pricing')}
        className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-[#D8D2C4] px-6 py-2.5 text-[14px] font-medium text-[#3D3A30] transition-all duration-200 hover:border-[#C8553A]/30 hover:bg-[#EFE9DC] hover:text-[#15140F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8553A] focus-visible:ring-offset-2"
      >
        View pricing
      </button>
    </div>
  );
}

// ─── Scheduler CTA: open calendar timeline strip ───────────────────────────
function SchedulerCTA({ navigate }: { navigate: Nav }) {
  const days = [
    { d: 'Mon', posts: [{ color: '#E1306C', time: '10:00', label: 'Product reel' }] },
    { d: 'Tue', posts: [{ color: '#0A66C2', time: '09:00', label: 'Industry' }, { color: '#1877F2', time: '18:00', label: 'Weekend promo' }] },
    { d: 'Wed', posts: [] as { color: string; time: string; label: string }[] },
    { d: 'Thu', posts: [{ color: '#E1306C', time: '12:00', label: 'Behind scenes' }] },
    { d: 'Fri', posts: [{ color: '#0A66C2', time: '08:30', label: 'Team spotlight' }] },
    { d: 'Sat', posts: [] as { color: string; time: string; label: string }[] },
    { d: 'Sun', posts: [{ color: '#E1306C', time: '11:00', label: 'Recap' }, { color: '#1877F2', time: '15:00', label: 'Community' }] },
  ];

  return (
    <section className="border-t border-[rgba(21,20,15,0.08)] py-24 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Centered text block */}
        <div className="mb-14 text-center">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#C8553A]">
            Before the calendar fills
          </p>
          <h2 className="mx-auto max-w-2xl text-[clamp(32px,4.5vw,54px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#15140F]">
            Turn the next month of posts into a calm schedule.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-[1.65] text-[#6B655B]">
            Map campaign ideas into days, review every slot with your team, and publish across each channel without rebuilding the plan in another tool.
          </p>
          <CTAButtons navigate={navigate} primaryLabel="Start free" align="center" />
        </div>

        {/* Open calendar timeline — no outer card box, columns are the visual */}
        <div className="overflow-x-auto -mx-2">
          <div className="min-w-[560px] px-2">
            {/* Day name row */}
            <div className="mb-2 grid grid-cols-7">
              {days.map(d => (
                <div key={d.d} className="text-center">
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A39B8B]">{d.d}</span>
                </div>
              ))}
            </div>
            {/* Hairline column grid */}
            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[rgba(21,20,15,0.06)]">
              {days.map(d => (
                <div key={d.d} className="min-h-[108px] bg-[#FBF8F2] p-2.5">
                  <div className="space-y-1.5">
                    {d.posts.map((p, i) => (
                      <div
                        key={i}
                        className="rounded-md px-2 py-1.5"
                        style={{ backgroundColor: `${p.color}14`, border: `1px solid ${p.color}28` }}
                      >
                        <p className="font-mono text-[9px] font-medium leading-none" style={{ color: p.color }}>{p.time}</p>
                        <p className="mt-0.5 truncate text-[9px] leading-tight text-[#3D3A30]">{p.label}</p>
                      </div>
                    ))}
                    {d.posts.length === 0 && (
                      <div className="h-8 rounded-md border border-dashed border-[rgba(21,20,15,0.10)]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[12px] text-[#A39B8B]">
          Drafts, approvals, and publish windows stay in one timeline.
          <span className="ml-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#C8553A]">No card required</span>
        </p>
      </div>
    </section>
  );
}

// ─── Analytics CTA: editorial two-column report layout ────────────────────
function AnalyticsCTA({ navigate }: { navigate: Nav }) {
  const platforms = [
    { name: 'Instagram', color: '#E1306C', reach: '1.1M', eng: '8.2%', bar: 78 },
    { name: 'LinkedIn',  color: '#0A66C2', reach: '890K', eng: '5.1%', bar: 60 },
    { name: 'Facebook',  color: '#1877F2', reach: '420K', eng: '4.8%', bar: 40 },
  ];

  return (
    <section className="border-t border-[rgba(21,20,15,0.08)] py-24 px-6">
      <div className="mx-auto max-w-6xl grid gap-16 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        {/* Left: text + buttons */}
        <div>
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#C8553A]">
            Before the next report
          </p>
          <h2 className="text-[clamp(32px,4.5vw,54px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#15140F]">
            Turn performance signals into the next clear decision.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-[1.65] text-[#6B655B]">
            See which posts moved reach, saves, and engagement, then bring those learnings back into the next brief before the calendar fills again.
          </p>
          <CTAButtons navigate={navigate} primaryLabel="Start free" />
          <p className="mt-5 text-[12px] text-[#A39B8B]">
            Platform, post, and audience context stay connected. · No card required
          </p>
        </div>

        {/* Right: open report strip — no outer card, just rows with dividers */}
        <div>
          <div className="mb-3 flex items-center justify-between border-b border-[rgba(21,20,15,0.08)] pb-3">
            <span className="font-mono text-[11px] text-[#6B655B]">april 2026 · performance</span>
            <span className="rounded-full border border-[rgba(21,20,15,0.10)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#A39B8B]">Mockup</span>
          </div>
          <div className="divide-y divide-[rgba(21,20,15,0.07)]">
            {platforms.map(p => (
              <div key={p.name} className="py-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-[13px] font-semibold text-[#15140F]">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-5 tabular-nums">
                    <span className="text-[12px] font-medium text-[#3D3A30]">{p.reach}</span>
                    <span className="text-[12px] font-medium text-[#4F7A4A]">{p.eng}</span>
                  </div>
                </div>
                <div className="h-px overflow-hidden rounded-full bg-[#EFE9DC]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p.bar}%`, backgroundColor: p.color, opacity: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-[rgba(21,20,15,0.08)]">
            {[
              { label: 'Total reach', v: '2.4M' },
              { label: 'Avg eng.',    v: '6.8%' },
              { label: 'Posts',       v: '148'  },
            ].map(m => (
              <div key={m.label} className="bg-[#F6F2EA] py-3 text-center">
                <p className="text-[15px] font-semibold tabular-nums text-[#15140F]">{m.v}</p>
                <p className="text-[10px] text-[#A39B8B]">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── AI Insights CTA: flow diagram → brief → suggestion → review ──────────
function AIInsightsCTA({ navigate }: { navigate: Nav }) {
  return (
    <section className="border-t border-[rgba(21,20,15,0.08)] py-24 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Flow: Brief → AI Suggestion → In review — visual leads */}
        <div className="mb-14 flex flex-col gap-3 md:flex-row md:items-stretch md:gap-0">
          {/* Step 1: Brief */}
          <div className="flex-1 rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-5">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#A39B8B]">Brief</p>
            <p className="text-[13px] leading-[1.6] text-[#3D3A30]">
              Launch post for a new content calendar, keep the voice calm and useful.
            </p>
          </div>

          {/* Arrow — desktop only */}
          <div className="hidden items-center justify-center px-3 text-[#D8D2C4] md:flex">
            <MsIcon name="arrow_forward" size={16} />
          </div>

          {/* Step 2: AI suggestion */}
          <div className="flex-1 rounded-2xl border border-[#C8553A]/20 bg-[#F4E0D6] p-5">
            <div className="mb-2 flex items-center gap-1.5 text-[#C8553A]">
              <MsIcon name="auto_awesome" size={13} />
              <p className="text-[10px] font-medium uppercase tracking-[0.16em]">AI suggestion</p>
            </div>
            <p className="text-[13px] leading-[1.6] text-[#15140F]">
              Show how the team can see the whole month before approving a single post.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] text-[#A53F28]">Confidence: High</span>
              <span className="h-1 w-1 rounded-full bg-[#D4A898]" />
              <span className="text-[10px] text-[#A53F28]">Tone matched</span>
            </div>
          </div>

          {/* Arrow — desktop only */}
          <div className="hidden items-center justify-center px-3 text-[#D8D2C4] md:flex">
            <MsIcon name="arrow_forward" size={16} />
          </div>

          {/* Step 3: Human review */}
          <div className="flex-1 rounded-2xl border border-[#D8D2C4] bg-[#FBF8F2] p-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A39B8B]">In review</p>
              <span className="rounded-full bg-[#B7841E]/10 px-2 py-0.5 text-[9px] font-medium text-[#B7841E]">
                Awaiting
              </span>
            </div>
            <p className="text-[13px] leading-[1.6] text-[#6B655B]">
              Show how the team can see the whole month...
            </p>
            <div className="mt-3 flex gap-2">
              <span className="cursor-default rounded-lg border border-[#4F7A4A]/20 bg-[#4F7A4A]/8 px-2.5 py-1 text-[10px] font-medium text-[#4F7A4A]">
                Approve
              </span>
              <span className="cursor-default rounded-lg border border-[rgba(21,20,15,0.10)] px-2.5 py-1 text-[10px] font-medium text-[#6B655B]">
                Edit
              </span>
            </div>
          </div>
        </div>

        {/* Text + buttons — centered, below the flow */}
        <div className="text-center">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#C8553A]">
            Before the blank caption
          </p>
          <h2 className="mx-auto max-w-2xl text-[clamp(32px,4.5vw,54px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#15140F]">
            Let AI suggest the next move without taking over the voice.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-[1.65] text-[#6B655B]">
            Use your performance data, brand tone, and campaign context to shape caption drafts and content recommendations your team can still review.
          </p>
          <CTAButtons navigate={navigate} primaryLabel="Try AI Insights free" align="center" />
          <p className="mt-5 text-[12px] text-[#A39B8B]">
            Suggestions stay reviewable before anything is published.
            <span className="ml-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#C8553A]">No card required</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Integrations CTA: hub connection map ─────────────────────────────────
function IntegrationsCTA({ navigate }: { navigate: Nav }) {
  return (
    <section className="border-t border-[rgba(21,20,15,0.08)] py-24 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Hub diagram — visual leads, text follows */}
        <div className="mb-14 overflow-x-auto">
          <div className="mx-auto min-w-[460px] max-w-lg">
            {/* Top row: Instagram — line — Vielinks hub — line — LinkedIn */}
            <div className="flex items-center">
              <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#E1306C]/20 bg-[#FBF8F2] px-3.5 py-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#E1306C]" />
                <span className="text-[12px] font-semibold text-[#15140F]">Instagram</span>
                <span className="rounded-full bg-[#4F7A4A]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#4F7A4A]">Live</span>
              </div>
              <div className="h-px flex-1 bg-[#D8D2C4] opacity-50" />
              {/* Center hub */}
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border border-[#C8553A]/24 bg-[#F4E0D6] text-[#C8553A]">
                <MsIcon name="hub" size={22} />
                <span className="font-mono text-[8px]">Vielinks</span>
              </div>
              <div className="h-px flex-1 bg-[#D8D2C4] opacity-50" />
              <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#0A66C2]/20 bg-[#FBF8F2] px-3.5 py-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#0A66C2]" />
                <span className="text-[12px] font-semibold text-[#15140F]">LinkedIn</span>
                <span className="rounded-full bg-[#4F7A4A]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#4F7A4A]">Live</span>
              </div>
            </div>

            {/* Vertical connector from hub to Facebook */}
            <div className="flex justify-center">
              <div className="h-7 w-px border-l border-[#D8D2C4] opacity-50" />
            </div>

            {/* Bottom: Facebook */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 rounded-xl border border-[#1877F2]/20 bg-[#FBF8F2] px-3.5 py-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#1877F2]" />
                <span className="text-[12px] font-semibold text-[#15140F]">Facebook</span>
                <span className="rounded-full bg-[#4F7A4A]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#4F7A4A]">Live</span>
              </div>
            </div>

            {/* Status strip */}
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              {[
                { icon: 'lock',          label: 'OAuth 2.0',  sub: 'No password stored' },
                { icon: 'sync',          label: 'Auto-sync',  sub: 'Every hour'          },
                { icon: 'notifications', label: 'Alerts',     sub: 'When issues arise'   },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-[rgba(21,20,15,0.08)] bg-[#FBF8F2] px-3 py-3">
                  <MsIcon name={s.icon} size={14} color="#C8553A" />
                  <p className="mt-1 text-[11px] font-semibold text-[#15140F]">{s.label}</p>
                  <p className="text-[9px] text-[#A39B8B]">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Text + buttons — centered, below the hub */}
        <div className="text-center">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#C8553A]">
            Before another connection breaks
          </p>
          <h2 className="mx-auto max-w-2xl text-[clamp(32px,4.5vw,54px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#15140F]">
            Keep every channel connected to one publishing rhythm.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-[1.65] text-[#6B655B]">
            Bring Instagram, LinkedIn, and Facebook into a single workspace with clear connection states, secure OAuth flows, and alerts when something needs attention.
          </p>
          <CTAButtons navigate={navigate} primaryLabel="Connect your accounts" align="center" />
          <p className="mt-5 text-[12px] text-[#A39B8B]">
            Connections, permissions, and alerts stay visible.
            <span className="ml-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#C8553A]">No card required</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Dashboard CTA: operational command board ─────────────────────────────
function DashboardCTA({ navigate }: { navigate: Nav }) {
  const priorities = [
    { n: '01', label: 'Needs review',     count: '3 posts',  color: '#B7841E', bg: '#FDF6E8', border: '#E8C97A' },
    { n: '02', label: 'Ready to publish', count: '5 posts',  color: '#4F7A4A', bg: '#EBF2EA', border: '#A8C9A4' },
    { n: '03', label: 'Watch analytics',  count: '2 alerts', color: '#C8553A', bg: '#F5EBE8', border: '#D4A898' },
  ];
  const agenda = [
    { label: 'Calendar handoff to client', done: true  },
    { label: 'Approval queue — 3 pending', done: false },
    { label: 'Client report export',       done: false },
    { label: 'Post-live confirmation IG',  done: true  },
  ];

  return (
    <section className="border-t border-[rgba(21,20,15,0.08)] py-24 px-6">
      <div className="mx-auto max-w-6xl grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-start">
        {/* Left: text + buttons */}
        <div>
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#C8553A]">
            Before work spreads out
          </p>
          <h2 className="text-[clamp(32px,4.5vw,54px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#15140F]">
            Bring the day's publishing work back to one view.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-[1.65] text-[#6B655B]">
            Use one workspace to see what is scheduled, what needs review, what changed in performance, and where your team should focus next.
          </p>
          <CTAButtons navigate={navigate} primaryLabel="Start free" />
          <p className="mt-5 text-[12px] text-[#A39B8B]">
            Calendar, approvals, analytics, and channels stay in one place. · No card required
          </p>
        </div>

        {/* Right: compact operational board — two-column hairline grid */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[rgba(21,20,15,0.07)]">
          {/* Priorities column */}
          <div className="bg-[#FBF8F2] p-4">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.14em] text-[#A39B8B]">Priorities</p>
            <div className="space-y-2">
              {priorities.map(p => (
                <div
                  key={p.n}
                  className="rounded-lg px-3 py-3"
                  style={{ backgroundColor: p.bg, border: `1px solid ${p.border}` }}
                >
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: p.color }}>
                    P{p.n}
                  </p>
                  <p className="text-[12px] font-semibold leading-snug text-[#15140F]">{p.label}</p>
                  <p className="text-[10px] text-[#6B655B]">{p.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Today's agenda column */}
          <div className="bg-[#FBF8F2] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A39B8B]">Today</p>
              <span className="rounded-full bg-[#EFE9DC] px-2 py-0.5 text-[9px] text-[#6B655B]">Team</span>
            </div>
            <div className="space-y-2.5">
              {agenda.map((t, i) => (
                <div key={i} className="flex items-start gap-2 py-0.5">
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      t.done ? 'border-[#4F7A4A] bg-[#4F7A4A]' : 'border-[#D8D2C4]'
                    }`}
                  >
                    {t.done && <MsIcon name="check" size={9} color="white" />}
                  </div>
                  <span
                    className={`text-[11px] leading-snug ${
                      t.done ? 'text-[#A39B8B] line-through' : 'text-[#15140F]'
                    }`}
                  >
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Default CTA: fallback for other routes ───────────────────────────────
function DefaultCTA({ navigate }: { navigate: Nav }) {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[rgba(21,20,15,0.12)] bg-[#FBF8F2]">
        <div className="px-8 py-14 text-center">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#C8553A]">
            Before the next post
          </p>
          <h2 className="mx-auto max-w-xl text-[clamp(32px,4.5vw,54px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#15140F]">
            Bring the next campaign into one calm workspace.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-[1.65] text-[#6B655B]">
            Start with a cleaner publishing rhythm: plan the work, review it with your team, and learn from every post without opening another tab.
          </p>
          <CTAButtons navigate={navigate} align="center" />
          <p className="mt-6 text-[12px] text-[#A39B8B]">
            Instagram, LinkedIn, and Facebook in one review loop. · No card required
          </p>
        </div>
      </div>
    </section>
  );
}

export function ProductCTA() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (pathname === '/product/scheduler')    return <SchedulerCTA    navigate={navigate} />;
  if (pathname === '/product/analytics')    return <AnalyticsCTA    navigate={navigate} />;
  if (pathname === '/product/ai-insights')  return <AIInsightsCTA   navigate={navigate} />;
  if (pathname === '/product/integrations') return <IntegrationsCTA navigate={navigate} />;
  if (pathname === '/product/dashboard')    return <DashboardCTA    navigate={navigate} />;
  return <DefaultCTA navigate={navigate} />;
}

export default function ProductShell({ children }: ProductShellProps) {
  return (
    <div className="min-h-screen bg-[#F6F2EA] text-[#15140F] overflow-x-hidden">
      <SiteNav />
      <main>{children}</main>
      <ProductCTA />
      <ObsidianFooter />
    </div>
  );
}
