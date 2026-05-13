import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useInactivityTimer } from './hooks/useInactivityTimer';
import SessionWarningModal    from './components/shared/SessionWarningModal';
import KickedOutModal         from './components/shared/KickedOutModal';
import AccountDisabledModal   from './components/shared/AccountDisabledModal';
import FacebookTokenModal, { FB_TOKEN_DISMISSED_KEY } from './components/shared/FacebookTokenModal';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { Toaster } from 'sileo';
import { TooltipProvider } from './components/ui/tooltip';
import { AuthProvider } from './contexts/AuthContext';
import { WorkspaceProvider, useWorkspace } from './contexts/WorkspaceContext';
import { useAuth } from './hooks/useAuth';
import { apiFetch } from './lib/api';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AdminRoute     from './components/shared/AdminRoute';
import RouteTransition from './components/shared/RouteTransition';
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy-loaded pages — each becomes its own chunk
const LandingPage    = lazy(() => import('./pages/LandingPage'));
const PricingPage    = lazy(() => import('./pages/PricingPage'));
const NotFound       = lazy(() => import('./pages/NotFound'));
const FAQPage        = lazy(() => import('./pages/FAQPage'));
const LoginCard      = lazy(() => import('./components/auth/LoginCard'));
const RegisterCard   = lazy(() => import('./components/auth/RegisterCard'));
const CheckEmail      = lazy(() => import('./pages/CheckEmail'));
const ForgotPassword  = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword   = lazy(() => import('./pages/ResetPassword'));
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
const Profile          = lazy(() => import('./pages/Profile'));
const ActivityHistory  = lazy(() => import('./pages/ActivityHistory'));
const Checkout            = lazy(() => import('./pages/Checkout'));
const ProductDashboard    = lazy(() => import('./pages/ProductDashboard'));
const ProductAnalytics    = lazy(() => import('./pages/ProductAnalytics'));
const ProductScheduler    = lazy(() => import('./pages/ProductScheduler'));
const ProductAIInsights   = lazy(() => import('./pages/ProductAIInsights'));
const ProductIntegrations = lazy(() => import('./pages/ProductIntegrations'));

// Admin pages
const AdminOverview     = lazy(() => import('./pages/admin/AdminOverview'));
const AdminUsers        = lazy(() => import('./pages/admin/AdminUsers'));
const AdminWorkspaces   = lazy(() => import('./pages/admin/AdminWorkspaces'));
const AdminPosts        = lazy(() => import('./pages/admin/AdminPosts'));
const AdminAdmins       = lazy(() => import('./pages/admin/AdminAdmins'));
const AdminPermissions  = lazy(() => import('./pages/admin/AdminPermissions'));
const AdminRoles        = lazy(() => import('./pages/admin/AdminRoles'));
const AdminTokens       = lazy(() => import('./pages/admin/AdminTokens'));
const AdminInvite       = lazy(() => import('./pages/AdminInvite'));

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

const AUTH_PATHS = ['/', '/pricing', '/faq', '/login', '/register', '/check-email', '/forgot-password', '/reset-password', '/complete-profile', '/create-workspace',
  '/product/dashboard', '/product/analytics', '/product/scheduler', '/product/ai-insights', '/product/integrations'];

// Admin routes bypass WorkspaceGuard (admin doesn't need a workspace)
const isAdminPath = (path: string) => path.startsWith('/admin');

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
    if (isAdminPath(pathname)) return; // admin doesn't need a workspace
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

function AccountDisabledGuard() {
  const { accountDisabled, clearAccountDisabled } = useAuth();
  const navigate = useNavigate();

  if (!accountDisabled) return null;

  return (
    <AccountDisabledModal
      onClose={() => { clearAccountDisabled(); navigate('/login', { replace: true }); }}
    />
  );
}

function FacebookTokenGuard() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => {
      if (localStorage.getItem(FB_TOKEN_DISMISSED_KEY)) return;
      setShow(true);
    };
    window.addEventListener('facebook:token-expired', handler);
    return () => window.removeEventListener('facebook:token-expired', handler);
  }, []);

  if (!show) return null;
  return <FacebookTokenModal onClose={() => setShow(false)} />;
}

// Pings /auth/ping on every route change to detect account deactivation early.
// apiFetch handles the 401 response and dispatches auth:account-disabled if needed.
function RouteChangeGuard() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isAuthenticated) return;
    void apiFetch('/auth/ping').catch(() => {});
  }, [pathname, isAuthenticated]);

  return null;
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

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e0e0e] px-6 text-[#e5e2e1]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border border-[#d394ff]/20" />
          <div className="absolute inset-1 animate-spin rounded-full border-2 border-[#d394ff] border-t-transparent" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#988d9c]">
          Loading Vielinks
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [transition, setTransition] = useState(false);
  const triggerTransition = useCallback(() => setTransition(true),  []);
  const doneTransition    = useCallback(() => setTransition(false), []);

  return (
    <AuthProvider>
      <WorkspaceProvider>
        <TooltipProvider delayDuration={400}>
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
            <AccountDisabledGuard />
            <FacebookTokenGuard />
            <RouteChangeGuard />
            <SessionGuard />
            <ScrollToTop />
            <TransitionDetector onTrigger={triggerTransition} />
            <RouteTransition active={transition} onDone={doneTransition} />
            <WorkspaceGuard>
              <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* Landing page — public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/faq"     element={<FAQPage />} />

                {/* Product pages — public */}
                <Route path="/product/dashboard"    element={<ProductDashboard />} />
                <Route path="/product/analytics"    element={<ProductAnalytics />} />
                <Route path="/product/scheduler"    element={<ProductScheduler />} />
                <Route path="/product/ai-insights"  element={<ProductAIInsights />} />
                <Route path="/product/integrations" element={<ProductIntegrations />} />

                {/* Auth — public */}
                <Route path="/login"        element={<LoginCard />} />
                <Route path="/register"     element={<RegisterCard />} />
                <Route path="/check-email"     element={<CheckEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password"  element={<ResetPassword />} />
                <Route path="/admin-invite"    element={<AdminInvite />} />

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
                <Route path="/checkout" element={
                  <ProtectedRoute><Checkout /></ProtectedRoute>
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
                  <Route path="/activity"    element={<ActivityHistory />} />
                </Route>

                {/* Admin — requires role=admin */}
                <Route element={
                  <AdminRoute><DashboardLayout /></AdminRoute>
                }>
                  <Route path="/admin"                 element={<AdminOverview />} />
                  <Route path="/admin/users"           element={<AdminUsers />} />
                  <Route path="/admin/workspaces"      element={<AdminWorkspaces />} />
                  <Route path="/admin/posts"           element={<AdminPosts />} />
                  <Route path="/admin/admins"          element={<AdminAdmins />} />
                  <Route path="/admin/permissions"     element={<AdminPermissions />} />
                  <Route path="/admin/roles"           element={<AdminRoles />} />
                  <Route path="/admin/tokens"          element={<AdminTokens />} />
                </Route>

                {/* 404 — catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </WorkspaceGuard>
          </BrowserRouter>
        </LenisProvider>
        </TooltipProvider>
      </WorkspaceProvider>
    </AuthProvider>
  );
}
