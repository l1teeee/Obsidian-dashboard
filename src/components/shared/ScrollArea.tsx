import { useRef, useEffect } from 'react';

interface ScrollAreaProps {
  className?: string;
  children: React.ReactNode;
}

export default function ScrollArea({ className = '', children }: ScrollAreaProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let target   = el.scrollTop;
    let rafId    = 0;

    const animate = () => {
      const diff = target - el.scrollTop;
      if (Math.abs(diff) < 0.5) {
        el.scrollTop = target;
        return;
      }
      el.scrollTop += diff * 0.1; // easing — lower = smoother
      rafId = requestAnimationFrame(animate);
    };

    const onWheel = (e: WheelEvent) => {
      const { scrollHeight, clientHeight } = el;
      const maxScroll = scrollHeight - clientHeight;

      target = Math.max(0, Math.min(maxScroll, target + e.deltaY));

      const atTop    = target <= 0         && e.deltaY < 0;
      const atBottom = target >= maxScroll && e.deltaY > 0;
      if (!atTop && !atBottom) e.preventDefault();

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(animate);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={ref} className={`overflow-y-auto ${className}`}>
      {children}
    </div>
  );
}
