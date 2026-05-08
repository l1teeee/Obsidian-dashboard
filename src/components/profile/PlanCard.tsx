import { useState } from 'react';
import { getProfile } from '../../services/users.service';
import { useEffect } from 'react';
import type { UserPlan } from '../../types/users.types';
import ChangePlanDialog from './ChangePlanDialog';

const PLAN_META: Record<UserPlan, {
  label:    string;
  price:    string;
  color:    string;
  features: string[];
}> = {
  free: {
    label:    'Free',
    price:    '$0/mo',
    color:    '#60a5fa',
    features: ['1 workspace', '5 posts/month', 'Basic analytics', '1 platform'],
  },
  starter: {
    label:    'Starter',
    price:    'Free',
    color:    '#988d9c',
    features: ['1 workspace', '10 posts/month', 'Basic analytics', '1 platform'],
  },
  pro: {
    label:    'Pro',
    price:    '$79/mo',
    color:    '#d394ff',
    features: ['10 accounts', 'Unlimited posts', 'AI best-time engine', 'Analytics export', 'Priority support (4h)'],
  },
  enterprise: {
    label:    'Enterprise',
    price:    '$149/mo',
    color:    '#a78bfa',
    features: ['Unlimited accounts', 'Unlimited posts', 'White-label reports', 'API access', 'Dedicated CSM'],
  },
};

export default function PlanCard() {
  const [plan,       setPlan]       = useState<UserPlan | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    getProfile()
      .then(p => setPlan(p.plan ?? 'starter'))
      .catch(() => setPlan('starter'));
  }, []);

  if (!plan) {
    return (
      <div className="bg-[#201f1f] rounded-3xl border border-[#4c4450]/10 p-6 animate-pulse">
        <div className="h-4 w-20 bg-[#2a2a2a] rounded-full mb-3" />
        <div className="h-7 w-16 bg-[#2a2a2a] rounded-full mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 bg-[#2a2a2a] rounded-full w-3/4" />
          ))}
        </div>
      </div>
    );
  }

  const meta = PLAN_META[plan];

  return (
    <>
      <ChangePlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentPlan={plan}
      />

      <div data-section className="bg-[#201f1f] rounded-3xl border border-[#4c4450]/10 overflow-hidden relative">
        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-48 h-48 blur-[70px] rounded-full pointer-events-none opacity-50"
          style={{ backgroundColor: `${meta.color}22` }}
        />

        <div className="p-6 relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[10px] text-[#988d9c] uppercase tracking-widest mb-1">Current Plan</p>
              <h3 className="font-headline text-2xl font-extrabold text-white leading-none">{meta.label}</h3>
              <p className="text-xs mt-1" style={{ color: meta.color }}>{meta.price}</p>
            </div>
            <span
              className="px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider"
              style={{ color: meta.color, borderColor: `${meta.color}40`, backgroundColor: `${meta.color}12` }}
            >
              Active
            </span>
          </div>

          {/* Features */}
          <div className="space-y-2 mb-5">
            {meta.features.map(f => (
              <div key={f} className="flex items-center gap-2 text-xs text-[#cfc2d2]">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ color: meta.color, fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                {f}
              </div>
            ))}
          </div>

          {/* Renewal */}
          {plan !== 'starter' && (
            <p className="text-[10px] text-[#988d9c] mb-4">
              Renews <span className="text-white font-medium">Apr 25, 2026</span>
            </p>
          )}

          {/* CTA */}
          <button
            onClick={() => setDialogOpen(true)}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-[0.98] border"
            style={{
              color:           meta.color,
              borderColor:     `${meta.color}40`,
              backgroundColor: `${meta.color}10`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${meta.color}20`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${meta.color}10`; }}
          >
            {plan === 'enterprise' ? 'Manage Billing' : 'Change Plan'}
          </button>
        </div>
      </div>
    </>
  );
}
