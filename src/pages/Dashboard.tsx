import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sileo } from 'sileo';
import TopBar from '../components/layout/TopBar';
import KpiCard from '../components/dashboard/KpiCard';
import PostCarousel from '../components/dashboard/PostCarousel';
import RecentPostRow from '../components/dashboard/RecentPostRow';
import PlatformHealthCard from '../components/dashboard/PlatformHealthCard';
import { useDashboard } from '../hooks/useDashboard';
import { listConnections } from '../services/platforms.service';
import { getTokenExpiryInfo } from '../hooks/usePlatforms';

const TOKEN_WARNING_KEY = 'token_warning_shown';

export default function Dashboard() {
  // ── Token expiry check on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (sessionStorage.getItem(TOKEN_WARNING_KEY)) return;

    listConnections().then(connections => {
      const expiryInfos = connections
        .map(c => ({ name: c.account_name, ...getTokenExpiryInfo(c.token_expires_at) }))
        .filter(e => e.isExpired || e.isWarning);

      if (expiryInfos.length === 0) return;

      // Pick the most critical one to show
      const worst = expiryInfos.sort((a, b) => {
        if (a.isExpired && !b.isExpired) return -1;
        if (!a.isExpired && b.isExpired) return 1;
        return (a.daysLeft ?? 999) - (b.daysLeft ?? 999);
      })[0];

      const isCrit = worst.isCritical || worst.isExpired;
      const message = worst.isExpired
        ? 'Your Facebook token has expired. Go to Platforms to reconnect.'
        : `Your Facebook connection expires in ${worst.daysLeft} day${worst.daysLeft === 1 ? '' : 's'}. Go to Platforms to reconnect.`;

      if (isCrit) {
        sileo.error({ title: 'Reconnect required', description: message, duration: 0 });
      } else {
        sileo.warning({ title: 'Token expiring soon', description: message, duration: 8000 });
      }

      sessionStorage.setItem(TOKEN_WARNING_KEY, '1');
    }).catch(() => { /* silent — dashboard shouldn't break if this fails */ });
  }, []);

  const {
    kpiCards, upcoming, recentPosts, platformHealth, loaded,
    carouselIdx, setCarouselIdx, scrollCarousel, pageCount, visible, maxIdx,
    heroRef, kpiRefs, countRefs, upcomingRefs, postRefs, platformRefs, carouselRef, containerRef,
  } = useDashboard();

  return (
    <div>
      <TopBar
        title="Workspace"
        actions={
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#988d9c]" style={{ fontSize: 16 }}>search</span>
            <input
              className="bg-[#1c1b1b] border border-[#4c4450]/15 rounded-full py-1.5 pl-10 pr-4 text-xs w-56 focus:outline-none focus:border-[#d394ff]/50 transition-all text-[#e5e2e1] placeholder:text-[#988d9c]/50"
              placeholder="Search curated content..."
            />
          </div>
        }
      />

      {!loaded ? (
        /* ── Full dashboard skeleton ─────────────────────────────────────── */
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto animate-pulse">

          {/* Hero skeleton */}
          <div className="space-y-3">
            <div className="h-10 w-72 bg-[#201f1f] rounded-2xl" />
            <div className="h-4 w-96 bg-[#201f1f] rounded-xl" />
          </div>

          {/* KPI skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card rounded-3xl p-6 border border-[#4c4450]/10 space-y-4">
                <div className="h-3 w-24 bg-[#2a2a2a] rounded-full" />
                <div className="h-8 w-16 bg-[#2a2a2a] rounded-xl" />
                <div className="h-1 w-full bg-[#2a2a2a] rounded-full" />
              </div>
            ))}
          </div>

          {/* Upcoming skeleton */}
          <div className="space-y-4">
            <div className="h-5 w-48 bg-[#201f1f] rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card rounded-3xl p-5 border border-[#4c4450]/10 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-5 w-28 bg-[#2a2a2a] rounded-full" />
                    <div className="h-5 w-6 bg-[#2a2a2a] rounded-lg" />
                  </div>
                  <div className="h-3 w-full bg-[#2a2a2a] rounded-full" />
                  <div className="h-3 w-4/5 bg-[#2a2a2a] rounded-full" />
                  <div className="h-0.5 w-8 bg-[#2a2a2a] rounded-full mt-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Main grid skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              <div className="h-6 w-48 bg-[#201f1f] rounded-xl mb-4" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card rounded-[2rem] p-4 border border-[#4c4450]/5 flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-2xl bg-[#2a2a2a] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-16 bg-[#2a2a2a] rounded-full" />
                    <div className="h-4 w-48 bg-[#2a2a2a] rounded-full" />
                    <div className="h-3 w-24 bg-[#2a2a2a] rounded-full" />
                  </div>
                  <div className="flex gap-5 px-5 border-l border-[#4c4450]/10">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="space-y-1 text-center">
                        <div className="h-4 w-6 bg-[#2a2a2a] rounded mx-auto" />
                        <div className="h-2 w-8 bg-[#2a2a2a] rounded-full mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="h-6 w-40 bg-[#201f1f] rounded-xl mb-4" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="glass-card rounded-3xl p-5 border border-[#4c4450]/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#2a2a2a]" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3 w-20 bg-[#2a2a2a] rounded-full" />
                      <div className="h-2 w-32 bg-[#2a2a2a] rounded-full" />
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="h-5 w-16 bg-[#2a2a2a] rounded-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── Real content ────────────────────────────────────────────────── */
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto">

          {/* Hero */}
          <section ref={heroRef}>
            <h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tighter text-white mb-2">
              Curator's Overview
            </h2>
            <p className="text-[#988d9c] text-sm md:text-lg font-light">
              Welcome back. Here's your content at a glance.
            </p>
          </section>

          {/* KPI Row */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((kpi, i) => (
              <KpiCard
                key={kpi.label}
                kpi={kpi}
                cardRef={{ current: kpiRefs.current[i] ?? null } as React.RefObject<HTMLDivElement | null>}
                countRef={{ current: countRefs.current[i] ?? null } as React.RefObject<HTMLSpanElement | null>}
              />
            ))}
          </section>

          {/* Upcoming Curation */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-headline text-xl md:text-2xl font-bold text-white tracking-tight">Upcoming Curation</h3>
                <p className="text-[#988d9c] text-xs mt-0.5">{upcoming.length} posts scheduled</p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/calendar" className="text-[#d394ff] text-sm font-medium hover:underline hidden sm:block">View Calendar</Link>
              </div>
            </div>

            {upcoming.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <span className="material-symbols-outlined text-[#4c4450] text-4xl">event_note</span>
                <p className="text-[#988d9c] text-sm">No scheduled posts.</p>
                <Link to="/composer" className="text-xs text-[#d394ff] hover:underline mt-1">Schedule a post</Link>
              </div>
            ) : (
              <PostCarousel
                upcoming={upcoming}
                carouselIdx={carouselIdx}
                setCarouselIdx={setCarouselIdx}
                scrollCarousel={scrollCarousel}
                pageCount={pageCount}
                visible={visible}
                maxIdx={maxIdx}
                carouselRef={carouselRef}
                containerRef={containerRef}
                upcomingRefs={upcomingRefs}
              />
            )}
          </section>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Recent Engagement */}
            <section className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-headline text-2xl font-bold text-white tracking-tight">Recent Engagement</h3>
                <div className="flex gap-2">
                  <Link to="/composer" className="bg-[#d394ff] text-[#5e2388] px-4 py-1.5 rounded-full text-xs font-bold">
                    New Post
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                {recentPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <span className="material-symbols-outlined text-[#4c4450] text-4xl">article</span>
                    <p className="text-[#988d9c] text-sm">No published posts yet.</p>
                    <Link to="/composer" className="text-xs text-[#d394ff] hover:underline mt-1">Create your first post</Link>
                  </div>
                ) : recentPosts.map((post, i) => (
                  <RecentPostRow
                    key={post.id}
                    post={post}
                    rowRef={{ current: postRefs.current[i] ?? null } as React.RefObject<HTMLAnchorElement | null>}
                  />
                ))}
              </div>
            </section>

            {/* Platform Health */}
            <section className="space-y-4">
              <h3 className="font-headline text-2xl font-bold text-white tracking-tight mb-2">Platform Health</h3>
              <div className="space-y-3">
                {platformHealth.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <span className="material-symbols-outlined text-[#4c4450] text-4xl">hub</span>
                    <p className="text-[#988d9c] text-sm">No platforms connected.</p>
                    <Link to="/platforms" className="text-xs text-[#d394ff] hover:underline mt-1">Connect a platform</Link>
                  </div>
                ) : platformHealth.map((p, i) => (
                  <PlatformHealthCard
                    key={p.id}
                    platform={p}
                    cardRef={{ current: platformRefs.current[i] ?? null } as React.RefObject<HTMLDivElement | null>}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link
          to="/composer"
          className="w-14 h-14 bg-[#d394ff] text-[#5e2388] rounded-full shadow-[0_0_20px_rgba(211,148,255,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        </Link>
      </div>
    </div>
  );
}
