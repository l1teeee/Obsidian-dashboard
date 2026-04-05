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
      className="glass-card rounded-[2rem] p-4 border border-[#4c4450]/5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 transition-all cursor-pointer hover:bg-[#201f1f] hover:border-[#d394ff]/20 hover:shadow-[0_0_24px_rgba(211,148,255,0.06)] group"
    >
      <div
        className="w-full h-32 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center"
        style={{ background: post.imageUrl ? undefined : p.color }}
      >
        {post.imageUrl
          ? <img src={post.imageUrl} className="w-full h-full object-cover" alt="" loading="lazy" />
          : (
            <span className="text-3xl sm:text-2xl font-black uppercase select-none text-white">
              {(post.title ?? '?')[0]}
            </span>
          )
        }
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
