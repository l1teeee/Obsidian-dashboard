import { motion } from 'framer-motion';
import { useFadeNav } from '@/hooks/useFadeNav';

/* ── Mini dashboard mockup ───────────────────────────────── */
function DashboardMockup() {
  const kpis = [
    { label: 'Total Reach', value: '2.4M', delta: '+18.2%', up: true },
    { label: 'Engagement', value: '342K', delta: '+12.4%', up: true },
    { label: 'Scheduled', value: '28', delta: 'posts', up: null },
  ];

  const upcoming = [
    { platform: 'IG', label: 'Product launch carousel', time: 'Today · 9:00 AM', color: '#e1306c' },
    { platform: 'LI', label: 'Q2 industry insights', time: 'Today · 12:30 PM', color: '#0a66c2' },
    { platform: 'FB', label: 'Weekend community poll', time: 'Tomorrow · 10:00 AM', color: '#1877f2' },
  ];

  const bars = [32, 58, 41, 75, 53, 88, 67];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div
      className="relative mx-auto w-full max-w-[900px] overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#0d0d0d] shadow-[0_40px_120px_rgba(0,0,0,0.6),0_0_0_1px_rgba(211,148,255,0.06)]"
      style={{ transform: 'perspective(1400px) rotateX(4deg)', transformOrigin: 'top center' }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#111111] px-5 py-3.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] opacity-75" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e] opacity-75" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#28c840] opacity-75" />
        </div>
        <div className="mx-auto flex items-center gap-2 rounded-md border border-white/[0.05] bg-white/[0.03] px-4 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-[#d394ff]/50" />
          <span className="text-[0.58rem] font-medium text-white/30">app.vielinks.com</span>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-6 rounded-md bg-white/[0.04]" />
        </div>
      </div>

      {/* App layout */}
      <div className="flex" style={{ height: '380px' }}>
        {/* Sidebar */}
        <div className="flex w-[52px] shrink-0 flex-col items-center gap-1 border-r border-white/[0.05] bg-[#0a0a0a] py-4">
          {/* Logo mark */}
          <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-xl bg-[#d394ff]/15">
            <div className="h-3.5 w-3.5 rounded-full bg-[#d394ff]" />
          </div>
          {/* Nav icons */}
          {[
            'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            'M13 10V3L4 14h7v7l9-11h-7z',
          ].map((d, i) => (
            <div
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${i === 0 ? 'bg-[#d394ff]/12 text-[#d394ff]' : 'text-white/20 hover:text-white/40'}`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={d} />
              </svg>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-3">
            <div>
              <p className="text-[0.7rem] font-bold text-white/80">Dashboard</p>
              <p className="text-[0.55rem] text-white/25">April 2026 · All platforms</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
                <span className="text-[0.55rem] font-medium text-white/40">My Workspace</span>
              </div>
              <div className="h-6 w-6 rounded-full bg-[#d394ff]/20 ring-1 ring-[#d394ff]/30" />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 gap-4 overflow-hidden p-4">
            {/* Left: KPIs + Chart */}
            <div className="flex flex-1 flex-col gap-3">
              {/* KPI cards */}
              <div className="grid grid-cols-3 gap-2.5">
                {kpis.map((k) => (
                  <div key={k.label} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                    <p className="mb-1.5 text-[0.5rem] font-bold uppercase tracking-[0.18em] text-white/25">{k.label}</p>
                    <p className="text-[1.05rem] font-bold tracking-tight text-white">{k.value}</p>
                    <span className={`text-[0.52rem] font-semibold ${k.up === true ? 'text-[#d394ff]' : k.up === false ? 'text-red-400' : 'text-white/30'}`}>
                      {k.delta}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="flex-1 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[0.52rem] font-bold uppercase tracking-[0.18em] text-white/25">Weekly Engagement</p>
                  <div className="flex gap-1">
                    {['7D', '30D', '90D'].map((r, i) => (
                      <span key={r} className={`rounded px-1.5 py-0.5 text-[0.45rem] font-bold ${i === 0 ? 'bg-[#d394ff]/15 text-[#d394ff]' : 'text-white/20'}`}>{r}</span>
                    ))}
                  </div>
                </div>
                <div className="flex h-[90px] items-end gap-1">
                  {bars.map((h, i) => (
                    <div key={i} className="flex flex-1 flex-col justify-end">
                      <div
                        className="rounded-t-[3px] border-t border-[#d394ff]/30 bg-gradient-to-t from-[#d394ff]/55 via-[#d394ff]/20 to-[#d394ff]/5"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 flex gap-1">
                  {days.map((d) => (
                    <span key={d} className="flex-1 text-center text-[0.4rem] font-bold uppercase text-white/20">{d}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Upcoming posts */}
            <div className="w-[190px] shrink-0">
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 h-full">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[0.52rem] font-bold uppercase tracking-[0.18em] text-white/25">Upcoming Posts</p>
                  <span className="rounded-full bg-[#d394ff]/12 px-1.5 py-0.5 text-[0.45rem] font-bold text-[#d394ff]">28</span>
                </div>
                <div className="space-y-2.5">
                  {upcoming.map((post) => (
                    <div key={post.label} className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5">
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <div className="flex h-4 w-4 items-center justify-center rounded-md text-[0.45rem] font-bold text-white" style={{ backgroundColor: `${post.color}22`, color: post.color }}>
                          {post.platform}
                        </div>
                        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: post.color, opacity: 0.7 }} />
                      </div>
                      <p className="mb-1 text-[0.52rem] font-medium text-white/60 leading-tight">{post.label}</p>
                      <p className="text-[0.45rem] text-white/25">{post.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
    </div>
  );
}

/* ── Shapes ──────────────────────────────────────────────── */
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-white/[0.08]',
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100, rotate: rotate - 10 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 2.6, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.4 } }}
      className={`absolute pointer-events-none ${className ?? ''}`}
    >
      <motion.div
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 10 + delay * 3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        style={{ width, height }}
        className="relative"
      >
        <div className={[
          'absolute inset-0 rounded-full',
          'bg-gradient-to-r to-transparent',
          gradient,
          'backdrop-blur-[2px] border border-[#d394ff]/[0.15]',
          'shadow-[0_8px_40px_0_rgba(211,148,255,0.10)]',
          'after:absolute after:inset-0 after:rounded-full',
          'after:bg-[radial-gradient(circle_at_40%_40%,rgba(211,148,255,0.14),transparent_65%)]',
        ].join(' ')} />
      </motion.div>
    </motion.div>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
export default function HeroGeometric() {
  const fadeNav = useFadeNav();

  const fade = (i: number) => ({
    hidden:  { opacity: 0, y: 22, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.9, delay: 0.3 + i * 0.14, ease: [0.25, 0.4, 0.25, 1] as const } },
  });

  return (
    <div className="relative w-full overflow-hidden bg-[#030303]" style={{ minHeight: '100vh' }}>
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d394ff]/[0.03] via-transparent to-[#6b0fa0]/[0.05]" />
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-[#d394ff]/[0.04] blur-[130px] pointer-events-none" />

      {/* Floating shapes — reduced, less distracting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape delay={0.2}  width={580} height={130} rotate={ 12} gradient="from-[#d394ff]/[0.10]" className="left-[-10%] top-[14%]" />
        <ElegantShape delay={0.45} width={420} height={100} rotate={-13} gradient="from-[#aa30fa]/[0.09]" className="right-[-6%] top-[55%]" />
        <ElegantShape delay={0.65} width={180} height={ 46} rotate={ 20} gradient="from-[#d394ff]/[0.08]" className="right-[16%] top-[7%]" />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(211,148,255,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 55% at 50% 40%, black 20%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-36 pb-0 text-center flex flex-col items-center">

        {/* Headline */}
        <motion.h1
          variants={fade(0)} initial="hidden" animate="visible"
          className="text-4xl sm:text-5xl md:text-[4.5rem] font-extrabold tracking-[-0.03em] leading-[1.06] mb-5 max-w-4xl"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/75">
            Every channel.{' '}
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#c97cff] via-[#f0dcff] to-[#aa30fa]">
            One command center.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fade(1)} initial="hidden" animate="visible"
          className="text-[1rem] md:text-[1.1rem] text-white/50 leading-[1.75] font-light max-w-[480px] mb-10"
        >
          Plan, publish, and analyze across Instagram, LinkedIn, and Facebook — from one dashboard.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fade(2)} initial="hidden" animate="visible"
          className="flex flex-col sm:flex-row items-center gap-3 mb-5"
        >
          <button
            onClick={() => fadeNav('/register')}
            className="group relative rounded-full bg-[#d394ff] px-8 py-3.5 text-sm font-bold tracking-wide text-[#3a0060] overflow-hidden transition-all duration-300 hover:shadow-[0_0_44px_rgba(211,148,255,0.45)] w-full sm:w-auto"
          >
            <span className="relative z-10">Start Free Trial</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#d394ff] to-[#f0dcff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button
            onClick={() => fadeNav('/login')}
            className="rounded-full border border-white/[0.12] bg-white/[0.03] px-8 py-3.5 text-sm font-medium tracking-wide text-white/50 backdrop-blur-xl hover:border-[#d394ff]/30 hover:text-white/70 transition-all duration-300 w-full sm:w-auto"
          >
            Book a Demo
          </button>
        </motion.div>

        {/* Trust line */}
        <motion.p
          variants={fade(3)} initial="hidden" animate="visible"
          className="text-[0.72rem] text-white/22 tracking-wide mb-16"
        >
          No credit card required · 14-day free trial · Cancel anytime
        </motion.p>

        {/* Dashboard mockup */}
        <motion.div
          variants={{
            hidden:  { opacity: 0, y: 48, filter: 'blur(12px)' },
            visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 1.1, delay: 0.85, ease: [0.25, 0.4, 0.25, 1] } },
          }}
          initial="hidden" animate="visible"
          className="w-full"
        >
          <DashboardMockup />
        </motion.div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent pointer-events-none z-20" />
    </div>
  );
}
