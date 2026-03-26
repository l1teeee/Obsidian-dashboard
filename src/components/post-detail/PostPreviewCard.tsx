import { PLATFORM_REGISTRY } from '../../domain/entities/Platform';
import type { PostRecord } from '../../domain/entities/Post';

interface PostPreviewCardProps {
  post: PostRecord;
}

export default function PostPreviewCard({ post }: PostPreviewCardProps) {
  const p = PLATFORM_REGISTRY[post.platform];

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-[#4c4450]/10 shadow-[0_0_40px_rgba(211,148,255,0.08)]">
      <div data-post-img className="relative aspect-[4/5] w-full">
        <img src={post.imageUrl} className="w-full h-full object-cover" alt="Post preview" />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
          <span
            className="material-symbols-outlined text-[#d394ff] text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
            Published on {p.name}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded"
            style={{ color: p.color, background: p.color + '1a' }}
          >
            {p.name}
          </span>
          <span className="text-[10px] font-mono text-[#988d9c]">{post.date}</span>
        </div>
        <p className="text-[#cfc2d2] text-sm leading-relaxed">{post.caption}</p>
      </div>
    </div>
  );
}
