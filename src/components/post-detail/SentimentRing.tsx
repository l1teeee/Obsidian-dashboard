export default function SentimentRing() {
  return (
    <div className="bg-[#F1F5F9] rounded-3xl p-8 border border-[#0F172A]/10 flex flex-col items-center justify-center text-center space-y-4">
      <span className="text-[10px] text-[#64748B] uppercase tracking-widest">Audience Sentiment</span>
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64" cy="64" r="58"
            fill="transparent"
            stroke="#CBD5E1"
            strokeWidth="8"
          />
          <circle
            data-sentiment-ring
            cx="64" cy="64" r="58"
            fill="transparent"
            stroke="#047857"
            strokeDasharray="364"
            strokeDashoffset="60"
            strokeWidth="8"
            className="drop-shadow-[0_0_8px_rgba(197,210,71,0.4)]"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-[#047857] text-[28px]">mood</span>
        </div>
      </div>
      <div className="px-6 py-2 rounded-full bg-[#047857]/10 border border-[#047857]/20 text-[#047857] text-sm font-bold">
        Positive (82%)
      </div>
      <p className="text-xs text-[#64748B] leading-relaxed px-4">
        Audience response is overwhelmingly positive, focusing on the cinematic visual style.
      </p>
    </div>
  );
}
