import { useEffect, useState, useCallback } from 'react';
import { sileo } from 'sileo';
import {
  getTokenStats, getToolBreakdown, getTopUsers, getTokenLimits, setTokenLimit,
} from '../../services/admin.service';
import type { TokenStats, ToolBreakdown, TopUser, TokenLimit } from '../../types/admin.types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function fmtCost(n: number): string {
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 1)    return `$${n.toFixed(3)}`;
  return `$${n.toFixed(2)}`;
}

const TOOL_LABELS: Record<string, string> = {
  caption_suggestions: 'Caption AI',
  schedule_suggest:    'Schedule Suggest',
  carousel_slides:     'Carousel Slides',
  image_analyze:       'Image Analyze',
};
const TOOL_ICONS: Record<string, string> = {
  caption_suggestions: 'auto_awesome',
  schedule_suggest:    'schedule',
  carousel_slides:     'view_carousel',
  image_analyze:       'image_search',
};
const TOOL_COLORS = ['#7DD3C7', '#60a5fa', '#c5d247', '#f97316', '#f472b6', '#34d399'];

const PLAN_META: Record<string, { label: string; color: string }> = {
  free:       { label: 'Free',       color: '#60a5fa' },
  starter:    { label: 'Starter',    color: '#988d9c' },
  pro:        { label: 'Pro',        color: '#7DD3C7' },
  enterprise: { label: 'Enterprise', color: '#c5d247' },
};

const PERIODS = [
  { key: '7d',  label: '7 days'  },
  { key: '30d', label: '30 days' },
  { key: '90d', label: '90 days' },
  { key: 'all', label: 'All time' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color = '#7DD3C7' }: {
  icon: string; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#1C1814]/15 bg-[#F4F0E8] p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '18' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        <span className="text-xs text-[#6A6470] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-headline font-extrabold text-[#1C1814] tracking-tight">{value}</p>
      {sub && <p className="text-xs text-[#1C1814] mt-1">{sub}</p>}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminTokens() {
  const [period,  setPeriod]  = useState('30d');
  const [stats,   setStats]   = useState<TokenStats | null>(null);
  const [tools,   setTools]   = useState<ToolBreakdown[]>([]);
  const [users,   setUsers]   = useState<TopUser[]>([]);
  const [limits,  setLimits]  = useState<TokenLimit[]>([]);
  const [loading, setLoading] = useState(true);

  // Local limit edits: plan -> string (input value)
  const [limitEdits, setLimitEdits] = useState<Record<string, string>>({});
  const [savingPlan, setSavingPlan] = useState<string | null>(null);

  const load = useCallback(async (p: string) => {
    setLoading(true);
    try {
      const [s, t, u, l] = await Promise.all([
        getTokenStats(p),
        getToolBreakdown(p),
        getTopUsers(p, 10),
        getTokenLimits(),
      ]);
      setStats(s);
      setTools(t);
      setUsers(u);
      setLimits(l);
      const edits: Record<string, string> = {};
      l.forEach(row => { edits[row.plan] = String(row.monthly_limit); });
      setLimitEdits(edits);
    } catch {
      sileo.error({ title: 'Failed to load token data' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(period); }, [period, load]);

  const saveLimit = async (plan: string) => {
    const val = Number(limitEdits[plan]);
    if (isNaN(val) || val < 0) {
      sileo.error({ title: 'Enter a valid number (0 = unlimited)' });
      return;
    }
    setSavingPlan(plan);
    try {
      await setTokenLimit(plan, Math.floor(val));
      setLimits(prev => prev.map(l => l.plan === plan ? { ...l, monthly_limit: Math.floor(val) } : l));
      sileo.success({ title: `${PLAN_META[plan]?.label ?? plan} limit saved` });
    } catch {
      sileo.error({ title: 'Failed to save limit' });
    } finally {
      setSavingPlan(null);
    }
  };

  const isDirtyLimit = (plan: string) => {
    const current = limits.find(l => l.plan === plan)?.monthly_limit;
    return current !== undefined && String(current) !== limitEdits[plan];
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="text-2xl font-headline font-extrabold text-[#1C1814] tracking-tight mb-1">Token Usage</h1>
          <p className="text-sm text-[#6A6470]">Monitor AI token consumption across all users and tools.</p>
        </div>
        <div className="flex gap-1.5 bg-[#F4F0E8] border border-[#1C1814]/15 rounded-xl p-1">
          {PERIODS.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={[
                'px-3.5 py-1.5 rounded-lg text-xs font-bold font-headline transition-all duration-150',
                period === p.key ? 'bg-[#7DD3C7]/15 text-[#7DD3C7]' : 'text-[#6A6470] hover:text-[#1C1814]',
              ].join(' ')}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <span className="material-symbols-outlined text-[#1C1814] animate-spin" style={{ fontSize: 28 }}>progress_activity</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon="bolt"
              label="Total Tokens"
              value={fmtTokens(stats?.total_tokens ?? 0)}
              sub={`${fmtTokens(stats?.input_tokens ?? 0)} in · ${fmtTokens(stats?.output_tokens ?? 0)} out`}
              color="#7DD3C7"
            />
            <StatCard
              icon="payments"
              label="Est. Cost"
              value={fmtCost(stats?.estimated_cost_usd ?? 0)}
              sub={`${stats?.total_calls ?? 0} API calls`}
              color="#c5d247"
            />
            <StatCard
              icon="auto_awesome"
              label="Top Tool"
              value={TOOL_LABELS[stats?.top_tool ?? ''] ?? stats?.top_tool ?? '—'}
              sub={stats?.top_tool ? `${tools.find(t => t.tool === stats.top_tool)?.pct ?? 0}% of usage` : 'No data yet'}
              color="#60a5fa"
            />
            <StatCard
              icon="group"
              label="Active Users"
              value={String(stats?.unique_users ?? 0)}
              sub={stats && stats.unique_users > 0
                ? `~${Math.round((stats.total_calls) / stats.unique_users)} calls/user`
                : 'No data yet'
              }
              color="#f97316"
            />
          </div>

          {/* Tool breakdown + Top users */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Tool breakdown */}
            <div className="rounded-2xl border border-[#1C1814]/15 bg-[#F4F0E8] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1C1814]/15">
                <h2 className="text-sm font-headline font-bold text-[#1C1814]">Usage by Tool</h2>
                <p className="text-xs text-[#1C1814] mt-0.5">Tokens consumed per AI feature</p>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {tools.length === 0 ? (
                  <p className="text-sm text-[#1C1814] text-center py-6">No AI usage recorded yet.</p>
                ) : tools.map((tool, idx) => {
                  const color  = TOOL_COLORS[idx % TOOL_COLORS.length];
                  const icon   = TOOL_ICONS[tool.tool] ?? 'hub';
                  const label  = TOOL_LABELS[tool.tool] ?? tool.tool;
                  return (
                    <div key={tool.tool}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined" style={{ fontSize: 14, color }}>{icon}</span>
                          <span className="text-sm text-[#1C1814] font-semibold font-headline">{label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold font-mono" style={{ color }}>{fmtTokens(tool.total_tokens)}</span>
                          <span className="text-xs text-[#1C1814] ml-2">{tool.total_calls} calls</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-[#FAF7F2] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${tool.pct}%`, backgroundColor: color + 'cc' }}
                        />
                      </div>
                      <p className="text-[10px] text-[#1C1814] mt-1">
                        {fmtTokens(tool.input_tokens)} in · {fmtTokens(tool.output_tokens)} out · {tool.pct}%
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top users */}
            <div className="rounded-2xl border border-[#1C1814]/15 bg-[#F4F0E8] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1C1814]/15">
                <h2 className="text-sm font-headline font-bold text-[#1C1814]">Top Users</h2>
                <p className="text-xs text-[#1C1814] mt-0.5">Highest token consumers this period</p>
              </div>
              {users.length === 0 ? (
                <p className="text-sm text-[#1C1814] text-center py-10">No usage data yet.</p>
              ) : (
                <div className="divide-y divide-[#1c1b1b]">
                  {users.map((u, idx) => {
                    const initial = (u.name ?? u.email)[0]?.toUpperCase() ?? '?';
                    const totalAll = stats?.total_tokens ?? 1;
                    const pct = Math.round((u.total_tokens / totalAll) * 100);
                    return (
                      <div key={u.user_id} className="flex items-center gap-3 px-5 py-3.5">
                        <span className="text-xs text-[#1C1814] w-5 shrink-0 text-right font-mono">{idx + 1}</span>
                        <div className="w-8 h-8 rounded-full bg-[#7DD3C7]/15 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-[#7DD3C7]">{initial}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#1C1814] font-semibold truncate">{u.name ?? u.email}</p>
                          {u.name && <p className="text-[10px] text-[#1C1814] truncate">{u.email}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold font-mono text-[#7DD3C7]">{fmtTokens(u.total_tokens)}</p>
                          <p className="text-[10px] text-[#1C1814]">{pct}% · {u.total_calls} calls</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Plan limits */}
          <div className="rounded-2xl border border-[#1C1814]/15 bg-[#F4F0E8] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1C1814]/15">
              <h2 className="text-sm font-headline font-bold text-[#1C1814]">Monthly Token Limits</h2>
              <p className="text-xs text-[#1C1814] mt-0.5">Set 0 for unlimited. Resets on the 1st of each month.</p>
            </div>
            <div className="divide-y divide-[#1c1b1b]">
              {limits.map(limit => {
                const meta  = PLAN_META[limit.plan] ?? { label: limit.plan, color: '#988d9c' };
                const val   = limitEdits[limit.plan] ?? String(limit.monthly_limit);
                const dirty = isDirtyLimit(limit.plan);
                return (
                  <div key={limit.plan} className="flex items-center gap-4 px-5 py-4">
                    <div
                      className="px-2.5 py-1 rounded-lg text-xs font-bold font-headline w-24 text-center shrink-0"
                      style={{ backgroundColor: meta.color + '18', color: meta.color }}
                    >
                      {meta.label}
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        min="0"
                        value={val}
                        onChange={e => setLimitEdits(prev => ({ ...prev, [limit.plan]: e.target.value }))}
                        className="w-full bg-[#141414] border border-[#1C1814]/20 rounded-xl px-4 py-2.5 text-sm text-[#1C1814] font-mono focus:outline-none focus:border-[#1C1814]/50 transition-all"
                        placeholder="0"
                      />
                    </div>
                    <div className="text-xs text-[#1C1814] w-28 shrink-0">
                      {val === '0' ? '∞ unlimited' : `${Number(val).toLocaleString()} tokens/mo`}
                    </div>
                    <button
                      onClick={() => { void saveLimit(limit.plan); }}
                      disabled={!dirty || savingPlan === limit.plan}
                      className="px-4 py-2 rounded-xl text-xs font-bold font-headline border transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                      style={dirty ? {
                        backgroundColor: meta.color + '18',
                        color:           meta.color,
                        borderColor:     meta.color + '40',
                      } : { color: '#4c4450', borderColor: '#4c4450' + '30' }}
                    >
                      {savingPlan === limit.plan ? '...' : 'Save'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
