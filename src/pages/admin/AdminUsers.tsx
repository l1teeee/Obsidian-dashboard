import { useEffect, useRef, useState } from 'react';
import * as adminService from '../../services/admin.service';
import type { AdminUserRow } from '../../types/admin.types';
import type { PageMeta } from '../../lib/api';
import Modal from '../../components/shared/Modal';
import Pagination from '../../components/shared/Pagination';

const PLANS = ['starter', 'pro', 'enterprise'];

const PLAN_COLORS: Record<string, string> = {
  starter:    'text-[#988d9c] bg-[#988d9c]/10',
  pro:        'text-[#d394ff] bg-[#d394ff]/10',
  enterprise: 'text-[#c5d247] bg-[#c5d247]/10',
};

const DEACTIVATE_REASONS = [
  'Terms of service violation',
  'Spam or abusive behavior',
  'Fraudulent activity',
  'User request',
  'Other',
];

const ACTIVATE_REASONS = [
  'Appeal approved',
  'Account verified',
  'Administrative correction',
  'Other',
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function Avatar({ name, email }: { name: string | null; email: string }) {
  const letter = (name ?? email)[0].toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d394ff]/30 to-[#9400e4]/30 border border-[#d394ff]/20 flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-[#d394ff]">{letter}</span>
    </div>
  );
}

type ConfirmAction = { user: AdminUserRow; action: 'deactivate' | 'activate' };

export default function AdminUsers() {
  const [users,        setUsers]        = useState<AdminUserRow[]>([]);
  const [meta,         setMeta]         = useState<PageMeta | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState('');
  const [plan,         setPlan]         = useState('');
  const [confirm,      setConfirm]      = useState<ConfirmAction | null>(null);
  const [reason,       setReason]       = useState('');
  const [customReason, setCustomReason] = useState('');
  const [working,      setWorking]      = useState(false);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = (p: number, s: string, pl: string) => {
    setLoading(true);
    setError(null);
    adminService.getUsers({ page: p, search: s || undefined, plan: pl || undefined })
      .then(r => { setUsers(r.users); setMeta(r.meta); })
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page, search, plan); }, []);

  const handleSearch = (v: string) => {
    setSearch(v);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => { setPage(1); load(1, v, plan); }, 400);
  };

  const handlePlan = (v: string) => { setPlan(v); setPage(1); load(1, search, v); };
  const goPage     = (p: number)  => { setPage(p); load(p, search, plan); };

  const openConfirm = (action: ConfirmAction) => {
    setReason('');
    setCustomReason('');
    setConfirm(action);
  };

  const finalReason    = reason === 'Other' ? customReason.trim() : reason;
  const isDeactivate   = confirm?.action === 'deactivate';

  const runAction = async () => {
    if (!confirm || !finalReason) return;
    setWorking(true);
    try {
      if (confirm.action === 'deactivate') {
        await adminService.deactivateUser(confirm.user.id, finalReason);
        setUsers(prev => prev.map(u => u.id === confirm.user.id ? { ...u, is_banned: true } : u));
      } else {
        await adminService.activateUser(confirm.user.id, finalReason);
        setUsers(prev => prev.map(u => u.id === confirm.user.id ? { ...u, is_banned: false } : u));
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setWorking(false);
      setConfirm(null);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#f87171]" />
          <span className="text-[#f87171] text-xs uppercase tracking-widest font-bold">Admin</span>
        </div>
        <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-white">Users</h1>
        {meta && <p className="text-[#988d9c] text-sm mt-1">{meta.total.toLocaleString()} total users</p>}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#988d9c]" style={{ fontSize: 16 }}>search</span>
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search by email or name..."
            className="w-full bg-[#1c1b1b] border border-[#4c4450]/20 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-[#4c4450] focus:outline-none focus:border-[#d394ff]/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {['', ...PLANS].map(p => (
            <button
              key={p || 'all'}
              onClick={() => handlePlan(p)}
              className={[
                'px-3 py-2 rounded-xl text-xs font-semibold transition-all border',
                plan === p
                  ? 'bg-[#f87171]/10 border-[#f87171]/30 text-[#f87171]'
                  : 'bg-transparent border-[#4c4450]/20 text-[#988d9c] hover:text-white hover:border-[#4c4450]/40',
              ].join(' ')}
            >
              {p || 'All plans'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-[#f87171]/20 bg-[#f87171]/5 p-4 text-sm text-[#f87171]">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="glass-card rounded-3xl border border-[#4c4450]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#4c4450]/10">
                <th className="text-left px-6 py-4 text-[#988d9c] text-xs uppercase tracking-widest font-semibold">User</th>
                <th className="text-left px-6 py-4 text-[#988d9c] text-xs uppercase tracking-widest font-semibold">Plan</th>
                <th className="text-center px-6 py-4 text-[#988d9c] text-xs uppercase tracking-widest font-semibold">Workspaces</th>
                <th className="text-center px-6 py-4 text-[#988d9c] text-xs uppercase tracking-widest font-semibold">Posts</th>
                <th className="text-left px-6 py-4 text-[#988d9c] text-xs uppercase tracking-widest font-semibold">Status</th>
                <th className="text-right px-6 py-4 text-[#988d9c] text-xs uppercase tracking-widest font-semibold">Joined</th>
                <th className="text-center px-6 py-4 text-[#988d9c] text-xs uppercase tracking-widest font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#4c4450]/5 animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2a2a2a]" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-32 bg-[#2a2a2a] rounded-full" />
                          <div className="h-2.5 w-24 bg-[#2a2a2a] rounded-full" />
                        </div>
                      </div>
                    </td>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-3 w-16 bg-[#2a2a2a] rounded-full mx-auto" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-[#4c4450]">
                    <span className="material-symbols-outlined text-4xl block mb-2">group</span>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr
                    key={u.id}
                    className={[
                      'border-b border-[#4c4450]/5 transition-colors',
                      u.is_banned ? 'opacity-50 hover:opacity-70' : 'hover:bg-white/[0.02]',
                    ].join(' ')}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} email={u.email} />
                        <div>
                          <p className="text-white text-xs font-semibold leading-tight">{u.name ?? '—'}</p>
                          <p className="text-[#988d9c] text-xs mt-0.5">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${PLAN_COLORS[u.plan] ?? 'text-[#988d9c] bg-[#988d9c]/10'}`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono text-white text-sm">{u.workspace_count}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono text-white text-sm">{u.post_count}</span>
                    </td>
                    <td className="px-6 py-4">
                      {u.is_banned ? (
                        <span className="flex items-center gap-1.5 text-[#f87171] text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f87171]" />
                          Deactivated
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[#c5d247] text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c5d247]" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-[#988d9c] text-xs">{fmtDate(u.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        {u.is_banned ? (
                          <button
                            onClick={() => openConfirm({ user: u, action: 'activate' })}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-[#c5d247] bg-[#c5d247]/8 border border-[#c5d247]/20 hover:bg-[#c5d247]/15 hover:border-[#c5d247]/35 transition-all whitespace-nowrap"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                            Activate
                          </button>
                        ) : (
                          <button
                            onClick={() => openConfirm({ user: u, action: 'deactivate' })}
                            disabled={u.is_admin}
                            title={u.is_admin ? 'Cannot deactivate admin accounts' : undefined}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-[#f87171] bg-[#f87171]/8 border border-[#f87171]/20 hover:bg-[#f87171]/15 hover:border-[#f87171]/35 transition-all whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>block</span>
                            Deactivate
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
        {confirm && (
          <div className="p-8">
            <div className={[
              'w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border',
              isDeactivate ? 'bg-[#f87171]/10 border-[#f87171]/20' : 'bg-[#c5d247]/10 border-[#c5d247]/20',
            ].join(' ')}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 22, color: isDeactivate ? '#f87171' : '#c5d247', fontVariationSettings: "'FILL' 1" }}
              >
                {isDeactivate ? 'block' : 'play_circle'}
              </span>
            </div>

            <h2 className="text-xl font-headline font-extrabold tracking-tight text-white mb-1">
              {isDeactivate ? 'Deactivate account?' : 'Activate account?'}
            </h2>

            <p className="text-xs text-[#988d9c] mb-1">
              <span className="text-[#cfc2d2] font-semibold">{confirm.user.name ?? confirm.user.email}</span>
            </p>
            <p className="text-xs text-[#4c4450] mb-4">{confirm.user.email}</p>

            <p className="text-sm text-[#988d9c] mb-4">
              {isDeactivate
                ? <>The user will be <span className="text-[#f87171] font-semibold">immediately logged out</span> and unable to sign in.</>
                : <>The user will be able to <span className="text-[#c5d247] font-semibold">sign in again</span>.</>
              }
            </p>

            {/* Reason selector */}
            <div className="mb-5">
              <p className="text-[10px] font-bold text-[#988d9c] uppercase tracking-widest mb-2.5">
                Reason <span className="text-[#f87171]">*</span>
              </p>
              <div className="flex flex-col gap-2">
                {(isDeactivate ? DEACTIVATE_REASONS : ACTIVATE_REASONS).map(r => (
                  <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      onClick={() => setReason(r)}
                      className={[
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer',
                        reason === r
                          ? isDeactivate ? 'border-[#f87171] bg-[#f87171]' : 'border-[#c5d247] bg-[#c5d247]'
                          : 'border-[#4c4450]/40 bg-transparent group-hover:border-[#988d9c]',
                      ].join(' ')}
                    >
                      {reason === r && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span
                      onClick={() => setReason(r)}
                      className={`text-sm transition-colors cursor-pointer ${reason === r ? 'text-white font-medium' : 'text-[#988d9c] group-hover:text-[#cfc2d2]'}`}
                    >
                      {r}
                    </span>
                  </label>
                ))}
              </div>
              {reason === 'Other' && (
                <textarea
                  value={customReason}
                  onChange={e => setCustomReason(e.target.value)}
                  placeholder="Describe the reason..."
                  rows={3}
                  className="mt-3 w-full bg-[#1c1b1b] border border-[#4c4450]/20 rounded-xl p-3 text-sm text-white placeholder:text-[#4c4450] focus:outline-none focus:border-[#d394ff]/40 resize-none transition-all"
                />
              )}
            </div>

            <p className="text-xs text-[#4c4450] mb-6 flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>mail</span>
              An email with this reason will be sent to the user.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => { void runAction(); }}
                disabled={working || !finalReason}
                className={[
                  'w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed',
                  isDeactivate ? 'bg-[#f87171] text-white hover:bg-[#fca5a5]' : 'bg-[#c5d247] text-[#1a1d00] hover:bg-[#d4e24f]',
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
                className="w-full py-3 rounded-xl border border-[#4c4450]/20 text-sm font-semibold text-[#cfc2d2] hover:bg-[#201f1f] hover:text-white disabled:opacity-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
