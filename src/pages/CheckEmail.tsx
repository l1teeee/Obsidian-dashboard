import { useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useGSAP } from '../hooks/useGSAP';
import { useAuth } from '../hooks/useAuth';
import { resendVerification } from '../services/auth.service';
import gsap from 'gsap';

interface LocationState {
  email?: string;
}

export default function CheckEmail() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { verifyEmail } = useAuth();
  const state     = (location.state ?? {}) as LocationState;
  const email     = state.email ?? '';

  const [code,           setCode]           = useState('');
  const [loading,        setLoading]        = useState(false);
  const [codeStatus,     setCodeStatus]     = useState<'idle' | 'error'>('idle');
  const [resending,      setResending]      = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [resendMsg,      setResendMsg]      = useState<string | null>(null);

  const containerRef = useGSAP<HTMLDivElement>(() => {
    gsap.set('[data-ce-anim]', { opacity: 0, y: 16 });
    gsap.to('[data-ce-anim]', {
      opacity: 1, y: 0,
      duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.1,
    });
  }, []);

  const successRef     = useRef<HTMLDivElement>(null);
  const formRef        = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const checkCircleRef = useRef<SVGCircleElement>(null);
  const checkPathRef   = useRef<SVGPathElement>(null);

  const playSuccess = (dest: string) => {
    requestAnimationFrame(() => {
      const container = containerRef.current;
      const form   = formRef.current;
      const succ   = successRef.current;
      const circle = checkCircleRef.current;
      const path   = checkPathRef.current;
      if (!container || !form || !succ || !circle || !path) return;

      gsap.set(succ, { opacity: 0, scale: 0.88, display: 'flex' });
      const circleLen = circle.getTotalLength?.() ?? 163;
      const pathLen   = path.getTotalLength?.()   ?? 30;
      gsap.set(circle, { strokeDasharray: circleLen, strokeDashoffset: circleLen });
      gsap.set(path,   { strokeDasharray: pathLen,   strokeDashoffset: pathLen   });

      gsap.timeline({ onComplete: () => navigate(dest, { replace: true }) })
        .to(form,    { opacity: 0, y: -12, duration: 0.28, ease: 'power2.in' })
        .to(succ,    { opacity: 1, scale: 1, duration: 0.38, ease: 'back.out(1.4)' }, '-=0.1')
        .to(circle,  { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, '-=0.2')
        .to(path,    { strokeDashoffset: 0, duration: 0.32, ease: 'power2.out' }, '-=0.1')
        .from('[data-success-text]', { opacity: 0, y: 10, duration: 0.35, stagger: 0.08, ease: 'power2.out' }, '-=0.1')
        // Brief pause, then fade the whole page out before navigating
        .to({}, { duration: 0.7 })
        .to(container, { opacity: 0, y: -20, duration: 0.45, ease: 'power2.in' });
    });
  };

  const shakeInput = () => {
    const el = inputRef.current;
    if (!el) return;
    gsap.timeline()
      .to(el, { x: -8, duration: 0.07, ease: 'power2.out' })
      .to(el, { x:  8, duration: 0.07 })
      .to(el, { x: -6, duration: 0.06 })
      .to(el, { x:  6, duration: 0.06 })
      .to(el, { x:  0, duration: 0.05 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setCodeStatus('idle');
    setLoading(true);
    try {
      const { profileCompleted } = await verifyEmail(email, code.trim());
      playSuccess(profileCompleted ? '/dashboard' : '/complete-profile');
    } catch (err) {
      const errCode = (err as { code?: string }).code;
      if (errCode === 'INVALID_CODE') {
        setCodeStatus('error');
        shakeInput();
        setCode('');
      } else {
        setCodeStatus('error');
        shakeInput();
      }
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resendCooldown) return;
    setResending(true);
    setResendMsg(null);
    try {
      await resendVerification(email);
      setResendMsg('Done! Check your inbox (or use any code — dev mode).');
      setResendCooldown(true);
      setTimeout(() => setResendCooldown(false), 60_000);
    } catch {
      setResendMsg('Could not resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    navigate('/register', { replace: true });
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="auth-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16"
    >
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#d394ff]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-[#aa30fa]/10 blur-[100px]" />

      <div className="relative w-full max-w-[440px] overflow-hidden rounded-[2rem] border border-[#494847]/20 bg-[#1a1919]/70 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* ── Form ── */}
        <div ref={formRef} className="p-10">
          {/* Icon */}
          <div data-ce-anim className="mb-7 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d394ff]/10 border border-[#d394ff]/20">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d394ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="3"/>
                <path d="M2 8l10 6 10-6"/>
              </svg>
            </div>
          </div>

          <div data-ce-anim className="mb-2 text-center">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-[#d394ff]/70">Confirm your email</p>
          </div>
          <h1 data-ce-anim className="mb-3 text-center font-headline text-2xl font-bold tracking-tight text-[#e5e2e1]">
            Enter the code
          </h1>
          <p data-ce-anim className="mb-7 text-center text-sm text-[#adaaaa]/60 leading-relaxed">
            We sent a code to{' '}
            <span className="font-semibold text-[#e5e2e1]">{email}</span>.
          </p>

          <form data-ce-anim onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
            <div className="space-y-1.5">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={e => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (codeStatus === 'error') setCodeStatus('idle');
                }}
              onPaste={e => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                  setCode(pasted);
                  if (codeStatus === 'error') setCodeStatus('idle');
                }}
                disabled={loading}
                autoFocus
                className={`w-full rounded-[0.875rem] border bg-white/[0.03] px-4 py-4 text-center text-2xl font-bold tracking-[0.4em] placeholder:text-[#adaaaa]/20 placeholder:tracking-[0.4em] transition-all duration-300 focus:outline-none focus:ring-1 ${
                  codeStatus === 'error'
                    ? 'border-red-500/60 text-red-400 focus:border-red-500/60 focus:ring-red-500/20'
                    : 'border-[#494847]/30 text-[#e5e2e1] focus:border-[#d394ff]/40 focus:ring-[#d394ff]/20'
                }`}
              />
              {codeStatus === 'error' && (
                <p className="flex items-center justify-center gap-1.5 text-[0.8125rem] text-red-400">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Incorrect code — try again
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full rounded-2xl bg-[#d394ff] px-6 py-3.5 text-sm font-bold text-[#4a0076] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(211,148,255,0.28)] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? 'Verifying…' : 'Verify email'}
            </button>
          </form>

          {/* Resend */}
          <div data-ce-anim className="mt-5 space-y-2 text-center">
            <button
              type="button"
              onClick={() => { void handleResend(); }}
              disabled={resending || resendCooldown}
              className="text-[0.8125rem] text-[#adaaaa]/50 transition-colors hover:text-[#d394ff] disabled:opacity-40 disabled:pointer-events-none"
            >
              {resending ? 'Sending…' : resendCooldown ? 'Sent — try again in 60s' : "Didn't receive it? Resend"}
            </button>
            {resendMsg && (
              <p className="text-[0.8125rem] text-[#adaaaa]/50">{resendMsg}</p>
            )}
          </div>

          <p data-ce-anim className="mt-6 text-center text-[0.8125rem] text-[#adaaaa]/50">
            Wrong email?{' '}
            <Link to="/register" className="font-semibold text-[#d394ff] transition-colors hover:text-[#ebd6ff]">
              Start over
            </Link>
          </p>
        </div>

        {/* ── Success overlay ── */}
        <div ref={successRef} style={{ display: 'none' }} className="absolute inset-0 flex-col items-center justify-center p-10 text-center">
          <div className="mb-6">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle ref={checkCircleRef} cx="40" cy="40" r="36" stroke="#d394ff" strokeWidth="2.5" strokeLinecap="round" fill="rgba(211,148,255,0.06)" />
              <path ref={checkPathRef} d="M24 40.5L35 52L56 30" stroke="#d394ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p data-success-text className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-[#d394ff]/70">Code correct</p>
          <h2 data-success-text className="font-headline text-2xl font-bold tracking-tight text-[#e5e2e1]">Email verified!</h2>
          <p data-success-text className="mt-3 text-sm text-[#adaaaa]/60">Sending you to the dashboard…</p>
        </div>
      </div>
    </div>
  );
}
