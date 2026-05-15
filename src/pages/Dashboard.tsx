import React from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import KpiCard from '../components/dashboard/KpiCard';
import PostCarousel from '../components/dashboard/PostCarousel';
import RecentPostRow from '../components/dashboard/RecentPostRow';
import { useDashboard } from '../hooks/useDashboard';

export default function Dashboard() {
  const {
    kpiCards, upcoming, recentPosts, loaded, refreshing, refresh,
    carouselIdx, setCarouselIdx, scrollCarousel, pageCount, visible, maxIdx,
    heroRef, kpiRefs, countRefs, upcomingRefs, postRefs, carouselRef, containerRef,
  } = useDashboard();

  return (
    <div>
      <TopBar
        title="Workspace"
        actions={
          <Link
            to="/composer"
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#15140F] px-4 text-sm font-bold text-[#F6F2EA] transition-all hover:bg-[#3D3A30] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8553A]/70"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17, fontVariationSettings: "'FILL' 1" }}>add</span>
            New Post
          </Link>
        }
      />

      {!loaded ? (
        /* ── Full dashboard skeleton ─────────────────────────────────────── */
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto animate-pulse">

          {/* Hero skeleton */}
          <div className="space-y-3">
            <div className="h-10 w-72 bg-[#EFE9DC] rounded-2xl" />
            <div className="h-4 w-96 bg-[#EFE9DC] rounded-xl" />
          </div>

          {/* KPI skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="surface-card p-6 space-y-4">
                <div className="h-3 w-24 bg-[#E7E0D0] rounded-full" />
                <div className="h-8 w-16 bg-[#E7E0D0] rounded-xl" />
                <div className="h-1 w-full bg-[#E7E0D0] rounded-full" />
              </div>
            ))}
          </div>

          {/* Upcoming skeleton */}
          <div className="space-y-4">
            <div className="h-5 w-48 bg-[#EFE9DC] rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="surface-card p-5 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-5 w-28 bg-[#E7E0D0] rounded-full" />
                    <div className="h-5 w-6 bg-[#E7E0D0] rounded-lg" />
                  </div>
                  <div className="h-3 w-full bg-[#E7E0D0] rounded-full" />
                  <div className="h-3 w-4/5 bg-[#E7E0D0] rounded-full" />
                  <div className="h-0.5 w-8 bg-[#E7E0D0] rounded-full mt-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Engagement skeleton */}
          <div className="space-y-3">
            <div className="h-6 w-48 bg-[#EFE9DC] rounded-xl mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="surface-card p-4 flex gap-4 items-center">
                <div className="w-20 h-20 rounded-2xl bg-[#E7E0D0] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 bg-[#E7E0D0] rounded-full" />
                  <div className="h-4 w-48 bg-[#E7E0D0] rounded-full" />
                  <div className="h-3 w-24 bg-[#E7E0D0] rounded-full" />
                </div>
                <div className="flex gap-5 px-5 border-l border-[#15140F]/10">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="space-y-1 text-center">
                      <div className="h-4 w-6 bg-[#E7E0D0] rounded mx-auto" />
                      <div className="h-2 w-8 bg-[#E7E0D0] rounded-full mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Real content ────────────────────────────────────────────────── */
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1500px] mx-auto">

          {/* Hero */}
          <section ref={heroRef} className="flex flex-col gap-4 rounded-2xl border border-[#15140F]/18 bg-[#EFE9DC] p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#C8553A]">Workspace overview</p>
              <h2 className="font-headline text-3xl font-extrabold tracking-normal text-[#15140F] md:text-4xl">
                Plan, publish, and measure today.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#3D3A30] md:text-base">
                Review scheduled posts, recent engagement, and the actions that need attention.
              </p>
            </div>
            <Link
              to="/calendar"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#15140F]/30 px-4 text-sm font-semibold text-[#3D3A30] transition-all hover:border-[#C8553A]/35 hover:text-[#15140F] md:shrink-0"
            >
              View calendar
            </Link>
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5">
              <div>
                <h3 className="font-headline text-xl md:text-2xl font-bold text-[#15140F] tracking-normal">Upcoming Curation</h3>
                <p className="text-[#6B655B] text-sm mt-1">{upcoming.length} posts scheduled</p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/calendar" className="text-[#C8553A] text-sm font-semibold hover:text-[#15140F]">View Calendar</Link>
              </div>
            </div>

            {upcoming.length === 0 ? (
              <div className="surface-card w-full flex flex-col items-center justify-center py-14 gap-2">
                <span className="material-symbols-outlined text-[#15140F] text-4xl">event_note</span>
                <p className="text-[#6B655B] text-sm">No scheduled posts.</p>
                <Link to="/composer" className="text-sm font-semibold text-[#C8553A] hover:text-[#15140F] mt-1">Schedule a post</Link>
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

          {/* Recent Engagement */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-headline text-2xl font-bold text-[#15140F] tracking-normal">Recent Engagement</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={refresh}
                  disabled={refreshing}
                  title="Refresh metrics"
                  className="flex h-9 items-center gap-1.5 rounded-xl border border-[#15140F]/25 px-3 text-sm font-semibold text-[#6B655B] transition-all hover:border-[#C8553A]/35 hover:text-[#15140F] disabled:opacity-50"
                >
                  <span
                    className={`material-symbols-outlined ${refreshing ? 'animate-spin' : ''}`}
                    style={{ fontSize: 14 }}
                  >refresh</span>
                  {refreshing ? 'Updating…' : 'Refresh'}
                </button>
                <Link to="/composer" className="hidden bg-[#15140F] text-[#F6F2EA] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#3D3A30] sm:inline-flex">
                  New Post
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              {recentPosts.length === 0 ? (
                <div className="surface-card w-full flex flex-col items-center justify-center py-14 gap-2">
                  <span className="material-symbols-outlined text-[#15140F] text-4xl">article</span>
                  <p className="text-[#6B655B] text-sm">No published posts yet.</p>
                  <Link to="/composer" className="text-sm font-semibold text-[#C8553A] hover:text-[#15140F] mt-1">Create your first post</Link>
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
        </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-5 right-5 z-50 mb-[env(safe-area-inset-bottom,0px)] sm:hidden">
        <Link
          to="/composer"
          aria-label="Create new post"
          className="w-14 h-14 bg-[#15140F] text-[#F6F2EA] rounded-2xl shadow-[0_14px_32px_rgba(0,0,0,0.34)] flex items-center justify-center active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        </Link>
      </div>
    </div>
  );
}
