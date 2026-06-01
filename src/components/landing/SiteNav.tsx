import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: reduced() ? 'auto' : 'smooth' });
}

function isLightBg(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

export default function SiteNav() {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [inHIW, setInHIW] = useState(false);
  const [hiwBg, setHiwBg] = useState('#F8FAFC');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onEnter = () => setInHIW(true);
    const onLeave = () => setInHIW(false);
    const onPanel = (e: Event) => setHiwBg((e as CustomEvent<string>).detail);
    window.addEventListener('hiw:enter', onEnter);
    window.addEventListener('hiw:leave', onLeave);
    window.addEventListener('hiw:panel', onPanel);
    return () => {
      window.removeEventListener('hiw:enter', onEnter);
      window.removeEventListener('hiw:leave', onLeave);
      window.removeEventListener('hiw:panel', onPanel);
    };
  }, []);

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: -48, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.05 },
      );
    });
    return () => ctx.revert();
  }, []);

  const lightPanel = isLightBg(hiwBg);
  const logoColor = inHIW ? (lightPanel ? '#0F172A' : '#F8FAFC') : '#0F172A';

  // Use scrolled layout when either truly scrolled or inside the how-it-works section
  const useScrolledLayout = scrolled || inHIW;

  const navBg = inHIW
    ? 'bg-transparent'
    : scrolled
      ? 'bg-[rgba(248,250,252,0.85)] backdrop-blur-xl shadow-[0_1px_0_rgba(15,23,42,0.06)]'
      : 'bg-transparent';

  return (
    <nav
      ref={ref}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-[background-color,box-shadow] duration-500 ${navBg}`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center h-16 relative">
        <div className={`transition-[transform] duration-200 ${useScrolledLayout ? 'absolute left-1/2 -translate-x-1/2' : ''}`}>
          {useScrolledLayout ? (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' })}
              style={{ color: logoColor, transition: 'color 0.4s' }}
              className="font-medium text-[18px] tracking-[-0.02em]"
            >
              Vielinks
            </button>
          ) : (
            <Link to="/" className="flex items-center">
              <span className="font-medium text-[18px] text-[#0F172A] tracking-[-0.02em]">Vielinks</span>
            </Link>
          )}
        </div>

        <div
          className={`flex gap-2 items-center ml-auto transition-opacity duration-200 ${
            useScrolledLayout ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <Link to="/login" className="inline-flex items-center text-[14px] font-medium text-[#334155] px-3 py-2.5 rounded-[10px] hover:bg-[#F1F5F9] active:scale-[0.97] transition-[background-color,transform] duration-150 sm:px-[18px]">
            Sign in
          </Link>
          <Link to="/register" className="inline-flex items-center text-[14px] font-medium bg-[#0F172A] text-[#F8FAFC] px-3 py-2.5 sm:px-[18px] rounded-[10px] hover:bg-[#334155] active:scale-[0.97] transition-[background-color,transform] duration-150">
            Start free
          </Link>
        </div>
      </div>
    </nav>
  );
}
