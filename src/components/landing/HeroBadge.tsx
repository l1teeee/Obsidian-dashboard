import type { HTMLAttributes, ReactNode } from 'react';

interface HeroBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export default function HeroBadge({ children, className = '', ...props }: HeroBadgeProps) {
  return (
    <span
      {...props}
      className={[
        'inline-flex items-center rounded-full bg-[#F1F5F9] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#64748B] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]',
        className,
      ].join(' ')}
    >
      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#111827]" />
      {children}
    </span>
  );
}
