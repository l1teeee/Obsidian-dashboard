import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, CreditCard, Calendar, Lock, ArrowLeft, RefreshCcw } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose,
} from '../ui/dialog';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import type { UserPlan } from '../../types/users.types';
import { updatePlan } from '../../services/users.service';

// ── Plan data ──────────────────────────────────────────────────────────────────

const PLANS: {
  id: UserPlan;
  name: string;
  price: number;
  description: string;
  badge?: string;
}[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    description: 'Free forever · 1 account',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    description: '$79 / month · 10 accounts',
    badge: 'Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 149,
    description: '$149 / month · Unlimited',
  },
];

const FEATURES = [
  'Unlimited scheduled posts',
  'AI caption generator',
  'Analytics & insights',
  'Multi-platform publishing',
  '7-day money back guarantee',
  'Priority support',
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function PlanStep({
  currentPlan,
  selected,
  onSelect,
  onNext,
  onClose,
  loading,
}: {
  currentPlan: UserPlan;
  selected: UserPlan;
  onSelect: (p: UserPlan) => void;
  onNext: () => void;
  onClose: () => void;
  loading?: boolean;
}) {
  const id = useId();
  const selectedPlan = PLANS.find(p => p.id === selected)!;
  const isFree = selectedPlan.price === 0;
  const isDowngrade = selected === 'starter' && currentPlan !== 'starter';
  const isSame = selected === currentPlan;

  return (
    <div className="space-y-5">
      <div className="flex gap-3.5 mb-2">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#15140F]/30 bg-[#EFE9DC]">
          <RefreshCcw size={16} className="text-[#C8553A]" strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle className="text-left text-[#15140F]">Change your plan</DialogTitle>
          <DialogDescription className="text-left text-[#6B655B]">
            Currently on <span className="text-[#C8553A] font-semibold capitalize">{currentPlan}</span>. Pick a new plan below.
          </DialogDescription>
        </DialogHeader>
      </div>

      <RadioGroup
        className="gap-2"
        value={selected}
        onValueChange={v => onSelect(v as UserPlan)}
      >
        {PLANS.map((plan, i) => (
          <div
            key={plan.id}
            className={[
              'relative flex w-full items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-150 cursor-pointer',
              selected === plan.id
                ? 'border-[#C8553A]/60 bg-[#C8553A]/8 shadow-[0_0_16px_rgba(200,85,58,0.12)]'
                : 'border-[#15140F]/25 bg-[#FBF8F2] hover:border-[#15140F]/40 hover:bg-[#1e1d1d]',
            ].join(' ')}
            onClick={() => onSelect(plan.id)}
          >
            <RadioGroupItem
              value={plan.id}
              id={`${id}-${i}`}
              className="order-1 after:absolute after:inset-0 shrink-0"
            />
            <div className="grow">
              <div className="flex items-center gap-2">
                <Label htmlFor={`${id}-${i}`} className="text-[#15140F] font-semibold cursor-pointer">
                  {plan.name}
                </Label>
                {plan.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#C8553A]/15 border border-[#C8553A]/30 text-[#C8553A] text-[9px] font-bold uppercase tracking-wider">
                    {plan.badge}
                  </span>
                )}
                {plan.id === currentPlan && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#988d9c]/10 text-[#6B655B] text-[9px] font-bold uppercase tracking-wider">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6B655B] mt-0.5">{plan.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>

      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-[#15140F]">All plans include:</p>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {FEATURES.map(f => (
            <li key={f} className="flex items-start gap-1.5 text-[11px] text-[#6B655B]">
              <Check size={12} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#C8553A]" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={onNext}
          disabled={isSame || loading}
          className={[
            'w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2',
            isSame || loading
              ? 'bg-[#252323] text-[#15140F] cursor-not-allowed'
              : isDowngrade
                ? 'bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] hover:bg-[#ffb4ab]/20'
                : 'bg-[#C8553A] text-white shadow-[0_0_20px_rgba(200,85,58,0.25)] hover:shadow-[0_0_30px_rgba(200,85,58,0.4)] hover:bg-[#A53F28]',
          ].join(' ')}
        >
          {loading
            ? <><span className="material-symbols-outlined text-[13px] animate-spin">progress_activity</span> Processing…</>
            : isSame
              ? 'Already on this plan'
              : isFree
                ? 'Downgrade to Free'
                : isDowngrade
                  ? 'Downgrade plan'
                  : `Upgrade to ${selectedPlan.name}`}
        </button>
        <DialogClose asChild>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-[#15140F]/20 text-sm text-[#6B655B] hover:text-[#15140F] hover:bg-[#EFE9DC] transition-all"
          >
            Cancel
          </button>
        </DialogClose>
      </div>
    </div>
  );
}

function CheckoutStep({
  plan,
  onBack,
  onSuccess,
}: {
  plan: typeof PLANS[number];
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry,     setExpiry]     = useState('');
  const [cvc,        setCvc]        = useState('');
  const [name,       setName]       = useState('');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const formatCard   = (v: string) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 1400));
      await updatePlan(plan.id);
      onSuccess();
    } catch {
      setError('Could not update your plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={onBack}
          className="flex size-8 items-center justify-center rounded-lg border border-[#15140F]/25 bg-[#FBF8F2] text-[#6B655B] hover:text-[#15140F] hover:border-[#15140F]/40 transition-all"
        >
          <ArrowLeft size={14} />
        </button>
        <div>
          <h3 className="text-base font-bold text-[#15140F] leading-tight">Payment details</h3>
          <p className="text-xs text-[#6B655B]">
            {plan.name} plan · <span className="text-[#C8553A] font-semibold">${plan.price}/mo</span>
          </p>
        </div>
      </div>

      <form onSubmit={handlePay} className="space-y-4">
        {/* Card number */}
        <div className="space-y-1.5">
          <Label className="text-[#6B655B] text-xs">Card Number</Label>
          <div className="relative">
            <Input
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={e => setCardNumber(formatCard(e.target.value))}
              className="pl-9 bg-white"
              required
            />
            <CreditCard size={14} className="absolute left-3 top-2.5 text-[#15140F]" />
          </div>
        </div>

        {/* Expiry + CVC */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[#6B655B] text-xs">Expiry</Label>
            <div className="relative">
              <Input
                placeholder="MM/YY"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                className="pl-9 bg-white"
                required
              />
              <Calendar size={14} className="absolute left-3 top-2.5 text-[#15140F]" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#6B655B] text-xs">CVC</Label>
            <div className="relative">
              <Input
                placeholder="123"
                value={cvc}
                onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                className="pl-9 bg-white"
                required
              />
              <Lock size={14} className="absolute left-3 top-2.5 text-[#15140F]" />
            </div>
          </div>
        </div>

        {/* Cardholder */}
        <div className="space-y-1.5">
          <Label className="text-[#6B655B] text-xs">Cardholder Name</Label>
          <Input
            placeholder="John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-white"
            required
          />
        </div>

        {/* Summary row */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#C8553A]/6 border border-[#C8553A]/15">
          <span className="text-xs text-[#6B655B]">Total today</span>
          <span className="text-base font-extrabold text-[#15140F]">${plan.price.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-[#C8553A] text-white text-sm font-bold shadow-[0_0_20px_rgba(200,85,58,0.25)] hover:shadow-[0_0_30px_rgba(200,85,58,0.4)] hover:bg-[#A53F28] transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
              Processing…
            </>
          ) : (
            <>
              <Lock size={13} />
              Pay ${plan.price.toFixed(2)}
            </>
          )}
        </button>

        {error && (
          <p className="text-xs text-[#ffb4ab] px-3 py-2 rounded-xl bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-center">
            {error}
          </p>
        )}

        <p className="text-center text-[10px] text-[#15140F] flex items-center justify-center gap-1">
          <Lock size={10} />
          Payments are secure and encrypted
        </p>
      </form>
    </div>
  );
}

function SuccessStep({ plan, onClose }: { plan: typeof PLANS[number]; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-4 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-[#C8553A]/10 border border-[#C8553A]/20 flex items-center justify-center shadow-[0_0_24px_rgba(200,85,58,0.2)]">
        <Check size={28} className="text-[#C8553A]" strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-[#15140F] font-headline">Plan activated!</h3>
        <p className="text-sm text-[#6B655B] mt-1">
          You're now on <span className="text-[#C8553A] font-semibold">{plan.name}</span>. Enjoy the new features.
        </p>
      </div>
      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl bg-[#C8553A] text-white text-sm font-bold hover:bg-[#A53F28] transition-all active:scale-[0.98]"
      >
        Done
      </button>
    </div>
  );
}

// ── Main dialog ────────────────────────────────────────────────────────────────

type Step = 'plan' | 'checkout' | 'success';

interface ChangePlanDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan:  UserPlan;
}

export default function ChangePlanDialog({ open, onOpenChange, currentPlan }: ChangePlanDialogProps) {
  const [step,     setStep]     = useState<Step>('plan');
  const [selected, setSelected] = useState<UserPlan>(currentPlan);
  const [downgrading, setDowngrading] = useState(false);

  const selectedPlanData = PLANS.find(p => p.id === selected)!;
  const isFree           = selectedPlanData.price === 0;

  const handleNext = async () => {
    if (isFree) {
      setDowngrading(true);
      try {
        await updatePlan(selected);
        setStep('success');
      } catch {
        // keep on plan step, error is silent — user can retry
      } finally {
        setDowngrading(false);
      }
    } else {
      setStep('checkout');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setStep('plan'); setSelected(currentPlan); }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#FBF8F2] sm:max-w-[420px] p-6 rounded-2xl">
        <AnimatePresence mode="wait">
          {step === 'plan' && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
            >
              <PlanStep
                currentPlan={currentPlan}
                selected={selected}
                onSelect={setSelected}
                onNext={() => { void handleNext(); }}
                onClose={handleClose}
                loading={downgrading}
              />
            </motion.div>
          )}

          {step === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.18 }}
            >
              <CheckoutStep
                plan={selectedPlanData}
                onBack={() => setStep('plan')}
                onSuccess={() => setStep('success')}
              />
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <SuccessStep plan={selectedPlanData} onClose={handleClose} />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
