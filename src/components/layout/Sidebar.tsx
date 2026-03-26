import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import gsap from 'gsap';
import { useLayout } from '../../contexts/LayoutContext';

const NAV_ITEMS = [
  { to: '/dashboard', icon: 'dashboard',     label: 'Dashboard' },
  { to: '/composer',  icon: 'post_add',       label: 'Posts' },
  { to: '/calendar',  icon: 'calendar_month', label: 'Calendar' },
  { to: '/analytics', icon: 'monitoring',    label: 'Analytics' },
  { to: '/platforms', icon: 'hub',           label: 'Platforms' },
  { to: '/settings',  icon: 'settings',      label: 'Settings' },
];

export default function Sidebar() {
  const { isOpen, toggle } = useLayout();
  const brandRef = useRef<HTMLDivElement>(null);
  const navRefs  = useRef<(HTMLAnchorElement | null)[]>([]);
  const userRef  = useRef<HTMLDivElement>(null);

  // Entrance animation on desktop only
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
    .fromTo(userRef.current,
      { y: 10, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.4 },
      '-=0.15',
    );
    return () => { tl.kill(); };
  }, []);

  return (
    <aside className={[
      'fixed left-0 top-0 h-full flex flex-col py-8 z-50 overflow-hidden',
      'bg-[#0e0e0e] border-r border-[#4c4450]/15',
      'transition-all duration-300 ease-in-out',
      // Mobile: full-width slide in/out — Desktop: always visible, width changes
      isOpen
        ? 'w-[240px] translate-x-0 px-4'
        : 'w-[240px] -translate-x-full px-4 lg:translate-x-0 lg:w-[64px] lg:px-2',
    ].join(' ')}>

      {/* Brand */}
      <div ref={brandRef} className={`mb-8 flex items-center ${isOpen ? 'px-2' : 'px-2 lg:justify-center lg:px-0'}`}>
        {/* Full name — visible when expanded */}
        <span className={[
          'text-xl font-bold tracking-tighter text-white font-headline whitespace-nowrap overflow-hidden',
          'transition-all duration-300',
          isOpen ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0',
        ].join(' ')}>
          Obsidian Lens
        </span>
        {/* Purple dot — visible when collapsed on desktop */}
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
                {/* Label fades + collapses smoothly */}
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

      {/* User */}
      <div ref={userRef} className={[
        'mt-4 rounded-2xl bg-[#201f1f] border border-[#4c4450]/10 flex items-center transition-all duration-300',
        isOpen ? 'px-2 py-3 gap-3' : 'px-2 py-3 lg:p-2 lg:justify-center',
      ].join(' ')}>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#d394ff] to-[#9400e4] p-[1.5px] shrink-0">
          <div className="w-full h-full rounded-full bg-[#131313] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 15 }}>person</span>
          </div>
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0'}`}>
          <p className="text-sm font-bold text-white leading-tight font-headline whitespace-nowrap">Alex Rivera</p>
          <p className="text-[10px] text-[#988d9c] uppercase tracking-widest whitespace-nowrap">Pro Plan</p>
        </div>
      </div>
    </aside>
  );
}
