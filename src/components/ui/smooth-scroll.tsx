import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CalendarSection, PostsSection, ConfigureSection, InsightsSection } from './dash-sections';

gsap.registerPlugin(ScrollTrigger);

interface Panel {
  n: string;
  id: string;
  title: string;
  body: string;
  bg: string;
  text: string;
  muted: string;
  frameBorder: string;
  frameShadow: string;
}

const PANELS: Panel[] = [
  {
    n: '01', id: 'plan', title: 'Plan',
    body: 'Organize posts on a shared calendar before the week fills up. Every platform on one timeline.',
    bg: '#F8FAFC', text: '#0F172A', muted: '#64748B',
    frameBorder: '#2A2825',
    frameShadow: '0 32px 64px rgba(15,23,42,0.14), 0 8px 24px rgba(15,23,42,0.08)',
  },
  {
    n: '02', id: 'approve', title: 'Approve',
    body: 'Route drafts to reviewers before anything goes live. Each role sees only what they need.',
    bg: '#0E9F6E', text: '#F8FAFC', muted: 'rgba(248,250,252,0.7)',
    frameBorder: '#064E3B',
    frameShadow: '0 32px 64px rgba(4,40,25,0.45), 0 8px 24px rgba(4,40,25,0.25)',
  },
  {
    n: '03', id: 'publish', title: 'Publish',
    body: 'Send approved content to Instagram, LinkedIn, and Facebook from one workspace.',
    bg: '#1D4ED8', text: '#F8FAFC', muted: 'rgba(248,250,252,0.65)',
    frameBorder: '#1e3a8a',
    frameShadow: '0 32px 64px rgba(10,20,100,0.45), 0 8px 24px rgba(10,20,100,0.25)',
  },
  {
    n: '04', id: 'measure', title: 'Measure',
    body: 'Read reach, engagement, and what performed — per post, per platform, per week.',
    bg: '#0F172A', text: '#F8FAFC', muted: 'rgba(248,250,252,0.5)',
    frameBorder: 'rgba(248,250,252,0.14)',
    frameShadow: '0 32px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.35)',
  },
];

const SECTION_COMPONENTS: Record<string, React.FC> = {
  plan:    CalendarSection,
  approve: PostsSection,
  publish: ConfigureSection,
  measure: InsightsSection,
};

const SECTION_TITLES: Record<string, string> = {
  plan:    'Calendar',
  approve: 'Posts',
  publish: 'Configure',
  measure: 'Insights',
};

function DashWindow({ panel }: { panel: Panel }) {
  const Content = SECTION_COMPONENTS[panel.id];
  return (
    <div
      className="w-full p-2 rounded-[28px]"
      style={{
        border: `4px solid ${panel.frameBorder}`,
        background: '#0F172A',
        boxShadow: panel.frameShadow,
      }}
    >
      <div className="overflow-hidden rounded-[20px] bg-white select-none text-[#0F172A]">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#0F172A]/8 bg-white shrink-0">
          <span className="font-semibold text-[12px] tracking-[-0.01em]">{SECTION_TITLES[panel.id]}</span>
          <span className="material-symbols-outlined text-outline" style={{ fontSize: 15 }}>notifications</span>
        </div>
        <div className="px-5 py-4 overflow-hidden" style={{ maxHeight: 440 }}>
          <Content />
        </div>
      </div>
    </div>
  );
}

const emit = (name: string, detail?: unknown) =>
  window.dispatchEvent(new CustomEvent(name, detail !== undefined ? { detail } : undefined));

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
      onEnter:     () => emit('hiw:enter'),
      onLeave:     () => emit('hiw:leave'),
      onEnterBack: () => emit('hiw:enter'),
      onLeaveBack: () => emit('hiw:leave'),
      onUpdate: (self) => {
        const idx = Math.min(PANELS.length - 1, Math.floor(self.progress * PANELS.length));
        setActiveIdx(idx);
      },
    });
    return () => { st.kill(); emit('hiw:leave'); };
  }, []);

  useEffect(() => {
    emit('hiw:panel', PANELS[activeIdx].bg);
  }, [activeIdx]);

  const panel = PANELS[activeIdx];

  return (
    <section id="how-it-works" ref={wrapperRef}>
      <motion.div
        animate={{ backgroundColor: panel.bg }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-6 lg:px-12"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-10 lg:gap-16"
          >
            {/* Text column */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left shrink-0 lg:w-90">
              <p
                className="font-mono text-[10px] tracking-[0.22em] uppercase mb-6"
                style={{ color: panel.muted }}
              >
                {panel.n} &mdash; How it works
              </p>
              <h2
                className="text-[clamp(52px,7vw,88px)] font-semibold tracking-[-0.04em] leading-[0.88] mb-5"
                style={{ color: panel.text }}
              >
                {panel.title}.
              </h2>
              <div
                className="w-8 h-px mb-5 rounded-full"
                style={{ background: panel.muted, opacity: 0.5 }}
              />
              <p className="text-[15px] leading-[1.75]" style={{ color: panel.muted }}>
                {panel.body}
              </p>
            </div>

            {/* Frame column */}
            <div className="flex-1 w-full min-w-0">
              <DashWindow panel={panel} />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-10 flex items-center gap-2">
          {PANELS.map((_, j) => (
            <div
              key={j}
              className="h-0.75 rounded-full transition-all duration-300"
              style={{
                width: j === activeIdx ? '24px' : '6px',
                background: j === activeIdx ? panel.text : panel.muted,
                opacity: j === activeIdx ? 0.7 : 0.3,
              }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
