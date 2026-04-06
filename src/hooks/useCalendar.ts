import { useState, useEffect, useRef } from 'react';
import {
  format, startOfWeek, endOfWeek,
  isSameDay, addMonths, subMonths, addWeeks, subWeeks,
} from 'date-fns';
import gsap from 'gsap';
import * as postsService from '../services/posts.service';
import type { CalendarPost } from '../domain/entities/CalendarPost';
import type { PlatformId } from '../domain/entities/Platform';
import { PLATFORM_REGISTRY } from '../domain/entities/Platform';

export type View = 'month' | 'week' | 'list';

const ALL_PLATFORM_IDS: PlatformId[] = ['instagram', 'facebook', 'linkedin'];

function toCalendarPost(p: postsService.ApiPost): CalendarPost | null {
  const rawDate = p.scheduled_at ?? p.published_at;
  if (!rawDate) return null;

  const platform: PlatformId = p.platform in PLATFORM_REGISTRY
    ? (p.platform as PlatformId)
    : 'facebook';

  return {
    id:       p.id,
    date:     new Date(rawDate),
    time:     new Date(rawDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    platform,
    title:    (p.caption ?? 'Untitled post').slice(0, 72),
    status:   p.status as CalendarPost['status'],
  };
}

export function useCalendar() {
  const pageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [view, setView]                       = useState<View>('month');
  const [current, setCurrent]                 = useState(new Date());
  const [selected, setSelected]               = useState<Date | null>(null);
  const [activePlatforms, setActivePlatforms] = useState<PlatformId[]>(ALL_PLATFORM_IDS);
  const [posts, setPosts]                     = useState<CalendarPost[]>([]);
  const [loading, setLoading]                 = useState(true);

  // Fetch scheduled + published posts from API
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([
      postsService.getAll({ status: 'scheduled',  limit: 100 }),
      postsService.getAll({ status: 'published',  limit: 100 }),
    ]).then(([scheduled, published]) => {
      if (cancelled) return;
      const all = [...scheduled.posts, ...published.posts]
        .map(toCalendarPost)
        .filter((p): p is CalendarPost => p !== null)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
      setPosts(all);
    }).catch(() => {
      if (!cancelled) setPosts([]);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  const filteredPosts: CalendarPost[] = posts.filter(p => activePlatforms.includes(p.platform));

  const togglePlatform = (id: PlatformId) => {
    setActivePlatforms(prev =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter(n => n !== id) : prev
        : [...prev, id],
    );
    setSelected(null);
  };

  const goBack    = () => { setCurrent(v => view === 'week' ? subWeeks(v, 1) : subMonths(v, 1)); setSelected(null); };
  const goForward = () => { setCurrent(v => view === 'week' ? addWeeks(v, 1) : addMonths(v, 1)); setSelected(null); };
  const goToday   = () => { setCurrent(new Date()); setSelected(null); };

  const handleSelectDay = (d: Date) => {
    setSelected(prev => (prev && isSameDay(prev, d) ? null : d));
  };

  const navLabel = view === 'week'
    ? `${format(startOfWeek(current, { weekStartsOn: 1 }), 'MMM d')} – ${format(endOfWeek(current, { weekStartsOn: 1 }), 'MMM d, yyyy')}`
    : format(current, 'MMMM yyyy');

  useEffect(() => {
    if (!bodyRef.current) return;
    gsap.fromTo(bodyRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
  }, [view, current]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-cal-header]', { y: -16, opacity: 0, duration: 0.45, ease: 'power3.out' });
    }, pageRef.current!);
    return () => ctx.revert();
  }, []);

  return {
    view, setView,
    current, selected,
    activePlatforms,
    filteredPosts,
    loading,
    navLabel,
    goBack, goForward, goToday,
    handleSelectDay, togglePlatform,
    pageRef, bodyRef,
  };
}
