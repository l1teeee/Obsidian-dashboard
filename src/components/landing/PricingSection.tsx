
import { useLayoutEffect, useRef, useState } from 'react';
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

// eslint-disable-next-line react-refresh/only-export-components
export const PLANS: PlanDef[] = [
  {
    id: 'starter',
    name: 'Starter',
    forWho: 'One person, one workspace.',
    desc: 'One person, one workspace, three connected accounts.',
    monthlyPrice: 0,
    annuallyPrice: 0,
    features: [
      'Up to 30 posts / month',
      '7-day analytics window',
      'Email-only support',
    ],
    cta: 'Start free',
    ctaRoute: '/register',
  },
  {
    id: 'pro',
    name: 'Pro',
    forWho: 'For teams of 2-8',
    desc: 'For teams of 2-8 who post weekly across all three networks.',
    monthlyPrice: 18,
    annuallyPrice: 18,
    badge: 'Most Popular',
    accent: true,
    features: [
      'Unlimited posts',
      'Full analytics history',
      'AI caption drafts',
      'Approval workflows',
    ],
    cta: 'Start 14-day trial',
    ctaRoute: '/register',
  },
  {
    id: 'studio',
    name: 'Studio',
    forWho: 'For agencies and in-house teams',
    desc: 'For agencies and in-house teams managing multiple brands.',
    monthlyPrice: 64,
    annuallyPrice: 64,
    features: [
      'Everything in Pro',
      'Multiple brand workspaces',
      'Client review portals',
      'Priority support',
    ],
    cta: 'Talk to us',
    ctaRoute: 'mailto:hello@vielinks.com?subject=Vielinks%20Studio%20plan',
  },
];

export function PlanCard({ plan, onSelectPlan }: { plan: PlanDef; billing?: BillingPlan; onSelectPlan?: (plan: PlanDef) => void }) {
  const navigate = useNavigate();
  const isFreePlan = plan.monthlyPrice === 0;
  const isFeatured = !!plan.accent;

  const handleCta = () => {
    if (isFreePlan) { navigate('/register'); return; }
    if (plan.id === 'studio') { window.location.href = plan.ctaRoute; return; }
    onSelectPlan?.(plan);
  };

  return (
    <div className={cn(
      'group rounded-2xl p-8 flex flex-col gap-4 border transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-1',
      isFeatured
        ? 'bg-[#0F172A] border-[#0F172A] hover:border-[#111827] hover:shadow-[0_20px_50px_rgba(14,159,110,0.20)]'
        : 'bg-[#FFFFFF] border-[rgba(15,23,42,0.10)] hover:border-[#111827] hover:bg-[#F8FAFC] hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]'
    )}>
      {/* Plan name */}
      <div
        className="text-[22px] font-medium tracking-[-0.02em]"
        style={{ color: isFeatured ? '#F8FAFC' : '#0F172A' }}
      >
        {plan.name}
        {plan.badge && (
          <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#111827]">
            · {plan.badge}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-[56px] font-medium tracking-[-0.04em] leading-none"
          style={{ color: isFeatured ? '#F8FAFC' : '#0F172A' }}
        >
          {isFreePlan ? 'Free' : `$${plan.monthlyPrice}`}
        </span>
        {!isFreePlan && (
          <span className="text-[13px]" style={{ color: isFeatured ? 'rgba(255,255,255,0.6)' : '#64748B' }}>
            / user / mo
          </span>
        )}
      </div>

      {/* Description */}
      <p
        className="text-[14px] leading-normal"
        style={{ color: isFeatured ? 'rgba(255,255,255,0.7)' : '#64748B' }}
      >
        {plan.desc}
      </p>

      {/* Features */}
      <ul className="list-none flex flex-col gap-2 my-2">
        {plan.features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2.5 text-[14px]"
            style={{ color: isFeatured ? 'rgba(255,255,255,0.85)' : '#334155' }}
          >
            <span className="w-1 h-1 rounded-full bg-current opacity-40 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={handleCta}
        className={cn(
          'mt-auto w-full inline-flex justify-center items-center text-[14px] font-medium px-5 py-2.5 rounded-[10px] transition-[background-color,color,transform] duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E9F6E] focus-visible:ring-offset-2',
          isFeatured
            ? 'bg-[#111827] text-white hover:bg-[#0B1220] focus-visible:ring-offset-[#0F172A]'
            : 'bg-[#0F172A] text-[#F8FAFC] hover:bg-[#2A2825] focus-visible:ring-offset-[#FFFFFF]'
        )}
      >
        {plan.cta}
      </button>
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
        className={cn('text-sm font-medium transition-colors cursor-pointer select-none', !isAnnually ? 'text-[#0F172A]' : 'text-[#0F172A]/40')}
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
          className={cn('text-sm font-medium transition-colors cursor-pointer select-none', isAnnually ? 'text-[#0F172A]' : 'text-[#0F172A]/40')}
          onClick={() => !isAnnually && onSwitch()}
        >
          Annually
        </span>
        <span className="rounded-full border border-[#111827]/20 bg-[#111827]/[0.08] px-2 py-0.5 text-[0.6rem] font-bold text-[#111827]">
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
      <div data-pr="orb" style={{ opacity: 0 }} className="pointer-events-none absolute left-1/2 top-16 h-[480px] w-[700px] -translate-x-1/2 rounded-full bg-[#111827]/[0.05] blur-[120px]" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Header */}
        <div className="mb-4 text-center">
          <span data-pr="eyebrow" style={{ opacity: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#94A3B8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#111827]" />
            Pricing
          </span>
          <h2 data-pr="title" style={{ opacity: 0 }} className="mx-auto mt-5 max-w-2xl text-4xl font-extrabold leading-[0.96] tracking-[-0.04em] text-[#0F172A] sm:text-5xl md:text-[3.4rem]">
            Simple pricing.{' '}
            <span className="text-[#111827]">
              Clear plans.
            </span>
          </h2>
          <p data-pr="sub" style={{ opacity: 0 }} className="mt-5 text-[1rem] font-light leading-[1.8] text-[#64748B]">
            Start free, no credit card required. Upgrade, downgrade, or cancel anytime.
          </p>
          <div data-pr="toggle" style={{ opacity: 0 }}>
            <BillingToggle billing={billing} onSwitch={() => setBilling(b => b === 'monthly' ? 'annually' : 'monthly')} />
          </div>
        </div>

        {/* Cards — 3 columns */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 lg:items-start">
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

        <p data-pr="note" style={{ opacity: 0 }} className="mt-10 text-center text-[0.8rem] text-[#64748B]">
          All plans include a 14-day free trial on paid features ·{' '}
          <button
            onClick={() => window.open('/pricing', '_self')}
            className="text-[#111827]/70 underline underline-offset-2 hover:text-[#111827] transition-colors"
          >
            Compare all features
          </button>
        </p>
      </div>
    </section>
  );
}
