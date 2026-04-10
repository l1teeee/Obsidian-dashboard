import { useState } from 'react';

interface FBPreviewProps {
  caption:       string;
  mediaPreviews: string[];
  pageName?:     string | null;
}

function MediaCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const count = images.length;

  if (count === 0) {
    return (
      <div className="w-full aspect-video bg-[#f0f2f5] flex items-center justify-center border-t border-b border-[#e4e6eb]">
        <span className="material-symbols-outlined text-[#bcc0c4] text-[32px]">image</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-black">
      <img src={images[current]} className="w-full h-full object-contain" alt="" />

      {count > 1 && (
        <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-0.5">
          <span className="text-[10px] font-bold text-white">{current + 1}/{count}</span>
        </div>
      )}

      {count > 1 && current > 0 && (
        <button
          onClick={() => setCurrent(i => i - 1)}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <span className="material-symbols-outlined text-white text-[16px]">chevron_left</span>
        </button>
      )}
      {count > 1 && current < count - 1 && (
        <button
          onClick={() => setCurrent(i => i + 1)}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <span className="material-symbols-outlined text-white text-[16px]">chevron_right</span>
        </button>
      )}

      {count > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current ? 'w-3 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FBPreview({ caption, mediaPreviews, pageName }: FBPreviewProps) {
  return (
    <div className="w-full h-full bg-[#f0f2f5] flex flex-col pt-5">
      {/* Top bar */}
      <div className="px-3 pb-2 flex items-center justify-between bg-white border-b border-[#e4e6eb] shrink-0">
        <span className="font-black text-[#1877f2] text-xl">f</span>
        <div className="flex gap-2">
          {['search','notifications'].map(icon => (
            <div key={icon} className="w-7 h-7 rounded-full bg-[#e4e6eb] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#050505] text-[14px]">{icon}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white mx-2 mt-2 rounded-xl border border-[#e4e6eb] overflow-hidden">
          {/* Author row */}
          <div className="flex items-center gap-2 p-3">
            <div className="w-9 h-9 rounded-full bg-[#1877f2] flex items-center justify-center shrink-0">
              <span className="text-white text-[13px] font-bold">
                {pageName ? pageName[0].toUpperCase() : 'P'}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#050505]">
                {pageName ?? 'Your Page'}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-[#65676b]">Just now ·</span>
                <span className="material-symbols-outlined text-[#65676b] text-[9px]">public</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#65676b] text-[18px] ml-auto">more_horiz</span>
          </div>

          {/* Caption */}
          <div className="px-3 pb-2">
            <p className="text-[11px] text-[#050505] leading-relaxed line-clamp-4">
              {caption || 'Your post content will appear here...'}
            </p>
          </div>

          {/* Media carousel */}
          <MediaCarousel images={mediaPreviews} />

          {/* Reactions */}
          <div className="px-3 pt-2 pb-1">
            <div className="flex justify-around border-t border-[#e4e6eb] pt-1">
              {[['thumb_up','Like'],['mode_comment','Comment'],['share','Share']].map(([icon, label]) => (
                <button key={label} className="flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-[#f0f2f5]">
                  <span className="material-symbols-outlined text-[#65676b] text-[14px]">{icon}</span>
                  <span className="text-[9px] font-bold text-[#65676b]">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div className="h-12 bg-white border-t border-[#e4e6eb] flex justify-around items-center shrink-0">
        {['home','group','ondemand_video','storefront','notifications'].map(icon => (
          <span key={icon} className="material-symbols-outlined text-[#1877f2] text-[18px]">{icon}</span>
        ))}
      </div>
    </div>
  );
}
