import { useEffect } from 'react';
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
    kpiCards, upcoming, recentPosts, platformHealth,
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

      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto">

        {/* Hero */}
        <section ref={heroRef}>
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tighter text-white mb-2">
            Curator's Overview
          </h2>
          <p className="text-[#988d9c] text-sm md:text-lg font-light">
            Welcome back, Alex. Your digital footprint expanded by 12% this week.
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
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Engagement */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-headline text-2xl font-bold text-white tracking-tight">Recent Engagement</h3>
              <div className="flex gap-2">
                <button className="bg-[#2a2a2a] text-[#e5e2e1] px-4 py-1.5 rounded-full text-xs font-medium border border-[#4c4450]/10">
                  Filter
                </button>
                <Link to="/composer" className="bg-[#d394ff] text-[#5e2388] px-4 py-1.5 rounded-full text-xs font-bold">
                  New Post
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              {recentPosts.map((post, i) => (
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
              {platformHealth.map((p, i) => (
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
