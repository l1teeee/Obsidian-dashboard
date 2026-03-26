import { useEffect, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Platforms from './pages/Platforms';
import PostDetail from './pages/PostDetail';
import Calendar from './pages/Calendar';
import PostComposer from './pages/PostComposer';
import Profile from './pages/Profile';
import Posts from './pages/Posts';
import LoginCard from './components/auth/LoginCard';
import RegisterCard from './components/auth/RegisterCard';

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

export default function App() {
  return (
    <LenisProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Dashboard app */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="platforms" element={<Platforms />} />
            <Route path="posts" element={<Posts />} />
            <Route path="posts/:id" element={<PostDetail />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="composer" element={<PostComposer />} />
            <Route path="settings" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<LoginCard />} />
          <Route path="/register" element={<RegisterCard />} />
        </Routes>
      </BrowserRouter>
    </LenisProvider>
  );
}
