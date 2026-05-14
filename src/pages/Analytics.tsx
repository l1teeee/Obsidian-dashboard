import TopBar from '../components/layout/TopBar';
import LineChart from '../components/analytics/LineChart';
import BarChart from '../components/analytics/BarChart';
import PlatformStatCard from '../components/analytics/PlatformStatCard';
import TopPostsTable from '../components/analytics/TopPostsTable';
import { useAnalytics } from '../hooks/useAnalytics';

export default function Analytics() {
  const { data, pageRef } = useAnalytics();

  return (
    <div ref={pageRef}>
      <TopBar
        title="Analytics Dashboard"
        actions={
          <div className="flex items-center bg-[#FAF7F2] px-4 py-1.5 rounded-full border border-[#1C1814]/15 cursor-pointer hover:bg-[#F0EBE2] transition-colors gap-2">
            <span className="material-symbols-outlined text-[#e4b9ff] text-[16px]">calendar_today</span>
            <span className="text-xs font-medium text-[#5C5650]">Oct 12 – Nov 11, 2023</span>
            <span className="material-symbols-outlined text-[#6A6470] text-[16px]">expand_more</span>
          </div>
        }
      />

      <div className="p-8 space-y-8 max-w-[1600px] mx-auto">

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.kpis.map((k) => (
            <div key={k.label} data-kpi className="glass-card p-6 rounded-3xl border border-[#1C1814]/5 shadow-[0_0_40px_rgba(125,211,199,0.08)]">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium text-[#6A6470] uppercase tracking-widest">{k.label}</span>
                {k.badge
                  ? <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${k.badgeColor === 'purple' ? 'bg-[#e4b9ff]/10 text-[#e4b9ff]' : 'bg-[#c5d247]/10 text-[#c5d247]'}`}>{k.badge}</span>
                  : <span className="material-symbols-outlined text-[#e4b9ff] text-[18px]">schedule</span>
                }
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-headline font-bold tracking-tighter text-[#1C1814]">{k.value}</h2>
                <span className="text-xs font-mono text-[#6A6470]">{k.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LineChart />
          <BarChart barHeights={data.barHeights} barDays={data.barDays} />
        </div>

        {/* Platform Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.platformBreakdown.map((p) => (
            <PlatformStatCard key={p.platformId} stat={p} />
          ))}
        </div>

        {/* Top Posts */}
        <TopPostsTable posts={data.topPosts} />
      </div>
    </div>
  );
}
