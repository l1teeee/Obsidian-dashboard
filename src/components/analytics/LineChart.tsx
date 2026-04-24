import { AreaChart, Area, Grid, ChartTooltip, XAxis, YAxis } from '../ui/area-chart';

const data = [
  { date: '2023-10-12', reach: 18400, impressions: 32100 },
  { date: '2023-10-15', reach: 21000, impressions: 38500 },
  { date: '2023-10-18', reach: 19800, impressions: 35200 },
  { date: '2023-10-21', reach: 26500, impressions: 47800 },
  { date: '2023-10-24', reach: 24100, impressions: 43000 },
  { date: '2023-10-27', reach: 31200, impressions: 56400 },
  { date: '2023-10-30', reach: 28900, impressions: 51200 },
  { date: '2023-11-02', reach: 35600, impressions: 63900 },
  { date: '2023-11-05', reach: 33100, impressions: 59700 },
  { date: '2023-11-09', reach: 41200, impressions: 74300 },
];

export default function LineChart() {
  return (
    <div data-chart className="lg:col-span-2 glass-card p-8 rounded-3xl border border-[#4c4450]/5 shadow-[0_0_40px_rgba(211,148,255,0.08)]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-headline font-bold tracking-tight text-white">Reach & Impressions</h3>
          <p className="text-sm text-[#988d9c]">Aggregate visibility across all active platforms</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#d394ff]" />
            <span className="text-xs font-mono text-[#e5e2e1]">Reach</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#c5d247]" />
            <span className="text-xs font-mono text-[#e5e2e1]">Impressions</span>
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <AreaChart
          data={data}
          xDataKey="date"
          animationDuration={800}
          aspectRatio="2 / 1"
          className="h-full"
        >
          <Area
            dataKey="impressions"
            fill="#c5d247"
            fillOpacity={0.15}
            stroke="#c5d247"
            strokeWidth={2.5}
          />
          <Area
            dataKey="reach"
            fill="#d394ff"
            fillOpacity={0.15}
            stroke="#d394ff"
            strokeWidth={2.5}
          />
          <Grid horizontal vertical={false} />
          <XAxis numTicks={5} />
          <YAxis numTicks={5} />
          <ChartTooltip showDatePill={false} showCrosshair={true} showDots={true} />
        </AreaChart>
      </div>
    </div>
  );
}
