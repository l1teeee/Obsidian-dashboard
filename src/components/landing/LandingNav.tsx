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
    gsap.set('[data-nav="inner"],[data-nav="logo"],[data-nav="link"],[data-nav="actions"]', {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
    });
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
        className={`pointer-events-auto relative flex items-center justify-between gap-10 px-6 py-3 rounded-full border transition-all duration-500 ${
          scrolled
            ? 'bg-white/75 backdrop-blur-xl border-[rgba(24,17,31,0.10)] shadow-[0_8px_28px_rgba(24,17,31,0.06)]'
            : 'bg-[#FFFFFF] border-[rgba(24,17,31,0.12)] shadow-[0_2px_12px_rgba(24,17,31,0.05)]'
        }`}
      >
        <a
          href="/"
          data-nav="logo"
          aria-label="Vielinks home"
          className="flex items-center gap-2.5"
        >
          <img src="/favicon.png" alt="Vielinks" className="h-8 w-8 object-contain" />
          <span className="hidden text-sm font-extrabold tracking-tight text-[#18111F] sm:inline">Vielinks</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {/* Product dropdown */}
          <div className="relative" data-nav="link">
            <button
              onClick={() => setProductOpen(v => !v)}
              onBlur={() => setTimeout(() => setProductOpen(false), 150)}
              className={`group flex items-center gap-1 text-[0.7rem] tracking-[0.12em] uppercase font-medium transition-colors duration-300 ${productOpen ? 'text-[#7C3AED]' : 'text-[#71657E] hover:text-[#18111F]'}`}
            >
              Product
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                className={`transition-transform duration-200 ${productOpen ? 'rotate-180' : ''}`}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {productOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 rounded-2xl border border-[rgba(24,17,31,0.14)] bg-[#FFFFFF] shadow-[0_8px_32px_rgba(24,17,31,0.12)] py-2 px-2 z-50">
                {PRODUCT_LINKS.map(l => (
                  <button
                    key={l.label}
                    onClick={() => { setProductOpen(false); navigate(l.route); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[0.75rem] font-medium text-[#71657E] hover:bg-[#F1ECFA] hover:text-[#18111F] transition-all text-left"
                  >
                    <span className="material-symbols-outlined text-[#7C3AED]" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>{l.icon}</span>
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
              className="group relative text-[0.7rem] tracking-[0.12em] uppercase font-medium text-[#71657E] transition-colors duration-300 hover:text-[#18111F]"
            >
              <span>{link}</span>
              <span className="absolute left-0 top-full mt-1 h-px w-0 bg-[#7C3AED] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div data-nav="actions" className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => fadeNav('/login')}
            className="rounded-full border border-[#CDB9DF] bg-[#FFFFFF] px-4 py-2 text-[0.65rem] tracking-[0.1em] uppercase font-semibold text-[#4A4057] hover:bg-[#ECE4F8] transition-all duration-300"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => fadeNav('/register')}
            className="rounded-full bg-[#7C3AED] px-4 py-2 text-[0.65rem] tracking-[0.1em] uppercase font-bold text-white hover:bg-[#6D28D9] transition-all duration-300"
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
          className="flex h-8 w-8 items-center justify-center text-[#71657E] transition-colors hover:text-[#18111F] md:hidden"
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
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-[rgba(24,17,31,0.14)] bg-[#FFFFFF] shadow-[0_8px_32px_rgba(24,17,31,0.12)] py-3 px-3 md:hidden">
            <div className="flex flex-col gap-1 mb-3">
              <p className="px-3 pt-1 pb-0.5 text-[9px] font-bold uppercase tracking-widest text-[#AA9AB8]">Product</p>
              {PRODUCT_LINKS.map(l => (
                <button
                  key={l.label}
                  onClick={() => { setMobileOpen(false); navigate(l.route); }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#71657E] transition-colors hover:bg-[#F1ECFA] hover:text-[#18111F] text-left"
                >
                  <span className="material-symbols-outlined text-[#7C3AED]" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>{l.icon}</span>
                  {l.label}
                </button>
              ))}
              <div className="h-px bg-[rgba(24,17,31,0.10)] my-1 mx-2" />
              {SCROLL_LINKS.map(link => (
                <a
                  key={link}
                  href={`#${link}`}
                  onClick={handleScrollTo(link)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-[#71657E] transition-colors hover:bg-[#F1ECFA] hover:text-[#18111F]"
                >
                  {link}
                </a>
              ))}
            </div>
            <div className="border-t border-[rgba(24,17,31,0.12)] pt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => { setMobileOpen(false); fadeNav('/login'); }}
                className="w-full rounded-xl border border-[#CDB9DF] bg-[#FFFFFF] px-4 py-2.5 text-sm font-semibold text-[#4A4057] transition-all hover:bg-[#ECE4F8]"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => { setMobileOpen(false); fadeNav('/register'); }}
                className="w-full rounded-xl bg-[#7C3AED] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#6D28D9]"
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
