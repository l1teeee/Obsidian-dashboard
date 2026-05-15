import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { AUTH_MOTION } from '@/lib/authMotion';

export function useAuthEntryAnimation() {
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isRouteTransition = document.documentElement.dataset.authGsapTransition === 'true';

    if (prefersReducedMotion || isRouteTransition) return;

    const panels = gsap.utils.toArray<HTMLElement>('[data-auth-panel]');
    const formInner = document.querySelector<HTMLElement>('[data-auth-form-inner]');

    if (panels.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(panels, {
        opacity: 0,
        filter: `blur(${AUTH_MOTION.entry.blur}px)`,
        scale: AUTH_MOTION.entry.scale,
        transformOrigin: 'center',
      });

      if (formInner) {
        gsap.set(formInner, {
          opacity: 0,
          y: AUTH_MOTION.entry.innerY,
        });
      }

      const tl = gsap.timeline({ defaults: { ease: AUTH_MOTION.easeOut } });

      tl.to(panels, {
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        duration: AUTH_MOTION.entry.duration,
        stagger: AUTH_MOTION.entry.stagger,
        clearProps: 'opacity,filter,scale,transformOrigin',
      });

      if (formInner) {
        tl.to(formInner, {
          opacity: 1,
          y: 0,
          duration: AUTH_MOTION.entry.innerDuration,
          clearProps: 'opacity,transform',
        }, '-=0.3');
      }
    });

    return () => ctx.revert();
  }, []);
}
