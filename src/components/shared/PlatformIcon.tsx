import { PLATFORM_REGISTRY, type PlatformId } from '../../domain/entities/Platform';

interface PlatformIconProps {
  platformId: PlatformId;
  size?:      number;
  rounded?:   string;
}

export default function PlatformIcon({ platformId, size = 28, rounded = 'rounded-xl' }: PlatformIconProps) {
  const p = PLATFORM_REGISTRY[platformId];
  return (
    <div
      className={`${rounded} flex items-center justify-center shrink-0`}
      style={{ width: size, height: size, background: p.color }}
    >
      <span className="material-symbols-outlined text-white" style={{ fontSize: size * 0.55 }}>{p.icon}</span>
    </div>
  );
}
