import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import * as postsService from '../services/posts.service';
import * as metricsService from '../services/metrics.service';
import type { FacebookSummary, FbPostMetric } from '../types/metrics.types';
import { PLATFORM_REGISTRY } from '../domain/entities/Platform';
import type { PlatformId } from '../domain/entities/Platform';
import type { PostSummary, UpcomingPost } from '../domain/entities/Post';

export interface KpiCard {
  label:      string;
  display:    string;
  countEnd:   number;
  isFloat:    boolean;
  suffix:     string;
  delta:      string | null;
  positive:   boolean | null;
  bar:        number | null;
  barColor:   string;
  glow:       string;
  type:       'bar' | 'dots' | 'platforms';
  platforms?: Array<{ abbr: string; color: string }>;
}

const VISIBLE = 3;

// ─── Mappers ──────────────────────────────────────────────────────────────────

function formatPostDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

function toPlatformId(raw: string): PlatformId {
  return (raw in PLATFORM_REGISTRY ? raw : 'facebook') as PlatformId;
}


function mapFbPostToSummary(post: FbPostMetric): PostSummary {
  const [pageId, fbId] = post.id.split('_');
  return {
    id:           post.id,
    title:        (post.message ?? 'Facebook post').slice(0, 72),
    platform:     'facebook',
    status:       'published',
    date:         new Date(post.created_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    imageUrl:     post.thumbnail ?? '',
    likes:        String(post.reactions),
    comments:     '—',
    shares:       String(post.engaged_users),
    externalHref: fbId ? `https://www.facebook.com/${pageId}/posts/${fbId}` : undefined,
  };
}

function mapToUpcomingPost(post: postsService.ApiPost): UpcomingPost {
  return {
    id:       post.id,
    date:     formatPostDate(post.scheduled_at),
    platform: toPlatformId(post.platform),
    caption:  post.caption ?? '',
    imageUrl: post.media_urls?.[0] ?? '',
  };
}


function buildKpiCards(
  scheduledCount: number,
  summary: FacebookSummary | null,
): KpiCard[] {
  const reach          = summary?.reach_30d          ?? null;
  const engagedUsers   = summary?.engaged_users_30d  ?? null;
  const engagementRate = (reach && reach > 0 && engagedUsers !== null)
    ? Math.round((engagedUsers / reach) * 100)
    : null;

  return [
    {
      label: 'Total Reach',
      display:  reach !== null ? reach.toLocaleString() : '—',
      countEnd: reach ?? 0, isFloat: false, suffix: '',
      delta:    summary ? `${summary.impressions_30d.toLocaleString()} impressions` : null,
      positive: null,
      bar:      reach !== null ? Math.min(100, reach / 10) : null,
      barColor: '#d394ff', glow: 'rgba(211,148,255,0.5)', type: 'bar',
    },
    {
      label: 'Engagement Rate',
      display:  engagementRate !== null ? `${engagementRate}%` : '—',
      countEnd: engagementRate ?? 0, isFloat: false, suffix: '%',
      delta:    engagedUsers !== null ? `${engagedUsers} interactions` : null,
      positive: engagementRate !== null && engagementRate > 0,
      bar:      engagementRate !== null ? Math.min(100, engagementRate * 2) : null,
      barColor: '#9400e4', glow: 'rgba(148,0,228,0.5)', type: 'bar',
    },
    {
      label: 'Scheduled Posts', display: String(scheduledCount), countEnd: scheduledCount, isFloat: false, suffix: '',
      delta: 'upcoming', positive: null, bar: null, barColor: '', glow: '', type: 'dots',
    },
    {
      label: 'FB Fans',
      display:  summary ? summary.fan_count.toLocaleString() : '—',
      countEnd: summary?.fan_count ?? 0, isFloat: false, suffix: '',
      delta: null, positive: null, bar: null, barColor: '', glow: '', type: 'dots',
    },
  ];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboard() {
  const heroRef      = useRef<HTMLDivElement>(null);
  const kpiRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const countRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const upcomingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const postRefs     = useRef<(HTMLAnchorElement | null)[]>([]);
  const carouselRef  = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [carouselIdx, setCarouselIdx] = useState(0);
  const [loaded,      setLoaded]      = useState(false);
  const [refreshing,  setRefreshing]  = useState(false);

  const [kpiCards,    setKpiCards]    = useState<KpiCard[]>(buildKpiCards(0, null));
  const [upcoming,    setUpcoming]    = useState<UpcomingPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<PostSummary[]>([]);

  // ── Fetch real data ─────────────────────────────────────────────────────────
  const fetchData = (onDone?: () => void) => {
    let cancelled = false;

    Promise.all([
      postsService.getAll({ status: 'scheduled', limit: 10 }),
      metricsService.getFacebookSummary().catch(() => null),
      metricsService.getFacebookPosts().catch(() => []),
    ]).then(([scheduledPage, summary, fbPosts]) => {
      if (cancelled) return;
      setRecentPosts(fbPosts.slice(0, 5).map(mapFbPostToSummary));
      setUpcoming(scheduledPage.posts.map(mapToUpcomingPost));
      setKpiCards(buildKpiCards(scheduledPage.meta.total, summary));
      setLoaded(true);
    }).catch(() => {
      if (!cancelled) setLoaded(true);
    }).finally(() => {
      if (!cancelled) onDone?.();
    });

    return () => { cancelled = true; };
  };

  useEffect(() => fetchData(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    fetchData(() => setRefreshing(false));
  };

  const pageCount = Math.max(1, Math.ceil(upcoming.length / VISIBLE));
  const maxIdx    = pageCount - 1;

  const scrollCarousel = (dir: 1 | -1) => {
    setCarouselIdx(prev => Math.max(0, Math.min(prev + dir, maxIdx)));
  };

  // ── GSAP entrance — fires once after data is loaded ────────────────────────
  useEffect(() => {
    if (!loaded) return;

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
      const card = kpiCards[i];
      if (!card || card.countEnd === 0) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val:      card.countEnd,
        duration: 1.2,
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

    return () => { tl.kill(); };
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Carousel scroll ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!carouselRef.current || !containerRef.current) return;
    const pageW = containerRef.current.clientWidth;
    gsap.to(carouselRef.current, { x: -carouselIdx * pageW, duration: 0.5, ease: 'power3.out' });
  }, [carouselIdx]);

  return {
    kpiCards,
    upcoming,
    recentPosts,
    loaded,
    refreshing,
    refresh,
    carouselIdx,
    setCarouselIdx,
    scrollCarousel,
    pageCount,
    visible: VISIBLE,
    maxIdx,
    heroRef,
    kpiRefs,
    countRefs,
    upcomingRefs,
    postRefs,
    carouselRef,
    containerRef,
  };
}
