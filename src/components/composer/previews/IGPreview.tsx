import { useState } from 'react';

interface IGPreviewProps {
  caption:       string;
  mediaPreviews: string[];
  igAccountName?: string | null;
}

export default function IGPreview({ caption, mediaPreviews, igAccountName }: IGPreviewProps) {
  const [current, setCurrent] = useState(0);
  const count = mediaPreviews.length;

  const prev = () => setCurrent(i => (i - 1 + count) % count);
  const next = () => setCurrent(i => (i + 1) % count);

  return (
    <div className="w-full h-full bg-black flex flex-col pt-5">
      {/* Top bar */}
      <div className="px-4 pb-2 flex justify-between items-center shrink-0">
        <span className="text-white font-bold text-base font-headline">Instagram</span>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-white text-[20px]">favorite</span>
          <span className="material-symbols-outlined text-white text-[20px]">send</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Author row */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[1.5px] shrink-0">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <span className="text-[#d394ff] text-[11px] font-bold">
                {igAccountName ? igAccountName[0].toUpperCase() : 'I'}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-white flex-1">
            {igAccountName ?? 'your_account'}
          </span>
          <span className="text-[#0095f6] text-xs font-bold">Follow</span>
        </div>

        {/* Media carousel */}
        <div className="w-full aspect-square bg-[#201f1f] relative overflow-hidden">
          {count > 0 ? (
            <>
              <img
                key={current}
                src={mediaPreviews[current]}
                className="w-full h-full object-cover"
                alt=""
              />

              {/* Counter badge */}
              {count > 1 && (
                <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-0.5">
                  <span className="text-[10px] font-bold text-white">{current + 1}/{count}</span>
                </div>
              )}

              {/* Arrows */}
              {count > 1 && current > 0 && (
                <button
                  onClick={prev}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <span className="material-symbols-outlined text-white text-[16px]">chevron_left</span>
                </button>
              )}
              {count > 1 && current < count - 1 && (
                <button
                  onClick={next}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <span className="material-symbols-outlined text-white text-[16px]">chevron_right</span>
                </button>
              )}

              {/* Dot indicators */}
              {count > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {mediaPreviews.map((_, i) => (
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
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[#4c4450]">
              <span className="material-symbols-outlined text-[32px]">image</span>
              <span className="text-[9px] font-mono">No media</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center px-3 py-2.5">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-white text-[20px]">favorite</span>
            <span className="material-symbols-outlined text-white text-[20px]">mode_comment</span>
            <span className="material-symbols-outlined text-white text-[20px]">send</span>
          </div>
          <span className="material-symbols-outlined text-white text-[20px]">bookmark</span>
        </div>

        {/* Caption */}
        <div className="px-3 pb-4 space-y-1">
          <p className="text-[11px] font-bold text-white">1,248 likes</p>
          <p className="text-[11px] leading-relaxed text-white">
            <span className="font-bold">{igAccountName ?? 'your_account'} </span>
            <span className="text-[#cfc2d2]">{caption || 'Your caption will appear here...'}</span>
          </p>
          <p className="text-[9px] text-[#988d9c] uppercase font-medium">Just now</p>
        </div>
      </div>

      {/* Nav bar */}
      <div className="h-12 border-t border-[#353534] flex justify-around items-center bg-black shrink-0">
        {['home', 'search', 'add_box', 'video_library'].map(icon => (
          <span key={icon} className="material-symbols-outlined text-white text-[20px]">{icon}</span>
        ))}
        <div className="w-6 h-6 rounded-full bg-[#353534]" />
      </div>
    </div>
  );
}
