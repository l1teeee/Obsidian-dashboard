import { useState } from 'react';

interface LIPreviewProps {
  caption:       string;
  mediaPreviews: string[];
}

function MediaCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const count = images.length;

  if (count === 0) return null;

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

export default function LIPreview({ caption, mediaPreviews }: LIPreviewProps) {
  return (
    <div className="w-full h-full bg-[#f4f2ee] flex flex-col pt-5">
      {/* Top bar */}
      <div className="px-3 pb-2 flex items-center justify-between bg-white border-b border-[#e0e0e0] shrink-0">
        <span className="font-black text-[#0077b5] text-lg">in</span>
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-[#666] text-[18px]">search</span>
          <span className="material-symbols-outlined text-[#666] text-[18px]">notifications</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white mx-2 mt-2 rounded-xl border border-[#e0e0e0] overflow-hidden">
          {/* Author row */}
          <div className="flex items-start gap-2 p-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#d394ff] to-[#9400e4] p-[1.5px] shrink-0">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[#d394ff] text-[13px]">person</span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-[#191919] leading-tight">Alex Rivera</p>
              <p className="text-[9px] text-[#666] leading-tight">Digital Curator · Vielinks</p>
              <p className="text-[9px] text-[#666]">Just now · <span className="material-symbols-outlined text-[9px] align-middle">public</span></p>
            </div>
            <button className="text-[#0077b5] text-[10px] font-bold border border-[#0077b5] rounded-full px-2 py-0.5 shrink-0">+ Follow</button>
          </div>

          {/* Caption */}
          <div className="px-3 pb-2">
            <p className="text-[11px] text-[#191919] leading-relaxed line-clamp-4">
              {caption || 'Your post content will appear here...'}
            </p>
          </div>

          {/* Media carousel */}
          {mediaPreviews.length > 0 && <MediaCarousel images={mediaPreviews} />}

          {/* Reactions row */}
          <div className="px-3 py-2 border-t border-[#e0e0e0]">
            <div className="flex justify-between">
              {[['thumb_up','Like'],['mode_comment','Comment'],['repeat','Repost'],['send','Send']].map(([icon, label]) => (
                <button key={label} className="flex flex-col items-center gap-0.5">
                  <span className="material-symbols-outlined text-[#666] text-[16px]">{icon}</span>
                  <span className="text-[8px] text-[#666]">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div className="h-12 bg-white border-t border-[#e0e0e0] flex justify-around items-center shrink-0">
        {['home','group','work','notifications','person'].map(icon => (
          <span key={icon} className="material-symbols-outlined text-[#0077b5] text-[18px]">{icon}</span>
        ))}
      </div>
    </div>
  );
}
