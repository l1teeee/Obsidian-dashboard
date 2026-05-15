import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { CalendarPost } from '../../domain/entities/CalendarPost';
import { PLATFORM_REGISTRY } from '../../domain/entities/Platform';
import type { PostAction, PostsView } from '../../hooks/usePosts';
import StatusBadge from '../shared/StatusBadge';
import PlatformIcon from '../shared/PlatformIcon';
import SocialBrandIcon from '../shared/SocialBrandIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface PostsTableProps {
  posts:              CalendarPost[];
  view:               PostsView;
  onAction:           (type: PostAction, post: CalendarPost) => void;
  isLoading?:         boolean;
  connectedPlatforms?: Set<string> | null;
}

function NoAccountIcon({ platformName }: { platformName: string }) {
  return (
    <div className="relative group/noconn shrink-0">
      <span
        className="material-symbols-outlined text-[#ffd166]"
        style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}
      >
        info
      </span>
      {/* Tooltip */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-30 hidden group-hover/noconn:block w-52 bg-[#FBF8F2] border border-[#ffd166]/25 rounded-xl px-3 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] pointer-events-none">
        <p className="text-[10px] font-semibold text-[#ffd166] mb-0.5">Can't publish</p>
        <p className="text-[10px] text-[#3D3A30] leading-relaxed">
          No account connected for {platformName}. You can still save it as a draft.
        </p>
      </div>
    </div>
  );
}

function SkeletonCell({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-[#2e2c2e] rounded-lg animate-pulse ${className}`} />
  );
}

function PostsTableSkeleton() {
  const rows = Array.from({ length: 6 });
  return (
    <>
      {/* Desktop skeleton */}
      <div className="glass-card rounded-3xl overflow-hidden border border-[#15140F]/5 hidden md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#15140F]/10">
              {TABLE_HEADERS.map(h => (
                <th key={h} className="px-6 py-4 text-[#6B655B] uppercase text-[10px] tracking-widest font-semibold bg-[#FBF8F2]/50">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#15140F]/5">
            {rows.map((_, i) => (
              <tr key={i} className="group">
                {/* Content */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <SkeletonCell className="w-8 h-8 rounded-lg shrink-0" />
                    <div className="space-y-1.5">
                      <SkeletonCell className="h-3.5 w-44 rounded-md" />
                      <SkeletonCell className="h-2.5 w-20 rounded-md" />
                    </div>
                  </div>
                </td>
                {/* Platform */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <SkeletonCell className="w-[22px] h-[22px] rounded-md shrink-0" />
                    <SkeletonCell className="h-3 w-20 rounded-md" />
                  </div>
                </td>
                {/* Status */}
                <td className="px-6 py-4">
                  <SkeletonCell className="h-5 w-20 rounded-full" />
                </td>
                {/* Date */}
                <td className="px-6 py-4">
                  <SkeletonCell className="h-3.5 w-24 rounded-md" />
                </td>
                {/* Time */}
                <td className="px-6 py-4">
                  <SkeletonCell className="h-3.5 w-12 rounded-md" />
                </td>
                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <SkeletonCell className="w-7 h-7 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile skeleton */}
      <div className="md:hidden space-y-3">
        {rows.map((_, i) => (
          <div key={i} className="glass-card rounded-2xl border border-[#15140F]/5 overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <SkeletonCell className="w-10 h-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <SkeletonCell className="h-3.5 w-3/4 rounded-md" />
                <SkeletonCell className="h-2.5 w-1/2 rounded-md" />
              </div>
              <SkeletonCell className="h-5 w-16 rounded-full shrink-0" />
            </div>
            <div className="flex items-center gap-2 px-4 pb-3 border-t border-[#15140F]/5 pt-2">
              <SkeletonCell className="w-7 h-7 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const TABLE_HEADERS = ['Content', 'Platform', 'Status', 'Date', 'Time', 'Actions'];

function ActionButtons({ post, view, onAction }: { post: CalendarPost; view: PostsView; onAction: PostsTableProps['onAction'] }) {
  if (post.status === 'draft') {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={e => { e.stopPropagation(); e.preventDefault(); onAction('delete', post); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-[#6B655B] hover:bg-[#ffb4ab]/10 hover:border-[#ffb4ab]/20 hover:text-[#ffb4ab] transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete_forever</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" showArrow>Delete draft</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (view === 'inactive') {
    return (
      <TooltipProvider delayDuration={300}>
        <div className="flex items-center gap-1.5">
          <button
            onClick={e => { e.stopPropagation(); e.preventDefault(); onAction('activate', post); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#4F7A4A]/10 border border-[#4F7A4A]/20 text-[#4F7A4A] text-[10px] font-bold uppercase tracking-wider hover:bg-[#4F7A4A]/20 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>play_circle</span>
            Activate
          </button>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={e => { e.stopPropagation(); e.preventDefault(); onAction('delete', post); }}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-[#6B655B] hover:bg-[#ffb4ab]/10 hover:border-[#ffb4ab]/20 hover:text-[#ffb4ab] transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete_forever</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" showArrow>Delete permanently</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1.5">
        {post.status === 'failed' && (
          <button
            onClick={e => { e.stopPropagation(); e.preventDefault(); onAction('retry', post); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#ffd166]/10 border border-[#ffd166]/20 text-[#ffd166] text-[10px] font-bold uppercase tracking-wider hover:bg-[#ffd166]/20 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>refresh</span>
            Retry
          </button>
        )}
        {post.status === 'scheduled' && (
          <button
            onClick={e => { e.stopPropagation(); e.preventDefault(); onAction('publish', post); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#4F7A4A]/10 border border-[#4F7A4A]/20 text-[#4F7A4A] text-[10px] font-bold uppercase tracking-wider hover:bg-[#4F7A4A]/20 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>send</span>
            Publish
          </button>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={e => { e.stopPropagation(); e.preventDefault(); onAction('deactivate', post); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-[#6B655B] hover:bg-[#ffd166]/10 hover:border-[#ffd166]/20 hover:text-[#ffd166] transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>pause_circle</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" showArrow>Deactivate</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export default function PostsTable({ posts, view, onAction, isLoading, connectedPlatforms }: PostsTableProps) {
  if (isLoading) return <PostsTableSkeleton />;

  if (posts.length === 0) {
    return (
      <div className="glass-card rounded-3xl border border-[#15140F]/5 p-16 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-[#D8D2C4]" style={{ fontSize: 48 }}>
          {view === 'inactive' ? 'inventory_2' : 'article'}
        </span>
        <p className="text-[#6B655B] text-sm">
          {view === 'inactive' ? 'No inactive posts.' : 'No posts found.'}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-[#15140F]/5 hidden md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#15140F]/10">
              {TABLE_HEADERS.map(h => (
                <th key={h} className="px-6 py-4 text-[#6B655B] uppercase text-[10px] tracking-widest font-semibold bg-[#FBF8F2]/50">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#15140F]/5">
            {posts.map(post => {
              const p          = PLATFORM_REGISTRY[post.platform];
              const postHref   = post.status === 'draft'
                ? `/composer/${post.id}`
                : `/posts/${post.id}`;
              const noAccount  = connectedPlatforms != null
                && !connectedPlatforms.has(post.platform)
                && post.status !== 'published';
              return (
                <tr key={post.id} className="hover:bg-[#15140F]/[0.05] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link to={postHref} className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: p.color }}>
                          <SocialBrandIcon platformId={post.platform} size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#15140F] truncate max-w-[240px] group-hover:text-[#C8553A] transition-colors">
                            {post.title}
                          </p>
                          <p className="text-[10px] text-[#6B655B] font-mono uppercase">ID: {post.id}</p>
                        </div>
                      </Link>
                      {noAccount && <NoAccountIcon platformName={p.name} />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={postHref} className="flex items-center gap-2">
                      <PlatformIcon platformId={post.platform} size={22} rounded="rounded-md" />
                      <span className="text-xs text-[#3D3A30]">{p.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={postHref}>
                      <StatusBadge status={post.status} />
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-[#3D3A30]">
                    {format(post.date, 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-[#6B655B]">
                    {post.time}
                  </td>
                  <td className="px-6 py-4">
                    <ActionButtons post={post} view={view} onAction={onAction} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {posts.map(post => {
          const p          = PLATFORM_REGISTRY[post.platform];
          const postHref   = post.status === 'draft'
            ? `/composer/${post.id}`
            : `/posts/${post.id}`;
          const noAccount  = connectedPlatforms != null
            && !connectedPlatforms.has(post.platform)
            && post.status !== 'published';
          return (
            <div key={post.id} className="glass-card rounded-2xl border border-[#15140F]/5 overflow-hidden">
              <Link
                to={postHref}
                className="flex items-center gap-4 p-4 hover:bg-[#EFE9DC] transition-all"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: p.color }}>
                  <SocialBrandIcon platformId={post.platform} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#15140F] truncate">{post.title}</p>
                  <p className="text-[10px] text-[#6B655B] mt-0.5">
                    {p.name} · {format(post.date, 'MMM d')} · {post.time}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {noAccount && <NoAccountIcon platformName={p.name} />}
                  <StatusBadge status={post.status} size="xs" />
                </div>
              </Link>
              <div className="flex items-center gap-2 px-4 pb-3 border-t border-[#15140F]/5 pt-2">
                <ActionButtons post={post} view={view} onAction={onAction} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
