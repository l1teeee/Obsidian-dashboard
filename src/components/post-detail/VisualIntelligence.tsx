interface VisualIntelligenceProps {
  tags: string[];
}

export default function VisualIntelligence({ tags }: VisualIntelligenceProps) {
  return (
    <div className="md:col-span-2 bg-[#EFE9DC] rounded-3xl p-8 border border-[#15140F]/10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-headline font-bold text-[#15140F]">Visual Intelligence</h3>
          <p className="text-xs text-[#6B655B]">Lens AI Analysis of composition and color</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#E7E0D0] flex items-center justify-center border border-[#15140F]/10">
          <span className="material-symbols-outlined text-[#C8553A] text-[14px]">auto_awesome</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          {
            label:   'Dominant Hue',
            content: (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#C8553A]" />
                <span className="font-mono text-sm text-[#15140F]">#D394FF</span>
              </div>
            ),
          },
          {
            label:   'Subject Density',
            content: (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#C8553A] text-[16px]">lens</span>
                <span className="font-mono text-sm text-[#15140F]">Centered / High Contrast</span>
              </div>
            ),
          },
        ].map(({ label, content }) => (
          <div key={label} className="bg-[#FBF8F2] p-4 rounded-2xl border border-[#15140F]/5">
            <div className="text-[10px] text-[#6B655B] uppercase tracking-widest mb-2">{label}</div>
            {content}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="px-3 py-1 rounded-full bg-[#D8D2C4] text-[10px] font-mono text-[#3D3A30]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
