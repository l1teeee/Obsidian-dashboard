import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SileoToastProps {
  visible: boolean;
  icon?:   string;
  title:   string;
  body:    string;
}

export default function SileoToast({ visible, icon = 'draft', title, body }: SileoToastProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (visible) {
      gsap.killTweensOf(el);
      gsap.fromTo(
        el,
        { y: 64, opacity: 0, scale: 0.92, filter: 'blur(4px)' },
        { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.45, ease: 'back.out(1.5)' }
      );
    } else {
      gsap.killTweensOf(el);
      gsap.to(el, {
        y: 48, opacity: 0, scale: 0.93, filter: 'blur(4px)',
        duration: 0.3, ease: 'power2.in',
      });
    }
  }, [visible]);

  return (
    <div
      ref={ref}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] pointer-events-none"
      style={{ opacity: 0 }}
    >
      <div className="flex items-center gap-3 pl-3 pr-5 py-3 rounded-2xl bg-[#1a1a1a]/95 backdrop-blur-2xl border border-white/[0.07] shadow-[0_12px_48px_rgba(0,0,0,0.6),0_0_0_0.5px_rgba(255,255,255,0.04)]">
        {/* App icon */}
        <div className="w-10 h-10 rounded-xl bg-[#d394ff]/15 border border-[#d394ff]/20 flex items-center justify-center shrink-0">
          <span
            className="material-symbols-outlined text-[#d394ff]"
            style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>

        {/* Text */}
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-white leading-tight tracking-tight">{title}</p>
          <p className="text-[11px] text-[#988d9c] leading-tight mt-0.5 whitespace-nowrap">{body}</p>
        </div>
      </div>
    </div>
  );
}
