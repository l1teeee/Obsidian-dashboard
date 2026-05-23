import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function SiteNav() {
  const ref   = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { y: -48, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.05 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={ref}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-[background-color,box-shadow] duration-200 ${
        scrolled
          ? 'bg-[rgba(248,250,252,0.85)] backdrop-blur-xl shadow-[0_1px_0_rgba(15,23,42,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center h-16 relative">
        {/* Vielinks — left when not scrolled, centered when scrolled */}
        <div className={`transition-[transform] duration-200 ${scrolled ? 'absolute left-1/2 -translate-x-1/2' : ''}`}>
          {scrolled ? (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' })}
              className="font-medium text-[18px] text-[#0F172A] tracking-[-0.02em]"
            >
              Vielinks
            </button>
          ) : (
            <Link to="/" className="flex items-center">
              <span className="font-medium text-[18px] text-[#0F172A] tracking-[-0.02em]">Vielinks</span>
            </Link>
          )}
        </div>

        {/* Buttons — hidden when scrolled */}
        <div
          className={`flex gap-2 items-center ml-auto transition-opacity duration-200 ${
            scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <Link to="/login"    className="inline-flex items-center text-[14px] font-medium text-[#334155] px-3 py-2.5 rounded-[10px] hover:bg-[#F1F5F9] active:scale-[0.97] transition-[background-color,transform] duration-150 sm:px-[18px]">Sign in</Link>
          <Link to="/register" className="hidden items-center text-[14px] font-medium bg-[#0F172A] text-[#F8FAFC] px-[18px] py-2.5 rounded-[10px] hover:bg-[#334155] active:scale-[0.97] transition-[background-color,transform] duration-150 sm:inline-flex">Start free</Link>
        </div>
      </div>
    </nav>
  );
}
