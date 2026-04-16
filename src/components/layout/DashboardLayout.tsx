import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import gsap from 'gsap';
import Sidebar from './Sidebar';
import ErrorBoundary from '../shared/ErrorBoundary';
import { LayoutProvider, useLayout } from '../../contexts/LayoutContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';

function Layout() {
  const { isOpen, toggle, close } = useLayout();
  const { active } = useWorkspace();
  const mainRef       = useRef<HTMLElement>(null);
  const prevActiveRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Skip the initial mount — only animate on actual switches
    if (prevActiveRef.current === undefined) {
      prevActiveRef.current = active?.id;
      return;
    }
    if (prevActiveRef.current === active?.id) return;
    prevActiveRef.current = active?.id;

    gsap.fromTo(mainRef.current,
      { opacity: 0.35, filter: 'blur(2px)' },
      { opacity: 1,    filter: 'blur(0px)', duration: 0.38, ease: 'power2.out' },
    );
  }, [active?.id]);

  return (
    <div className="min-h-screen bg-[#131313]">
      <Sidebar />

      {/* Floating toggle bubble — sits on the right edge of the sidebar, desktop only */}
      <button
        onClick={toggle}
        style={{ left: isOpen ? '224px' : '48px' }}
        className="hidden lg:flex fixed bottom-[130px] z-[60] w-8 h-8 rounded-full items-center justify-center
          bg-[#1a1a1a] border border-[#3d3d3d] text-[#988d9c]
          hover:bg-[#252525] hover:text-white active:scale-95
          transition-[left,transform,background-color,color] duration-300 ease-in-out"
        title={isOpen ? 'Colapsar sidebar' : 'Expandir sidebar'}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
          {isOpen ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>

      {/* Mobile-only backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Main content — on desktop always has margin (either 240px or 64px) */}
      <main ref={mainRef} className={`transition-[margin] duration-300 min-h-screen ${isOpen ? 'lg:ml-[240px]' : 'lg:ml-[64px]'}`}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <LayoutProvider>
      <Layout />
    </LayoutProvider>
  );
}
