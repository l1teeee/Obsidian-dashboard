import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useLayout } from '../../contexts/LayoutContext';

const NAV_ITEMS = [
  { to: '/dashboard', icon: 'dashboard',     label: 'Dashboard' },
  { to: '/posts',     icon: 'article',        label: 'Posts' },
  { to: '/calendar',  icon: 'calendar_month', label: 'Calendar' },
  { to: '/analytics', icon: 'monitoring',    label: 'Analytics' },
  { to: '/platforms', icon: 'hub',           label: 'Platforms' },
];

export default function Sidebar() {
  const { isOpen, toggle } = useLayout();
  const navigate    = useNavigate();
  const brandRef    = useRef<HTMLDivElement>(null);
  const navRefs     = useRef<(HTMLAnchorElement | null)[]>([]);
  const bottomRef   = useRef<HTMLDivElement>(null);   // used for GSAP + click-outside
  const [menuOpen, setMenuOpen] = useState(false);

  // Entrance animation — desktop only
  useEffect(() => {
    if (window.innerWidth < 1024) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(brandRef.current,
      { y: -10, opacity: 0 },
      { y: 0,   opacity: 1, duration: 0.45 },
    )
    .fromTo(
      navRefs.current.filter(Boolean),
      { x: -20, opacity: 0 },
      { x: 0,   opacity: 1, duration: 0.4, stagger: 0.055 },
      '-=0.2',
    )
    .fromTo(bottomRef.current,
      { y: 10, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.4 },
      '-=0.15',
    );
    return () => { tl.kill(); };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (bottomRef.current && !bottomRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    navigate('/login');
  };

  const handleMenuNav = (to: string) => {
    setMenuOpen(false);
    if (window.innerWidth < 1024) toggle();
    navigate(to);
  };

  return (
    <aside className={[
      'fixed left-0 top-0 h-full flex flex-col py-8 z-50',
      'bg-[#0e0e0e] border-r border-[#4c4450]/15',
      'transition-all duration-300 ease-in-out',
      isOpen
        ? 'w-[240px] translate-x-0 px-4'
        : 'w-[240px] -translate-x-full px-4 lg:translate-x-0 lg:w-[64px] lg:px-2',
    ].join(' ')}>

      {/* Brand */}
      <div ref={brandRef} className={`mb-8 flex items-center ${isOpen ? 'px-2' : 'px-2 lg:justify-center lg:px-0'}`}>
        <span className={[
          'text-xl font-bold tracking-tighter text-white font-headline whitespace-nowrap overflow-hidden',
          'transition-all duration-300',
          isOpen ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0',
        ].join(' ')}>
          Obsidian Lens
        </span>
        <span className={[
          'w-2.5 h-2.5 rounded-full bg-[#d394ff] shrink-0 shadow-[0_0_8px_rgba(211,148,255,0.7)] transition-all duration-300',
          isOpen ? 'hidden' : 'hidden lg:block',
        ].join(' ')} />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ to, icon, label }, i) => (
          <NavLink
            key={to}
            to={to}
            ref={el => { navRefs.current[i] = el; }}
            title={!isOpen ? label : undefined}
            onClick={() => { if (window.innerWidth < 1024) toggle(); }}
            className={({ isActive }) => [
              'flex items-center py-2.5 rounded-xl text-sm font-headline tracking-tight transition-all duration-300',
              isOpen ? 'px-4' : 'px-4 lg:justify-center lg:px-0',
              isActive
                ? 'text-[#d394ff] bg-[#d394ff]/10 font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-[#201f1f]',
            ].join(' ')}
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined shrink-0"
                  style={{ fontSize: 20, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {icon}
                </span>
                <span className={[
                  'overflow-hidden whitespace-nowrap transition-all duration-300',
                  isOpen ? 'max-w-[160px] opacity-100 pl-3' : 'max-w-0 opacity-0 pl-0',
                ].join(' ')}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom: user card + menu ── */}
      <div ref={bottomRef} className="mt-4 relative">

        {/* Desktop floating dropdown — appears above the card */}
        {menuOpen && (
          <div className="hidden lg:flex flex-col absolute bottom-full left-0 mb-2 w-full min-w-[200px] bg-[#1c1b1b] rounded-2xl border border-[#4c4450]/20 shadow-[0_8px_40px_rgba(0,0,0,0.6)] z-[100] overflow-hidden py-1">
            <button
              onClick={() => handleMenuNav('/profile')}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[#cfc2d2] hover:text-white hover:bg-white/[0.04] transition-colors w-full text-left"
            >
              <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 18 }}>account_circle</span>
              <span className="font-headline">View Profile</span>
            </button>
            <button
              onClick={() => handleMenuNav('/settings')}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[#cfc2d2] hover:text-white hover:bg-white/[0.04] transition-colors w-full text-left"
            >
              <span className="material-symbols-outlined text-[#988d9c]" style={{ fontSize: 18 }}>settings</span>
              <span className="font-headline">Settings</span>
            </button>
            <div className="h-px bg-[#4c4450]/20 mx-3 my-1" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[#ffb4ab] hover:text-white hover:bg-[#ffb4ab]/10 transition-colors w-full text-left"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
              <span className="font-headline">Log out</span>
            </button>
          </div>
        )}

        {/* User card button */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          title={!isOpen ? 'Account' : undefined}
          className={[
            'w-full rounded-2xl border flex items-center transition-all duration-300',
            isOpen ? 'px-2 py-3 gap-3' : 'px-2 py-3 lg:p-2 lg:justify-center',
            menuOpen
              ? 'bg-[#d394ff]/10 border-[#d394ff]/30'
              : 'bg-[#201f1f] border-[#4c4450]/10 hover:border-[#d394ff]/20 hover:bg-[#2a2a2a]',
          ].join(' ')}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#d394ff] to-[#9400e4] p-[1.5px] shrink-0">
            <div className="w-full h-full rounded-full bg-[#131313] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 15 }}>person</span>
            </div>
          </div>
          <div className={`flex-1 overflow-hidden transition-all duration-300 text-left ${isOpen ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'}`}>
            <p className="text-sm font-bold text-white leading-tight font-headline whitespace-nowrap">Alex Rivera</p>
            <p className="text-[10px] text-[#988d9c] uppercase tracking-widest whitespace-nowrap">Pro Plan</p>
          </div>
          {/* Chevron — only when expanded */}
          <span
            className={[
              'material-symbols-outlined text-[#988d9c] transition-all duration-300 shrink-0',
              isOpen ? 'opacity-100' : 'opacity-0 w-0',
              menuOpen ? '[transform:rotate(180deg)]' : '',
            ].join(' ')}
            style={{ fontSize: 16 }}
          >
            expand_less
          </span>
        </button>

        {/* Mobile inline menu — appears below the card */}
        {menuOpen && (
          <div className="lg:hidden mt-1 space-y-0.5">
            <button
              onClick={() => handleMenuNav('/profile')}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-[#cfc2d2] hover:text-white hover:bg-[#201f1f] transition-colors"
            >
              <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 18 }}>account_circle</span>
              <span className="font-headline">View Profile</span>
            </button>
            <button
              onClick={() => handleMenuNav('/settings')}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-[#cfc2d2] hover:text-white hover:bg-[#201f1f] transition-colors"
            >
              <span className="material-symbols-outlined text-[#988d9c]" style={{ fontSize: 18 }}>settings</span>
              <span className="font-headline">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-[#ffb4ab] hover:text-white hover:bg-[#ffb4ab]/10 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
              <span className="font-headline">Log out</span>
            </button>
          </div>
        )}

      </div>
    </aside>
  );
}
