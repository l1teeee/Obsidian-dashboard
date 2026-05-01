import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import * as postsService from '../services/posts.service';
import { listConnections } from '../services/platforms.service';
import { postsStore } from '../lib/postsStore';
import type { CalendarPost } from '../domain/entities/CalendarPost';
import type { PostStatus } from '../domain/entities/Post';
import type { PlatformId } from '../domain/entities/Platform';
import type { PageMeta } from '../lib/api';

export type PostAction = 'activate' | 'deactivate' | 'delete' | 'publish' | 'retry';
export type PostsView  = 'active' | 'inactive';

export interface PendingAction {
  type: PostAction;
  post: CalendarPost;
}

const LIMIT = 10;

function mapPlatform(platform: string): PlatformId {
  if (platform === 'linkedin')               return 'linkedin';
  if (platform === 'facebook' || platform === 'meta') return 'facebook';
  if (platform === 'instagram')              return 'instagram';
  if (platform === 'youtube')                return 'youtube';
  return 'instagram';
}

function mapStatus(status: string): PostStatus {
  if (status === 'published') return 'published';
  if (status === 'scheduled') return 'scheduled';
  if (status === 'draft')     return 'draft';
  if (status === 'inactive')  return 'inactive';
  if (status === 'deleted')   return 'deleted';
  return 'scheduled';
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function mapApiPost(post: postsService.ApiPost): CalendarPost {
  const dateStr = post.scheduled_at ?? post.published_at ?? post.created_at;
  return {
    id:       post.id,
    date:     new Date(dateStr),
    time:     formatTime(dateStr),
    platform: mapPlatform(post.platform),
    title:    post.caption ? post.caption.slice(0, 60) : 'Untitled',
    status:   mapStatus(post.status),
  };
}

export function usePosts() {
  const pageRef = useRef<HTMLDivElement>(null);

  const [posts,              setPosts]              = useState<CalendarPost[]>([]);
  const [meta,               setMeta]               = useState<PageMeta | null>(null);
  const [inactiveCount,      setInactiveCount]      = useState(0);
  const [isLoading,          setIsLoading]          = useState(true);
  const [page,               setPage]               = useState(1);
  const [view,               setView]               = useState<PostsView>('active');
  const [search,             setSearch]             = useState('');
  const [statusFilter,       setStatusFilter]       = useState<PostStatus | 'all'>('all');
  const [platformFilter,     setPlatformFilter]     = useState<PlatformId | 'all'>('all');
  const [pendingAction,      setPendingAction]      = useState<PendingAction | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string> | null>(null);
  const searchTimeout   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchController = useRef<AbortController | null>(null);

  const fetchPage = useCallback(async (
    p: number,
    v: PostsView,
    st: PostStatus | 'all',
    pl: PlatformId | 'all',
    q: string,
    silent = false,
  ) => {
    // Cancel previous in-flight request before starting a new one
    fetchController.current?.abort();
    const controller = new AbortController();
    fetchController.current = controller;

    if (!silent) setIsLoading(true);
    try {
      const statusParam = v === 'inactive'
        ? 'inactive'
        : st === 'all' ? undefined : st;

      const res = await postsService.getAll({
        page:     p,
        limit:    LIMIT,
        status:   statusParam,
        platform: pl === 'all' ? undefined : pl,
        search:   q || undefined,
      }, controller.signal);

      setPosts(res.posts.map(mapApiPost));
      setMeta(res.meta);

      if (v === 'active') {
        postsStore.set(res.posts.map(mapApiPost), postsStore.get().inactive ?? []);
      }
    } catch (err) {
      if ((err as { name?: string }).name === 'AbortError') return;
      setPosts([]);
      setMeta(null);
    } finally {
      if (!controller.signal.aborted && !silent) setIsLoading(false);
    }
  }, []);

  // Fetch inactive count badge separately (cheap: limit 1)
  const fetchInactiveCount = useCallback(async () => {
    try {
      const res = await postsService.getAll({ status: 'inactive', page: 1, limit: 1 });
      setInactiveCount(res.meta.total);
    } catch { /* badge is non-critical */ }
  }, []);

  // Cancel any in-flight requests when the component unmounts
  useEffect(() => () => { fetchController.current?.abort(); }, []);

  // Initial load + whenever view/status/platform change
  useEffect(() => {
    setPage(1);
    void fetchPage(1, view, statusFilter, platformFilter, search);
    void fetchInactiveCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, statusFilter, platformFilter]);

  // Stay in sync with optimistic updates from PostComposer / other pages
  useEffect(() => postsStore.subscribe(() => {
    const { active } = postsStore.get();
    if (active !== null && view === 'active') setPosts(active);
  }), [view]);

  // Connected platforms for warning icons (null = still loading, no warnings shown yet)
  const refreshConnectedPlatforms = useCallback(() => {
    listConnections()
      .then(conns => {
        const connected = new Set<string>(['linkedin']);
        if (conns.some(c => c.platform === 'instagram')) connected.add('instagram');
        if (conns.some(c => c.platform === 'facebook' && c.page_id)) connected.add('facebook');
        setConnectedPlatforms(connected);
      })
      .catch(() => {
        setConnectedPlatforms(new Set(['instagram', 'facebook', 'linkedin']));
      });
  }, []);

  useEffect(() => {
    refreshConnectedPlatforms();
    const handleVisibility = () => { if (document.visibilityState === 'visible') refreshConnectedPlatforms(); };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [refreshConnectedPlatforms]);

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-posts-header]',  { y: -16, opacity: 0, duration: 0.45, ease: 'power3.out' });
      gsap.from('[data-posts-filters]', { y: -8,  opacity: 0, duration: 0.4,  ease: 'power3.out', delay: 0.1 });
      gsap.from('[data-posts-table]',   { y: 20,  opacity: 0, duration: 0.5,  ease: 'power3.out', delay: 0.15 });
    }, pageRef.current!);
    return () => ctx.revert();
  }, []);

  const handleSearch = (v: string) => {
    setSearch(v);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      void fetchPage(1, view, statusFilter, platformFilter, v);
    }, 350);
  };

  const goPage = (p: number) => {
    setPage(p);
    void fetchPage(p, view, statusFilter, platformFilter, search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSetView = (v: PostsView) => {
    setView(v);
    setPage(1);
    setStatusFilter('all');
    setPlatformFilter('all');
    setSearch('');
  };

  const handleSetStatusFilter = (v: PostStatus | 'all') => {
    setStatusFilter(v);
    setPage(1);
  };

  const handleSetPlatformFilter = (v: PlatformId | 'all') => {
    setPlatformFilter(v);
    setPage(1);
  };

  const requestAction = (type: PostAction, post: CalendarPost) => setPendingAction({ type, post });
  const cancelAction  = () => setPendingAction(null);

  const refresh = useCallback(() => {
    void fetchPage(page, view, statusFilter, platformFilter, search);
    void fetchInactiveCount();
  }, [page, view, statusFilter, platformFilter, search, fetchPage, fetchInactiveCount]);

  const confirmAction = async () => {
    if (!pendingAction) return;
    const { type, post } = pendingAction;
    setPendingAction(null);

    try {
      if (type === 'activate') {
        await postsService.update(post.id, { status: 'draft' });
      } else if (type === 'deactivate') {
        await postsService.deactivate(post.id);
      } else if (type === 'delete') {
        await postsService.remove(post.id);
      } else if (type === 'publish') {
        await postsService.update(post.id, { status: 'published' });
      } else if (type === 'retry') {
        await postsService.update(post.id, { status: 'scheduled' });
      }
      // Refetch current page after any mutation
      void fetchPage(page, view, statusFilter, platformFilter, search);
      void fetchInactiveCount();
    } catch (err) {
      if (import.meta.env.DEV) console.error('Post action failed:', err);
      void fetchPage(page, view, statusFilter, platformFilter, search);
    }
  };

  return {
    posts,
    meta,
    inactiveCount,
    isLoading,
    page,
    goPage,
    view,               setView: handleSetView,
    search,             setSearch: handleSearch,
    statusFilter,       setStatusFilter: handleSetStatusFilter,
    platformFilter,     setPlatformFilter: handleSetPlatformFilter,
    pendingAction,
    requestAction,
    cancelAction,
    confirmAction,
    pageRef,
    refresh,
    connectedPlatforms,
  };
}
