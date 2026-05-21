import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';
import TopBar from '../components/layout/TopBar';
import RecentPostRow from '../components/dashboard/RecentPostRow';
import ComposeDrawer from '../components/dashboard/ComposeDrawer';
import { useDashboard } from '../hooks/useDashboard';
import { PLATFORM_REGISTRY } from '../domain/entities/Platform';

const HEADLINES = [
  { pre: 'Plan a',        italic: 'quiet',    post: 'week ahead.' },
  { pre: 'Make',          italic: 'today',    post: 'count.' },
  { pre: 'Publish with',  italic: 'purpose',  post: 'this week.' },
  { pre: 'Stay',          italic: 'consistent', post: 'this week.' },
  { pre: 'A good day to', italic: 'create',   post: 'something.' },
  { pre: 'Keep',          italic: 'going',    post: "— you're doing great." },
  { pre: 'Rest well,',    italic: 'plan',     post: 'well.' },
];

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    kpiCards, upcoming, recentPosts, loaded,
    heroRef, postRefs,
  } = useDashboard();

  const today    = new Date();
  const headline = HEADLINES[today.getDay() % HEADLINES.length];

  const weekStart = startOfWeek(today, { weekStartsOn: 0 });
  const weekDays  = eachDayOfInterval({ start: weekStart, end: endOfWeek(today, { weekStartsOn: 0 }) });

  const nextUp           = upcoming[0] ?? null;
  const scheduledCount   = kpiCards[2]?.display ?? String(upcoming.length);
  const totalPostsCount  = kpiCards[3]?.display ?? '—';
  const engagementRate   = kpiCards[1]?.display ?? '—';

  return (
    <div>
      <TopBar title="Home" />

      {!loaded ? (
        <div className="p-6 md:p-10 max-w-330 mx-auto space-y-8 animate-pulse">
          <div className="space-y-4 pb-8 border-b border-[#0F172A]/10">
            <div className="h-3 w-40 bg-[#F1F5F9] rounded-full" />
            <div className="h-14 w-96 bg-[#F1F5F9] rounded-2xl" />
            <div className="h-4 w-72 bg-[#F1F5F9] rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map(i => (
              <div key={i} className="surface-card h-64" />
            ))}
          </div>
          <div className="grid grid-cols-7 border border-[#0F172A]/10 rounded-2xl overflow-hidden">
            {[0,1,2,3,4,5,6].map(i => (
              <div key={i} className="min-h-28 bg-[#F1F5F9]/40 border-r border-[#0F172A]/10 last:border-r-0" />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 md:p-10 max-w-330 mx-auto space-y-8">

          {/* ── Home Head ─────────────────────────────────────────────────────── */}
          <section
            ref={heroRef}
            className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between pb-8 border-b border-[#0F172A]/10"
          >
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748B] mb-4">
                {format(today, "EEEE '·' MMM d '·' yyyy").toUpperCase()}
              </p>
              <h1 className="font-headline text-[clamp(2.25rem,4vw,3.5rem)] font-medium tracking-[-0.032em] leading-[1.05] text-[#0F172A]">
                {headline.pre}{' '}
                <em
                  className="not-italic text-[#111827]"
                  style={{ fontFamily: "'Instrument Serif', Georgia, 'Times New Roman', serif", fontStyle: 'italic' }}
                >
                  {headline.italic}
                </em>
                {' '}{headline.post}
              </h1>
              <p className="mt-3 text-sm text-[#64748B] leading-relaxed max-w-xl">
                {upcoming.length > 0
                  ? `${upcoming.length} post${upcoming.length !== 1 ? 's' : ''} in the queue. Engagement is steady — a good moment to write something you'd actually want to read.`
                  : 'No posts scheduled yet. Start by creating a new post and building your queue.'}
              </p>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <div className="text-center">
                <p className="font-headline text-3xl font-bold text-[#111827]">{scheduledCount}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#64748B] mt-0.5">Scheduled</p>
              </div>
              <div className="w-px h-8 bg-[#0F172A]/10" />
              <div className="text-center">
                <p className="font-headline text-3xl font-bold text-[#0F172A]">{totalPostsCount}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#64748B] mt-0.5">Total Posts</p>
              </div>
              <div className="w-px h-8 bg-[#0F172A]/10" />
              <div className="text-center">
                <p className="font-headline text-3xl font-bold text-[#0F172A]">{engagementRate}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#64748B] mt-0.5">Engagement</p>
              </div>
            </div>
          </section>

          {/* ── Three-panel hero ──────────────────────────────────────────────── */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

            {/* Media preview — fixed 318px, platform label as overlay */}
            <div
              className="surface-card overflow-hidden relative"
              style={{ height: '318px' }}
            >
              {nextUp ? (
                <>
                  {/* Image fills the full card */}
                  <div className="absolute inset-0 bg-[#F1F5F9] flex items-center justify-center">
                    {nextUp.mediaUrls?.[0] ? (
                      <img
                        src={nextUp.mediaUrls[0]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[#94A3B8]" style={{ fontSize: 40 }}>image</span>
                    )}
                  </div>

                  {/* Platform badge — overlay top-left */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                    style={{
                      background: 'rgba(15,23,42,0.45)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    <span className="material-symbols-outlined text-white/80" style={{ fontSize: 11 }}>
                      {PLATFORM_REGISTRY[nextUp.platform]?.icon ?? 'public'}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white font-bold">
                      {nextUp.platform.toUpperCase()} · 1:1
                    </span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#F1F5F9] p-6 text-center">
                  <span className="material-symbols-outlined text-[#94A3B8]" style={{ fontSize: 36 }}>photo_library</span>
                  <p className="text-sm text-[#64748B]">No upcoming media</p>
                  <Link to="/composer" className="text-xs font-semibold text-[#111827] hover:text-[#0B1220]">Schedule a post</Link>
                </div>
              )}
            </div>

            {/* Next Up */}
            {nextUp ? (
              <div className="surface-card p-6 flex flex-col gap-4" style={{ minHeight: '318px' }}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111827] animate-pulse" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111827]">
                    Next Up · {nextUp.date}
                  </p>
                </div>
                <div className="flex-1">
                  <h3 className="font-headline text-xl font-medium tracking-[-0.02em] text-[#0F172A] leading-tight mb-2">
                    {nextUp.caption?.slice(0, 55) || 'Untitled post'}
                    {(nextUp.caption?.length ?? 0) > 55 ? '…' : ''}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed line-clamp-3">
                    {nextUp.caption || 'No caption'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#0F172A]/8 flex items-center gap-2">
                  <Link
                    to={`/posts/${nextUp.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] text-white text-xs font-bold hover:bg-[#0B1220] transition-all"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>visibility</span>
                    Preview
                  </Link>
                  <Link
                    to={`/posts/${nextUp.id}`}
                    className="inline-flex items-center px-4 py-2 rounded-xl border border-[#0F172A]/18 text-xs font-semibold text-[#0F172A] hover:border-[#111827]/30 transition-all"
                  >
                    Edit post
                  </Link>
                  <Link
                    to="/calendar"
                    className="inline-flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors ml-auto"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>schedule</span>
                    Reschedule
                  </Link>
                </div>
              </div>
            ) : (
              <div className="surface-card p-6 flex flex-col items-center justify-center gap-3 text-center">
                <span className="material-symbols-outlined text-[#94A3B8]" style={{ fontSize: 32 }}>event_note</span>
                <p className="text-sm font-medium text-[#0F172A]">Nothing scheduled yet</p>
                <p className="text-xs text-[#64748B]">Your next post will appear here once scheduled.</p>
                <Link to="/composer" className="text-sm font-semibold text-[#111827] hover:text-[#0B1220] mt-1">Schedule a post</Link>
              </div>
            )}

            {/* Compose shortcuts — flex-col stretch to 318px */}
            <div className="flex flex-col gap-3" style={{ minHeight: '318px' }}>
              {/* Compose CTA — grows to fill available space */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="surface-card p-5 flex flex-col gap-2 text-left transition-all hover:bg-[#F4E0D6]/40 flex-1 cursor-pointer"
                style={{ border: '1px solid rgba(14,159,110,0.22)', background: 'rgba(14,159,110,0.18)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#111827] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>add</span>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111827] font-bold">Compose</p>
                </div>
                <p className="text-sm font-semibold text-[#0F172A] leading-snug mt-1">Write something for tomorrow.</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">Drafts auto-save · AI can help with caption</p>
              </button>

              {/* Generate caption */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="surface-card p-4 flex items-center justify-between transition-all group text-left shrink-0 cursor-pointer hover:bg-[#F1F5F9] hover:border-[#111827]/25 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] group-hover:bg-[#E2E8F0] flex items-center justify-center shrink-0 transition-colors">
                    <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#111827] transition-colors" style={{ fontSize: 15 }}>auto_awesome</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">Generate a caption</p>
                    <p className="text-[11px] text-[#64748B]">Uses your brand voice</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#94A3B8] group-hover:text-[#111827] group-hover:translate-x-0.5 transition-all" style={{ fontSize: 18 }}>chevron_right</span>
              </button>

              {/* Plan the week */}
              <Link
                to="/calendar"
                className="surface-card p-4 flex items-center justify-between transition-all group shrink-0 cursor-pointer hover:bg-[#F1F5F9] hover:border-[#111827]/25 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] group-hover:bg-[#E2E8F0] flex items-center justify-center shrink-0 transition-colors">
                    <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#111827] transition-colors" style={{ fontSize: 15 }}>calendar_month</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">Plan the full week</p>
                    <p className="text-[11px] text-[#64748B]">
                      {upcoming.length} post{upcoming.length !== 1 ? 's' : ''} this week
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#94A3B8] group-hover:text-[#111827] group-hover:translate-x-0.5 transition-all" style={{ fontSize: 18 }}>chevron_right</span>
              </Link>
            </div>
          </section>

          {/* ── This week ribbon ──────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline text-lg font-bold text-[#0F172A] tracking-[-0.01em]">This week</h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  {format(weekStart, 'MMM d')} — {format(weekDays[6], 'd')} · {upcoming.length} post{upcoming.length !== 1 ? 's' : ''} scheduled
                </p>
              </div>
              <Link
                to="/calendar"
                className="text-xs font-semibold text-[#111827] hover:text-[#0B1220] flex items-center gap-1 transition-colors"
              >
                Open calendar
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-7 border border-[#0F172A]/10 rounded-2xl overflow-hidden">
              {weekDays.map((day) => {
                const dayPrefix = format(day, 'MMM d, ');
                const dayPosts  = upcoming.filter(p => p.date.startsWith(dayPrefix));
                const isCurrentDay = isToday(day);
                return (
                  <div
                    key={day.toISOString()}
                    className={[
                      'min-h-28 p-2.5 border-r border-[#0F172A]/10 last:border-r-0 flex flex-col',
                      isCurrentDay ? 'bg-[#F4E0D6]/30' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[#64748B]">
                        {format(day, 'EEE').toUpperCase()}
                      </p>
                      <span className={[
                        'font-headline text-sm font-bold',
                        isCurrentDay ? 'text-[#111827]' : 'text-[#0F172A]',
                      ].join(' ')}>
                        {format(day, 'd')}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      {dayPosts.length === 0 ? (
                        <span className="text-[#94A3B8] text-sm leading-none mt-1">–</span>
                      ) : dayPosts.map(p => (
                        <Link
                          key={p.id}
                          to={`/posts/${p.id}`}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-[#F1F5F9] border-l-2 truncate hover:bg-[#E2E8F0] transition-colors"
                          style={{
                            borderLeftColor:
                              p.platform === 'instagram' ? '#E1306C'
                              : p.platform === 'linkedin'  ? '#0A66C2'
                              : '#1877F2',
                          }}
                        >
                          <span className="truncate text-[#334155]">{p.caption?.slice(0, 18) || 'Post'}</span>
                          <span className="shrink-0 font-mono text-[9px] text-[#64748B] ml-auto">
                            {p.date.match(/\d+:\d+/)?.[0] ?? ''}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Recent ────────────────────────────────────────────────────────── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="font-headline text-lg font-bold text-[#0F172A] tracking-[-0.01em]">Recent</h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">Last few posts and drafts</p>
              </div>
              <Link
                to="/posts"
                className="text-xs font-semibold text-[#111827] hover:text-[#0B1220] flex items-center gap-1 transition-colors"
              >
                See insights
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_forward</span>
              </Link>
            </div>
            {recentPosts.length === 0 ? (
              <div className="surface-card flex flex-col items-center justify-center py-12 gap-2">
                <span className="material-symbols-outlined text-[#94A3B8]" style={{ fontSize: 36 }}>article</span>
                <p className="text-sm text-[#64748B]">No published posts yet.</p>
                <Link to="/composer" className="text-sm font-semibold text-[#111827] hover:text-[#0B1220] mt-1">Create your first post</Link>
              </div>
            ) : (
              recentPosts.map((post, i) => (
                <RecentPostRow
                  key={post.id}
                  post={post}
                  rowRef={{ current: postRefs.current[i] ?? null } as React.RefObject<HTMLAnchorElement | null>}
                />
              ))
            )}
          </section>

        </div>
      )}

      <ComposeDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* FAB */}
      <div className="fixed bottom-5 right-5 z-50 mb-[env(safe-area-inset-bottom,0px)] sm:hidden">
        <Link
          to="/composer"
          aria-label="Create new post"
          className="w-14 h-14 bg-[#111827] text-white rounded-2xl shadow-[0_4px_20px_rgba(14,159,110,0.35)] flex items-center justify-center hover:bg-[#0B1220] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        </Link>
      </div>
    </div>
  );
}
