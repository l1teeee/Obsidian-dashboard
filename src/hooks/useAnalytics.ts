import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MockAnalyticsRepository } from '../infrastructure/repositories/MockAnalyticsRepository';
import type { AnalyticsData } from '../domain/entities/Analytics';

export function useAnalytics() {
  const pageRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const repo: MockAnalyticsRepository = new MockAnalyticsRepository();
  const data: AnalyticsData           = repo.getAnalyticsData();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-kpi]',           { y: 20, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.1 });
      gsap.from('[data-chart]',         { y: 24, opacity: 0, duration: 0.55, stagger: 0.12, ease: 'power3.out', delay: 0.2 });
      gsap.from('[data-bar]',           { scaleY: 0, duration: 0.7, stagger: 0.05, ease: 'back.out(1.2)', delay: 0.35, transformOrigin: 'bottom center' });
      gsap.from('[data-platform-stat]', { y: 16, opacity: 0, duration: 0.45, stagger: 0.1, ease: 'power2.out', delay: 0.3 });
      gsap.from('[data-stat-bar]',      { scaleX: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.5, transformOrigin: 'left center' });
      gsap.from('[data-table-row]',     { y: 8, opacity: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out', delay: 0.4 });

      const path = document.querySelector<SVGPathElement>('[data-line-path]');
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path,  { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', delay: 0.4 });
      }
    }, pageRef.current!);

    return () => ctx.revert();
  }, []);

  return { data, pageRef, pathRef };
}
