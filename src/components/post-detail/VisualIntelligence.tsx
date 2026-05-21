interface VisualIntelligenceProps {
  tags: string[];
}

export default function VisualIntelligence({ tags }: VisualIntelligenceProps) {
  return (
    <div className="md:col-span-2 bg-[#F1F5F9] rounded-3xl p-8 border border-[#0F172A]/10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-headline font-bold text-[#0F172A]">Visual Intelligence</h3>
          <p className="text-xs text-[#64748B]">Lens AI Analysis of composition and color</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#E2E8F0] flex items-center justify-center border border-[#0F172A]/10">
          <span className="material-symbols-outlined text-[#111827] text-[14px]">auto_awesome</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          {
            label:   'Dominant Hue',
            content: (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#111827]" />
                <span className="font-mono text-sm text-[#0F172A]">#D394FF</span>
              </div>
            ),
          },
          {
            label:   'Subject Density',
            content: (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#111827] text-[16px]">lens</span>
                <span className="font-mono text-sm text-[#0F172A]">Centered / High Contrast</span>
              </div>
            ),
          },
        ].map(({ label, content }) => (
          <div key={label} className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#0F172A]/5">
            <div className="text-[10px] text-[#64748B] uppercase tracking-widest mb-2">{label}</div>
            {content}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="px-3 py-1 rounded-full bg-[#CBD5E1] text-[10px] font-mono text-[#334155]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
