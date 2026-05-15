import { useEffect, useRef, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import * as adminService from '../../services/admin.service';
import type { AdminWorkspaceRow } from '../../types/admin.types';
import type { PageMeta } from '../../lib/api';
import Modal from '../../components/shared/Modal';
import Pagination from '../../components/shared/Pagination';

type ConfirmAction = { workspace: AdminWorkspaceRow; action: 'deactivate' | 'activate' };

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const chartTooltipStyle = {
  backgroundColor: '#1c1b1b',
  border: '1px solid rgba(76,68,80,0.3)',
  borderRadius: '12px',
  color: '#cfc2d2',
  fontSize: 12,
};

export default function AdminWorkspaces() {
  const [workspaces, setWorkspaces] = useState<AdminWorkspaceRow[]>([]);
  const [meta,       setMeta]       = useState<PageMeta | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState('');
  const [confirm,    setConfirm]    = useState<ConfirmAction | null>(null);
  const [working,    setWorking]    = useState(false);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = (p: number, s: string) => {
    setLoading(true);
    setError(null);
    adminService.getWorkspaces({ page: p, search: s || undefined })
      .then(r => { setWorkspaces(r.workspaces); setMeta(r.meta); })
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1, ''); }, []);

  const handleSearch = (v: string) => {
    setSearch(v);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => { setPage(1); load(1, v); }, 400);
  };

  const goPage = (p: number) => { setPage(p); load(p, search); };

  const runAction = async () => {
    if (!confirm) return;
    setWorking(true);
    try {
      if (confirm.action === 'deactivate') {
        await adminService.deactivateWorkspace(confirm.workspace.id);
        setWorkspaces(prev => prev.map(w => w.id === confirm.workspace.id ? { ...w, is_active: false } : w));
      } else {
        await adminService.activateWorkspace(confirm.workspace.id);
        setWorkspaces(prev => prev.map(w => w.id === confirm.workspace.id ? { ...w, is_active: true } : w));
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setWorking(false);
      setConfirm(null);
    }
  };

  // Top 10 for chart
  const chartData = [...workspaces]
    .sort((a, b) => b.post_count - a.post_count)
    .slice(0, 10)
    .map(w => ({ name: w.name.length > 12 ? w.name.slice(0, 12) + '…' : w.name, posts: w.post_count }));

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#f87171]" />
          <span className="text-[#f87171] text-xs uppercase tracking-widest font-bold">Admin</span>
        </div>
        <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-[#15140F]">Workspaces</h1>
        {meta && <p className="text-[#6B655B] text-sm mt-1">{meta.total.toLocaleString()} total workspaces</p>}
      </div>

      {/* Chart — only when not searching */}
      {!loading && !error && !search && chartData.length > 0 && (
        <div className="glass-card rounded-3xl p-6 border border-[#15140F]/10">
          <p className="text-[#15140F] font-headline font-bold mb-1">Top 10 by Post Count</p>
          <p className="text-[#6B655B] text-xs mb-5">Posts published per workspace</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4c4450" strokeOpacity={0.2} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#988d9c', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#988d9c', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(197,210,71,0.06)' }} labelStyle={{ color: '#cfc2d2', marginBottom: 4 }} />
              <Bar dataKey="posts" name="Posts" fill="#4F7A4A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-xs">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6B655B]" style={{ fontSize: 16 }}>search</span>
        <input
          value={search}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search workspaces..."
          className="w-full bg-[#FBF8F2] border border-[#15140F]/20 rounded-xl py-2.5 pl-9 pr-4 text-sm text-[#15140F] placeholder:text-[#6B655B] focus:outline-none focus:border-[#C8553A]/40 transition-all"
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-[#f87171]/20 bg-[#f87171]/5 p-4 text-sm text-[#f87171]">
          Failed to load workspaces: {error}
        </div>
      )}

      {/* Table */}
      <div className="glass-card rounded-3xl border border-[#15140F]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#EFE9DC] border-b border-[#15140F]/10">
                <th className="text-left px-6 py-4 text-[#6B655B] text-xs uppercase tracking-widest font-semibold">Workspace</th>
                <th className="text-left px-6 py-4 text-[#6B655B] text-xs uppercase tracking-widest font-semibold">Owner</th>
                <th className="text-center px-6 py-4 text-[#6B655B] text-xs uppercase tracking-widest font-semibold">Posts</th>
                <th className="text-left px-6 py-4 text-[#6B655B] text-xs uppercase tracking-widest font-semibold">Status</th>
                <th className="text-right px-6 py-4 text-[#6B655B] text-xs uppercase tracking-widest font-semibold">Created</th>
                <th className="text-center px-6 py-4 text-[#6B655B] text-xs uppercase tracking-widest font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="bg-white border-b border-[#15140F]/5 animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#E7E0D0]" />
                        <div className="h-3 w-32 bg-[#E7E0D0] rounded-full" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-3 w-28 bg-[#E7E0D0] rounded-full" /></td>
                    <td className="px-6 py-4"><div className="h-3 w-8 bg-[#E7E0D0] rounded-full mx-auto" /></td>
                    <td className="px-6 py-4"><div className="h-3 w-16 bg-[#E7E0D0] rounded-full" /></td>
                    <td className="px-6 py-4"><div className="h-3 w-20 bg-[#E7E0D0] rounded-full ml-auto" /></td>
                    <td className="px-6 py-4"><div className="h-3 w-16 bg-[#E7E0D0] rounded-full mx-auto" /></td>
                  </tr>
                ))
              ) : workspaces.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-[#15140F]">
                    <span className="material-symbols-outlined text-4xl block mb-2">workspaces</span>
                    No workspaces found
                  </td>
                </tr>
              ) : (
                workspaces.map(ws => (
                  <tr
                    key={ws.id}
                    className={[
                      'bg-white border-b border-[#15140F]/5 transition-colors',
                      !ws.is_active ? 'opacity-50 hover:opacity-70' : 'hover:bg-[#FBF8F2]',
                    ].join(' ')}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#C8553A] to-[#D6A86A] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-white" style={{ fontSize: 14 }}>workspaces</span>
                        </div>
                        <span className="text-[#15140F] font-semibold text-xs">{ws.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[#15140F] text-xs font-medium">{ws.owner_name ?? '—'}</p>
                        <p className="text-[#6B655B] text-xs">{ws.owner_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono text-[#15140F] text-sm">{ws.post_count}</span>
                    </td>
                    <td className="px-6 py-4">
                      {ws.is_active ? (
                        <span className="flex items-center gap-1.5 text-[#4F7A4A] text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4F7A4A]" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[#C0392B] text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" />
                          Deactivated
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-[#6B655B] text-xs">{fmtDate(ws.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        {ws.is_active ? (
                          <button
                            onClick={() => setConfirm({ workspace: ws, action: 'deactivate' })}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-[#f87171] bg-[#f87171]/8 border border-[#f87171]/20 hover:bg-[#f87171]/15 hover:border-[#f87171]/35 transition-all whitespace-nowrap"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>block</span>
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirm({ workspace: ws, action: 'activate' })}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-[#4F7A4A] bg-[#4F7A4A]/8 border border-[#4F7A4A]/20 hover:bg-[#4F7A4A]/15 hover:border-[#4F7A4A]/35 transition-all whitespace-nowrap"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta && <Pagination page={page} total={meta.total} limit={meta.limit} onPage={goPage} loading={loading} />}
      </div>

      {/* Confirm modal */}
      <Modal open={!!confirm} onClose={() => !working && setConfirm(null)} maxWidth="max-w-sm">
        {confirm && (() => {
          const isDeactivate = confirm.action === 'deactivate';
          return (
            <div className="p-8">
              <div className={[
                'w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border',
                isDeactivate ? 'bg-[#f87171]/10 border-[#f87171]/20' : 'bg-[#4F7A4A]/10 border-[#4F7A4A]/20',
              ].join(' ')}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 22, color: isDeactivate ? '#f87171' : '#4F7A4A', fontVariationSettings: "'FILL' 1" }}
                >
                  {isDeactivate ? 'block' : 'play_circle'}
                </span>
              </div>

              <h2 className="text-xl font-headline font-extrabold tracking-tight text-[#15140F] mb-1">
                {isDeactivate ? 'Deactivate workspace?' : 'Activate workspace?'}
              </h2>
              <p className="text-xs text-[#3D3A30] font-semibold mb-1">{confirm.workspace.name}</p>
              <p className="text-xs text-[#15140F] mb-4">{confirm.workspace.owner_email}</p>

              <p className="text-sm text-[#6B655B] mb-6">
                {isDeactivate
                  ? <>This workspace will be <span className="text-[#f87171] font-semibold">disabled</span> and its content will be inaccessible.</>
                  : <>This workspace will be <span className="text-[#4F7A4A] font-semibold">re-enabled</span> and accessible again.</>
                }
              </p>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => { void runAction(); }}
                  disabled={working}
                  className={[
                    'w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed',
                    isDeactivate ? 'bg-[#C0392B] text-white hover:bg-[#e74c3c]' : 'bg-[#4F7A4A] text-white hover:bg-[#15803d]',
                  ].join(' ')}
                >
                  {working
                    ? (isDeactivate ? 'Deactivating…' : 'Activating…')
                    : (isDeactivate ? 'Yes, deactivate' : 'Yes, activate')
                  }
                </button>
                <button
                  onClick={() => setConfirm(null)}
                  disabled={working}
                  className="w-full py-3 rounded-xl border border-[#15140F]/20 text-sm font-semibold text-[#3D3A30] hover:bg-[#EFE9DC] hover:text-[#15140F] disabled:opacity-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
