import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import PostPreviewCard from '../components/post-detail/PostPreviewCard';
import MetricCard from '../components/post-detail/MetricCard';
import BenchmarkBar from '../components/post-detail/BenchmarkBar';
import SentimentRing from '../components/post-detail/SentimentRing';
import VisualIntelligence from '../components/post-detail/VisualIntelligence';
import CommentList from '../components/post-detail/CommentList';
import ConfirmModal from '../components/shared/ConfirmModal';
import StatusBadge from '../components/shared/StatusBadge';
import { usePostDetail } from '../hooks/usePostDetail';
import * as postsService from '../services/posts.service';
import type { PostStatus } from '../domain/entities/Post';
import type { PlatformId } from '../domain/entities/Platform';
import { PLATFORM_REGISTRY } from '../domain/entities/Platform';
import { MockPostRepository } from '../infrastructure/repositories/MockPostRepository';

type DetailAction = 'activate' | 'deactivate' | 'delete' | null;

// Placeholder mock analytics (Phase 3/4 pending — no real metrics from API yet)
const MOCK_ANALYTICS = new MockPostRepository().getById('88291')!;

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export default function PostDetail() {
  const { apiPost, loading, notFound, resolvedId, pageRef, handleBack } = usePostDetail();
  const navigate     = useNavigate();
  const menuRef      = useRef<HTMLDivElement>(null);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [action,     setAction]     = useState<DetailAction>(null);
  const [submitting, setSubmitting] = useState(false);
  const [postStatus, setPostStatus] = useState<PostStatus | null>(null);

  // Sync status from apiPost
  useEffect(() => {
    if (apiPost) setPostStatus(apiPost.status as PostStatus);
  }, [apiPost]);

  // Close menu on outside click
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
      title:        'Activate post',
      message:      'This post will be moved back to drafts and become active again.',
      confirmLabel: 'Activate',
      variant:      'success',
    },
    deactivate: {
      title:        'Deactivate post',
      message:      'This post will be moved to Inactive and removed from active tracking.',
      note:         'You can reactivate it at any time from here or the Inactive tab.',
      confirmLabel: 'Deactivate',
      variant:      'warning',
    },
    delete: {
      title:        'Delete post',
      message:      'This post will be permanently deleted.',
      note:         'The record is kept for audit purposes but will no longer appear anywhere.',
      confirmLabel: 'Delete',
      variant:      'danger',
    },
  };

  // Build display post from real API data + mock analytics placeholder
  const displayPlatform: PlatformId =
    apiPost?.platform && apiPost.platform in PLATFORM_REGISTRY
      ? (apiPost.platform as PlatformId)
      : 'instagram';

  const displayPost = {
    ...MOCK_ANALYTICS,
    id:       resolvedId,
    platform: displayPlatform,
    caption:  apiPost?.caption ?? '(no caption)',
    imageUrl: apiPost?.media_urls?.[0] ?? MOCK_ANALYTICS.imageUrl,
    date:     formatDate(apiPost?.published_at ?? apiPost?.scheduled_at ?? apiPost?.created_at),
  };

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

            <button className="bg-[#e4b9ff] text-[#2f004d] px-5 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-transform">
              Export Report
            </button>

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

      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 md:space-y-10">
        <section className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 lg:col-span-5">
            <PostPreviewCard post={displayPost} />
          </div>
          <div className="col-span-12 lg:col-span-7 space-y-6 md:space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {displayPost.metrics.map((m, i) => (
                <MetricCard key={m.label} metric={m} index={i} />
              ))}
            </div>
            <div className="bg-[#201f1f] rounded-3xl p-6 md:p-8 border border-[#4c4450]/10">
              <h3 className="font-headline font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d394ff]">equalizer</span>
                Performance Benchmark
              </h3>
              <div className="space-y-6">
                {displayPost.benchmarks.map(b => (
                  <BenchmarkBar key={b.label} benchmark={b} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SentimentRing />
          <VisualIntelligence tags={displayPost.tags} />
        </section>

        <CommentList comments={displayPost.comments} commentsCount={displayPost.metrics[1]?.value ?? '0'} />
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
