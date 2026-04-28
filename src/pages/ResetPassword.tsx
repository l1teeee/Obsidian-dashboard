import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import { verifyResetOtp, resetPassword } from '../services/auth.service';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

const OTP_TTL = 60;

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email    = (location.state as { email?: string } | null)?.email ?? '';

  const [step,        setStep]        = useState<1 | 2>(1);
  const [otp,         setOtp]         = useState('');
  const [verifiedOtp, setVerifiedOtp] = useState('');
  const [password,    setPassword]    = useState('');
  const [confirm,     setConfirm]     = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [success,     setSuccess]     = useState(false);
  const [timeLeft,    setTimeLeft]    = useState(OTP_TTL);
  const expired = timeLeft === 0;

  useEffect(() => {
    if (!email) navigate('/forgot-password', { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (expired || step === 2) return;
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [expired, step]);

  const pwRules = {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number:    /[0-9]/.test(password),
    special:   /[^A-Za-z0-9]/.test(password),
  };
  const pwScore    = Object.values(pwRules).filter(Boolean).length;
  const pwAllMet   = pwScore === 5;
  const pwBarColor = pwScore <= 2 ? '#ef4444' : pwScore === 3 ? '#f97316' : pwScore === 4 ? '#eab308' : '#22c55e';

  const successRef = useRef<HTMLDivElement>(null);

  const containerRef = useGSAP<HTMLDivElement>(() => {
    gsap.set('[data-rp-anim]', { opacity: 0, y: 12 });
    gsap.to('[data-rp-anim]', {
      opacity: 1, y: 0, duration: 0.38, stagger: 0.07, ease: 'power2.out', delay: 0.1,
    });
  }, [step]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setError('Enter the 6-digit code'); return; }
    if (expired)           { setError('The code has expired. Request a new one.'); return; }
    setError(null);
    setLoading(true);
    try {
      await verifyResetOtp(email, otp);
      setVerifiedOtp(otp);
      setStep(2);
    } catch (err) {
      const code = (err as { code?: string }).code;
      setError(
        code === 'OTP_EXPIRED' ? 'The code has expired. Request a new one.' :
        'Invalid code. Check your email and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwAllMet)            { setError('Password does not meet all requirements'); return; }
    if (password !== confirm)  { setError('Passwords do not match'); return; }
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email, verifiedOtp, password);
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (err) {
      const code = (err as { code?: string }).code;
      setError(
        code === 'PASSWORD_PREVIOUSLY_USED' ? 'This password has been used recently. Please choose a different one.' :
        code === 'OTP_EXPIRED'              ? 'Session expired. Please start over.' :
        'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#d394ff]/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-[#aa30fa]/10 blur-[100px]" />
        <div ref={successRef} className="relative w-full max-w-[400px] overflow-hidden rounded-[2rem] border border-[#494847]/20 bg-[#1a1919]/70 p-10 text-center shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <div className="mb-6 flex justify-center">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" stroke="#d394ff" strokeWidth="2" fill="rgba(211,148,255,0.06)"/>
              <path d="M19 32L28 42L45 24" stroke="#d394ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-[#d394ff]/70 mb-2">Done</p>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-[#e5e2e1] mb-3">Password updated!</h1>
          <p className="text-sm text-[#adaaaa]/60">Redirecting you to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="auth-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16"
    >
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#d394ff]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-[#aa30fa]/10 blur-[100px]" />

      <div className="relative w-full max-w-[440px] overflow-hidden rounded-[2rem] border border-[#494847]/20 bg-[#1a1919]/70 p-10 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* Header */}
        <div data-rp-anim className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d394ff]/15">
              <div className="h-2.5 w-2.5 rounded-full bg-[#d394ff]" />
            </div>
            <span className="font-headline text-base font-bold tracking-tight text-[#e5e2e1]">Vielinks</span>
          </div>
          {step === 1 ? (
            <Link to="/forgot-password" className="flex items-center gap-1.5 text-[0.7rem] text-[#988d9c] hover:text-white transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back
            </Link>
          ) : (
            <button type="button" onClick={() => { setStep(1); setError(null); }} className="flex items-center gap-1.5 text-[0.7rem] text-[#988d9c] hover:text-white transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back
            </button>
          )}
        </div>

        {/* Step indicator */}
        <div data-rp-anim className="mb-6 flex items-center gap-2">
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-[#d394ff]' : 'bg-[#4c4450]/30'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-[#d394ff]' : 'bg-[#4c4450]/30'}`} />
        </div>

        {/* ── Step 1: Verify OTP ── */}
        {step === 1 && (
          <>
            <div data-rp-anim className="mb-8 space-y-2">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-[#d394ff]/70">Step 1 of 2</p>
              <h1 className="font-headline text-2xl font-bold tracking-tight text-[#e5e2e1]">Enter your reset code</h1>
              <p className="text-sm text-[#adaaaa]/50">
                We sent a 6-digit code to <span className="text-[#e5e2e1]/70">{email}</span>.
              </p>
            </div>

            <div data-rp-anim className={`mb-6 flex items-center gap-2 text-xs font-medium ${expired ? 'text-red-400' : 'text-[#adaaaa]/60'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                {expired ? 'timer_off' : 'timer'}
              </span>
              {expired ? 'Code expired' : `Code expires in ${timeLeft}s`}
              {expired && (
                <Link to="/forgot-password" className="ml-auto text-[#d394ff] hover:underline">Resend</Link>
              )}
            </div>

            <form className="space-y-5" onSubmit={(e) => { void handleVerifyOtp(e); }}>
              <div data-rp-anim className="space-y-2">
                <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#adaaaa]/60">
                  Reset code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="000000"
                  required
                  autoFocus
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={loading || expired}
                  className="w-full rounded-[0.875rem] border border-[#494847]/30 bg-white/[0.03] px-4 py-3.5 text-center text-lg font-bold tracking-[0.5em] text-[#e5e2e1] placeholder:text-[#adaaaa]/35 transition-all duration-300 focus:border-[#d394ff]/40 focus:outline-none focus:ring-1 focus:ring-[#d394ff]/20 disabled:opacity-40"
                />
              </div>

              {error && (
                <p data-rp-anim className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-[0.8125rem] text-red-400">
                  {error}
                </p>
              )}

              <button
                data-rp-anim
                type="submit"
                disabled={loading || expired || otp.length !== 6}
                className="w-full rounded-xl bg-[#d394ff] px-6 py-3.5 text-sm font-bold text-[#4a0076] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(211,148,255,0.28)] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
              >
                {loading ? 'Verifying…' : 'Verify code'}
              </button>
            </form>
          </>
        )}

        {/* ── Step 2: New password ── */}
        {step === 2 && (
          <>
            <div data-rp-anim className="mb-8 space-y-2">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-[#d394ff]/70">Step 2 of 2</p>
              <h1 className="font-headline text-2xl font-bold tracking-tight text-[#e5e2e1]">Set your new password</h1>
              <p className="text-sm text-[#adaaaa]/50">Choose a strong password for your account.</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => { void handleResetPassword(e); }}>
              <div data-rp-anim className="space-y-2">
                <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#adaaaa]/60">New password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    required
                    autoComplete="new-password"
                    autoFocus
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                    onCopy={e => e.preventDefault()}
                    className="w-full rounded-[0.875rem] border border-[#494847]/30 bg-white/[0.03] px-4 py-3.5 pr-11 text-sm text-[#e5e2e1] placeholder:text-[#adaaaa]/35 transition-all duration-300 focus:border-[#d394ff]/40 focus:outline-none focus:ring-1 focus:ring-[#d394ff]/20"
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#adaaaa]/40 transition-colors duration-200 hover:text-[#d394ff]">
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>

              {password.length > 0 && (
                <div data-rp-anim className="space-y-2.5">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: i <= pwScore ? pwBarColor : 'rgba(73,72,71,0.25)' }} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {([
                      ['length',    'At least 8 characters'],
                      ['uppercase', 'One uppercase letter'],
                      ['lowercase', 'One lowercase letter'],
                      ['number',    'One number'],
                      ['special',   'One special character'],
                    ] as [keyof typeof pwRules, string][]).map(([key, label]) => (
                      <span key={key} className={`flex items-center gap-1.5 text-[0.7rem] transition-colors duration-200 ${pwRules[key] ? 'text-[#22c55e]' : 'text-[#adaaaa]/45'}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                          {pwRules[key] ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div data-rp-anim className="space-y-2">
                <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#adaaaa]/60">Confirm new password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    required
                    autoComplete="new-password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    disabled={loading}
                    onPaste={e => e.preventDefault()}
                    className="w-full rounded-[0.875rem] border border-[#494847]/30 bg-white/[0.03] px-4 py-3.5 pr-11 text-sm text-[#e5e2e1] placeholder:text-[#adaaaa]/35 transition-all duration-300 focus:border-[#d394ff]/40 focus:outline-none focus:ring-1 focus:ring-[#d394ff]/20"
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#adaaaa]/40 transition-colors duration-200 hover:text-[#d394ff]">
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
              </div>

              {error && (
                <p data-rp-anim className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-[0.8125rem] text-red-400">
                  {error}
                </p>
              )}

              <button
                data-rp-anim
                type="submit"
                disabled={loading || !pwAllMet || password !== confirm}
                className="w-full rounded-xl bg-[#d394ff] px-6 py-3.5 text-sm font-bold text-[#4a0076] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(211,148,255,0.28)] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
              >
                {loading ? 'Updating password…' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
