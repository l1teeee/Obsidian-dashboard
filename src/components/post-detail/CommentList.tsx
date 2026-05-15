import type { PostComment } from '../../domain/entities/Post';

interface CommentListProps {
  comments:     PostComment[];
  commentsCount: string;
}

export default function CommentList({ comments, commentsCount }: CommentListProps) {
  return (
    <section className="bg-[#EFE9DC] rounded-3xl border border-[#15140F]/10 overflow-hidden">
      <div className="p-8 border-b border-[#15140F]/5 flex justify-between items-center bg-[#E7E0D0]/20">
        <h3 className="font-headline font-bold text-[#15140F] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#C8553A]">forum</span>
          Recent Comments
        </h3>
        <span className="text-xs text-[#C8553A] font-bold cursor-pointer hover:underline">
          View All {commentsCount}
        </span>
      </div>
      <div className="divide-y divide-[#15140F]/5">
        {comments.map((c) => (
          <div key={c.name} data-comment className="p-6 md:p-8 flex gap-4 md:gap-6 hover:bg-white/[0.02] transition-colors">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#D8D2C4] flex items-center justify-center shrink-0 border border-[#15140F]/20">
              <span className="material-symbols-outlined text-[#6B655B] text-[18px]">person</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-[#15140F]">{c.name}</h4>
                  <span className="text-[10px] text-[#6B655B] uppercase tracking-widest">{c.time}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-[10px] text-[#6B655B]">
                    <span
                      className="material-symbols-outlined text-[14px]"
                      style={c.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      favorite
                    </span>
                    {c.likes}
                  </div>
                  <button className="text-[#C8553A] text-[10px] font-bold uppercase tracking-widest hover:text-[#15140F] transition-colors">
                    Reply
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#3D3A30] leading-relaxed">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 bg-[#F6F2EA]">
        <div className="flex items-center gap-4 bg-[#EFE9DC] rounded-2xl p-2 border border-[#15140F]/10">
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 text-[#15140F] placeholder:text-[#6B655B]/50 outline-none"
            placeholder="Write a response..."
          />
          <button className="bg-[#C8553A] text-[#5e2388] w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition-transform shrink-0">
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>
    </section>
  );
}
