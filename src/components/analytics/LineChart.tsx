export default function LineChart() {
  return (
    <div data-chart className="lg:col-span-2 glass-card p-8 rounded-3xl border border-[#4c4450]/5 shadow-[0_0_40px_rgba(211,148,255,0.08)]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-headline font-bold tracking-tight text-white">Reach & Impressions</h3>
          <p className="text-sm text-[#988d9c]">Aggregate visibility across all active platforms</p>
        </div>
        <div className="flex gap-4">
          {[['Reach', '#d394ff'], ['Impressions', '#d394ff40']].map(([l, c]) => (
            <div key={l} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: c }} />
              <span className="text-xs font-mono text-[#e5e2e1]">{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[280px] w-full relative flex items-end overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
          {[0,1,2,3,4].map(i => <div key={i} className="border-t border-white/5 w-full" />)}
        </div>
        {/* SVG */}
        <svg className="absolute bottom-0 left-0 w-full h-[85%] overflow-visible" viewBox="0 0 1000 300">
          <defs>
            <linearGradient id="purpleGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#d394ff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#d394ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            data-line-path
            d="M0,250 Q100,200 200,220 T400,100 T600,150 T800,50 T1000,80"
            fill="transparent"
            stroke="#d394ff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M0,250 Q100,200 200,220 T400,100 T600,150 T800,50 T1000,80 V300 H0 Z"
            fill="url(#purpleGrad)"
          />
          <path
            d="M0,280 Q150,230 300,260 T500,180 T750,220 T1000,140"
            fill="transparent"
            stroke="#d394ff"
            strokeDasharray="8 4"
            strokeOpacity="0.4"
            strokeWidth="2"
          />
        </svg>
        {/* X axis */}
        <div className="absolute -bottom-6 w-full flex justify-between px-2 text-[10px] font-mono text-[#988d9c]">
          {['12 OCT','19 OCT','26 OCT','02 NOV','09 NOV'].map(d => <span key={d}>{d}</span>)}
        </div>
      </div>
    </div>
  );
}
