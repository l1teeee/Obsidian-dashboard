import { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import SiteNav from '@/components/landing/SiteNav';
import ObsidianFooter from '@/components/landing/ObsidianFooter';
import { PLANS, PlanCard, BillingToggle, type BillingPlan, type PlanDef } from '@/components/landing/PricingSection';
import PlanSignupDialog from '@/components/landing/PlanSignupDialog';

/* ── Comparison table data ───────────────────────────────── */
type CellValue = boolean | string;

type FeatureRow = {
  label: string;
  free: CellValue;
  starter: CellValue;
  pro: CellValue;
  agency: CellValue;
};

type FeatureGroup = {
  category: string;
  rows: FeatureRow[];
};

const TABLE: FeatureGroup[] = [
  {
    category: 'Core',
    rows: [
      { label: 'Social accounts', free: '1', starter: '3', pro: '10', agency: 'Unlimited' },
      { label: 'Scheduled posts / month', free: '10', starter: '60', pro: 'Unlimited', agency: 'Unlimited' },
      { label: 'Content calendar', free: true, starter: true, pro: true, agency: true },
      { label: 'Multi-workspace', free: false, starter: false, pro: true, agency: true },
      { label: 'Team seats', free: '1', starter: '1', pro: '5', agency: 'Unlimited' },
    ],
  },
  {
    category: 'Analytics',
    rows: [
      { label: 'Analytics window', free: '7 days', starter: '30 days', pro: '90 days', agency: 'Full history' },
      { label: 'Per-post breakdown', free: false, starter: true, pro: true, agency: true },
      { label: 'Cross-platform reports', free: false, starter: false, pro: true, agency: true },
      { label: 'White-label PDF reports', free: false, starter: false, pro: false, agency: true },
      { label: 'Competitor tracking', free: false, starter: false, pro: true, agency: true },
    ],
  },
  {
    category: 'AI Features',
    rows: [
      { label: 'AI caption suggestions', free: false, starter: '10/mo', pro: 'Unlimited', agency: 'Unlimited' },
      { label: 'Best-time posting engine', free: false, starter: false, pro: true, agency: true },
      { label: 'Hashtag recommendations', free: false, starter: true, pro: true, agency: true },
      { label: 'Content score prediction', free: false, starter: false, pro: true, agency: true },
    ],
  },
  {
    category: 'Integrations & API',
    rows: [
      { label: 'Instagram, LinkedIn, Facebook', free: true, starter: true, pro: true, agency: true },
      { label: 'API access', free: false, starter: false, pro: false, agency: true },
      { label: 'Custom integrations', free: false, starter: false, pro: false, agency: true },
      { label: 'SSO & advanced permissions', free: false, starter: false, pro: false, agency: true },
    ],
  },
  {
    category: 'Support',
    rows: [
      { label: 'Support channel', free: 'Community', starter: 'Email', pro: 'Priority (4h)', agency: 'Dedicated CSM' },
      { label: 'Onboarding assistance', free: false, starter: false, pro: true, agency: true },
      { label: 'SLA guarantee', free: false, starter: false, pro: false, agency: true },
    ],
  },
];

const PLAN_COLS: Array<{ key: keyof FeatureRow; label: string; accent?: boolean }> = [
  { key: 'free',    label: 'Free' },
  { key: 'starter', label: 'Starter' },
  { key: 'pro',     label: 'Pro', accent: true },
  { key: 'agency',  label: 'Agency' },
];

function Cell({ value, accent }: { value: CellValue; accent?: boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className={cn('flex h-6 w-6 mx-auto items-center justify-center rounded-full',
        accent ? 'bg-[#C8553A]/15 text-[#C8553A]' : 'bg-[#EFE9DC] text-[#6B655B]'
      )}>
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    ) : (
      <span className="mx-auto block h-px w-4 bg-[#E7E0D0]" />
    );
  }
  return (
    <span className={cn('text-[0.8rem] font-medium', accent ? 'text-[#C8553A]' : 'text-[#3D3A30]')}>
      {value}
    </span>
  );
}

function ComparisonTable() {
  return (
    <div className="mt-24 mx-auto max-w-[1200px]">
      {/* Section header */}
      <div className="mb-12 text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C8553A]/20 bg-[#C8553A]/8 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#C8553A]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C8553A]" />
          Full comparison
        </span>
        <h2 className="mt-5 text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#15140F]">
          Everything, side by side.
        </h2>
        <p className="mt-3 text-[0.95rem] font-light text-[#3D3A30]">
          Every feature across every plan — no surprises.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#EFE9DC]">
        <table className="w-full border-collapse text-left">
          {/* Sticky column headers */}
          <thead>
            <tr className="border-b border-border">
              <th className="py-5 pl-8 pr-4 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#6B655B] w-[260px]">
                Feature
              </th>
              {PLAN_COLS.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'py-5 px-6 text-center text-[0.82rem] font-bold tracking-tight',
                    col.accent ? 'text-[#C8553A]' : 'text-[#3D3A30]'
                  )}
                >
                  {col.label}
                  {col.accent && (
                    <span className="ml-2 rounded-full border border-[#C8553A]/22 bg-[#C8553A]/10 px-2 py-0.5 text-[0.52rem] font-bold uppercase text-[#C8553A]">
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
                {/* Category row */}
                <tr key={`cat-${gi}`} className="border-t border-border">
                  <td
                    colSpan={5}
                    className="py-4 pl-8 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#C8553A]/60"
                  >
                    {group.category}
                  </td>
                </tr>

                {/* Feature rows */}
                {group.rows.map((row, ri) => (
                  <tr
                    key={`${gi}-${ri}`}
                    className={cn(
                      'border-t border-border transition-colors',
                      ri % 2 === 0 ? 'bg-transparent' : 'bg-[#FBF8F2]'
                    )}
                  >
                    <td className="py-4 pl-8 pr-4 text-[0.85rem] text-[#6B655B]">{row.label}</td>
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
  { q: 'Can I change plans later?', a: 'Yes — upgrade or downgrade anytime from your workspace settings. Billing is prorated.' },
  { q: 'Is there a free trial?', a: 'All paid plans include a 14-day free trial. No credit card required to start.' },
  { q: 'What counts as a social account?', a: 'Each connected Instagram, LinkedIn, or Facebook profile counts as one account.' },
  { q: 'Do you offer refunds?', a: 'Yes. If you cancel within 7 days of a charge, we will issue a full refund, no questions asked.' },
];

function FAQ() {
  return (
    <div className="mt-24 mx-auto max-w-[860px]">
      <h3 className="mb-10 text-center text-[clamp(20px,3vw,28px)] font-medium tracking-[-0.03em] text-[#15140F]">
        Frequently asked questions
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        {FAQS.map((faq) => (
          <div
            key={faq.q}
            className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6"
          >
            <p className="mb-2 text-[0.9rem] font-semibold text-[#15140F]">{faq.q}</p>
            <p className="text-[0.85rem] leading-[1.7] text-[#3D3A30]">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function PricingPage() {
  useSEO({
    title: 'Vielinks Pricing - Plans for Every Social Media Team',
    description: 'Start free with 1 social account. Upgrade to Pro or Agency for unlimited posts, AI features, white-label reports, and competitor tracking.',
    keywords: 'social media pricing, social scheduler cost, Instagram management pricing, LinkedIn tools cost',
  });

  const navigate    = useNavigate();
  const [billing,    setBilling]    = useState<BillingPlan>('monthly');
  const [dialogPlan, setDialogPlan] = useState<PlanDef | null>(null);

  return (
    <div className="min-h-screen bg-[#F6F2EA] text-[#15140F] overflow-x-hidden">
      <SiteNav />

      <main className="mx-auto max-w-[1440px] px-6 md:px-12 pt-36 pb-28">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.85, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-4"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C8553A]/20 bg-[#C8553A]/8 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#C8553A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C8553A]" />
            Pricing
          </span>
          <h1 className="mt-5 text-[clamp(36px,5vw,60px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#15140F]">
            Simple pricing. <span className="text-[#C8553A]">Clear plans.</span>
          </h1>
          <p className="mt-5 text-[1rem] font-light leading-[1.8] text-[#3D3A30] max-w-xl mx-auto">
            Start free, no credit card required. Every paid plan includes a 14-day free trial.
            Upgrade, downgrade, or cancel anytime.
          </p>
          <BillingToggle
            billing={billing}
            onSwitch={() => setBilling(b => b === 'monthly' ? 'annually' : 'monthly')}
          />
        </motion.div>

        {/* Ambient glow */}
        <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-[#C8553A]/[0.04] blur-[120px]" />

        {/* Plan cards */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4 lg:items-start"
        >
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} billing={billing} onSelectPlan={setDialogPlan} />
          ))}
        </motion.div>

        <p className="mt-8 text-center text-[0.8rem] text-[#6B655B]">
          All plans include a 14-day free trial · Cancel anytime · No hidden fees
        </p>

        <PlanSignupDialog
          plan={dialogPlan}
          billing={billing}
          onClose={() => setDialogPlan(null)}
        />

        {/* Comparison table */}
        <ComparisonTable />

        {/* FAQ */}
        <FAQ />

        {/* Bottom CTA */}
        <div className="mt-24 text-center">
          <div className="inline-flex flex-col items-center gap-5 rounded-[2rem] border border-[#C8553A]/15 bg-[#C8553A]/[0.04] px-12 py-10 backdrop-blur-xl">
            <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-[#15140F]">
              Still not sure which plan fits?
            </h3>
            <p className="text-[0.9rem] text-[#3D3A30] max-w-sm text-center">
              Start with Free and upgrade when you are ready. Or contact us and we will recommend the right plan for your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/register')}
                className="rounded-full bg-[#C8553A] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#A53F28] transition-all hover:shadow-[0_0_36px_rgba(200,85,58,0.28)]"
              >
                Start for free
              </button>
              <button
                onClick={() => { window.location.href = 'mailto:hello@vielinks.com?subject=Vielinks%20plan%20recommendation'; }}
                className="rounded-full border border-white/[0.12] bg-white/[0.04] px-8 py-3.5 text-sm font-semibold text-[#6B655B] hover:border-[#C8553A]/30 hover:text-[#15140F]/80 transition-all"
              >
                Contact sales
              </button>
            </div>
          </div>
        </div>
      </main>

      <ObsidianFooter />
    </div>
  );
}
