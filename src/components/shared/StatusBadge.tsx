import type { PostStatus } from '../../domain/entities/Post';

const STYLES: Record<PostStatus, string> = {
  published: 'bg-[#c5d247]/15 text-[#c5d247] border-[#c5d247]/20',
  scheduled: 'bg-[#d394ff]/15 text-[#d394ff] border-[#d394ff]/20',
  failed:    'bg-[#ffb4ab]/15 text-[#ffb4ab] border-[#ffb4ab]/20',
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
