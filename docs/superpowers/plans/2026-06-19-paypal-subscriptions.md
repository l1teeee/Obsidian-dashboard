# PayPal Subscriptions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mock credit card checkout with real PayPal annual subscription buttons, update all pricing to $10/$15/$25/mo billed annually (no free tier), and provide backend webhook guidance.

**Architecture:** The PayPal JS SDK (`@paypal/react-paypal-js`) renders subscription buttons in `Checkout.tsx`. When the user approves, the frontend POSTs the `subscriptionId` to the backend. PayPal also fires a webhook to the backend independently for subscription lifecycle events. Plan IDs are read from Vite env vars at runtime.

**Tech Stack:** React 19, Vite, TypeScript, `@paypal/react-paypal-js`, existing `apiFetch` wrapper from `src/lib/api.ts`.

## Global Constraints

- All plans are annual-only billing — no monthly toggle anywhere in the UI
- Prices are monthly equivalents: Starter $10/mo, Pro $15/mo, Studio $25/mo (billed as $120/$180/$300 per year)
- Never expose `PAYPAL_CLIENT_SECRET` on the frontend — only `VITE_PAYPAL_CLIENT_ID` (public)
- PayPal Plan IDs come from env vars: `VITE_PAYPAL_PLAN_ID_STARTER`, `VITE_PAYPAL_PLAN_ID_PRO`, `VITE_PAYPAL_PLAN_ID_STUDIO`
- Use the existing `apiFetch` from `src/lib/api.ts` for backend calls — do not use raw `fetch`
- TypeScript must compile cleanly after each task: `npx tsc --noEmit`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `.env.example` | Create | Documents required PayPal env vars |
| `src/services/paypal.service.ts` | Create | Maps planId → PayPal Plan ID from env vars |
| `src/components/landing/PricingSection.tsx` | Modify | Update `PlanDef` type, `PLANS` data, `PlanCard`, remove `BillingToggle` |
| `src/components/landing/PlanSignupDialog.tsx` | Modify | Remove `billing` prop, show annual price only |
| `src/pages/LandingPage.tsx` | Modify | Update inline `plans` array (lines 582–586) and subtitle copy |
| `src/pages/Checkout.tsx` | Modify | Replace mock card form with `PayPalScriptProvider` + `PayPalButtons` |
| `package.json` | Modify | Add `@paypal/react-paypal-js` dependency |

---

## PREREQUISITE (do before Task 1)

In the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/):

1. Create a **Product**: name "Vielinks", type "Service"
2. Create **3 Billing Plans**, each with billing cycle **Annual**:
   - Starter: $120 / year
   - Pro: $180 / year
   - Studio: $300 / year
3. (Optional) Add a 14-day free trial at $0 to each plan
4. Register a **Webhook** URL: `POST https://<your-domain>/payments/paypal/webhook`
   - Events: `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`, `BILLING.SUBSCRIPTION.SUSPENDED`, `BILLING.SUBSCRIPTION.EXPIRED`
5. Copy the 3 Plan IDs and your Client ID — you'll need them in Task 1

---

## Task 1: Environment variables and PayPal service

**Files:**
- Create: `.env.example`
- Create: `src/services/paypal.service.ts`

**Interfaces:**
- Produces: `getPaypalPlanId(planId: string): string` — used by Checkout.tsx in Task 5

- [ ] **Step 1: Create `.env.example`**

```
# PayPal
VITE_PAYPAL_CLIENT_ID=
VITE_PAYPAL_PLAN_ID_STARTER=
VITE_PAYPAL_PLAN_ID_PRO=
VITE_PAYPAL_PLAN_ID_STUDIO=

# Backend PayPal (server-side only — never prefix with VITE_)
# PAYPAL_CLIENT_ID=
# PAYPAL_CLIENT_SECRET=
# PAYPAL_WEBHOOK_ID=
# PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
```

- [ ] **Step 2: Copy `.env.example` to `.env` and fill in your PayPal values**

```bash
cp .env.example .env
# then open .env and paste your Client ID and 3 Plan IDs
```

- [ ] **Step 3: Create `src/services/paypal.service.ts`**

```ts
const PLAN_ID_MAP: Record<string, string> = {
  starter: import.meta.env.VITE_PAYPAL_PLAN_ID_STARTER as string,
  pro:     import.meta.env.VITE_PAYPAL_PLAN_ID_PRO as string,
  studio:  import.meta.env.VITE_PAYPAL_PLAN_ID_STUDIO as string,
};

export function getPaypalPlanId(planId: string): string {
  const id = PLAN_ID_MAP[planId];
  if (!id) throw new Error(`No PayPal plan ID configured for plan: ${planId}`);
  return id;
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add .env.example src/services/paypal.service.ts
git commit -m "feat: add PayPal env vars and plan ID service"
```

---

## Task 2: Update PricingSection.tsx — types, plans data, PlanCard, remove BillingToggle

**Files:**
- Modify: `src/components/landing/PricingSection.tsx`

**Interfaces:**
- Consumes: nothing from prior tasks
- Produces:
  - `PlanDef` type (updated — no `monthlyPrice`, no `ctaRoute`)
  - `PLANS` constant with new prices
  - `PlanCard({ plan, onSelectPlan })` component
  - default export `PricingSection` component (no `billing` state)

- [ ] **Step 1: Replace the entire content of `src/components/landing/PricingSection.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: errors only about `PlanSignupDialog` (which uses the removed `billing` prop) — that's fixed in Task 3. If there are other errors, fix them first.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/PricingSection.tsx
git commit -m "feat: update pricing plans to $10/$15/$25 annual, remove billing toggle"
```

---

## Task 3: Update PlanSignupDialog.tsx — remove billing prop

**Files:**
- Modify: `src/components/landing/PlanSignupDialog.tsx`

**Interfaces:**
- Consumes: `PlanDef` from `./PricingSection` (updated type — has `annuallyPrice`, no `monthlyPrice`)
- Produces: dialog component used by `PricingSection` — stores `{ planId, billing: 'annually', price, name }` in `sessionStorage`

- [ ] **Step 1: Replace the entire content of `src/components/landing/PlanSignupDialog.tsx`**

```tsx
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { PlanDef } from './PricingSection';

interface PlanSignupDialogProps {
  plan:    PlanDef | null;
  onClose: () => void;
}

const PLAN_ICONS: Record<string, string> = {
  starter: 'bolt',
  pro:     'auto_awesome',
  studio:  'corporate_fare',
};

export default function PlanSignupDialog({ plan, onClose }: PlanSignupDialogProps) {
  const navigate = useNavigate();
  const price    = plan?.annuallyPrice ?? 0;

  const storePlan = () => {
    if (!plan) return;
    sessionStorage.setItem('pending_plan', JSON.stringify({
      planId:  plan.id,
      billing: 'annually',
      price,
      name:    plan.name,
    }));
  };

  const handleRegister = () => { storePlan(); navigate('/register'); };
  const handleLogin    = () => { storePlan(); navigate('/login');    };

  return (
    <AnimatePresence>
      {plan && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-[201] w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-[0_40px_120px_rgba(15,23,42,0.22)]">

              {/* Purple ambient top glow */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#111827]/[0.07] to-transparent" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] text-[#94A3B8] hover:text-[#0F172A] transition-colors"
              >
                <X size={14} />
              </button>

              <div className="relative p-7">
                {/* Plan icon + badge */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#111827]/10 border border-[#111827]/20 flex items-center justify-center shadow-[0_0_20px_rgba(14,159,110,0.15)]">
                    <span
                      className="material-symbols-outlined text-[#111827]"
                      style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}
                    >
                      {PLAN_ICONS[plan.id] ?? 'star'}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest font-bold">Selected plan</p>
                    <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">{plan.name}</h2>
                  </div>
                  {plan.badge && (
                    <span className="ml-auto px-2.5 py-1 rounded-full border border-[#111827]/25 bg-[#111827]/10 text-[#111827] text-[10px] font-bold uppercase tracking-wider">
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-4xl font-extrabold text-[#0F172A] tracking-tight">${price}</span>
                  <span className="text-sm text-[#94A3B8]">/ mo</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mb-5">
                  Billed annually · ${price * 12} / yr · cancel anytime
                </p>

                {/* Features (first 4) */}
                <div className="space-y-2 mb-6 pb-5 border-b border-[#E2E8F0]">
                  {plan.features.slice(0, 4).map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-[13px] text-[#334155]">
                      <Check size={13} strokeWidth={2.5} className="text-[#111827] shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                {/* Trial note */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#111827]/5 border border-[#111827]/10 mb-5">
                  <span className="material-symbols-outlined text-[#111827] shrink-0" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>
                    schedule
                  </span>
                  <p className="text-[11px] text-[#94A3B8]">
                    <span className="text-[#0F172A] font-semibold">14-day free trial</span> included · no credit card to start
                  </p>
                </div>

                {/* CTAs */}
                <div className="space-y-2.5">
                  <button
                    onClick={handleRegister}
                    className="w-full rounded-xl bg-[#111827] py-3 text-sm font-bold text-white shadow-[0_16px_36px_rgba(14,159,110,0.24)] transition-all hover:bg-[#0B1220] hover:shadow-[0_18px_42px_rgba(14,159,110,0.28)] active:scale-[0.98]"
                  >
                    {plan.cta} →
                  </button>
                  <button
                    onClick={handleLogin}
                    className="w-full rounded-xl border border-[#CBD5E1] py-2.5 text-sm text-[#94A3B8] transition-all hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                  >
                    Already have an account? <span className="text-[#111827]">Sign in</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors from PricingSection or PlanSignupDialog.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/PlanSignupDialog.tsx
git commit -m "feat: update PlanSignupDialog to annual-only pricing"
```

---

## Task 4: Update LandingPage.tsx inline pricing section

**Files:**
- Modify: `src/pages/LandingPage.tsx` (lines 582–648 only — the inline `Pricing` function)

**Interfaces:**
- Consumes: nothing from prior tasks (this section is self-contained)
- Produces: updated inline pricing cards on the landing page

- [ ] **Step 1: Find the `plans` array in `LandingPage.tsx` (line ~582) and replace it**

Old code (lines 582–586):
```ts
const plans = [
  { name: 'Starter', price: 0, unit: '/ forever', desc: 'One person, one workspace, three connected accounts.', items: ['Up to 30 posts / month', '7-day analytics window', 'Email-only support'], cta: 'Start free', featured: false },
  { name: 'Pro', price: 18, unit: '/ user / mo', desc: 'For teams of 2–8 who post weekly across all three networks.', items: ['Unlimited posts', 'Full analytics history', 'AI caption drafts', 'Approval workflows'], cta: 'Start 14-day trial', featured: true },
  { name: 'Studio', price: 64, unit: '/ user / mo', desc: 'For agencies and in-house teams managing multiple brands.', items: ['Everything in Pro', 'Multiple brand workspaces', 'Client review portals', 'Priority support'], cta: 'Talk to us', featured: false },
];
```

New code:
```ts
const plans = [
  { name: 'Starter', price: 10, unit: '/ mo', desc: 'One person, one workspace, three connected accounts.', items: ['Up to 30 posts / month', '7-day analytics window', 'Email-only support'], cta: 'Subscribe now', featured: false },
  { name: 'Pro', price: 15, unit: '/ mo', desc: 'For teams of 2–8 who post weekly across all three networks.', items: ['Unlimited posts', 'Full analytics history', 'AI caption drafts', 'Approval workflows'], cta: 'Subscribe now', featured: true },
  { name: 'Studio', price: 25, unit: '/ mo', desc: 'For agencies and in-house teams managing multiple brands.', items: ['Everything in Pro', 'Multiple brand workspaces', 'Client review portals', 'Priority support'], cta: 'Subscribe now', featured: false },
];
```

- [ ] **Step 2: Update the subtitle paragraph in the `Pricing` section (line ~647)**

Old:
```tsx
<p className="text-[16px] leading-[1.65] text-[#64748B] max-w-140 mb-12">
  A free tier that's actually useful, a paid tier priced for working teams, and a studio tier for agencies. No "contact sales" until the studio plan.
</p>
```

New:
```tsx
<p className="text-[16px] leading-[1.65] text-[#64748B] max-w-140 mb-12">
  Three plans, all billed annually. Built for solo creators, growing teams, and agencies. No hidden fees, cancel anytime.
</p>
```

- [ ] **Step 3: Update the CTA `<Link>` inside the card map to point to `/pricing`**

The card CTA at line ~671 currently renders `<Link to="/register">`. Since these are now paid plans, users should go to `/pricing` to see more details before subscribing. Change the `to` prop:

Old:
```tsx
<Link to="/register" className="mt-auto w-full inline-flex justify-center items-center text-[14px] font-medium px-4.5 py-2.5 rounded-[10px] transition-[background-color,color,transform] duration-150 active:scale-[0.97] group-hover:-translate-y-0.5"
  style={p.featured ? { background: '#FFFFFF', color: '#0F172A' } : { background: '#0F172A', color: '#F8FAFC' }}>
  {p.cta}
</Link>
```

New:
```tsx
<Link to="/pricing" className="mt-auto w-full inline-flex justify-center items-center text-[14px] font-medium px-4.5 py-2.5 rounded-[10px] transition-[background-color,color,transform] duration-150 active:scale-[0.97] group-hover:-translate-y-0.5"
  style={p.featured ? { background: '#FFFFFF', color: '#0F172A' } : { background: '#0F172A', color: '#F8FAFC' }}>
  {p.cta}
</Link>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/LandingPage.tsx
git commit -m "feat: update LandingPage pricing cards to new prices and copy"
```

---

## Task 5: Install @paypal/react-paypal-js and rewrite Checkout.tsx

**Files:**
- Modify: `src/pages/Checkout.tsx`
- Modify: `package.json` (via npm install)

**Interfaces:**
- Consumes:
  - `getPaypalPlanId(planId: string): string` from `src/services/paypal.service.ts` (Task 1)
  - `apiFetch<T>(path, options)` from `src/lib/api.ts`
  - `PendingPlan` from sessionStorage: `{ planId: string, billing: 'annually', price: number, name: string }`
- Produces: working checkout page with PayPal subscription buttons

- [ ] **Step 1: Install the PayPal React SDK**

```bash
npm install @paypal/react-paypal-js
```

Expected: package added to `node_modules` and `package.json` dependencies.

- [ ] **Step 2: Replace the entire content of `src/pages/Checkout.tsx`**

```tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { apiFetch } from '../lib/api';
import { getPaypalPlanId } from '../services/paypal.service';

interface PendingPlan {
  planId:  string;
  billing: 'annually';
  price:   number;
  name:    string;
}

const PLAN_FEATURES: Record<string, string[]> = {
  starter: ['Up to 30 posts / month', '7-day analytics window', 'Email-only support'],
  pro:     ['Unlimited posts', 'Full analytics history', 'AI caption drafts', 'Approval workflows'],
  studio:  ['Everything in Pro', 'Multiple brand workspaces', 'Client review portals', 'Priority support'],
};

const PLAN_ICON: Record<string, string> = {
  starter: 'bolt',
  pro:     'auto_awesome',
  studio:  'corporate_fare',
};

type Step = 'form' | 'success';

export default function Checkout() {
  const navigate = useNavigate();
  const [plan,        setPlan]        = useState<PendingPlan | null>(null);
  const [step,        setStep]        = useState<Step>('form');
  const [paypalError, setPaypalError] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('pending_plan');
    if (!raw) { navigate('/dashboard', { replace: true }); return; }
    try { setPlan(JSON.parse(raw) as PendingPlan); }
    catch { navigate('/dashboard', { replace: true }); }
  }, [navigate]);

  const goToDashboard = () => navigate('/dashboard', { replace: true });

  if (!plan) return null;

  const features    = PLAN_FEATURES[plan.planId] ?? [];
  const icon        = PLAN_ICON[plan.planId] ?? 'star';
  const annualTotal = plan.price * 12;

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#111827]/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[#0B1220]/[0.04] blur-[100px]" />

      <AnimatePresence mode="wait">
        {step === 'form' ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[860px] grid lg:grid-cols-[1fr_1.1fr] gap-0 rounded-3xl border border-border bg-[#FFFFFF] shadow-[0_40px_80px_rgba(0,0,0,0.12)] overflow-hidden"
          >
            {/* ── Left: Plan summary ── */}
            <div className="relative p-8 lg:border-r border-border bg-[#F1F5F9] flex flex-col">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#111827]/[0.04] to-transparent" />

              <button
                onClick={goToDashboard}
                className="relative flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors mb-8 w-fit"
              >
                <ArrowLeft size={12} />
                Skip for now
              </button>

              <div className="relative flex-1 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-[#111827]/10 border border-[#111827]/20 flex items-center justify-center mb-5">
                  <span
                    className="material-symbols-outlined text-[#111827]"
                    style={{ fontSize: 26, fontVariationSettings: "'FILL' 1" }}
                  >
                    {icon}
                  </span>
                </div>

                <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-bold mb-1">Activating plan</p>
                <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mb-1">{plan.name}</h1>

                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-4xl font-extrabold text-[#0F172A]">${plan.price}</span>
                  <span className="text-sm text-[#64748B]">/ mo</span>
                </div>
                <p className="text-[11px] text-[#64748B] mb-6">
                  Billed annually · ${annualTotal} / yr
                </p>

                <div className="space-y-2.5 mb-auto">
                  {features.map(f => (
                    <div key={f} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#111827]/10 flex items-center justify-center shrink-0">
                        <Check size={11} strokeWidth={2.5} className="text-[#111827]" />
                      </div>
                      <span className="text-sm text-[#334155]">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-5 border-t border-border grid grid-cols-2 gap-3">
                  {[
                    { icon: 'shield', text: 'SSL encrypted' },
                    { icon: 'undo',   text: 'Cancel anytime' },
                  ].map(b => (
                    <div key={b.text} className="flex items-center gap-1.5 text-[11px] text-[#334155]">
                      <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 14 }}>{b.icon}</span>
                      {b.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: PayPal ── */}
            <div className="p-8 flex flex-col">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#0F172A]">Complete your subscription</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Annual billing · cancel anytime</p>
              </div>

              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#111827]/5 border border-[#111827]/10 mb-6">
                <div>
                  <p className="text-xs text-[#64748B]">Total today</p>
                  <p className="text-[10px] text-[#334155]">14-day free trial then billed annually</p>
                </div>
                <span className="text-xl font-extrabold text-[#0F172A]">${annualTotal} / yr</span>
              </div>

              <PayPalScriptProvider
                options={{
                  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID as string,
                  vault:    true,
                  intent:   'subscription',
                }}
              >
                <PayPalButtons
                  style={{ layout: 'vertical', color: 'black', shape: 'rect', label: 'subscribe' }}
                  createSubscription={(_data, actions) =>
                    actions.subscription.create({ plan_id: getPaypalPlanId(plan.planId) })
                  }
                  onApprove={async (data) => {
                    setPaypalError(null);
                    try {
                      await apiFetch('/payments/paypal/subscription', {
                        method: 'POST',
                        body:   JSON.stringify({
                          subscriptionId: data.subscriptionID,
                          planId:         plan.planId,
                        }),
                      });
                      sessionStorage.removeItem('pending_plan');
                      setStep('success');
                    } catch {
                      setPaypalError('There was a problem confirming your subscription. Please contact support.');
                    }
                  }}
                  onError={() =>
                    setPaypalError('Something went wrong with PayPal. Please try again.')
                  }
                  onCancel={() =>
                    setPaypalError('Payment cancelled. Click the PayPal button to try again.')
                  }
                />
              </PayPalScriptProvider>

              {paypalError && (
                <p className="mt-4 text-sm text-red-500 text-center">{paypalError}</p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative text-center max-w-sm mx-auto flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-[#111827]/10 border border-[#111827]/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(14,159,110,0.15)]">
              <Check size={34} className="text-[#111827]" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">You're all set!</h2>
            <p className="text-[#64748B] text-sm mb-2">
              <span className="text-[#111827] font-semibold">{plan.name}</span> plan activated.
            </p>
            <p className="text-[#334155] text-xs mb-8">Your subscription is active. Welcome to Vielinks!</p>
            <button
              onClick={goToDashboard}
              className="px-8 py-3 rounded-xl bg-[#111827] text-white font-bold text-sm hover:bg-[#0B1220] transition-all active:scale-[0.98]"
            >
              Go to dashboard →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Start the dev server and verify the checkout page visually**

```bash
npm run dev
```

Navigate to `/checkout` — it will redirect to `/dashboard` (no `pending_plan` in sessionStorage). To test the PayPal buttons:
1. Open the browser console and run: `sessionStorage.setItem('pending_plan', JSON.stringify({ planId: 'pro', billing: 'annually', price: 15, name: 'Pro' }))`
2. Refresh `/checkout`
3. Confirm: left panel shows "Pro · $15/mo · Billed annually · $180/yr", right panel shows PayPal button
4. Click the PayPal button — it should open a PayPal popup (requires valid `VITE_PAYPAL_CLIENT_ID` in `.env`)

- [ ] **Step 5: Commit**

```bash
git add src/pages/Checkout.tsx package.json package-lock.json
git commit -m "feat: replace mock checkout with PayPal subscription buttons"
```

---

## Backend Reference (implement separately in your Node.js server)

These two endpoints must exist on the backend for the integration to be complete. This plan covers only the frontend — implement these in your backend repo.

### `POST /payments/paypal/subscription`

```
Auth: Bearer token (existing middleware)
Body: { subscriptionId: string, planId: string }
Response: { success: true }

Steps:
1. Verify subscriptionId via PayPal API:
   GET https://api-m.paypal.com/v1/billing/subscriptions/{subscriptionId}
   (use your PAYPAL_CLIENT_SECRET to get an access token first)
2. Confirm the plan_id on the subscription matches the expected one for planId
3. Store subscriptionId + planId on the authenticated user record
4. Return { success: true }
```

### `POST /payments/paypal/webhook`

```
No auth header — verify PayPal signature instead
Headers to check: PAYPAL-TRANSMISSION-SIG, PAYPAL-TRANSMISSION-ID,
                  PAYPAL-TRANSMISSION-TIME, PAYPAL-CERT-URL, PAYPAL-AUTH-ALGO
Body: raw (do not parse before verifying signature)

Events to handle:
  BILLING.SUBSCRIPTION.ACTIVATED  → set user.planStatus = 'active'
  BILLING.SUBSCRIPTION.CANCELLED  → set user.planStatus = 'cancelled', planId = null
  BILLING.SUBSCRIPTION.SUSPENDED  → set user.planStatus = 'suspended'
  BILLING.SUBSCRIPTION.EXPIRED    → same as CANCELLED

Look up user by event.resource.subscriber.email_address or stored subscriptionId.
Always return HTTP 200 — PayPal retries on non-2xx.
```
