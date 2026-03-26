import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MockPlatformRepository } from '../infrastructure/repositories/MockPlatformRepository';
import type { ConnectedPlatform } from '../domain/entities/Platform';

export function usePlatforms() {
  const pageRef  = useRef<HTMLDivElement>(null);
  const repo     = new MockPlatformRepository();
  const platforms: ConnectedPlatform[] = repo.getConnectedPlatforms();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-header-section]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' });
      gsap.fromTo('[data-platform-card]',  { scale: 0.96, y: 20, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.4)', delay: 0.15 });
      gsap.fromTo('[data-add-card]',       { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.2)', delay: 0.5 });
      gsap.fromTo('[data-status-bar]',     { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.55 });
    }, pageRef.current!);

    return () => ctx.revert();
  }, []);

  return { platforms, pageRef };
}
