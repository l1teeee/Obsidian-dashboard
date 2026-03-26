interface BarChartProps {
  barHeights: number[];
  barDays:    string[];
}

export default function BarChart({ barHeights, barDays }: BarChartProps) {
  return (
    <div data-chart className="glass-card p-8 rounded-3xl border border-[#4c4450]/5">
      <div className="mb-8">
        <h3 className="text-xl font-headline font-bold tracking-tight text-white">Daily Engagement</h3>
        <p className="text-sm text-[#988d9c]">Weighted interaction score</p>
      </div>
      <div className="h-[280px] flex items-end justify-between gap-2 px-2">
        {barHeights.map((h, i) => (
          <div
            key={i}
            data-bar
            className="w-full rounded-t-lg transition-all hover:bg-[#d394ff] cursor-pointer"
            style={{ height: `${h}%`, background: i === 4 ? '#d394ff' : 'rgba(211,148,255,0.2)' }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-4 text-[10px] font-mono text-[#988d9c] px-1">
        {barDays.map((d, i) => <span key={i}>{d}</span>)}
      </div>
    </div>
  );
}
