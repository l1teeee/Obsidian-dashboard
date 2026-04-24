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
    description: 'Free forever · 1 workspace',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    description: '$19 / month · 3 workspaces',
    badge: 'Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49,
    description: '$49 / month · Unlimited',
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
}: {
  currentPlan: UserPlan;
  selected: UserPlan;
  onSelect: (p: UserPlan) => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const id = useId();
  const selectedPlan = PLANS.find(p => p.id === selected)!;
  const isFree = selectedPlan.price === 0;
  const isDowngrade = selected === 'starter' && currentPlan !== 'starter';
  const isSame = selected === currentPlan;

  return (
    <div className="space-y-5">
      <div className="flex gap-3.5 mb-2">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#4c4450]/30 bg-[#201f1f]">
          <RefreshCcw size={16} className="text-[#d394ff]" strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle className="text-left text-white">Change your plan</DialogTitle>
          <DialogDescription className="text-left text-[#988d9c]">
            Currently on <span className="text-[#d394ff] font-semibold capitalize">{currentPlan}</span>. Pick a new plan below.
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
                ? 'border-[#d394ff]/60 bg-[#d394ff]/8 shadow-[0_0_16px_rgba(211,148,255,0.12)]'
                : 'border-[#4c4450]/25 bg-[#1a1919] hover:border-[#4c4450]/40 hover:bg-[#1e1d1d]',
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
                <Label htmlFor={`${id}-${i}`} className="text-white font-semibold cursor-pointer">
                  {plan.name}
                </Label>
                {plan.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#d394ff]/15 border border-[#d394ff]/30 text-[#d394ff] text-[9px] font-bold uppercase tracking-wider">
                    {plan.badge}
                  </span>
                )}
                {plan.id === currentPlan && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#988d9c]/10 text-[#988d9c] text-[9px] font-bold uppercase tracking-wider">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-[#988d9c] mt-0.5">{plan.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>

      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-white">All plans include:</p>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {FEATURES.map(f => (
            <li key={f} className="flex items-start gap-1.5 text-[11px] text-[#988d9c]">
              <Check size={12} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#d394ff]" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={onNext}
          disabled={isSame}
          className={[
            'w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-[0.98]',
            isSame
              ? 'bg-[#252323] text-[#4c4450] cursor-not-allowed'
              : isDowngrade
                ? 'bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] hover:bg-[#ffb4ab]/20'
                : 'bg-[#d394ff] text-[#3a0060] shadow-[0_0_20px_rgba(211,148,255,0.25)] hover:shadow-[0_0_30px_rgba(211,148,255,0.4)] hover:bg-[#c97cff]',
          ].join(' ')}
        >
          {isSame
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
            className="w-full py-2.5 rounded-xl border border-[#4c4450]/20 text-sm text-[#988d9c] hover:text-white hover:bg-[#201f1f] transition-all"
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

  const formatCard   = (v: string) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={onBack}
          className="flex size-8 items-center justify-center rounded-lg border border-[#4c4450]/25 bg-[#1a1919] text-[#988d9c] hover:text-white hover:border-[#4c4450]/40 transition-all"
        >
          <ArrowLeft size={14} />
        </button>
        <div>
          <h3 className="text-base font-bold text-white leading-tight">Payment details</h3>
          <p className="text-xs text-[#988d9c]">
            {plan.name} plan · <span className="text-[#d394ff] font-semibold">${plan.price}/mo</span>
          </p>
        </div>
      </div>

      <form onSubmit={handlePay} className="space-y-4">
        {/* Card number */}
        <div className="space-y-1.5">
          <Label className="text-[#988d9c] text-xs">Card Number</Label>
          <div className="relative">
            <Input
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={e => setCardNumber(formatCard(e.target.value))}
              className="pl-9 bg-[#171616] border-[#4c4450]/30 text-white"
              required
            />
            <CreditCard size={14} className="absolute left-3 top-2.5 text-[#4c4450]" />
          </div>
        </div>

        {/* Expiry + CVC */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[#988d9c] text-xs">Expiry</Label>
            <div className="relative">
              <Input
                placeholder="MM/YY"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                className="pl-9 bg-[#171616] border-[#4c4450]/30 text-white"
                required
              />
              <Calendar size={14} className="absolute left-3 top-2.5 text-[#4c4450]" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#988d9c] text-xs">CVC</Label>
            <div className="relative">
              <Input
                placeholder="123"
                value={cvc}
                onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                className="pl-9 bg-[#171616] border-[#4c4450]/30 text-white"
                required
              />
              <Lock size={14} className="absolute left-3 top-2.5 text-[#4c4450]" />
            </div>
          </div>
        </div>

        {/* Cardholder */}
        <div className="space-y-1.5">
          <Label className="text-[#988d9c] text-xs">Cardholder Name</Label>
          <Input
            placeholder="John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-[#171616] border-[#4c4450]/30 text-white"
            required
          />
        </div>

        {/* Summary row */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#d394ff]/6 border border-[#d394ff]/15">
          <span className="text-xs text-[#988d9c]">Total today</span>
          <span className="text-base font-extrabold text-white">${plan.price.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-[#d394ff] text-[#3a0060] text-sm font-bold shadow-[0_0_20px_rgba(211,148,255,0.25)] hover:shadow-[0_0_30px_rgba(211,148,255,0.4)] hover:bg-[#c97cff] transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
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

        <p className="text-center text-[10px] text-[#4c4450] flex items-center justify-center gap-1">
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
      <div className="w-16 h-16 rounded-2xl bg-[#d394ff]/10 border border-[#d394ff]/20 flex items-center justify-center shadow-[0_0_24px_rgba(211,148,255,0.2)]">
        <Check size={28} className="text-[#d394ff]" strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-white font-headline">Plan activated!</h3>
        <p className="text-sm text-[#988d9c] mt-1">
          You're now on <span className="text-[#d394ff] font-semibold">{plan.name}</span>. Enjoy the new features.
        </p>
      </div>
      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl bg-[#d394ff] text-[#3a0060] text-sm font-bold hover:bg-[#c97cff] transition-all active:scale-[0.98]"
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

  const selectedPlanData = PLANS.find(p => p.id === selected)!;
  const isFree           = selectedPlanData.price === 0;

  const handleNext = () => {
    if (isFree) {
      setStep('success');
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
      <DialogContent className="bg-[#131313] border-[#4c4450]/25 text-white sm:max-w-[420px] p-6 rounded-2xl">
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
                onNext={handleNext}
                onClose={handleClose}
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
