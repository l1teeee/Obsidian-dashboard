import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useInactivityTimer } from './hooks/useInactivityTimer';
import SessionWarningModal from './components/shared/SessionWarningModal';
import CompleteProfile     from './pages/CompleteProfile';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Platforms from './pages/Platforms';
import PostDetail from './pages/PostDetail';
import Calendar from './pages/Calendar';
import PostComposer from './pages/PostComposer';
import Profile from './pages/Profile';
import Posts from './pages/Posts';
import Settings from './pages/Settings';
import AISettings from './pages/AISettings';
import Rivals from './pages/Rivals';
import CreateWorkspace from './pages/CreateWorkspace';
import LoginCard from './components/auth/LoginCard';
import RegisterCard from './components/auth/RegisterCard';
import CheckEmail from './pages/CheckEmail';

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

const AUTH_PATHS = ['/login', '/register', '/check-email', '/complete-profile', '/create-workspace'];

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
    const isAuthPage   = AUTH_PATHS.includes(pathname);
    const isCreatePage = pathname === '/create-workspace';
    if (isAuthPage) return;
    if (workspaces.length === 0 && !isCreatePage) navigate('/create-workspace', { replace: true, state: { from: pathname } });
    if (workspaces.length > 0  &&  isCreatePage)  navigate('/dashboard',        { replace: true });
  }, [workspaces.length, pathname, navigate, isAuthenticated, authLoading, wsLoading]);

  return <>{children}</>;
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
            <SessionGuard />
            <ScrollToTop />
            <TransitionDetector onTrigger={triggerTransition} />
            <RouteTransition active={transition} onDone={doneTransition} />
            <WorkspaceGuard>
              <Routes>
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

                {/* Dashboard app — requires auth */}
                <Route path="/" element={
                  <ProtectedRoute><DashboardLayout /></ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard"  element={<Dashboard />} />
                  <Route path="analytics"  element={<Analytics />} />
                  <Route path="platforms"  element={<Platforms />} />
                  <Route path="posts"      element={<Posts />} />
                  <Route path="posts/:id"  element={<PostDetail />} />
                  <Route path="calendar"   element={<Calendar />} />
                  <Route path="composer"      element={<PostComposer />} />
                  <Route path="composer/:id" element={<PostComposer />} />
                  <Route path="settings"     element={<Settings />} />
                  <Route path="rivals"      element={<Rivals />} />
                  <Route path="ai-settings" element={<AISettings />} />
                  <Route path="profile"     element={<Profile />} />
                </Route>
              </Routes>
            </WorkspaceGuard>
          </BrowserRouter>
        </LenisProvider>
      </WorkspaceProvider>
    </AuthProvider>
  );
}
