import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { MockPostRepository }     from '../infrastructure/repositories/MockPostRepository';
import { MockPlatformRepository } from '../infrastructure/repositories/MockPlatformRepository';
import type { PostSummary, UpcomingPost } from '../domain/entities/Post';
import type { ConnectedPlatform } from '../domain/entities/Platform';

/* ─── KPI card view-model (animation metadata lives here) ─── */
export interface KpiCard {
  label:    string;
  display:  string;
  countEnd: number;
  isFloat:  boolean;
  suffix:   string;
  delta:    string | null;
  positive: boolean | null;
  bar:      number | null;
  barColor: string;
  glow:     string;
  type:     'bar' | 'dots' | 'platforms';
}

const KPI_CARDS: KpiCard[] = [
  {
    label: 'Total Reach',     display: '342,109', countEnd: 342109, isFloat: false, suffix: '',
    delta: '+12.4%', positive: true,  bar: 72, barColor: '#d394ff', glow: 'rgba(211,148,255,0.5)', type: 'bar',
  },
  {
    label: 'Engagement Rate', display: '4.8%',    countEnd: 4.8,    isFloat: true,  suffix: '%',
    delta: '+0.3%',  positive: true,  bar: 48, barColor: '#9400e4', glow: 'rgba(148,0,228,0.5)',   type: 'bar',
  },
  {
    label: 'Scheduled Posts', display: '14',      countEnd: 14,     isFloat: false, suffix: '',
    delta: 'next 7 days', positive: null, bar: null, barColor: '', glow: '', type: 'dots',
  },
  {
    label: 'Active Platforms', display: '3',      countEnd: 3,      isFloat: false, suffix: '',
    delta: null, positive: null, bar: null, barColor: '', glow: '', type: 'platforms',
  },
];

const VISIBLE    = 3;
const PAGE_COUNT = Math.ceil(6 / VISIBLE); // 6 upcoming posts → 2 pages

export function useDashboard() {
  const heroRef      = useRef<HTMLDivElement>(null);
  const kpiRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const countRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const upcomingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const postRefs     = useRef<(HTMLAnchorElement | null)[]>([]);
  const platformRefs = useRef<(HTMLDivElement | null)[]>([]);
  const carouselRef  = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);

  const maxIdx = PAGE_COUNT - 1;

  const scrollCarousel = (dir: 1 | -1) => {
    setCarouselIdx(prev => Math.max(0, Math.min(prev + dir, maxIdx)));
  };

  const postRepo     = new MockPostRepository();
  const platformRepo = new MockPlatformRepository();

  const upcoming:     UpcomingPost[]     = postRepo.getUpcoming();
  const recentPosts:  PostSummary[]      = postRepo.getRecentPosts();
  const platformHealth: ConnectedPlatform[] = platformRepo.getConnectedPlatforms();

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (heroRef.current) {
      tl.fromTo(heroRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
    }

    const kpis = kpiRefs.current.filter(Boolean) as HTMLDivElement[];
    if (kpis.length) {
      tl.fromTo(kpis, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08 }, '-=0.25');
    }

    countRefs.current.forEach((span, i) => {
      if (!span) return;
      const card = KPI_CARDS[i];
      const obj  = { val: 0 };
      gsap.to(obj, {
        val:      card.countEnd,
        duration: 1.4,
        delay:    0.3,
        ease:     'power2.out',
        onUpdate() {
          span.textContent = card.isFloat
            ? obj.val.toFixed(1) + card.suffix
            : Math.round(obj.val).toLocaleString() + card.suffix;
        },
      });
    });

    const upcomingEls = upcomingRefs.current.filter(Boolean) as HTMLDivElement[];
    if (upcomingEls.length) {
      tl.fromTo(upcomingEls, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, stagger: 0.09 }, '-=0.2');
    }

    const posts = postRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (posts.length) {
      tl.fromTo(posts, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 }, '-=0.2');
    }

    const platforms = platformRefs.current.filter(Boolean) as HTMLDivElement[];
    if (platforms.length) {
      tl.fromTo(platforms, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, '-=0.3');
    }

    return () => { tl.kill(); };
  }, []);

  useEffect(() => {
    if (!carouselRef.current || !containerRef.current) return;
    const pageW = containerRef.current.clientWidth;
    gsap.to(carouselRef.current, {
      x:        -carouselIdx * pageW,
      duration: 0.5,
      ease:     'power3.out',
    });
  }, [carouselIdx]);

  return {
    kpiCards:      KPI_CARDS,
    upcoming,
    recentPosts,
    platformHealth,
    carouselIdx,
    setCarouselIdx,
    scrollCarousel,
    pageCount:     PAGE_COUNT,
    visible:       VISIBLE,
    maxIdx,
    heroRef,
    kpiRefs,
    countRefs,
    upcomingRefs,
    postRefs,
    platformRefs,
    carouselRef,
    containerRef,
  };
}
