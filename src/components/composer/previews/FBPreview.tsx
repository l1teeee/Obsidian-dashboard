interface PreviewProps {
  caption:      string;
  mediaPreview: string | null;
}

export default function FBPreview({ caption, mediaPreview }: PreviewProps) {
  return (
    <div className="w-full h-full bg-[#f0f2f5] flex flex-col pt-5">
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
          <div className="flex items-center gap-2 p-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#d394ff] to-[#9400e4] p-[1.5px] shrink-0">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[#d394ff] text-[13px]">person</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#050505]">Alex Rivera</p>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-[#65676b]">Just now ·</span>
                <span className="material-symbols-outlined text-[#65676b] text-[9px]">public</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#65676b] text-[18px] ml-auto">more_horiz</span>
          </div>
          <div className="px-3 pb-2">
            <p className="text-[11px] text-[#050505] leading-relaxed line-clamp-4">
              {caption || 'Your post content will appear here...'}
            </p>
          </div>
          {mediaPreview ? (
            <img src={mediaPreview} className="w-full aspect-video object-cover" alt="" />
          ) : (
            <div className="w-full aspect-video bg-[#f0f2f5] flex items-center justify-center border-t border-b border-[#e4e6eb]">
              <span className="material-symbols-outlined text-[#bcc0c4] text-[32px]">image</span>
            </div>
          )}
          <div className="px-3 pt-2 pb-1">
            <div className="flex justify-between text-[9px] text-[#65676b] pb-2 border-b border-[#e4e6eb]">
              <span>👍 ❤️ 24</span>
              <span>5 comments · 2 shares</span>
            </div>
            <div className="flex justify-around pt-1">
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
      <div className="h-12 bg-white border-t border-[#e4e6eb] flex justify-around items-center shrink-0">
        {['home','group','ondemand_video','storefront','notifications'].map(icon => (
          <span key={icon} className="material-symbols-outlined text-[#1877f2] text-[18px]">{icon}</span>
        ))}
      </div>
    </div>
  );
}
