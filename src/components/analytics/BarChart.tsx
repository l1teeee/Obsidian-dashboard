interface BarChartProps {
  barHeights: number[];
  barDays:    string[];
}

const MAX_VALUE = 100;

export default function BarChart({ barHeights, barDays }: BarChartProps) {
  const peak = Math.max(...barHeights);

  return (
    <div data-chart className="glass-card p-8 rounded-3xl border border-[#4c4450]/5">
      <div className="mb-6">
        <h3 className="text-xl font-headline font-bold tracking-tight text-white">Daily Engagement</h3>
        <p className="text-sm text-[#988d9c]">Weighted interaction score</p>
      </div>

      {/* Bars */}
      <div className="flex items-end justify-between gap-2 px-1" style={{ height: 200 }}>
        {barHeights.map((h, i) => {
          const isPeak   = h === peak;
          const heightPx = Math.round((h / MAX_VALUE) * 200);
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
              {/* Value label */}
              <span
                className="text-[9px] font-mono font-bold transition-colors"
                style={{ color: isPeak ? '#d394ff' : '#4c4450' }}
              >
                {h}
              </span>
              {/* Bar */}
              <div
                data-bar
                className="w-full rounded-t-md cursor-pointer transition-all hover:brightness-125"
                style={{
                  height:     heightPx,
                  background: isPeak
                    ? 'linear-gradient(180deg, #d394ff 0%, #9b40e8 100%)'
                    : 'linear-gradient(180deg, rgba(211,148,255,0.55) 0%, rgba(150,80,220,0.35) 100%)',
                  boxShadow: isPeak ? '0 0 12px rgba(211,148,255,0.35)' : undefined,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Day labels */}
      <div className="flex justify-between mt-3 px-1">
        {barDays.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[10px] font-mono text-[#988d9c]">{d}</span>
        ))}
      </div>
    </div>
  );
}
