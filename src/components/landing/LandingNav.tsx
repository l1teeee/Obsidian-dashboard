import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useFadeNav } from '@/hooks/useFadeNav';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const links = ['Platform', 'Analytics', 'Showcase', 'Pricing'];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const fadeNav = useFadeNav();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useLayoutEffect(() => {
    if (!navRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('[data-nav="inner"]', { opacity: 1, y: 0 });
      gsap.set('[data-nav="logo"],[data-nav="link"],[data-nav="actions"]', { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.fromTo('[data-nav="inner"]',   { opacity: 0, y: -10, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5 })
        .fromTo('[data-nav="logo"]',    { opacity: 0, y: -8,  filter: 'blur(8px)'  }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.35 }, '-=0.28')
        .fromTo('[data-nav="link"]',    { opacity: 0, y: -8,  filter: 'blur(6px)'  }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.28, stagger: 0.05 }, '-=0.18')
        .fromTo('[data-nav="actions"]', { opacity: 0, y: -6,  filter: 'blur(6px)'  }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.3 }, '-=0.16');
    }, navRef);
    return () => ctx.revert();
  }, []);

  const handleScrollTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    gsap.to(window, { duration: 1.2, ease: 'power3.inOut', scrollTo: { y: target, offsetY: 96 } });
  };

  return (
    <nav ref={navRef} className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
      <div
        data-nav="inner"
        style={{ opacity: 0 }}
        className={`pointer-events-auto relative flex items-center justify-between gap-10 px-6 py-3 rounded-full border transition-all duration-500 ${
          scrolled
            ? 'bg-white/[0.07] backdrop-blur-2xl border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'bg-white/[0.05] backdrop-blur-xl border-white/[0.14] shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
        }`}
      >
        <a href="#" data-nav="logo" style={{ opacity: 0 }} className="flex items-center">
          <img src="/favicon.svg" alt="Vielinks" className="h-8 w-8" />
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map(link => (
            <a
              key={link}
              data-nav="link"
              href={`#${link}`}
              onClick={handleScrollTo(link)}
              style={{ opacity: 0 }}
              className="group relative text-[0.7rem] tracking-[0.12em] uppercase font-medium text-[#adaaaa] transition-colors duration-300 hover:text-[#f3e6ff]"
            >
              <span>{link}</span>
              <span className="absolute left-0 top-full mt-1 h-px w-0 bg-[#d394ff] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div data-nav="actions" style={{ opacity: 0 }} className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => fadeNav('/login')}
            className="rounded-full border border-white/[0.10] bg-white/[0.03] px-4 py-2 text-[0.65rem] tracking-[0.1em] uppercase font-semibold text-white/60 backdrop-blur-xl hover:border-[#d394ff]/30 hover:text-[#d394ff] transition-all duration-300"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => fadeNav('/register')}
            className="rounded-full bg-[#d394ff] px-4 py-2 text-[0.65rem] tracking-[0.1em] uppercase font-bold text-[#4a0076] shadow-[0_0_20px_rgba(211,148,255,0.2)] hover:shadow-[0_0_32px_rgba(211,148,255,0.35)] transition-all duration-300"
          >
            Get started
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
          className="flex h-8 w-8 items-center justify-center text-white/60 transition-colors hover:text-white md:hidden"
        >
          {mobileOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="2" y1="2" x2="16" y2="16" /><line x1="16" y1="2" x2="2" y2="16" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="2" y1="5" x2="16" y2="5" /><line x1="2" y1="9" x2="16" y2="9" /><line x1="2" y1="13" x2="16" y2="13" />
            </svg>
          )}
        </button>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/[0.10] bg-[#0e0e0e]/95 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] py-3 px-3 md:hidden">
            <div className="flex flex-col gap-1 mb-3">
              {links.map(link => (
                <a
                  key={link}
                  href={`#${link}`}
                  onClick={handleScrollTo(link)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  {link}
                </a>
              ))}
            </div>
            <div className="border-t border-white/[0.06] pt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => { setMobileOpen(false); fadeNav('/login'); }}
                className="w-full rounded-xl border border-white/[0.10] bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/60 transition-all hover:border-[#d394ff]/30 hover:text-[#d394ff]"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => { setMobileOpen(false); fadeNav('/register'); }}
                className="w-full rounded-xl bg-[#d394ff] px-4 py-2.5 text-sm font-bold text-[#4a0076] transition-all hover:shadow-[0_0_24px_rgba(211,148,255,0.3)]"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
