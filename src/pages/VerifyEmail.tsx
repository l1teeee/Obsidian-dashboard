import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useGSAP } from '../hooks/useGSAP';
import { useAuth } from '../hooks/useAuth';
import gsap from 'gsap';

type Status = 'verifying' | 'success' | 'error';

export default function VerifyEmail() {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const { verifyEmail } = useAuth();
  const token           = searchParams.get('token') ?? '';

  const [status,  setStatus]  = useState<Status>('verifying');
  const [errMsg,  setErrMsg]  = useState('');
  const destination           = useRef('/complete-profile');

  const containerRef = useGSAP<HTMLDivElement>(() => {
    gsap.set('[data-ve-anim]', { opacity: 0, y: 16 });
    gsap.to('[data-ve-anim]', {
      opacity: 1, y: 0,
      duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.1,
    });
  }, [status]);

  useEffect(() => {
    if (!token) {
      setErrMsg('No verification token found in the URL.');
      setStatus('error');
      return;
    }

    void verifyEmail(token)
      .then(({ profileCompleted }) => {
        destination.current = profileCompleted ? '/dashboard' : '/complete-profile';
        setStatus('success');
        setTimeout(() => navigate(destination.current, { replace: true }), 2200);
      })
      .catch((err: { message?: string }) => {
        setErrMsg(err.message ?? 'This link is invalid or has already been used.');
        setStatus('error');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div
      ref={containerRef}
      className="auth-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16"
    >
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#d394ff]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-[#aa30fa]/10 blur-[100px]" />

      <div className="relative w-full max-w-[400px] overflow-hidden rounded-[2rem] border border-[#494847]/20 bg-[#1a1919]/70 p-10 text-center shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* ── Verifying ── */}
        {status === 'verifying' && (
          <>
            <div data-ve-anim className="mb-6 flex justify-center">
              <svg className="animate-spin text-[#d394ff]" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity="0.4"/>
                <path d="M12 2v4" stroke="#d394ff" strokeOpacity="1"/>
              </svg>
            </div>
            <p data-ve-anim className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-[#d394ff]/70 mb-2">Please wait</p>
            <h1 data-ve-anim className="font-headline text-xl font-bold tracking-tight text-[#e5e2e1]">Verifying your email…</h1>
          </>
        )}

        {/* ── Success ── */}
        {status === 'success' && (
          <>
            <div data-ve-anim className="mb-6 flex justify-center">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#d394ff" strokeWidth="2" fill="rgba(211,148,255,0.06)"/>
                <path d="M19 32L28 42L45 24" stroke="#d394ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p data-ve-anim className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-[#d394ff]/70 mb-2">Confirmed</p>
            <h1 data-ve-anim className="font-headline text-2xl font-bold tracking-tight text-[#e5e2e1] mb-3">Email verified!</h1>
            <p data-ve-anim className="text-sm text-[#adaaaa]/60">Redirecting you in a moment…</p>
          </>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
          <>
            <div data-ve-anim className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
            </div>
            <p data-ve-anim className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-red-400/70 mb-2">Invalid link</p>
            <h1 data-ve-anim className="font-headline text-xl font-bold tracking-tight text-[#e5e2e1] mb-3">Verification failed</h1>
            <p data-ve-anim className="text-sm text-[#adaaaa]/60 mb-7">{errMsg}</p>
            <div data-ve-anim className="space-y-3">
              <Link
                to="/register"
                className="block w-full rounded-2xl bg-[#d394ff] px-6 py-3 text-sm font-bold text-[#4a0076] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(211,148,255,0.28)]"
              >
                Create a new account
              </Link>
              <Link
                to="/login"
                className="block w-full rounded-2xl border border-[#494847]/30 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-[#e5e2e1] transition-all duration-200 hover:border-[#d394ff]/30 hover:bg-[#d394ff]/5 hover:text-[#d394ff]"
              >
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
