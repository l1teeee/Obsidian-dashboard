import { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SparklesCore } from '@/components/ui/sparkles';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  Product: ['Dashboard', 'Analytics', 'Scheduler', 'AI Insights', 'Integrations'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Security', 'API Status'],
};

const socialLinks = [
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

export default function ObsidianFooter() {
  const footerRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo('[data-ft="hero"]',
        { opacity: 0, y: 24, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 }
      )
      .fromTo('[data-ft="links"]',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55 },
        '-=0.4'
      )
      .fromTo('[data-ft="bottom"]',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.25'
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-[#030303]">
      {/* Top separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d394ff]/15 to-transparent" />

      {/* ── Hero sparkles band ──────────────────────────────── */}
      <div
        data-ft="hero"
        style={{ opacity: 0 }}
        className="relative flex flex-col items-center justify-center overflow-hidden border-b border-white/[0.05] py-28 md:py-36"
      >
        {/* Particles layer */}
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            id="footer-sparkles"
            background="transparent"
            minSize={0.4}
            maxSize={1.4}
            particleDensity={80}
            className="w-full h-full"
            particleColor="#d394ff"
            speed={1.2}
          />
        </div>

        {/* Radial mask so sparkles fade at the edges */}
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_50%,transparent_30%,black_100%)] bg-[#030303]" />

        {/* Gradient line above wordmark */}

        {/* Wordmark */}
        <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d394ff]/30 bg-[#d394ff]/10">
              <div className="h-4 w-4 rounded-full bg-[#d394ff]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">Vielinks</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-white md:text-6xl lg:text-7xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60">
              Social media,
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#c97cff] via-[#f0dcff] to-[#aa30fa]">
              mastered.
            </span>
          </h2>

          <p className="max-w-md text-[1rem] font-light leading-[1.8] text-white/35">
            One platform to plan, publish, analyze, and grow your social presence across Instagram, LinkedIn, and Facebook.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate('/register')}
              className="group relative overflow-hidden rounded-full bg-[#d394ff] px-8 py-3.5 text-sm font-bold text-[#3a0060] transition-all duration-300 hover:shadow-[0_0_44px_rgba(211,148,255,0.45)]"
            >
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#d394ff] to-[#f0dcff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="rounded-full border border-white/[0.10] bg-white/[0.03] px-8 py-3.5 text-sm font-medium text-white/45 backdrop-blur-xl hover:border-[#d394ff]/25 hover:text-white/65 transition-all duration-300"
            >
              Sign In
            </button>
          </div>

          <p className="text-[0.7rem] text-white/18 tracking-wide">
            14-day free trial · No credit card required
          </p>
        </div>
      </div>

      {/* ── Links + brand ──────────────────────────────────── */}
      <div
        data-ft="links"
        style={{ opacity: 0 }}
        className="mx-auto max-w-[1440px] px-6 py-16 md:px-12"
      >
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1fr_auto_auto_auto] md:gap-16 lg:gap-24">
          {/* Brand column */}
          <div className="col-span-2 flex flex-col gap-6 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-[#d394ff]/25 bg-[#d394ff]/10">
                <div className="h-2.5 w-2.5 rounded-full bg-[#d394ff]" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-white">Vielinks</span>
            </div>
            <p className="max-w-[240px] text-[0.82rem] leading-[1.75] text-white/30">
              The unified command center for social media teams. Built for brands that publish with intention.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/30 transition-all duration-300 hover:border-[#d394ff]/30 hover:bg-[#d394ff]/[0.07] hover:text-[#d394ff]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-5">
              <h6 className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/25">
                {section}
              </h6>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[0.85rem] text-white/35 transition-colors duration-300 hover:text-[#d394ff]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────── */}
      <div
        data-ft="bottom"
        style={{ opacity: 0 }}
        className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 border-t border-white/[0.04] px-6 py-6 md:flex-row md:px-12"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.14em] text-white/18">
            All systems operational
          </span>
          <span className="text-white/10">·</span>
          <span className="text-[0.65rem] uppercase tracking-[0.14em] text-white/18">
            © {new Date().getFullYear()} Vielinks, Inc.
          </span>
        </div>

        <div className="flex gap-5">
          {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[0.65rem] uppercase tracking-[0.12em] text-white/18 transition-colors duration-300 hover:text-[#d394ff]"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
