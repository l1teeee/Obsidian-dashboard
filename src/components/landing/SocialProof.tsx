
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { end: 12, display: '12K+', suffix: 'K+', decimals: 0, label: 'Active users',   sub: 'Brands & creators' },
  { end: 3,  display: '3',    suffix: '',   decimals: 0, label: 'Platforms',       sub: 'IG · LI · FB' },
  { end: 98, display: '98%',  suffix: '%',  decimals: 0, label: 'Satisfaction',    sub: '2,400+ reviews' },
  { end: 4.8,display: '4.8×', suffix: '×',  decimals: 1, label: 'Time saved',      sub: 'vs. managing manually' },
];

export default function SocialProof() {
  const rootRef  = useRef<HTMLElement | null>(null);
  const numRefs  = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(rootRef.current, { opacity: 1 });
      gsap.set('[data-sp="col"]', { opacity: 1, y: 0 });
      numRefs.current.forEach((el, i) => { if (el) el.textContent = stats[i].display; });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 82%',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      // Reveal section
      tl.fromTo(rootRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 }
      );

      // Stagger columns
      tl.fromTo('[data-sp="col"]',
        { opacity: 0, y: 22, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.1 },
        '-=0.2'
      );

      // Count-up per number
      stats.forEach((s, i) => {
        const el = numRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        tl.to(obj, {
          val: s.end,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate() {
            const v = s.decimals === 0 ? Math.round(obj.val) : obj.val.toFixed(s.decimals);
            el.textContent = `${v}${s.suffix}`;
          },
        }, '-=1.0');
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      style={{ opacity: 0 }}
      className="relative bg-[#030303] py-20 overflow-hidden"
    >
      {/* Top + bottom hairlines */}
      <div className="absolute inset-x-0 top-0    h-px bg-gradient-to-r from-transparent via-[#d394ff]/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04]  to-transparent" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[260px] w-[600px] rounded-full bg-[#d394ff]/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-[1100px] px-6 md:px-12">
        <div className="flex flex-col gap-12 md:flex-row md:gap-0">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-sp="col"
              style={{ opacity: 0 }}
              className="relative flex flex-1 flex-col items-center gap-2 text-center"
            >
              {/* Vertical separator (not on first item) */}
              {i > 0 && (
                <div className="absolute left-0 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/[0.08] to-transparent md:block" />
              )}

              {/* Number */}
              <div className="relative">
                {/* Subtle glow behind number */}
                <div className="absolute inset-0 -z-10 blur-[28px] opacity-30 bg-[#d394ff] rounded-full scale-75" />
                <span
                  ref={(el) => { numRefs.current[i] = el; }}
                  className="block bg-gradient-to-b from-white to-white/80 bg-clip-text text-[2.8rem] font-extrabold leading-none tracking-[-0.04em] text-transparent md:text-[3.2rem]"
                >
                  0{s.suffix}
                </span>
              </div>

              {/* Label */}
              <span className="text-[0.85rem] font-semibold text-white/60">
                {s.label}
              </span>

              {/* Sub */}
              <span className="text-[0.68rem] tracking-wide text-white/50">
                {s.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
