import { PLATFORM_REGISTRY, type PlatformId } from '../../domain/entities/Platform';
import SocialBrandIcon from './SocialBrandIcon';

interface PlatformIconProps {
  platformId: PlatformId;
  size?:      number;
  rounded?:   string;
}

export default function PlatformIcon({ platformId, size = 28, rounded = 'rounded-xl' }: PlatformIconProps) {
  const p = PLATFORM_REGISTRY[platformId];
  const iconSize = Math.round(size * 0.55);

  return (
    <div
      className={`${rounded} flex items-center justify-center shrink-0`}
      style={{ width: size, height: size, background: p.color }}
    >
      <SocialBrandIcon platformId={platformId} size={iconSize} />
    </div>
  );
}
