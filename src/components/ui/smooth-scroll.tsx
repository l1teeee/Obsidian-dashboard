import { useRef, useState, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, CheckCircle2, Send, BarChart2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Panel {
  n: string;
  id: string;
  title: string;
  body: string;
  Icon: LucideIcon;
  bg: string;
  text: string;
  muted: string;
  border: string;
  iconBg: string;
}

const PANELS: Panel[] = [
  {
    n: '01',
    id: 'plan',
    title: 'Plan',
    body: 'Organize posts on a shared calendar before the week fills up. Every platform on one timeline.',
    Icon: Calendar,
    bg: '#FFFFFF',
    text: '#0F172A',
    muted: '#64748B',
    border: 'rgba(15,23,42,0.08)',
    iconBg: 'rgba(15,23,42,0.04)',
  },
  {
    n: '02',
    id: 'approve',
    title: 'Approve',
    body: 'Route drafts to reviewers before anything goes live. Each role sees only what they need.',
    Icon: CheckCircle2,
    bg: '#F8FAFC',
    text: '#0F172A',
    muted: '#64748B',
    border: 'rgba(15,23,42,0.08)',
    iconBg: 'rgba(15,23,42,0.04)',
  },
  {
    n: '03',
    id: 'publish',
    title: 'Publish',
    body: 'Send approved content to Instagram, LinkedIn, and Facebook from one workspace.',
    Icon: Send,
    bg: '#F1F5F9',
    text: '#0F172A',
    muted: '#64748B',
    border: 'rgba(15,23,42,0.08)',
    iconBg: 'rgba(15,23,42,0.04)',
  },
  {
    n: '04',
    id: 'measure',
    title: 'Measure',
    body: 'Read reach, engagement, and what performed — per post, per platform, per week.',
    Icon: BarChart2,
    bg: '#0F172A',
    text: '#F8FAFC',
    muted: 'rgba(248,250,252,0.5)',
    border: 'rgba(248,250,252,0.10)',
    iconBg: 'rgba(248,250,252,0.06)',
  },
];

export default function SmoothScrollSections() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: () => `+=${(PANELS.length - 1) * window.innerHeight}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const idx = Math.min(
          PANELS.length - 1,
          Math.floor(self.progress * PANELS.length),
        );
        setActiveIdx(idx);
      },
    });

    return () => st.kill();
  }, []);

  const panel = PANELS[activeIdx];

  return (
    <section id="how-it-works" ref={wrapperRef}>
      <motion.div
        animate={{ backgroundColor: panel.bg }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl mx-auto px-8 flex flex-col items-center text-center"
        >
          <p
            className="font-mono text-[11px] tracking-[0.2em] uppercase mb-10"
            style={{ color: panel.muted }}
          >
            {panel.n} &mdash; How it works
          </p>

          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8"
            style={{ border: `1px solid ${panel.border}`, background: panel.iconBg }}
          >
            <panel.Icon size={22} strokeWidth={1.5} style={{ color: panel.text }} />
          </div>

          <h2
            className="text-[clamp(64px,11vw,120px)] font-medium tracking-[-0.05em] leading-[0.9] mb-8"
            style={{ color: panel.text }}
          >
            {panel.title}
          </h2>

          <p
            className="text-[17px] leading-[1.75] max-w-md"
            style={{ color: panel.muted }}
          >
            {panel.body}
          </p>
        </motion.div>

        <div className="absolute bottom-10 flex items-center gap-2">
          {PANELS.map((_, j) => (
            <div
              key={j}
              className="h-[3px] rounded-full transition-all duration-300"
              style={{
                width: j === activeIdx ? '24px' : '6px',
                background: j === activeIdx ? panel.text : panel.border,
                opacity: j === activeIdx ? 0.7 : 0.3,
              }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
