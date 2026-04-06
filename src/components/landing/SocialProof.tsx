
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const brands = ['Vogue', 'Hypebeast', 'Highsnobiety', 'Dazed', 'i-D', 'AnOther'];

const stats = [
  { value: '12k+', label: 'Brands' },
  { value: '4', label: 'Platforms' },
  { value: '98%', label: 'Satisfaction' },
];

export default function SocialProof() {
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo('[data-sp="stat"]',
        { opacity: 0, y: 14, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.06 },
        0
      )
      .fromTo('[data-sp="line"]',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: 'power2.inOut' },
        0.1
      )
      .fromTo('[data-sp="label"]',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35 },
        '-=0.2'
      )
      .fromTo('[data-sp="brand"]',
        { opacity: 0, y: 12, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05 },
        '-=0.15'
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-[#030303] py-20">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d394ff]/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Stats row */}
        <div className="mb-14 flex items-center justify-center gap-10 md:gap-20">
          {stats.map((s, i) => (
            <div key={s.label} data-sp="stat" className="flex flex-col items-center gap-1" style={{ opacity: 0 }}>
              <span className="text-2xl font-bold tracking-tight text-white">{s.value}</span>
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/30">{s.label}</span>
              {i < stats.length - 1 && (
                <div className="absolute hidden md:block w-px h-8 bg-white/[0.06]" />
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div data-sp="line" className="mb-10 h-px origin-left bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" style={{ transform: 'scaleX(0)' }} />

        {/* Label */}
        <p data-sp="label" className="mb-8 text-center text-[0.68rem] font-medium uppercase tracking-[0.26em] text-white/20" style={{ opacity: 0 }}>
          Trusted by the world's most creative networks
        </p>

        {/* Brands */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {brands.map((brand) => (
            <span
              key={brand}
              data-sp="brand"
              style={{ opacity: 0 }}
              className="select-none rounded-full border border-white/[0.06] bg-white/[0.02] px-6 py-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-white/40 transition-all duration-300 hover:border-[#d394ff]/25 hover:bg-[#d394ff]/[0.04] hover:text-white/70"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
