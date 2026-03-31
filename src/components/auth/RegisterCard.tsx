import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '../../hooks/useGSAP';
import { useAuth } from '../../hooks/useAuth';

// ─── Eye icon ─────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterCard() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [confirm,     setConfirm]     = useState('');
  const [error,       setError]       = useState<string | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength
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

  // Refs
  const cardRef        = useRef<HTMLDivElement>(null);
  const formRef        = useRef<HTMLDivElement>(null);
  const step1Ref       = useRef<HTMLDivElement>(null);
  const step2Ref       = useRef<HTMLDivElement>(null);
  const successRef     = useRef<HTMLDivElement>(null);
  const checkCircleRef = useRef<SVGCircleElement>(null);
  const checkPathRef   = useRef<SVGPathElement>(null);
  const destination    = useRef('/create-workspace');

  // ── Entrance animation (step 1) ────────────────────────────────────────────
  const containerRef = useGSAP<HTMLDivElement>(() => {
    gsap.to('[data-orb="1"]', { x: 14, y: -10, duration: 4.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('[data-orb="2"]', { x: -12, y: 9,  duration: 5.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    gsap.set('[data-s1-eyebrow]', { opacity: 0, y: 10 });
    gsap.set('[data-s1-title]',   { opacity: 0, y: 10 });
    gsap.set('[data-s1-btn]',     { opacity: 0, y: 10 });
    gsap.set('[data-s1-footer]',  { opacity: 0, y: 8  });

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.15 });
    tl.to('[data-s1-eyebrow]', { opacity: 1, y: 0, duration: 0.38 })
      .to('[data-s1-title]',   { opacity: 1, y: 0, duration: 0.42 }, '-=0.22')
      .to('[data-s1-btn]',     { opacity: 1, y: 0, duration: 0.32, stagger: 0.07 }, '-=0.2')
      .to('[data-s1-footer]',  { opacity: 1, y: 0, duration: 0.3  }, '-=0.1');
  }, []);

  // ── Step transitions ───────────────────────────────────────────────────────
  const goToEmail = () => {
    const s1   = step1Ref.current;
    const s2   = step2Ref.current;
    const card = cardRef.current;
    if (!s1 || !s2 || !card) return;

    // Lock current height so the card doesn't jump
    gsap.set(card, { height: card.offsetHeight });

    gsap.to(s1, {
      opacity: 0, y: -14, duration: 0.22, ease: 'power2.in',
      onComplete: () => {
        gsap.set(s1, { display: 'none' });
        gsap.set(s2, { display: 'block', opacity: 0, y: 18 });
        // Animate height to fit new content, then release to auto
        gsap.to(card, { height: 'auto', duration: 0.32, ease: 'power2.inOut' });
        gsap.to(s2,   { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' });
      },
    });
  };

  const goToMethod = () => {
    const s1   = step1Ref.current;
    const s2   = step2Ref.current;
    const card = cardRef.current;
    if (!s1 || !s2 || !card) return;
    setError(null);

    gsap.set(card, { height: card.offsetHeight });

    gsap.to(s2, {
      opacity: 0, y: -14, duration: 0.22, ease: 'power2.in',
      onComplete: () => {
        gsap.set(s2, { display: 'none' });
        gsap.set(s1, { display: 'block', opacity: 0, y: 14 });
        gsap.to(card, { height: 'auto', duration: 0.32, ease: 'power2.inOut' });
        gsap.to(s1,   { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' });
      },
    });
  };

  // ── Success animation ──────────────────────────────────────────────────────
  const playSuccess = (dest: string) => {
    destination.current = dest;
    setSuccess(true);

    requestAnimationFrame(() => {
      const form    = formRef.current;
      const success = successRef.current;
      const card    = cardRef.current;
      // Release any locked height before the success animation
      if (card) gsap.set(card, { height: 'auto' });
      const circle  = checkCircleRef.current;
      const path    = checkPathRef.current;
      if (!form || !success || !card || !circle || !path) return;

      gsap.set(success, { opacity: 0, scale: 0.88, display: 'flex' });

      const circleLen = circle.getTotalLength?.() ?? 163;
      const pathLen   = path.getTotalLength?.() ?? 30;
      gsap.set(circle, { strokeDasharray: circleLen, strokeDashoffset: circleLen });
      gsap.set(path,   { strokeDasharray: pathLen,   strokeDashoffset: pathLen   });

      const tl = gsap.timeline({ onComplete: () => { navigate(destination.current); } });
      tl.to(form,    { opacity: 0, y: -12, duration: 0.3, ease: 'power2.in' })
        .to(card,    { scale: 0.97, duration: 0.25, ease: 'power2.in' }, '<')
        .to(card,    { scale: 1, duration: 0.45, ease: 'back.out(1.8)' })
        .to(success, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }, '-=0.3')
        .to('[data-orb="1"]', { opacity: 1, scale: 1.3, duration: 0.6, ease: 'power2.out' }, '-=0.2')
        .to('[data-orb="2"]', { opacity: 1, scale: 1.3, duration: 0.6, ease: 'power2.out' }, '<')
        .to(circle,  { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }, '-=0.3')
        .to(path,    { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, '-=0.1')
        .to('[data-check-icon]', { filter: 'drop-shadow(0 0 18px rgba(211,148,255,0.9))', duration: 0.4, ease: 'power2.out' }, '-=0.1')
        .from('[data-success-text]', { opacity: 0, y: 10, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, '-=0.2')
        .to({}, { duration: 1.2 });
    });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pwAllMet)            { setError('Password does not meet all requirements'); return; }
    if (password !== confirm)  { setError('Passwords do not match'); return; }

    setLoading(true);
    try {
      const result = await register(email, password);
      navigate('/check-email', { state: { email: result.email, devVerifyToken: result.devVerifyToken } });
    } catch (err) {
      const code = (err as { code?: string }).code;
      setError(code === 'EMAIL_ALREADY_EXISTS'
        ? 'This email is already registered'
        : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="auth-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16"
    >
      {/* Ambient orbs */}
      <div data-orb="1" className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#d394ff]/10 blur-[120px]" />
      <div data-orb="2" className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-[#aa30fa]/10 blur-[100px]" />


      {/* Card */}
      <div
        ref={cardRef}
        style={{ viewTransitionName: 'auth-card' }}
        className="relative w-full max-w-[440px] overflow-hidden rounded-[2rem] border border-[#494847]/20 bg-[#1a1919]/70 p-10 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* ── Form wrapper (hidden during success) ── */}
        <div ref={formRef} style={{ display: success ? 'none' : 'block' }}>

          {/* ── Step 1: method selection ── */}
          <div ref={step1Ref}>
            <div style={{ viewTransitionName: 'auth-brand' }} className="mb-8 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d394ff]/15">
                <div className="h-2.5 w-2.5 rounded-full bg-[#d394ff]" />
              </div>
              <span className="font-headline text-base font-bold tracking-tight text-[#e5e2e1]">Vielinks</span>
            </div>

            <div className="mb-8 space-y-2">
              <p data-s1-eyebrow className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-[#d394ff]/70">Get started</p>
              <h1 data-s1-title className="font-headline text-2xl font-bold tracking-tight text-[#e5e2e1]">Create your account</h1>
              <p data-s1-title className="text-sm text-[#adaaaa]/50">Join Vielinks and start managing your social media.</p>
            </div>

            <div className="space-y-3">
              {/* Google */}
              <button
                data-s1-btn type="button" disabled title="Coming soon"
                className="w-full flex items-center justify-center gap-3 rounded-[0.875rem] border border-[#494847]/30 bg-white/[0.03] px-4 py-3 text-sm font-medium text-[#e5e2e1]/60 cursor-not-allowed opacity-50 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
                <span className="ml-auto text-[0.65rem] font-semibold uppercase tracking-wider text-[#adaaaa]/30">Soon</span>
              </button>

              {/* Facebook */}
              <button
                data-s1-btn type="button" disabled title="Coming soon"
                className="w-full flex items-center justify-center gap-3 rounded-[0.875rem] border border-[#494847]/30 bg-white/[0.03] px-4 py-3 text-sm font-medium text-[#e5e2e1]/60 cursor-not-allowed opacity-50 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
                <span className="ml-auto text-[0.65rem] font-semibold uppercase tracking-wider text-[#adaaaa]/30">Soon</span>
              </button>

              {/* Divider */}
              <div data-s1-btn className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-[#494847]/20" />
                <span className="text-[0.6875rem] font-medium text-[#adaaaa]/30 uppercase tracking-widest">or</span>
                <div className="h-px flex-1 bg-[#494847]/20" />
              </div>

              {/* Continue with email */}
              <button
                data-s1-btn type="button"
                onClick={goToEmail}
                className="w-full flex items-center justify-center gap-2.5 rounded-[0.875rem] border border-[#494847]/30 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-[#e5e2e1] transition-all duration-200 hover:border-[#d394ff]/30 hover:bg-[#d394ff]/5 hover:text-[#d394ff]"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="3"/>
                  <path d="M2 8l10 6 10-6"/>
                </svg>
                Continue with email
              </button>
            </div>

            <p data-s1-footer className="mt-7 text-center text-[0.8125rem] text-[#adaaaa]/50">
              Already have an account?{' '}
              <Link to="/login" viewTransition className="font-semibold text-[#d394ff] transition-colors duration-300 hover:text-[#ebd6ff]">
                Sign in
              </Link>
            </p>
          </div>

          {/* ── Step 2: email + password form ── */}
          <div ref={step2Ref} style={{ display: 'none' }}>
            {/* Back to methods */}
            <button
              type="button"
              onClick={goToMethod}
              className="mb-6 flex items-center gap-1.5 text-[0.8125rem] font-medium text-[#adaaaa]/50 transition-colors hover:text-[#e5e2e1]"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>

            <div className="mb-7 space-y-1">
              <h2 className="font-headline text-xl font-bold tracking-tight text-[#e5e2e1]">Create with email</h2>
              <p className="text-sm text-[#adaaaa]/50">Enter your email and choose a strong password.</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => { void handleSubmit(e); }}>
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#adaaaa]/60">Email</label>
                <input
                  type="email" placeholder="you@example.com" required autoComplete="email" autoFocus
                  value={email} onChange={e => setEmail(e.target.value)} disabled={loading}
                  className="w-full rounded-[0.875rem] border border-[#494847]/30 bg-white/[0.03] px-4 py-3.5 text-sm text-[#e5e2e1] placeholder:text-[#adaaaa]/35 transition-all duration-300 focus:border-[#d394ff]/40 focus:outline-none focus:ring-1 focus:ring-[#d394ff]/20"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#adaaaa]/60">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} placeholder="••••••••••••" required autoComplete="new-password"
                    value={password} onChange={e => setPassword(e.target.value)} disabled={loading}
                    onCopy={e => e.preventDefault()}
                    className="w-full rounded-[0.875rem] border border-[#494847]/30 bg-white/[0.03] px-4 py-3.5 pr-11 text-sm text-[#e5e2e1] placeholder:text-[#adaaaa]/35 transition-all duration-300 focus:border-[#d394ff]/40 focus:outline-none focus:ring-1 focus:ring-[#d394ff]/20"
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#adaaaa]/40 transition-colors duration-200 hover:text-[#d394ff]">
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>

              {/* Strength bar + checklist */}
              {password.length > 0 && (
                <div className="space-y-2.5">
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

              {/* Confirm password */}
              <div className="space-y-2">
                <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#adaaaa]/60">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'} placeholder="••••••••••••" required autoComplete="new-password"
                    value={confirm} onChange={e => setConfirm(e.target.value)} disabled={loading}
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
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-[0.8125rem] text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit" disabled={loading || !pwAllMet || password !== confirm}
                className="mt-2 w-full rounded-2xl bg-[#d394ff] px-6 py-3.5 text-sm font-bold text-[#4a0076] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(211,148,255,0.28)] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-center text-[0.8125rem] text-[#adaaaa]/50">
              Already have an account?{' '}
              <Link to="/login" viewTransition className="font-semibold text-[#d394ff] transition-colors duration-300 hover:text-[#ebd6ff]">
                Sign in
              </Link>
            </p>
          </div>

        </div>{/* /formRef */}

        {/* ── Success state ── */}
        <div ref={successRef} style={{ display: 'none' }} className="flex-col items-center justify-center py-6 text-center">
          <div data-check-icon className="mb-6">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle ref={checkCircleRef} cx="40" cy="40" r="36" stroke="#d394ff" strokeWidth="2.5" strokeLinecap="round" fill="rgba(211,148,255,0.06)" />
              <path ref={checkPathRef} d="M24 40.5L35 52L56 30" stroke="#d394ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p data-success-text className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-[#d394ff]/70">Account created</p>
          <h2 data-success-text className="font-headline text-2xl font-bold tracking-tight text-[#e5e2e1]">You're in!</h2>
          <p data-success-text className="mt-3 text-sm text-[#adaaaa]/60">Setting up your workspace…</p>
        </div>
      </div>
    </div>
  );
}
