import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Grid-pattern radial decorator — dark/purple variant for Vielinks */
export const CardDecorator = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div
    aria-hidden
    className={cn(
      'relative mx-auto size-28 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]',
      className
    )}
  >
    {/* Purple grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(211,148,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(211,148,255,0.10)_1px,transparent_1px)] bg-[size:22px_22px]" />
    {/* Center icon box */}
    <div className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-xl border border-[#d394ff]/22 bg-[#d394ff]/12 text-[#d394ff]">
      {children}
    </div>
  </div>
);

/** Reusable benefit card shell */
export function BenefitCard({
  children,
  className,
  accent,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[1.75rem] border backdrop-blur-xl transition-all duration-500 hover:-translate-y-1',
        accent
          ? 'border-[#d394ff]/22 bg-[#181818]/90 shadow-[0_0_0_1px_rgba(211,148,255,0.06),0_30px_80px_rgba(0,0,0,0.3)]'
          : 'border-white/[0.07] bg-[#111111]/80 hover:border-[#d394ff]/16 hover:bg-[#181818]/70',
        className
      )}
    >
      {/* Top sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      {/* Hover radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(211,148,255,0.07) 0%, transparent 60%)' }}
      />
      {children}
    </div>
  );
}
