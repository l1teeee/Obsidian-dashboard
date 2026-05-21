import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import TopBar from '../components/layout/TopBar';
import Modal from '../components/shared/Modal';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { getProfile, updateProfile } from '../services/users.service';
import type { UserPlan, UserProfile } from '../types/users.types';
import ChangePlanDialog from '../components/profile/ChangePlanDialog';

/* ── Types ── */
type Section = 'profile' | 'general' | 'workspaces' | 'team' | 'billing' | 'api' | 'security';

const NAV: { id: Section; icon: string; label: string }[] = [
  { id: 'profile',    icon: 'person',          label: 'Profile'               },
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
    Owner:  'bg-[#111827]/15 text-[#111827] border-[#111827]/20',
    Admin:  'bg-[#047857]/15 text-[#047857] border-[#047857]/20',
    Member: 'bg-[#94A3B8]/15 text-[#64748B] border-[#94A3B8]/20',
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

  useEffect(() => {
    const id = requestAnimationFrame(() => setWsName(active?.name ?? ''));
    return () => cancelAnimationFrame(id);
  }, [active?.name]);

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
        <h2 className="text-2xl font-headline font-extrabold tracking-tight text-[#0F172A]">General Settings</h2>
        <p className="text-[#64748B] text-sm mt-1 max-w-xl">
          Configure your workspace identity, manage your core team access, and review your current billing cycle.
        </p>
      </div>

      {/* Workspace Identity */}
      <div className="glass-card rounded-2xl border border-[#0F172A]/10 p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#111827]/10 border border-[#111827]/20 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
              <span className="text-xs uppercase tracking-[0.14em] font-bold text-[#111827]">Workspace Identity</span>
            </div>
            <p className="text-[#64748B] text-xs">How your workspace appears to collaborators.</p>
          </div>
          {/* Logo placeholder */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#111827] to-[#257A70] flex items-center justify-center shadow-[0_0_20px_rgba(14,159,110,0.24)] shrink-0">
            <span className="material-symbols-outlined text-[#0F172A]" style={{ fontSize: 24 }}>lens_blur</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B] mb-1.5">Workspace Name</label>
            <input
              value={wsName}
              onChange={e => setWsName(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#0F172A]/30 rounded-xl px-3.5 py-2.5 text-[#0F172A] text-sm placeholder:text-[#0F172A] focus:outline-none focus:border-[#111827]/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B] mb-1.5">Timezone</label>
            <select
              value={tz}
              onChange={e => setTz(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#0F172A]/30 rounded-xl px-3.5 py-2.5 text-[#0F172A] text-sm focus:outline-none focus:border-[#111827]/50 transition-all appearance-none cursor-pointer"
            >
              {TIMEZONES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#111827] text-white font-bold text-xs hover:bg-[#0B1220] transition-all"
          >
            Save Changes
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-[#047857] font-medium">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Team Management */}
      <div className="glass-card rounded-2xl border border-[#0F172A]/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-headline font-bold text-[#0F172A]">Team Management</h3>
            <p className="text-[#64748B] text-xs mt-0.5">You have {TEAM_MEMBERS.length} active seats on this billing cycle.</p>
          </div>
          <button className="text-xs font-bold uppercase tracking-[0.12em] text-[#111827] hover:text-[#0B1220] transition-colors flex items-center gap-1">
            Manage All Members
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_forward</span>
          </button>
        </div>

        <div className="space-y-3">
          {TEAM_MEMBERS.map(m => (
            <div key={m.email} className="flex items-center justify-between py-3 border-b border-[#0F172A]/10 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0F172A] to-[#2a2a2a] flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#0F172A]">{m.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{m.name}</p>
                  <p className="text-xs text-[#64748B] font-mono">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold uppercase tracking-[0.12em] ${roleBadge(m.role)}`}>
                  {m.role}
                </span>
                {m.role !== 'Owner' && (
                  <button className="text-xs font-bold uppercase tracking-[0.12em] text-[#64748B] hover:text-[#DC2626] border border-[#0F172A]/20 hover:border-[#DC2626]/30 px-2.5 py-1 rounded-lg transition-colors">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] border border-[#0F172A]/20 hover:border-[#111827]/30 px-4 py-2 rounded-xl transition-all">
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>person_add</span>
          Invite Member
        </button>
      </div>

      {/* Billing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pro Tier */}
        <div className="glass-card rounded-2xl border border-[#0F172A]/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#047857]" style={{ fontSize: 18 }}>verified</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#047857]">Pro Tier</span>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-headline font-extrabold text-[#0F172A]">$129</span>
            <span className="text-[#64748B] text-sm font-mono">/mo</span>
          </div>
          <p className="text-xs text-[#64748B] font-mono mb-4">Renews Dec 31, 2025</p>
          <button className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#111827] hover:text-[#0B1220] transition-colors">
            Upgrade Plan
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_forward</span>
          </button>
        </div>

        {/* Payment Method */}
        <div className="glass-card rounded-2xl border border-[#0F172A]/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B] mb-4">Payment Method</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-7 rounded-md bg-[#FFFFFF] border border-[#0F172A]/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#111827]" style={{ fontSize: 16 }}>credit_card</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F172A] font-mono">•••• •••• •••• 4242</p>
              <p className="text-xs text-[#64748B]">Expires 08/27</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B] hover:text-[#0F172A] transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>edit</span>
            Edit Details
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="surface-card rounded-2xl border border-[#DC2626]/20 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[#DC2626]" style={{ fontSize: 18 }}>warning</span>
          <h3 className="text-sm font-bold text-[#DC2626]">Danger Zone</h3>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">Delete this workspace</p>
            <p className="text-[11px] text-[#64748B] mt-1 max-w-sm">
              Once you delete a workspace, there is no going back. Please be certain before proceeding with this permanent action.
            </p>
          </div>
          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="shrink-0 px-4 py-2 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] text-xs font-bold hover:bg-[#DC2626]/20 transition-all whitespace-nowrap"
            >
              Delete Workspace
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setShowDelete(false)} className="px-3 py-2 rounded-xl border border-[#0F172A]/20 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-[#DC2626] text-white text-xs font-bold hover:bg-[#8a2820] transition-all"
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

/* ── Section: Profile ── */

const PROFILE_ROLES = [
  'Content Creator', 'Social Media Manager', 'Marketing Manager',
  'Digital Marketer', 'Brand Manager', 'Agency Owner',
  'Freelancer', 'Business Owner', 'Other',
];

const INPUT_CLS = 'w-full bg-[#FFFFFF] border border-[#0F172A]/30 rounded-xl px-3.5 py-2.5 text-[#0F172A] text-sm placeholder:text-[#0F172A] focus:outline-none focus:border-[#111827]/50 transition-all';

function ProfileSection() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name,    setName]    = useState('');
  const [role,    setRole]    = useState('');
  const [country, setCountry] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    getProfile()
      .then(p => {
        setProfile(p);
        setName(p.name ?? '');
        setRole(p.role ?? '');
        setCountry(p.country ?? '');
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProfile({
        name:    name.trim(),
        role:    role.trim()    || undefined,
        country: country.trim() || undefined,
      });
      setProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const initials = profile
    ? (profile.name ?? profile.email).slice(0, 2).toUpperCase()
    : '..';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-headline font-extrabold tracking-tight text-[#0F172A]">Profile</h2>
        <p className="text-[#64748B] text-sm mt-1 max-w-xl">Update your personal information and role.</p>
      </div>

      <div className="glass-card rounded-2xl border border-[#0F172A]/10 p-6">
        {/* Avatar + quick info */}
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[#0F172A]/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#111827] to-[#257A70] flex items-center justify-center shadow-[0_0_20px_rgba(14,159,110,0.24)] shrink-0">
            <span className="text-xl font-bold text-[#0F172A]">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[#0F172A] font-bold text-base truncate">{profile?.name ?? 'No name set'}</p>
            <p className="text-xs text-[#64748B] font-mono truncate">{profile?.email}</p>
            {profile?.role && <p className="text-xs text-[#0F172A] mt-0.5 truncate capitalize">{profile.role}</p>}
          </div>
        </div>

        <div className="space-y-4">
          {/* Name + Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B] mb-1.5">Full Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Johnson"
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B] mb-1.5">Country</label>
              <input
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="United States"
                className={INPUT_CLS}
              />
            </div>
          </div>

          {/* Email readonly */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B] mb-1.5">Email</label>
            <input
              value={profile?.email ?? ''}
              readOnly
              className={`${INPUT_CLS} opacity-50 cursor-not-allowed`}
            />
          </div>

          {/* Role chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B] mb-2">Your Role</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROFILE_ROLES.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r === role ? '' : r)}
                  className={[
                    'px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border',
                    role === r
                      ? 'bg-[#111827]/15 border-[#111827]/40 text-[#111827]'
                      : 'bg-[#FFFFFF] border-[#0F172A]/20 text-[#64748B] hover:border-[#111827]/25 hover:text-[#0F172A]',
                  ].join(' ')}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#DC2626] px-3 py-2 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/20">{error}</p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => { void handleSave(); }}
              disabled={saving || !name.trim()}
              className="px-5 py-2 rounded-xl bg-[#111827] text-white font-bold text-xs hover:bg-[#0B1220] transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {saving
                ? <><span className="material-symbols-outlined text-[12px] animate-spin">progress_activity</span> Saving…</>
                : 'Save Changes'}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-xs text-[#047857] font-medium">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                Saved
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section: Billing ── */

const BILLING_PLAN_INFO: Record<UserPlan, { label: string; price: string; color: string; features: string[] }> = {
  free: {
    label:    'Free',
    price:    '$0/mo',
    color:    '#60a5fa',
    features: ['1 social account', '5 scheduled posts/mo', 'Basic analytics', 'Community support'],
  },
  starter: {
    label:    'Starter',
    price:    'Free',
    color:    '#94A3B8',
    features: ['1 social account', '10 scheduled posts/mo', '7-day analytics', 'Community support'],
  },
  pro: {
    label:    'Pro',
    price:    '$79/mo',
    color:    '#111827',
    features: ['10 accounts', 'Unlimited posts', 'AI best-time engine', 'Priority support (4h)'],
  },
  enterprise: {
    label:    'Enterprise',
    price:    '$149/mo',
    color:    '#2563EB',
    features: ['Unlimited accounts', 'White-label PDF reports', 'API access', 'Dedicated CSM'],
  },
};

function BillingSection() {
  const [plan,       setPlan]       = useState<UserPlan | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    getProfile()
      .then(p => setPlan(p.plan ?? 'starter'))
      .catch(() => setPlan('starter'));
  }, []);

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      getProfile().then(p => setPlan(p.plan ?? 'starter')).catch(() => {});
    }
  };

  if (!plan) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-headline font-extrabold tracking-tight text-[#0F172A]">Billing & Subscription</h2>
        </div>
        <div className="glass-card rounded-2xl border border-[#0F172A]/10 p-6 animate-pulse">
          <div className="h-4 w-24 bg-[#E2E8F0] rounded-full mb-3" />
          <div className="h-7 w-20 bg-[#E2E8F0] rounded-full" />
        </div>
      </div>
    );
  }

  const info = BILLING_PLAN_INFO[plan];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-headline font-extrabold tracking-tight text-[#0F172A]">Billing & Subscription</h2>
        <p className="text-[#64748B] text-sm mt-1 max-w-xl">Manage your plan and payment details.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Current plan card */}
        <div className="glass-card rounded-2xl border border-[#0F172A]/10 p-6 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-40 h-40 blur-[70px] rounded-full pointer-events-none opacity-40"
            style={{ backgroundColor: `${info.color}33` }}
          />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#111827]/10 border border-[#111827]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
                <span className="text-xs uppercase tracking-[0.14em] font-bold text-[#111827]">Current Plan</span>
              </div>
              <span
                className="px-2.5 py-1 rounded-lg border text-xs font-bold uppercase tracking-[0.12em]"
                style={{ color: info.color, borderColor: `${info.color}40`, backgroundColor: `${info.color}12` }}
              >
                Active
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-[#0F172A] mb-0.5">{info.label}</h3>
            <p className="text-sm font-bold mb-5" style={{ color: info.color }}>{info.price}</p>
            <div className="space-y-2 mb-5">
              {info.features.map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-[#334155]">
                  <span
                    className="material-symbols-outlined text-[13px]"
                    style={{ color: info.color, fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  {f}
                </div>
              ))}
            </div>
            <button
              onClick={() => setDialogOpen(true)}
              className="w-full py-2.5 rounded-xl text-sm font-bold transition-all border active:scale-[0.98]"
              style={{ color: info.color, borderColor: `${info.color}40`, backgroundColor: `${info.color}10` }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${info.color}20`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${info.color}10`; }}
            >
              {plan === 'enterprise' ? 'Manage Billing' : 'Change Plan'}
            </button>
          </div>
        </div>

        {/* Payment method */}
        <div className="glass-card rounded-2xl border border-[#0F172A]/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B] mb-4">Payment Method</p>
          {plan === 'starter' ? (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
              <span className="material-symbols-outlined text-[#0F172A]" style={{ fontSize: 28 }}>credit_card_off</span>
              <p className="text-xs text-[#0F172A] leading-relaxed">No payment required<br/>on the free plan.</p>
              <button
                onClick={() => setDialogOpen(true)}
                className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#111827] hover:text-[#0B1220] transition-colors flex items-center gap-1"
              >
                Upgrade now
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_forward</span>
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-7 rounded-md bg-[#FFFFFF] border border-[#0F172A]/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#111827]" style={{ fontSize: 16 }}>credit_card</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A] font-mono">•••• •••• •••• 4242</p>
                  <p className="text-xs text-[#64748B]">Expires 08/27</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B] hover:text-[#0F172A] transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>edit</span>
                Update Card
              </button>
            </>
          )}
        </div>
      </div>

      <ChangePlanDialog open={dialogOpen} onOpenChange={handleDialogChange} currentPlan={plan} />
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
          <h2 className="text-2xl font-headline font-extrabold tracking-tight text-[#0F172A]">Workspaces</h2>
          <p className="text-[#64748B] text-sm mt-1">Switch between workspaces or create a new one.</p>
        </div>
        {atLimit ? (
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#0F172A]/20 text-xs text-[#0F172A] cursor-not-allowed select-none">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock</span>
            Limit reached (5/5)
          </div>
        ) : (
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827]/10 border border-[#111827]/20 text-[#111827] text-xs font-bold hover:bg-[#111827]/20 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
            New Workspace
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass-card rounded-2xl border border-[#111827]/20 p-5 flex gap-3">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Workspace name…"
            className="flex-1 bg-[#FFFFFF] border border-[#0F172A]/30 rounded-xl px-3.5 py-2.5 text-[#0F172A] text-sm placeholder:text-[#0F172A] focus:outline-none focus:border-[#111827]/50 transition-all"
          />
          <button
            type="submit"
            disabled={!newName.trim()}
            className="px-5 py-2 rounded-xl bg-[#111827] text-white font-bold text-xs disabled:opacity-40 hover:bg-[#0B1220] transition-all"
          >
            Create
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="px-3 py-2 rounded-xl border border-[#0F172A]/20 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors">
            Cancel
          </button>
        </form>
      )}

      <div className="space-y-3">
        {workspaces.map(ws => {
          const isActive = ws.id === active?.id;
          return (
            <div key={ws.id} className={`glass-card rounded-2xl border p-5 flex items-center justify-between gap-3 transition-all ${isActive ? 'border-[#111827]/30 bg-[#111827]/5' : 'border-[#0F172A]/10'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-gradient-to-tr from-[#111827] to-[#257A70]' : 'bg-[#E2E8F0]'}`}>
                  <span className="material-symbols-outlined text-[#0F172A]" style={{ fontSize: 18 }}>workspaces</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#0F172A] truncate">{ws.name}</p>
                  <p className="text-xs text-[#64748B] font-mono">
                    Created {new Date(ws.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isActive ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#047857]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#047857]" />
                    Active
                  </span>
                ) : (
                  <button
                    onClick={() => switchWorkspace(ws.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-[#0F172A]/20 text-xs text-[#64748B] hover:text-[#0F172A] hover:border-[#111827]/30 transition-all"
                  >
                    Switch
                  </button>
                )}
                <button
                  onClick={() => setDeleteTarget(ws.id)}
                  className="w-8 h-8 rounded-xl border border-[#0F172A]/15 flex items-center justify-center text-[#64748B] hover:text-[#DC2626] hover:border-[#DC2626]/30 hover:bg-[#DC2626]/5 transition-all"
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
          <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/10 border border-[#DC2626]/20 flex items-center justify-center mb-5">
            <span className="material-symbols-outlined text-[#DC2626]" style={{ fontSize: 22 }}>delete_forever</span>
          </div>
          <h2 className="text-xl font-headline font-extrabold tracking-tight text-[#0F172A] mb-1">Delete workspace?</h2>
          <p className="text-sm text-[#64748B] mb-1">
            You're about to permanently delete{' '}
            <span className="text-[#0F172A] font-semibold">"{targetName}"</span>.
          </p>
          <p className="text-xs text-[#64748B]/70 mb-7">This action cannot be undone.</p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={confirmDelete}
              className="w-full py-3 rounded-xl bg-[#DC2626] text-white font-bold text-sm hover:bg-[#8a2820] transition-all"
            >
              Yes, delete it
            </button>
            <button
              onClick={() => setDeleteTarget(null)}
              className="w-full py-3 rounded-xl border border-[#0F172A]/20 text-sm font-semibold text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-all"
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
        <h2 className="text-2xl font-headline font-extrabold tracking-tight text-[#0F172A]">{title}</h2>
        <p className="text-[#64748B] text-sm mt-1">{description}</p>
      </div>
      <div className="glass-card rounded-2xl border border-[#0F172A]/10 p-12 flex flex-col items-center justify-center text-center gap-4">
        <span className="material-symbols-outlined text-[#0F172A]" style={{ fontSize: 40 }}>{icon}</span>
        <p className="text-[#0F172A] text-sm font-mono">Coming soon</p>
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
        <aside className="w-52 shrink-0 border-r border-[#0F172A]/10 py-6 px-3 hidden md:flex flex-col gap-1">
          {NAV.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-headline tracking-tight transition-all text-left',
                section === id
                  ? 'text-[#111827] bg-[#111827]/10 font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]',
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
        <div ref={contentRef} className="flex-1 p-5 sm:p-6 md:p-8 max-w-5xl">
          {section === 'profile'    && <ProfileSection />}
          {section === 'general'    && <GeneralSection />}
          {section === 'workspaces' && <WorkspacesSection />}
          {section === 'team'       && <StubSection title="Team Management" description="Manage members, roles, and invitations." icon="group" />}
          {section === 'billing'    && <BillingSection />}
          {section === 'api'        && <StubSection title="API & Integrations" description="Manage API keys and third-party integrations." icon="api" />}
          {section === 'security'   && <StubSection title="Security" description="Password, 2FA, and active sessions." icon="shield" />}
        </div>
      </div>
    </div>
  );
}

