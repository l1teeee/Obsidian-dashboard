import type { PostStatus } from '../../domain/entities/Post';

const STYLES: Record<PostStatus, string> = {
  published: 'bg-[#4F7A4A]/15 text-[#4F7A4A] border-[#4F7A4A]/20',
  scheduled: 'bg-[#C8553A]/15 text-[#C8553A] border-[#C8553A]/20',
  draft:     'bg-white/5 text-[#A39B8B] border-white/10',
  failed:    'bg-[#A8362A]/15 text-[#A8362A] border-[#A8362A]/20',
  inactive:  'bg-[#B7841E]/10 text-[#B7841E] border-[#B7841E]/20',
  deleted:   'bg-[#A8362A]/10 text-[#A8362A]/60 border-[#A8362A]/10 line-through',
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
