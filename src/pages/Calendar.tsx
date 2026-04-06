import { Link } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import CalendarNav from '../components/calendar/CalendarNav';
import PlatformFilter from '../components/calendar/PlatformFilter';
import MonthView from '../components/calendar/MonthView';
import WeekView from '../components/calendar/WeekView';
import ListView from '../components/calendar/ListView';
import { useCalendar } from '../hooks/useCalendar';

export default function Calendar() {
  const {
    view, setView, current, selected, activePlatforms, filteredPosts, loading,
    navLabel, goBack, goForward, goToday, handleSelectDay, togglePlatform,
    pageRef, bodyRef,
  } = useCalendar();

  return (
    <div ref={pageRef}>
      <TopBar
        title="Content Calendar"
        actions={
          <Link
            to="/composer"
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#d394ff] text-[#2f004d] text-xs font-bold hover:shadow-[0_0_20px_rgba(211,148,255,0.3)] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            New Post
          </Link>
        }
      />

      <div className="p-6 md:p-8 max-w-7xl mx-auto">

        {/* Controls */}
        <div data-cal-header className="flex flex-col gap-4 mb-6">

          <CalendarNav
            navLabel={navLabel}
            view={view}
            onBack={goBack}
            onForward={goForward}
            onToday={goToday}
            onViewChange={(v) => { setView(v); }}
          />

          <PlatformFilter
            activePlatforms={activePlatforms}
            onToggle={togglePlatform}
          />
        </div>

        {/* View body */}
        <div ref={bodyRef} data-cal-body>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-20 shrink-0 space-y-1.5 pt-1">
                    <div className="h-3 w-10 bg-[#2a2a2a] rounded-full ml-auto" />
                    <div className="h-8 w-8 bg-[#2a2a2a] rounded-xl ml-auto" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-14 bg-[#201f1f] rounded-2xl border border-[#4c4450]/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {view === 'month' && (
                <MonthView
                  current={current}
                  selected={selected}
                  onSelectDay={handleSelectDay}
                  posts={filteredPosts}
                />
              )}
              {view === 'week' && <WeekView current={current} posts={filteredPosts} />}
              {view === 'list' && <ListView posts={filteredPosts} />}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
