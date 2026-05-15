import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area,
} from 'recharts';
import * as adminService from '../../services/admin.service';
import type { AdminOverview, AdminWorkspaceRow } from '../../types/admin.types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtWeek(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color = '#C8553A' }: {
  icon:   string;
  label:  string;
  value:  number | string;
  sub?:   string;
  color?: string;
}) {
  return (
    <div className="glass-card rounded-3xl p-6 border border-[#15140F]/10 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[#6B655B] text-xs uppercase tracking-widest font-semibold">{label}</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color, fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        </div>
      </div>
      <p className="font-mono text-3xl font-medium text-[#15140F]">{typeof value === 'number' ? fmtNum(value) : value}</p>
      {sub && <p className="text-xs text-[#6B655B]">{sub}</p>}
    </div>
  );
}

const chartTooltipStyle = {
  backgroundColor: '#1c1b1b',
  border: '1px solid rgba(76,68,80,0.3)',
  borderRadius: '12px',
  color: '#cfc2d2',
  fontSize: 12,
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOverview() {
  const [data,    setData]    = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    adminService.getOverview()
      .then(setData)
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#f87171]" />
            <span className="text-[#f87171] text-xs uppercase tracking-widest font-bold">Admin</span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tighter text-[#15140F]">
            Platform Overview
          </h1>
          <p className="text-[#6B655B] text-sm mt-1">{now}</p>
        </div>

        <button
          onClick={() => { setLoading(true); setError(null); adminService.getOverview().then(setData).catch(e => setError((e as Error).message)).finally(() => setLoading(false)); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#15140F]/20 text-[#6B655B] hover:text-[#15140F] hover:border-[#15140F]/40 transition-all text-xs"
        >
          <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`} style={{ fontSize: 14 }}>refresh</span>
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-[#f87171]/20 bg-[#f87171]/5 p-4 text-sm text-[#f87171]">
          <span className="material-symbols-outlined mr-2" style={{ fontSize: 16 }}>error</span>
          Failed to load overview: {error}
        </div>
      )}

      {/* KPI cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-3xl p-6 border border-[#15140F]/10 space-y-4">
              <div className="h-3 w-24 bg-[#E7E0D0] rounded-full" />
              <div className="h-8 w-16 bg-[#E7E0D0] rounded-xl" />
            </div>
          ))}
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="group"      label="Total Users"      value={data.stats.total_users}      sub={`+${data.stats.users_this_week} this week`}  color="#C8553A" />
          <StatCard icon="workspaces" label="Total Workspaces" value={data.stats.total_workspaces} color="#4F7A4A" />
          <StatCard icon="article"    label="Total Posts"      value={data.stats.total_posts}       color="#60a5fa" />
          <StatCard icon="trending_up" label="Posts This Week" value={data.stats.posts_this_week}  color="#f87171" />
        </div>
      ) : null}

      {/* Charts row */}
      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Posts by week */}
          <div className="glass-card rounded-3xl p-6 border border-[#15140F]/10">
            <p className="text-[#15140F] font-headline font-bold mb-1">Posts per Week</p>
            <p className="text-[#6B655B] text-xs mb-6">Last {data.posts_by_week.length} weeks across all users</p>
            {data.posts_by_week.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-[#15140F] text-sm">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.posts_by_week.map(p => ({ ...p, week: fmtWeek(p.week) }))} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4c4450" strokeOpacity={0.2} vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: '#988d9c', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#988d9c', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    cursor={{ fill: 'rgba(200,85,58,0.06)' }}
                    labelStyle={{ color: '#cfc2d2', marginBottom: 4 }}
                  />
                  <Bar dataKey="count" name="Posts" fill="#C8553A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* New users by week */}
          <div className="glass-card rounded-3xl p-6 border border-[#15140F]/10">
            <p className="text-[#15140F] font-headline font-bold mb-1">New Registrations per Week</p>
            <p className="text-[#6B655B] text-xs mb-6">Last {data.users_by_week.length} weeks</p>
            {data.users_by_week.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-[#15140F] text-sm">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data.users_by_week.map(p => ({ ...p, week: fmtWeek(p.week) }))}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4F7A4A" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4F7A4A" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4c4450" strokeOpacity={0.2} vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: '#988d9c', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#988d9c', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    cursor={{ stroke: 'rgba(197,210,71,0.3)', strokeWidth: 1 }}
                    labelStyle={{ color: '#cfc2d2', marginBottom: 4 }}
                  />
                  <Area type="monotone" dataKey="count" name="Users" stroke="#4F7A4A" strokeWidth={2} fill="url(#userGrad)" dot={false} activeDot={{ r: 4, fill: '#4F7A4A' }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Top workspaces */}
      {!loading && data && data.top_workspaces.length > 0 && (
        <div className="glass-card rounded-3xl border border-[#15140F]/10 overflow-hidden">
          <div className="px-6 py-5 border-b border-[#15140F]/10">
            <p className="text-[#15140F] font-headline font-bold">Top Workspaces by Posts</p>
            <p className="text-[#6B655B] text-xs mt-0.5">Most active workspaces on the platform</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#EFE9DC] border-b border-[#15140F]/10">
                  <th className="text-left px-6 py-3 text-[#6B655B] text-xs uppercase tracking-widest font-semibold">#</th>
                  <th className="text-left px-6 py-3 text-[#6B655B] text-xs uppercase tracking-widest font-semibold">Workspace</th>
                  <th className="text-left px-6 py-3 text-[#6B655B] text-xs uppercase tracking-widest font-semibold">Owner</th>
                  <th className="text-right px-6 py-3 text-[#6B655B] text-xs uppercase tracking-widest font-semibold">Posts</th>
                  <th className="text-right px-6 py-3 text-[#6B655B] text-xs uppercase tracking-widest font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.top_workspaces.map((ws: AdminWorkspaceRow, i: number) => (
                  <tr key={ws.id} className="bg-white border-b border-[#15140F]/5 hover:bg-[#FBF8F2] transition-colors">
                    <td className="px-6 py-4 text-[#15140F] font-mono text-xs">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#C8553A] to-[#D6A86A] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-white" style={{ fontSize: 13 }}>workspaces</span>
                        </div>
                        <span className="text-[#15140F] font-semibold text-xs">{ws.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#6B655B] text-xs">{ws.owner_name ?? ws.owner_email}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-[#15140F] font-semibold">{fmtNum(ws.post_count)}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-[#6B655B] text-xs">{fmtDate(ws.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !data && !error && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <span className="material-symbols-outlined text-[#15140F] text-5xl">monitoring</span>
          <p className="text-[#6B655B]">No data available</p>
          <p className="text-[#15140F] text-xs">Make sure the backend admin endpoints are implemented.</p>
        </div>
      )}
    </div>
  );
}
