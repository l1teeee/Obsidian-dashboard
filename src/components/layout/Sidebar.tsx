import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useLayout } from '../../contexts/LayoutContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../shared/Modal';
import { getProfile } from '../../services/users.service';
import type { UserPlan } from '../../types/users.types';

// ── Nav config — control what each plan can access ───────────────────────────

interface NavItem {
  to:       string;
  icon:     string;
  label:    string;
  plans:    UserPlan[];   // which plans see this item
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard',   icon: 'dashboard',      label: 'Dashboard',     plans: ['starter', 'pro', 'enterprise'] },
  { to: '/posts',       icon: 'article',        label: 'Posts',         plans: ['starter', 'pro', 'enterprise'] },
  { to: '/calendar',    icon: 'calendar_month', label: 'Calendar',      plans: ['starter', 'pro', 'enterprise'] },
  { to: '/platforms',   icon: 'hub',            label: 'Platforms',     plans: ['starter', 'pro', 'enterprise'] },
  { to: '/analytics',   icon: 'monitoring',     label: 'Analytics',     plans: ['starter', 'pro', 'enterprise'] },
  { to: '/rivals',      icon: 'radar',          label: 'Rival Monitor', plans: ['starter', 'pro', 'enterprise'] },
  { to: '/ai-settings', icon: 'auto_awesome',   label: 'AI Settings',   plans: ['starter', 'pro', 'enterprise'] },
];

const PLAN_LABEL: Record<UserPlan, string> = {
  starter:    'Starter',
  pro:        'Pro',
  enterprise: 'Enterprise',
};

export default function Sidebar() {
  const { isOpen, toggle } = useLayout();
  const { workspaces, active, switchWorkspace, createWorkspace } = useWorkspace();
  const { logout } = useAuth();
  const navigate    = useNavigate();
  const brandRef    = useRef<HTMLDivElement>(null);
  const navRefs     = useRef<(HTMLAnchorElement | null)[]>([]);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const wsRef       = useRef<HTMLDivElement>(null);
  const wsNameRef   = useRef<HTMLSpanElement>(null);
  const prevActiveId = useRef<string | null>(null);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [wsOpen, setWsOpen]           = useState(false);
  const [creating, setCreating]       = useState(false);
  const [newName, setNewName]         = useState('');
  const [logoutModal, setLogoutModal] = useState(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [userPlan,    setUserPlan]    = useState<UserPlan | null>(null);
  const atLimit = workspaces.length >= 5;

  useEffect(() => {
    getProfile()
      .then(p => {
        setDisplayName(p.name ?? p.email);
        setUserPlan(p.plan ?? 'starter');
      })
      .catch(() => { setUserPlan('starter'); });
  }, []);

  const visibleNav = userPlan
    ? NAV_ITEMS.filter(item => item.plans.includes(userPlan))
    : [];

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

  // Close dropdowns on outside click
  useEffect(() => {
    if (!menuOpen && !wsOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuOpen && bottomRef.current && !bottomRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (wsOpen   && wsRef.current    && !wsRef.current.contains(e.target as Node))     setWsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen, wsOpen]);

  // Animate workspace button + name on switch
  useEffect(() => {
    if (prevActiveId.current === null) {
      prevActiveId.current = active?.id ?? null;
      return;
    }
    if (prevActiveId.current === active?.id) return;
    prevActiveId.current = active?.id ?? null;

    // Glow flash on the button
    const btn = wsRef.current?.querySelector('button');
    if (btn) {
      gsap.fromTo(btn,
        { boxShadow: '0 0 0px rgba(211,148,255,0)' },
        { boxShadow: '0 0 18px rgba(211,148,255,0.45)', duration: 0.2, ease: 'power2.out',
          onComplete: () => { gsap.to(btn, { boxShadow: '0 0 0px rgba(211,148,255,0)', duration: 0.4, ease: 'power2.in' }); } },
      );
    }

    // Name slide in
    if (wsNameRef.current) {
      gsap.fromTo(wsNameRef.current,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
      );
    }
  }, [active?.id]);

  const handleCreateWs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createWorkspace(newName.trim());
    setNewName('');
    setCreating(false);
    setWsOpen(false);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    setLogoutModal(true);
  };

  const confirmLogout = async () => {
    setLogoutModal(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const handleMenuNav = (to: string) => {
    setMenuOpen(false);
    if (window.innerWidth < 1024) toggle();
    navigate(to);
  };

  return (
    <>
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
          Vielinks
        </span>
        <span className={[
          'w-2.5 h-2.5 rounded-full bg-[#d394ff] shrink-0 shadow-[0_0_8px_rgba(211,148,255,0.7)] transition-all duration-300',
          isOpen ? 'hidden' : 'hidden lg:block',
        ].join(' ')} />
      </div>

      {/* Workspace switcher */}
      <div ref={wsRef} className="relative mb-3">
        <button
          onClick={() => setWsOpen(v => !v)}
          title={!isOpen ? (active?.name ?? 'Workspace') : undefined}
          className={[
            'w-full flex items-center rounded-xl border transition-all duration-300 py-2',
            isOpen ? 'px-3 gap-2.5' : 'px-3 lg:justify-center lg:px-0',
            wsOpen
              ? 'bg-[#d394ff]/10 border-[#d394ff]/25'
              : 'bg-[#1a1a1a] border-[#4c4450]/15 hover:border-[#d394ff]/20',
          ].join(' ')}
        >
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#d394ff] to-[#9400e4] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 13 }}>workspaces</span>
          </div>
          <span ref={wsNameRef} className={[
            'flex-1 text-left text-xs font-bold text-white truncate transition-all duration-300',
            isOpen ? 'max-w-[130px] opacity-100' : 'max-w-0 opacity-0',
          ].join(' ')}>
            {active?.name ?? 'No workspace'}
          </span>
          <span className={[
            'material-symbols-outlined text-[#988d9c] shrink-0 transition-all duration-300',
            isOpen ? 'opacity-100' : 'opacity-0 w-0',
            wsOpen ? '[transform:rotate(180deg)]' : '',
          ].join(' ')} style={{ fontSize: 14 }}>
            expand_more
          </span>
        </button>

        {/* Workspace dropdown */}
        {wsOpen && isOpen && (
          <div className="absolute top-full left-0 mt-1.5 w-full bg-[#1c1b1b] rounded-2xl border border-[#4c4450]/20 shadow-[0_8px_40px_rgba(0,0,0,0.6)] z-[100] overflow-hidden py-1.5">
            {workspaces.map(ws => (
              <button
                key={ws.id}
                onClick={() => { switchWorkspace(ws.id); setWsOpen(false); }}
                className={[
                  'flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs transition-colors text-left',
                  ws.id === active?.id
                    ? 'text-[#d394ff] bg-[#d394ff]/8'
                    : 'text-[#cfc2d2] hover:text-white hover:bg-white/[0.04]',
                ].join(' ')}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: ws.id === active?.id ? "'FILL' 1" : "'FILL' 0" }}>
                  workspaces
                </span>
                <span className="flex-1 truncate font-semibold">{ws.name}</span>
                {ws.id === active?.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d394ff] shrink-0" />
                )}
              </button>
            ))}

            <div className="h-px bg-[#4c4450]/20 mx-3 my-1" />

            {creating ? (
              <form onSubmit={handleCreateWs} className="px-2 pb-2 pt-1 flex flex-col gap-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Workspace name…"
                  className="w-full bg-[#131313] border border-[#4c4450]/30 rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#4c4450] focus:outline-none focus:border-[#d394ff]/40 transition-all"
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={!newName.trim()} className="flex-1 py-1.5 rounded-lg bg-[#d394ff] text-[#131313] font-bold text-[10px] disabled:opacity-40 hover:bg-[#e0a8ff] transition-all">
                    Create
                  </button>
                  <button type="button" onClick={() => { setCreating(false); setNewName(''); }} className="px-3 py-1.5 rounded-lg border border-[#4c4450]/20 text-[10px] text-[#988d9c] hover:text-white transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            ) : atLimit ? (
              <div className="flex items-center gap-2 w-full px-3.5 py-2.5 text-xs text-[#4c4450] cursor-not-allowed select-none">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock</span>
                Limit reached (5/5)
              </div>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="flex items-center gap-2 w-full px-3.5 py-2.5 text-xs text-[#988d9c] hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                New Workspace
              </button>
            )}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {userPlan === null ? (
          // ── Skeleton while loading plan ──────────────────────────────────
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={[
                'flex items-center py-2.5 rounded-xl animate-pulse',
                isOpen ? 'px-4 gap-3' : 'px-4 lg:justify-center lg:px-0',
              ].join(' ')}
            >
              <div className="w-5 h-5 rounded-md bg-[#2a2a2a] shrink-0" />
              <div className={[
                'h-3 bg-[#2a2a2a] rounded-full transition-all duration-300',
                isOpen ? 'w-24 opacity-100' : 'w-0 opacity-0',
              ].join(' ')} />
            </div>
          ))
        ) : (
          // ── Real nav items filtered by plan ──────────────────────────────
          visibleNav.map(({ to, icon, label }, i) => (
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
          ))
        )}
      </nav>

      {/* ── Bottom: user card + menu ── */}
      <div ref={bottomRef} className="mt-4 relative">

        {/* Desktop floating dropdown — appears above the card, always in DOM for animation */}
        <div className={[
          'hidden lg:flex flex-col absolute bottom-full left-0 mb-2 w-full min-w-[200px]',
          'bg-[#1c1b1b] rounded-2xl border border-[#4c4450]/20 shadow-[0_8px_40px_rgba(0,0,0,0.6)]',
          'z-[100] overflow-hidden py-1 origin-bottom',
          'transition-all duration-200 ease-out',
          menuOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-1 pointer-events-none',
        ].join(' ')}>
          <button
            onClick={() => handleMenuNav('/profile')}
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#cfc2d2] hover:text-white hover:bg-white/[0.04] transition-colors w-full text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 18 }}>account_circle</span>
            <span className="font-headline">View Profile</span>
          </button>
          <button
            onClick={() => handleMenuNav('/settings')}
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#cfc2d2] hover:text-white hover:bg-white/[0.04] transition-colors w-full text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#988d9c]" style={{ fontSize: 18 }}>settings</span>
            <span className="font-headline">Settings</span>
          </button>
          <div className="h-px bg-[#4c4450]/20 mx-3 my-1" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#ffb4ab] hover:text-white hover:bg-[#ffb4ab]/10 transition-colors w-full text-left cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
            <span className="font-headline">Log out</span>
          </button>
        </div>

        {/* User card button */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          title={!isOpen ? 'Account' : undefined}
          className={[
            'w-full rounded-2xl border flex items-center transition-all duration-300 cursor-pointer',
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
            <p className="text-sm font-bold text-white leading-tight font-headline whitespace-nowrap">{displayName || '—'}</p>
            {userPlan === null
              ? <div className="h-2 w-16 bg-[#2a2a2a] rounded-full animate-pulse mt-0.5" />
              : <p className="text-[10px] text-[#988d9c] uppercase tracking-widest whitespace-nowrap">{PLAN_LABEL[userPlan]} Plan</p>
            }
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

        {/* Mobile inline menu — always in DOM for smooth animation */}
        <div className={[
          'lg:hidden mt-1 space-y-0.5 overflow-hidden transition-all duration-200 ease-out',
          menuOpen ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0',
        ].join(' ')}>
          <button
            onClick={() => handleMenuNav('/profile')}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-[#cfc2d2] hover:text-white hover:bg-[#201f1f] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 18 }}>account_circle</span>
            <span className="font-headline">View Profile</span>
          </button>
          <button
            onClick={() => handleMenuNav('/settings')}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-[#cfc2d2] hover:text-white hover:bg-[#201f1f] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#988d9c]" style={{ fontSize: 18 }}>settings</span>
            <span className="font-headline">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-[#ffb4ab] hover:text-white hover:bg-[#ffb4ab]/10 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
            <span className="font-headline">Log out</span>
          </button>
        </div>

      </div>
    </aside>

    {/* Logout confirmation modal */}
    <Modal open={logoutModal} onClose={() => setLogoutModal(false)} maxWidth="max-w-sm">
      <div className="p-8">
        <div className="w-12 h-12 rounded-2xl bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-[#ffb4ab]" style={{ fontSize: 22 }}>logout</span>
        </div>
        <h2 className="text-xl font-headline font-extrabold tracking-tight text-white mb-1">Log out?</h2>
        <p className="text-sm text-[#988d9c] mb-7">
          You'll be redirected to the login screen. Your workspaces and data will be saved.
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => { void confirmLogout(); }}
            className="w-full py-3 rounded-xl bg-[#ffb4ab] text-[#131313] font-bold text-sm hover:bg-[#ffccc7] transition-all"
          >
            Yes, log out
          </button>
          <button
            onClick={() => setLogoutModal(false)}
            className="w-full py-3 rounded-xl border border-[#4c4450]/20 text-sm font-semibold text-[#cfc2d2] hover:bg-[#201f1f] hover:text-white transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
    </>
  );
}
