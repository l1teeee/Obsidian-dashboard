import { Link } from 'react-router-dom';
import { PLATFORM_REGISTRY } from '../../domain/entities/Platform';
import SocialBrandIcon from '../shared/SocialBrandIcon';
import StatusBadge from '../shared/StatusBadge';
import type { CalendarPost } from '../../domain/entities/CalendarPost';

interface PostPillProps {
  post:     CalendarPost;
  compact?: boolean;
}

export default function PostPill({ post, compact = false }: PostPillProps) {
  const p = PLATFORM_REGISTRY[post.platform];

  if (compact) {
    return (
      <div
        className="h-1.5 w-full rounded-full"
        style={{ background: p.color + '99' }}
        title={`${post.time} · ${post.title}`}
      />
    );
  }

  return (
    <Link
      to={`/posts/${post.id}`}
      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#15140F]/10 bg-[#FBF8F2] hover:bg-[#EFE9DC] hover:border-[#C8553A]/20 transition-all group"
    >
      <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: p.color }}>
        <SocialBrandIcon platformId={post.platform} size={11} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#15140F] truncate leading-tight">{post.title}</p>
        <p className="text-[10px] text-[#6B655B]">{post.time}</p>
      </div>
      <span className="shrink-0 hidden sm:block">
        <StatusBadge status={post.status} size="xs" />
      </span>
    </Link>
  );
}
