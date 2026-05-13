
import { useLayoutEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useFadeNav } from '@/hooks/useFadeNav';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Shape({
  width, height, rotate, gradient, className, delay,
}: {
  width: number; height: number; rotate: number; gradient: string; className?: string; delay: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: -60, rotate: rotate - 10 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={prefersReduced ? { duration: 0 } : { duration: 2.2, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.4 } }}
      className={`absolute pointer-events-none ${className}`}
    >
      <motion.div
        animate={prefersReduced ? {} : { y: [0, 14, 0] }}
        transition={{ duration: 10 + delay * 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width, height }}
        className="relative"
      >
        <div
          data-tone={gradient}
          className="absolute inset-0 rounded-full border border-white/[0.06] bg-[#7DD3C7]/[0.05] backdrop-blur-[2px]"
        />
      </motion.div>
    </motion.div>
  );
}

export default function CTASection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const fadeNav = useFadeNav();

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('[data-cta="badge"],[data-cta="title"],[data-cta="sub"],[data-cta="actions"],[data-cta="note"]', { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo('[data-cta="badge"]',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4 }, 0)
      .fromTo('[data-cta="title"]',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.65 }, '-=0.2')
      .fromTo('[data-cta="sub"]',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5 }, '-=0.35')
      .fromTo('[data-cta="actions"]',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }, '-=0.35')
      .fromTo('[data-cta="note"]',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4 }, '-=0.25');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="CTA" className="relative overflow-hidden px-6 py-40">
      {/* Shapes */}
      <Shape width={480} height={115} rotate={12} gradient="from-[#7DD3C7]/[0.10]" className="left-[-7%] top-[18%]" delay={0} />
      <Shape width={360} height={90}  rotate={-13} gradient="from-[#D6A86A]/[0.09]" className="right-[-5%] bottom-[22%]" delay={0.3} />
      <Shape width={180} height={48}  rotate={20}  gradient="from-[#7DD3C7]/[0.08]" className="right-[22%] top-[12%]" delay={0.5} />

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[480px] w-[700px] rounded-full bg-[#7DD3C7]/[0.05] blur-[120px]" />
      </div>

      {/* Border lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="relative z-10 mx-auto max-w-[820px] text-center">
        {/* Badge */}
        <div data-cta="badge" style={{ opacity: 0 }} className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.04] px-4 py-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7DD3C7] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#7DD3C7]" />
          </span>
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/50">Start publishing smarter</span>
        </div>

        {/* Title */}
        <h2
          data-cta="title"
          style={{ opacity: 0 }}
          className="mb-6 text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white md:text-[4.2rem]"
        >
          Stop switching tabs.
          <br />
          <span className="text-[#7DD3C7]">
            Publish with control.
          </span>
        </h2>

        {/* Subheadline */}
        <p
          data-cta="sub"
          style={{ opacity: 0 }}
          className="mx-auto mb-12 max-w-[520px] text-[1.05rem] font-light leading-[1.75] text-white/55"
        >
          Create a workspace for Instagram, LinkedIn, and Facebook. Plan content, publish consistently, and keep reporting in one place.
        </p>

        {/* Actions */}
        <div data-cta="actions" style={{ opacity: 0 }} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => fadeNav('/register')}
            className="group relative w-full overflow-hidden rounded-full bg-[#F4F1EC] px-10 py-4 text-sm font-bold text-[#0B0B0A] transition-all duration-300 hover:shadow-[0_0_50px_rgba(244,241,236,0.22)] sm:w-auto"
          >
            <span className="relative z-10">Start free</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
          <button
            onClick={() => fadeNav('/pricing')}
            className="w-full rounded-full border border-white/[0.10] bg-white/[0.03] px-10 py-4 text-sm font-semibold text-white/60 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.22] hover:text-white/80 sm:w-auto"
          >
            See pricing
          </button>
        </div>

        {/* Note */}
        <p data-cta="note" style={{ opacity: 0 }} className="mt-8 text-[0.75rem] tracking-wide text-white/50">
          14-day paid trial - No credit card required - Cancel anytime
        </p>
      </div>
    </section>
  );
}
