import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ open, onClose, children, maxWidth = 'max-w-lg' }: ModalProps) {
  const [mounted, setMounted]   = useState(false);
  const backdropRef             = useRef<HTMLDivElement>(null);
  const panelRef                = useRef<HTMLDivElement>(null);

  // Mount on open; unmount only after exit animation
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  // Entrance / exit animations
  useEffect(() => {
    if (!mounted) return;

    if (open) {
      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power1.out' }
      );
      gsap.fromTo(panelRef.current,
        { opacity: 0, scale: 0.95, y: 14 },
        { opacity: 1, scale: 1,    y: 0,  duration: 0.3, ease: 'power2.out' }
      );
    } else {
      const tl = gsap.timeline({ onComplete: () => setMounted(false) });
      tl.to(panelRef.current,   { opacity: 0, scale: 0.96, y: 8,  duration: 0.18, ease: 'power2.in' })
        .to(backdropRef.current, { opacity: 0,                      duration: 0.18, ease: 'power1.in' }, '-=0.1');
    }
  }, [open, mounted]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Block Lenis wheel propagation
  useEffect(() => {
    if (!mounted) return;
    const el = panelRef.current;
    if (!el) return;
    const stop = (e: WheelEvent) => e.stopPropagation();
    el.addEventListener('wheel', stop, { passive: true });
    return () => el.removeEventListener('wheel', stop);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={`relative z-10 w-full ${maxWidth} glass-card rounded-3xl border border-[#4c4450]/20 shadow-2xl shadow-black/60`}
      >
        {children}
      </div>
    </div>
  );
}
