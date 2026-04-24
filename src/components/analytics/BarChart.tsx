import { motion } from 'motion/react';

interface BarChartProps {
  barHeights: number[];
  barDays:    string[];
}

export default function BarChart({ barHeights, barDays }: BarChartProps) {
  const peak = Math.max(...barHeights);

  return (
    <div data-chart className="glass-card p-8 rounded-3xl border border-[#4c4450]/5">
      <div className="mb-6">
        <h3 className="text-xl font-headline font-bold tracking-tight text-white">Daily Engagement</h3>
        <p className="text-sm text-[#988d9c]">Weighted interaction score</p>
      </div>

      <div className="flex items-end justify-between gap-2 px-1" style={{ height: 200 }}>
        {barHeights.map((h, i) => {
          const isPeak = h === peak;
          const heightPx = Math.round((h / peak) * 180);
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
              <span
                className="text-[9px] font-mono font-bold"
                style={{ color: isPeak ? '#d394ff' : '#4c4450' }}
              >
                {h}
              </span>
              <motion.div
                data-bar
                className="w-full rounded-t-md cursor-pointer hover:brightness-125"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ filter: 'brightness(1.3)' }}
                style={{
                  height: heightPx,
                  background: isPeak
                    ? 'linear-gradient(180deg, #d394ff 0%, #9b40e8 100%)'
                    : 'linear-gradient(180deg, #a05fd4 0%, #6b2fa0 100%)',
                  boxShadow: isPeak ? '0 0 16px rgba(211,148,255,0.45)' : undefined,
                  transformOrigin: 'bottom center',
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-3 px-1">
        {barDays.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[10px] font-mono text-[#988d9c]">{d}</span>
        ))}
      </div>
    </div>
  );
}
