import type { PostMetric } from '../../domain/entities/Post';

interface MetricCardProps {
  metric:    PostMetric;
  index:     number;
}

export default function MetricCard({ metric: m, index }: MetricCardProps) {
  return (
    <div data-metric className="bg-[#201f1f] rounded-2xl p-5 md:p-6 border border-[#4c4450]/5">
      <div className="text-[10px] text-[#988d9c] uppercase tracking-widest mb-1">{m.label}</div>
      <div className={`font-mono text-2xl md:text-3xl font-bold tracking-tight ${index === 0 ? 'text-[#d394ff]' : 'text-white'}`}>
        {m.value}
      </div>
      {m.delta && (
        <div className={`mt-2 flex items-center gap-1 text-[10px] ${m.positive ? 'text-[#c5d247]' : 'text-[#ffb4ab]'}`}>
          <span className="material-symbols-outlined text-[12px]">
            {m.positive ? 'trending_up' : 'trending_down'}
          </span>
          {m.delta}
        </div>
      )}
    </div>
  );
}
