import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sileo';
import { getPermissions, setPlanPermissions } from '../../services/admin.service';
import type { SystemPermission, PlanPermissions } from '../../types/admin.types';

const PLAN_LABELS: { key: keyof PlanPermissions; label: string; color: string }[] = [
  { key: 'starter',    label: 'Starter',    color: '#6b7280' },
  { key: 'pro',        label: 'Pro',        color: '#a78bfa' },
  { key: 'enterprise', label: 'Enterprise', color: '#f87171' },
];

function groupByCategory(perms: SystemPermission[]): [string, SystemPermission[]][] {
  const map = new Map<string, SystemPermission[]>();
  for (const p of perms) {
    if (!map.has(p.category)) map.set(p.category, []);
    map.get(p.category)!.push(p);
  }
  return Array.from(map.entries());
}

export default function AdminPermissions() {
  const [system,  setSystem]  = useState<SystemPermission[]>([]);
  const [pending, setPending] = useState<PlanPermissions>({ starter: [], pro: [], enterprise: [] });
  const [saved,   setSaved]   = useState<PlanPermissions>({ starter: [], pro: [], enterprise: [] });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState<keyof PlanPermissions | null>(null);

  useEffect(() => {
    getPermissions()
      .then(data => {
        setSystem(data.system);
        setPending(data.plan);
        setSaved(data.plan);
      })
      .catch(() => toast.error('Failed to load permissions'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = useCallback((plan: keyof PlanPermissions, key: string) => {
    setPending(prev => {
      const has = prev[plan].includes(key);
      return { ...prev, [plan]: has ? prev[plan].filter(k => k !== key) : [...prev[plan], key] };
    });
  }, []);

  const save = async (plan: keyof PlanPermissions) => {
    setSaving(plan);
    try {
      await setPlanPermissions(plan, pending[plan]);
      setSaved(prev => ({ ...prev, [plan]: pending[plan] }));
      toast.success(`${plan.charAt(0).toUpperCase() + plan.slice(1)} permissions saved`);
    } catch {
      toast.error('Failed to save permissions');
    } finally {
      setSaving(null);
    }
  };

  const isDirty = (plan: keyof PlanPermissions) =>
    JSON.stringify([...pending[plan]].sort()) !== JSON.stringify([...saved[plan]].sort());

  const groups = groupByCategory(system);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-headline font-extrabold text-white tracking-tight mb-1">Plan Permissions</h1>
        <p className="text-sm text-[#988d9c]">Configure which features each subscription plan can access.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <span className="material-symbols-outlined text-[#4c4450] animate-spin" style={{ fontSize: 28 }}>progress_activity</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#4c4450]/15 bg-[#0e0e0e] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_80px_80px_80px] gap-0 border-b border-[#4c4450]/15">
            <div className="px-5 py-3.5 text-xs font-bold text-[#988d9c] uppercase tracking-widest">Feature</div>
            {PLAN_LABELS.map(pl => (
              <div key={pl.key} className="px-3 py-3.5 text-center">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: pl.color }}>{pl.label}</span>
              </div>
            ))}
          </div>

          {/* Groups */}
          {groups.map(([category, perms]) => (
            <div key={category} className="border-b border-[#4c4450]/10 last:border-0">
              <div className="px-5 py-2.5 bg-[#111]/60">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4c4450]">{category}</span>
              </div>
              {perms.map(perm => (
                <div
                  key={perm.key}
                  className="grid grid-cols-[1fr_80px_80px_80px] gap-0 items-center border-b border-[#4c4450]/08 last:border-0 hover:bg-white/[0.015] transition-colors"
                >
                  <div className="px-5 py-3 text-sm text-[#cfc2d2]">{perm.name}</div>
                  {PLAN_LABELS.map(pl => {
                    const checked = pending[pl.key].includes(perm.key);
                    return (
                      <div key={pl.key} className="px-3 py-3 flex items-center justify-center">
                        <button
                          onClick={() => toggle(pl.key, perm.key)}
                          className={[
                            'w-5 h-5 rounded-md border flex items-center justify-center transition-all',
                            checked
                              ? 'border-transparent'
                              : 'border-[#4c4450]/30 hover:border-[#4c4450]/60',
                          ].join(' ')}
                          style={checked ? { backgroundColor: pl.color + '33', borderColor: pl.color + '66' } : {}}
                        >
                          {checked && (
                            <span className="material-symbols-outlined" style={{ fontSize: 13, color: pl.color, fontVariationSettings: "'FILL' 1" }}>check</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}

          {/* Save buttons per plan */}
          <div className="grid grid-cols-[1fr_80px_80px_80px] gap-0 bg-[#111]/40 border-t border-[#4c4450]/15 px-5 py-3">
            <div className="text-xs text-[#4c4450] flex items-center">Changes are saved per plan</div>
            {PLAN_LABELS.map(pl => (
              <div key={pl.key} className="px-1.5 flex items-center justify-center">
                <button
                  onClick={() => { void save(pl.key); }}
                  disabled={!isDirty(pl.key) || saving === pl.key}
                  className="text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={isDirty(pl.key) ? { backgroundColor: pl.color + '22', color: pl.color, borderColor: pl.color + '44', border: '1px solid' } : { color: '#4c4450' }}
                >
                  {saving === pl.key ? '...' : 'Save'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
