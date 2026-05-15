import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import TopBar from '../components/layout/TopBar';
import { getAllUserActivity } from '../services/users.service';
import type { ActivityItem } from '../services/users.service';

type Filter = 'all' | string;

function groupByDate(items: ActivityItem[]): { date: string; entries: ActivityItem[] }[] {
  const map = new Map<string, ActivityItem[]>();
  for (const item of items) {
    const key = item.time.includes('ago') || item.time.includes('Just') ? 'Recent' : item.time.split(' ').slice(0, 3).join(' ');
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return Array.from(map.entries()).map(([date, entries]) => ({ date, entries }));
}

export default function ActivityHistory() {
  const navigate = useNavigate();
  const pageRef  = useRef<HTMLDivElement>(null);
  const [items,   setItems]   = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<Filter>('all');
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    getAllUserActivity()
      .then(data => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-group]',    { y: 16, opacity: 0, duration: 0.4, ease: 'power2.out', stagger: 0.08, delay: 0.05 });
      gsap.from('[data-act-item]', { x: -10, opacity: 0, duration: 0.3, ease: 'power2.out', stagger: 0.04, delay: 0.12 });
    }, pageRef.current);
    return () => ctx.revert();
  }, [loading]);

  // Unique icon values for filter chips
  const iconFilters = [...new Set(items.map(i => i.icon))].slice(0, 8);

  const filtered = items.filter(item => {
    const matchFilter = filter === 'all' || item.icon === filter;
    const matchSearch = !search || item.action.toLowerCase().includes(search.toLowerCase()) || item.detail.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const groups = groupByDate(filtered);

  return (
    <div ref={pageRef}>
      <TopBar
        title="Activity History"
        subtitle="Your complete account activity log"
        actions={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-[#6B655B] hover:text-[#15140F] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back
          </button>
        }
      />

      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">

        {/* Search + filters */}
        <div className="space-y-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#15140F] text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search activity..."
              className="w-full bg-[#EFE9DC] border border-[#15140F]/20 rounded-2xl pl-11 pr-4 py-3 text-sm text-[#15140F] placeholder:text-[#15140F] focus:outline-none focus:border-[#C8553A]/40 focus:ring-1 focus:ring-[#C8553A]/15 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={[
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border',
                filter === 'all'
                  ? 'bg-[#C8553A]/15 border-[#C8553A]/40 text-[#C8553A]'
                  : 'bg-transparent border-[#15140F]/20 text-[#6B655B] hover:border-[#15140F]/40 hover:text-[#15140F]',
              ].join(' ')}
            >
              All
            </button>
            {iconFilters.map(icon => (
              <button
                key={icon}
                onClick={() => setFilter(filter === icon ? 'all' : icon)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border',
                  filter === icon
                    ? 'bg-[#C8553A]/15 border-[#C8553A]/40 text-[#C8553A]'
                    : 'bg-transparent border-[#15140F]/20 text-[#6B655B] hover:border-[#15140F]/40 hover:text-[#15140F]',
                ].join(' ')}
              >
                <span className="material-symbols-outlined text-[13px]">{icon}</span>
                {icon.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-[#EFE9DC] animate-pulse border border-[#15140F]/10" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <span className="material-symbols-outlined text-[#15140F] text-[48px]">history</span>
            <p className="text-[#6B655B] text-sm">{search || filter !== 'all' ? 'No results match your filters.' : 'No activity yet.'}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map(({ date, entries }) => (
              <div key={date} data-group>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] text-[#15140F] uppercase tracking-widest font-semibold">{date}</span>
                  <div className="flex-1 h-px bg-[#15140F]/15" />
                  <span className="text-[10px] text-[#15140F]">{entries.length}</span>
                </div>

                <div className="bg-[#EFE9DC] rounded-2xl border border-[#15140F]/10 divide-y divide-[#15140F]/5 overflow-hidden">
                  {entries.map((item, i) => (
                    <div key={i} data-act-item className="flex gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: item.color + '1a' }}
                      >
                        <span className="material-symbols-outlined text-[16px]" style={{ color: item.color }}>{item.icon}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-[#15140F] leading-tight">{item.action}</p>
                          <span className="text-[10px] text-[#15140F] uppercase tracking-wider shrink-0 mt-0.5">{item.time}</span>
                        </div>
                        <p className="text-xs text-[#6B655B] mt-0.5 truncate">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Count footer */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-[11px] text-[#15140F]">
            {filtered.length} {filtered.length === 1 ? 'event' : 'events'}{filter !== 'all' || search ? ' (filtered)' : ''}
          </p>
        )}
      </div>
    </div>
  );
}
