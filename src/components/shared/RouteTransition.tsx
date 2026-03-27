import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface RouteTransitionProps {
  active: boolean;
  onDone: () => void;
}

export default function RouteTransition({ active, onDone }: RouteTransitionProps) {
  const rootRef  = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const logoRef  = useRef<HTMLDivElement>(null);
  const dotRef   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active || !rootRef.current) return;

    const root  = rootRef.current;
    const blobs = [blob1Ref.current, blob2Ref.current, blob3Ref.current];

    // Reset
    gsap.set(root,       { yPercent: 0, opacity: 1, backgroundColor: '#0e0e0e' });
    gsap.set(blobs,      { opacity: 0, scale: 0.3 });
    gsap.set(logoRef.current,  { opacity: 0, y: 14 });
    gsap.set(dotRef.current,   { opacity: 0, scale: 0 });

    const tl = gsap.timeline({ onComplete: onDone });

    tl
      // Blobs burst in
      .to(blob1Ref.current, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' })
      .to(blob2Ref.current, { opacity: 1, scale: 1, duration: 0.3,  ease: 'power3.out' }, '-=0.25')
      .to(blob3Ref.current, { opacity: 1, scale: 1, duration: 0.25, ease: 'power3.out' }, '-=0.2')

      // Flicker 1
      .to(root, { backgroundColor: '#1c0840', duration: 0.07 })
      .to(root, { backgroundColor: '#0e0e0e', duration: 0.09 })
      .to(root, { backgroundColor: '#1a0638', duration: 0.06 })
      .to(root, { backgroundColor: '#0e0e0e', duration: 0.1  })

      // Blob pulse
      .to(blob1Ref.current, { scale: 1.35, opacity: 0.85, duration: 0.2, ease: 'power1.inOut' }, '-=0.05')
      .to(blob1Ref.current, { scale: 1,    opacity: 1,    duration: 0.15 })

      // Flicker 2
      .to(root, { backgroundColor: '#1c0840', duration: 0.05 })
      .to(root, { backgroundColor: '#0e0e0e', duration: 0.08 })
      .to(root, { backgroundColor: '#17062f', duration: 0.06 })
      .to(root, { backgroundColor: '#0e0e0e', duration: 0.1  })

      // Logo + dot appear
      .to(dotRef.current,  { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' }, '-=0.05')
      .to(logoRef.current, { opacity: 1, y: 0,     duration: 0.3,  ease: 'power2.out' }, '-=0.15')

      // Flicker 3 (subtle, post-logo)
      .to(root, { backgroundColor: '#130524', duration: 0.08 })
      .to(root, { backgroundColor: '#0e0e0e', duration: 0.12 })

      // Dot pulse glow
      .to(dotRef.current, { scale: 1.4, duration: 0.18, ease: 'power1.inOut' })
      .to(dotRef.current, { scale: 1,   duration: 0.15 })

      // Hold
      .to({}, { duration: 0.18 })

      // Slide up — exit
      .to(root, { yPercent: -100, duration: 0.65, ease: 'power3.inOut' });

  }, [active, onDone]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[300] bg-[#0e0e0e] flex items-center justify-center overflow-hidden"
    >
      {/* Background blobs */}
      <div ref={blob1Ref} className="absolute w-[600px] h-[600px] rounded-full bg-[#d394ff]/12 blur-[120px]" />
      <div ref={blob2Ref} className="absolute w-[320px] h-[320px] rounded-full bg-[#9400e4]/22 blur-[80px] translate-x-32 translate-y-20" />
      <div ref={blob3Ref} className="absolute w-[250px] h-[250px] rounded-full bg-[#d394ff]/15 blur-[70px] -translate-x-28 -translate-y-24" />

      {/* Logo */}
      <div ref={logoRef} className="relative z-10 flex items-center gap-3">
        <span
          ref={dotRef}
          className="w-3.5 h-3.5 rounded-full bg-[#d394ff] shadow-[0_0_24px_rgba(211,148,255,1),0_0_60px_rgba(211,148,255,0.6),0_0_100px_rgba(211,148,255,0.3)]"
        />
        <span className="text-[26px] font-headline font-extrabold tracking-tight text-white">
          Obsidian Lens
        </span>
      </div>
    </div>
  );
}
