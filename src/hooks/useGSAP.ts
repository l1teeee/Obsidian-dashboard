import { type DependencyList, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGSAP<T extends HTMLElement = HTMLDivElement>(
  callback: () => void,
  deps: DependencyList = [],
) {
  const scopeRef = useRef<T>(null);

  useEffect(() => {
    let ctx: gsap.Context;

    const run = () => {
      ScrollTrigger.refresh();
      ctx = gsap.context(callback, scopeRef.current ?? document.body);
    };

    if ((window as Window & { __lenis?: unknown }).__lenis) {
      run();
    } else {
      window.addEventListener('lenis:ready', run, { once: true });
    }

    return () => {
      window.removeEventListener('lenis:ready', run);
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
