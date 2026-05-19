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
  const fmt = (v: number | null) => loading ? '—' : v === null ? '—' : v.toLocaleString();

  const engRate = (!loading && m && m.reach && m.reach > 0 && m.likes !== null)
    ? `${((m.likes / m.reach) * 100).toFixed(1)}%`
    : '—';

  return [
    { label: 'Impressions', value: fmt(m?.impressions ?? null), delta: null, positive: true },
    { label: 'Reach',       value: fmt(m?.reach       ?? null), delta: null, positive: true },
    { label: 'Likes',       value: fmt(m?.likes       ?? null), delta: null, positive: true },
    { label: 'Comments',    value: fmt(m?.comments    ?? null), delta: null, positive: true },
    { label: 'Shares',      value: fmt(m?.shares      ?? null), delta: null, positive: true },
    { label: 'Clicks',      value: fmt(m?.clicks      ?? null), delta: null, positive: true },
    { label: 'Eng. Rate',   value: loading ? '—' : engRate,    delta: null, positive: true },
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
  const { apiPost, metrics, metricsLoading, metricsRefreshing, refreshMetrics, loading, notFound, resolvedId, pageRef, handleBack } = usePostDetail();
  const navigate     = useNavigate();
  const menuRef      = useRef<HTMLDivElement>(null);
  const [menuOpen,          setMenuOpen]          = useState(false);
  const [action,            setAction]            = useState<DetailAction>(null);
  const [submitting,        setSubmitting]        = useState(false);
  const [postStatus,        setPostStatus]        = useState<PostStatus | null>(null);
  const [removeFromFacebook, setRemoveFromFacebook] = useState(true);

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
        const isFbPublished = apiPost?.platform === 'facebook' && apiPost?.platform_post_id && postStatus === 'published';
        await postsService.remove(resolvedId, !!(isFbPublished && removeFromFacebook));
        navigate('/posts');
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error(err);
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
        <span className="text-[#6B655B] text-sm animate-pulse">Loading post…</span>
      </div>
    );
  }

  if (notFound) {
    return (
      <div ref={pageRef} className="flex flex-col items-center justify-center h-64 gap-3">
        <span className="material-symbols-outlined text-[#6B655B] text-4xl">find_in_page</span>
        <p className="text-[#6B655B] text-sm">Post not found.</p>
        <button onClick={handleBack} className="text-xs text-[#C8553A] hover:underline">Go back</button>
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
              className="flex items-center gap-1.5 text-sm text-[#6B655B] hover:text-[#15140F] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back
            </button>

            {postStatus && <StatusBadge status={postStatus} />}

            {/* Refresh metrics */}
            {postStatus === 'published' && (
              <button
                onClick={refreshMetrics}
                disabled={metricsRefreshing}
                title="Refresh metrics"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#15140F]/20 text-[#6B655B] hover:text-[#15140F] hover:border-[#15140F]/40 transition-all text-xs disabled:opacity-50"
              >
                <span
                  className={`material-symbols-outlined ${metricsRefreshing ? 'animate-spin' : ''}`}
                  style={{ fontSize: 14 }}
                >refresh</span>
                {metricsRefreshing ? 'Updating…' : 'Refresh'}
              </button>
            )}

            {/* Open post link */}
            {apiPost?.permalink && postStatus === 'published' && (
              <a
                href={apiPost.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#C8553A]/10 border border-[#C8553A]/20 text-[#C8553A] text-xs font-bold hover:bg-[#C8553A]/20 transition-all"
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
                    ? 'bg-[#C8553A]/10 border-[#C8553A]/30 text-[#C8553A]'
                    : 'border-[#15140F]/20 text-[#6B655B] hover:border-[#15140F]/40 hover:text-[#15140F]',
                ].join(' ')}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>more_vert</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#FBF8F2] border border-[#15140F]/20 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] z-50 overflow-hidden py-1">
                  {isInactive ? (
                    <button
                      onClick={() => { setMenuOpen(false); setAction('activate'); }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#4F7A4A] hover:bg-[#4F7A4A]/8 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>play_circle</span>
                      Activate
                    </button>
                  ) : (
                    <button
                      onClick={() => { setMenuOpen(false); setAction('deactivate'); }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#B7841E] hover:bg-[#B7841E]/8 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>pause_circle</span>
                      Deactivate
                    </button>
                  )}
                  <div className="h-px bg-[#15140F]/20 mx-3" />
                  <button
                    onClick={() => { setMenuOpen(false); setAction('delete'); }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#A8362A] hover:bg-[#A8362A]/8 transition-colors text-left"
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

        {/* ── Main grid ── */}
        <section className="grid grid-cols-12 gap-6 lg:gap-10 items-start">

          {/* Preview card */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-4">
            <PostPreviewCard
              platform={displayPlatform}
              caption={apiPost?.caption ?? null}
              mediaUrls={apiPost?.media_urls ?? null}
              date={displayDate}
              status={postStatus ?? ''}
              permalink={apiPost?.permalink}
            />
          </div>

          {/* Right column */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-8 space-y-6">

            {/* ── Meta chips ── */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFE9DC] border border-[#15140F]/15">
                <span
                  className="material-symbols-outlined text-[#6B655B]"
                  style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}
                >
                  {hasMedia ? (apiPost?.media_urls?.some(u => /\.(mp4|mov|webm|avi)(\?|#|$)/i.test(u)) ? 'play_circle' : 'image') : 'text_fields'}
                </span>
                <span className="text-xs text-[#6B655B] font-medium">
                  {hasMedia
                    ? `${apiPost?.media_urls?.length ?? 0} ${(apiPost?.media_urls?.length ?? 0) === 1 ? 'file' : 'files'}`
                    : 'Text only'}
                </span>
              </div>
              {apiPost?.post_type && apiPost.post_type !== 'post' && (
                <div className="px-3 py-1.5 rounded-xl bg-[#EFE9DC] border border-[#15140F]/15 text-xs text-[#6B655B] font-medium capitalize">
                  {apiPost.post_type}
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFE9DC] border border-[#15140F]/15">
                <span className="material-symbols-outlined text-[#6B655B]" style={{ fontSize: 13 }}>schedule</span>
                <span className="text-xs text-[#6B655B]">{displayDate}</span>
              </div>
            </div>

            {/* ── Caption block ── */}
            {apiPost?.caption ? (
              <div className="rounded-2xl bg-[#FBF8F2] border border-[#15140F]/15 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#15140F]/10">
                  <span className="material-symbols-outlined text-[#6B655B]" style={{ fontSize: 13 }}>notes</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B655B]">Caption</span>
                </div>
                <p className="px-4 py-3 text-sm text-[#3D3A30] leading-relaxed whitespace-pre-wrap">
                  {apiPost.caption}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#FBF8F2] border border-[#15140F]/15">
                <span className="material-symbols-outlined text-[#15140F]" style={{ fontSize: 14 }}>notes</span>
                <p className="text-xs text-[#15140F] italic">No caption</p>
              </div>
            )}

            {/* ── Metrics ── */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#15140F] px-1">Performance</p>

              {/* Dev mode notice */}
              {!metricsLoading && metrics?.dev_mode && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-[#EFE9DC] border border-[#15140F]/15">
                  <span className="material-symbols-outlined text-[#6B655B] shrink-0 mt-0.5" style={{ fontSize: 14 }}>info</span>
                  <p className="text-xs text-[#6B655B] leading-relaxed">
                    Metrics are unavailable in development mode and will appear automatically in production.
                  </p>
                </div>
              )}

              {/* Skeleton */}
              {metricsLoading && (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 animate-pulse">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="bg-[#EFE9DC] rounded-2xl p-5 border border-[#15140F]/5 space-y-3">
                      <div className="w-5 h-5 rounded bg-[#E7E0D0]" />
                      <div className="h-7 w-14 rounded-lg bg-[#E7E0D0]" />
                      <div className="h-2 w-16 rounded-full bg-[#E7E0D0]" />
                    </div>
                  ))}
                </div>
              )}

              {/* Cards */}
              {!metricsLoading && (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {buildMetrics(metrics, metricsLoading).map((m) => (
                    <MetricCard key={m.label} metric={m} />
                  ))}
                </div>
              )}
            </div>

            {/* ── Permalink ── */}
            {apiPost?.permalink ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#FBF8F2] border border-[#15140F]/15">
                <span className="material-symbols-outlined text-[#4F7A4A] shrink-0" style={{ fontSize: 15 }}>link</span>
                <a
                  href={apiPost.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#4F7A4A] hover:text-[#3d6239] transition-colors truncate flex-1"
                >
                  {apiPost.permalink}
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(apiPost.permalink!)}
                  title="Copy link"
                  className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-[#6B655B] hover:text-[#15140F] hover:bg-white/8 transition-all"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>content_copy</span>
                </button>
              </div>
            ) : postStatus === 'published' ? (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#FBF8F2] border border-[#15140F]/15">
                <span className="material-symbols-outlined text-[#15140F] shrink-0" style={{ fontSize: 14 }}>link_off</span>
                <p className="text-xs text-[#15140F]">No permalink available for this post.</p>
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
        >
          {action === 'delete' && apiPost?.platform === 'facebook' && apiPost?.platform_post_id && postStatus === 'published' && (
            <button
              type="button"
              onClick={() => setRemoveFromFacebook(v => !v)}
              className="flex items-center gap-2.5 mt-1"
            >
              <div className={`w-4 h-4 rounded-[4px] border shrink-0 flex items-center justify-center transition-all ${removeFromFacebook ? 'bg-[#C8553A] border-[#C8553A]' : 'border-[#15140F]/50 bg-transparent'}`}>
                {removeFromFacebook && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1 4.5L3.5 7L8 1.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-xs text-[#6B655B]">Also remove from Facebook</span>
            </button>
          )}
        </ConfirmModal>
      )}
    </div>
  );
}
