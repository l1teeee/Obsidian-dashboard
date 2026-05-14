import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import { requestPasswordReset } from '../services/auth.service';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromLink = searchParams.get('email') ?? '';
  const [email,   setEmail]   = useState(emailFromLink);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // When coming from the login notification email, auto-send the OTP
  useEffect(() => {
    if (!emailFromLink) return;
    setLoading(true);
    requestPasswordReset(emailFromLink)
      .then(() => navigate('/reset-password', { state: { email: emailFromLink } }))
      .catch(() => setError('Something went wrong. Please try again.'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerRef = useGSAP<HTMLDivElement>(() => {
    gsap.set('[data-fp-anim]', { opacity: 0, y: 12 });
    gsap.to('[data-fp-anim]', {
      opacity: 1, y: 0, duration: 0.38, stagger: 0.07, ease: 'power2.out', delay: 0.1,
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      navigate('/reset-password', { state: { email } });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="auth-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16"
    >
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#7DD3C7]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-inverse-primary/10 blur-[100px]" />

      <div className="relative w-full max-w-[440px] overflow-hidden rounded-[2rem] border border-[#1C1814]/20 bg-[#FAF7F2]/70 p-10 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        <div data-fp-anim className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7DD3C7]/15">
              <div className="h-2.5 w-2.5 rounded-full bg-[#7DD3C7]" />
            </div>
            <span className="font-headline text-base font-bold tracking-tight text-[#1C1814]">Vielinks</span>
          </div>
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-[0.7rem] text-[#6A6470] hover:text-[#1C1814] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to login
          </Link>
        </div>

        <div data-fp-anim className="mb-8 space-y-2">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-[#7DD3C7]/70">Password reset</p>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-[#1C1814]">Forgot your password?</h1>
          <p className="text-sm text-[#78736E]/50">
            Enter your email and we'll send you a reset code.
            {' '}<span className="text-[#78736E]/35">Google sign-in users can use this to set a password too.</span>
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => { void handleSubmit(e); }}>
          <div data-fp-anim className="space-y-2">
            <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#78736E]/60">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              className="w-full rounded-[0.875rem] border border-[#1C1814]/30 bg-[#1C1814]/[0.05] px-4 py-3.5 text-sm text-[#1C1814] placeholder:text-[#78736E]/35 transition-all duration-300 focus:border-[#7DD3C7]/40 focus:outline-none focus:ring-1 focus:ring-[#7DD3C7]/20"
            />
          </div>

          {error && (
            <p data-fp-anim className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-[0.8125rem] text-red-400">
              {error}
            </p>
          )}

          <button
            data-fp-anim
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#7DD3C7] px-6 py-3.5 text-sm font-bold text-[#0B0B0A] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(125,211,199,0.28)] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
          >
            {loading ? 'Sending code…' : 'Send reset code'}
          </button>
        </form>

        <p data-fp-anim className="mt-6 text-center text-[0.8125rem] text-[#78736E]/50">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-[#7DD3C7] transition-colors duration-300 hover:text-[#9ee3db]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
