import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '../../hooks/useGSAP';

export default function LoginCard() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const containerRef = useGSAP<HTMLDivElement>(() => {
    gsap.to('[data-orb="1"]', {
      x: 14, y: -10, duration: 4.8, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });
    gsap.to('[data-orb="2"]', {
      x: -12, y: 9, duration: 5.4, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });

    gsap.set('[data-login-eyebrow]', { opacity: 0, y: 10 });
    gsap.set('[data-login-title]', { opacity: 0, y: 10 });
    gsap.set('[data-login-field]', { opacity: 0, y: 10 });
    gsap.set('[data-login-btn]', { opacity: 0, y: 10 });
    gsap.set('[data-login-footer]', { opacity: 0, y: 8 });

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.15 });

    tl.to('[data-login-eyebrow]', { opacity: 1, y: 0, duration: 0.38 })
      .to('[data-login-title]', { opacity: 1, y: 0, duration: 0.42 }, '-=0.22')
      .to('[data-login-field]', { opacity: 1, y: 0, duration: 0.35, stagger: 0.08 }, '-=0.2')
      .to('[data-login-btn]', { opacity: 1, y: 0, duration: 0.35 }, '-=0.12')
      .to('[data-login-footer]', { opacity: 1, y: 0, duration: 0.3 }, '-=0.14');
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0e0e0e] px-4 py-16"
    >
      {/* Ambient orbs */}
      <div data-orb="1" className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#d394ff]/10 blur-[120px]" />
      <div data-orb="2" className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-[#aa30fa]/10 blur-[100px]" />

      {/* Back button */}
      <a
        href="/"
        style={{ viewTransitionName: 'auth-back' }}
        className="absolute left-6 top-6 flex items-center gap-2 text-[0.8125rem] font-medium text-[#adaaaa]/60 transition-colors duration-300 hover:text-[#e5e2e1]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to home
      </a>

      {/* Card */}
      <div
        style={{ viewTransitionName: 'auth-card' }}
        className="relative w-full max-w-[440px] overflow-hidden rounded-[2rem] border border-[#494847]/20 bg-[#1a1919]/70 p-10 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
      >
        {/* Top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* Brand mark */}
        <div style={{ viewTransitionName: 'auth-brand' }} className="mb-8 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d394ff]/15">
            <div className="h-2.5 w-2.5 rounded-full bg-[#d394ff]" />
          </div>
          <span className="font-headline text-base font-bold tracking-tight text-[#e5e2e1]">
            Obsidian Lens
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8 space-y-2">
          <p data-login-eyebrow className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-[#d394ff]/70">
            Welcome back
          </p>
          <h1 data-login-title className="font-headline text-2xl font-bold tracking-tight text-[#e5e2e1]">
            Sign in to your account
          </h1>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div data-login-field className="space-y-2">
            <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#adaaaa]/60">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-[0.875rem] border border-[#494847]/30 bg-white/[0.03] px-4 py-3.5 text-sm text-[#e5e2e1] placeholder:text-[#adaaaa]/35 transition-all duration-300 focus:border-[#d394ff]/40 focus:outline-none focus:ring-1 focus:ring-[#d394ff]/20"
            />
          </div>

          <div data-login-field className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#adaaaa]/60">
                Password
              </label>
              <a href="#" className="text-[0.75rem] text-[#adaaaa]/50 transition-colors duration-300 hover:text-[#d394ff]">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full rounded-[0.875rem] border border-[#494847]/30 bg-white/[0.03] px-4 py-3.5 text-sm text-[#e5e2e1] placeholder:text-[#adaaaa]/35 transition-all duration-300 focus:border-[#d394ff]/40 focus:outline-none focus:ring-1 focus:ring-[#d394ff]/20"
            />
          </div>

          <button
            data-login-btn
            type="submit"
            className="mt-2 w-full rounded-2xl bg-[#d394ff] px-6 py-3.5 text-sm font-bold text-[#4a0076] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(211,148,255,0.28)] active:scale-[0.98]"
          >
            Sign in
          </button>
        </form>

        <p data-login-footer className="mt-6 text-center text-[0.8125rem] text-[#adaaaa]/50">
          Don't have an account?{' '}
          <Link
            to="/register"
            viewTransition
            className="font-semibold text-[#d394ff] transition-colors duration-300 hover:text-[#ebd6ff]"
          >
            Get started
          </Link>
        </p>
      </div>
    </div>
  );
}
