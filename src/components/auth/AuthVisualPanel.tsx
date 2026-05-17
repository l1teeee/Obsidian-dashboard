type AuthVisualPanelProps = {
  side: 'left' | 'right';
  variant?: 'login' | 'register';
};

const VIDEOS = [
  { key: 'login', src: '/videos/auth-login.mp4' },
  { key: 'register', src: '/videos/auth-register.mp4' },
] as const;

export default function AuthVisualPanel({ side, variant = 'login' }: AuthVisualPanelProps) {
  const radius = side === 'left'
    ? 'rounded-tl-[28px] rounded-bl-[28px]'
    : 'rounded-tr-[28px] rounded-br-[28px]';

  return (
    <aside
      aria-hidden="true"
      data-auth-panel="visual"
      className={`relative hidden overflow-hidden bg-[#EFE9DC] lg:m-6 lg:block lg:min-h-[calc(100dvh-3rem)] ${radius}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#FBF8F2_0%,#EFE9DC_48%,#E0D8C8_100%)]" />
      <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(21,20,15,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(21,20,15,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      {VIDEOS.map(({ key, src }) => (
        <video
          key={key}
          className={`absolute inset-0 h-full w-full object-cover saturate-[0.82] contrast-[1.02] transition-[opacity,filter] duration-700 ease-in-out ${
            variant === key
              ? 'opacity-90 blur-0'
              : 'opacity-0 blur-sm'
          }`}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-[#C8553A]/10 mix-blend-soft-light" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,20,15,0.04)_0%,rgba(21,20,15,0.22)_100%)]" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/45" />
    </aside>
  );
}
