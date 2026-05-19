import type { PostBenchmark } from '../../domain/entities/Post';

const VARIANT_COLORS: Record<PostBenchmark['variant'], { text: string; barBg: string; barFill: string }> = {
  purple: { text: 'text-[#C8553A]', barBg: 'bg-[#C8553A]/30', barFill: 'bg-[#C8553A]' },
  green:  { text: 'text-[#4F7A4A]', barBg: 'bg-[#4F7A4A]/30', barFill: 'bg-[#4F7A4A]' },
  red:    { text: 'text-[#A8362A]', barBg: 'bg-[#A8362A]/30', barFill: 'bg-[#A8362A]' },
};

interface BenchmarkBarProps {
  benchmark: PostBenchmark;
}

export default function BenchmarkBar({ benchmark: b }: BenchmarkBarProps) {
  const colors = VARIANT_COLORS[b.variant];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end text-[11px] font-mono">
        <span className="text-[#6B655B] uppercase tracking-widest">{b.label}</span>
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
