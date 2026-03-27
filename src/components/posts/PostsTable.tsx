import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { CalendarPost } from '../../domain/entities/CalendarPost';
import { PLATFORM_REGISTRY } from '../../domain/entities/Platform';
import type { PostAction, PostsView } from '../../hooks/usePosts';
import StatusBadge from '../shared/StatusBadge';
import PlatformIcon from '../shared/PlatformIcon';
import SocialBrandIcon from '../shared/SocialBrandIcon';

interface PostsTableProps {
  posts:    CalendarPost[];
  view:     PostsView;
  onAction: (type: PostAction, post: CalendarPost) => void;
}

const TABLE_HEADERS = ['Content', 'Platform', 'Status', 'Date', 'Time', 'Actions'];

function ActionButtons({ post, view, onAction }: { post: CalendarPost; view: PostsView; onAction: PostsTableProps['onAction'] }) {
  if (view === 'inactive') {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={e => { e.stopPropagation(); e.preventDefault(); onAction('activate', post); }}
          title="Activate"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#c5d247]/10 border border-[#c5d247]/20 text-[#c5d247] text-[10px] font-bold uppercase tracking-wider hover:bg-[#c5d247]/20 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>play_circle</span>
          Activate
        </button>
        <button
          onClick={e => { e.stopPropagation(); e.preventDefault(); onAction('delete', post); }}
          title="Delete permanently"
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-[#988d9c] hover:bg-[#ffb4ab]/10 hover:border-[#ffb4ab]/20 hover:text-[#ffb4ab] transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete_forever</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {post.status === 'failed' && (
        <button
          onClick={e => { e.stopPropagation(); e.preventDefault(); onAction('retry', post); }}
          title="Retry"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#ffd166]/10 border border-[#ffd166]/20 text-[#ffd166] text-[10px] font-bold uppercase tracking-wider hover:bg-[#ffd166]/20 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>refresh</span>
          Retry
        </button>
      )}
      {post.status === 'scheduled' && (
        <button
          onClick={e => { e.stopPropagation(); e.preventDefault(); onAction('publish', post); }}
          title="Publish now"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#c5d247]/10 border border-[#c5d247]/20 text-[#c5d247] text-[10px] font-bold uppercase tracking-wider hover:bg-[#c5d247]/20 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>send</span>
          Publish
        </button>
      )}
      <button
        onClick={e => { e.stopPropagation(); e.preventDefault(); onAction('deactivate', post); }}
        title="Deactivate"
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-[#988d9c] hover:bg-[#ffd166]/10 hover:border-[#ffd166]/20 hover:text-[#ffd166] transition-all"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>pause_circle</span>
      </button>
    </div>
  );
}

export default function PostsTable({ posts, view, onAction }: PostsTableProps) {
  if (posts.length === 0) {
    return (
      <div className="glass-card rounded-3xl border border-[#4c4450]/5 p-16 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-[#353534]" style={{ fontSize: 48 }}>
          {view === 'inactive' ? 'inventory_2' : 'article'}
        </span>
        <p className="text-[#988d9c] text-sm">
          {view === 'inactive' ? 'No inactive posts.' : 'No posts found.'}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-[#4c4450]/5 hidden md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#4c4450]/10">
              {TABLE_HEADERS.map(h => (
                <th key={h} className="px-6 py-4 text-[#988d9c] uppercase text-[10px] tracking-widest font-semibold bg-[#1c1b1b]/50">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4c4450]/5">
            {posts.map(post => {
              const p = PLATFORM_REGISTRY[post.platform];
              return (
                <tr key={post.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <Link to={`/posts/${post.id}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: p.color }}>
                        <SocialBrandIcon platformId={post.platform} size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate max-w-[240px] group-hover:text-[#d394ff] transition-colors">
                          {post.title}
                        </p>
                        <p className="text-[10px] text-[#988d9c] font-mono uppercase">ID: {post.id}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/posts/${post.id}`} className="flex items-center gap-2">
                      <PlatformIcon platformId={post.platform} size={22} rounded="rounded-md" />
                      <span className="text-xs text-[#cfc2d2]">{p.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/posts/${post.id}`}>
                      <StatusBadge status={post.status} />
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-[#cfc2d2]">
                    {format(post.date, 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-[#988d9c]">
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
          const p = PLATFORM_REGISTRY[post.platform];
          return (
            <div key={post.id} className="glass-card rounded-2xl border border-[#4c4450]/5 overflow-hidden">
              <Link
                to={`/posts/${post.id}`}
                className="flex items-center gap-4 p-4 hover:bg-[#201f1f] transition-all"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: p.color }}>
                  <SocialBrandIcon platformId={post.platform} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{post.title}</p>
                  <p className="text-[10px] text-[#988d9c] mt-0.5">
                    {p.name} · {format(post.date, 'MMM d')} · {post.time}
                  </p>
                </div>
                <StatusBadge status={post.status} size="xs" />
              </Link>
              <div className="flex items-center gap-2 px-4 pb-3 border-t border-[#4c4450]/5 pt-2">
                <ActionButtons post={post} view={view} onAction={onAction} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
