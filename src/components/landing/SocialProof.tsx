
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { SparklesCore } from '@/components/ui/sparkles';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { end: 12,  display: '12K+', suffix: 'K+', decimals: 0, label: 'Active users',  sub: 'Brands & creators' },
  { end: 3,   display: '3',    suffix: '',   decimals: 0, label: 'Platforms',      sub: 'IG · LI · FB' },
  { end: 98,  display: '98%',  suffix: '%',  decimals: 0, label: 'Satisfaction',   sub: '2,400+ reviews' },
  { end: 4.8, display: '4.8×', suffix: '×',  decimals: 1, label: 'Time saved',     sub: 'vs. managing manually' },
];

const logos = [
  { name: 'Wavefront',  abbr: 'WF', color: '#7c3aed' },
  { name: 'Luminary',   abbr: 'LM', color: '#0a66c2' },
  { name: 'Stackline',  abbr: 'SL', color: '#059669' },
  { name: 'Beacon Co',  abbr: 'BC', color: '#d97706' },
  { name: 'Onyx Labs',  abbr: 'OX', color: '#dc2626' },
  { name: 'Northpeak',  abbr: 'NP', color: '#7c3aed' },
  { name: 'Meridian',   abbr: 'MD', color: '#0891b2' },
  { name: 'Vantage',    abbr: 'VT', color: '#65a30d' },
];

function LogoPill({ name, abbr, color }: { name: string; abbr: string; color: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-3 backdrop-blur-sm">
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.5rem] font-extrabold text-white"
        style={{ backgroundColor: `${color}25` }}
      >
        <span style={{ color }}>{abbr}</span>
      </div>
      <span className="text-[0.78rem] font-semibold text-white/45 tracking-tight">{name}</span>
    </div>
  );
}

export default function SocialProof() {
  const rootRef = useRef<HTMLElement | null>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(rootRef.current, { opacity: 1 });
      gsap.set('[data-sp="label"],[data-sp="divider"],[data-sp="col"]', { opacity: 1, y: 0 });
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

      tl.fromTo(rootRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 }
      );

      tl.fromTo('[data-sp="label"]',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.2'
      );

      tl.fromTo('[data-sp="divider"]',
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.1'
      );

      tl.fromTo('[data-sp="col"]',
        { opacity: 0, y: 22, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.1 },
        '-=0.3'
      );

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
      className="relative bg-[#0a0a0a] pt-16 pb-20 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ── Trusted by label ────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1100px] px-6 md:px-12">
        <p
          data-sp="label"
          style={{ opacity: 0 }}
          className="mb-7 text-center text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/25"
        >
          Trusted by teams at
        </p>
      </div>

      {/* ── InfiniteSlider logo strip ────────────────── */}
      <div data-sp="divider" style={{ opacity: 0 }} className="relative mb-0">
        {/* Centered container — sides outside this are pure bg color */}
        <div className="relative mx-auto max-w-[860px] h-[60px] overflow-hidden">
          <InfiniteSlider className="flex h-full items-center" duration={35} gap={14}>
            {logos.map((l) => (
              <LogoPill key={l.name} {...l} />
            ))}
          </InfiniteSlider>

          {/* Solid-color fade to bg — makes edges fully black, not blurred */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />
        </div>
      </div>

      {/* ── Sparkles hemisphere ─────────────────────── */}
      <div className="relative -mt-6 h-[200px] w-full overflow-hidden [mask-image:radial-gradient(55%_60%,white,transparent)]">
        {/* Purple radial glow */}
        <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#7c29cc,transparent_65%)] before:opacity-35" />
        {/* Curved horizon line */}
        <div className="absolute -left-1/2 top-1/2 z-10 aspect-[1/0.55] w-[200%] rounded-[100%] border-t border-white/[0.08] bg-[#0a0a0a]" />
        {/* Sparkles particle field */}
        <SparklesCore
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_60%,white,transparent_80%)]"
          particleColor="#ffffff"
          particleDensity={60}
          minSize={0.6}
          maxSize={1.4}
          speed={1.2}
        />
      </div>

      {/* ── Stats counters ───────────────────────────── */}
      <div
        data-sp="divider"
        style={{ opacity: 0 }}
        className="relative z-10 mx-auto max-w-[1100px] px-6 md:px-12 -mt-4"
      >
        <div className="flex flex-col gap-12 md:flex-row md:gap-0">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-sp="col"
              style={{ opacity: 0 }}
              className="relative flex flex-1 flex-col items-center gap-2 text-center"
            >
              {i > 0 && (
                <div className="absolute left-0 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/[0.08] to-transparent md:block" />
              )}
              <div className="relative">
                <div className="absolute inset-0 -z-10 blur-[28px] opacity-10 bg-white rounded-full scale-75" />
                <span
                  ref={(el) => { numRefs.current[i] = el; }}
                  className="block bg-gradient-to-b from-white to-white/80 bg-clip-text text-[2.8rem] font-extrabold leading-none tracking-[-0.04em] text-transparent md:text-[3.2rem]"
                >
                  0{s.suffix}
                </span>
              </div>
              <span className="text-[0.85rem] font-semibold text-white/60">{s.label}</span>
              <span className="text-[0.68rem] tracking-wide text-white/50">{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
