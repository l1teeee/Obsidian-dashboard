export default function SentimentRing() {
  return (
    <div className="bg-[#EFE9DC] rounded-3xl p-8 border border-[#15140F]/10 flex flex-col items-center justify-center text-center space-y-4">
      <span className="text-[10px] text-[#6B655B] uppercase tracking-widest">Audience Sentiment</span>
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64" cy="64" r="58"
            fill="transparent"
            stroke="#D8D2C4"
            strokeWidth="8"
          />
          <circle
            data-sentiment-ring
            cx="64" cy="64" r="58"
            fill="transparent"
            stroke="#4F7A4A"
            strokeDasharray="364"
            strokeDashoffset="60"
            strokeWidth="8"
            className="drop-shadow-[0_0_8px_rgba(197,210,71,0.4)]"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-[#4F7A4A] text-[28px]">mood</span>
        </div>
      </div>
      <div className="px-6 py-2 rounded-full bg-[#4F7A4A]/10 border border-[#4F7A4A]/20 text-[#4F7A4A] text-sm font-bold">
        Positive (82%)
      </div>
      <p className="text-xs text-[#6B655B] leading-relaxed px-4">
        Audience response is overwhelmingly positive, focusing on the cinematic visual style.
      </p>
    </div>
  );
}
