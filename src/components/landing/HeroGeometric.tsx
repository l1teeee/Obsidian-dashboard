import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-white/[0.08]',
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -120, rotate: rotate - 12 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 2.6, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.4 } }}
      className={`absolute pointer-events-none ${className ?? ''}`}
    >
      <motion.div
        animate={{ y: [0, 18, 0] }}
        transition={{ duration: 10 + delay * 3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        style={{ width, height }}
        className="relative"
      >
        <div className={[
          'absolute inset-0 rounded-full',
          'bg-gradient-to-r to-transparent',
          gradient,
          'backdrop-blur-[2px] border border-[#d394ff]/[0.18]',
          'shadow-[0_8px_40px_0_rgba(211,148,255,0.12)]',
          'after:absolute after:inset-0 after:rounded-full',
          'after:bg-[radial-gradient(circle_at_40%_40%,rgba(211,148,255,0.18),transparent_65%)]',
        ].join(' ')} />
      </motion.div>
    </motion.div>
  );
}

export default function HeroGeometric({
  badge       = 'Editorial Intelligence',
  title1      = 'Your social universe.',
  title2      = 'One quiet system.',
  description = 'A refined command layer for creative brands to plan, track, and synchronize Instagram, LinkedIn, and Facebook with clarity.',
}: {
  badge?:       string;
  title1?:      string;
  title2?:      string;
  description?: string;
}) {
  const navigate = useNavigate();

  const fade = (i: number) => ({
    hidden:   { opacity: 0, y: 24, filter: 'blur(6px)' },
    visible:  { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.9, delay: 0.4 + i * 0.15, ease: [0.25, 0.4, 0.25, 1] as const } },
  });

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#030303]">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d394ff]/[0.04] via-transparent to-[#6b0fa0]/[0.06]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#d394ff]/[0.04] blur-[120px] pointer-events-none" />

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape delay={0.20} width={650} height={150} rotate={ 12} gradient="from-[#d394ff]/[0.13]" className="left-[-12%] top-[18%]" />
        <ElegantShape delay={0.45} width={520} height={120} rotate={-14} gradient="from-[#aa30fa]/[0.12]" className="right-[-8%] top-[65%]" />
        <ElegantShape delay={0.35} width={320} height={ 80} rotate={ -7} gradient="from-[#c97cff]/[0.11]" className="left-[4%] bottom-[8%]" />
        <ElegantShape delay={0.60} width={220} height={ 55} rotate={ 22} gradient="from-[#d394ff]/[0.10]" className="right-[18%] top-[8%]" />
        <ElegantShape delay={0.75} width={160} height={ 42} rotate={-28} gradient="from-[#aa30fa]/[0.09]" className="left-[22%] top-[6%]" />
        <ElegantShape delay={0.90} width={110} height={ 30} rotate={ 15} gradient="from-[#c97cff]/[0.08]" className="right-[38%] bottom-[14%]" />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(211,148,255,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Badge */}
        <motion.div
          variants={fade(0)} initial="hidden" animate="visible"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d394ff]/[0.08] border border-[#d394ff]/[0.18] mb-10"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d394ff] opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#d394ff]" />
          </span>
          <span className="text-[0.68rem] text-[#d9b3ff]/80 tracking-[0.2em] uppercase font-medium">{badge}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fade(1)} initial="hidden" animate="visible"
          className="text-5xl sm:text-6xl md:text-[5.5rem] font-bold tracking-[-0.03em] leading-[1.02] mb-6"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/70">{title1}</span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#c97cff] via-[#f0dcff] to-[#aa30fa]">{title2}</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fade(2)} initial="hidden" animate="visible"
          className="text-sm md:text-base text-white/35 leading-relaxed font-light max-w-md mb-10"
        >
          {description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fade(3)} initial="hidden" animate="visible"
          className="flex items-center gap-3 mb-16"
        >
          <button
            onClick={() => navigate('/register')}
            className="group relative rounded-full bg-[#d394ff] px-7 py-3 text-xs font-bold tracking-wide text-[#3a0060] overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(211,148,255,0.4)]"
          >
            <span className="relative z-10">Get Started Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#d394ff] to-[#f0dcff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="rounded-full border border-white/[0.10] bg-white/[0.03] px-7 py-3 text-xs font-medium tracking-wide text-white/45 backdrop-blur-xl hover:border-white/[0.20] hover:text-white/70 transition-all duration-300"
          >
            Sign In
          </button>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/60 pointer-events-none z-[1]" />
    </div>
  );
}
