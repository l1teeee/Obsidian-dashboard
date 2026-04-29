import { useEffect, useRef, useState } from 'react';
import * as adminService from '../../services/admin.service';
import type { AdminPostRow } from '../../types/admin.types';
import type { PageMeta } from '../../lib/api';
import Modal from '../../components/shared/Modal';
import Pagination from '../../components/shared/Pagination';

// ── Constants ─────────────────────────────────────────────────────────────────

const DEACTIVATE_REASONS = [
  'Violates community guidelines',
  'Spam or misleading content',
  'Copyright infringement',
  'Inappropriate content',
  'Other',
];

const ACTIVATE_REASONS = [
  'Appeal approved',
  'Content reviewed and approved',
  'Violation resolved',
  'Administrative correction',
  'Other',
];

const PLATFORMS = ['instagram', 'facebook', 'linkedin', 'twitter', 'tiktok'];
const STATUSES  = ['draft', 'scheduled', 'published', 'inactive', 'failed'];

const STATUS_META: Record<string, { cls: string; icon: string; label: string }> = {
  draft:     { cls: 'text-[#988d9c] bg-[#988d9c]/10 border-[#988d9c]/20',  icon: 'draft',        label: 'Draft'     },
  scheduled: { cls: 'text-[#60a5fa] bg-[#60a5fa]/10 border-[#60a5fa]/20',  icon: 'schedule',     label: 'Scheduled' },
  published: { cls: 'text-[#c5d247] bg-[#c5d247]/10 border-[#c5d247]/20',  icon: 'check_circle', label: 'Published' },
  inactive:  { cls: 'text-[#f87171] bg-[#f87171]/10 border-[#f87171]/20',  icon: 'pause_circle', label: 'Inactive'  },
  failed:    { cls: 'text-[#fb923c] bg-[#fb923c]/10 border-[#fb923c]/20',  icon: 'error',        label: 'Failed'    },
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#e1306c',
  facebook:  '#1877f2',
  linkedin:  '#0077b5',
  twitter:   '#1da1f2',
  tiktok:    '#69c9d0',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(d: string | Date) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function PlatformBadge({ platform }: { platform: string }) {
  const color = PLATFORM_COLORS[platform.toLowerCase()] ?? '#988d9c';
  return (
    <span
      className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border"
      style={{ color, background: `${color}18`, borderColor: `${color}30` }}
    >
      {platform}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${m.cls}`}>
      <span className="material-symbols-outlined" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
      {m.label}
    </span>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type ConfirmAction = { post: AdminPostRow; action: 'deactivate' | 'activate' };

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminPosts() {
  const [posts,    setPosts]    = useState<AdminPostRow[]>([]);
  const [meta,     setMeta]     = useState<PageMeta | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState('');
  const [platform, setPlatform] = useState('');
  const [status,   setStatus]   = useState('');
  const [confirm,      setConfirm]      = useState<ConfirmAction | null>(null);
  const [reason,       setReason]       = useState('');
  const [customReason, setCustomReason] = useState('');
  const [working,      setWorking]      = useState(false);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = (p: number, s: string, pl: string, st: string) => {
    setLoading(true);
    setError(null);
    adminService.getPosts({ page: p, search: s || undefined, platform: pl || undefined, status: st || undefined })
      .then(r => { setPosts(r.posts); setMeta(r.meta); })
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1, '', '', ''); }, []);

  const handleSearch   = (v: string) => {
    setSearch(v);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => { setPage(1); load(1, v, platform, status); }, 400);
  };
  const handlePlatform = (v: string) => { setPlatform(v); setPage(1); load(1, search, v, status); };
  const handleStatus   = (v: string) => { setStatus(v === status ? '' : v); setPage(1); load(1, search, platform, v === status ? '' : v); };
  const goPage         = (p: number) => { setPage(p); load(p, search, platform, status); };

  const openConfirm = (action: ConfirmAction) => {
    setReason('');
    setCustomReason('');
    setConfirm(action);
  };

  const finalReason = reason === 'Other' ? customReason.trim() : reason;

  const runAction = async () => {
    if (!confirm || !finalReason) return;
    setWorking(true);
    try {
      if (confirm.action === 'deactivate') {
        await adminService.deactivatePost(confirm.post.id, finalReason);
        setPosts(prev => prev.map(p => p.id === confirm.post.id ? { ...p, status: 'inactive' } : p));
      } else {
        await adminService.activatePost(confirm.post.id, finalReason);
        setPosts(prev => prev.map(p => p.id === confirm.post.id ? { ...p, status: 'draft' } : p));
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setWorking(false);
      setConfirm(null);
    }
  };

  // Count per status in the current page for the summary bar
  const statusCounts = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  const isDeactivate = confirm?.action === 'deactivate';

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#f87171]" />
            <span className="text-[#f87171] text-xs uppercase tracking-widest font-bold">Admin</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-white">Posts</h1>
          {meta && <p className="text-[#988d9c] text-sm mt-1">{meta.total.toLocaleString()} total posts</p>}
        </div>
        <button
          onClick={() => load(page, search, platform, status)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#4c4450]/20 text-[#988d9c] hover:text-white hover:border-[#4c4450]/40 transition-all text-xs"
        >
          <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`} style={{ fontSize: 14 }}>refresh</span>
          Refresh
        </button>
      </div>

      {/* Status summary — clickable filter pills */}
      {!loading && Object.keys(statusCounts).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {STATUSES.filter(s => statusCounts[s]).map(s => {
            const m       = STATUS_META[s];
            const active  = status === s;
            return (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                className={[
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                  active ? m.cls : 'text-[#988d9c] bg-transparent border-[#4c4450]/20 hover:border-[#4c4450]/40 hover:text-white',
                ].join(' ')}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                {m.label}
                <span className="font-mono opacity-60">{statusCounts[s]}</span>
              </button>
            );
          })}
          {status && (
            <button
              onClick={() => handleStatus('')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs text-[#4c4450] border border-[#4c4450]/15 hover:text-white transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>close</span>
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* Filters row */}
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[220px] max-w-xs flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#988d9c]" style={{ fontSize: 16 }}>search</span>
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search by caption or owner..."
            className="w-full bg-[#1c1b1b] border border-[#4c4450]/20 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-[#4c4450] focus:outline-none focus:border-[#d394ff]/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {['', ...PLATFORMS].map(p => (
            <button
              key={p || 'all-pl'}
              onClick={() => handlePlatform(p)}
              className={[
                'px-3 py-2 rounded-xl text-xs font-semibold transition-all border',
                platform === p
                  ? 'bg-[#f87171]/10 border-[#f87171]/30 text-[#f87171]'
                  : 'bg-transparent border-[#4c4450]/20 text-[#988d9c] hover:text-white hover:border-[#4c4450]/40',
              ].join(' ')}
            >
              {p || 'All platforms'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {['', ...STATUSES].map(s => (
            <button
              key={s || 'all-st'}
              onClick={() => handleStatus(s)}
              className={[
                'px-3 py-2 rounded-xl text-xs font-semibold transition-all border',
                status === s
                  ? 'bg-[#d394ff]/10 border-[#d394ff]/30 text-[#d394ff]'
                  : 'bg-transparent border-[#4c4450]/20 text-[#988d9c] hover:text-white hover:border-[#4c4450]/40',
              ].join(' ')}
            >
              {s ? (STATUS_META[s]?.label ?? s) : 'All statuses'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-[#f87171]/20 bg-[#f87171]/5 p-4 text-sm text-[#f87171] flex items-center gap-2">
          <span className="material-symbols-outlined shrink-0" style={{ fontSize: 16 }}>error</span>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="glass-card rounded-3xl border border-[#4c4450]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#4c4450]/10">
                <th className="text-left px-5 py-4 text-[#988d9c] text-xs uppercase tracking-widest font-semibold">Platform</th>
                <th className="text-left px-5 py-4 text-[#988d9c] text-xs uppercase tracking-widest font-semibold">Caption</th>
                <th className="text-left px-5 py-4 text-[#988d9c] text-xs uppercase tracking-widest font-semibold">Status</th>
                <th className="text-left px-5 py-4 text-[#988d9c] text-xs uppercase tracking-widest font-semibold">Owner</th>
                <th className="text-left px-5 py-4 text-[#988d9c] text-xs uppercase tracking-widest font-semibold">Workspace</th>
                <th className="text-right px-5 py-4 text-[#988d9c] text-xs uppercase tracking-widest font-semibold">Date</th>
                <th className="text-center px-5 py-4 text-[#988d9c] text-xs uppercase tracking-widest font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#4c4450]/5 animate-pulse">
                    <td className="px-5 py-4"><div className="h-5 w-20 bg-[#2a2a2a] rounded-lg" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-48 bg-[#2a2a2a] rounded-full" /></td>
                    <td className="px-5 py-4"><div className="h-5 w-24 bg-[#2a2a2a] rounded-lg" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-28 bg-[#2a2a2a] rounded-full" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-24 bg-[#2a2a2a] rounded-full" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-20 bg-[#2a2a2a] rounded-full ml-auto" /></td>
                    <td className="px-5 py-4"><div className="h-6 w-24 bg-[#2a2a2a] rounded-lg mx-auto" /></td>
                  </tr>
                ))
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-[#4c4450]">
                    <span className="material-symbols-outlined text-4xl block mb-2">article</span>
                    No posts found
                  </td>
                </tr>
              ) : (
                posts.map(post => {
                  const isInactive = post.status === 'inactive';
                  return (
                    <tr
                      key={post.id}
                      className={[
                        'border-b border-[#4c4450]/5 transition-colors',
                        isInactive ? 'opacity-50 hover:opacity-70' : 'hover:bg-white/[0.02]',
                      ].join(' ')}
                    >
                      <td className="px-5 py-4"><PlatformBadge platform={post.platform} /></td>

                      <td className="px-5 py-4 max-w-[240px]">
                        {post.caption
                          ? <p className="text-[#cfc2d2] text-xs truncate">{post.caption}</p>
                          : <p className="text-[#4c4450] text-xs italic">No caption</p>
                        }
                        <p className="text-[#4c4450] text-[10px] mt-0.5 uppercase tracking-wide">{post.post_type}</p>
                      </td>

                      <td className="px-5 py-4"><StatusBadge status={post.status} /></td>

                      <td className="px-5 py-4 text-[#988d9c] text-xs">{post.owner_email}</td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded bg-gradient-to-tr from-[#d394ff]/40 to-[#9400e4]/40 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 10 }}>workspaces</span>
                          </div>
                          <span className="text-[#cfc2d2] text-xs">{post.workspace_name}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right text-[#988d9c] text-xs whitespace-nowrap">
                        {post.published_at
                          ? fmtDate(post.published_at)
                          : post.scheduled_at
                            ? <span className="text-[#60a5fa]">{fmtDate(post.scheduled_at)}</span>
                            : fmtDate(post.created_at)
                        }
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {isInactive ? (
                            <button
                              onClick={() => openConfirm({ post, action: 'activate' })}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-[#c5d247] bg-[#c5d247]/8 border border-[#c5d247]/20 hover:bg-[#c5d247]/15 hover:border-[#c5d247]/35 transition-all whitespace-nowrap"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                              Activate
                            </button>
                          ) : (
                            <button
                              onClick={() => openConfirm({ post, action: 'deactivate' })}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-[#f87171] bg-[#f87171]/8 border border-[#f87171]/20 hover:bg-[#f87171]/15 hover:border-[#f87171]/35 transition-all whitespace-nowrap"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>pause_circle</span>
                              Deactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {meta && <Pagination page={page} total={meta.total} limit={meta.limit} onPage={goPage} loading={loading} />}
      </div>

      {/* Confirm modal — handles both activate and deactivate */}
      <Modal open={!!confirm} onClose={() => !working && setConfirm(null)} maxWidth="max-w-sm">
        {confirm && (
          <div className="p-8">
            <div className={[
              'w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border',
              isDeactivate
                ? 'bg-[#f87171]/10 border-[#f87171]/20'
                : 'bg-[#c5d247]/10 border-[#c5d247]/20',
            ].join(' ')}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 22, color: isDeactivate ? '#f87171' : '#c5d247', fontVariationSettings: "'FILL' 1" }}
              >
                {isDeactivate ? 'pause_circle' : 'play_circle'}
              </span>
            </div>

            <h2 className="text-xl font-headline font-extrabold tracking-tight text-white mb-1">
              {isDeactivate ? 'Deactivate post?' : 'Activate post?'}
            </h2>

            <p className="text-xs text-[#988d9c] mb-1">
              <span className="text-[#cfc2d2] font-semibold">{confirm.post.owner_email}</span>
              {' · '}
              <span className="uppercase">{confirm.post.platform}</span>
            </p>
            {confirm.post.caption && (
              <p className="text-xs text-[#4c4450] truncate mb-3">{confirm.post.caption}</p>
            )}

            <p className="text-sm text-[#988d9c] mb-4">
              {isDeactivate
                ? <>The post will be marked as <span className="text-[#f87171] font-semibold">inactive</span> and hidden from the user.</>
                : <>The post will be restored as a <span className="text-[#c5d247] font-semibold">draft</span>. The user can review and republish it.</>
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
                          ? isDeactivate
                            ? 'border-[#f87171] bg-[#f87171]'
                            : 'border-[#c5d247] bg-[#c5d247]'
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
                  isDeactivate
                    ? 'bg-[#f87171] text-white hover:bg-[#fca5a5]'
                    : 'bg-[#c5d247] text-[#1a1d00] hover:bg-[#d4e24f]',
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
