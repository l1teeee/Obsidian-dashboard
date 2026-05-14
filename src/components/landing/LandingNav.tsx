import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useFadeNav } from '@/hooks/useFadeNav';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const SCROLL_LINKS = ['Showcase', 'Pricing'];

const PRODUCT_LINKS = [
  { label: 'Dashboard',    icon: 'dashboard',   route: '/product/dashboard'    },
  { label: 'Analytics',    icon: 'monitoring',  route: '/product/analytics'    },
  { label: 'Scheduler',    icon: 'calendar_month', route: '/product/scheduler' },
  { label: 'AI Insights',  icon: 'auto_awesome', route: '/product/ai-insights' },
  { label: 'Integrations', icon: 'hub',         route: '/product/integrations' },
];

export default function LandingNav() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [productOpen,  setProductOpen]  = useState(false);
  const navRef    = useRef<HTMLElement>(null);
  const fadeNav   = useFadeNav();
  const navigate  = useNavigate();

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
        <a
          href="/"
          data-nav="logo"
          style={{ opacity: 0 }}
          aria-label="Vielinks home"
          className="flex items-center"
        >
          <img src="/favicon.png" alt="Vielinks" className="h-8 w-8 object-contain" />
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {/* Product dropdown */}
          <div className="relative" data-nav="link" style={{ opacity: 0 }}>
            <button
              onClick={() => setProductOpen(v => !v)}
              onBlur={() => setTimeout(() => setProductOpen(false), 150)}
              className={`group flex items-center gap-1 text-[0.7rem] tracking-[0.12em] uppercase font-medium transition-colors duration-300 ${productOpen ? 'text-[#7DD3C7]' : 'text-[#6A6470] hover:text-[#1C1814]'}`}
            >
              Product
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                className={`transition-transform duration-200 ${productOpen ? 'rotate-180' : ''}`}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {productOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 rounded-2xl border border-white/[0.10] bg-[#F4F0E8]/95 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] py-2 px-2 z-50">
                {PRODUCT_LINKS.map(l => (
                  <button
                    key={l.label}
                    onClick={() => { setProductOpen(false); navigate(l.route); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[0.75rem] font-medium text-[#1C1814]/60 hover:bg-white/[0.05] hover:text-[#1C1814] transition-all text-left"
                  >
                    <span className="material-symbols-outlined text-[#7DD3C7]" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>{l.icon}</span>
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {SCROLL_LINKS.map(link => (
            <a
              key={link}
              data-nav="link"
              href={`#${link}`}
              onClick={handleScrollTo(link)}
              style={{ opacity: 0 }}
              className="group relative text-[0.7rem] tracking-[0.12em] uppercase font-medium text-[#6A6470] transition-colors duration-300 hover:text-[#1C1814]"
            >
              <span>{link}</span>
              <span className="absolute left-0 top-full mt-1 h-px w-0 bg-[#7DD3C7] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div data-nav="actions" style={{ opacity: 0 }} className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => fadeNav('/login')}
            className="rounded-full border border-white/[0.10] bg-[#1C1814]/[0.05] px-4 py-2 text-[0.65rem] tracking-[0.1em] uppercase font-semibold text-[#1C1814]/60 backdrop-blur-xl hover:border-[#7DD3C7]/30 hover:text-[#7DD3C7] transition-all duration-300"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => fadeNav('/register')}
            className="rounded-full bg-[#1C1814] px-4 py-2 text-[0.65rem] tracking-[0.1em] uppercase font-bold text-[#F4F0E8] shadow-[0_0_20px_rgba(125,211,199,0.28)] hover:shadow-[0_0_32px_rgba(125,211,199,0.28)] transition-all duration-300"
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
          className="flex h-8 w-8 items-center justify-center text-[#1C1814]/60 transition-colors hover:text-[#1C1814] md:hidden"
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
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/[0.10] bg-[#F4F0E8]/95 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] py-3 px-3 md:hidden">
            <div className="flex flex-col gap-1 mb-3">
              <p className="px-3 pt-1 pb-0.5 text-[9px] font-bold uppercase tracking-widest text-[#1C1814]/25">Product</p>
              {PRODUCT_LINKS.map(l => (
                <button
                  key={l.label}
                  onClick={() => { setMobileOpen(false); navigate(l.route); }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1C1814]/60 transition-colors hover:bg-white/[0.05] hover:text-[#1C1814] text-left"
                >
                  <span className="material-symbols-outlined text-[#7DD3C7]" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>{l.icon}</span>
                  {l.label}
                </button>
              ))}
              <div className="h-px bg-[#1C1814]/[0.05] my-1 mx-2" />
              {SCROLL_LINKS.map(link => (
                <a
                  key={link}
                  href={`#${link}`}
                  onClick={handleScrollTo(link)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-[#1C1814]/60 transition-colors hover:bg-white/[0.05] hover:text-[#1C1814]"
                >
                  {link}
                </a>
              ))}
            </div>
            <div className="border-t border-white/[0.06] pt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => { setMobileOpen(false); fadeNav('/login'); }}
                className="w-full rounded-xl border border-white/[0.10] bg-[#1C1814]/[0.05] px-4 py-2.5 text-sm font-semibold text-[#1C1814]/60 transition-all hover:border-[#7DD3C7]/30 hover:text-[#7DD3C7]"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => { setMobileOpen(false); fadeNav('/register'); }}
                className="w-full rounded-xl bg-[#1C1814] px-4 py-2.5 text-sm font-bold text-[#F4F0E8] transition-all hover:shadow-[0_0_24px_rgba(125,211,199,0.28)]"
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
