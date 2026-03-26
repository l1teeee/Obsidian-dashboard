import { Link } from 'react-router-dom';
import type { RefObject } from 'react';
import { PLATFORM_REGISTRY } from '../../domain/entities/Platform';
import StatusBadge from '../shared/StatusBadge';
import type { PostSummary } from '../../domain/entities/Post';

interface RecentPostRowProps {
  post:    PostSummary;
  rowRef:  RefObject<HTMLAnchorElement | null>;
}

export default function RecentPostRow({ post, rowRef }: RecentPostRowProps) {
  const p = PLATFORM_REGISTRY[post.platform];

  return (
    <Link
      to={`/posts/${post.id}`}
      ref={rowRef}
      className="glass-card rounded-[2rem] p-4 border border-[#4c4450]/5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 hover:bg-[#201f1f] transition-all cursor-pointer"
    >
      <div className="w-full h-32 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 bg-[#1c1b1b]">
        <img src={post.imageUrl} className="w-full h-full object-cover" alt="" loading="lazy" />
      </div>

      <div className="grow min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="w-4 h-4 rounded-sm flex items-center justify-center text-[6px] text-white font-bold"
            style={{ background: p.color }}
          >
            {p.abbr}
          </div>
          <StatusBadge status={post.status} size="xs" />
        </div>
        <h4 className="text-white text-sm font-semibold truncate">{post.title}</h4>
        <p className="text-[#988d9c] text-xs mt-0.5">{post.date}</p>
      </div>

      <div className="flex gap-4 sm:gap-5 sm:px-5 sm:border-l border-[#4c4450]/10 shrink-0">
        {[['Likes', post.likes], ['Comments', post.comments], ['Shares', post.shares]].map(([l, v]) => (
          <div key={l} className="text-center">
            <p className="font-mono text-sm text-white">{v}</p>
            <p className="text-[9px] text-[#988d9c] uppercase tracking-wider">{l}</p>
          </div>
        ))}
      </div>
    </Link>
  );
}
