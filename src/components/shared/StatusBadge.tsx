import type { PostStatus } from '../../domain/entities/Post';

const STYLES: Record<PostStatus, string> = {
  published: 'bg-[#047857]/15 text-[#047857] border-[#047857]/20',
  scheduled: 'bg-[#111827]/15 text-[#111827] border-[#111827]/20',
  draft:     'bg-white/5 text-[#94A3B8] border-white/10',
  failed:    'bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/20',
  inactive:  'bg-[#B45309]/10 text-[#B45309] border-[#B45309]/20',
  deleted:   'bg-[#DC2626]/10 text-[#DC2626]/60 border-[#DC2626]/10 line-through',
};

interface StatusBadgeProps {
  status: PostStatus;
  size?:  'sm' | 'xs';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  return (
    <span className={`font-bold uppercase border rounded ${size === 'xs' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-1'} ${STYLES[status]}`}>
      {status}
    </span>
  );
}
