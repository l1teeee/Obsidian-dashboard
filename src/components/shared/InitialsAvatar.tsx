function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SIZES = {
  sm: { wrap: 'w-9 h-9 rounded-xl',   text: 'text-[11px]' },
  md: { wrap: 'w-16 h-16 rounded-2xl', text: 'text-xl'    },
  lg: { wrap: 'w-20 h-20 rounded-2xl', text: 'text-2xl'   },
} as const;

interface InitialsAvatarProps {
  name:       string;
  size?:      keyof typeof SIZES;
  className?: string;
}

export default function InitialsAvatar({ name, size = 'sm', className = '' }: InitialsAvatarProps) {
  const { wrap, text } = SIZES[size];
  return (
    <div className={`${wrap} bg-[#111827] flex items-center justify-center shrink-0 ${className}`}>
      <span className={`${text} font-bold text-white tracking-tight leading-none select-none`}>
        {getInitials(name)}
      </span>
    </div>
  );
}
