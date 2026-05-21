import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Grid-pattern radial decorator - dark/teal variant for Vielinks */
export const CardDecorator = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div
    aria-hidden
    className={cn(
      'relative mx-auto size-28 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]',
      className
    )}
  >
    {/* Subtle accent grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,159,110,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,159,110,0.10)_1px,transparent_1px)] bg-[size:22px_22px]" />
    {/* Center icon box */}
    <div className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-xl border border-[#111827]/22 bg-[#111827]/12 text-[#111827]">
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
          ? 'border-[#111827]/22 bg-[#1F1D1B]/90 shadow-[0_0_0_1px_rgba(14,159,110,0.06),0_30px_80px_rgba(0,0,0,0.3)]'
          : 'border-white/[0.07] bg-[#F1F5F9]/80 hover:border-[#111827]/16 hover:bg-[#1F1D1B]/70',
        className
      )}
    >
      {/* Top sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      {/* Hover radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(14,159,110,0.07) 0%, transparent 60%)' }}
      />
      {children}
    </div>
  );
}
