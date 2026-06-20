# PayPal Subscriptions Integration — Design Spec

**Date:** 2026-06-19
**Status:** Approved

---

## Context

Vielinks has a React + Vite frontend and a Node.js backend at `localhost:3000`. The landing page has a pricing section (`PricingSection.tsx`) with 3 plans and a checkout page (`Checkout.tsx`) that currently holds a mock credit card form. No real payment is processed today.

Goal: wire up real PayPal annual subscriptions using the PayPal JS SDK on the frontend, with backend webhooks for subscription lifecycle events.

---

## Plans & Pricing

All 3 plans are paid, billed annually. No free tier.

| Plan    | Monthly equivalent | Annual charge | PayPal Plan ID env var              |
|---------|--------------------|---------------|--------------------------------------|
| Starter | $10 / mo           | $120 / year   | `VITE_PAYPAL_PLAN_ID_STARTER`        |
| Pro     | $15 / mo           | $180 / year   | `VITE_PAYPAL_PLAN_ID_PRO`            |
| Studio  | $25 / mo           | $300 / year   | `VITE_PAYPAL_PLAN_ID_STUDIO`         |

---

## PayPal Dashboard Setup (prerequisite — do before coding)

1. Log in to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/).
2. Create a **Product**: name "Vielinks", type "Service".
3. Create **3 Billing Plans** (one per tier), each with:
   - Billing cycle: **Annual** (every 1 year)
   - Pricing: $120 / $180 / $300
   - Trial period: 14 days (optional, $0)
4. Copy the 3 Plan IDs into `.env`.
5. Register a **Webhook** pointing to `POST https://<your-domain>/payments/paypal/webhook` with at minimum these event types:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.SUSPENDED`
   - `BILLING.SUBSCRIPTION.EXPIRED`

---

## Environment Variables

Add to `.env` (and `.env.example`):

```
VITE_PAYPAL_CLIENT_ID=
VITE_PAYPAL_PLAN_ID_STARTER=
VITE_PAYPAL_PLAN_ID_PRO=
VITE_PAYPAL_PLAN_ID_STUDIO=
```

`VITE_PAYPAL_CLIENT_ID` is the **Client ID** from your PayPal app (safe to expose — it's public-facing). Never expose the Client Secret on the frontend.

---

## User Flow

```
Pricing page
  → user clicks plan CTA
  → PlanSignupDialog opens (shows plan summary)
  → user clicks "Create account" or "Sign in"
  → plan stored in sessionStorage as { planId, billing: 'annually', price, name }
  → navigate to /register or /login
  → after auth, backend/frontend redirects to /checkout
  → Checkout.tsx reads pending_plan from sessionStorage
  → shows plan summary (left panel) + PayPal button (right panel)
  → user clicks PayPal button → PayPal popup
  → on approve: frontend calls POST /payments/paypal/subscription
  → backend stores subscriptionId on user record
  → frontend shows success screen → navigate to /dashboard
  → separately: PayPal fires webhook → backend activates plan
```

---

## Frontend Changes

### Package

```bash
npm install @paypal/react-paypal-js
```

### `src/services/paypal.service.ts` (new)

Exports a single function that maps a `planId` string to the correct PayPal Plan ID from env vars. Throws if the env var is missing so misconfiguration fails loudly at runtime.

```ts
const PLAN_ID_MAP: Record<string, string> = {
  starter: import.meta.env.VITE_PAYPAL_PLAN_ID_STARTER,
  pro:     import.meta.env.VITE_PAYPAL_PLAN_ID_PRO,
  studio:  import.meta.env.VITE_PAYPAL_PLAN_ID_STUDIO,
};

export function getPaypalPlanId(planId: string): string {
  const id = PLAN_ID_MAP[planId];
  if (!id) throw new Error(`No PayPal plan ID configured for plan: ${planId}`);
  return id;
}
```

### `src/components/landing/PricingSection.tsx`

- Update `PLANS` array:
  - Remove `monthlyPrice` field from all plans.
  - Set `annuallyPrice` for each: 10, 15, 25 (monthly equivalent; display as `$X / mo, billed annually`).
  - Update CTA text for all plans to `"Subscribe now"`.
  - Remove `ctaRoute` for free plan (no longer exists).
- Remove `BillingToggle` component and all billing-toggle state — there is only one billing period.
- `PlanCard`: display price as `$X / mo` with a sub-label `billed annually · $Y / yr`.

### `src/pages/Checkout.tsx`

Complete rewrite of the right panel:

- Remove: mock card form, expiry/CVC inputs, cardholder name, card/paypal/apple tabs.
- Add: `PayPalScriptProvider` wrapping the page (client ID from env), `PayPalButtons` configured for subscriptions.
- `createSubscription` callback: calls `getPaypalPlanId(plan.planId)` and returns a subscription via the PayPal SDK.
- `onApprove(data)`: POSTs `{ subscriptionId: data.subscriptionID, planId: plan.planId }` to `POST /payments/paypal/subscription`. On success → `setStep('success')`.
- `onError` / `onCancel`: sets an error string displayed below the button with a retry affordance.
- Left panel (plan summary, trust badges) stays unchanged.

---

## Backend Changes (endpoints to implement)

### `POST /payments/paypal/subscription`

Called by the frontend immediately after PayPal approval.

**Request body:**
```json
{ "subscriptionId": "I-XXXXXXXXXXXXXXX", "planId": "starter" }
```

**Behavior:**
1. Optionally call PayPal's `GET /v1/billing/subscriptions/{id}` to verify the subscription is real and matches the expected plan.
2. Store `subscriptionId` and `planId` on the authenticated user record.
3. Return `{ success: true }`.

**Auth:** requires a valid session (Bearer token via existing auth middleware).

---

### `POST /payments/paypal/webhook`

Receives lifecycle events from PayPal.

**Behavior:**
1. Verify the PayPal webhook signature using the `PAYPAL-TRANSMISSION-SIG`, `PAYPAL-TRANSMISSION-ID`, `PAYPAL-TRANSMISSION-TIME`, `PAYPAL-CERT-URL`, and `PAYPAL-AUTH-ALGO` headers against your webhook ID and the raw request body. Reject if invalid.
2. Route on `event.event_type`:

| Event type | Action |
|---|---|
| `BILLING.SUBSCRIPTION.ACTIVATED` | Set user plan to active |
| `BILLING.SUBSCRIPTION.CANCELLED` | Downgrade user plan, set plan to null or "cancelled" |
| `BILLING.SUBSCRIPTION.SUSPENDED` | Mark plan as suspended |
| `BILLING.SUBSCRIPTION.EXPIRED` | Same as cancelled |

3. Look up the user by `event.resource.subscriber.email_address` or by the stored `subscriptionId`.
4. Return HTTP 200 immediately (PayPal retries on non-2xx).

**Backend env vars needed:**
```
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_WEBHOOK_ID=
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com   # or https://api-m.paypal.com for production
```

---

## Error States

| Scenario | Behavior |
|---|---|
| PayPal popup closed by user | `onCancel` fires → show "Payment cancelled. Try again." |
| PayPal SDK error | `onError` fires → show generic error + retry button |
| Backend `/subscription` call fails | Show error toast, stay on checkout (don't navigate away) |
| Missing PayPal Plan ID env var | Runtime throw in `getPaypalPlanId` — caught and shown as config error |

---

## Out of Scope

- Monthly billing option (annual only)
- Apple Pay / card payments (removed from UI for now)
- Subscription management UI (upgrade/downgrade/cancel) — separate feature
- Proration logic
