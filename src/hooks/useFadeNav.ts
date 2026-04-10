import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

/**
 * Navega a una ruta con un fade-to-black suave antes de cambiar de página.
 * Usado en la landing para transiciones landing → login / register.
 */
export function useFadeNav() {
  const navigate = useNavigate();

  return useCallback((to: string) => {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position:      'fixed',
      inset:         '0',
      zIndex:        '9999',
      background:    '#030303',
      opacity:       '0',
      pointerEvents: 'all',
    });
    document.body.appendChild(overlay);

    gsap.to(overlay, {
      opacity:  1,
      duration: 0.32,
      ease:     'power2.in',
      onComplete() {
        navigate(to);
        requestAnimationFrame(() => {
          gsap.to(overlay, {
            opacity:  0,
            duration: 0.38,
            delay:    0.06,
            ease:     'power2.out',
            onComplete: () => overlay.remove(),
          });
        });
      },
    });
  }, [navigate]);
}
