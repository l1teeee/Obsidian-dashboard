import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import TopBar from '../components/layout/TopBar';

/* ─── Data ─────────────────────────────────────────────── */
const KPI_CARDS = [
  {
    label: 'Total Reach',
    display: '342,109',
    countEnd: 342109,
    isFloat: false,
    suffix: '',
    delta: '+12.4%',
    positive: true,
    bar: 72,
    barColor: '#d394ff',
    glow: 'rgba(211,148,255,0.5)',
    type: 'bar',
  },
  {
    label: 'Engagement Rate',
    display: '4.8%',
    countEnd: 4.8,
    isFloat: true,
    suffix: '%',
    delta: '+0.3%',
    positive: true,
    bar: 48,
    barColor: '#9400e4',
    glow: 'rgba(148,0,228,0.5)',
    type: 'bar',
  },
  {
    label: 'Scheduled Posts',
    display: '14',
    countEnd: 14,
    isFloat: false,
    suffix: '',
    delta: 'next 7 days',
    positive: null,
    bar: null,
    barColor: '',
    glow: '',
    type: 'dots',
  },
  {
    label: 'Active Platforms',
    display: '3',
    countEnd: 3,
    isFloat: false,
    suffix: '',
    delta: null,
    positive: null,
    bar: null,
    barColor: '',
    glow: '',
    type: 'platforms',
  },
];

const UPCOMING = [
  { date: 'Oct 24 · 09:00 AM', platform: 'IG', platformColor: '#E1306C', caption: '"The intersection of brutalist architecture and digital minimalism. Explorations in form..."', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80' },
  { date: 'Oct 25 · 02:30 PM', platform: 'LI', platformColor: '#0077B5', caption: '"Insights on the future of AI-driven creative workflows. How we adapt to the new lens..."', img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80' },
  { date: 'Oct 26 · 11:15 AM', platform: 'FB', platformColor: '#1877F2', caption: '"Community spotlight: Highlighting the best lens work from our global collective..."', img: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&q=80' },
  { date: 'Oct 27 · 08:00 AM', platform: 'IG', platformColor: '#E1306C', caption: '"Behind the lens: A morning in the life of a digital curator. Quiet light, big ideas."', img: 'https://images.unsplash.com/photo-1495231916356-a86217efff12?w=400&q=80' },
  { date: 'Oct 28 · 03:00 PM', platform: 'LI', platformColor: '#0077B5', caption: '"The case for editorial thinking in brand strategy. Why curation is the new creation."', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80' },
  { date: 'Oct 29 · 12:00 PM', platform: 'FB', platformColor: '#1877F2', caption: '"Obsidian Lens community picks: The top 10 creative accounts redefining visual culture."', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80' },
];

const RECENT_POSTS = [
  { platform: 'IG', platformColor: '#E1306C', status: 'Published', statusColor: 'bg-[#c5d247]/20 text-[#c5d247]', title: 'Modernism in Tokyo: A Photo Essay', date: 'Oct 22, 10:00 AM', likes: '12.4k', comments: '432', shares: '1.1k', img: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=200&q=80' },
  { platform: 'LI', platformColor: '#0077B5', status: 'Scheduled', statusColor: 'bg-[#d394ff]/20 text-[#d394ff]', title: 'Mastering the Art of Content Selection', date: 'Oct 23, 09:00 AM', likes: '—', comments: '—', shares: '—', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&q=80' },
  { platform: 'IG', platformColor: '#E1306C', status: 'Failed', statusColor: 'bg-[#ffb4ab]/20 text-[#ffb4ab]', title: 'Tech Nostalgia: Why We Crave the Analog', date: 'Failed: Oct 21, 06:12 PM', likes: '0', comments: '0', shares: '0', img: 'https://images.unsplash.com/photo-1593640408182-31c228b4de41?w=200&q=80' },
];

const PLATFORM_HEALTH = [
  { name: 'Instagram', abbr: 'IG', color: '#E1306C', status: 'Connected',   ok: true  },
  { name: 'LinkedIn',  abbr: 'LI', color: '#0077B5', status: 'Connected',   ok: true  },
  { name: 'Facebook',  abbr: 'FB', color: '#1877F2', status: 'Auth Expired', ok: false },
];

/* ─── Component ─────────────────────────────────────────── */
export default function Dashboard() {
  const heroRef        = useRef<HTMLDivElement>(null);
  const kpiRefs        = useRef<(HTMLDivElement | null)[]>([]);
  const countRefs      = useRef<(HTMLSpanElement | null)[]>([]);
  const upcomingRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const postRefs       = useRef<(HTMLAnchorElement | null)[]>([]);
  const platformRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const carouselRef    = useRef<HTMLDivElement>(null);
  const containerRef   = useRef<HTMLDivElement>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);

  const VISIBLE    = 3;
  const PAGE_COUNT = Math.ceil(UPCOMING.length / VISIBLE); // 2 pages
  const maxIdx     = PAGE_COUNT - 1;

  const scrollCarousel = (dir: 1 | -1) => {
    setCarouselIdx(prev => Math.max(0, Math.min(prev + dir, maxIdx)));
  };

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Hero
    if (heroRef.current) {
      tl.fromTo(heroRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
    }

    // KPI cards
    const kpis = kpiRefs.current.filter(Boolean) as HTMLDivElement[];
    if (kpis.length) {
      tl.fromTo(kpis, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08 }, '-=0.25');
    }

    // Count-up
    countRefs.current.forEach((span, i) => {
      if (!span) return;
      const card = KPI_CARDS[i];
      const obj  = { val: 0 };
      gsap.to(obj, {
        val: card.countEnd,
        duration: 1.4,
        delay: 0.3,
        ease: 'power2.out',
        onUpdate() {
          span.textContent = card.isFloat
            ? obj.val.toFixed(1) + card.suffix
            : Math.round(obj.val).toLocaleString() + card.suffix;
        },
      });
    });

    // Upcoming cards
    const upcoming = upcomingRefs.current.filter(Boolean) as HTMLDivElement[];
    if (upcoming.length) {
      tl.fromTo(upcoming, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, stagger: 0.09 }, '-=0.2');
    }

    // Post items
    const posts = postRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (posts.length) {
      tl.fromTo(posts, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 }, '-=0.2');
    }

    // Platform cards
    const platforms = platformRefs.current.filter(Boolean) as HTMLDivElement[];
    if (platforms.length) {
      tl.fromTo(platforms, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, '-=0.3');
    }

    return () => { tl.kill(); };
  }, []);

  // Animate carousel slide — move by full page width each step
  useEffect(() => {
    if (!carouselRef.current || !containerRef.current) return;
    const pageW = containerRef.current.clientWidth;
    gsap.to(carouselRef.current, {
      x: -carouselIdx * pageW,
      duration: 0.5,
      ease: 'power3.out',
    });
  }, [carouselIdx]);

  return (
    <div>
      <TopBar
        title="Workspace Alpha"
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

        {/* ── Hero ── */}
        <section ref={heroRef}>
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tighter text-white mb-2">
            Curator's Overview
          </h2>
          <p className="text-[#988d9c] text-sm md:text-lg font-light">
            Welcome back, Alex. Your digital footprint expanded by 12% this week.
          </p>
        </section>

        {/* ── KPI Row ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_CARDS.map((kpi, i) => (
            <div
              key={kpi.label}
              ref={el => { kpiRefs.current[i] = el; }}
              className="glass-card rounded-3xl p-6 border border-[#4c4450]/10 hover:shadow-[0_0_40px_rgba(211,148,255,0.08)] transition-all"
            >
              <p className="text-[#988d9c] text-xs uppercase tracking-widest font-semibold mb-4">{kpi.label}</p>

              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  ref={el => { countRefs.current[i] = el; }}
                  className="font-mono text-3xl font-medium text-white"
                >
                  {kpi.display}
                </span>

                {kpi.delta && kpi.positive !== null && (
                  <span className={`font-mono text-xs font-medium flex items-center gap-0.5 ${kpi.positive ? 'text-[#c5d247]' : 'text-[#988d9c]'}`}>
                    {kpi.positive && (
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>arrow_upward</span>
                    )}
                    {kpi.delta}
                  </span>
                )}
                {kpi.delta && kpi.positive === null && (
                  <span className="text-xs text-[#988d9c]">{kpi.delta}</span>
                )}
              </div>

              {/* Active Platforms badges */}
              {kpi.type === 'platforms' && (
                <div className="flex items-center gap-1.5 mt-3">
                  {[['IG','#E1306C'],['LI','#0077B5'],['FB','#1877F2']].map(([p, c]) => (
                    <div key={p} className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[9px]"
                      style={{ background: c + '33', color: c }}>
                      {p}
                    </div>
                  ))}
                </div>
              )}

              {/* Progress bar */}
              {kpi.type === 'bar' && (
                <div className="mt-4 h-1 w-full bg-[#353534] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${kpi.bar}%`, background: kpi.barColor, boxShadow: `0 0 10px ${kpi.glow}` }} />
                </div>
              )}

              {/* Dot bars (Scheduled Posts) */}
              {kpi.type === 'dots' && (
                <div className="mt-4 flex gap-1">
                  {[100, 80, 60, 40, 0].map((o, j) => (
                    <div key={j} className="h-1 flex-1 rounded-full"
                      style={{ background: o > 0 ? `rgba(211,148,255,${o / 100})` : '#353534' }} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* ── Upcoming Curation ── */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline text-xl md:text-2xl font-bold text-white tracking-tight">Upcoming Curation</h3>
              <p className="text-[#988d9c] text-xs mt-0.5">{UPCOMING.length} posts scheduled</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/calendar" className="text-[#d394ff] text-sm font-medium hover:underline hidden sm:block">View Calendar</Link>
              {/* Carousel controls — desktop only */}
              <div className="hidden lg:flex gap-2">
                <button
                  onClick={() => scrollCarousel(-1)}
                  disabled={carouselIdx === 0}
                  className="w-8 h-8 rounded-full border border-[#4c4450]/30 flex items-center justify-center text-[#988d9c] hover:text-white hover:border-[#d394ff]/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
                </button>
                <button
                  onClick={() => scrollCarousel(1)}
                  disabled={carouselIdx >= maxIdx}
                  className="w-8 h-8 rounded-full border border-[#4c4450]/30 flex items-center justify-center text-[#988d9c] hover:text-white hover:border-[#d394ff]/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile: scrollable row of cards */}
          <div className="lg:hidden flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {UPCOMING.map((item, i) => (
              <div
                key={i}
                className="glass-card rounded-3xl p-5 border border-[#4c4450]/10 cursor-pointer snap-start shrink-0 w-[75vw] sm:w-[45vw]"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-[#d394ff]/10 text-[#d394ff] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {item.date}
                  </span>
                  <div className="w-6 h-6 rounded font-bold text-[8px] text-white flex items-center justify-center shrink-0"
                    style={{ background: item.platformColor }}>
                    {item.platform}
                  </div>
                </div>
                <p className="text-[#cfc2d2] text-sm line-clamp-2 mb-4 italic leading-relaxed">{item.caption}</p>
                <div className="w-full h-24 rounded-2xl overflow-hidden bg-[#1c1b1b]">
                  <img src={item.img} className="w-full h-full object-cover" alt="" loading="lazy" />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: paginated carousel — 3 cards per page */}
          <div ref={containerRef} className="hidden lg:block overflow-hidden">
            <div
              ref={carouselRef}
              className="flex"
              style={{ width: `calc(${PAGE_COUNT} * 100%)` }}
            >
              {Array.from({ length: PAGE_COUNT }, (_, pageI) => (
                <div
                  key={pageI}
                  className="grid grid-cols-3 gap-4"
                  style={{ flex: `0 0 ${100 / PAGE_COUNT}%` }}
                >
                  {UPCOMING.slice(pageI * VISIBLE, (pageI + 1) * VISIBLE).map((item, i) => (
                    <div
                      key={i}
                      ref={el => { upcomingRefs.current[pageI * VISIBLE + i] = el; }}
                      className="glass-card rounded-3xl p-5 border border-[#4c4450]/10 hover:border-[#d394ff]/30 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-[#d394ff]/10 text-[#d394ff] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {item.date}
                        </span>
                        <div className="w-6 h-6 rounded font-bold text-[8px] text-white flex items-center justify-center shrink-0"
                          style={{ background: item.platformColor }}>
                          {item.platform}
                        </div>
                      </div>
                      <p className="text-[#cfc2d2] text-sm line-clamp-2 mb-4 italic leading-relaxed">{item.caption}</p>
                      <div className="w-full h-28 rounded-2xl overflow-hidden bg-[#1c1b1b]">
                        <img src={item.img} className="w-full h-full object-cover" alt="" loading="lazy" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Dots — desktop only */}
          <div className="hidden lg:flex justify-center gap-1.5 mt-4">
            {Array.from({ length: PAGE_COUNT }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIdx(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === carouselIdx ? 20 : 6,
                  height: 6,
                  background: i === carouselIdx ? '#d394ff' : 'rgba(76,68,80,0.6)',
                }}
              />
            ))}
          </div>
        </section>

        {/* ── Main Grid ── */}
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
              {RECENT_POSTS.map((post, i) => (
                <Link
                  key={post.title}
                  to="/posts/88291"
                  ref={el => { postRefs.current[i] = el; }}
                  className="glass-card rounded-[2rem] p-4 border border-[#4c4450]/5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 hover:bg-[#201f1f] transition-all cursor-pointer"
                >
                  <div className="w-full h-32 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 bg-[#1c1b1b]">
                    <img src={post.img} className="w-full h-full object-cover" alt="" loading="lazy" />
                  </div>

                  <div className="grow min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className="w-4 h-4 rounded-sm flex items-center justify-center text-[6px] text-white font-bold"
                        style={{ background: post.platformColor }}
                      >
                        {post.platform}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${post.statusColor}`}>
                        {post.status}
                      </span>
                    </div>
                    <h4 className="text-white text-sm font-semibold truncate">{post.title}</h4>
                    <p className="text-[#988d9c] text-xs mt-0.5">{post.date}</p>
                  </div>

                  <div className="flex gap-4 sm:gap-5 sm:px-5 sm:border-l border-[#4c4450]/10 shrink-0">
                    {[['Likes', post.likes], ['Comments', post.comments], ['Shares', post.shares]].map(([l, v]) => (
                      <div key={l} className="text-center">
                        <p className="font-mono text-sm text-white">{v}</p>
                        <p className="text-[9px] text-[#988d9c] uppercase tracking-wider">{l}</p>
                      </div>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Platform Health */}
          <section className="space-y-4">
            <h3 className="font-headline text-2xl font-bold text-white tracking-tight mb-2">Platform Health</h3>
            <div className="space-y-3">
              {PLATFORM_HEALTH.map((p, i) => (
                <div
                  key={p.name}
                  ref={el => { platformRefs.current[i] = el; }}
                  className="glass-card rounded-3xl p-5 border border-[#4c4450]/10 relative overflow-hidden group"
                >
                  <div
                    className="absolute top-0 right-0 w-28 h-28 rounded-full -mr-14 -mt-14 blur-3xl transition-all pointer-events-none"
                    style={{ background: p.color + '1a' }}
                  />
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: p.color }}
                      >
                        {p.abbr}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{p.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${p.ok ? 'bg-[#c5d247]' : 'bg-[#ffb4ab] animate-pulse'}`} />
                          <span className="text-[10px] text-[#988d9c] uppercase tracking-wider">{p.status}</span>
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#988d9c]" style={{ fontSize: 18 }}>
                      {p.ok ? 'more_vert' : 'sync_problem'}
                    </span>
                  </div>
                  {!p.ok && (
                    <button className="mt-3 w-full bg-[#2a2a2a] hover:bg-[#353534] text-white py-2 rounded-xl text-xs font-bold transition-all border border-[#4c4450]/10">
                      Reconnect Account
                    </button>
                  )}
                </div>
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
