import { useEffect, useState } from 'react';
import Select, { type StylesConfig } from 'react-select';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

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
    backgroundColor:  'rgba(255,255,255,0.03)',
    border:           state.isFocused
      ? '1px solid rgba(125,211,199,0.45)'
      : '1px solid rgba(73,72,71,0.30)',
    borderRadius:     '0.875rem',
    padding:          '4px 4px',
    boxShadow:        state.isFocused
      ? '0 0 0 3px rgba(125,211,199,0.12)'
      : 'none',
    cursor:           'pointer',
    transition:       'all 200ms',
    '&:hover': { borderColor: 'rgba(125,211,199,0.35)' },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#1c1b1b',
    border:          '1px solid rgba(76,68,80,0.30)',
    borderRadius:    '1rem',
    boxShadow:       '0 16px 48px rgba(0,0,0,0.5)',
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
      ? 'rgba(125,211,199,0.18)'
      : state.isFocused
        ? 'rgba(255,255,255,0.05)'
        : 'transparent',
    color:           state.isSelected ? '#7DD3C7' : '#e5e2e1',
    borderRadius:    '0.5rem',
    cursor:          'pointer',
    fontSize:        '0.875rem',
    padding:         '8px 12px',
    transition:      'background 150ms',
  }),
  singleValue:       (base) => ({ ...base, color: '#e5e2e1', fontSize: '0.875rem' }),
  input:             (base) => ({ ...base, color: '#e5e2e1', fontSize: '0.875rem' }),
  placeholder:       (base) => ({ ...base, color: 'rgba(173,170,170,0.40)', fontSize: '0.875rem' }),
  indicatorSeparator: ()    => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color:      'rgba(173,170,170,0.45)',
    transition: 'transform 200ms',
    transform:  state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    '&:hover':  { color: '#7DD3C7' },
  }),
  clearIndicator: (base) => ({
    ...base,
    color:     'rgba(173,170,170,0.45)',
    '&:hover': { color: '#ffb4ab' },
    padding:   '0 6px',
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color:    'rgba(173,170,170,0.50)',
    fontSize: '0.8125rem',
    padding:  '12px',
  }),
  loadingMessage: (base) => ({
    ...base,
    color:    'rgba(173,170,170,0.50)',
    fontSize: '0.8125rem',
  }),
};

// ─── Shared input class ───────────────────────────────────────────────────────

const INPUT = 'w-full rounded-[0.875rem] border border-[#1C1814]/30 bg-[#1C1814]/[0.05] px-4 py-3 text-sm text-[#1C1814] placeholder:text-[#78736E]/35 transition-all duration-300 focus:border-[#7DD3C7]/40 focus:outline-none focus:ring-1 focus:ring-[#7DD3C7]/20';

// ─── Component ────────────────────────────────────────────────────────────────

export default function CompleteProfileModal() {
  const { markProfileCompleted } = useAuth();

  const [visible,     setVisible]     = useState(false);
  const [name,        setName]        = useState('');
  const [role,        setRole]        = useState('');
  const [customRole,  setCustomRole]  = useState('');
  const [country,     setCountry]     = useState<SelectOption | null>(null);
  const [countries,   setCountries]   = useState<SelectOption[]>([]);
  const [loadingCtry, setLoadingCtry] = useState(true);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isOtherRole = role === 'Other';
  const finalRole   = isOtherRole ? customRole.trim() : role;
  const canSubmit   = name.trim() && finalRole && country && !loading;

  // Fetch countries from REST Countries API
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,flag')
      .then(r => r.json())
      .then((data: Array<{ name: { common: string }; flag: string }>) => {
        const opts = data
          .map(c => ({
            value: c.name.common,
            label: `${c.flag}  ${c.name.common}`,
          }))
          .sort((a, b) => a.value.localeCompare(b.value));
        setCountries(opts);
      })
      .catch(() => {
        // If API fails, leave empty — user can retry or we show a note
        setError('Could not load countries. Check your connection and refresh.');
      })
      .finally(() => setLoadingCtry(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      await apiFetch('/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          name:    name.trim(),
          role:    finalRole,
          country: country!.value,
        }),
      });
      await markProfileCompleted();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[998] flex items-center justify-center p-4 transition-opacity duration-500 ease-out bg-[#F4F0E8]"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7DD3C7]/8 blur-[100px] rounded-full" />

      <div
        className="relative w-full max-w-[480px] rounded-[2rem] border border-[#1C1814]/20 bg-[#FAF7F2]/90 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 ease-out"
        style={{
          opacity:   visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
        }}
      >
        {/* Top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent rounded-t-[2rem]" />

        {/* Header */}
        <div className="mb-8">
          <div className="w-11 h-11 rounded-2xl bg-[#7DD3C7]/15 border border-[#7DD3C7]/20 flex items-center justify-center mb-5">
            <span className="material-symbols-outlined text-[#7DD3C7]" style={{ fontSize: 22 }}>person_add</span>
          </div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-[#7DD3C7]/70 mb-2">
            One last step
          </p>
          <h2 className="text-2xl font-headline font-bold tracking-tight text-[#1C1814]">
            Complete your profile
          </h2>
          <p className="mt-2 text-sm text-[#78736E]/60 leading-relaxed">
            Tell us a bit about yourself so we can personalize your experience.
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => { void handleSubmit(e); }}>

          {/* Full name */}
          <div className="space-y-2">
            <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#78736E]/60">
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
          <div className="space-y-2">
            <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#78736E]/60">
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
                      ? 'bg-[#7DD3C7]/15 border-[#7DD3C7]/40 text-[#7DD3C7]'
                      : 'bg-white/[0.02] border-[#1C1814]/25 text-[#78736E]/70 hover:border-[#7DD3C7]/25 hover:text-[#1C1814]',
                    r === 'Other' ? 'col-span-2' : '',
                  ].join(' ')}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Custom role input when Other is selected */}
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
          <div className="space-y-2">
            <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#78736E]/60">
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
              styles={selectStyles}
              isClearable
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-[0.8125rem] text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-2xl bg-[#7DD3C7] px-6 py-3.5 text-sm font-bold text-[#0B0B0A] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(125,211,199,0.28)] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none mt-2"
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
  );
}
