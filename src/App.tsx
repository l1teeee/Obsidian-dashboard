import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useInactivityTimer } from './hooks/useInactivityTimer';
import SessionWarningModal from './components/shared/SessionWarningModal';
import KickedOutModal      from './components/shared/KickedOutModal';
import { logoutBeacon } from './services/auth.service';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { Toaster } from 'sileo';
import { AuthProvider } from './contexts/AuthContext';
import { WorkspaceProvider, useWorkspace } from './contexts/WorkspaceContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/shared/ProtectedRoute';
import RouteTransition from './components/shared/RouteTransition';
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy-loaded pages — each becomes its own chunk
const LandingPage    = lazy(() => import('./pages/LandingPage'));
const LoginCard      = lazy(() => import('./components/auth/LoginCard'));
const RegisterCard   = lazy(() => import('./components/auth/RegisterCard'));
const CheckEmail     = lazy(() => import('./pages/CheckEmail'));
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'));
const CreateWorkspace = lazy(() => import('./pages/CreateWorkspace'));
const Dashboard      = lazy(() => import('./pages/Dashboard'));
const Analytics      = lazy(() => import('./pages/Analytics'));
const Platforms      = lazy(() => import('./pages/Platforms'));
const Posts          = lazy(() => import('./pages/Posts'));
const PostDetail     = lazy(() => import('./pages/PostDetail'));
const Calendar       = lazy(() => import('./pages/Calendar'));
const PostComposer   = lazy(() => import('./pages/PostComposer'));
const Settings       = lazy(() => import('./pages/Settings'));
const Rivals         = lazy(() => import('./pages/Rivals'));
const AISettings     = lazy(() => import('./pages/AISettings'));
const Brand          = lazy(() => import('./pages/Brand'));
const Profile        = lazy(() => import('./pages/Profile'));

gsap.registerPlugin(ScrollTrigger);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    (window as Window & { __lenis?: Lenis }).__lenis = lenis;
    window.dispatchEvent(new Event('lenis:ready'));

    return () => {
      lenis.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}

const AUTH_PATHS = ['/', '/login', '/register', '/check-email', '/complete-profile', '/create-workspace'];

// Fires the transition when navigating FROM auth pages TO app pages
function TransitionDetector({ onTrigger }: { onTrigger: () => void }) {
  const { pathname } = useLocation();
  const prevPath = useRef('');

  useEffect(() => {
    const wasAuth = AUTH_PATHS.includes(prevPath.current);
    const isApp   = !AUTH_PATHS.includes(pathname);
    if (wasAuth && isApp && prevPath.current !== '') onTrigger();
    prevPath.current = pathname;
  }, [pathname, onTrigger]);

  return null;
}

// Redirect to /create-workspace if no workspaces exist,
// or away from /create-workspace if one already exists.
// Skips when unauthenticated (ProtectedRoute handles that).
function WorkspaceGuard({ children }: { children: ReactNode }) {
  const { workspaces, isLoading: wsLoading } = useWorkspace();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || wsLoading || !isAuthenticated) return;
    const isCreatePage = pathname === '/create-workspace';
    // Handle /create-workspace separately: redirect away if user already has workspaces
    if (isCreatePage) {
      if (workspaces.length > 0) navigate('/dashboard', { replace: true });
      return;
    }
    // Skip pure auth pages — ProtectedRoute handles them
    const isAuthPage = AUTH_PATHS.includes(pathname);
    if (isAuthPage) return;
    // App pages: redirect to /create-workspace if no workspace exists yet
    if (workspaces.length === 0) navigate('/create-workspace', { replace: true, state: { from: pathname } });
  }, [workspaces.length, pathname, navigate, isAuthenticated, authLoading, wsLoading]);

  return <>{children}</>;
}

function KickGuard() {
  const { kickedByDevice, clearKick } = useAuth();
  const navigate = useNavigate();

  if (!kickedByDevice) return null;

  return (
    <KickedOutModal
      onClose={() => { clearKick(); navigate('/login', { replace: true }); }}
    />
  );
}

function SessionGuard() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate  = useNavigate();
  const { pathname } = useLocation();
  // Keep modal in DOM briefly after showWarning→false so exit animation plays
  const [mounted, setMounted] = useState(false);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  // Close session in DB when the tab is closed or user navigates away
  useEffect(() => {
    if (!isAuthenticated) return;
    const handlePageHide = (e: PageTransitionEvent) => {
      if (!e.persisted) logoutBeacon();
    };
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, [isAuthenticated]);

  const { showWarning, countdown, keepAlive } = useInactivityTimer({
    enabled:  isAuthenticated && !!user?.profileCompleted && !AUTH_PATHS.includes(pathname),
    onLogout: handleLogout,
  });

  useEffect(() => {
    if (showWarning) {
      setMounted(true);
    } else {
      // Wait for exit animation (400ms) then unmount
      const id = setTimeout(() => setMounted(false), 400);
      return () => clearTimeout(id);
    }
  }, [showWarning]);

  if (!mounted) return null;

  return (
    <SessionWarningModal
      visible={showWarning}
      countdown={countdown}
      onKeepAlive={keepAlive}
      onLogout={handleLogout}
    />
  );
}

export default function App() {
  const [transition, setTransition] = useState(false);
  const triggerTransition = useCallback(() => setTransition(true),  []);
  const doneTransition    = useCallback(() => setTransition(false), []);

  return (
    <AuthProvider>
      <WorkspaceProvider>
        <LenisProvider>
          <Toaster
            position="bottom-center"
            options={{
              fill:   '#c5d247',
              styles: {
                title:       'text-[#1a1f00]!',
                description: 'text-[#3a4700]!',
                badge:       'bg-[#1a1f00]! border-[#1a1f00]! text-[#c5d247]!',
              },
            }}
          />
          <BrowserRouter>
            <KickGuard />
            <SessionGuard />
            <ScrollToTop />
            <TransitionDetector onTrigger={triggerTransition} />
            <RouteTransition active={transition} onDone={doneTransition} />
            <WorkspaceGuard>
              <Suspense fallback={null}>
              <Routes>
                {/* Landing page — public */}
                <Route path="/" element={<LandingPage />} />

                {/* Auth — public */}
                <Route path="/login"        element={<LoginCard />} />
                <Route path="/register"     element={<RegisterCard />} />
                <Route path="/check-email"  element={<CheckEmail />} />

                {/* Profile completion — requires auth, accessible before profile is complete */}
                <Route path="/complete-profile" element={
                  <ProtectedRoute requireProfileCompleted={false}>
                    <CompleteProfile />
                  </ProtectedRoute>
                } />

                {/* Workspace creation — requires auth */}
                <Route path="/create-workspace" element={
                  <ProtectedRoute><CreateWorkspace /></ProtectedRoute>
                } />

                {/* Dashboard app — requires auth (pathless layout, children use absolute paths) */}
                <Route element={
                  <ProtectedRoute><DashboardLayout /></ProtectedRoute>
                }>
                  <Route path="/dashboard"    element={<Dashboard />} />
                  <Route path="/analytics"    element={<Analytics />} />
                  <Route path="/platforms"    element={<Platforms />} />
                  <Route path="/posts"        element={<Posts />} />
                  <Route path="/posts/:id"    element={<PostDetail />} />
                  <Route path="/calendar"     element={<Calendar />} />
                  <Route path="/composer"     element={<PostComposer />} />
                  <Route path="/composer/:id" element={<PostComposer />} />
                  <Route path="/settings"     element={<Settings />} />
                  <Route path="/rivals"       element={<Rivals />} />
                  <Route path="/ai-settings"  element={<AISettings />} />
                  <Route path="/brand"        element={<Brand />} />
                  <Route path="/profile"      element={<Profile />} />
                </Route>
              </Routes>
              </Suspense>
            </WorkspaceGuard>
          </BrowserRouter>
        </LenisProvider>
      </WorkspaceProvider>
    </AuthProvider>
  );
}
