
import { useLayoutEffect, useRef, useState } from 'react';
import NumberFlow from '@number-flow/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import PlanSignupDialog from './PlanSignupDialog';

gsap.registerPlugin(ScrollTrigger);

export type BillingPlan = 'monthly' | 'annually';

export type PlanDef = {
  id: string;
  name: string;
  forWho: string;
  desc: string;
  monthlyPrice: number | null;
  annuallyPrice: number | null;
  badge?: string;
  accent?: boolean;
  features: string[];
  cta: string;
  ctaRoute: string;
  note?: string;
};

export const PLANS: PlanDef[] = [
  {
    id: 'free',
    name: 'Free',
    forWho: 'For individuals getting started',
    desc: 'Explore Vielinks with no commitment. One account, core scheduling, and basic analytics.',
    monthlyPrice: 0,
    annuallyPrice: 0,
    features: [
      '1 social account connected',
      '10 scheduled posts per month',
      '7-day analytics window',
      'Content calendar view',
      'Community support',
    ],
    cta: 'Get started free',
    ctaRoute: '/register',
  },
  {
    id: 'starter',
    name: 'Starter',
    forWho: 'For independent creators',
    desc: 'Everything you need to grow your personal brand across multiple platforms.',
    monthlyPrice: 29,
    annuallyPrice: 290,
    features: [
      '3 social accounts connected',
      '60 scheduled posts per month',
      '30-day analytics dashboard',
      'Content calendar view',
      'AI caption suggestions (10/mo)',
      'Email support',
    ],
    cta: 'Start free trial',
    ctaRoute: '/register',
  },
  {
    id: 'pro',
    name: 'Pro',
    forWho: 'For teams & growing brands',
    desc: 'Full analytics, unlimited scheduling, and AI-powered insights for teams that publish at scale.',
    monthlyPrice: 79,
    annuallyPrice: 790,
    badge: 'Most Popular',
    accent: true,
    features: [
      '10 social accounts connected',
      'Unlimited scheduled posts',
      '90-day analytics + performance reports',
      'AI best-time scheduling engine',
      'Unlimited AI caption drafting',
      'Multi-workspace support (5 seats)',
      'Priority support (4h response)',
    ],
    cta: 'Start free trial',
    ctaRoute: '/register',
    note: 'Built for growing teams',
  },
  {
    id: 'agency',
    name: 'Agency',
    forWho: 'For agencies & large brands',
    desc: 'Custom workflows, white-label reporting, and dedicated support for complex operations.',
    monthlyPrice: 149,
    annuallyPrice: 1490,
    features: [
      'Unlimited accounts & workspaces',
      'Unlimited posts & team seats',
      'Full analytics history + white-label PDF reports',
      'API access & custom integrations',
      'SSO & advanced permissions',
      'Dedicated customer success manager',
    ],
    cta: 'Contact sales',
    ctaRoute: 'mailto:hello@vielinks.com?subject=Vielinks%20Agency%20plan',
  },
];

function CheckIcon({ accent }: { accent?: boolean }) {
  return (
    <span className={cn(
      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
      accent ? 'bg-[#7DD3C7]/15 text-[#7DD3C7]' : 'bg-white/[0.06] text-white/45'
    )}>
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export function PlanCard({ plan, billing, onSelectPlan }: { plan: PlanDef; billing: BillingPlan; onSelectPlan?: (plan: PlanDef) => void }) {
  const navigate = useNavigate();
  const price = billing === 'monthly' ? plan.monthlyPrice : plan.annuallyPrice;
  const isFree = plan.id === 'free';

  const handleCta = () => {
    if (isFree) { navigate('/register'); return; }
    if (plan.id === 'agency') {
      window.location.href = plan.ctaRoute;
      return;
    }
    onSelectPlan?.(plan);
  };

  return (
    <div className={cn(
      'group relative flex flex-col overflow-hidden rounded-[2rem] border p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1',
      plan.accent
        ? 'border-[#7DD3C7]/28 bg-[#1F1D1B]/85 shadow-[0_0_0_1px_rgba(125,211,199,0.07),0_40px_120px_rgba(0,0,0,0.3)]'
        : 'border-white/[0.08] bg-[#171615]/70 hover:bg-[#1F1D1B]/70'
    )}>
      {/* Top sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Hover glow for accent */}
      {plan.accent && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(ellipse at top, rgba(125,211,199,0.09) 0%, transparent 65%)' }}
        />
      )}

      {/* Badge row */}
      <div className="mb-5 h-6">
        {plan.badge && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7DD3C7]/25 bg-[#7DD3C7]/12 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#7DD3C7]">
            <span className="h-1 w-1 rounded-full bg-[#7DD3C7]" />
            {plan.badge}
          </span>
        )}
      </div>

      {/* For who + name */}
      <p className="mb-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/50">{plan.forWho}</p>
      <h3 className="mb-2 text-xl font-extrabold tracking-tight text-white">{plan.name}</h3>
      <p className="mb-7 text-[0.875rem] leading-[1.65] text-white/55">{plan.desc}</p>

      {/* Price with NumberFlow */}
      <div className="mb-2">
        {isFree ? (
          <p className="text-5xl font-extrabold tracking-[-0.04em] text-white">Free</p>
        ) : (
          <div className="flex items-end gap-1.5">
            <NumberFlow
              value={price ?? 0}
              format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0, currencyDisplay: 'narrowSymbol' }}
              className="text-5xl font-extrabold tracking-[-0.04em] text-white"
            />
            <span className="mb-2 text-sm font-medium text-white/55">
              {billing === 'monthly' ? '/mo' : '/yr'}
            </span>
          </div>
        )}
      </div>

      {/* Billing note animated */}
      <div className="h-7 overflow-hidden mb-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={billing}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="text-[0.7rem] text-white/35"
          >
            {isFree
              ? 'Free forever · no card required'
              : billing === 'monthly'
              ? 'Billed monthly · cancel anytime'
              : `Save ${billing === 'annually' ? '~17%' : ''} vs monthly`}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <button
        onClick={handleCta}
        className={cn(
          'mb-2 w-full rounded-xl px-6 py-3.5 text-sm font-bold transition-all duration-300 active:scale-[0.98]',
          plan.accent
            ? 'bg-[#F4F1EC] text-[#0B0B0A] hover:shadow-[0_0_36px_rgba(244,241,236,0.2)]'
            : 'border border-white/[0.10] bg-white/[0.04] text-white/70 hover:border-[#7DD3C7]/30 hover:text-white hover:bg-white/[0.07]'
        )}
      >
        {plan.cta}
      </button>

      {plan.note && (
        <p className="mb-4 text-center text-[0.62rem] text-white/40">{plan.note}</p>
      )}
      {!plan.note && <div className="mb-4 h-5" />}

      {/* Divider */}
      <div className="mb-5 h-px bg-white/[0.06]" />

      {/* Features */}
      <ul className="mt-auto space-y-3.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <CheckIcon accent={plan.accent} />
            <span className="text-[0.875rem] leading-snug text-white/65">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Billing toggle ───────────────────────────────────────── */
import { Switch } from '../ui/switch';

export function BillingToggle({ billing, onSwitch }: { billing: BillingPlan; onSwitch: () => void }) {
  const isAnnually = billing === 'annually';
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <span
        className={cn('text-sm font-medium transition-colors cursor-pointer select-none', !isAnnually ? 'text-white' : 'text-white/40')}
        onClick={() => isAnnually && onSwitch()}
      >
        Monthly
      </span>
      <Switch
        checked={isAnnually}
        onCheckedChange={onSwitch}
        aria-label="Toggle billing period"
      />
      <div className="flex items-center gap-2">
        <span
          className={cn('text-sm font-medium transition-colors cursor-pointer select-none', isAnnually ? 'text-white' : 'text-white/40')}
          onClick={() => !isAnnually && onSwitch()}
        >
          Annually
        </span>
        <span className="rounded-full border border-[#7DD3C7]/20 bg-[#7DD3C7]/[0.08] px-2 py-0.5 text-[0.6rem] font-bold text-[#7DD3C7]">
          Save ~17%
        </span>
      </div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────── */
export default function PricingSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [billing,      setBilling]      = useState<BillingPlan>('monthly');
  const [dialogPlan,   setDialogPlan]   = useState<PlanDef | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('[data-pr="eyebrow"],[data-pr="title"],[data-pr="sub"],[data-pr="toggle"],[data-pr="card"],[data-pr="note"]', { opacity: 1, y: 0 });
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

      tl.fromTo('[data-pr="orb"]',    { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0)
        .fromTo('[data-pr="eyebrow"]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, 0.05)
        .fromTo('[data-pr="title"]',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.2')
        .fromTo('[data-pr="sub"]',     { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
        .fromTo('[data-pr="toggle"]',  { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, '-=0.25')
        .fromTo('[data-pr="card"]',    { opacity: 0, y: 28, scale: 0.988 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.08 }, '-=0.2')
        .fromTo('[data-pr="note"]',    { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 }, '-=0.1');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="Pricing" className="relative overflow-hidden py-28 md:py-36">
      <div data-pr="orb" style={{ opacity: 0 }} className="pointer-events-none absolute left-1/2 top-16 h-[480px] w-[700px] -translate-x-1/2 rounded-full bg-[#7DD3C7]/[0.05] blur-[120px]" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Header */}
        <div className="mb-4 text-center">
          <span data-pr="eyebrow" style={{ opacity: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.03] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7DD3C7]" />
            Pricing
          </span>
          <h2 data-pr="title" style={{ opacity: 0 }} className="mx-auto mt-5 max-w-2xl text-4xl font-extrabold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl md:text-[3.4rem]">
            Simple pricing.{' '}
            <span className="text-[#7DD3C7]">
              Clear plans.
            </span>
          </h2>
          <p data-pr="sub" style={{ opacity: 0 }} className="mt-5 text-[1rem] font-light leading-[1.8] text-white/55">
            Start free, no credit card required. Upgrade, downgrade, or cancel anytime.
          </p>
          <div data-pr="toggle" style={{ opacity: 0 }}>
            <BillingToggle billing={billing} onSwitch={() => setBilling(b => b === 'monthly' ? 'annually' : 'monthly')} />
          </div>
        </div>

        {/* Cards — 4 columns */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4 lg:items-start">
          {PLANS.map((plan) => (
            <div key={plan.id} data-pr="card" style={{ opacity: 0 }}>
              <PlanCard plan={plan} billing={billing} onSelectPlan={setDialogPlan} />
            </div>
          ))}
        </div>

        <PlanSignupDialog
          plan={dialogPlan}
          billing={billing}
          onClose={() => setDialogPlan(null)}
        />

        <p data-pr="note" style={{ opacity: 0 }} className="mt-10 text-center text-[0.8rem] text-white/45">
          All plans include a 14-day free trial on paid features ·{' '}
          <button
            onClick={() => window.open('/pricing', '_self')}
            className="text-[#7DD3C7]/70 underline underline-offset-2 hover:text-[#7DD3C7] transition-colors"
          >
            Compare all features
          </button>
        </p>
      </div>
    </section>
  );
}
