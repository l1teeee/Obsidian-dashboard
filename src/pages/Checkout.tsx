import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Calendar, Lock, Check, ArrowLeft } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

interface PendingPlan {
  planId:  string;
  billing: 'monthly' | 'annually';
  price:   number;
  name:    string;
}

const PLAN_FEATURES: Record<string, string[]> = {
  starter: ['3 social accounts', '60 scheduled posts/mo', 'AI caption suggestions', 'Email support'],
  pro:     ['10 social accounts', 'Unlimited posts', 'AI best-time engine', 'Priority support (4h)'],
  agency:  ['Unlimited accounts', 'White-label PDF reports', 'API access', 'Dedicated CSM'],
};

const PLAN_ICON: Record<string, string> = {
  starter: 'bolt',
  pro:     'auto_awesome',
  agency:  'corporate_fare',
};

function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

type Step = 'form' | 'success';

export default function Checkout() {
  const navigate = useNavigate();
  const [plan,   setPlan]   = useState<PendingPlan | null>(null);
  const [step,   setStep]   = useState<Step>('form');

  const [cardNumber, setCardNumber] = useState('');
  const [expiry,     setExpiry]     = useState('');
  const [cvc,        setCvc]        = useState('');
  const [name,       setName]       = useState('');
  const [loading,    setLoading]    = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('pending_plan');
    if (!raw) { navigate('/dashboard', { replace: true }); return; }
    try { setPlan(JSON.parse(raw) as PendingPlan); }
    catch { navigate('/dashboard', { replace: true }); }
  }, [navigate]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    sessionStorage.removeItem('pending_plan');
    setLoading(false);
    setStep('success');
  };

  const goToDashboard = () => navigate('/dashboard', { replace: true });

  if (!plan) return null;

  const features = PLAN_FEATURES[plan.planId] ?? [];
  const icon     = PLAN_ICON[plan.planId] ?? 'star';

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#d394ff]/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[#9400e4]/[0.05] blur-[100px]" />

      <AnimatePresence mode="wait">
        {step === 'form' ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[860px] grid lg:grid-cols-[1fr_1.1fr] gap-0 rounded-3xl border border-[#4c4450]/20 bg-[#131313] shadow-[0_40px_120px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* ── Left: Plan summary ── */}
            <div className="relative p-8 lg:border-r border-[#4c4450]/15 flex flex-col">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#d394ff]/[0.05] to-transparent" />

              <button
                onClick={goToDashboard}
                className="relative flex items-center gap-1.5 text-xs text-[#988d9c] hover:text-white transition-colors mb-8 w-fit"
              >
                <ArrowLeft size={12} />
                Skip for now
              </button>

              <div className="relative flex-1 flex flex-col">
                {/* Plan header */}
                <div className="w-14 h-14 rounded-2xl bg-[#d394ff]/10 border border-[#d394ff]/20 flex items-center justify-center mb-5 shadow-[0_0_24px_rgba(211,148,255,0.15)]">
                  <span
                    className="material-symbols-outlined text-[#d394ff]"
                    style={{ fontSize: 26, fontVariationSettings: "'FILL' 1" }}
                  >
                    {icon}
                  </span>
                </div>

                <p className="text-[10px] text-[#988d9c] uppercase tracking-widest font-bold mb-1">Activating plan</p>
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">{plan.name}</h1>

                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-4xl font-extrabold text-white">${plan.price}</span>
                  <span className="text-sm text-[#988d9c]">/{plan.billing === 'monthly' ? 'month' : 'year'}</span>
                </div>
                <p className="text-[11px] text-[#4c4450] mb-6">
                  {plan.billing === 'monthly' ? 'Billed monthly · cancel anytime' : 'Billed annually · ~17% savings'}
                </p>

                {/* Features */}
                <div className="space-y-2.5 mb-auto">
                  {features.map(f => (
                    <div key={f} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#d394ff]/10 flex items-center justify-center shrink-0">
                        <Check size={11} strokeWidth={2.5} className="text-[#d394ff]" />
                      </div>
                      <span className="text-sm text-[#cfc2d2]">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Trust badges */}
                <div className="mt-8 pt-5 border-t border-[#4c4450]/15 grid grid-cols-2 gap-3">
                  {[
                    { icon: 'shield', text: 'SSL encrypted' },
                    { icon: 'undo',   text: '7-day refund' },
                  ].map(b => (
                    <div key={b.text} className="flex items-center gap-1.5 text-[11px] text-[#4c4450]">
                      <span className="material-symbols-outlined text-[#988d9c]" style={{ fontSize: 14 }}>{b.icon}</span>
                      {b.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Payment form ── */}
            <div className="p-8 flex flex-col">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white">Payment details</h2>
                <p className="text-xs text-[#988d9c] mt-0.5">Complete your purchase securely</p>
              </div>

              {/* Payment method tabs */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {['card', 'paypal', 'apple'].map((m, i) => (
                  <button
                    key={m}
                    className={[
                      'h-11 flex items-center justify-center rounded-xl border text-xs font-semibold transition-all',
                      i === 0
                        ? 'border-[#d394ff]/40 bg-[#d394ff]/8 text-[#d394ff]'
                        : 'border-[#4c4450]/25 bg-[#1a1919] text-[#4c4450] hover:border-[#4c4450]/40 hover:text-[#988d9c]',
                    ].join(' ')}
                  >
                    {m === 'card'   && <CreditCard size={16} />}
                    {m === 'paypal' && <span className="font-bold italic text-sm">Pay</span>}
                    {m === 'apple'  && <span className="font-semibold text-sm">Pay</span>}
                  </button>
                ))}
              </div>

              <form onSubmit={handlePay} className="flex flex-col gap-4 flex-1">
                {/* Card number */}
                <div className="space-y-1.5">
                  <Label className="text-[#988d9c] text-xs">Card number</Label>
                  <div className="relative">
                    <Input
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                      className="pl-9"
                      required
                    />
                    <CreditCard size={14} className="absolute left-3 top-2.5 text-[#4c4450]" />
                  </div>
                </div>

                {/* Expiry + CVC */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[#988d9c] text-xs">Expiry date</Label>
                    <div className="relative">
                      <Input
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={e => setExpiry(formatExpiry(e.target.value))}
                        className="pl-9"
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
                        className="pl-9"
                        required
                      />
                      <Lock size={14} className="absolute left-3 top-2.5 text-[#4c4450]" />
                    </div>
                  </div>
                </div>

                {/* Cardholder */}
                <div className="space-y-1.5">
                  <Label className="text-[#988d9c] text-xs">Cardholder name</Label>
                  <Input
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Summary */}
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#d394ff]/5 border border-[#d394ff]/10 mt-auto">
                  <div>
                    <p className="text-xs text-[#988d9c]">Total today</p>
                    <p className="text-[10px] text-[#4c4450]">14-day free trial then billed</p>
                  </div>
                  <span className="text-xl font-extrabold text-white">${plan.price}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#d394ff] text-[#3a0060] font-bold text-sm shadow-[0_0_24px_rgba(211,148,255,0.25)] hover:shadow-[0_0_36px_rgba(211,148,255,0.45)] hover:bg-[#c97cff] transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                      Processing…
                    </>
                  ) : (
                    <>
                      <Lock size={13} />
                      Pay ${plan.price} — Start {plan.name}
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-[#4c4450] flex items-center justify-center gap-1">
                  <Lock size={9} />
                  Payments secured by 256-bit SSL encryption
                </p>
              </form>
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
            <div className="w-20 h-20 rounded-3xl bg-[#d394ff]/10 border border-[#d394ff]/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(211,148,255,0.25)]">
              <Check size={34} className="text-[#d394ff]" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">You're all set!</h2>
            <p className="text-[#988d9c] text-sm mb-2">
              <span className="text-[#d394ff] font-semibold">{plan.name}</span> plan activated.
            </p>
            <p className="text-[#4c4450] text-xs mb-8">Your first charge of ${plan.price} starts after your 14-day trial.</p>
            <button
              onClick={goToDashboard}
              className="px-8 py-3 rounded-xl bg-[#d394ff] text-[#3a0060] font-bold text-sm hover:bg-[#c97cff] transition-all active:scale-[0.98]"
            >
              Go to dashboard →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
