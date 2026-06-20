import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import PlanSignupDialog from './PlanSignupDialog';

gsap.registerPlugin(ScrollTrigger);

export type PlanDef = {
  id:            string;
  name:          string;
  forWho:        string;
  desc:          string;
  annuallyPrice: number;
  badge?:        string;
  accent?:       boolean;
  features:      string[];
  cta:           string;
  note?:         string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const PLANS: PlanDef[] = [
  {
    id:            'starter',
    name:          'Starter',
    forWho:        'One person, one workspace.',
    desc:          'One person, one workspace, three connected accounts.',
    annuallyPrice: 10,
    features: [
      'Up to 30 posts / month',
      '7-day analytics window',
      'Email-only support',
    ],
    cta: 'Subscribe now',
  },
  {
    id:            'pro',
    name:          'Pro',
    forWho:        'For teams of 2-8',
    desc:          'For teams of 2-8 who post weekly across all three networks.',
    annuallyPrice: 15,
    badge:         'Most Popular',
    accent:        true,
    features: [
      'Unlimited posts',
      'Full analytics history',
      'AI caption drafts',
      'Approval workflows',
    ],
    cta: 'Subscribe now',
  },
  {
    id:            'studio',
    name:          'Studio',
    forWho:        'For agencies and in-house teams',
    desc:          'For agencies and in-house teams managing multiple brands.',
    annuallyPrice: 25,
    features: [
      'Everything in Pro',
      'Multiple brand workspaces',
      'Client review portals',
      'Priority support',
    ],
    cta: 'Subscribe now',
  },
];

export function PlanCard({ plan, onSelectPlan }: { plan: PlanDef; onSelectPlan?: (plan: PlanDef) => void }) {
  const isFeatured = !!plan.accent;

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
      <div>
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-[56px] font-medium tracking-[-0.04em] leading-none"
            style={{ color: isFeatured ? '#F8FAFC' : '#0F172A' }}
          >
            ${plan.annuallyPrice}
          </span>
          <span className="text-[13px]" style={{ color: isFeatured ? 'rgba(255,255,255,0.6)' : '#64748B' }}>
            / mo
          </span>
        </div>
        <p className="text-[12px] mt-1" style={{ color: isFeatured ? 'rgba(255,255,255,0.45)' : '#94A3B8' }}>
          billed annually · ${plan.annuallyPrice * 12} / yr
        </p>
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
        onClick={() => onSelectPlan?.(plan)}
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

/* ── Section ──────────────────────────────────────────────── */
export default function PricingSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [dialogPlan, setDialogPlan] = useState<PlanDef | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('[data-pr="eyebrow"],[data-pr="title"],[data-pr="sub"],[data-pr="card"],[data-pr="note"]', { opacity: 1, y: 0 });
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
            All plans billed annually. Cancel anytime.
          </p>
        </div>

        {/* Cards — 3 columns */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 lg:items-start">
          {PLANS.map((plan) => (
            <div key={plan.id} data-pr="card" style={{ opacity: 0 }}>
              <PlanCard plan={plan} onSelectPlan={setDialogPlan} />
            </div>
          ))}
        </div>

        <PlanSignupDialog
          plan={dialogPlan}
          onClose={() => setDialogPlan(null)}
        />

        <p data-pr="note" style={{ opacity: 0 }} className="mt-10 text-center text-[0.8rem] text-[#64748B]">
          All plans include a 14-day free trial ·{' '}
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
