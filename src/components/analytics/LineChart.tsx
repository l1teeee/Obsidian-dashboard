import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const data = [
  { day: '12 Oct', reach: 18400, impressions: 32100 },
  { day: '15 Oct', reach: 21000, impressions: 38500 },
  { day: '18 Oct', reach: 19800, impressions: 35200 },
  { day: '21 Oct', reach: 26500, impressions: 47800 },
  { day: '24 Oct', reach: 24100, impressions: 43000 },
  { day: '27 Oct', reach: 31200, impressions: 56400 },
  { day: '30 Oct', reach: 28900, impressions: 51200 },
  { day: '02 Nov', reach: 35600, impressions: 63900 },
  { day: '05 Nov', reach: 33100, impressions: 59700 },
  { day: '09 Nov', reach: 41200, impressions: 74300 },
];

function formatY(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
}

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
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: '#988d9c', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatY}
              tick={{ fill: '#988d9c', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: '#1c1b1b',
                border: '1px solid rgba(76,68,80,0.3)',
                borderRadius: 12,
                color: '#e5e2e1',
                fontSize: 12,
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(val: any, name: any) => [
                val != null ? Number(val).toLocaleString() : '—',
                String(name).charAt(0).toUpperCase() + String(name).slice(1),
              ] as [string, string]}
              labelStyle={{ color: '#988d9c', marginBottom: 4 }}
            />
            <Line
              dataKey="impressions"
              stroke="#c5d247"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#c5d247' }}
            />
            <Line
              dataKey="reach"
              stroke="#d394ff"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#d394ff' }}
            />
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
