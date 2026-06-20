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
