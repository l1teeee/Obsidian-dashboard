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
            <div className="relative overflow-hidden rounded-3xl border border-[#E6DDF0] bg-[#FFFFFF] shadow-[0_40px_120px_rgba(24,17,31,0.22)]">

              {/* Purple ambient top glow */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#7C3AED]/[0.07] to-transparent" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg border border-[#E6DDF0] bg-[#F1ECFA] text-[#71657E] hover:text-[#18111F] transition-colors"
              >
                <X size={14} />
              </button>

              <div className="relative p-7">
                {/* Plan icon + badge */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.15)]">
                    <span
                      className="material-symbols-outlined text-[#7C3AED]"
                      style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}
                    >
                      {PLAN_ICONS[plan.id] ?? 'star'}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#71657E] uppercase tracking-widest font-bold">Selected plan</p>
                    <h2 className="text-xl font-extrabold text-[#18111F] tracking-tight">{plan.name}</h2>
                  </div>
                  {plan.badge && (
                    <span className="ml-auto px-2.5 py-1 rounded-full border border-[#7C3AED]/25 bg-[#7C3AED]/10 text-[#7C3AED] text-[10px] font-bold uppercase tracking-wider">
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-4xl font-extrabold text-[#18111F] tracking-tight">${price}</span>
                  <span className="text-sm text-[#71657E]">/{billing === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <p className="text-[11px] text-[#71657E] mb-5">
                  {billing === 'monthly' ? 'Billed monthly · cancel anytime' : 'Billed annually · ~17% off'}
                </p>

                {/* Features (first 4) */}
                <div className="space-y-2 mb-6 pb-5 border-b border-[#E6DDF0]">
                  {plan.features.slice(0, 4).map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-[13px] text-[#4A4057]">
                      <Check size={13} strokeWidth={2.5} className="text-[#7C3AED] shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                {/* Trial note */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#7C3AED]/5 border border-[#7C3AED]/10 mb-5">
                  <span className="material-symbols-outlined text-[#7C3AED] shrink-0" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>
                    schedule
                  </span>
                  <p className="text-[11px] text-[#71657E]">
                    <span className="text-[#18111F] font-semibold">14-day free trial</span> included · no credit card to start
                  </p>
                </div>

                {/* CTAs */}
                <div className="space-y-2.5">
                  <button
                    onClick={handleRegister}
                    className="w-full rounded-xl bg-[#7C3AED] py-3 text-sm font-bold text-white shadow-[0_16px_36px_rgba(124,58,237,0.24)] transition-all hover:bg-[#6D28D9] hover:shadow-[0_18px_42px_rgba(124,58,237,0.28)] active:scale-[0.98]"
                  >
                    {plan.cta} →
                  </button>
                  <button
                    onClick={handleLogin}
                    className="w-full rounded-xl border border-[#CDB9DF] py-2.5 text-sm text-[#71657E] transition-all hover:bg-[#F1ECFA] hover:text-[#18111F]"
                  >
                    Already have an account? <span className="text-[#7C3AED]">Sign in</span>
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
