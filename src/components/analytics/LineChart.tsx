import { useEffect, useRef } from 'react';
import { createChart, AreaSeries, ColorType } from 'lightweight-charts';

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

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
        tickMarkMaxCharacterLength: 8,
      },
      rightPriceScale: {
        borderColor: 'transparent',
        scaleMargins: { top: 0.12, bottom: 0.08 },
      },
      crosshair: {
        vertLine: { color: '#4c4450', width: 1, style: 2 },
        horzLine: { color: '#4c4450', width: 1, style: 2 },
      },
      handleScroll: false,
      handleScale: false,
    });

    const impressionsSeries = chart.addSeries(AreaSeries, {
      lineColor: '#4F7A4A',
      topColor: 'rgba(197,210,71,0.15)',
      bottomColor: 'rgba(197,210,71,0)',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const reachSeries = chart.addSeries(AreaSeries, {
      lineColor: '#C8553A',
      topColor: 'rgba(200,85,58,0.15)',
      bottomColor: 'rgba(200,85,58,0)',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    impressionsSeries.setData(data.map(d => ({ time: d.date, value: d.impressions })));
    reachSeries.setData(data.map(d => ({ time: d.date, value: d.reach })));

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, []);

  return (
    <div data-chart className="lg:col-span-2 glass-card p-8 rounded-3xl border border-[#15140F]/5 shadow-[0_0_40px_rgba(200,85,58,0.08)]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-headline font-bold tracking-tight text-[#15140F]">Reach & Impressions</h3>
          <p className="text-sm text-[#6B655B]">Aggregate visibility across all active platforms</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#C8553A]" />
            <span className="text-xs font-mono text-[#15140F]">Reach</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4F7A4A]" />
            <span className="text-xs font-mono text-[#15140F]">Impressions</span>
          </div>
        </div>
      </div>
      <div ref={containerRef} className="h-[280px] w-full" />
    </div>
  );
}
