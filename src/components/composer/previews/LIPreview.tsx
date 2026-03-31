interface LIPreviewProps {
  caption:       string;
  mediaPreviews: string[];
}

function MediaGrid({ images }: { images: string[] }) {
  const count = images.length;
  if (count === 0) return null;

  if (count === 1) {
    return (
      <img src={images[0]} className="w-full aspect-video object-cover" alt="" />
    );
  }

  if (count === 2) {
    return (
      <div className="flex gap-0.5 aspect-video">
        {images.map((src, i) => (
          <img key={i} src={src} className="flex-1 object-cover" alt="" />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="flex gap-0.5" style={{ aspectRatio: '16/9' }}>
        <img src={images[0]} className="w-1/2 object-cover" alt="" />
        <div className="flex-1 flex flex-col gap-0.5">
          <img src={images[1]} className="flex-1 object-cover" alt="" />
          <img src={images[2]} className="flex-1 object-cover" alt="" />
        </div>
      </div>
    );
  }

  // 4+ images: 2x2 grid with "+N" overlay on last
  const shown  = images.slice(0, 4);
  const extra  = count - 4;
  return (
    <div className="grid grid-cols-2 gap-0.5" style={{ aspectRatio: '1/1' }}>
      {shown.map((src, i) => (
        <div key={i} className="relative overflow-hidden">
          <img src={src} className="w-full h-full object-cover" alt="" />
          {i === 3 && extra > 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-lg font-bold">+{extra}</span>
            </div>
          )}
        </div>
      ))}
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

          {/* Media grid */}
          {mediaPreviews.length > 0 && <MediaGrid images={mediaPreviews} />}

          {/* Reactions row */}
          <div className="px-3 py-2 border-t border-[#e0e0e0]">
            <p className="text-[9px] text-[#666] mb-2">42 reactions · 8 comments</p>
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
