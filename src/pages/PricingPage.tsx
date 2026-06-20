import { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import PublicShell from '@/components/landing/PublicShell';
import { PLANS, PlanCard, type PlanDef } from '@/components/landing/PricingSection';
import PlanSignupDialog from '@/components/landing/PlanSignupDialog';

/* ── Comparison table data ───────────────────────────────── */
type CellValue = boolean | string;

type FeatureRow = {
  label: string;
  starter: CellValue;
  pro: CellValue;
  studio: CellValue;
};

type FeatureGroup = {
  category: string;
  rows: FeatureRow[];
};

const TABLE: FeatureGroup[] = [
  {
    category: 'Publishing',
    rows: [
      { label: 'Connected accounts',    starter: '3',      pro: '10',           studio: 'Unlimited' },
      { label: 'Posts / month',         starter: '30',     pro: 'Unlimited',    studio: 'Unlimited' },
      { label: 'Content calendar',      starter: true,     pro: true,           studio: true },
      { label: 'Approval workflows',    starter: false,    pro: true,           studio: true },
      { label: 'Client review portals', starter: false,    pro: false,          studio: true },
    ],
  },
  {
    category: 'Analytics',
    rows: [
      { label: 'Analytics history',      starter: '7 days', pro: 'Full history', studio: 'Full history' },
      { label: 'Per-post breakdown',     starter: true,     pro: true,           studio: true },
      { label: 'Cross-platform reports', starter: false,    pro: true,           studio: true },
      { label: 'White-label reports',    starter: false,    pro: false,          studio: true },
      { label: 'Rival monitoring',       starter: false,    pro: true,           studio: true },
    ],
  },
  {
    category: 'AI',
    rows: [
      { label: 'AI caption drafts',     starter: false,    pro: true,           studio: true },
      { label: 'Best-time suggestions', starter: false,    pro: true,           studio: true },
      { label: 'Brand voice settings',  starter: 'Basic',  pro: 'Advanced',     studio: 'Advanced' },
      { label: 'Multi-language drafts', starter: false,    pro: true,           studio: true },
    ],
  },
  {
    category: 'Team & Support',
    rows: [
      { label: 'Team size',   starter: '1 user',  pro: '2-8 users',    studio: 'Agencies / in-house' },
      { label: 'Workspaces',  starter: '1',       pro: 'Multiple',     studio: 'Multiple brand workspaces' },
      { label: 'Support',     starter: 'Email',   pro: 'Priority',     studio: 'Priority' },
      { label: 'Onboarding',  starter: false,     pro: false,          studio: true },
    ],
  },
];

const PLAN_COLS: Array<{ key: keyof FeatureRow; label: string; accent?: boolean }> = [
  { key: 'starter', label: 'Starter' },
  { key: 'pro',     label: 'Pro', accent: true },
  { key: 'studio',  label: 'Studio' },
];

function Cell({ value, accent }: { value: CellValue; accent?: boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className={cn('flex h-6 w-6 mx-auto items-center justify-center rounded-full',
        accent ? 'bg-[#111827]/15 text-[#111827]' : 'bg-[#F1F5F9] text-[#64748B]'
      )}>
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    ) : (
      <span className="mx-auto block h-px w-4 bg-[#E2E8F0]" />
    );
  }
  return (
    <span className={cn('text-[0.8rem] font-medium', accent ? 'text-[#111827]' : 'text-[#334155]')}>
      {value}
    </span>
  );
}

function ComparisonTable() {
  return (
    <div className="mt-24 mx-auto max-w-[1200px]">
      <div className="mb-12 text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#111827]/20 bg-[#111827]/8 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#111827]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#111827]" />
          Compare
        </span>
        <h2 className="mt-5 text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#0F172A]">
          Everything, side by side.
        </h2>
        <p className="mt-3 text-[0.95rem] font-light text-[#334155]">
          Every feature across every plan - no surprises.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[rgba(15,23,42,0.10)] bg-[#F1F5F9]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="py-5 pl-8 pr-4 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#64748B] w-[260px]">
                Feature
              </th>
              {PLAN_COLS.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'py-5 px-6 text-center text-[0.82rem] font-bold tracking-tight',
                    col.accent ? 'text-[#111827]' : 'text-[#334155]'
                  )}
                >
                  {col.label}
                  {col.accent && (
                    <span className="ml-2 rounded-full border border-[#111827]/22 bg-[#111827]/10 px-2 py-0.5 text-[0.52rem] font-bold uppercase text-[#111827]">
                      Popular
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {TABLE.map((group, gi) => (
              <>
                <tr key={`cat-${gi}`} className="border-t border-border">
                  <td
                    colSpan={4}
                    className="py-4 pl-8 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#111827]/60"
                  >
                    {group.category}
                  </td>
                </tr>

                {group.rows.map((row, ri) => (
                  <tr
                    key={`${gi}-${ri}`}
                    className={cn(
                      'border-t border-border transition-colors',
                      ri % 2 === 0 ? 'bg-transparent' : 'bg-[#FFFFFF]'
                    )}
                  >
                    <td className="py-4 pl-8 pr-4 text-[0.85rem] text-[#64748B]">{row.label}</td>
                    {PLAN_COLS.map((col) => (
                      <td key={col.key} className="py-4 px-6 text-center">
                        <Cell value={row[col.key] as CellValue} accent={col.accent} />
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── FAQ strip ───────────────────────────────────────────── */
const FAQS = [
  { q: 'Can I change plans later?', a: 'Yes - upgrade or downgrade anytime from your workspace settings. Billing is prorated.' },
  { q: 'Is there a free trial?', a: 'Starter is free forever. Pro and Studio have a 14-day trial, no card required.' },
  { q: 'What counts as a social account?', a: 'Each connected Instagram, LinkedIn, or Facebook profile counts as one account.' },
  { q: 'Do you offer refunds?', a: 'Yes. If you cancel within 7 days of a charge, we will issue a full refund, no questions asked.' },
];

function FAQ() {
  return (
    <div className="mt-24 mx-auto max-w-[860px]">
      <h3 className="mb-10 text-center text-[clamp(20px,3vw,28px)] font-medium tracking-[-0.03em] text-[#0F172A]">
        Frequently asked questions
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        {FAQS.map((faq) => (
          <div
            key={faq.q}
            className="rounded-2xl border border-[rgba(15,23,42,0.10)] bg-[#FFFFFF] p-6"
          >
            <p className="mb-2 text-[0.9rem] font-semibold text-[#0F172A]">{faq.q}</p>
            <p className="text-[0.85rem] leading-[1.7] text-[#334155]">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function PricingPage() {
  useSEO({
    title: 'Vielinks Pricing - Three Plans. No Surprises.',
    description: 'Starter is free forever. Pro at $18/user/mo for working teams. Studio at $64/user/mo for agencies. No contact-sales maze until Studio.',
    keywords: 'social media pricing, social scheduler cost, Instagram management pricing, LinkedIn tools cost',
  });

  const navigate    = useNavigate();
  const [dialogPlan, setDialogPlan] = useState<PlanDef | null>(null);

  return (
    <PublicShell>
      <main className="mx-auto max-w-[1440px] px-6 md:px-12 pt-36 pb-28">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-4"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#111827]/20 bg-[#111827]/8 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#111827]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#111827]" />
            Pricing
          </span>
          <h1 className="mt-5 text-[clamp(36px,5vw,60px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#0F172A]">
            Three plans. <span className="text-[#111827]">No surprises.</span>
          </h1>
          <p className="mt-5 text-[1rem] font-light leading-[1.8] text-[#334155] max-w-xl mx-auto">
            A free tier that's actually useful, a paid tier priced for working teams, and a studio tier for agencies. No contact-sales maze until the Studio plan.
          </p>
        </motion.div>

        {/* Ambient glow — desktop only, skipped on mobile to avoid GPU-heavy blur */}
        <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 hidden sm:block h-[400px] w-[700px] rounded-full bg-[#111827]/[0.04] blur-[120px]" />

        {/* Plan cards */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 lg:items-start"
        >
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelectPlan={setDialogPlan} />
          ))}
        </motion.div>

        <p className="mt-8 text-center text-[0.8rem] text-[#64748B]">
          Starter is free forever · Pro and Studio include a 14-day trial · No hidden fees
        </p>

        <PlanSignupDialog
          plan={dialogPlan}
          onClose={() => setDialogPlan(null)}
        />

        {/* Comparison table */}
        <ComparisonTable />

        {/* FAQ */}
        <FAQ />

        {/* Bottom CTA */}
        <div className="mt-24 text-center">
          <div className="inline-flex flex-col items-center gap-5 rounded-[2rem] border border-[#111827]/15 bg-[#111827]/[0.04] px-12 py-10">
            <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-[#0F172A]">
              Still not sure which plan fits?
            </h3>
            <p className="text-[0.9rem] text-[#334155] max-w-sm text-center">
              Start with Starter - it's free forever. Upgrade to Pro when your team is ready, or talk to us about Studio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/register')}
                className="rounded-full bg-[#111827] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#0B1220] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E9F6E]"
              >
                Start for free
              </button>
              <button
                onClick={() => { window.location.href = 'mailto:hello@vielinks.com?subject=Vielinks%20Studio%20plan'; }}
                className="rounded-full border border-[rgba(15,23,42,0.14)] bg-[#FFFFFF] px-8 py-3.5 text-sm font-semibold text-[#64748B] hover:border-[#111827]/30 hover:text-[#0F172A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E9F6E]"
              >
                Contact us about Studio
              </button>
            </div>
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
