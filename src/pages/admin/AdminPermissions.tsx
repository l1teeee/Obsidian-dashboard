import { useEffect, useState, useCallback } from 'react';
import { sileo } from 'sileo';
import { getPermissions, setPlanPermissions } from '../../services/admin.service';
import type { SystemPermission, PlanPermissions } from '../../types/admin.types';

type PlanKey = keyof PlanPermissions;

const PLANS: { key: PlanKey; label: string; color: string; bg: string }[] = [
  { key: 'free',       label: 'Free',       color: '#60a5fa', bg: '#60a5fa18' },
  { key: 'starter',    label: 'Starter',    color: '#94A3B8', bg: '#94A3B818' },
  { key: 'pro',        label: 'Pro',        color: '#111827', bg: '#11182718' },
  { key: 'enterprise', label: 'Enterprise', color: '#047857', bg: '#04785718' },
];

// Distinctive colors per category slot — cycles if there are more categories than colors
const CAT_PALETTE = [
  { color: '#111827', bg: '#11182712', icon: 'article' },
  { color: '#60a5fa', bg: '#60a5fa12', icon: 'monitoring' },
  { color: '#047857', bg: '#04785712', icon: 'auto_awesome' },
  { color: '#f97316', bg: '#f9731612', icon: 'workspaces' },
  { color: '#f472b6', bg: '#f472b612', icon: 'style' },
  { color: '#34d399', bg: '#34d39912', icon: 'hub' },
  { color: '#2563EB', bg: '#2563EB12', icon: 'lock' },
  { color: '#fb923c', bg: '#fb923c12', icon: 'tune' },
];

function groupByCategory(perms: SystemPermission[]): [string, SystemPermission[]][] {
  const map = new Map<string, SystemPermission[]>();
  for (const p of perms) {
    if (!map.has(p.category)) map.set(p.category, []);
    map.get(p.category)!.push(p);
  }
  return Array.from(map.entries());
}

interface CheckboxProps {
  checked: boolean;
  color:   string;
}

function Checkbox({ checked, color }: CheckboxProps) {
  return (
    <span
      className="w-[18px] h-[18px] rounded-md border flex items-center justify-center shrink-0 transition-all duration-150"
      style={checked
        ? { backgroundColor: color + '28', borderColor: color + '90' }
        : { borderColor: '#4c4450' }
      }
    >
      <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
        <path
          d="M14 7L8.5 12.5L6 10"
          stroke={checked ? color : 'transparent'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function AdminPermissions() {
  const [system,     setSystem]     = useState<SystemPermission[]>([]);
  const [pending,    setPending]    = useState<PlanPermissions>({ free: [], starter: [], pro: [], enterprise: [] });
  const [saved,      setSaved]      = useState<PlanPermissions>({ free: [], starter: [], pro: [], enterprise: [] });
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState<PlanKey | null>(null);
  const [activePlan, setActivePlan] = useState<PlanKey>('free');
  const [search,     setSearch]     = useState('');

  useEffect(() => {
    getPermissions()
      .then(data => {
        setSystem(data.system);
        setPending(data.plan);
        setSaved(data.plan);
      })
      .catch(() => sileo.error({ title: 'Failed to load permissions' }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setSearch(''); }, [activePlan]);

  const toggle = useCallback((plan: PlanKey, key: string) => {
    setPending(prev => {
      const has = prev[plan].includes(key);
      return { ...prev, [plan]: has ? prev[plan].filter(k => k !== key) : [...prev[plan], key] };
    });
  }, []);

  const toggleCategory = useCallback((plan: PlanKey, keys: string[]) => {
    setPending(prev => {
      const allChecked = keys.every(k => prev[plan].includes(k));
      if (allChecked) return { ...prev, [plan]: prev[plan].filter(k => !keys.includes(k)) };
      const next = new Set(prev[plan]);
      keys.forEach(k => next.add(k));
      return { ...prev, [plan]: Array.from(next) };
    });
  }, []);

  const save = async (plan: PlanKey) => {
    setSaving(plan);
    try {
      await setPlanPermissions(plan, pending[plan]);
      setSaved(prev => ({ ...prev, [plan]: pending[plan] }));
      sileo.success({ title: `${plan.charAt(0).toUpperCase() + plan.slice(1)} permissions saved` });
    } catch {
      sileo.error({ title: 'Failed to save permissions' });
    } finally {
      setSaving(null);
    }
  };

  const isDirty = (plan: PlanKey) =>
    JSON.stringify([...pending[plan]].sort()) !== JSON.stringify([...saved[plan]].sort());

  const groups      = groupByCategory(system);
  const planInfo    = PLANS.find(p => p.key === activePlan)!;
  const lowerSearch = search.toLowerCase();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-headline font-extrabold text-[#0F172A] tracking-tight mb-1">Plan Permissions</h1>
        <p className="text-sm text-[#64748B]">Configure which features each subscription plan can access.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <span className="material-symbols-outlined text-[#0F172A] animate-spin" style={{ fontSize: 28 }}>progress_activity</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">

          {/* Plan tabs + save row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2">
              {PLANS.map(plan => {
                const isActive = activePlan === plan.key;
                const dirty    = isDirty(plan.key);
                return (
                  <button
                    key={plan.key}
                    onClick={() => setActivePlan(plan.key)}
                    className={[
                      'relative px-5 py-2.5 rounded-xl text-sm font-bold font-headline tracking-tight transition-all duration-150 border',
                      isActive ? '' : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-white/[0.04]',
                    ].join(' ')}
                    style={isActive ? { color: plan.color, backgroundColor: plan.bg, borderColor: plan.color + '50' } : {}}
                  >
                    {plan.label}
                    {dirty && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: plan.color }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Save + counter */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#0F172A]">
                {pending[activePlan].length} / {system.length} enabled
              </span>
              <button
                onClick={() => { void save(activePlan); }}
                disabled={!isDirty(activePlan) || saving === activePlan}
                className="px-5 py-2.5 rounded-xl text-sm font-bold font-headline transition-all disabled:opacity-30 disabled:cursor-not-allowed border"
                style={isDirty(activePlan) ? {
                  backgroundColor: planInfo.color + '22',
                  color:           planInfo.color,
                  borderColor:     planInfo.color + '44',
                } : { color: '#4c4450', borderColor: '#4c4450' + '30' }}
              >
                {saving === activePlan ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#0F172A]" style={{ fontSize: 16 }}>search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search permissions..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#0F172A]/20 text-sm text-[#0F172A] placeholder:text-[#0F172A] focus:outline-none focus:border-[#0F172A]/50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#0F172A] hover:text-[#0F172A] transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
              </button>
            )}
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {groups.map(([category, perms], idx) => {
              const cat        = CAT_PALETTE[idx % CAT_PALETTE.length];
              const keys       = perms.map(p => p.key);
              const allChecked = keys.every(k => pending[activePlan].includes(k));
              const anyChecked = keys.some(k => pending[activePlan].includes(k));
              const enabledCount = keys.filter(k => pending[activePlan].includes(k)).length;

              return (
                <div
                  key={category}
                  className="rounded-2xl border bg-[#F8FAFC] overflow-hidden flex flex-col"
                  style={{ borderColor: cat.color + '28' }}
                >
                  {/* Card header */}
                  <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ backgroundColor: cat.bg, borderBottom: `1px solid ${cat.color}20` }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: cat.color + '20' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 15, color: cat.color, fontVariationSettings: "'FILL' 1" }}>
                          {cat.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold font-headline text-[#0F172A]">{category}</p>
                        <p className="text-[10px]" style={{ color: cat.color + 'bb' }}>
                          {enabledCount} / {keys.length} enabled
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCategory(activePlan, keys)}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all"
                      style={anyChecked
                        ? { color: cat.color, backgroundColor: cat.color + '18' }
                        : { color: '#94A3B8', backgroundColor: 'transparent' }
                      }
                    >
                      {allChecked ? 'Deselect all' : 'Select all'}
                    </button>
                  </div>

                  {/* Permission rows */}
                  <div className="flex flex-col">
                    {perms.map((perm, i) => {
                      const isChecked = pending[activePlan].includes(perm.key);
                      const hit = lowerSearch
                        ? perm.name.toLowerCase().includes(lowerSearch) || perm.key.toLowerCase().includes(lowerSearch)
                        : true;
                      return (
                        <div
                          key={perm.key}
                          onClick={() => toggle(activePlan, perm.key)}
                          className={[
                            'flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-150',
                            i < perms.length - 1 ? 'border-b border-[#1c1b1b]' : '',
                            isChecked ? 'hover:bg-white/[0.02]' : 'hover:bg-white/[0.015]',
                            hit ? 'opacity-100' : 'opacity-[0.18]',
                          ].join(' ')}
                        >
                          <div className="min-w-0 pr-4">
                            <p className={['text-sm leading-tight transition-colors', isChecked ? 'text-[#0F172A]' : 'text-[#64748B]'].join(' ')}>
                              {perm.name}
                            </p>
                            <p className="text-[10px] text-[#0F172A] font-mono mt-0.5">{perm.key}</p>
                          </div>
                          <Checkbox checked={isChecked} color={cat.color} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
