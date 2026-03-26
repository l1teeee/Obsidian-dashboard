interface PreviewProps {
  caption:      string;
  mediaPreview: string | null;
}

export default function IGPreview({ caption, mediaPreview }: PreviewProps) {
  return (
    <div className="w-full h-full bg-black flex flex-col pt-5">
      <div className="px-4 pb-2 flex justify-between items-center shrink-0">
        <span className="text-white font-bold text-base font-headline">Instagram</span>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-white text-[20px]">favorite</span>
          <span className="material-symbols-outlined text-white text-[20px]">send</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[1.5px] shrink-0">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <span className="material-symbols-outlined text-[#d394ff] text-[12px]">person</span>
            </div>
          </div>
          <span className="text-xs font-bold text-white">obsidian_lens</span>
          <span className="material-symbols-outlined text-blue-400 text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          <span className="ml-auto text-[#0095f6] text-xs font-bold">Follow</span>
        </div>
        <div className="w-full aspect-square bg-[#201f1f] relative">
          {mediaPreview ? (
            <img src={mediaPreview} className="w-full h-full object-cover" alt="" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[#4c4450]">
              <span className="material-symbols-outlined text-[32px]">image</span>
              <span className="text-[9px] font-mono">No media</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center px-3 py-2.5">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-white text-[20px]">favorite</span>
            <span className="material-symbols-outlined text-white text-[20px]">mode_comment</span>
            <span className="material-symbols-outlined text-white text-[20px]">send</span>
          </div>
          <span className="material-symbols-outlined text-white text-[20px]">bookmark</span>
        </div>
        <div className="px-3 pb-4 space-y-1">
          <p className="text-[11px] font-bold text-white">1,248 likes</p>
          <p className="text-[11px] leading-relaxed text-white">
            <span className="font-bold">obsidian_lens </span>
            <span className="text-[#cfc2d2]">{caption || 'Your caption will appear here...'}</span>
          </p>
          <p className="text-[9px] text-[#988d9c] uppercase font-medium">Just now</p>
        </div>
      </div>
      <div className="h-12 border-t border-[#353534] flex justify-around items-center bg-black shrink-0">
        {['home', 'search', 'add_box', 'video_library'].map(icon => (
          <span key={icon} className="material-symbols-outlined text-white text-[20px]">{icon}</span>
        ))}
        <div className="w-6 h-6 rounded-full bg-[#353534]" />
      </div>
    </div>
  );
}
