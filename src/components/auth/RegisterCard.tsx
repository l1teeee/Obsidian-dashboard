import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';
import AuthVisualPanel from './AuthVisualPanel';
import { useAuthEntryAnimation } from '@/hooks/useAuthEntryAnimation';
import { useFadeNav } from '@/hooks/useFadeNav';
import { useAuthTransitionNav } from '@/hooks/useAuthTransitionNav';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function RegisterCard() {
  const navigate = useNavigate();
  const fadeNav = useFadeNav();
  const authNav = useAuthTransitionNav();
  useAuthEntryAnimation();
  const { register, loginWithGoogle } = useAuth();

  const [step, setStep] = useState<'method' | 'email'>('method');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const pwRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const pwScore = Object.values(pwRules).filter(Boolean).length;
  const pwAllMet = pwScore === 5;
  const pwBarColor = pwScore <= 2 ? '#A8362A' : pwScore === 3 ? '#B7841E' : pwScore === 4 ? '#C8553A' : '#4F7A4A';

  const handleGoogleRegister = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async ({ code }) => {
      setError(null);
      setGoogleLoading(true);
      try {
        const result = await loginWithGoogle(code);
        if (!result.profileCompleted) navigate('/complete-profile');
        else navigate(result.isFirstLogin ? '/create-workspace' : '/dashboard');
      } catch {
        setError('Google sign-in failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setError('Google sign-in failed. Please try again.'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pwAllMet) {
      setError('Password does not meet all requirements');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await register(email, password);
      navigate('/check-email', { state: { email: result.email } });
    } catch (err) {
      const code = (err as { code?: string }).code;
      setError(code === 'EMAIL_ALREADY_EXISTS'
        ? 'This email is already registered'
        : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#FBF8F2] text-[#15140F]">
      <button
        type="button"
        onClick={() => fadeNav('/')}
        className="absolute left-5 top-5 z-10 inline-flex h-10 items-center gap-2 rounded-full px-3 text-[13px] font-medium text-[#6B655B] transition-colors duration-200 hover:bg-[#EFE9DC] hover:text-[#15140F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8553A]/35 sm:left-8 sm:top-8"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to home
      </button>

      <div className="flex min-h-dvh w-full">
        <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-2 lg:items-stretch">
          <div className="w-full lg:justify-self-stretch">
            <div
              data-auth-panel="form"
              className="relative flex min-h-dvh w-full flex-col justify-center border-0 bg-[#FBF8F2] p-6 shadow-none sm:p-10 lg:rounded-l-[28px] lg:rounded-r-none"
            >
              <div data-auth-form-inner className="mx-auto w-full max-w-[400px]">
              <div className="mb-7 flex items-center justify-between">
                <span className="text-[18px] font-medium tracking-[-0.02em] text-[#15140F]">
                  Vielinks
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#A39B8B]">
                  {step === 'method' ? 'Sign up' : 'Email setup'}
                </span>
              </div>

              <div className="mb-7">
                <p className="mb-4 inline-flex rounded-full bg-[#EFE9DC] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655B]">
                  Get started
                </p>
                <h1 className="text-[clamp(32px,7vw,44px)] font-medium leading-[1.08] tracking-[-0.04em] text-[#15140F]">
                  Create your account
                </h1>
                <p className="mt-3 text-[15px] leading-[1.65] text-[#6B655B]">
                  Start with Google or create a password-protected account.
                </p>
              </div>

              {step === 'method' ? (
                <>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleGoogleRegister()}
                      disabled={googleLoading}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-[#FBF8F2] px-4 py-3 text-[14px] font-medium text-[#3D3A30] transition-colors duration-200 hover:border-[#A39B8B] hover:bg-[#F6F2EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8553A]/35 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      {googleLoading ? 'Connecting...' : 'Continue with Google'}
                    </button>

                    <div className="flex items-center gap-3 py-1">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#A39B8B]">or</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setStep('email');
                      }}
                      className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#15140F] px-4 py-3.5 text-[14px] font-medium text-[#F6F2EA] transition-colors duration-200 hover:bg-[#3D3A30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8553A]/35"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="3" />
                        <path d="M2 8l10 6 10-6" />
                      </svg>
                      Continue with email
                    </button>
                  </div>

                  {error && (
                    <p role="alert" aria-live="assertive" className="mt-4 rounded-xl border border-[#A8362A]/20 bg-[#FDDBD8] px-4 py-2.5 text-[13px] text-[#5A0000]">
                      {error}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setStep('method');
                    }}
                    className="mb-6 inline-flex h-9 items-center gap-2 rounded-full px-3 text-[13px] font-medium text-[#6B655B] transition-colors duration-200 hover:bg-[#EFE9DC] hover:text-[#15140F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8553A]/35"
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                  </button>

                  <form className="space-y-5" onSubmit={(e) => { void handleSubmit(e); }}>
                    <div className="space-y-2">
                      <label htmlFor="register-email" className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#A39B8B]">
                        Email
                      </label>
                      <input
                        id="register-email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={loading}
                        className="w-full rounded-xl border border-border bg-[#F6F2EA] px-4 py-3.5 text-[14px] text-[#15140F] placeholder:text-[#A39B8B]/55 transition-colors duration-200 focus:border-[#C8553A] focus:outline-none focus:ring-2 focus:ring-[#C8553A]/15"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="register-password" className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#A39B8B]">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="register-password"
                          type={showPass ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          required
                          autoComplete="new-password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          disabled={loading}
                          onCopy={e => e.preventDefault()}
                          className="w-full rounded-xl border border-border bg-[#F6F2EA] px-4 py-3.5 pr-11 text-[14px] text-[#15140F] placeholder:text-[#A39B8B]/55 transition-colors duration-200 focus:border-[#C8553A] focus:outline-none focus:ring-2 focus:ring-[#C8553A]/15"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(v => !v)}
                          aria-label={showPass ? 'Hide password' : 'Show password'}
                          aria-pressed={showPass}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A39B8B] transition-colors duration-200 hover:text-[#C8553A]"
                        >
                          <EyeIcon open={showPass} />
                        </button>
                      </div>
                    </div>

                    {password.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div
                              key={i}
                              className="h-1 flex-1 rounded-full transition-colors duration-200"
                              style={{ backgroundColor: i <= pwScore ? pwBarColor : '#E7E0D0' }}
                            />
                          ))}
                        </div>
                        <div className="grid grid-cols-1 gap-y-1 sm:grid-cols-2 sm:gap-x-4">
                          {([
                            ['length', 'At least 8 characters'],
                            ['uppercase', 'One uppercase letter'],
                            ['lowercase', 'One lowercase letter'],
                            ['number', 'One number'],
                            ['special', 'One special character'],
                          ] as [keyof typeof pwRules, string][]).map(([key, label]) => (
                            <span key={key} className={`flex items-center gap-1.5 text-[12px] transition-colors duration-200 ${pwRules[key] ? 'text-[#4F7A4A]' : 'text-[#A39B8B]'}`}>
                              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label htmlFor="register-confirm" className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#A39B8B]">
                        Confirm password
                      </label>
                      <div className="relative">
                        <input
                          id="register-confirm"
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          required
                          autoComplete="new-password"
                          value={confirm}
                          onChange={e => setConfirm(e.target.value)}
                          disabled={loading}
                          onPaste={e => e.preventDefault()}
                          className="w-full rounded-xl border border-border bg-[#F6F2EA] px-4 py-3.5 pr-11 text-[14px] text-[#15140F] placeholder:text-[#A39B8B]/55 transition-colors duration-200 focus:border-[#C8553A] focus:outline-none focus:ring-2 focus:ring-[#C8553A]/15"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(v => !v)}
                          aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                          aria-pressed={showConfirm}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A39B8B] transition-colors duration-200 hover:text-[#C8553A]"
                        >
                          <EyeIcon open={showConfirm} />
                        </button>
                      </div>
                    </div>

                    {error && (
                      <p role="alert" aria-live="assertive" className="rounded-xl border border-[#A8362A]/20 bg-[#FDDBD8] px-4 py-2.5 text-[13px] text-[#5A0000]">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !pwAllMet || password !== confirm}
                      className="mt-2 w-full rounded-xl bg-[#15140F] px-6 py-3.5 text-[14px] font-medium text-[#F6F2EA] transition-colors duration-200 hover:bg-[#3D3A30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8553A]/35 disabled:pointer-events-none disabled:opacity-60"
                    >
                      {loading ? 'Creating account...' : 'Create account'}
                    </button>
                  </form>
                </>
              )}

              <p className="mt-6 text-center text-[13px] text-[#6B655B]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  onClick={(event) => {
                    event.preventDefault();
                    authNav('/login');
                  }}
                  className="font-medium text-[#C8553A] transition-colors duration-200 hover:text-[#A53F28]"
                >
                  Sign in
                </Link>
              </p>
              </div>
            </div>
          </div>

          <AuthVisualPanel side="right" variant="register" />
        </div>
      </div>
    </div>
  );
}
