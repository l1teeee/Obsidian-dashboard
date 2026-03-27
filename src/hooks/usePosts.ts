import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import * as postsService from '../services/posts.service';
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
  if (platform === 'linkedin') return 'linkedin';
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

  const [allPosts,       setAllPosts]       = useState<CalendarPost[]>([]);
  const [inactivePosts,  setInactivePosts]  = useState<CalendarPost[]>([]);
  const [isLoading,      setIsLoading]      = useState(true);
  const [view,           setView]           = useState<PostsView>('active');
  const [search,         setSearch]         = useState('');
  const [statusFilter,   setStatusFilter]   = useState<PostStatus | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<PlatformId | 'all'>('all');
  const [pendingAction,  setPendingAction]  = useState<PendingAction | null>(null);

  const fetchPosts = useCallback(async () => {
    let cancelled = false;
    setIsLoading(true);
    try {
      const [activePage, inactivePage] = await Promise.all([
        postsService.getAll({ limit: 100 }),
        postsService.getAll({ limit: 100, status: 'inactive' }),
      ]);
      if (!cancelled) {
        setAllPosts(activePage.posts.map(mapApiPost));
        setInactivePosts(inactivePage.posts.map(mapApiPost));
      }
    } catch {
      if (!cancelled) { setAllPosts([]); setInactivePosts([]); }
    } finally {
      if (!cancelled) setIsLoading(false);
    }
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-posts-header]',  { y: -16, opacity: 0, duration: 0.45, ease: 'power3.out' });
      gsap.from('[data-posts-filters]', { y: -8,  opacity: 0, duration: 0.4,  ease: 'power3.out', delay: 0.1 });
      gsap.from('[data-posts-table]',   { y: 20,  opacity: 0, duration: 0.5,  ease: 'power3.out', delay: 0.15 });
    }, pageRef.current!);
    return () => ctx.revert();
  }, []);

  const activePosts = allPosts.filter(p => p.status !== 'inactive' && p.status !== 'deleted');
  const displayPosts = view === 'active' ? activePosts : inactivePosts;

  const filteredPosts = displayPosts.filter(p => {
    const matchesSearch   = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus   = statusFilter   === 'all' || p.status   === statusFilter;
    const matchesPlatform = platformFilter === 'all' || p.platform === platformFilter;
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const requestAction = (type: PostAction, post: CalendarPost) => setPendingAction({ type, post });
  const cancelAction  = () => setPendingAction(null);

  const confirmAction = async () => {
    if (!pendingAction) return;
    const { type, post } = pendingAction;
    setPendingAction(null);

    try {
      if (type === 'activate') {
        await postsService.update(post.id, { status: 'draft' });
        setInactivePosts(prev => prev.filter(p => p.id !== post.id));
        setAllPosts(prev => [...prev, { ...post, status: 'draft' as PostStatus }]);
      } else if (type === 'deactivate') {
        await postsService.deactivate(post.id);
        setAllPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: 'inactive' as PostStatus } : p));
        setInactivePosts(prev => [...prev, { ...post, status: 'inactive' as PostStatus }]);
      } else if (type === 'delete') {
        await postsService.remove(post.id);
        setInactivePosts(prev => prev.filter(p => p.id !== post.id));
        setAllPosts(prev => prev.filter(p => p.id !== post.id));
      } else if (type === 'publish') {
        await postsService.update(post.id, { status: 'published' });
        setAllPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: 'published' as PostStatus } : p));
      } else if (type === 'retry') {
        await postsService.update(post.id, { status: 'scheduled' });
        setAllPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: 'scheduled' as PostStatus } : p));
      }
    } catch (err) {
      console.error('Post action failed:', err);
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
  };
}
