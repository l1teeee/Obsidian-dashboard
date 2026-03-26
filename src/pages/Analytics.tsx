import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import TopBar from '../components/layout/TopBar';

const BAR_HEIGHTS = [40, 65, 55, 85, 95, 45, 60];
const BAR_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const PLATFORM_BREAKDOWN = [
  { name: 'Instagram', handle: '@obsidian.lens', icon: 'camera', iconBg: 'from-yellow-400 via-red-500 to-purple-600', growth: '+842', reach: '1.2M', bar: 75 },
  { name: 'LinkedIn',  handle: 'Obsidian Lens Curator', icon: 'work', iconBg: 'bg-[#0077b5]', growth: '+1,204', reach: '842K', bar: 92 },
  { name: 'Facebook',  handle: 'Obsidian Official', icon: 'group', iconBg: 'bg-[#1877f2]', growth: '+156', reach: '310K', bar: 25 },
];

const TOP_POSTS = [
  { title: 'The Future of Digital Curation', postId: '92837', platform: 'camera', reach: '42.5K', likes: '3.2K', comments: '412', engagement: '8.4%', img: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=100&q=80' },
  { title: 'Workspace Optimization for Creative Pros', postId: '10423', platform: 'work', reach: '28.1K', likes: '1.8K', comments: '204', engagement: '7.2%', img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=100&q=80' },
  { title: 'Obsidian Lens v2.0 Release', postId: '88291', platform: 'camera', reach: '54.0K', likes: '4.1K', comments: '822', engagement: '9.1%', img: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=100&q=80' },
];

export default function Analytics() {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // KPI cards entrance
      gsap.from('[data-kpi]', { y: 20, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.1 });

      // Chart panels
      gsap.from('[data-chart]', { y: 24, opacity: 0, duration: 0.55, stagger: 0.12, ease: 'power3.out', delay: 0.2 });

      // Bar chart: animate bar heights from 0
      gsap.from('[data-bar]', {
        scaleY: 0,
        duration: 0.7,
        stagger: 0.05,
        ease: 'back.out(1.2)',
        delay: 0.35,
        transformOrigin: 'bottom center',
      });

      // SVG line draw
      const path = document.querySelector<SVGPathElement>('[data-line-path]');
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', delay: 0.4 });
      }

      // Platform breakdown
      gsap.from('[data-platform-stat]', { y: 16, opacity: 0, duration: 0.45, stagger: 0.1, ease: 'power2.out', delay: 0.3 });
      gsap.from('[data-stat-bar]', { scaleX: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.5, transformOrigin: 'left center' });

      // Table rows
      gsap.from('[data-table-row]', { y: 8, opacity: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out', delay: 0.4 });
    }, pageRef.current!);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <TopBar title="Analytics Dashboard" actions={
        <div className="flex items-center bg-[#1c1b1b] px-4 py-1.5 rounded-full border border-[#4c4450]/15 cursor-pointer hover:bg-[#201f1f] transition-colors gap-2">
          <span className="material-symbols-outlined text-[#e4b9ff] text-[16px]">calendar_today</span>
          <span className="text-xs font-medium text-[#cfc2d2]">Oct 12 – Nov 11, 2023</span>
          <span className="material-symbols-outlined text-[#988d9c] text-[16px]">expand_more</span>
        </div>
      } />

      <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Follower Growth', value: '42,891', badge: '+12.4%', badgeClass: 'bg-[#e4b9ff]/10 text-[#e4b9ff]', sub: '+4.2k this month' },
            { label: 'Avg. Engagement', value: '4.82%', badge: '+0.8%', badgeClass: 'bg-[#c5d247]/10 text-[#c5d247]', sub: 'v. 3.9% industry avg' },
            { label: 'Best Posting Time', value: '19:30', badge: null, badgeClass: '', sub: 'GMT +2 (Thursday)' },
          ].map((k) => (
            <div key={k.label} data-kpi className="glass-card p-6 rounded-3xl border border-[#4c4450]/5 shadow-[0_0_40px_rgba(211,148,255,0.08)]">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium text-[#988d9c] uppercase tracking-widest">{k.label}</span>
                {k.badge
                  ? <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${k.badgeClass}`}>{k.badge}</span>
                  : <span className="material-symbols-outlined text-[#e4b9ff] text-[18px]">schedule</span>
                }
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-headline font-bold tracking-tighter text-white">{k.value}</h2>
                <span className="text-xs font-mono text-[#988d9c]">{k.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line chart */}
          <div data-chart className="lg:col-span-2 glass-card p-8 rounded-3xl border border-[#4c4450]/5 shadow-[0_0_40px_rgba(211,148,255,0.08)]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-headline font-bold tracking-tight text-white">Reach & Impressions</h3>
                <p className="text-sm text-[#988d9c]">Aggregate visibility across all active platforms</p>
              </div>
              <div className="flex gap-4">
                {[['Reach', '#d394ff', ''], ['Impressions', '#d394ff40', 'opacity-60']].map(([l, c]) => (
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

          {/* Bar chart */}
          <div data-chart className="glass-card p-8 rounded-3xl border border-[#4c4450]/5">
            <div className="mb-8">
              <h3 className="text-xl font-headline font-bold tracking-tight text-white">Daily Engagement</h3>
              <p className="text-sm text-[#988d9c]">Weighted interaction score</p>
            </div>
            <div className="h-[280px] flex items-end justify-between gap-2 px-2">
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  data-bar
                  className="w-full rounded-t-lg transition-all hover:bg-[#d394ff] cursor-pointer"
                  style={{ height: `${h}%`, background: i === 4 ? '#d394ff' : 'rgba(211,148,255,0.2)' }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-mono text-[#988d9c] px-1">
              {BAR_DAYS.map((d, i) => <span key={i}>{d}</span>)}
            </div>
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLATFORM_BREAKDOWN.map((p) => (
            <div key={p.name} data-platform-stat className="glass-card p-6 rounded-3xl border border-[#4c4450]/5">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.name === 'Instagram' ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' : p.iconBg}`}>
                  <span className="material-symbols-outlined text-white text-[18px]">{p.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{p.name}</h4>
                  <p className="text-xs text-[#988d9c]">{p.handle}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-xs text-[#cfc2d2]">Follower Growth</span>
                  <span className="text-xs font-mono text-[#d394ff]">{p.growth}</span>
                </div>
                <div className="w-full h-1 bg-[#353534] rounded-full overflow-hidden">
                  <div data-stat-bar className="h-full bg-[#d394ff] rounded-full" style={{ width: `${p.bar}%` }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#cfc2d2]">Total Reach</span>
                  <span className="text-xs font-mono text-white">{p.reach}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Posts Table */}
        <div className="glass-card rounded-3xl overflow-hidden border border-[#4c4450]/5">
          <div className="p-8 border-b border-[#4c4450]/5 flex justify-between items-center">
            <h3 className="text-xl font-headline font-bold tracking-tight text-white">Top Performing Posts</h3>
            <Link to="/posts/88291" className="text-xs font-bold text-[#d394ff] flex items-center gap-1 hover:text-[#ebd6ff] transition-colors">
              View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#988d9c] uppercase text-[10px] tracking-widest bg-[#1c1b1b]/50">
                {['Content', 'Platform', 'Reach', 'Likes', 'Comments', 'Engagement'].map(h => (
                  <th key={h} className="px-8 py-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4c4450]/5">
              {TOP_POSTS.map((post) => (
                <tr key={post.postId} data-table-row className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => navigate('/posts/' + post.postId)}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#353534]">
                        <img src={post.img} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white truncate max-w-[220px] group-hover:text-[#d394ff] transition-colors">{post.title}</p>
                        <p className="text-xs text-[#988d9c] font-mono uppercase">POST_ID: {post.postId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5"><span className="material-symbols-outlined text-gray-400">{post.platform}</span></td>
                  <td className="px-8 py-5 font-mono text-sm text-white">{post.reach}</td>
                  <td className="px-8 py-5 font-mono text-sm text-white">{post.likes}</td>
                  <td className="px-8 py-5 font-mono text-sm text-white">{post.comments}</td>
                  <td className="px-8 py-5 text-right font-mono text-sm text-[#d394ff]">{post.engagement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
