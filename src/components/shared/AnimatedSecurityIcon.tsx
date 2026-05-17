import { useEffect, useState, type ReactNode } from 'react';
import { motion, useAnimation } from 'framer-motion';

type IconType = 'lock' | 'scopes' | 'revoke' | 'audit';

type Props = {
  type: IconType;
  fallback: ReactNode;
  playing?: boolean;
};

function useAnimationAllowed() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const mqDesktop = window.matchMedia('(min-width: 768px)');
    const mqMotion  = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAllowed(mqDesktop.matches && !mqMotion.matches);
    update();
    mqDesktop.addEventListener('change', update);
    mqMotion.addEventListener('change', update);
    return () => {
      mqDesktop.removeEventListener('change', update);
      mqMotion.removeEventListener('change', update);
    };
  }, []);
  return allowed;
}

const svgProps = {
  viewBox: '0 0 24 24',
  width: 18,
  height: 18,
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function LockIcon({ playing }: { playing: boolean }) {
  return (
    <svg {...svgProps} aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <motion.path
        d="M7 11V7a5 5 0 0 1 10 0v4"
        animate={playing ? { y: [0, -4, 0] } : { y: 0 }}
        transition={playing
          ? { repeat: Infinity, ease: 'easeInOut', duration: 1.4 }
          : { duration: 0.3 }
        }
      />
    </svg>
  );
}

function ScopesIcon({ playing }: { playing: boolean }) {
  return (
    <svg {...svgProps} aria-hidden="true">
      <line x1="21" x2="14" y1="4" y2="4" />
      <line x1="10" x2="3" y1="4" y2="4" />
      <line x1="21" x2="12" y1="12" y2="12" />
      <line x1="8" x2="3" y1="12" y2="12" />
      <line x1="21" x2="16" y1="20" y2="20" />
      <line x1="12" x2="3" y1="20" y2="20" />
      <motion.circle cx="12" cy="4" r="2"
        animate={playing ? { x: [0, 3, 0, -3, 0] } : { x: 0 }}
        transition={playing ? { repeat: Infinity, ease: 'easeInOut', duration: 1.6 } : { duration: 0.3 }}
      />
      <motion.circle cx="10" cy="12" r="2"
        animate={playing ? { x: [0, -3, 0, 3, 0] } : { x: 0 }}
        transition={playing ? { repeat: Infinity, ease: 'easeInOut', duration: 1.6, delay: 0.15 } : { duration: 0.3 }}
      />
      <motion.circle cx="14" cy="20" r="2"
        animate={playing ? { x: [0, 4, 0, -4, 0] } : { x: 0 }}
        transition={playing ? { repeat: Infinity, ease: 'easeInOut', duration: 1.6, delay: 0.3 } : { duration: 0.3 }}
      />
    </svg>
  );
}

function RevokeIcon({ playing }: { playing: boolean }) {
  const controls = useAnimation();
  useEffect(() => {
    if (playing) void controls.start({ rotate: 360, transition: { repeat: Infinity, ease: 'linear', duration: 1.2 } });
    else controls.stop();
  }, [playing, controls]);

  return (
    <svg {...svgProps} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <motion.g animate={controls} style={{ transformOrigin: '12px 12px' }}>
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </motion.g>
    </svg>
  );
}

function AuditIcon({ playing }: { playing: boolean }) {
  const controls = useAnimation();
  useEffect(() => {
    if (playing) void controls.start({ rotate: 360, transition: { repeat: Infinity, ease: 'linear', duration: 1.4 } });
    else controls.stop();
  }, [playing, controls]);

  return (
    <svg {...svgProps} aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <motion.path
        d="M12 7v5l4 2"
        animate={controls}
        style={{ transformOrigin: '12px 12px' }}
      />
    </svg>
  );
}

export default function AnimatedSecurityIcon({ type, fallback, playing = false }: Props) {
  const allowed = useAnimationAllowed();
  if (!allowed) return <>{fallback}</>;
  if (type === 'lock')   return <LockIcon playing={playing} />;
  if (type === 'scopes') return <ScopesIcon playing={playing} />;
  if (type === 'revoke') return <RevokeIcon playing={playing} />;
  return <AuditIcon playing={playing} />;
}
