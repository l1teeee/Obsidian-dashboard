import { useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { AUTH_MOTION } from '@/lib/authMotion';

type LenisLike = {
  scrollTo?: (target: number, options?: { immediate?: boolean }) => void;
  start?: () => void;
  stop?: () => void;
};

type PanelClone = {
  el: HTMLElement;
  rect: DOMRect;
};

const getAuthPanels = () => ({
  form: document.querySelector<HTMLElement>('[data-auth-panel="form"]'),
  visual: document.querySelector<HTMLElement>('[data-auth-panel="visual"]'),
});

const getLenis = () => (window as Window & { __lenis?: LenisLike }).__lenis;

function clonePanel(source: HTMLElement): PanelClone {
  const rect = source.getBoundingClientRect();
  const clone = source.cloneNode(true) as HTMLElement;

  clone.removeAttribute('data-auth-panel');
  clone.setAttribute('aria-hidden', 'true');

  Object.assign(clone.style, {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: '0',
    zIndex: '10000',
    pointerEvents: 'none',
    overflow: 'hidden',
    transform: 'translate3d(0, 0, 0)',
    transformOrigin: 'center',
    willChange: 'transform, opacity, filter, width, height',
  });

  return { el: clone, rect };
}

function animateCloneTo(clone: PanelClone, target: HTMLElement, vars: gsap.TweenVars) {
  const next = target.getBoundingClientRect();

  return gsap.to(clone.el, {
    x: next.left - clone.rect.left,
    y: next.top - clone.rect.top,
    width: next.width,
    height: next.height,
    ...vars,
  });
}

export function useAuthTransitionNav() {
  const navigate = useNavigate();
  const transitioningRef = useRef(false);

  return useCallback((to: string) => {
    if (transitioningRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const currentPanels = getAuthPanels();

    if (prefersReducedMotion || !currentPanels.form || !currentPanels.visual) {
      navigate(to);
      return;
    }

    transitioningRef.current = true;
    document.documentElement.dataset.authGsapTransition = 'true';

    const lenis = getLenis();
    lenis?.stop?.();
    lenis?.scrollTo?.(0, { immediate: true });

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '9999',
      overflow: 'hidden',
      pointerEvents: 'none',
      background: 'transparent',
    });

    const formClone = clonePanel(currentPanels.form);
    const visualClone = clonePanel(currentPanels.visual);
    overlay.append(visualClone.el, formClone.el);
    document.body.appendChild(overlay);

    gsap.set([currentPanels.form, currentPanels.visual], { opacity: 0 });

    flushSync(() => navigate(to));

    const nextPanels = getAuthPanels();

    if (!nextPanels.form || !nextPanels.visual) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.24,
        ease: 'power2.out',
        onComplete: () => {
          overlay.remove();
          lenis?.start?.();
          delete document.documentElement.dataset.authGsapTransition;
          transitioningRef.current = false;
        },
      });
      return;
    }

    gsap.set([nextPanels.form, nextPanels.visual], {
      opacity: 0,
      filter: `blur(${AUTH_MOTION.route.startBlur}px)`,
      scale: AUTH_MOTION.route.startScale,
      transformOrigin: 'center',
    });

    const tl = gsap.timeline({
      defaults: { ease: AUTH_MOTION.easeMove },
      onComplete: () => {
        gsap.set([nextPanels.form, nextPanels.visual], { clearProps: 'opacity,filter,scale,transformOrigin' });
        overlay.remove();
        lenis?.start?.();
        delete document.documentElement.dataset.authGsapTransition;
        transitioningRef.current = false;
      },
    });

    tl.add(animateCloneTo(formClone, nextPanels.form, {
      opacity: 0,
      filter: `blur(${AUTH_MOTION.route.formBlur}px)`,
      scale: 0.998,
      duration: AUTH_MOTION.route.cloneDuration,
    }), 0);

    tl.add(animateCloneTo(visualClone, nextPanels.visual, {
      opacity: 0,
      filter: `blur(${AUTH_MOTION.route.panelBlur}px)`,
      scale: 0.998,
      duration: AUTH_MOTION.route.cloneDuration,
    }), 0);

    tl.to(nextPanels.visual, {
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      duration: AUTH_MOTION.route.panelEnterDuration,
      ease: AUTH_MOTION.easeOut,
    }, AUTH_MOTION.route.panelEnterDelay);

    tl.to(nextPanels.form, {
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      duration: AUTH_MOTION.route.formEnterDuration,
      ease: AUTH_MOTION.easeOut,
    }, AUTH_MOTION.route.formEnterDelay);
  }, [navigate]);
}
