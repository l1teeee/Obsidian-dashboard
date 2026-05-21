import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select, { type StylesConfig } from 'react-select';
import gsap from 'gsap';
import { useGSAP } from '../hooks/useGSAP';
import { apiFetch } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/shared/Modal';

// ─── Roles ────────────────────────────────────────────────────────────────────

const ROLES = [
  'Content Creator',
  'Social Media Manager',
  'Marketing Manager',
  'Digital Marketer',
  'Brand Manager',
  'Agency Owner',
  'Freelancer',
  'Business Owner',
  'Other',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectOption {
  value: string;
  label: string;
}

// ─── react-select dark theme ──────────────────────────────────────────────────

const selectStyles: StylesConfig<SelectOption> = {
  control: (base, state) => ({
    ...base,
    backgroundColor:  '#ffffff',
    border:           state.isFocused
      ? '1px solid rgba(14,159,110,0.45)'
      : '1px solid rgba(15,23,42,0.20)',
    borderRadius:     '0.875rem',
    padding:          '4px 4px',
    boxShadow:        state.isFocused
      ? '0 0 0 3px rgba(14,159,110,0.12)'
      : 'none',
    cursor:           'pointer',
    transition:       'all 200ms',
    '&:hover': { borderColor: 'rgba(14,159,110,0.35)' },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#FFFFFF',
    border:          '1px solid rgba(15,23,42,0.12)',
    borderRadius:    '1rem',
    boxShadow:       '0 16px 48px rgba(0,0,0,0.12)',
    overflow:        'hidden',
    zIndex:          9999,
  }),
  menuList: (base) => ({
    ...base,
    padding: '6px',
    maxHeight: '220px',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? 'rgba(14,159,110,0.12)'
      : state.isFocused
        ? 'rgba(14,159,110,0.06)'
        : 'transparent',
    color:           state.isSelected ? '#111827' : '#0F172A',
    borderRadius:    '0.5rem',
    cursor:          'pointer',
    fontSize:        '0.875rem',
    padding:         '8px 12px',
    transition:      'background 150ms',
  }),
  singleValue:        (base) => ({ ...base, color: '#0F172A', fontSize: '0.875rem' }),
  input:              (base) => ({ ...base, color: '#0F172A', fontSize: '0.875rem' }),
  placeholder:        (base) => ({ ...base, color: 'rgba(113,101,126,0.50)', fontSize: '0.875rem' }),
  indicatorSeparator: ()    => ({ display: 'none' }),
  dropdownIndicator:  (base, state) => ({
    ...base,
    color:      'rgba(98,83,111,0.6)',
    transition: 'transform 200ms',
    transform:  state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    '&:hover':  { color: '#111827' },
  }),
  clearIndicator: (base) => ({
    ...base,
    color:     'rgba(98,83,111,0.6)',
    '&:hover': { color: '#c0392b' },
    padding:   '0 6px',
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color:    'rgba(113,101,126,0.60)',
    fontSize: '0.8125rem',
    padding:  '12px',
  }),
};

// ─── Shared input class ───────────────────────────────────────────────────────

const INPUT = 'w-full rounded-[0.875rem] border border-[#0F172A]/20 bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8]/50 transition-all duration-300 focus:border-[#111827]/40 focus:outline-none focus:ring-1 focus:ring-[#0E9F6E]/20';

// ─── Component ────────────────────────────────────────────────────────────────

export default function CompleteProfile() {
  const { user, isLoading, markProfileCompleted, logout } = useAuth();
  const navigate = useNavigate();

  const [name,        setName]        = useState('');
  const [role,        setRole]        = useState('');
  const [customRole,  setCustomRole]  = useState('');
  const [country,     setCountry]     = useState<SelectOption | null>(null);
  const [countries,   setCountries]   = useState<SelectOption[]>([]);
  const [loadingCtry, setLoadingCtry] = useState(true);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [profileDone, setProfileDone] = useState(false);

  const isOtherRole  = role === 'Other';
  const finalRole    = isOtherRole ? customRole.trim() : role;
  const canSubmit    = name.trim() && finalRole && country && !loading;

  // Block browser back button until form is successfully submitted
  const completedRef    = useRef(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    // Push a dummy entry so pressing Back lands here first (not the previous page)
    window.history.pushState({ _cpBlock: true }, '');

    const handlePopState = () => {
      if (completedRef.current) return;
      // Re-push dummy to keep URL stable while modal is open
      window.history.pushState({ _cpBlock: true }, '');
      setShowLeaveModal(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Redirect if profile already completed (e.g. user visits /complete-profile after finishing)
  useEffect(() => {
    if (!isLoading && user?.profileCompleted && !profileDone) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoading, user, navigate, profileDone]);

  // Navigate to /create-workspace after form submission, once React has committed
  // the updated user.profileCompleted = true from markProfileCompleted().
  // Using useEffect guarantees we read the post-commit state, avoiding a race
  // condition where ProtectedRoute would redirect back to /complete-profile.
  useEffect(() => {
    if (profileDone && user?.profileCompleted) {
      navigate('/create-workspace');
    }
  }, [profileDone, user, navigate]);

  // Fetch countries
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,flag')
      .then(r => r.json())
      .then((data: Array<{ name: { common: string }; flag: string }>) => {
        const opts = data
          .map(c => ({ value: c.name.common, label: `${c.flag}  ${c.name.common}` }))
          .sort((a, b) => a.value.localeCompare(b.value));
        setCountries(opts);
      })
      .catch(() => {
        setError('Could not load countries. Check your connection and refresh.');
      })
      .finally(() => setLoadingCtry(false));
  }, []);

  const containerRef = useGSAP<HTMLDivElement>(() => {
    gsap.to('[data-orb="1"]', { x: 14, y: -10, duration: 4.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('[data-orb="2"]', { x: -12, y: 9,  duration: 5.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    gsap.set('[data-cp-eyebrow]', { opacity: 0, y: 10 });
    gsap.set('[data-cp-title]',   { opacity: 0, y: 10 });
    gsap.set('[data-cp-field]',   { opacity: 0, y: 10 });
    gsap.set('[data-cp-btn]',     { opacity: 0, y: 10 });

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.15 });
    tl.to('[data-cp-eyebrow]', { opacity: 1, y: 0, duration: 0.38 })
      .to('[data-cp-title]',   { opacity: 1, y: 0, duration: 0.42 }, '-=0.22')
      .to('[data-cp-field]',   { opacity: 1, y: 0, duration: 0.35, stagger: 0.08 }, '-=0.2')
      .to('[data-cp-btn]',     { opacity: 1, y: 0, duration: 0.35 }, '-=0.12');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      await apiFetch('/users/me', {
        method: 'PUT',
        body: JSON.stringify({ name: name.trim(), role: finalRole, country: country!.value }),
      });
      await markProfileCompleted();
      completedRef.current = true;
      setProfileDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
    <div
      ref={containerRef}
      className="auth-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16"
    >
      {/* Ambient orbs */}
      <div data-orb="1" className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#111827]/10 blur-[120px]" />
      <div data-orb="2" className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-inverse-primary/10 blur-[100px]" />

      {/* Card */}
      <div className="relative w-full max-w-[480px] overflow-hidden rounded-[2rem] border border-[#0F172A]/20 bg-[#FFFFFF]/80 p-10 shadow-[0_30px_120px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
        {/* Top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Brand mark */}
        <div className="mb-8 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#111827]/15">
            <div className="h-2.5 w-2.5 rounded-full bg-[#111827]" />
          </div>
          <span className="font-headline text-base font-bold tracking-tight text-[#0F172A]">
            Vielinks
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 space-y-2">
          <p data-cp-eyebrow className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-[#111827]/70">
            One last step
          </p>
          <h1 data-cp-title className="font-headline text-2xl font-bold tracking-tight text-[#0F172A]">
            Complete your profile
          </h1>
          <p data-cp-title className="mt-1 text-sm text-[#94A3B8]/60 leading-relaxed">
            Tell us a bit about yourself so we can personalize your experience.
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => { void handleSubmit(e); }}>

          {/* Full name */}
          <div data-cp-field className="space-y-2">
            <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]/60">
              Full name
            </label>
            <input
              type="text"
              placeholder="Alex Johnson"
              required
              autoFocus
              autoComplete="name"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={loading}
              className={INPUT}
            />
          </div>

          {/* Role */}
          <div data-cp-field className="space-y-2">
            <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]/60">
              Your role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => (
                <button
                  key={r}
                  type="button"
                  disabled={loading}
                  onClick={() => { setRole(r); if (r !== 'Other') setCustomRole(''); }}
                  className={[
                    'px-3 py-2.5 rounded-2xl text-xs font-semibold text-left transition-all duration-200 border',
                    role === r
                      ? 'bg-[#111827]/10 border-[#111827]/40 text-[#111827]'
                      : 'bg-white border-[#0F172A]/20 text-[#64748B] hover:border-[#111827]/30 hover:text-[#0F172A]',
                    r === 'Other' ? 'col-span-2' : '',
                  ].join(' ')}
                >
                  {r}
                </button>
              ))}
            </div>
            {isOtherRole && (
              <input
                type="text"
                placeholder="Describe your role…"
                required
                autoFocus
                value={customRole}
                onChange={e => setCustomRole(e.target.value)}
                disabled={loading}
                className={`${INPUT} mt-2`}
              />
            )}
          </div>

          {/* Country */}
          <div data-cp-field className="space-y-2">
            <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]/60">
              Country
            </label>
            <Select<SelectOption>
              options={countries}
              value={country}
              onChange={opt => setCountry(opt)}
              isLoading={loadingCtry}
              isDisabled={loading}
              placeholder="Search your country…"
              noOptionsMessage={() => 'No countries found'}
              loadingMessage={() => 'Loading countries…'}
              menuPlacement="auto"
              menuPortalTarget={document.body}
              menuPosition="fixed"
              styles={selectStyles}
              isClearable
            />
          </div>

          {error && (
            <p data-cp-field className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-[0.8125rem] text-red-400">
              {error}
            </p>
          )}

          <button
            data-cp-btn
            type="submit"
            disabled={!canSubmit}
            className="mt-2 w-full rounded-2xl bg-[#111827] px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#0B1220] hover:shadow-[0_0_40px_rgba(14,159,110,0.28)] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                Saving…
              </span>
            ) : (
              'Get started'
            )}
          </button>
        </form>
      </div>
    </div>

    {/* Navigation-away confirmation */}
    <Modal
      open={showLeaveModal}
      onClose={() => setShowLeaveModal(false)}
      maxWidth="max-w-sm"
    >
      <div className="p-8 flex flex-col items-center text-center gap-5">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 22 }}>warning</span>
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <h2 className="text-lg font-extrabold text-[#0F172A] tracking-tight">
            Are you sure you want to leave?
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            You haven't completed your profile yet.<br />
            All progress will be lost if you go back.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 w-full pt-1">
          <button
            onClick={() => setShowLeaveModal(false)}
            className="w-full py-3 rounded-2xl bg-[#111827] text-white text-sm font-extrabold hover:bg-[#0B1220] active:scale-[0.98] transition-all shadow-[0_0_24px_rgba(14,159,110,0.25)]"
          >
            Stay and finish
          </button>
          <button
            onClick={() => { completedRef.current = true; void logout().then(() => navigate('/login', { replace: true })); }}
            className="w-full py-2.5 rounded-2xl text-[#64748B] text-sm font-medium hover:text-[#0F172A] transition-colors"
          >
            Leave anyway
          </button>
        </div>
      </div>
    </Modal>
    </>
  );
}
