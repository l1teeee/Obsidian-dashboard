import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFadeNav } from '@/hooks/useFadeNav';
import { useAuthEntryAnimation } from '@/hooks/useAuthEntryAnimation';
import { useAuthTransitionNav } from '@/hooks/useAuthTransitionNav';
import { useAuth } from '../../hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';
import SessionConflictModal from './SessionConflictModal';
import AuthVisualPanel from './AuthVisualPanel';

const REMEMBER_KEY = 'vielinks_remembered_email';

// Reusable eye toggle SVG
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

export default function LoginCard() {
  const navigate = useNavigate();
  const fadeNav = useFadeNav();
  const authNav = useAuthTransitionNav();
  useAuthEntryAnimation();
  const { login, loginWithGoogle } = useAuth();

  const [email,            setEmail]            = useState(() => localStorage.getItem(REMEMBER_KEY) ?? '');
  const [emailLocked,      setEmailLocked]      = useState(() => !!localStorage.getItem(REMEMBER_KEY));
  const [password,         setPassword]         = useState('');
  const [showPass,         setShowPass]         = useState(false);
  const [rememberMe,       setRememberMe]       = useState(() => !!localStorage.getItem(REMEMBER_KEY));
  const [error,            setError]            = useState<string | null>(null);
  const [loading,          setLoading]          = useState(false);
  const [googleLoading,    setGoogleLoading]    = useState(false);
  const [conflictSessions, setConflictSessions] = useState(false);
  const [forceLoading,     setForceLoading]     = useState(false);

  useEffect(() => {
    if (!rememberMe) localStorage.removeItem(REMEMBER_KEY);
  }, [rememberMe]);

  const doNavigate = ({ isFirstLogin, profileCompleted }: { isFirstLogin: boolean; profileCompleted: boolean }) => {
    if (!profileCompleted) navigate('/complete-profile');
    else navigate(isFirstLogin ? '/create-workspace' : '/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await login(email, password, rememberMe);
      if (rememberMe) localStorage.setItem(REMEMBER_KEY, email);
      else localStorage.removeItem(REMEMBER_KEY);
      doNavigate(result);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === 'SESSION_LIMIT_EXCEEDED') {
        setConflictSessions(true);
      } else if (code === 'EMAIL_NOT_VERIFIED') {
        navigate('/check-email', { state: { email } });
      } else if (code === 'ACCOUNT_DISABLED') {
        setError('Your account has been deactivated. Please contact support@vielinks.com.');
      } else {
        setError(code === 'INVALID_CREDENTIALS'
          ? 'Invalid email or password'
          : 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForceLogin = async () => {
    setForceLoading(true);
    try {
      doNavigate(await login(email, password, rememberMe, true));
    } catch {
      setConflictSessions(false);
      setError('Something went wrong. Please try again.');
    } finally {
      setForceLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async ({ code }) => {
      setError(null);
      setGoogleLoading(true);
      try {
        doNavigate(await loginWithGoogle(code));
      } catch {
        setError('Google sign-in failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setError('Google sign-in failed. Please try again.'),
  });

  return (
    <div
      className="relative min-h-dvh overflow-x-hidden bg-[#FBF8F2] text-[#15140F]"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={() => fadeNav('/')}
        className="group absolute left-5 top-5 z-10 inline-flex h-10 cursor-pointer items-center gap-2 overflow-hidden rounded-full px-3 text-[13px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:left-8 sm:top-8"
      >
        <span className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <span className="relative flex items-center gap-2 text-white/90 transition-colors duration-200 group-hover:text-[#15140F]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to home
        </span>
      </button>

      <div className="flex min-h-dvh w-full">
        <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-2 lg:items-stretch">
          <AuthVisualPanel side="left" variant="login" />

          <div className="w-full lg:justify-self-stretch">
            {/* Card */}
            <div
              data-auth-panel="form"
              className="relative flex min-h-dvh w-full flex-col justify-center border-0 bg-[#FBF8F2] p-6 shadow-none sm:p-10 lg:rounded-l-none lg:rounded-r-[28px]"
            >
              <div data-auth-form-inner className="mx-auto w-full max-w-[400px]">
              <div className="mb-7 flex items-center justify-between">
                <span className="text-[18px] font-medium tracking-[-0.02em] text-[#15140F]">
                  Vielinks
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#A39B8B]">
                  Secure sign in
                </span>
              </div>

              <div className="mb-7">
                <p className="mb-4 inline-flex rounded-full bg-[#EFE9DC] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655B]">
                  Welcome back
                </p>
                <h1 className="text-[clamp(32px,7vw,44px)] font-medium leading-[1.08] tracking-[-0.04em] text-[#15140F]">
                  Sign in
                </h1>
                <p className="mt-3 text-[15px] leading-[1.65] text-[#6B655B]">
                  Access your posts, schedules, and analytics.
                </p>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={(e) => { void handleSubmit(e); }}>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="login-email" className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#A39B8B]">
                    Email
                  </label>
                  <div className="relative group">
                    <input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      readOnly={emailLocked}
                      className={`w-full rounded-xl border px-4 py-3.5 pr-11 text-[14px] placeholder:text-[#A39B8B]/55 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8553A]/15 ${
                        emailLocked
                          ? 'cursor-default select-none border-[#C8553A]/30 bg-[#F4E0D6] text-[#6B655B]'
                          : 'border-border bg-[#F6F2EA] text-[#15140F] focus:border-[#C8553A]'
                      }`}
                    />
                    {emailLocked && (
                      <button
                        type="button"
                        onClick={() => setEmailLocked(false)}
                        aria-label="Edit remembered email"
                        title="Edit email"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A39B8B] opacity-0 transition-all duration-200 hover:text-[#C8553A] group-hover:opacity-100"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="login-password" className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#A39B8B]">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-[12px] font-medium text-[#6B655B] transition-colors duration-200 hover:text-[#C8553A]">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
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

                {/* Remember me */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={rememberMe}
                    onClick={() => setRememberMe(v => !v)}
                    className={`relative shrink-0 rounded-[5px] border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8553A]/35 ${
                      rememberMe
                        ? 'border-[#C8553A] bg-[#C8553A]'
                        : 'border-[#A39B8B] bg-[#FBF8F2] hover:border-[#C8553A]'
                    }`}
                    style={{ width: 18, height: 18 }}
                  >
                    {rememberMe && (
                      <svg className="absolute inset-0 m-auto" width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  <span
                    className="cursor-pointer select-none text-[13px] text-[#6B655B] transition-colors hover:text-[#15140F]"
                    onClick={() => setRememberMe(v => !v)}
                  >
                    Keep me signed in for 7 days
                  </span>
                </div>

                {/* Error */}
                {error && (
                  <p role="alert" aria-live="assertive" className="rounded-xl border border-[#A8362A]/20 bg-[#FDDBD8] px-4 py-2.5 text-[13px] text-[#5A0000]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-xl bg-[#15140F] px-6 py-3.5 text-[14px] font-medium text-[#F6F2EA] transition-colors duration-200 hover:bg-[#3D3A30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8553A]/35 disabled:pointer-events-none disabled:opacity-60"
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>

              {/* Social sign-in */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#A39B8B]">or continue with</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  disabled={googleLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-[#FBF8F2] px-4 py-3 text-[14px] font-medium text-[#3D3A30] transition-colors duration-200 hover:border-[#A39B8B] hover:bg-[#F6F2EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8553A]/35 disabled:pointer-events-none disabled:opacity-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {googleLoading ? 'Connecting…' : 'Continue with Google'}
                </button>
              </div>

              <p className="mt-6 text-center text-[13px] text-[#6B655B]">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  onClick={(event) => {
                    event.preventDefault();
                    authNav('/register');
                  }}
                  className="font-medium text-[#C8553A] transition-colors duration-200 hover:text-[#A53F28]"
                >
                  Get started
                </Link>
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {conflictSessions && (
        <SessionConflictModal
          loading={forceLoading}
          onConfirm={handleForceLogin}
          onCancel={() => setConflictSessions(false)}
        />
      )}
    </div>
  );
}
