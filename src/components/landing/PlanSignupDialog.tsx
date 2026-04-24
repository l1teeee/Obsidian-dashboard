import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { PlanDef, BillingPlan } from './PricingSection';

interface PlanSignupDialogProps {
  plan:    PlanDef | null;
  billing: BillingPlan;
  onClose: () => void;
}

const PLAN_ICONS: Record<string, string> = {
  starter: 'bolt',
  pro:     'auto_awesome',
  agency:  'corporate_fare',
};

export default function PlanSignupDialog({ plan, billing, onClose }: PlanSignupDialogProps) {
  const navigate = useNavigate();
  const price    = plan ? (billing === 'monthly' ? plan.monthlyPrice : plan.annuallyPrice) : 0;

  const storePlan = () => {
    if (!plan) return;
    sessionStorage.setItem('pending_plan', JSON.stringify({
      planId:  plan.id,
      billing,
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
            <div className="relative rounded-3xl border border-[#4c4450]/25 bg-[#131313] shadow-[0_40px_120px_rgba(0,0,0,0.7)] overflow-hidden">

              {/* Purple ambient top glow */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#d394ff]/[0.07] to-transparent" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg border border-[#4c4450]/20 bg-[#1a1919] text-[#988d9c] hover:text-white transition-colors"
              >
                <X size={14} />
              </button>

              <div className="relative p-7">
                {/* Plan icon + badge */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#d394ff]/10 border border-[#d394ff]/20 flex items-center justify-center shadow-[0_0_20px_rgba(211,148,255,0.15)]">
                    <span
                      className="material-symbols-outlined text-[#d394ff]"
                      style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}
                    >
                      {PLAN_ICONS[plan.id] ?? 'star'}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#988d9c] uppercase tracking-widest font-bold">Selected plan</p>
                    <h2 className="text-xl font-extrabold text-white tracking-tight">{plan.name}</h2>
                  </div>
                  {plan.badge && (
                    <span className="ml-auto px-2.5 py-1 rounded-full border border-[#d394ff]/25 bg-[#d394ff]/10 text-[#d394ff] text-[10px] font-bold uppercase tracking-wider">
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">${price}</span>
                  <span className="text-sm text-[#988d9c]">/{billing === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <p className="text-[11px] text-[#4c4450] mb-5">
                  {billing === 'monthly' ? 'Billed monthly · cancel anytime' : 'Billed annually · ~17% off'}
                </p>

                {/* Features (first 4) */}
                <div className="space-y-2 mb-6 pb-5 border-b border-[#4c4450]/15">
                  {plan.features.slice(0, 4).map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-[13px] text-[#cfc2d2]">
                      <Check size={13} strokeWidth={2.5} className="text-[#d394ff] shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                {/* Trial note */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#d394ff]/5 border border-[#d394ff]/10 mb-5">
                  <span className="material-symbols-outlined text-[#d394ff] shrink-0" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>
                    schedule
                  </span>
                  <p className="text-[11px] text-[#988d9c]">
                    <span className="text-white font-semibold">14-day free trial</span> included · no credit card to start
                  </p>
                </div>

                {/* CTAs */}
                <div className="space-y-2.5">
                  <button
                    onClick={handleRegister}
                    className="w-full py-3 rounded-xl bg-[#d394ff] text-[#3a0060] text-sm font-bold shadow-[0_0_24px_rgba(211,148,255,0.3)] hover:shadow-[0_0_36px_rgba(211,148,255,0.45)] hover:bg-[#c97cff] transition-all active:scale-[0.98]"
                  >
                    {plan.cta} →
                  </button>
                  <button
                    onClick={handleLogin}
                    className="w-full py-2.5 rounded-xl border border-[#4c4450]/20 text-sm text-[#988d9c] hover:text-white hover:bg-[#1e1d1d] transition-all"
                  >
                    Already have an account? <span className="text-[#d394ff]">Sign in</span>
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
