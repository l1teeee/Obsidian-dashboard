
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const workflowSteps = [
  {
    step: '01',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Plan',
    body: 'Map every post, owner, and publish date across all platforms in one shared content calendar. Assign ownership before a single caption is written.',
    tag: 'One shared view',
    accent: '#C8553A',
  },
  {
    step: '02',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: 'Draft',
    body: 'Write captions with AI assist, adapt copy per platform, and tag posts for review — all without leaving the editor or switching tools.',
    tag: 'AI-powered writing',
    accent: '#A53F28',
  },
  {
    step: '03',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Approve',
    body: 'Route content through your team with one-click approvals and comment threads. Nothing goes live until someone signs off.',
    tag: 'Team-gated publishing',
    accent: '#C8553A',
  },
  {
    step: '04',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Report',
    body: 'Pull cross-platform performance data after every cycle. Know what drove reach, what fell flat, and what to repeat next week.',
    tag: 'Closed-loop analytics',
    accent: '#C8553A',
  },
];

const differentiators = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Simpler, not stripped down',
    body: 'Professional-grade features designed to be intuitive. You get the power without the learning curve — set up in minutes, not days.',
    badge: 'No onboarding call needed',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'One subscription. Four tools replaced.',
    body: 'Scheduling, analytics, AI copywriting, and collaboration — all in one platform. Cancel your other subscriptions and simplify your stack.',
    badge: 'Avg. $180/mo saved',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Built for teams with real deadlines',
    body: 'Not a solo-creator hobby tool. Vielinks is built for agencies, growing brands, and social media teams that publish consistently and need reliable systems.',
    badge: 'Trusted by agencies',
  },
];

export default function DifferentiatorsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('[data-d="eyebrow"],[data-d="title"],[data-d="sub"],[data-d="workflow"],[data-d="card"]', { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none none',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      tl
        .fromTo('[data-d="eyebrow"]',  { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo('[data-d="title"]',    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.15')
        .fromTo('[data-d="sub"]',      { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.3')
        .fromTo('[data-d="workflow"]', { opacity: 0, y: 24, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.65 }, '-=0.25')
        .fromTo('[data-d="card"]',     { opacity: 0, y: 28, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.1 }, '-=0.3');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="Differentiators" className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute right-[4%] top-20 h-80 w-80 rounded-full bg-[#C8553A]/[0.03] blur-[72px]" />
      <div className="pointer-events-none absolute left-[3%] bottom-10 h-64 w-64 rounded-full bg-[#A53F28]/[0.025] blur-[64px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7E0D0] to-transparent" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">

        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span
            data-d="eyebrow"
            style={{ opacity: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(21,20,15,0.14)] bg-[#FFFFFF] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#6B655B]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#C8553A]" />
            Why Vielinks is different
          </span>
          <h2
            data-d="title"
            style={{ opacity: 0 }}
            className="mt-5 text-4xl font-extrabold tracking-[-0.04em] leading-[0.96] text-[#15140F] md:text-5xl"
          >
            A cleaner workflow.{' '}
            <span className="text-[#C8553A]">Not just another tool.</span>
          </h2>
          <p
            data-d="sub"
            style={{ opacity: 0 }}
            className="mx-auto mt-5 max-w-lg text-[1rem] font-light leading-[1.8] text-[#15140F]/55"
          >
            From first idea to final report, every step happens in one place. No tab switching, no copy-pasting, no guessing.
          </p>
        </div>

        {/* ── Workflow steps ─────────────────────────────────── */}
        <div
          data-d="workflow"
          style={{ opacity: 0 }}
          className="relative mb-10 overflow-hidden rounded-[2rem] border border-[rgba(21,20,15,0.16)] bg-[#FFFFFF] p-6 shadow-[0_20px_60px_rgba(21,20,15,0.08),0_0_0_1px_rgba(200,85,58,0.06)] md:p-8"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C8553A]/20 to-transparent" />

          {/* "How it works" label */}
          <p className="mb-6 text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#15140F]/40">How it works</p>

          <div className="grid gap-3 md:grid-cols-4">
            {workflowSteps.map((item, index) => (
              <div key={item.step} className="relative">
                {/* Connector arrow between steps */}
                {index < workflowSteps.length - 1 && (
                  <div className="pointer-events-none absolute right-[-10px] top-[22px] z-10 hidden md:flex items-center">
                    <svg className="h-4 w-4 text-[rgba(21,20,15,0.18)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}

                <div className="group flex h-full flex-col rounded-[1.25rem] border border-[rgba(21,20,15,0.12)] bg-[#FBF8F2] p-5 transition-all duration-300 hover:border-[rgba(200,85,58,0.30)] hover:bg-[#EFE9DC] hover:shadow-[0_8px_24px_rgba(200,85,58,0.08)]">

                  {/* Top row: step number + icon */}
                  <div className="mb-4 flex items-start justify-between">
                    <span
                      className="rounded-full border px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.2em]"
                      style={{
                        borderColor: `${item.accent}40`,
                        backgroundColor: `${item.accent}12`,
                        color: item.accent,
                      }}
                    >
                      {item.step}
                    </span>
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[rgba(21,20,15,0.10)] bg-[#FFFFFF] transition-colors duration-300 group-hover:border-[rgba(200,85,58,0.20)] group-hover:bg-[#EFE9DC]"
                      style={{ color: item.accent }}
                    >
                      {item.icon}
                    </div>
                  </div>

                  {/* Title + body */}
                  <h3 className="mb-2 text-[0.95rem] font-extrabold tracking-tight text-[#15140F]">{item.title}</h3>
                  <p className="mb-5 flex-1 text-[0.8rem] leading-[1.7] text-[#15140F]/55">{item.body}</p>

                  {/* Outcome tag */}
                  <span
                    className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.55rem] font-bold"
                    style={{
                      borderColor: `${item.accent}35`,
                      backgroundColor: `${item.accent}09`,
                      color: item.accent + 'CC',
                    }}
                  >
                    <span className="h-1 w-1 rounded-full" style={{ backgroundColor: item.accent }} />
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Differentiator cards — full width 3 columns ─────── */}
        <div className="grid gap-5 md:grid-cols-3">
          {differentiators.map((d, i) => (
            <div
              key={i}
              data-d="card"
              style={{ opacity: 0 }}
              className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-[rgba(21,20,15,0.14)] bg-[#FFFFFF] p-6 backdrop-blur-xl transition-all duration-500 hover:border-[#C8553A]/30 hover:bg-[#EFE9DC]"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7E0D0] to-transparent" />

              {/* Icon + badge */}
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#EFE9DC] text-[#C8553A] transition-all duration-300 group-hover:bg-[#EFE9DC] group-hover:text-[#15140F]">
                  {d.icon}
                </div>
                <span className="rounded-full border border-[rgba(21,20,15,0.12)] bg-[#EFE9DC] px-2.5 py-0.5 text-[0.55rem] font-bold text-[#6B655B]">
                  {d.badge}
                </span>
              </div>

              {/* Content */}
              <h3 className="mb-2 text-[0.95rem] font-bold tracking-tight text-[#15140F]">{d.title}</h3>
              <p className="mb-6 flex-1 text-[0.875rem] leading-[1.75] text-[#15140F]/55">{d.body}</p>

              {/* Check mark footer */}
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(21,20,15,0.10)] bg-[#EFE9DC]">
                  <svg className="h-3 w-3 text-[#C8553A]/70" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[0.65rem] font-semibold text-[#15140F]/35">Included in all plans</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
