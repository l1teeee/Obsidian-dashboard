import type { PostBenchmark } from '../../domain/entities/Post';

const VARIANT_COLORS: Record<PostBenchmark['variant'], { text: string; barBg: string; barFill: string }> = {
  purple: { text: 'text-[#d394ff]', barBg: 'bg-[#d394ff]/30', barFill: 'bg-[#d394ff]' },
  green:  { text: 'text-[#c5d247]', barBg: 'bg-[#c5d247]/30', barFill: 'bg-[#c5d247]' },
  red:    { text: 'text-[#ffb4ab]', barBg: 'bg-[#ffb4ab]/30', barFill: 'bg-[#ffb4ab]' },
};

interface BenchmarkBarProps {
  benchmark: PostBenchmark;
}

export default function BenchmarkBar({ benchmark: b }: BenchmarkBarProps) {
  const colors = VARIANT_COLORS[b.variant];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end text-[11px] font-mono">
        <span className="text-[#988d9c] uppercase tracking-widest">{b.label}</span>
        <span className={colors.text}>{b.delta}</span>
      </div>
      <div className={`h-2 w-full ${colors.barBg} rounded-full overflow-hidden`}>
        <div
          data-bench-bar
          className={`h-full ${colors.barFill} rounded-full`}
          style={{ width: `${b.pct}%` }}
        />
      </div>
    </div>
  );
}
