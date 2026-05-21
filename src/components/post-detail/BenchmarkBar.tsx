import type { PostBenchmark } from '../../domain/entities/Post';

const VARIANT_COLORS: Record<PostBenchmark['variant'], { text: string; barBg: string; barFill: string }> = {
  purple: { text: 'text-[#111827]', barBg: 'bg-[#111827]/30', barFill: 'bg-[#111827]' },
  green:  { text: 'text-[#047857]', barBg: 'bg-[#047857]/30', barFill: 'bg-[#047857]' },
  red:    { text: 'text-[#DC2626]', barBg: 'bg-[#DC2626]/30', barFill: 'bg-[#DC2626]' },
};

interface BenchmarkBarProps {
  benchmark: PostBenchmark;
}

export default function BenchmarkBar({ benchmark: b }: BenchmarkBarProps) {
  const colors = VARIANT_COLORS[b.variant];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end text-[11px] font-mono">
        <span className="text-[#64748B] uppercase tracking-widest">{b.label}</span>
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
