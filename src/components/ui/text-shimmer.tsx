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
        backgroundImage: `linear-gradient(90deg, #A6A19A ${100 / (spread + 1)}%, #C8553A 50%, #A6A19A ${100 - 100 / (spread + 1)}%)`,
        backgroundSize: '250% 100%',
        backgroundPosition: '100% center',
        animation: `shimmer ${duration}s linear infinite`,
      }}
    >
      {children}
    </span>
  );
}
