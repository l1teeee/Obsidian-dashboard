import { useEffect, useRef, useState } from 'react';
import * as adminService from '../../services/admin.service';
import type { AdminEntry } from '../../services/admin.service';
import Modal from '../../components/shared/Modal';

const CAPABILITIES = [
  {
    icon:  'monitoring',
    label: 'Platform Overview',
    desc:  'View real-time platform stats, charts, and top workspace rankings.',
    color: '#d394ff',
  },
  {
    icon:  'group',
    label: 'User Management',
    desc:  'Search, filter, activate, and deactivate any user account.',
    color: '#60a5fa',
  },
  {
    icon:  'workspaces',
    label: 'Workspace Control',
    desc:  'Inspect and toggle the status of all workspaces on the platform.',
    color: '#c5d247',
  },
  {
    icon:  'article',
    label: 'Post Moderation',
    desc:  'Review, activate, or deactivate posts across all users.',
    color: '#fb923c',
  },
  {
    icon:  'admin_panel_settings',
    label: 'Admin Management',
    desc:  'Add or remove platform administrators and manage their access.',
    color: '#f87171',
  },
] as const;

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function Avatar({ name, email }: { name: string | null; email: string }) {
  const letter = (name ?? email)[0].toUpperCase();
  return (
    <div className="w-9 h-9 rounded-xl bg-[#f87171]/15 border border-[#f87171]/25 flex items-center justify-center shrink-0">
      <span className="text-sm font-bold text-[#f87171]">{letter}</span>
    </div>
  );
}

export default function AdminAdmins() {
  const [admins,    setAdmins]    = useState<AdminEntry[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  // Add form
  const [addOpen,   setAddOpen]   = useState(false);
  const [email,     setEmail]     = useState('');
  const [adding,    setAdding]    = useState(false);
  const [addError,  setAddError]  = useState<string | null>(null);
  const [addOk,     setAddOk]     = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  // Remove confirm
  const [removeTarget, setRemoveTarget] = useState<AdminEntry | null>(null);
  const [removing,     setRemoving]     = useState(false);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    setError(null);
    adminService.getAdmins()
      .then(setAdmins)
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false));
  }

  function openAdd() {
    setEmail(''); setAddError(null); setAddOk(false); setAddOpen(true);
    setTimeout(() => emailRef.current?.focus(), 80);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) { setAddError('Enter a valid email address.'); return; }
    setAdding(true); setAddError(null);
    try {
      const newAdmin = await adminService.addAdmin(trimmed);
      setAdmins(prev => [newAdmin, ...prev]);
      setAddOk(true);
      setTimeout(() => { setAddOpen(false); setAddOk(false); }, 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add admin.';
      setAddError(msg);
      setAdding(false);
    }
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      await adminService.removeAdmin(removeTarget.id);
      setAdmins(prev => prev.filter(a => a.id !== removeTarget.id));
      setRemoveTarget(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to remove admin.');
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1100px] mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#f87171]" />
            <span className="text-[#f87171] text-xs uppercase tracking-widest font-bold">Admin</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-white">Administrators</h1>
          <p className="text-[#988d9c] text-sm mt-1">Manage who has admin access to this platform.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f87171] text-white text-sm font-bold shadow-[0_0_20px_rgba(248,113,113,0.2)] hover:shadow-[0_0_28px_rgba(248,113,113,0.35)] hover:bg-[#fca5a5] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">person_add</span>
          Add Administrator
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-[#f87171]/20 bg-[#f87171]/5 p-4 text-sm text-[#f87171] flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
          {error}
        </div>
      )}

      {/* Capabilities */}
      <div className="glass-card rounded-3xl border border-[#4c4450]/10 overflow-hidden">
        <div className="px-6 py-5 border-b border-[#4c4450]/10 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#f87171] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            admin_panel_settings
          </span>
          <h2 className="font-headline font-bold text-white">Admin Capabilities</h2>
          <span className="ml-auto text-[10px] text-[#4c4450] uppercase tracking-widest font-semibold">All admins share these permissions</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-0 divide-x divide-y divide-[#4c4450]/10">
          {CAPABILITIES.map(cap => (
            <div key={cap.label} className="p-5 flex flex-col gap-3 hover:bg-white/[0.015] transition-colors">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${cap.color}18` }}>
                <span className="material-symbols-outlined text-[18px]" style={{ color: cap.color, fontVariationSettings: "'FILL' 1" }}>
                  {cap.icon}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-white font-headline leading-tight">{cap.label}</p>
                <p className="text-[11px] text-[#988d9c] mt-1 leading-relaxed">{cap.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admins list */}
      <div className="glass-card rounded-3xl border border-[#4c4450]/10 overflow-hidden">
        <div className="px-6 py-5 border-b border-[#4c4450]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f87171] text-[18px]">group</span>
            <h2 className="font-headline font-bold text-white">Current Admins</h2>
          </div>
          {!loading && (
            <span className="text-[11px] text-[#4c4450] font-mono">{admins.length} {admins.length === 1 ? 'admin' : 'admins'}</span>
          )}
        </div>

        <div className="divide-y divide-[#4c4450]/8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-[#2a2a2a] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 bg-[#2a2a2a] rounded-full" />
                  <div className="h-2.5 w-28 bg-[#2a2a2a] rounded-full" />
                </div>
                <div className="h-3 w-20 bg-[#2a2a2a] rounded-full" />
              </div>
            ))
          ) : admins.length === 0 ? (
            <div className="px-6 py-16 flex flex-col items-center gap-3 text-center">
              <span className="material-symbols-outlined text-[#4c4450] text-[40px]">admin_panel_settings</span>
              <p className="text-[#988d9c] text-sm">No admins found.</p>
            </div>
          ) : (
            admins.map(admin => (
              <div key={admin.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                <Avatar name={admin.name} email={admin.email} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white leading-tight truncate">{admin.name ?? admin.email}</p>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#f87171]/10 border border-[#f87171]/20 text-[9px] font-bold text-[#f87171] uppercase tracking-wider shrink-0">
                      Admin
                    </span>
                  </div>
                  {admin.name && <p className="text-xs text-[#988d9c] mt-0.5 truncate">{admin.email}</p>}
                  {admin.added_by && (
                    <p className="text-[10px] text-[#4c4450] mt-0.5">Added by {admin.added_by}</p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <p className="text-[11px] text-[#4c4450]">{fmtDate(admin.created_at)}</p>
                </div>

                <button
                  onClick={() => setRemoveTarget(admin)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-2 rounded-xl text-[#f87171] hover:bg-[#f87171]/10 border border-transparent hover:border-[#f87171]/20"
                  title="Remove admin"
                >
                  <span className="material-symbols-outlined text-[16px]">person_remove</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add admin modal */}
      <Modal open={addOpen} onClose={() => !adding && setAddOpen(false)} maxWidth="max-w-md">
        <div className="p-8">
          <div className="w-12 h-12 rounded-2xl bg-[#f87171]/10 border border-[#f87171]/20 flex items-center justify-center mb-5">
            <span className="material-symbols-outlined text-[#f87171]" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>
              person_add
            </span>
          </div>

          <h2 className="text-xl font-headline font-extrabold tracking-tight text-white mb-1">Add Administrator</h2>
          <p className="text-sm text-[#988d9c] mb-6">
            The user will receive an email explaining their new admin role and capabilities.
          </p>

          {addOk ? (
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#c5d247]/10 border border-[#c5d247]/20 text-sm text-[#c5d247] mb-6">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
              <div>
                <p className="font-bold">Admin added successfully</p>
                <p className="text-[11px] text-[#c5d247]/70 mt-0.5">A welcome email has been sent to {email}.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={e => { void handleAdd(e); }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#988d9c] uppercase tracking-widest font-semibold">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4c4450]" style={{ fontSize: 16 }}>mail</span>
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setAddError(null); }}
                    placeholder="user@example.com"
                    disabled={adding}
                    className="w-full bg-[#1c1b1b] border border-[#4c4450]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-[#e5e2e1] placeholder:text-[#4c4450] focus:outline-none focus:border-[#f87171]/50 focus:ring-1 focus:ring-[#f87171]/20 transition-all"
                  />
                </div>
                {addError && (
                  <p className="text-xs text-[#f87171] flex items-center gap-1.5 pt-0.5">
                    <span className="material-symbols-outlined text-[13px]">error</span>
                    {addError}
                  </p>
                )}
              </div>

              {/* Capabilities preview */}
              <div className="rounded-2xl border border-[#4c4450]/15 bg-[#1a1a1a] p-4 space-y-2.5">
                <p className="text-[10px] text-[#988d9c] uppercase tracking-widest font-semibold mb-3">They will be able to</p>
                {CAPABILITIES.map(cap => (
                  <div key={cap.label} className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[13px]" style={{ color: cap.color, fontVariationSettings: "'FILL' 1" }}>
                      {cap.icon}
                    </span>
                    <span className="text-xs text-[#cfc2d2]">{cap.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  disabled={adding}
                  className="flex-1 py-3 rounded-xl border border-[#4c4450]/20 text-sm text-[#988d9c] hover:text-white hover:bg-[#201f1f] transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding || !email.trim()}
                  className="flex-1 py-3 rounded-xl bg-[#f87171] text-white text-sm font-bold hover:bg-[#fca5a5] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {adding
                    ? <><span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span> Adding…</>
                    : <><span className="material-symbols-outlined text-[14px]">send</span> Send Invite</>
                  }
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* Remove confirm modal */}
      <Modal open={!!removeTarget} onClose={() => !removing && setRemoveTarget(null)} maxWidth="max-w-sm">
        {removeTarget && (
          <div className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-[#f87171]/10 border border-[#f87171]/20 flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-[#f87171]" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>
                person_remove
              </span>
            </div>
            <h2 className="text-xl font-headline font-extrabold tracking-tight text-white mb-1">Remove admin?</h2>
            <p className="text-sm text-[#988d9c] mb-1">
              <span className="text-white font-semibold">{removeTarget.name ?? removeTarget.email}</span>
            </p>
            <p className="text-xs text-[#4c4450] mb-5">{removeTarget.email}</p>
            <p className="text-sm text-[#988d9c] mb-7">
              They will lose all admin access immediately but their user account will remain active.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => { void handleRemove(); }}
                disabled={removing}
                className="w-full py-3 rounded-xl bg-[#f87171] text-white font-bold text-sm hover:bg-[#fca5a5] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {removing
                  ? <><span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span> Removing…</>
                  : 'Yes, remove admin'
                }
              </button>
              <button
                onClick={() => setRemoveTarget(null)}
                disabled={removing}
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
