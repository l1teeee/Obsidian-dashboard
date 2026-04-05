import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import PostPreviewCard from '../components/post-detail/PostPreviewCard';
import MetricCard from '../components/post-detail/MetricCard';
import ConfirmModal from '../components/shared/ConfirmModal';
import StatusBadge from '../components/shared/StatusBadge';
import { usePostDetail } from '../hooks/usePostDetail';
import * as postsService from '../services/posts.service';
import type { PostMetric, PostStatus } from '../domain/entities/Post';
import type { ApiPostMetrics } from '../services/posts.service';
import type { PlatformId } from '../domain/entities/Platform';
import { PLATFORM_REGISTRY } from '../domain/entities/Platform';

type DetailAction = 'activate' | 'deactivate' | 'delete' | null;

function buildMetrics(m: ApiPostMetrics | null, loading: boolean): PostMetric[] {
  const fmt  = (v: number | null) => loading ? '—' : v === null ? '—' : v.toLocaleString();
  return [
    { label: 'Reach',       value: fmt(m?.reach       ?? null), delta: null, positive: true },
    { label: 'Impressions', value: fmt(m?.impressions  ?? null), delta: null, positive: true },
    { label: 'Likes',       value: fmt(m?.likes        ?? 0),   delta: null, positive: true },
    { label: 'Comments',    value: fmt(m?.comments     ?? 0),   delta: null, positive: true },
    { label: 'Shares',      value: fmt(m?.shares       ?? 0),   delta: null, positive: true },
    { label: 'Saves',       value: '—',                          delta: null, positive: true },
  ];
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export default function PostDetail() {
  const { apiPost, metrics, metricsLoading, loading, notFound, resolvedId, pageRef, handleBack } = usePostDetail();
  const navigate     = useNavigate();
  const menuRef      = useRef<HTMLDivElement>(null);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [action,     setAction]     = useState<DetailAction>(null);
  const [submitting, setSubmitting] = useState(false);
  const [postStatus, setPostStatus] = useState<PostStatus | null>(null);

  useEffect(() => {
    if (apiPost) setPostStatus(apiPost.status as PostStatus);
  }, [apiPost]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const isInactive = postStatus === 'inactive';

  const handleConfirm = async () => {
    if (!action) return;
    setSubmitting(true);
    try {
      if (action === 'activate') {
        await postsService.update(resolvedId, { status: 'draft' });
        setPostStatus('draft');
        setAction(null);
      } else if (action === 'deactivate') {
        await postsService.deactivate(resolvedId);
        setPostStatus('inactive');
        setAction(null);
      } else if (action === 'delete') {
        await postsService.remove(resolvedId);
        navigate('/posts');
      }
    } catch (err) {
      console.error(err);
      setAction(null);
    } finally {
      setSubmitting(false);
    }
  };

  const MODAL_CONFIG: Record<NonNullable<DetailAction>, {
    title: string; message: string; note?: string; confirmLabel: string; variant: 'danger' | 'warning' | 'success' | 'primary';
  }> = {
    activate: {
      title: 'Activate post', message: 'This post will be moved back to drafts.',
      confirmLabel: 'Activate', variant: 'success',
    },
    deactivate: {
      title: 'Deactivate post', message: 'This post will be moved to Inactive.',
      note: 'You can reactivate it at any time.',
      confirmLabel: 'Deactivate', variant: 'warning',
    },
    delete: {
      title: 'Delete post', message: 'This post will be permanently deleted.',
      note: 'This action cannot be undone.',
      confirmLabel: 'Delete', variant: 'danger',
    },
  };

  const displayPlatform: PlatformId =
    apiPost?.platform && apiPost.platform in PLATFORM_REGISTRY
      ? (apiPost.platform as PlatformId)
      : 'instagram';

  const displayDate = formatDate(apiPost?.published_at ?? apiPost?.scheduled_at ?? apiPost?.created_at);
  const hasMedia    = (apiPost?.media_urls?.length ?? 0) > 0;

  if (loading) {
    return (
      <div ref={pageRef} className="flex items-center justify-center h-64">
        <span className="text-[#988d9c] text-sm animate-pulse">Loading post…</span>
      </div>
    );
  }

  if (notFound) {
    return (
      <div ref={pageRef} className="flex flex-col items-center justify-center h-64 gap-3">
        <span className="material-symbols-outlined text-[#988d9c] text-4xl">find_in_page</span>
        <p className="text-[#988d9c] text-sm">Post not found.</p>
        <button onClick={handleBack} className="text-xs text-[#d394ff] hover:underline">Go back</button>
      </div>
    );
  }

  return (
    <div ref={pageRef}>
      <TopBar
        title="Post Detail"
        subtitle={`#${resolvedId}`}
        actions={
          <>
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-[#988d9c] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back
            </button>

            {postStatus && <StatusBadge status={postStatus} />}

            {/* Open post link */}
            {apiPost?.permalink && postStatus === 'published' && (
              <a
                href={apiPost.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#d394ff]/10 border border-[#d394ff]/20 text-[#d394ff] text-xs font-bold hover:bg-[#d394ff]/20 transition-all"
              >
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                View on {PLATFORM_REGISTRY[displayPlatform]?.name ?? 'Platform'}
              </a>
            )}

            {/* 3-dot menu */}
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className={[
                  'w-8 h-8 flex items-center justify-center rounded-xl border transition-all',
                  menuOpen
                    ? 'bg-[#d394ff]/10 border-[#d394ff]/30 text-[#d394ff]'
                    : 'border-[#4c4450]/20 text-[#988d9c] hover:border-[#4c4450]/40 hover:text-white',
                ].join(' ')}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>more_vert</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#1c1b1b] border border-[#4c4450]/20 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] z-50 overflow-hidden py-1">
                  {isInactive ? (
                    <button
                      onClick={() => { setMenuOpen(false); setAction('activate'); }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#c5d247] hover:bg-[#c5d247]/8 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>play_circle</span>
                      Activate
                    </button>
                  ) : (
                    <button
                      onClick={() => { setMenuOpen(false); setAction('deactivate'); }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#ffd166] hover:bg-[#ffd166]/8 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>pause_circle</span>
                      Deactivate
                    </button>
                  )}
                  <div className="h-px bg-[#4c4450]/20 mx-3" />
                  <button
                    onClick={() => { setMenuOpen(false); setAction('delete'); }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#ffb4ab] hover:bg-[#ffb4ab]/8 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete_forever</span>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </>
        }
      />

      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">

        {/* Post info + metrics */}
        <section className="grid grid-cols-12 gap-6 md:gap-10">

          {/* Preview */}
          <div className="col-span-12 lg:col-span-5">
            <PostPreviewCard
              platform={displayPlatform}
              caption={apiPost?.caption ?? null}
              mediaUrls={apiPost?.media_urls ?? null}
              date={displayDate}
              status={postStatus ?? ''}
              permalink={apiPost?.permalink}
            />
          </div>

          {/* Metrics */}
          <div className="col-span-12 lg:col-span-7 space-y-6">

            {/* Post type badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#201f1f] border border-[#4c4450]/10">
                <span className="material-symbols-outlined text-[#988d9c]" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>
                  {hasMedia ? 'image' : 'text_fields'}
                </span>
                <span className="text-xs text-[#988d9c] font-medium">
                  {hasMedia ? `Image post · ${apiPost?.media_urls?.length ?? 0} media` : 'Text post'}
                </span>
              </div>
              {apiPost?.post_type && apiPost.post_type !== 'post' && (
                <div className="px-3 py-1.5 rounded-xl bg-[#201f1f] border border-[#4c4450]/10 text-xs text-[#988d9c] font-medium capitalize">
                  {apiPost.post_type}
                </div>
              )}
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {buildMetrics(metrics, metricsLoading).map((m, i) => (
                <MetricCard key={m.label} metric={m} index={i} />
              ))}
            </div>

            {/* Insights note — only if reach/impressions are null after loading */}
            {!metricsLoading && metrics && metrics.reach === null && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl bg-[#201f1f] border border-[#4c4450]/10">
                <span className="material-symbols-outlined text-[#988d9c] shrink-0 mt-0.5" style={{ fontSize: 14 }}>info</span>
                <p className="text-xs text-[#988d9c] leading-relaxed">
                  Reach & Impressions require the <span className="text-white font-medium">read_insights</span> permission.
                  Reconnect Facebook to grant it.
                </p>
              </div>
            )}

            {/* Permalink block */}
            {apiPost?.permalink ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#201f1f] border border-[#4c4450]/10">
                <span className="material-symbols-outlined text-[#c5d247] shrink-0" style={{ fontSize: 16 }}>link</span>
                <a
                  href={apiPost.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#c5d247] hover:text-[#d4e25a] transition-colors truncate flex-1"
                >
                  {apiPost.permalink}
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(apiPost.permalink!)}
                  title="Copy link"
                  className="text-[#988d9c] hover:text-white transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>content_copy</span>
                </button>
              </div>
            ) : postStatus === 'published' ? (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#201f1f] border border-[#4c4450]/10">
                <span className="material-symbols-outlined text-[#988d9c] shrink-0" style={{ fontSize: 14 }}>link_off</span>
                <p className="text-xs text-[#988d9c]">No permalink available for this post.</p>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {action && (
        <ConfirmModal
          {...MODAL_CONFIG[action]}
          onConfirm={handleConfirm}
          onClose={() => setAction(null)}
          disabled={submitting}
        />
      )}
    </div>
  );
}
