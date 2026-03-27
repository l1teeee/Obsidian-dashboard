import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import TopBar from '../components/layout/TopBar';
import Modal from '../components/shared/Modal';
import { useWorkspace } from '../contexts/WorkspaceContext';

/* ── Types ── */
type Section = 'general' | 'workspaces' | 'team' | 'billing' | 'api' | 'security';

const NAV: { id: Section; icon: string; label: string }[] = [
  { id: 'general',    icon: 'tune',            label: 'General'               },
  { id: 'workspaces', icon: 'workspaces',       label: 'Workspaces'            },
  { id: 'team',       icon: 'group',            label: 'Team Management'       },
  { id: 'billing',    icon: 'credit_card',      label: 'Billing & Subscription'},
  { id: 'api',        icon: 'api',              label: 'API & Integrations'    },
  { id: 'security',   icon: 'shield',           label: 'Security'              },
];

const TEAM_MEMBERS = [
  { name: 'Alex Rivera',   role: 'Owner',  email: 'alex@obsidianlens.io',   joined: 'Jan 12, 2024' },
  { name: 'Dana Braun',    role: 'Admin',  email: 'dana@obsidianlens.io',   joined: 'Feb 03, 2024' },
  { name: 'Marcus Chen',   role: 'Member', email: 'marcus@obsidianlens.io', joined: 'Mar 18, 2024' },
];

const TIMEZONES = ['(GMT-08:00) Pacific Time [US]', '(GMT-05:00) Eastern Time [US]', '(GMT+00:00) UTC', '(GMT+01:00) Central European Time', '(GMT+02:00) Eastern European Time'];

function roleBadge(role: string) {
  const map: Record<string, string> = {
    Owner:  'bg-[#d394ff]/15 text-[#d394ff] border-[#d394ff]/20',
    Admin:  'bg-[#c5d247]/15 text-[#c5d247] border-[#c5d247]/20',
    Member: 'bg-[#988d9c]/15 text-[#988d9c] border-[#988d9c]/20',
  };
  return map[role] ?? map['Member'];
}

/* ── Section: General ── */
function GeneralSection() {
  const { active, updateWorkspaceName, deleteWorkspace, workspaces, switchWorkspace } = useWorkspace();
  const [wsName, setWsName]   = useState(active?.name ?? '');
  const [tz, setTz]           = useState(TIMEZONES[0]);
  const [saved, setSaved]     = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setWsName(active?.name ?? ''); }, [active]);

  const handleSave = () => {
    if (!active || !wsName.trim()) return;
    updateWorkspaceName(active.id, wsName.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    if (!active) return;
    deleteWorkspace(active.id);
    const remaining = workspaces.filter(w => w.id !== active.id);
    if (remaining.length > 0) {
      switchWorkspace(remaining[0].id);
      navigate('/dashboard');
    } else {
      navigate('/create-workspace');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-headline font-extrabold tracking-tight text-white">General Settings</h2>
        <p className="text-[#988d9c] text-sm mt-1 max-w-xl">
          Configure your workspace identity, manage your core team access, and review your current billing cycle.
        </p>
      </div>

      {/* Workspace Identity */}
      <div className="glass-card rounded-2xl border border-[#4c4450]/10 p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#d394ff]/10 border border-[#d394ff]/20 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d394ff]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#d394ff]">Workspace Identity</span>
            </div>
            <p className="text-[#988d9c] text-xs">How your workspace appears to collaborators.</p>
          </div>
          {/* Logo placeholder */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d394ff] to-[#9400e4] flex items-center justify-center shadow-[0_0_20px_rgba(211,148,255,0.3)] shrink-0">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 24 }}>lens_blur</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#988d9c] mb-1.5">Workspace Name</label>
            <input
              value={wsName}
              onChange={e => setWsName(e.target.value)}
              className="w-full bg-[#1c1b1b] border border-[#4c4450]/30 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-[#4c4450] focus:outline-none focus:border-[#d394ff]/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#988d9c] mb-1.5">Timezone</label>
            <select
              value={tz}
              onChange={e => setTz(e.target.value)}
              className="w-full bg-[#1c1b1b] border border-[#4c4450]/30 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-[#d394ff]/50 transition-all appearance-none cursor-pointer"
            >
              {TIMEZONES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#d394ff] text-[#131313] font-bold text-xs hover:bg-[#e0a8ff] transition-all"
          >
            Save Changes
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-[#c5d247] font-medium">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Team Management */}
      <div className="glass-card rounded-2xl border border-[#4c4450]/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-headline font-bold text-white">Team Management</h3>
            <p className="text-[#988d9c] text-xs mt-0.5">You have {TEAM_MEMBERS.length} active seats on this billing cycle.</p>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-wider text-[#d394ff] hover:text-[#e0a8ff] transition-colors flex items-center gap-1">
            Manage All Members
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_forward</span>
          </button>
        </div>

        <div className="space-y-3">
          {TEAM_MEMBERS.map(m => (
            <div key={m.email} className="flex items-center justify-between py-3 border-b border-[#4c4450]/10 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4c4450] to-[#2a2a2a] flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">{m.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{m.name}</p>
                  <p className="text-[10px] text-[#988d9c] font-mono">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${roleBadge(m.role)}`}>
                  {m.role}
                </span>
                {m.role !== 'Owner' && (
                  <button className="text-[10px] font-bold uppercase tracking-wider text-[#988d9c] hover:text-[#ffb4ab] border border-[#4c4450]/20 hover:border-[#ffb4ab]/30 px-2.5 py-1 rounded-lg transition-colors">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#988d9c] hover:text-white border border-[#4c4450]/20 hover:border-[#d394ff]/30 px-4 py-2 rounded-xl transition-all">
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>person_add</span>
          Invite Member
        </button>
      </div>

      {/* Billing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pro Tier */}
        <div className="glass-card rounded-2xl border border-[#4c4450]/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#c5d247]" style={{ fontSize: 18 }}>verified</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#c5d247]">Pro Tier</span>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-headline font-extrabold text-white">$129</span>
            <span className="text-[#988d9c] text-sm font-mono">/mo</span>
          </div>
          <p className="text-[10px] text-[#988d9c] font-mono mb-4">Renews Dec 31, 2025</p>
          <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#d394ff] hover:text-[#e0a8ff] transition-colors">
            Upgrade Plan
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_forward</span>
          </button>
        </div>

        {/* Payment Method */}
        <div className="glass-card rounded-2xl border border-[#4c4450]/10 p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#988d9c] mb-4">Payment Method</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-7 rounded-md bg-[#1c1b1b] border border-[#4c4450]/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 16 }}>credit_card</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white font-mono">•••• •••• •••• 4242</p>
              <p className="text-[10px] text-[#988d9c]">Expires 08/27</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#988d9c] hover:text-white transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>edit</span>
            Edit Details
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-2xl border border-[#ffb4ab]/20 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[#ffb4ab]" style={{ fontSize: 18 }}>warning</span>
          <h3 className="text-sm font-bold text-[#ffb4ab]">Danger Zone</h3>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">Delete this workspace</p>
            <p className="text-[11px] text-[#988d9c] mt-1 max-w-sm">
              Once you delete a workspace, there is no going back. Please be certain before proceeding with this permanent action.
            </p>
          </div>
          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="shrink-0 px-4 py-2 rounded-xl bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs font-bold hover:bg-[#ffb4ab]/20 transition-all whitespace-nowrap"
            >
              Delete Workspace
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setShowDelete(false)} className="px-3 py-2 rounded-xl border border-[#4c4450]/20 text-xs text-[#988d9c] hover:text-white transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-[#ffb4ab] text-[#131313] text-xs font-bold hover:bg-[#ffccc7] transition-all"
              >
                Confirm Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Section: Workspaces ── */
function WorkspacesSection() {
  const { workspaces, active, switchWorkspace, createWorkspace, deleteWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const [newName, setNewName]           = useState('');
  const [showForm, setShowForm]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const atLimit = workspaces.length >= 5;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createWorkspace(newName.trim());
    setNewName('');
    setShowForm(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const remaining = workspaces.filter(w => w.id !== deleteTarget);
    deleteWorkspace(deleteTarget);
    setDeleteTarget(null);
    if (remaining.length === 0) navigate('/create-workspace');
    else if (deleteTarget === active?.id) switchWorkspace(remaining[0].id);
  };

  const targetName = workspaces.find(w => w.id === deleteTarget)?.name ?? '';

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-headline font-extrabold tracking-tight text-white">Workspaces</h2>
          <p className="text-[#988d9c] text-sm mt-1">Switch between workspaces or create a new one.</p>
        </div>
        {atLimit ? (
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#4c4450]/20 text-xs text-[#4c4450] cursor-not-allowed select-none">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock</span>
            Limit reached (5/5)
          </div>
        ) : (
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d394ff]/10 border border-[#d394ff]/20 text-[#d394ff] text-xs font-bold hover:bg-[#d394ff]/20 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
            New Workspace
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass-card rounded-2xl border border-[#d394ff]/20 p-5 flex gap-3">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Workspace name…"
            className="flex-1 bg-[#1c1b1b] border border-[#4c4450]/30 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-[#4c4450] focus:outline-none focus:border-[#d394ff]/50 transition-all"
          />
          <button
            type="submit"
            disabled={!newName.trim()}
            className="px-5 py-2 rounded-xl bg-[#d394ff] text-[#131313] font-bold text-xs disabled:opacity-40 hover:bg-[#e0a8ff] transition-all"
          >
            Create
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="px-3 py-2 rounded-xl border border-[#4c4450]/20 text-xs text-[#988d9c] hover:text-white transition-colors">
            Cancel
          </button>
        </form>
      )}

      <div className="space-y-3">
        {workspaces.map(ws => {
          const isActive = ws.id === active?.id;
          return (
            <div key={ws.id} className={`glass-card rounded-2xl border p-5 flex items-center justify-between gap-3 transition-all ${isActive ? 'border-[#d394ff]/30 bg-[#d394ff]/5' : 'border-[#4c4450]/10'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-gradient-to-tr from-[#d394ff] to-[#9400e4]' : 'bg-[#2a2a2a]'}`}>
                  <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>workspaces</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{ws.name}</p>
                  <p className="text-[10px] text-[#988d9c] font-mono">
                    Created {new Date(ws.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isActive ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#c5d247]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5d247]" />
                    Active
                  </span>
                ) : (
                  <button
                    onClick={() => switchWorkspace(ws.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-[#4c4450]/20 text-xs text-[#988d9c] hover:text-white hover:border-[#d394ff]/30 transition-all"
                  >
                    Switch
                  </button>
                )}
                <button
                  onClick={() => setDeleteTarget(ws.id)}
                  className="w-8 h-8 rounded-xl border border-[#4c4450]/15 flex items-center justify-center text-[#988d9c] hover:text-[#ffb4ab] hover:border-[#ffb4ab]/30 hover:bg-[#ffb4ab]/5 transition-all"
                  title="Delete workspace"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete confirmation modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="max-w-sm">
        <div className="p-8">
          <div className="w-12 h-12 rounded-2xl bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 flex items-center justify-center mb-5">
            <span className="material-symbols-outlined text-[#ffb4ab]" style={{ fontSize: 22 }}>delete_forever</span>
          </div>
          <h2 className="text-xl font-headline font-extrabold tracking-tight text-white mb-1">Delete workspace?</h2>
          <p className="text-sm text-[#988d9c] mb-1">
            You're about to permanently delete{' '}
            <span className="text-white font-semibold">"{targetName}"</span>.
          </p>
          <p className="text-xs text-[#988d9c]/70 mb-7">This action cannot be undone.</p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={confirmDelete}
              className="w-full py-3 rounded-xl bg-[#ffb4ab] text-[#131313] font-bold text-sm hover:bg-[#ffccc7] transition-all"
            >
              Yes, delete it
            </button>
            <button
              onClick={() => setDeleteTarget(null)}
              className="w-full py-3 rounded-xl border border-[#4c4450]/20 text-sm font-semibold text-[#cfc2d2] hover:bg-[#201f1f] hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ── Stub section ── */
function StubSection({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-headline font-extrabold tracking-tight text-white">{title}</h2>
        <p className="text-[#988d9c] text-sm mt-1">{description}</p>
      </div>
      <div className="glass-card rounded-2xl border border-[#4c4450]/10 p-12 flex flex-col items-center justify-center text-center gap-4">
        <span className="material-symbols-outlined text-[#4c4450]" style={{ fontSize: 40 }}>{icon}</span>
        <p className="text-[#4c4450] text-sm font-mono">Coming soon</p>
      </div>
    </div>
  );
}

/* ── Main Settings page ── */
export default function Settings() {
  const [section, setSection] = useState<Section>('general');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleNav = (id: Section) => {
    setSection(id);
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
    );
  };

  useEffect(() => {
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    );
  }, []);

  return (
    <div>
      <TopBar title="Settings" />

      <div className="flex min-h-[calc(100vh-60px)]">

        {/* Settings left nav */}
        <aside className="w-52 shrink-0 border-r border-[#4c4450]/10 py-6 px-3 hidden md:flex flex-col gap-1">
          {NAV.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-headline tracking-tight transition-all text-left',
                section === id
                  ? 'text-[#d394ff] bg-[#d394ff]/10 font-semibold'
                  : 'text-[#988d9c] hover:text-white hover:bg-[#201f1f]',
              ].join(' ')}
            >
              <span
                className="material-symbols-outlined shrink-0"
                style={{ fontSize: 18, fontVariationSettings: section === id ? "'FILL' 1" : "'FILL' 0" }}
              >
                {icon}
              </span>
              {label}
            </button>
          ))}
        </aside>

        {/* Settings content */}
        <div ref={contentRef} className="flex-1 p-6 md:p-8 max-w-3xl">
          {section === 'general'    && <GeneralSection />}
          {section === 'workspaces' && <WorkspacesSection />}
          {section === 'team'       && <StubSection title="Team Management" description="Manage members, roles, and invitations." icon="group" />}
          {section === 'billing'    && <StubSection title="Billing & Subscription" description="Manage your plan and payment methods." icon="credit_card" />}
          {section === 'api'        && <StubSection title="API & Integrations" description="Manage API keys and third-party integrations." icon="api" />}
          {section === 'security'   && <StubSection title="Security" description="Password, 2FA, and active sessions." icon="shield" />}
        </div>
      </div>
    </div>
  );
}
