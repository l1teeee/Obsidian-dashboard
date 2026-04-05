import { PLATFORM_REGISTRY } from '../../domain/entities/Platform';
import type { PlatformId } from '../../domain/entities/Platform';

interface PostPreviewCardProps {
  platform:   PlatformId;
  caption:    string | null;
  mediaUrls:  string[] | null;
  date:       string;
  status:     string;
  permalink?: string | null;
}

export default function PostPreviewCard({ platform, caption, mediaUrls, date, status, permalink }: PostPreviewCardProps) {
  const p        = PLATFORM_REGISTRY[platform] ?? PLATFORM_REGISTRY.instagram;
  const hasMedia = mediaUrls && mediaUrls.length > 0;

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-[#4c4450]/10 shadow-[0_0_40px_rgba(211,148,255,0.08)]">

      {/* Image area — only if there are images */}
      {hasMedia && (
        <div data-post-img className="relative aspect-[4/5] w-full bg-[#0e0e0e]">
          <img
            src={mediaUrls[0]}
            className="w-full h-full object-cover"
            alt="Post media"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          {mediaUrls.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-white/10">
              1 / {mediaUrls.length}
            </div>
          )}
        </div>
      )}

      {/* Text-only visual when no images */}
      {!hasMedia && (
        <div
          data-post-img
          className="relative aspect-[4/5] w-full flex items-center justify-center p-8"
          style={{ background: `linear-gradient(135deg, ${p.color}18 0%, #0e0e0e 100%)` }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{ background: `radial-gradient(circle at 30% 40%, ${p.color}, transparent 60%)` }}
          />
          <p className="relative text-[#cfc2d2] text-base leading-relaxed text-center line-clamp-[12] font-medium">
            {caption ?? <span className="text-[#988d9c] italic">No caption</span>}
          </p>
        </div>
      )}

      {/* Info footer */}
      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded"
              style={{ color: p.color, background: p.color + '1a' }}
            >
              {p.name}
            </span>
            <span className="text-[10px] font-mono text-[#988d9c]">{date}</span>
          </div>
          {permalink && status === 'published' && (
            <a
              href={permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-semibold text-[#d394ff] hover:text-[#e8c4ff] transition-colors"
            >
              <span className="material-symbols-outlined text-[12px]">open_in_new</span>
              View post
            </a>
          )}
        </div>

        {/* Caption — always show below if there's media */}
        {hasMedia && caption && (
          <p className="text-[#cfc2d2] text-sm leading-relaxed line-clamp-4">{caption}</p>
        )}
        {hasMedia && !caption && (
          <p className="text-[#988d9c] text-sm italic">No caption</p>
        )}
      </div>
    </div>
  );
}
