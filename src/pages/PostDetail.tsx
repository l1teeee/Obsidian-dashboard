import TopBar from '../components/layout/TopBar';
import PostPreviewCard from '../components/post-detail/PostPreviewCard';
import MetricCard from '../components/post-detail/MetricCard';
import BenchmarkBar from '../components/post-detail/BenchmarkBar';
import SentimentRing from '../components/post-detail/SentimentRing';
import VisualIntelligence from '../components/post-detail/VisualIntelligence';
import CommentList from '../components/post-detail/CommentList';
import { usePostDetail } from '../hooks/usePostDetail';

export default function PostDetail() {
  const { post, resolvedId, pageRef, handleBack } = usePostDetail();

  return (
    <div ref={pageRef}>
      <TopBar
        title="Post Detail"
        subtitle={`#${resolvedId}`}
        actions={
          <>
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-[#988d9c] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back
            </button>
            <button className="bg-[#e4b9ff] text-[#2f004d] px-5 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-transform">
              Export Report
            </button>
          </>
        }
      />

      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 md:space-y-10">

        {/* Top row: Preview + Metrics */}
        <section className="grid grid-cols-12 gap-6 md:gap-10">

          <div className="col-span-12 lg:col-span-5">
            <PostPreviewCard post={post} />
          </div>

          <div className="col-span-12 lg:col-span-7 space-y-6 md:space-y-8">

            {/* KPI grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {post.metrics.map((m, i) => (
                <MetricCard key={m.label} metric={m} index={i} />
              ))}
            </div>

            {/* Performance Benchmark */}
            <div className="bg-[#201f1f] rounded-3xl p-6 md:p-8 border border-[#4c4450]/10">
              <h3 className="font-headline font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d394ff]">equalizer</span>
                Performance Benchmark
              </h3>
              <div className="space-y-6">
                {post.benchmarks.map((b) => (
                  <BenchmarkBar key={b.label} benchmark={b} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sentiment + Visual Intelligence */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SentimentRing />
          <VisualIntelligence tags={post.tags} />
        </section>

        <CommentList comments={post.comments} commentsCount={post.metrics[1]?.value ?? '0'} />
      </div>
    </div>
  );
}
