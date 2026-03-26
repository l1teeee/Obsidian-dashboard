interface VisualIntelligenceProps {
  tags: string[];
}

export default function VisualIntelligence({ tags }: VisualIntelligenceProps) {
  return (
    <div className="md:col-span-2 bg-[#201f1f] rounded-3xl p-8 border border-[#4c4450]/10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-headline font-bold text-white">Visual Intelligence</h3>
          <p className="text-xs text-[#988d9c]">Lens AI Analysis of composition and color</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center border border-[#4c4450]/10">
          <span className="material-symbols-outlined text-[#d394ff] text-[14px]">auto_awesome</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          {
            label:   'Dominant Hue',
            content: (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#d394ff]" />
                <span className="font-mono text-sm text-white">#D394FF</span>
              </div>
            ),
          },
          {
            label:   'Subject Density',
            content: (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#d394ff] text-[16px]">lens</span>
                <span className="font-mono text-sm text-white">Centered / High Contrast</span>
              </div>
            ),
          },
        ].map(({ label, content }) => (
          <div key={label} className="bg-[#1c1b1b] p-4 rounded-2xl border border-[#4c4450]/5">
            <div className="text-[10px] text-[#988d9c] uppercase tracking-widest mb-2">{label}</div>
            {content}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="px-3 py-1 rounded-full bg-[#353534] text-[10px] font-mono text-[#cfc2d2]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
