import { cn } from '@/lib/utils';

interface TextShimmerProps {
  children: string;
  className?: string;
  duration?: number;
  spread?: number;
}

export function TextShimmer({
  children,
  className,
  duration = 2.5,
  spread = 2,
}: TextShimmerProps) {
  return (
    <span
      className={cn('inline-block bg-clip-text text-transparent', className)}
      style={{
        backgroundImage: `linear-gradient(90deg, #94A3B8 ${100 / (spread + 1)}%, #0E9F6E 50%, #94A3B8 ${100 - 100 / (spread + 1)}%)`,
        backgroundSize: '250% 100%',
        backgroundPosition: '100% center',
        animation: `shimmer ${duration}s linear infinite`,
      }}
    >
      {children}
    </span>
  );
}
