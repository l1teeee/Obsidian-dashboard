
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '12K+', label: 'Active users', detail: 'Brands & creators' },
  { value: '3',    label: 'Platforms',    detail: 'Instagram · LinkedIn · Facebook' },
  { value: '98%',  label: 'Satisfaction', detail: 'Based on 2,400+ reviews' },
  { value: '4.8×', label: 'Time saved',   detail: 'Vs managing manually' },
];

export default function SocialProof() {
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      })
      .fromTo('[data-sp="stat"]',
        { opacity: 0, y: 16, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.07 }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-[#030303] py-16 md:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d394ff]/18 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} data-sp="stat" style={{ opacity: 0 }} className="flex flex-col gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">{s.value}</span>
              <span className="text-[0.82rem] font-semibold text-white/60">{s.label}</span>
              <span className="text-[0.68rem] text-white/25">{s.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
