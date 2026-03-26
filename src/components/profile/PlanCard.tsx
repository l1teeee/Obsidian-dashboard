export default function PlanCard() {
  return (
    <div data-section className="bg-[#201f1f] rounded-3xl border border-[#4c4450]/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#d394ff]/8 blur-[60px] rounded-full pointer-events-none" />
      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] text-[#988d9c] uppercase tracking-widest mb-1">Current Plan</p>
            <h3 className="font-headline text-xl font-extrabold text-white">Pro</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#d394ff]/15 border border-[#d394ff]/30 text-[#d394ff] text-[10px] font-bold uppercase tracking-wider">Active</span>
        </div>
        <div className="space-y-2 mb-5">
          {['Unlimited posts', '3 platforms', 'AI suggestions', 'Analytics export', 'Priority support'].map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-[#cfc2d2]">
              <span className="material-symbols-outlined text-[#d394ff] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              {f}
            </div>
          ))}
        </div>
        <div className="text-[10px] text-[#988d9c] mb-4">
          Renews <span className="text-white font-medium">Apr 25, 2026</span>
        </div>
        <button className="w-full py-2.5 rounded-xl bg-[#d394ff]/10 border border-[#d394ff]/30 text-[#d394ff] text-sm font-bold hover:bg-[#d394ff]/20 transition-all">
          Manage Billing
        </button>
      </div>
    </div>
  );
}
