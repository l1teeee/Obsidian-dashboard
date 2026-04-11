import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import * as postsService from '../services/posts.service';
import { listConnections } from '../services/platforms.service';
import { postsStore } from '../lib/postsStore';
import type { CalendarPost } from '../domain/entities/CalendarPost';
import type { PostStatus } from '../domain/entities/Post';
import type { PlatformId } from '../domain/entities/Platform';

export type PostAction = 'activate' | 'deactivate' | 'delete' | 'publish' | 'retry';
export type PostsView  = 'active' | 'inactive';

export interface PendingAction {
  type: PostAction;
  post: CalendarPost;
}

// ─── Mapping ──────────────────────────────────────────────────────────────────

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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePosts() {
  const pageRef = useRef<HTMLDivElement>(null);

  const cached = postsStore.get();
  const [allPosts,           setAllPosts]           = useState<CalendarPost[]>(cached.active   ?? []);
  const [inactivePosts,      setInactivePosts]      = useState<CalendarPost[]>(cached.inactive ?? []);
  const [isLoading,          setIsLoading]          = useState(cached.active === null);
  const [view,               setView]               = useState<PostsView>('active');
  const [search,             setSearch]             = useState('');
  const [statusFilter,       setStatusFilter]       = useState<PostStatus | 'all'>('all');
  const [platformFilter,     setPlatformFilter]     = useState<PlatformId | 'all'>('all');
  const [pendingAction,      setPendingAction]      = useState<PendingAction | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(new Set(['linkedin']));

  const fetchPosts = useCallback(async (silent = false) => {
    let cancelled = false;
    if (!silent) setIsLoading(true);
    try {
      const [activePage, inactivePage] = await Promise.all([
        postsService.getAll({ limit: 100 }),
        postsService.getAll({ limit: 100, status: 'inactive' }),
      ]);
      if (!cancelled) {
        const active   = activePage.posts.map(mapApiPost);
        const inactive = inactivePage.posts.map(mapApiPost);
        postsStore.set(active, inactive);
        setAllPosts(active);
        setInactivePosts(inactive);
      }
    } catch {
      if (!cancelled) { setAllPosts([]); setInactivePosts([]); }
    } finally {
      if (!cancelled) setIsLoading(false);
    }
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    // If cache hit → show immediately, revalidate silently in background
    if (postsStore.get().active !== null) {
      void fetchPosts(true);
    } else {
      void fetchPosts();
    }
  }, [fetchPosts]);

  // Stay in sync with optimistic updates from other pages (e.g. PostComposer)
  useEffect(() => postsStore.subscribe(() => {
    const { active, inactive } = postsStore.get();
    if (active   !== null) setAllPosts(active);
    if (inactive !== null) setInactivePosts(inactive);
  }), []);

  // Load connected platforms for warning icons in the table
  useEffect(() => {
    listConnections()
      .then(conns => {
        const connected = new Set<string>(['linkedin']); // LinkedIn: no API check, default to connected
        if (conns.some(c => c.platform === 'instagram')) connected.add('instagram');
        if (conns.some(c => c.platform === 'facebook' && c.page_id)) connected.add('facebook');
        setConnectedPlatforms(connected);
      })
      .catch(() => {
        // On error assume all connected (don't block the UI)
        setConnectedPlatforms(new Set(['instagram', 'facebook', 'linkedin']));
      });
  }, []);

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-posts-header]',  { y: -16, opacity: 0, duration: 0.45, ease: 'power3.out' });
      gsap.from('[data-posts-filters]', { y: -8,  opacity: 0, duration: 0.4,  ease: 'power3.out', delay: 0.1 });
      gsap.from('[data-posts-table]',   { y: 20,  opacity: 0, duration: 0.5,  ease: 'power3.out', delay: 0.15 });
    }, pageRef.current!);
    return () => ctx.revert();
  }, []);

  const activePosts  = useMemo(
    () => allPosts.filter(p => p.status !== 'inactive' && p.status !== 'deleted'),
    [allPosts],
  );
  const displayPosts = view === 'active' ? activePosts : inactivePosts;

  const lowerSearch   = useMemo(() => search.toLowerCase(), [search]);
  const filteredPosts = useMemo(() => displayPosts.filter(p => {
    const matchesSearch   = p.title.toLowerCase().includes(lowerSearch);
    const matchesStatus   = statusFilter   === 'all' || p.status   === statusFilter;
    const matchesPlatform = platformFilter === 'all' || p.platform === platformFilter;
    return matchesSearch && matchesStatus && matchesPlatform;
  }), [displayPosts, lowerSearch, statusFilter, platformFilter]);

  const requestAction = (type: PostAction, post: CalendarPost) => setPendingAction({ type, post });
  const cancelAction  = () => setPendingAction(null);

  const confirmAction = async () => {
    if (!pendingAction) return;
    const { type, post } = pendingAction;
    setPendingAction(null);

    try {
      if (type === 'activate') {
        await postsService.update(post.id, { status: 'draft' });
        postsStore.updateOptimistic(post.id, { status: 'draft' });
        setInactivePosts(prev => prev.filter(p => p.id !== post.id));
        setAllPosts(prev => [...prev, { ...post, status: 'draft' as PostStatus }]);
      } else if (type === 'deactivate') {
        await postsService.deactivate(post.id);
        postsStore.deactivateOptimistic(post.id);
      } else if (type === 'delete') {
        await postsService.remove(post.id);
        postsStore.removeOptimistic(post.id);
      } else if (type === 'publish') {
        await postsService.update(post.id, { status: 'published' });
        postsStore.updateOptimistic(post.id, { status: 'published' as PostStatus });
      } else if (type === 'retry') {
        await postsService.update(post.id, { status: 'scheduled' });
        postsStore.updateOptimistic(post.id, { status: 'scheduled' as PostStatus });
      }
    } catch (err) {
      console.error('Post action failed:', err);
      void fetchPosts(); // On error: full refetch to restore correct state
    }
  };

  return {
    filteredPosts,
    inactiveCount: inactivePosts.length,
    isLoading,
    view,           setView,
    search,         setSearch,
    statusFilter,   setStatusFilter,
    platformFilter, setPlatformFilter,
    pendingAction,
    requestAction,
    cancelAction,
    confirmAction,
    pageRef,
    refresh: fetchPosts,
    connectedPlatforms,
  };
}
