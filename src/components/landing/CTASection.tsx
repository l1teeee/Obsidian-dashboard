
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
          className="absolute inset-0 rounded-full border border-[#E7E0D0] bg-[#C8553A]/5 backdrop-blur-[2px]"
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
      <Shape width={480} height={115} rotate={12} gradient="from-[#C8553A]/[0.10]" className="left-[-7%] top-[18%]" delay={0} />
      <Shape width={360} height={90}  rotate={-13} gradient="from-[#A53F28]/[0.09]" className="right-[-5%] bottom-[22%]" delay={0.3} />
      <Shape width={180} height={48}  rotate={20}  gradient="from-[#C8553A]/[0.08]" className="right-[22%] top-[12%]" delay={0.5} />

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[480px] w-[700px] rounded-full bg-[#C8553A]/[0.05] blur-[120px]" />
      </div>

      {/* Border lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7E0D0] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D8D2C4]/50 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[860px]">
        {/* Workspace console panel */}
        <div data-cta="badge" style={{ opacity: 0 }} className="mx-auto mb-10 max-w-[520px] overflow-hidden rounded-2xl border border-[rgba(21,20,15,0.14)] bg-[#FFFFFF]">
          {/* Console chrome */}
          <div className="flex items-center gap-2 border-b border-[#3D3A30] bg-[#15140F] px-4 py-2.5">
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[#ff5f57]/60" />
              <div className="h-2 w-2 rounded-full bg-[#febc2e]/60" />
              <div className="h-2 w-2 rounded-full bg-[#28c840]/60" />
            </div>
            <div className="mx-auto flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8553A] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C8553A]" />
              </span>
              <span className="text-[0.6rem] font-medium text-[#F6F2EA]/70">Your workspace is ready</span>
            </div>
          </div>
          {/* Console lines */}
          <div className="space-y-2 p-5 font-mono">
            {[
              { prefix: '$', text: 'vielinks workspace create', color: 'text-[#C8553A]' },
              { prefix: '>', text: 'Connecting Instagram, LinkedIn, Facebook...', color: 'text-[#15140F]/40' },
              { prefix: '>', text: 'OAuth secured  Content calendar ready', color: 'text-[#15140F]/40' },
              { prefix: '✓', text: 'Your next content cycle starts here.', color: 'text-emerald-400' },
            ].map((line, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className={`shrink-0 text-[0.6rem] font-bold ${line.color}`}>{line.prefix}</span>
                <span className="text-[0.6rem] leading-relaxed text-[#15140F]/50">{line.text}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[0.6rem] font-bold text-[#C8553A]">$</span>
              <div className="h-[13px] w-px bg-[#C8553A] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2
          data-cta="title"
          style={{ opacity: 0 }}
          className="mb-6 text-center text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] text-[#15140F] md:text-[4.2rem]"
        >
          Your next content cycle
          <br />
          <span className="text-[#C8553A]">starts here.</span>
        </h2>

        {/* Subheadline */}
        <p
          data-cta="sub"
          style={{ opacity: 0 }}
          className="mx-auto mb-12 max-w-[520px] text-center text-[1.05rem] font-light leading-[1.75] text-on-surface-variant"
        >
          Plan, draft, approve, publish, and report — all from one workspace for Instagram, LinkedIn, and Facebook.
        </p>

        {/* Actions */}
        <div data-cta="actions" style={{ opacity: 0 }} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => fadeNav('/register')}
            className="group relative w-full overflow-hidden rounded-xl bg-[#C8553A] px-10 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#A53F28] sm:w-auto"
          >
            <span className="relative z-10">Create your workspace</span>
            <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
          <button
            onClick={() => fadeNav('/pricing')}
            className="w-full rounded-xl border border-[#D8D2C4] bg-[#FFFFFF] px-10 py-4 text-sm font-semibold text-on-surface-variant transition-all duration-300 hover:bg-[#EFE9DC] hover:border-[#C8553A]/40 sm:w-auto"
          >
            See pricing
          </button>
        </div>

        {/* Trust row */}
        <div data-cta="note" style={{ opacity: 0 }} className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {['14-day paid trial', 'No credit card required', 'Official OAuth', 'Cancel anytime'].map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-[0.72rem] text-[#6B655B]">
              <span className="h-1 w-1 rounded-full bg-[#C8553A]/50" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
