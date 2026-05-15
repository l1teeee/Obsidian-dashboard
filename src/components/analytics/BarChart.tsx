import { useEffect, useRef } from 'react';
import { createChart, HistogramSeries, ColorType } from 'lightweight-charts';

interface BarChartProps {
  barHeights: number[];
  barDays:    string[];
}

function getLast7Dates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const dd   = String(d.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
}

function tsToDateStr(time: unknown): string {
  if (typeof time === 'number') {
    const d = new Date(time * 1000);
    const yyyy = d.getUTCFullYear();
    const mm   = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd   = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  if (typeof time === 'object' && time !== null) {
    const b = time as { year: number; month: number; day: number };
    return `${b.year}-${String(b.month).padStart(2, '0')}-${String(b.day).padStart(2, '0')}`;
  }
  return String(time);
}

export default function BarChart({ barHeights, barDays }: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const peak         = Math.max(...barHeights);

  useEffect(() => {
    if (!containerRef.current) return;

    const dates = getLast7Dates();

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#988d9c',
        fontFamily: "'Courier New', monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(76,68,80,0.3)', style: 1 },
      },
      timeScale: {
        borderColor: 'transparent',
        tickMarkFormatter: (time: unknown) => {
          const idx = dates.indexOf(tsToDateStr(time));
          return idx !== -1 ? barDays[idx] : '';
        },
        barSpacing: 30,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      rightPriceScale: {
        borderColor: 'transparent',
        scaleMargins: { top: 0.15, bottom: 0 },
      },
      crosshair: {
        vertLine: { color: '#4c4450', width: 1, style: 2 },
        horzLine: { visible: false, labelVisible: false },
      },
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addSeries(HistogramSeries, {
      priceLineVisible: false,
      lastValueVisible: false,
    });

    series.setData(
      barHeights.map((h, i) => ({
        time:  dates[i],
        value: h,
        color: h === peak
          ? 'rgba(200,85,58,0.85)'
          : 'rgba(107,47,160,0.7)',
      }))
    );

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [barHeights, barDays]);

  return (
    <div data-chart className="glass-card p-8 rounded-3xl border border-[#15140F]/5">
      <div className="mb-6">
        <h3 className="text-xl font-headline font-bold tracking-tight text-[#15140F]">Daily Engagement</h3>
        <p className="text-sm text-[#6B655B]">Weighted interaction score</p>
      </div>
      <div ref={containerRef} style={{ height: 200 }} className="w-full" />
    </div>
  );
}
