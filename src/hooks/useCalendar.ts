import { useState, useEffect, useRef } from 'react';
import {
  format, startOfWeek, endOfWeek,
  isSameDay, addMonths, subMonths, addWeeks, subWeeks,
} from 'date-fns';
import gsap from 'gsap';
import { MockAnalyticsRepository } from '../infrastructure/repositories/MockAnalyticsRepository';
import type { CalendarPost } from '../domain/entities/CalendarPost';
import type { PlatformId } from '../domain/entities/Platform';

export type View = 'month' | 'week' | 'list';

const ALL_PLATFORM_IDS: PlatformId[] = ['instagram', 'facebook', 'linkedin'];

export function useCalendar() {
  const pageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [view, setView]                     = useState<View>('month');
  const [current, setCurrent]               = useState(new Date());
  const [selected, setSelected]             = useState<Date | null>(null);
  const [activePlatforms, setActivePlatforms] = useState<PlatformId[]>(ALL_PLATFORM_IDS);

  const repo  = new MockAnalyticsRepository();
  const posts = repo.getCalendarPosts();

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
    view,
    setView,
    current,
    selected,
    activePlatforms,
    filteredPosts,
    navLabel,
    goBack,
    goForward,
    goToday,
    handleSelectDay,
    togglePlatform,
    pageRef,
    bodyRef,
  };
}
