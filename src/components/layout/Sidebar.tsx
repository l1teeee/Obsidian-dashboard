import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove, sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLayout } from '../../contexts/LayoutContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../shared/Modal';
import InitialsAvatar from '../shared/InitialsAvatar';
import AdminWelcomeModal, { shouldShowAdminWelcome } from '../shared/AdminWelcomeModal';
import { getProfile } from '../../services/users.service';
import type { UserPlan } from '../../types/users.types';

const SIDEBAR_ORDER_KEY = 'obsidian_sidebar_order';

const ADMIN_NAV = [
  { to: '/admin',             icon: 'monitoring',           label: 'Overview',       exact: true,  superadminOnly: true },
  { to: '/admin/users',       icon: 'group',                label: 'Users',                        superadminOnly: true },
  { to: '/admin/workspaces',  icon: 'workspaces',           label: 'Workspaces' },
  { to: '/admin/posts',       icon: 'article',              label: 'Posts' },
  { to: '/admin/admins',      icon: 'admin_panel_settings', label: 'Administrators',               superadminOnly: true },
  { to: '/admin/permissions', icon: 'lock',                 label: 'Permissions',                  superadminOnly: true },
  { to: '/admin/roles',       icon: 'badge',                label: 'Roles',                        superadminOnly: true },
  { to: '/admin/tokens',     icon: 'bolt',                 label: 'Token Usage',                  superadminOnly: true },
];

// ── Nav structure ─────────────────────────────────────────────────────────────

interface ChildItem {
  to:    string;
  icon:  string;
  label: string;
  plans: UserPlan[];
}

interface StandaloneItem {
  kind:  'item';
  to:    string;
  icon:  string;
  label: string;
  plans: UserPlan[];
}

interface GroupItem {
  kind:     'group';
  key:      string;
  icon:     string;
  label:    string;
  plans:    UserPlan[];
  children: ChildItem[];
}

type NavEntry = StandaloneItem | GroupItem;

const NAV_STRUCTURE: NavEntry[] = [
  {
    kind: 'item',
    to: '/dashboard', icon: 'dashboard', label: 'Dashboard',
    plans: ['free', 'starter', 'pro', 'enterprise'],
  },
  {
    kind: 'group', key: 'publish', icon: 'edit_note', label: 'Publish',
    plans: ['free', 'starter', 'pro', 'enterprise'],
    children: [
      { to: '/posts',    icon: 'article',        label: 'Posts',    plans: ['free', 'starter', 'pro', 'enterprise'] },
      { to: '/calendar', icon: 'calendar_month', label: 'Calendar', plans: ['free', 'starter', 'pro', 'enterprise'] },
    ],
  },
  {
    kind: 'group', key: 'insights', icon: 'monitoring', label: 'Insights',
    plans: ['free', 'starter', 'pro', 'enterprise'],
    children: [
      { to: '/analytics', icon: 'monitoring', label: 'Analytics',     plans: ['free', 'starter', 'pro', 'enterprise'] },
      { to: '/rivals',    icon: 'radar',      label: 'Rival Monitor', plans: ['free', 'starter', 'pro', 'enterprise'] },
      { to: '/activity',  icon: 'history',    label: 'Activity',      plans: ['free', 'starter', 'pro', 'enterprise'] },
    ],
  },
  {
    kind: 'group', key: 'configure', icon: 'tune', label: 'Configure',
    plans: ['free', 'starter', 'pro', 'enterprise'],
    children: [
      { to: '/platforms',   icon: 'hub',          label: 'Platforms',   plans: ['free', 'starter', 'pro', 'enterprise'] },
      { to: '/ai-settings', icon: 'auto_awesome', label: 'AI Settings', plans: ['free', 'starter', 'pro', 'enterprise'] },
      { to: '/brand',       icon: 'style',        label: 'Brand',       plans: ['free', 'starter', 'pro', 'enterprise'] },
    ],
  },
];

const PLAN_LABEL: Record<UserPlan, string> = {
  free:       'Free',
  starter:    'Starter',
  pro:        'Pro',
  enterprise: 'Enterprise',
};

// ── Sortable nav entry ────────────────────────────────────────────────────────

interface SortableNavEntryProps {
  entry:        NavEntry;
  isOpen:       boolean;
  pathname:     string;
  openGroups:   Set<string>;
  toggleGroup:  (key: string) => void;
  handleNavClick: () => void;
  navLinkCls:   (isActive: boolean, collapsed?: boolean) => string;
}

function SortableNavEntry({ entry, isOpen, pathname, openGroups, toggleGroup, handleNavClick, navLinkCls }: SortableNavEntryProps) {
  const id = entry.kind === 'item' ? entry.to : entry.key;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform:  CSS.Transform.toString(transform),
    transition,
    opacity:    isDragging ? 0.4 : 1,
    zIndex:     isDragging ? 50  : undefined,
  };

  if (entry.kind === 'item') {
    return (
      <div ref={setNodeRef} style={style} data-nav-item className="group relative">
        {/* Drag handle — only visible when sidebar is open */}
        {isOpen && (
          <span
            {...attributes}
            {...listeners}
            className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing select-none"
            style={{ fontSize: 14, touchAction: 'none' }}
          >
            drag_indicator
          </span>
        )}
        <NavLink
          to={entry.to}
          title={!isOpen ? entry.label : undefined}
          aria-label={!isOpen ? entry.label : undefined}
          onClick={handleNavClick}
          className={({ isActive }) => navLinkCls(isActive, !isOpen)}
        >
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined shrink-0" style={{ fontSize: 20, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {entry.icon}
              </span>
              <span className={['overflow-hidden whitespace-nowrap transition-all duration-300', isOpen ? 'max-w-[160px] opacity-100 pl-3' : 'max-w-0 opacity-0 pl-0'].join(' ')}>
                {entry.label}
              </span>
            </>
          )}
        </NavLink>
      </div>
    );
  }

  // Group entry
  const isAnyChildActive = entry.children.some(c => pathname.startsWith(c.to));
  const isGroupOpen      = openGroups.has(entry.key) && isOpen;

  return (
    <div ref={setNodeRef} style={style} data-nav-item className="group relative">
      {/* Drag handle */}
      {isOpen && (
        <span
          {...attributes}
          {...listeners}
          className="material-symbols-outlined absolute left-0 top-[14px] text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing select-none"
          style={{ fontSize: 14, touchAction: 'none' }}
        >
          drag_indicator
        </span>
      )}

      {/* Group header */}
      <button
        onClick={() => toggleGroup(entry.key)}
        title={!isOpen ? entry.label : undefined}
        aria-label={!isOpen ? entry.label : undefined}
        className={[
          'w-full flex items-center rounded-xl transition-all duration-150 select-none py-2.5 cursor-pointer',
          isOpen ? 'px-4' : 'px-4 lg:justify-center lg:px-0',
          isAnyChildActive
            ? 'text-[#111827]'
            : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] active:bg-[#111827]/10 active:scale-[0.97]',
          !isOpen && 'lg:hover:bg-[#F1F5F9] lg:hover:text-[#0F172A]',
        ].join(' ')}
      >
        <span className="material-symbols-outlined shrink-0" style={{ fontSize: 20, fontVariationSettings: isAnyChildActive ? "'FILL' 1" : "'FILL' 0" }}>
          {entry.icon}
        </span>
        <span className={['flex-1 text-left text-sm font-headline tracking-tight overflow-hidden whitespace-nowrap transition-all duration-300', isOpen ? 'max-w-[120px] opacity-100 pl-3' : 'max-w-0 opacity-0 pl-0'].join(' ')}>
          {entry.label}
        </span>
        <span className={[
          'material-symbols-outlined shrink-0 transition-all duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 w-0',
          isGroupOpen ? '[transform:rotate(180deg)]' : '',
          isAnyChildActive ? 'text-[#111827]' : 'text-[#64748B]',
        ].join(' ')} style={{ fontSize: 14 }}>
          expand_more
        </span>
      </button>

      {/* Accordion children */}
      <div style={{ display: 'grid', gridTemplateRows: isGroupOpen ? '1fr' : '0fr', transition: 'grid-template-rows 220ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-0.5 pb-0.5 pl-3 pt-0.5">
            {entry.children.map(child => (
              <NavLink
                key={child.to}
                to={child.to}
                onClick={handleNavClick}
                className={({ isActive }) => [
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-headline tracking-tight transition-all duration-150 select-none',
                  isActive
                    ? 'text-[#111827] bg-[#111827]/10 font-semibold'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] hover:translate-x-0.5 active:bg-[#111827]/10 active:scale-[0.97] active:translate-x-0',
                ].join(' ')}
              >
                {({ isActive }) => (
                  <>
                    <span className="material-symbols-outlined shrink-0" style={{ fontSize: 16, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                      {child.icon}
                    </span>
                    {child.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const { isOpen, toggle }                               = useLayout();
  const { workspaces, active, switchWorkspace, createWorkspace } = useWorkspace();
  const { logout }                                       = useAuth();
  const navigate                                         = useNavigate();
  const { pathname }                                     = useLocation();

  const asideRef      = useRef<HTMLElement>(null);
  const brandRef      = useRef<HTMLDivElement>(null);
  const bottomRef     = useRef<HTMLDivElement>(null);
  const wsRef         = useRef<HTMLDivElement>(null);
  const wsNameRef     = useRef<HTMLSpanElement>(null);
  const prevActiveId  = useRef<string | null>(null);

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [wsOpen,      setWsOpen]      = useState(false);
  const [creating,    setCreating]    = useState(false);
  const [newName,     setNewName]     = useState('');
  const [logoutModal, setLogoutModal] = useState(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [userPlan,    setUserPlan]    = useState<UserPlan | null>(null);
  const [isAdmin,     setIsAdmin]     = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [openGroups,  setOpenGroups]  = useState<Set<string>>(new Set());
  const [adminOpen,          setAdminOpen]          = useState(false);
  const [showAdminWelcome,   setShowAdminWelcome]   = useState(false);
  const [adminWelcomeUserId, setAdminWelcomeUserId] = useState('');

  // Drag-and-drop order — Dashboard is always fixed first, not sortable
  const getNavId = (e: NavEntry) => e.kind === 'item' ? e.to : e.key;
  const isSortable = (e: NavEntry) => !(e.kind === 'item' && e.to === '/dashboard');

  const [navOrder, setNavOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_ORDER_KEY);
      if (saved) return JSON.parse(saved) as string[];
    } catch { /* ignore parse errors, fall through to default */ }
    return NAV_STRUCTURE.filter(isSortable).map(getNavId);
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragStart() {
    setOpenGroups(new Set());
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setNavOrder(prev => {
      const oldIdx = prev.indexOf(active.id as string);
      const newIdx = prev.indexOf(over.id   as string);
      const next   = arrayMove(prev, oldIdx, newIdx);
      localStorage.setItem(SIDEBAR_ORDER_KEY, JSON.stringify(next));
      return next;
    });
  }

  const atLimit = workspaces.length >= 5;

  // Load user profile (plan + admin flag)
  useEffect(() => {
    getProfile()
      .then(p => {
        setDisplayName(p.name ?? p.email);
        setUserPlan(p.plan ?? 'starter');
        setIsAdmin(!!p.is_admin);
        setIsSuperAdmin(!!p.is_superadmin);
        if (p.is_admin && shouldShowAdminWelcome(p.id)) {
          setAdminWelcomeUserId(p.id);
          setShowAdminWelcome(true);
        }
      })
      .catch(() => { setUserPlan('starter'); });
  }, []);

  // Auto-open the group that contains the active route
  useEffect(() => {
    NAV_STRUCTURE.forEach(entry => {
      if (entry.kind === 'group') {
        const hasActive = entry.children.some(c => pathname.startsWith(c.to));
        if (hasActive) setOpenGroups(prev => new Set([...prev, entry.key]));
      }
    });
    if (ADMIN_NAV.some(item => pathname.startsWith(item.to))) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAdminOpen(true);
    }
  }, [pathname]);

  // Filter entries by plan
  const allVisible = userPlan
    ? [...NAV_STRUCTURE]
        .filter(e => e.plans.includes(userPlan))
        .map(e => e.kind === 'group'
          ? { ...e, children: e.children.filter(c => c.plans.includes(userPlan)) }
          : e,
        )
    : [];

  // Dashboard is always first and fixed
  const dashboardEntry  = allVisible.find(e => e.kind === 'item' && e.to === '/dashboard') ?? null;
  // Remaining entries sorted by saved order
  const sortableEntries = allVisible
    .filter(isSortable)
    .sort((a, b) => {
      const ai = navOrder.indexOf(getNavId(a));
      const bi = navOrder.indexOf(getNavId(b));
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

  // Entrance animation
  useEffect(() => {
    if (window.innerWidth < 1024) return;
    const items = asideRef.current?.querySelectorAll('[data-nav-item]') ?? [];
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(brandRef.current,  { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 })
      .fromTo([...items],        { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.055 }, '-=0.2')
      .fromTo(bottomRef.current, { y: 10,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.15');
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
    if (prevActiveId.current === null) { prevActiveId.current = active?.id ?? null; return; }
    if (prevActiveId.current === active?.id) return;
    prevActiveId.current = active?.id ?? null;
    const btn = wsRef.current?.querySelector('button');
    if (btn) {
      gsap.fromTo(btn,
        { boxShadow: '0 0 0px rgba(14,159,110,0)' },
        { boxShadow: '0 0 18px rgba(14,159,110,0.25)', duration: 0.2, ease: 'power2.out',
          onComplete: () => { gsap.to(btn, { boxShadow: '0 0 0px rgba(14,159,110,0)', duration: 0.4, ease: 'power2.in' }); } },
      );
    }
    if (wsNameRef.current) {
      gsap.fromTo(wsNameRef.current, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
    }
  }, [active?.id]);

  const toggleGroup = (key: string) => {
    if (!isOpen) {
      toggle();
      setOpenGroups(new Set([key]));
      return;
    }
    setOpenGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); } else { next.add(key); }
      return next;
    });
  };

  const handleCreateWs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createWorkspace(newName.trim());
    setNewName(''); setCreating(false); setWsOpen(false);
  };

  const handleLogout    = () => { setMenuOpen(false); setLogoutModal(true); };
  const confirmLogout   = async () => { setLogoutModal(false); await logout(); navigate('/login', { replace: true }); };
  const handleMenuNav   = (to: string) => { setMenuOpen(false); if (window.innerWidth < 1024) toggle(); navigate(to); };
  const handleNavClick  = () => { if (window.innerWidth < 1024) toggle(); };

  // Shared NavLink class builder
  const navLinkCls = (isActive: boolean, collapsed = false) => [
    'flex items-center rounded-xl text-sm font-headline tracking-tight transition-all duration-150 select-none',
    collapsed ? 'py-2.5 px-4 lg:justify-center lg:px-0' : 'py-2.5 px-4',
    isActive
      ? 'text-[#111827] bg-[#111827]/10 font-semibold'
      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] active:bg-[#111827]/10 active:scale-[0.97]',
  ].join(' ');

  return (
    <>
    <aside
      ref={asideRef}
      className={[
        'fixed left-0 top-0 h-full flex flex-col py-8 z-50',
        'bg-[#FFFFFF] border-r border-[rgba(15,23,42,0.10)]',
        'transition-all duration-300 ease-in-out',
        isOpen
          ? 'w-[240px] translate-x-0 px-4'
          : 'w-[240px] -translate-x-full px-4 lg:translate-x-0 lg:w-[64px] lg:px-2',
      ].join(' ')}
    >

      {/* Brand */}
      <div ref={brandRef} className={`mb-8 flex items-center ${isOpen ? 'px-2' : 'px-2 lg:justify-center lg:px-0'}`}>
        <span className={[
          'text-xl font-bold tracking-tighter text-[#0F172A] font-headline whitespace-nowrap overflow-hidden transition-all duration-300',
          isOpen ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0',
        ].join(' ')}>
          Vielinks
        </span>
        <span className={[
          'w-2.5 h-2.5 rounded-full bg-[#0E9F6E] shrink-0 shadow-[0_0_8px_rgba(14,159,110,0.5)] transition-all duration-300',
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
            wsOpen ? 'bg-[#111827]/10 border-[#111827]/25' : 'bg-white border-border hover:border-[#111827]/30',
          ].join(' ')}
        >
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#111827] to-[#0B1220] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 13 }}>workspaces</span>
          </div>
          <span ref={wsNameRef} className={[
            'flex-1 text-left text-xs font-bold text-[#0F172A] truncate transition-all duration-300',
            isOpen ? 'max-w-[130px] opacity-100' : 'max-w-0 opacity-0',
          ].join(' ')}>
            {active?.name ?? 'No workspace'}
          </span>
          <span className={[
            'material-symbols-outlined text-[#64748B] shrink-0 transition-all duration-300',
            isOpen ? 'opacity-100' : 'opacity-0 w-0',
            wsOpen ? '[transform:rotate(180deg)]' : '',
          ].join(' ')} style={{ fontSize: 14 }}>expand_more</span>
        </button>

        {wsOpen && isOpen && (
          <div className="absolute top-full left-0 mt-1.5 w-full bg-[#FFFFFF] rounded-2xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-100 overflow-hidden py-1.5">
            {workspaces.map(ws => (
              <button
                key={ws.id}
                onClick={() => { switchWorkspace(ws.id); setWsOpen(false); }}
                className={[
                  'flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs transition-colors text-left',
                  ws.id === active?.id ? 'text-[#111827] bg-[#111827]/8' : 'text-on-surface-variant hover:text-[#0F172A] hover:bg-[#F1F5F9]',
                ].join(' ')}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: ws.id === active?.id ? "'FILL' 1" : "'FILL' 0" }}>workspaces</span>
                <span className="flex-1 truncate font-semibold">{ws.name}</span>
                {ws.id === active?.id && <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E] shrink-0" />}
              </button>
            ))}

            <div className="h-px bg-[rgba(15,23,42,0.10)] mx-3 my-1" />

            {creating ? (
              <form onSubmit={handleCreateWs} className="px-2 pb-2 pt-1 flex flex-col gap-2">
                <input
                  autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="Workspace name…"
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#111827]/40 transition-all"
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={!newName.trim()} className="flex-1 py-1.5 rounded-lg bg-[#111827] text-white font-bold text-[10px] disabled:opacity-40 hover:bg-[#0B1220] transition-all">Create</button>
                  <button type="button" onClick={() => { setCreating(false); setNewName(''); }} className="px-3 py-1.5 rounded-lg border border-border text-[10px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors">Cancel</button>
                </div>
              </form>
            ) : atLimit ? (
              <div className="flex items-center gap-2 w-full px-3.5 py-2.5 text-xs text-[#0F172A] cursor-not-allowed select-none">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock</span>
                Limit reached (5/5)
              </div>
            ) : (
              <button onClick={() => setCreating(true)} className="flex items-center gap-2 w-full px-3.5 py-2.5 text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                New Workspace
              </button>
            )}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
        {userPlan === null ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={['flex items-center py-2.5 rounded-xl animate-pulse', isOpen ? 'px-4 gap-3' : 'px-4 lg:justify-center lg:px-0'].join(' ')}>
              <div className="w-5 h-5 rounded-md bg-[#E2E8F0] shrink-0" />
              <div className={['h-3 bg-[#E2E8F0] rounded-full transition-all duration-300', isOpen ? 'w-24 opacity-100' : 'w-0 opacity-0'].join(' ')} />
            </div>
          ))
        ) : (
          <>
            {/* Dashboard — fijo, siempre primero, no sortable */}
            {dashboardEntry && dashboardEntry.kind === 'item' && (
              <NavLink
                to={dashboardEntry.to}
                data-nav-item
                title={!isOpen ? dashboardEntry.label : undefined}
                aria-label={!isOpen ? dashboardEntry.label : undefined}
                onClick={handleNavClick}
                className={({ isActive }) => navLinkCls(isActive, !isOpen)}
              >
                {({ isActive }) => (
                  <>
                    <span className="material-symbols-outlined shrink-0" style={{ fontSize: 20, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                      {dashboardEntry.icon}
                    </span>
                    <span className={['overflow-hidden whitespace-nowrap transition-all duration-300', isOpen ? 'max-w-[160px] opacity-100 pl-3' : 'max-w-0 opacity-0 pl-0'].join(' ')}>
                      {dashboardEntry.label}
                    </span>
                  </>
                )}
              </NavLink>
            )}

            {/* Separador */}
            {dashboardEntry && sortableEntries.length > 0 && (
              <div className="h-px bg-[rgba(15,23,42,0.10)] mx-1 my-1.5" />
            )}

            {/* Entradas sortables */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={sortableEntries.map(getNavId)} strategy={verticalListSortingStrategy}>
                {sortableEntries.map(entry => (
                  <SortableNavEntry
                    key={getNavId(entry)}
                    entry={entry}
                    isOpen={isOpen}
                    pathname={pathname}
                    openGroups={openGroups}
                    toggleGroup={toggleGroup}
                    handleNavClick={handleNavClick}
                    navLinkCls={navLinkCls}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {/* Admin section — only for admins, collapsible */}
            {isAdmin && (() => {
              const isAnyAdminActive = ADMIN_NAV.some(item => pathname.startsWith(item.to) && (!item.exact || pathname === item.to));
              const groupIsOpen      = adminOpen && isOpen;
              return (
                <>
                  <div className="h-px bg-[rgba(15,23,42,0.10)] mx-1 my-1.5" />
                  <button
                    data-nav-item
                    onClick={() => {
                      if (!isOpen) { toggle(); setAdminOpen(true); return; }
                      setAdminOpen(v => !v);
                    }}
                    title={!isOpen ? 'Admin' : undefined}
                    aria-label={!isOpen ? 'Admin' : undefined}
                    className={[
                      'w-full flex items-center rounded-xl transition-all duration-150 select-none py-2.5 cursor-pointer',
                      isOpen ? 'px-4' : 'px-4 lg:justify-center lg:px-0',
                      isAnyAdminActive
                        ? 'text-[#111827]'
                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] active:bg-[#111827]/10 active:scale-[0.97]',
                      !isOpen && 'lg:hover:bg-[#F1F5F9] lg:hover:text-[#0F172A]',
                    ].join(' ')}
                  >
                    <span className="material-symbols-outlined shrink-0" style={{ fontSize: 20, fontVariationSettings: isAnyAdminActive ? "'FILL' 1" : "'FILL' 0" }}>
                      shield
                    </span>
                    <span className={['flex-1 text-left text-sm font-headline tracking-tight overflow-hidden whitespace-nowrap transition-all duration-300', isOpen ? 'max-w-[120px] opacity-100 pl-3' : 'max-w-0 opacity-0 pl-0'].join(' ')}>
                      Admin
                    </span>
                    <span className={[
                      'material-symbols-outlined shrink-0 transition-all duration-300',
                      isOpen ? 'opacity-100' : 'opacity-0 w-0',
                      groupIsOpen ? '[transform:rotate(180deg)]' : '',
                      isAnyAdminActive ? 'text-[#111827]' : 'text-[#64748B]',
                    ].join(' ')} style={{ fontSize: 14 }}>
                      expand_more
                    </span>
                  </button>

                  <div style={{ display: 'grid', gridTemplateRows: groupIsOpen ? '1fr' : '0fr', transition: 'grid-template-rows 220ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-0.5 pb-0.5 pl-3 pt-0.5">
                        {ADMIN_NAV.filter(item => !item.superadminOnly || isSuperAdmin).map(item => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.exact}
                            onClick={handleNavClick}
                            className={({ isActive }) => [
                              'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-headline tracking-tight transition-all duration-150 select-none',
                              isActive
                                ? 'text-[#111827] bg-[#111827]/10 font-semibold'
                                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] hover:translate-x-0.5 active:bg-[#111827]/10 active:scale-[0.97] active:translate-x-0',
                            ].join(' ')}
                          >
                            {({ isActive }) => (
                              <>
                                <span className="material-symbols-outlined shrink-0" style={{ fontSize: 16, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                                  {item.icon}
                                </span>
                                {item.label}
                              </>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </>
        )}
      </nav>

      {/* ── Bottom: user card + menu ──────────────────────────────────────────── */}
      <div ref={bottomRef} className="mt-4 relative">

        {/* Desktop floating dropdown */}
        <div className={[
          'hidden lg:flex flex-col absolute bottom-full left-0 mb-2 w-full min-w-[200px]',
          'bg-[#FFFFFF] rounded-2xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
          'z-100 overflow-hidden py-1 origin-bottom transition-all duration-200 ease-out',
          menuOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 translate-y-1 pointer-events-none',
        ].join(' ')}>
          <button onClick={() => handleMenuNav('/profile')} className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors w-full text-left cursor-pointer">
            <span className="material-symbols-outlined text-[#0E9F6E]" style={{ fontSize: 18 }}>account_circle</span>
            <span className="font-headline">View Profile</span>
          </button>
          <button onClick={() => handleMenuNav('/settings')} className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors w-full text-left cursor-pointer">
            <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 18 }}>settings</span>
            <span className="font-headline">Settings</span>
          </button>
          <div className="h-px bg-[rgba(15,23,42,0.10)] mx-3 my-1" />
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors w-full text-left cursor-pointer">
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
            menuOpen ? 'bg-[#111827]/10 border-[#111827]/30' : 'bg-[#F1F5F9] border-border hover:border-[#111827]/30 hover:bg-[#E2E8F0]',
          ].join(' ')}
        >
          <InitialsAvatar name={displayName} size="sm" />
          <div className={`flex-1 overflow-hidden transition-all duration-300 text-left ${isOpen ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'}`}>
            <p className="text-sm font-bold text-[#0F172A] leading-tight font-headline whitespace-nowrap">{displayName || '—'}</p>
            {userPlan === null
              ? <div className="h-2 w-16 bg-[#E2E8F0] rounded-full animate-pulse mt-0.5" />
              : <p className="text-[10px] text-[#64748B] uppercase tracking-widest whitespace-nowrap">{PLAN_LABEL[userPlan]} Plan</p>
            }
          </div>
          <span className={[
            'material-symbols-outlined text-[#64748B] transition-all duration-300 shrink-0',
            isOpen ? 'opacity-100' : 'opacity-0 w-0',
            menuOpen ? '[transform:rotate(180deg)]' : '',
          ].join(' ')} style={{ fontSize: 16 }}>expand_less</span>
        </button>

        {/* Mobile inline menu */}
        <div className={[
          'lg:hidden mt-1 space-y-0.5 overflow-hidden transition-all duration-200 ease-out',
          menuOpen ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0',
        ].join(' ')}>
          <button onClick={() => handleMenuNav('/profile')} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-on-surface-variant hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[#0E9F6E]" style={{ fontSize: 18 }}>account_circle</span>
            <span className="font-headline">View Profile</span>
          </button>
          <button onClick={() => handleMenuNav('/settings')} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-on-surface-variant hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 18 }}>settings</span>
            <span className="font-headline">Settings</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
            <span className="font-headline">Log out</span>
          </button>
        </div>
      </div>
    </aside>

    {/* Admin welcome modal — shown once after becoming admin */}
    {showAdminWelcome && (
      <AdminWelcomeModal
        userId={adminWelcomeUserId}
        onClose={() => setShowAdminWelcome(false)}
      />
    )}

    {/* Logout confirmation modal */}
    <Modal open={logoutModal} onClose={() => setLogoutModal(false)} maxWidth="max-w-sm">
      <div className="p-8">
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-red-500" style={{ fontSize: 22 }}>logout</span>
        </div>
        <h2 className="text-xl font-headline font-extrabold tracking-tight text-[#0F172A] mb-1">Log out?</h2>
        <p className="text-sm text-[#64748B] mb-7">You'll be redirected to the login screen. Your workspaces and data will be saved.</p>
        <div className="flex flex-col gap-2.5">
          <button onClick={() => { void confirmLogout(); }} className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all">
            Yes, log out
          </button>
          <button onClick={() => setLogoutModal(false)} className="w-full py-3 rounded-xl border border-border text-sm font-semibold text-on-surface-variant hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-all">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
    </>
  );
}
