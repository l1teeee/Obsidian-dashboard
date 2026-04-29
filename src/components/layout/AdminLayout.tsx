import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../shared/Modal';

const NAV = [
  { to: '/admin',            icon: 'monitoring', label: 'Overview',   exact: true },
  { to: '/admin/users',      icon: 'group',      label: 'Users' },
  { to: '/admin/workspaces', icon: 'workspaces', label: 'Workspaces' },
  { to: '/admin/posts',      icon: 'article',    label: 'Posts' },
];

export default function AdminLayout() {
  const [open,        setOpen]        = useState(true);
  const [logoutModal, setLogoutModal] = useState(false);
  const { logout }  = useAuth();
  const navigate    = useNavigate();

  const confirmLogout = async () => {
    setLogoutModal(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const linkCls = (isActive: boolean) => [
    'flex items-center gap-3 rounded-xl py-2.5 px-3 text-sm font-headline transition-all duration-150 select-none',
    open ? '' : 'justify-center',
    isActive
      ? 'text-[#f87171] bg-[#f87171]/10 font-semibold'
      : 'text-[#988d9c] hover:text-white hover:bg-white/[0.04] active:scale-[0.97]',
  ].join(' ');

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={[
        'fixed top-0 left-0 h-full flex flex-col bg-[#0e0e0e] border-r border-[#4c4450]/15 z-50 transition-all duration-300',
        open ? 'w-[220px]' : 'w-[56px]',
      ].join(' ')}>

        {/* Brand */}
        <div className={['flex items-center gap-2.5 py-5 border-b border-[#4c4450]/10', open ? 'px-4' : 'px-3 justify-center'].join(' ')}>
          <div className="w-7 h-7 rounded-lg bg-[#f87171]/15 border border-[#f87171]/25 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#f87171]" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>
              shield
            </span>
          </div>
          {open && (
            <div className="overflow-hidden">
              <p className="text-xs font-extrabold text-white font-headline leading-tight">Vielinks</p>
              <p className="text-[9px] text-[#f87171] uppercase tracking-[0.15em] font-bold">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 p-2 overflow-y-auto scrollbar-none">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              title={!open ? item.label : undefined}
              className={({ isActive }) => linkCls(isActive)}
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined shrink-0"
                    style={{ fontSize: 18, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  {open && <span className="overflow-hidden whitespace-nowrap">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-[#4c4450]/10 flex flex-col gap-0.5">
          <NavLink
            to="/dashboard"
            title={!open ? 'Back to App' : undefined}
            className={linkCls(false)}
          >
            <span className="material-symbols-outlined shrink-0" style={{ fontSize: 18 }}>arrow_back</span>
            {open && <span>Back to App</span>}
          </NavLink>

          <button
            onClick={() => setLogoutModal(true)}
            title={!open ? 'Log out' : undefined}
            className={[linkCls(false), 'hover:text-[#f87171] hover:bg-[#f87171]/10 w-full text-left'].join(' ')}
          >
            <span className="material-symbols-outlined shrink-0" style={{ fontSize: 18 }}>logout</span>
            {open && <span>Log out</span>}
          </button>

          <div className="h-px bg-[#4c4450]/15 my-0.5" />

          <button
            onClick={() => setOpen(v => !v)}
            className={[linkCls(false), 'w-full text-left text-[#4c4450] hover:text-[#988d9c]'].join(' ')}
            title={open ? 'Collapse' : 'Expand'}
          >
            <span className="material-symbols-outlined shrink-0" style={{ fontSize: 18 }}>
              {open ? 'chevron_left' : 'chevron_right'}
            </span>
            {open && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={['flex-1 min-h-screen transition-all duration-300', open ? 'ml-[220px]' : 'ml-[56px]'].join(' ')}>
        <Outlet />
      </main>

      {/* Logout modal */}
      <Modal open={logoutModal} onClose={() => setLogoutModal(false)} maxWidth="max-w-sm">
        <div className="p-8">
          <div className="w-12 h-12 rounded-2xl bg-[#f87171]/10 border border-[#f87171]/20 flex items-center justify-center mb-5">
            <span className="material-symbols-outlined text-[#f87171]" style={{ fontSize: 22 }}>logout</span>
          </div>
          <h2 className="text-xl font-headline font-extrabold tracking-tight text-white mb-1">Log out?</h2>
          <p className="text-sm text-[#988d9c] mb-7">You will be redirected to the login screen.</p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => { void confirmLogout(); }}
              className="w-full py-3 rounded-xl bg-[#f87171] text-white font-bold text-sm hover:bg-[#fca5a5] transition-all"
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
    </div>
  );
}
