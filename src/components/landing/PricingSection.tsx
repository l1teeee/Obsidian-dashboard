
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Starter',
    price: '29',
    desc: 'For independent creators building their presence.',
    accent: false,
    badge: null,
    features: [
      '3 social accounts',
      '30 scheduled posts/mo',
      'Basic analytics dashboard',
      'Content calendar',
      'Email support',
    ],
    cta: 'Get started',
  },
  {
    name: 'Pro',
    price: '79',
    desc: 'For creative teams that demand editorial precision.',
    accent: true,
    badge: 'Most Popular',
    features: [
      '15 social accounts',
      'Unlimited scheduled posts',
      'AI analytics & insights',
      'Best-time posting engine',
      'Competitor heatmaps',
      'Priority support',
    ],
    cta: 'Start free trial',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'For agencies and brands with complex workflows.',
    accent: false,
    badge: null,
    features: [
      'Unlimited accounts',
      'Unlimited posts & users',
      'White-label reports',
      'API access',
      'Custom integrations',
      'Dedicated success manager',
    ],
    cta: 'Book a demo',
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
        ['[data-pr="orb"]', '[data-pr="eyebrow"]', '[data-pr="title"]', '[data-pr="sub"]', '[data-pr="card"]', '[data-pr="note"]'],
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

      tl.fromTo('[data-pr="orb"]', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0)
        .fromTo('[data-pr="eyebrow"]', { opacity: 0, y: 12, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4 }, 0.05)
        .fromTo('[data-pr="title"]', { opacity: 0, y: 20, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55 }, '-=0.2')
        .fromTo('[data-pr="sub"]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
        .fromTo('[data-pr="card"]', { opacity: 0, y: 24, scale: 0.988 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.08 }, '-=0.25')
        .fromTo('[data-pr="note"]', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 }, '-=0.15');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="Pricing" className="relative overflow-hidden py-36">
      {/* Orbs */}
      <div data-pr="orb" style={{ opacity: 0 }} className="pointer-events-none absolute left-1/2 top-16 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#d394ff]/6 blur-[120px]" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Header */}
        <div className="mb-20 text-center">
          <span
            data-pr="eyebrow"
            style={{ opacity: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d394ff]/18 bg-[#d394ff]/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#d394ff]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
            Pricing
          </span>
          <h2
            data-pr="title"
            style={{ opacity: 0 }}
            className="font-headline mx-auto max-w-2xl text-4xl font-extrabold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl md:text-[3.4rem]"
          >
            Transparent pricing,{' '}
            <span className="bg-gradient-to-b from-white via-[#f0dcff] to-[#c97cff] bg-clip-text text-transparent">
              zero surprises.
            </span>
          </h2>
          <p data-pr="sub" style={{ opacity: 0 }} className="mt-6 text-[1.02rem] font-light leading-8 text-[#adaaaa]">
            Start free. Scale when you're ready. Cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              data-pr="card"
              style={{ opacity: 0 }}
              className={`group relative flex flex-col overflow-hidden rounded-[2rem] border p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 ${
                plan.accent
                  ? 'border-[#d394ff]/25 bg-[#1a1919]/80 shadow-[0_0_0_1px_rgba(211,148,255,0.06),0_40px_120px_rgba(0,0,0,0.3)]'
                  : 'border-[#494847]/20 bg-[#1a1919]/60 hover:bg-[#202020]/70'
              }`}
            >
              {/* Accent glow */}
              {plan.accent && (
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(ellipse at top, rgba(211,148,255,0.08) 0%, transparent 65%)' }}
                />
              )}
              {/* Top sheen */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

              {/* Badge */}
              {plan.badge && (
                <span className="mb-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#d394ff]/25 bg-[#d394ff]/12 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#d394ff]">
                  <span className="h-1 w-1 rounded-full bg-[#d394ff]" />
                  {plan.badge}
                </span>
              )}

              {/* Plan name */}
              <h3 className="font-headline mb-2 text-lg font-bold text-[#e5e2e1]">{plan.name}</h3>
              <p className="mb-8 text-sm leading-relaxed text-[#adaaaa]/60">{plan.desc}</p>

              {/* Price */}
              <div className="mb-8">
                {plan.price === 'Custom' ? (
                  <p className="font-headline text-4xl font-extrabold tracking-tight text-white">Custom</p>
                ) : (
                  <div className="flex items-end gap-1">
                    <span className="font-headline text-5xl font-extrabold tracking-[-0.04em] text-white">${plan.price}</span>
                    <span className="mb-2 text-sm font-medium text-[#adaaaa]/50">/month</span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <button
                className={`mb-8 w-full rounded-2xl px-6 py-3.5 text-sm font-bold transition-all duration-300 active:scale-[0.98] ${
                  plan.accent
                    ? 'bg-[#d394ff] text-[#4a0076] hover:scale-[1.02] hover:shadow-[0_0_36px_rgba(211,148,255,0.28)]'
                    : 'border border-[#494847]/30 bg-white/[0.04] text-white hover:border-[#d394ff]/30 hover:bg-white/[0.07]'
                }`}
              >
                {plan.cta}
              </button>

              {/* Divider */}
              <div className="mb-6 h-px bg-white/[0.06]" />

              {/* Features */}
              <ul className="mt-auto space-y-3.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.accent ? 'bg-[#d394ff]/15 text-[#d394ff]' : 'bg-white/[0.06] text-[#adaaaa]/60'}`}>
                      <CheckIcon />
                    </span>
                    <span className="text-[0.875rem] text-[#adaaaa]/70">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p data-pr="note" style={{ opacity: 0 }} className="mt-12 text-center text-sm text-[#777575]">
          All plans include a 14-day free trial · No credit card required · SOC 2 Type II certified
        </p>
      </div>
    </section>
  );
}
