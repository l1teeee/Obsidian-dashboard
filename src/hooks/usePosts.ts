import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { MockAnalyticsRepository } from '../infrastructure/repositories/MockAnalyticsRepository';
import type { CalendarPost } from '../domain/entities/CalendarPost';
import type { PostStatus } from '../domain/entities/Post';
import type { PlatformId } from '../domain/entities/Platform';

export type PostAction = 'delete' | 'publish' | 'retry';

export interface PendingAction {
  type: PostAction;
  post: CalendarPost;
}

const repo = new MockAnalyticsRepository();

export function usePosts() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts]                   = useState<CalendarPost[]>(() => repo.getCalendarPosts());
  const [search, setSearch]                 = useState('');
  const [statusFilter, setStatusFilter]     = useState<PostStatus | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<PlatformId | 'all'>('all');
  const [pendingAction, setPendingAction]   = useState<PendingAction | null>(null);

  const filteredPosts = posts.filter(p => {
    const matchesSearch   = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus   = statusFilter   === 'all' || p.status   === statusFilter;
    const matchesPlatform = platformFilter === 'all' || p.platform === platformFilter;
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const requestAction = (type: PostAction, post: CalendarPost) => setPendingAction({ type, post });
  const cancelAction  = () => setPendingAction(null);

  const confirmAction = () => {
    if (!pendingAction) return;
    const { type, post } = pendingAction;
    setPosts(prev => {
      if (type === 'delete')  return prev.filter(p => p.id !== post.id);
      if (type === 'publish') return prev.map(p => p.id === post.id ? { ...p, status: 'published' } : p);
      if (type === 'retry')   return prev.map(p => p.id === post.id ? { ...p, status: 'scheduled' } : p);
      return prev;
    });
    setPendingAction(null);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-posts-header]',  { y: -16, opacity: 0, duration: 0.45, ease: 'power3.out' });
      gsap.from('[data-posts-filters]', { y: -8,  opacity: 0, duration: 0.4,  ease: 'power3.out', delay: 0.1 });
      gsap.from('[data-posts-table]',   { y: 20,  opacity: 0, duration: 0.5,  ease: 'power3.out', delay: 0.15 });
    }, pageRef.current!);
    return () => ctx.revert();
  }, []);

  return {
    filteredPosts,
    search,       setSearch,
    statusFilter, setStatusFilter,
    platformFilter, setPlatformFilter,
    pendingAction,
    requestAction,
    cancelAction,
    confirmAction,
    pageRef,
  };
}
