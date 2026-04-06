
import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Shape({
  width, height, rotate, gradient, className, delay,
}: {
  width: number; height: number; rotate: number; gradient: string; className?: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -60, rotate: rotate - 10 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 2.2, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.4 } }}
      className={`absolute pointer-events-none ${className}`}
    >
      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 10 + delay * 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[2px] border border-[#d394ff]/[0.16] shadow-[0_8px_40px_0_rgba(211,148,255,0.10)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_40%_40%,rgba(211,148,255,0.16),transparent_65%)]`}
        />
      </motion.div>
    </motion.div>
  );
}

export default function CTASection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

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
        { opacity: 0, y: 12, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4 },
        0
      )
      .fromTo('[data-cta="title"]',
        { opacity: 0, y: 30, filter: 'blur(12px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65 },
        '-=0.2'
      )
      .fromTo('[data-cta="actions"]',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.35'
      )
      .fromTo('[data-cta="note"]',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.25'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="CTA" className="relative overflow-hidden px-6 py-44">
      {/* Shapes — matching hero style */}
      <Shape width={500} height={120} rotate={12} gradient="from-[#d394ff]/[0.12]" className="left-[-8%] top-[15%]" delay={0} />
      <Shape width={400} height={100} rotate={-14} gradient="from-[#aa30fa]/[0.10]" className="right-[-6%] bottom-[20%]" delay={0.3} />
      <Shape width={200} height={55} rotate={20} gradient="from-[#c97cff]/[0.10]" className="right-[20%] top-[10%]" delay={0.5} />
      <Shape width={140} height={38} rotate={-22} gradient="from-[#d394ff]/[0.08]" className="left-[25%] bottom-[15%]" delay={0.4} />

      {/* Central glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[700px] rounded-full bg-[#d394ff]/[0.06] blur-[120px]" />
      </div>

      {/* Top / bottom gradient lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d394ff]/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="relative z-10 mx-auto max-w-[860px] text-center">
        {/* Badge */}
        <div data-cta="badge" style={{ opacity: 0 }} className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#d394ff]/20 bg-[#d394ff]/[0.07] px-4 py-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d394ff] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
          </span>
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#d394ff]/80">Start today</span>
        </div>

        {/* Title */}
        <h2
          data-cta="title"
          style={{ opacity: 0 }}
          className="mb-14 text-5xl font-extrabold leading-[1.0] tracking-[-0.04em] text-white md:text-7xl"
        >
          Ready to refine
          <br />
          <span className="bg-gradient-to-r from-[#c97cff] via-[#f0dcff] to-[#aa30fa] bg-clip-text text-transparent">
            your reach?
          </span>
        </h2>

        {/* Actions */}
        <div data-cta="actions" style={{ opacity: 0 }} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="group relative w-full overflow-hidden rounded-full bg-[#d394ff] px-10 py-4 text-sm font-bold text-[#3a0060] transition-all duration-300 hover:shadow-[0_0_50px_rgba(211,148,255,0.4)] sm:w-auto">
            <span className="relative z-10">Start Free Trial</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#d394ff] to-[#f0dcff] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
          <button className="w-full rounded-full border border-white/[0.10] bg-white/[0.03] px-10 py-4 text-sm font-semibold text-white/50 backdrop-blur-xl transition-all duration-300 hover:border-[#d394ff]/30 hover:text-white/70 sm:w-auto">
            Book Concierge Demo
          </button>
        </div>

        {/* Note */}
        <p data-cta="note" style={{ opacity: 0 }} className="mt-8 text-xs tracking-wide text-white/25">
          No credit card required · Cancel anytime · Seamless migration from HubSpot or Salesforce
        </p>
      </div>
    </section>
  );
}
