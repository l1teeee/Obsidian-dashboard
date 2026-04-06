import type { PostMetric } from '../../domain/entities/Post';

interface MetricCardProps {
  metric: PostMetric;
}

const METRIC_STYLE: Record<string, { icon: string; color: string }> = {
  'Impressions': { icon: 'visibility',  color: '#d394ff' },
  'Reach':       { icon: 'group',       color: '#7eb8f7' },
  'Likes':       { icon: 'favorite',    color: '#ff6b9d' },
  'Comments':    { icon: 'chat_bubble', color: '#c5d247' },
  'Shares':      { icon: 'share',       color: '#4ecdc4' },
  'Clicks':      { icon: 'ads_click',   color: '#ffd166' },
  'Eng. Rate':   { icon: 'trending_up', color: '#c5d247' },
};

export default function MetricCard({ metric: m }: MetricCardProps) {
  const cfg = METRIC_STYLE[m.label] ?? { icon: 'bar_chart', color: '#988d9c' };
  const isEmpty = m.value === '—' || m.value === '0';

  return (
    <div data-metric className="relative bg-[#201f1f] rounded-2xl p-5 border border-[#4c4450]/5 overflow-hidden group">

      {/* Glow blob */}
      <div
        className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ background: cfg.color }}
      />

      <div className="relative">
        <span
          className="material-symbols-outlined text-[18px] mb-3 block"
          style={{ color: cfg.color, fontVariationSettings: "'FILL' 1" }}
        >{cfg.icon}</span>

        <div className={`font-mono text-2xl font-bold tracking-tight mb-1 ${isEmpty ? 'text-[#4c4450]' : 'text-white'}`}>
          {m.value}
        </div>

        <div className="text-[10px] text-[#988d9c] uppercase tracking-widest">{m.label}</div>
      </div>
    </div>
  );
}
