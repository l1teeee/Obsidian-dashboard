import { useState, useEffect } from 'react';

type AuthVisualPanelProps = {
  side: 'left' | 'right';
  variant?: 'login' | 'register';
};

const VIDEOS = [
  { key: 'login',    src: 'https://vielink-media-prod.s3.us-east-1.amazonaws.com/auth-login.mp4'    },
  { key: 'register', src: 'https://vielink-media-prod.s3.us-east-1.amazonaws.com/auth-register.mp4' },
] as const;

export default function AuthVisualPanel({ side, variant = 'login' }: AuthVisualPanelProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Reset skeleton whenever the active variant changes (login ↔ register)
  useEffect(() => {
    setVideoLoaded(false);
  }, [variant]);

  const radius = side === 'left'
    ? 'rounded-tl-[28px] rounded-bl-[28px]'
    : 'rounded-tr-[28px] rounded-br-[28px]';

  return (
    <aside
      aria-hidden="true"
      data-auth-panel="visual"
      className={`relative hidden overflow-hidden bg-[#F1F5F9] lg:m-6 lg:block lg:min-h-[calc(100dvh-3rem)] ${radius}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#FFFFFF_0%,#F1F5F9_48%,#CBD5E1_100%)]" />
      <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      {VIDEOS.map(({ key, src }) => (
        <video
          key={key}
          className={`absolute inset-0 h-full w-full object-cover saturate-[0.82] contrast-[1.02] transition-[opacity,filter] duration-700 ease-in-out ${
            variant === key ? 'opacity-90 blur-0' : 'opacity-0 blur-sm'
          }`}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onCanPlay={() => { if (key === variant) setVideoLoaded(true); }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      ))}

      {/* Dark overlays */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-[#111827]/10 mix-blend-soft-light" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.22)_100%)]" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/45" />

      {/* Skeleton shimmer — sits above everything, fades out when video is ready */}
      <div
        className={`absolute inset-0 z-20 transition-opacity duration-700 ease-in-out ${
          videoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="h-full w-full animate-pulse bg-linear-to-br from-[#CBD5E1] via-[#F1F5F9] to-[#CBD5E1]" />
      </div>
    </aside>
  );
}
