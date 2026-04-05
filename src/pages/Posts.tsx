import { Link } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import PostsTable from '../components/posts/PostsTable';
import ConfirmModal from '../components/shared/ConfirmModal';
import { usePosts } from '../hooks/usePosts';
import type { PostStatus } from '../domain/entities/Post';
import type { PlatformId } from '../domain/entities/Platform';
import { PLATFORM_REGISTRY } from '../domain/entities/Platform';

const STATUS_FILTERS: { label: string; value: PostStatus | 'all'; color: string }[] = [
  { label: 'All',       value: 'all',       color: '#988d9c' },
  { label: 'Published', value: 'published', color: '#c5d247' },
  { label: 'Scheduled', value: 'scheduled', color: '#d394ff' },
  { label: 'Draft',     value: 'draft',     color: '#adaaaa' },
];

const PLATFORM_FILTERS: { value: PlatformId | 'all'; label: string; color?: string }[] = [
  { value: 'all',       label: 'All Platforms' },
  { value: 'instagram', label: PLATFORM_REGISTRY.instagram.name, color: PLATFORM_REGISTRY.instagram.color },
  { value: 'linkedin',  label: PLATFORM_REGISTRY.linkedin.name,  color: PLATFORM_REGISTRY.linkedin.color  },
  { value: 'facebook',  label: PLATFORM_REGISTRY.facebook.name,  color: PLATFORM_REGISTRY.facebook.color  },
];

export default function Posts() {
  const {
    filteredPosts, inactiveCount,
    isLoading,
    view, setView,
    search, setSearch,
    statusFilter, setStatusFilter,
    platformFilter, setPlatformFilter,
    pendingAction, requestAction, cancelAction, confirmAction,
    refresh,
    pageRef,
  } = usePosts();

  const MODAL_CONFIG = {
    activate: {
      title:        'Activate post',
      message:      `"${pendingAction?.post.title}" will be moved back to drafts and become active again.`,
      confirmLabel: 'Activate',
      variant:      'success' as const,
    },
    deactivate: {
      title:        'Deactivate post',
      message:      `"${pendingAction?.post.title}" will be moved to the Inactive tab and removed from active tracking.`,
      note:         'You can permanently delete it from the Inactive section.',
      confirmLabel: 'Deactivate',
      variant:      'warning' as const,
    },
    delete: {
      title:        'Delete post',
      message:      `"${pendingAction?.post.title}" will be permanently deleted.`,
      note:         'This action cannot be undone. The post will be marked as deleted for audit purposes but will no longer appear anywhere.',
      confirmLabel: 'Delete',
      variant:      'danger' as const,
    },
    publish: {
      title:        'Publish now',
      message:      `"${pendingAction?.post.title}" will be sent to ${pendingAction?.post.platform} immediately, bypassing the scheduled time.`,
      confirmLabel: 'Publish now',
      variant:      'success' as const,
    },
    retry: {
      title:        'Retry post',
      message:      `"${pendingAction?.post.title}" will be queued again for publishing.`,
      note:         'Make sure your account is still connected before retrying.',
      confirmLabel: 'Retry',
      variant:      'warning' as const,
    },
  };

  return (
    <div ref={pageRef}>
      <TopBar
        title="Posts"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => void refresh()}
              disabled={isLoading}
              title="Refresh"
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#4c4450]/20 text-[#988d9c] hover:text-white hover:border-[#4c4450]/40 transition-all disabled:opacity-40"
            >
              <span className={`material-symbols-outlined text-[16px] ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
            </button>
            <Link
              to="/composer"
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#d394ff] text-[#2f004d] text-xs font-bold hover:shadow-[0_0_20px_rgba(211,148,255,0.3)] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              New Post
            </Link>
          </div>
        }
      />

      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-5">

        {/* Header + search */}
        <div data-posts-header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* View tabs */}
            <div className="flex items-center gap-1 bg-[#1c1b1b] border border-[#4c4450]/15 rounded-xl p-1">
              <button
                onClick={() => setView('active')}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  view === 'active'
                    ? 'bg-[#d394ff]/15 text-[#d394ff] border border-[#d394ff]/25'
                    : 'text-[#988d9c] hover:text-white',
                ].join(' ')}
              >
                Active
              </button>
              <button
                onClick={() => setView('inactive')}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
                  view === 'inactive'
                    ? 'bg-[#ffd166]/10 text-[#ffd166] border border-[#ffd166]/25'
                    : 'text-[#988d9c] hover:text-white',
                ].join(' ')}
              >
                Inactive
                {inactiveCount > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${view === 'inactive' ? 'bg-[#ffd166]/20 text-[#ffd166]' : 'bg-[#4c4450]/30 text-[#988d9c]'}`}>
                    {inactiveCount}
                  </span>
                )}
              </button>
            </div>
            <p className="text-[#988d9c] text-xs">{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#988d9c]" style={{ fontSize: 16 }}>search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-[#1c1b1b] border border-[#4c4450]/15 rounded-full py-2 pl-9 pr-4 text-xs w-56 focus:outline-none focus:border-[#d394ff]/50 transition-all text-[#e5e2e1] placeholder:text-[#988d9c]/50"
              placeholder="Search posts..."
            />
          </div>
        </div>

        {/* Filters — only shown in active view */}
        {view === 'active' && (
          <div data-posts-filters className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {STATUS_FILTERS.map(({ label, value, color }) => {
                const active = statusFilter === value;
                return (
                  <button
                    key={value}
                    onClick={() => setStatusFilter(value)}
                    className={[
                      'px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all',
                      active ? 'border-transparent' : 'bg-transparent border-[#4c4450]/20 text-[#988d9c] hover:border-[#4c4450]/40 hover:text-white',
                    ].join(' ')}
                    style={active ? { background: color + '22', borderColor: color + '60', color } : {}}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="w-px bg-[#4c4450]/20 hidden sm:block" />
            <div className="flex items-center gap-2 flex-wrap">
              {PLATFORM_FILTERS.map(({ value, label, color }) => {
                const active = platformFilter === value;
                return (
                  <button
                    key={value}
                    onClick={() => setPlatformFilter(value)}
                    className={[
                      'px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all',
                      active && color  ? 'border-transparent' : '',
                      active && !color ? 'bg-[#d394ff]/10 border-[#d394ff]/30 text-[#d394ff]' : '',
                      !active ? 'bg-transparent border-[#4c4450]/20 text-[#988d9c] hover:border-[#4c4450]/40 hover:text-white' : '',
                    ].join(' ')}
                    style={active && color ? { background: color + '22', borderColor: color + '60', color } : {}}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Table */}
        <div data-posts-table>
          <PostsTable posts={filteredPosts} view={view} onAction={requestAction} />
        </div>
      </div>

      {/* Confirm modal */}
      {pendingAction && (
        <ConfirmModal
          {...MODAL_CONFIG[pendingAction.type]}
          onConfirm={confirmAction}
          onClose={cancelAction}
        />
      )}

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link
          to="/composer"
          className="w-14 h-14 bg-[#d394ff] text-[#5e2388] rounded-full shadow-[0_0_20px_rgba(211,148,255,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        </Link>
      </div>
    </div>
  );
}
