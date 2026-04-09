
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Starter',
    price: '29',
    forWho: 'For independent creators',
    desc: 'Everything you need to grow your personal brand across multiple platforms.',
    accent: false,
    badge: null,
    features: [
      '3 social accounts connected',
      '30 scheduled posts per month',
      'Basic analytics dashboard',
      'Content calendar view',
      'AI caption suggestions (10/mo)',
      'Email support',
    ],
    cta: 'Start free trial',
    note: null,
  },
  {
    name: 'Pro',
    price: '79',
    forWho: 'For teams & growing brands',
    desc: 'Full analytics, unlimited scheduling, and AI-powered insights for teams that publish at scale.',
    accent: true,
    badge: 'Most Popular',
    features: [
      '15 social accounts connected',
      'Unlimited scheduled posts',
      'Advanced analytics & engagement data',
      'AI best-time scheduling engine',
      'Unlimited AI caption drafting',
      'Competitor performance tracking',
      'Priority support (4h response)',
    ],
    cta: 'Start free trial',
    note: 'Used by 78% of our paying customers',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    forWho: 'For agencies & large brands',
    desc: 'Custom workflows, white-label reporting, and dedicated support for complex operations.',
    accent: false,
    badge: null,
    features: [
      'Unlimited accounts & users',
      'Unlimited posts & workspaces',
      'White-label PDF reports',
      'API access & custom integrations',
      'SSO & advanced permissions',
      'Dedicated success manager',
    ],
    cta: 'Book a demo',
    note: null,
  },
];

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(
        ['[data-pr="orb"]','[data-pr="eyebrow"]','[data-pr="title"]','[data-pr="sub"]','[data-pr="card"]','[data-pr="note"]'],
        { willChange: 'transform, opacity, filter' }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none none',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo('[data-pr="orb"]',    { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0)
        .fromTo('[data-pr="eyebrow"]', { opacity: 0, y: 12, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4 }, 0.05)
        .fromTo('[data-pr="title"]',   { opacity: 0, y: 20, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55 }, '-=0.2')
        .fromTo('[data-pr="sub"]',     { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
        .fromTo('[data-pr="card"]',    { opacity: 0, y: 28, scale: 0.988 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.09 }, '-=0.25')
        .fromTo('[data-pr="note"]',    { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 }, '-=0.15');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="Pricing" className="relative overflow-hidden py-28 md:py-36">
      <div data-pr="orb" style={{ opacity: 0 }} className="pointer-events-none absolute left-1/2 top-16 h-[480px] w-[600px] -translate-x-1/2 rounded-full bg-[#d394ff]/[0.05] blur-[120px]" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <span
            data-pr="eyebrow"
            style={{ opacity: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d394ff]/18 bg-[#d394ff]/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#d394ff]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
            Pricing
          </span>
          <h2
            data-pr="title"
            style={{ opacity: 0 }}
            className="mx-auto max-w-2xl text-4xl font-extrabold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl md:text-[3.4rem]"
          >
            Simple pricing.{' '}
            <span className="bg-gradient-to-b from-white via-[#f0dcff] to-[#c97cff] bg-clip-text text-transparent">
              Serious results.
            </span>
          </h2>
          <p data-pr="sub" style={{ opacity: 0 }} className="mt-5 text-[1rem] font-light leading-[1.8] text-white/45">
            Start with a 14-day free trial. No credit card required. Upgrade, downgrade, or cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-3 lg:items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              data-pr="card"
              style={{ opacity: 0 }}
              className={`group relative flex flex-col overflow-hidden rounded-[2rem] border p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 ${
                plan.accent
                  ? 'border-[#d394ff]/25 bg-[#181818]/85 shadow-[0_0_0_1px_rgba(211,148,255,0.07),0_40px_120px_rgba(0,0,0,0.3)]'
                  : 'border-white/[0.08] bg-[#111111]/70 hover:bg-[#181818]/70'
              }`}
            >
              {/* Accent glow */}
              {plan.accent && (
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(ellipse at top, rgba(211,148,255,0.08) 0%, transparent 65%)' }}
                />
              )}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

              {/* Badge */}
              {plan.badge && (
                <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#d394ff]/25 bg-[#d394ff]/12 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#d394ff]">
                  <span className="h-1 w-1 rounded-full bg-[#d394ff]" />
                  {plan.badge}
                </span>
              )}
              {!plan.badge && <div className="mb-5 h-6" />}

              {/* For who */}
              <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/30">{plan.forWho}</p>

              {/* Plan name */}
              <h3 className="mb-2 text-xl font-extrabold tracking-tight text-white">{plan.name}</h3>
              <p className="mb-7 text-[0.875rem] leading-[1.65] text-white/40">{plan.desc}</p>

              {/* Price */}
              <div className="mb-7">
                {plan.price === 'Custom' ? (
                  <p className="text-4xl font-extrabold tracking-tight text-white">Custom</p>
                ) : (
                  <div className="flex items-end gap-1.5">
                    <span className="text-5xl font-extrabold tracking-[-0.04em] text-white">${plan.price}</span>
                    <span className="mb-2 text-sm font-medium text-white/35">/month</span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <button
                className={`mb-7 w-full rounded-2xl px-6 py-3.5 text-sm font-bold transition-all duration-300 active:scale-[0.98] ${
                  plan.accent
                    ? 'bg-[#d394ff] text-[#4a0076] hover:shadow-[0_0_36px_rgba(211,148,255,0.32)]'
                    : 'border border-white/[0.10] bg-white/[0.04] text-white/70 hover:border-[#d394ff]/30 hover:text-white hover:bg-white/[0.07]'
                }`}
              >
                {plan.cta}
              </button>

              {/* Social proof note (Pro only) */}
              {plan.note && (
                <p className="mb-5 text-center text-[0.62rem] text-white/28">{plan.note}</p>
              )}

              {/* Divider */}
              <div className="mb-5 h-px bg-white/[0.06]" />

              {/* Features */}
              <ul className="mt-auto space-y-3.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.accent ? 'bg-[#d394ff]/15 text-[#d394ff]' : 'bg-white/[0.06] text-white/45'}`}>
                      <CheckIcon />
                    </span>
                    <span className="text-[0.875rem] leading-snug text-white/55">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p data-pr="note" style={{ opacity: 0 }} className="mt-10 text-center text-[0.8rem] text-white/25">
          All plans include a 14-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
}
