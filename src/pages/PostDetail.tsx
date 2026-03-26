import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import TopBar from '../components/layout/TopBar';

const METRICS = [
  { label: 'Total Likes',   value: '24,812', delta: '+12.4%', positive: true },
  { label: 'Comments',      value: '1,204',  delta: '+5.2%',  positive: true },
  { label: 'Shares',        value: '842',    delta: '-1.4%',  positive: false },
  { label: 'Reach',         value: '142,000',delta: '+18.9%', positive: true },
  { label: 'Impressions',   value: '208,412',delta: '+22.1%', positive: true },
  { label: 'Save Rate',     value: '4.2%',   delta: null,     positive: true },
];

const BENCHMARKS = [
  { label: 'Engagement Depth',    delta: '+34% vs Avg', color: 'text-[#d394ff]', barBg: 'bg-[#d394ff]/30', barFill: 'bg-[#d394ff]', pct: 75, extra: 25 },
  { label: 'Visibility Reach',    delta: '+12% vs Avg', color: 'text-[#c5d247]', barBg: 'bg-[#c5d247]/30', barFill: 'bg-[#c5d247]', pct: 67, extra: 12 },
  { label: 'Conversion Velocity', delta: '-5% vs Avg',  color: 'text-[#ffb4ab]', barBg: 'bg-[#ffb4ab]', barFill: '',              pct: 50, extra: 0 },
];

const COMMENTS = [
  { name: 'Julian Vance', time: '2 hours ago', likes: 12, text: 'The lighting on this is incredible. It feels so premium and the color palette is perfectly on-brand. Keep this aesthetic coming!', filled: true },
  { name: 'Elena Thorne', time: '4 hours ago', likes: 4,  text: "I'm curious about the specific techniques used for the obsidian textures here. Are you using Cinema4D or strictly digital painting?", filled: false },
  { name: 'Marcus King',  time: 'Yesterday',   likes: 32, text: 'This post single-handedly convinced me to subscribe to Obsidian Lens. The attention to visual detail is unparalleled in the social analytics space.', filled: true },
];

export default function PostDetail() {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image
      gsap.from('[data-post-img]', { scale: 1.04, opacity: 0, duration: 0.7, ease: 'power3.out' });

      // Metric cards
      gsap.from('[data-metric]', { y: 16, opacity: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out', delay: 0.2 });

      // Benchmark bars
      gsap.from('[data-bench-bar]', { scaleX: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.4, transformOrigin: 'left center' });

      // Sentiment ring
      const circle = document.querySelector<SVGCircleElement>('[data-sentiment-ring]');
      if (circle) {
        const dasharray = 364;
        const offset = 60;
        gsap.from(circle, { strokeDashoffset: dasharray, duration: 1.2, ease: 'power2.out', delay: 0.5 });
        gsap.set(circle, { strokeDasharray: dasharray, strokeDashoffset: offset });
      }

      // Comments
      gsap.from('[data-comment]', { y: 10, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 0.35 });
    }, pageRef.current!);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <TopBar
        title="Post Detail"
        subtitle="#88291"
        actions={
          <>
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-[#988d9c] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back
            </button>
            <button className="bg-[#e4b9ff] text-[#2f004d] px-5 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-transform">
              Export Report
            </button>
          </>
        }
      />

      <div className="p-10 max-w-7xl mx-auto space-y-10">
        {/* Top row */}
        <section className="grid grid-cols-12 gap-10">
          {/* Post Preview */}
          <div className="col-span-12 lg:col-span-5">
            <div className="glass-card rounded-3xl overflow-hidden border border-[#4c4450]/10 shadow-[0_0_40px_rgba(211,148,255,0.08)]">
              <div data-post-img className="relative aspect-[4/5] w-full">
                <img
                  src="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&q=80"
                  className="w-full h-full object-cover"
                  alt="Post preview"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                  <span className="material-symbols-outlined text-[#d394ff] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Published on Instagram</span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-[#d394ff]/70 uppercase tracking-widest bg-[#d394ff]/10 px-2 py-0.5 rounded">Photography</span>
                  <span className="text-[10px] font-mono text-[#988d9c]">Oct 24, 2023 • 10:42 AM</span>
                </div>
                <p className="text-[#cfc2d2] text-sm leading-relaxed">
                  Exploring the intersection of digital obsidian and organic violet flows. This series aims to capture the essence of "The Digital Curator." #ObsidianLens #CinematicUI #DesignSystems
                </p>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="col-span-12 lg:col-span-7 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {METRICS.map((m, i) => (
                <div key={m.label} data-metric className="bg-[#201f1f] rounded-2xl p-6 border border-[#4c4450]/5">
                  <div className="text-[10px] text-[#988d9c] uppercase tracking-widest mb-1">{m.label}</div>
                  <div className={`font-mono text-3xl font-bold tracking-tight ${i === 0 ? 'text-[#d394ff]' : 'text-white'}`}>{m.value}</div>
                  {m.delta && (
                    <div className={`mt-2 flex items-center gap-1 text-[10px] ${m.positive ? 'text-[#c5d247]' : 'text-[#ffb4ab]'}`}>
                      <span className="material-symbols-outlined text-[12px]">{m.positive ? 'trending_up' : 'trending_down'}</span>
                      {m.delta}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Benchmark */}
            <div className="bg-[#201f1f] rounded-3xl p-8 border border-[#4c4450]/10">
              <h3 className="font-headline font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d394ff]">equalizer</span>
                Performance Benchmark
              </h3>
              <div className="space-y-6">
                {BENCHMARKS.map((b) => (
                  <div key={b.label} className="space-y-2">
                    <div className="flex justify-between items-end text-[11px] font-mono">
                      <span className="text-[#988d9c] uppercase tracking-widest">{b.label}</span>
                      <span className={b.color}>{b.delta}</span>
                    </div>
                    <div className="h-2 w-full bg-[#353534] rounded-full overflow-hidden flex">
                      <div data-bench-bar className={`h-full ${b.barBg} rounded-full`} style={{ width: `${b.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sentiment + Visual Intelligence */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#201f1f] rounded-3xl p-8 border border-[#4c4450]/10 flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-[10px] text-[#988d9c] uppercase tracking-widest">Audience Sentiment</span>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-[#353534]" cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" />
                <circle
                  data-sentiment-ring
                  className="text-[#c5d247] drop-shadow-[0_0_8px_rgba(197,210,71,0.4)]"
                  cx="64" cy="64" r="58"
                  fill="transparent"
                  stroke="currentColor"
                  strokeDasharray="364"
                  strokeDashoffset="60"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-[#c5d247] text-[28px]">mood</span>
              </div>
            </div>
            <div className="px-6 py-2 rounded-full bg-[#c5d247]/10 border border-[#c5d247]/20 text-[#c5d247] text-sm font-bold">
              Positive (82%)
            </div>
            <p className="text-xs text-[#988d9c] leading-relaxed px-4">
              Audience response is overwhelmingly positive, focusing on the cinematic visual style.
            </p>
          </div>

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
                { label: 'Dominant Hue', content: <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-[#d394ff]"/><span className="font-mono text-sm">#D394FF</span></div> },
                { label: 'Subject Density', content: <div className="flex items-center gap-3"><span className="material-symbols-outlined text-[#d394ff] text-[16px]">lens</span><span className="font-mono text-sm">Centered / High Contrast</span></div> },
              ].map(({ label, content }) => (
                <div key={label} className="bg-[#1c1b1b] p-4 rounded-2xl border border-[#4c4450]/5">
                  <div className="text-[10px] text-[#988d9c] uppercase tracking-widest mb-2">{label}</div>
                  {content}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {['#EtherealViolets', '#Minimalism', '#HighGloss', '+4 more tags'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-[#353534] text-[10px] font-mono text-[#cfc2d2]">{tag}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Comments */}
        <section className="bg-[#201f1f] rounded-3xl border border-[#4c4450]/10 overflow-hidden">
          <div className="p-8 border-b border-[#4c4450]/5 flex justify-between items-center bg-[#2a2a2a]/20">
            <h3 className="font-headline font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d394ff]">forum</span>
              Recent Comments
            </h3>
            <span className="text-xs text-[#d394ff] font-bold cursor-pointer hover:underline">View All 1,204</span>
          </div>
          <div className="divide-y divide-[#4c4450]/5">
            {COMMENTS.map((c) => (
              <div key={c.name} data-comment className="p-8 flex gap-6 hover:bg-white/[0.02] transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#353534] flex items-center justify-center shrink-0 border border-[#4c4450]/20">
                  <span className="material-symbols-outlined text-[#988d9c] text-[18px]">person</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">{c.name}</h4>
                      <span className="text-[10px] text-[#988d9c] uppercase tracking-widest">{c.time}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-[10px] text-[#988d9c]">
                        <span className="material-symbols-outlined text-[14px]" style={c.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}>favorite</span>
                        {c.likes}
                      </div>
                      <button className="text-[#d394ff] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Reply</button>
                    </div>
                  </div>
                  <p className="text-sm text-[#cfc2d2] leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-[#0e0e0e]">
            <div className="flex items-center gap-4 bg-[#201f1f] rounded-2xl p-2 border border-[#4c4450]/10">
              <input className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 text-[#e5e2e1] placeholder:text-[#988d9c]/50" placeholder="Write a response..." />
              <button className="bg-[#d394ff] text-[#5e2388] w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
