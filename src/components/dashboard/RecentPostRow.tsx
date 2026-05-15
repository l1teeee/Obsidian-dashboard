import { Link } from 'react-router-dom';
import type { RefObject } from 'react';
import { PLATFORM_REGISTRY } from '../../domain/entities/Platform';
import StatusBadge from '../shared/StatusBadge';
import type { PostSummary } from '../../domain/entities/Post';

interface RecentPostRowProps {
  post:    PostSummary;
  rowRef:  RefObject<HTMLAnchorElement | null>;
}

const ROW_CLASS = 'surface-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 transition-all cursor-pointer hover:bg-[#EFE9DC] hover:border-[#C8553A]/24 group';

export default function RecentPostRow({ post, rowRef }: RecentPostRowProps) {
  const p = PLATFORM_REGISTRY[post.platform];

  const inner = (
    <>
      <div
        className="w-full h-32 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center"
        style={{ background: post.imageUrl ? undefined : p.color }}
      >
        {post.imageUrl
          ? <img src={post.imageUrl} className="w-full h-full object-cover" alt="" loading="lazy" />
          : (
            <span className="text-3xl sm:text-2xl font-black uppercase select-none text-[#15140F]">
              {(post.title ?? '?')[0]}
            </span>
          )
        }
      </div>

      <div className="grow min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-xs text-[#15140F] font-bold"
            style={{ background: p.color }}
          >
            {p.abbr}
          </div>
          <StatusBadge status={post.status} size="xs" />
        </div>
        <h4 className="text-[#15140F] text-sm font-semibold truncate">{post.title}</h4>
        <p className="text-[#6B655B] text-xs mt-0.5">{post.date}</p>
      </div>

      <div className="flex gap-4 sm:gap-5 sm:px-5 sm:border-l border-[#15140F]/10 shrink-0">
        {[['Likes', post.likes], ['Comments', post.comments], ['Shares', post.shares]].map(([l, v]) => (
          <div key={l} className="text-center">
            <p className="font-mono text-sm text-[#15140F]">{v}</p>
            <p className="text-xs text-[#6B655B] uppercase tracking-[0.12em]">{l}</p>
          </div>
        ))}
      </div>
    </>
  );

  if (post.externalHref) {
    return (
      <a
        href={post.externalHref}
        target="_blank"
        rel="noopener noreferrer"
        ref={rowRef as RefObject<HTMLAnchorElement>}
        className={ROW_CLASS}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link to={`/posts/${post.id}`} ref={rowRef} className={ROW_CLASS}>
      {inner}
    </Link>
  );
}
