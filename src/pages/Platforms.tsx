import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import TopBar from '../components/layout/TopBar';

const PLATFORMS = [
  {
    name: 'Instagram',
    icon: 'photo_camera',
    iconBg: 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]',
    status: 'Connected',
    statusClass: 'bg-green-500/10 text-green-400',
    user: '@alex_creative_lens',
    syncInfo: 'Last Sync: 12m ago',
    userOpacity: '',
    permissions: ['Media Insights', 'Direct Messages', 'Story Analytics'],
    btnLabel: 'Disconnect Platform',
    btnClass: 'border border-[#4c4450]/30 text-[#e5e2e1] hover:bg-[#ffb4ab]/10 hover:border-[#ffb4ab]/20 hover:text-[#ffb4ab]',
    accentColor: '#d394ff',
  },
  {
    name: 'LinkedIn',
    icon: 'work',
    iconBg: 'bg-[#0077b5]',
    status: 'Needs Re-auth',
    statusClass: 'bg-yellow-500/10 text-yellow-400',
    user: 'Alex Rivera',
    syncInfo: 'Disconnected: 48h ago',
    userOpacity: 'opacity-60',
    permissions: ['Profile Feed', 'Network Stats'],
    btnLabel: 'Reconnect Now',
    btnClass: 'bg-[#d394ff] text-[#5e2388] font-bold hover:brightness-110 shadow-lg shadow-[#d394ff]/10',
    accentColor: '#0077b5',
  },
  {
    name: 'Facebook',
    icon: 'groups',
    iconBg: 'bg-[#1877f2]',
    status: 'Connected',
    statusClass: 'bg-green-500/10 text-green-400',
    user: 'Obsidian Studios Page',
    syncInfo: 'Last Sync: 4m ago',
    userOpacity: '',
    permissions: ['Ads Manager', 'Public Content', 'Engagement'],
    btnLabel: 'Disconnect Platform',
    btnClass: 'border border-[#4c4450]/30 text-[#e5e2e1] hover:bg-[#ffb4ab]/10 hover:border-[#ffb4ab]/20 hover:text-[#ffb4ab]',
    accentColor: '#1877f2',
  },
];

export default function Platforms() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-header-section]', { y: 20, opacity: 0, duration: 0.55, ease: 'power3.out' });
      gsap.from('[data-platform-card]', {
        scale: 0.96, opacity: 0, y: 20, duration: 0.5, stagger: 0.12, ease: 'back.out(1.4)', delay: 0.15,
      });
      gsap.from('[data-add-card]', { scale: 0.95, opacity: 0, duration: 0.4, ease: 'back.out(1.2)', delay: 0.5 });
      gsap.from('[data-status-bar]', { y: 12, opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.55 });
    }, pageRef.current!);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <TopBar title="Platforms" subtitle="Connection Manager" actions={
        <button className="bg-[#e4b9ff] hover:bg-[#e2b5ff] text-[#2f004d] px-4 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95">
          Add New Connection
        </button>
      } />

      <main className="p-10 bg-[#131313]" style={{ background: 'radial-gradient(circle at center, rgba(211,148,255,0.04) 0%, transparent 70%)' }}>
        {/* Header */}
        <header data-header-section className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d394ff]/10 border border-[#d394ff]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d394ff]" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#d394ff]">Real-time Sync Active</span>
          </div>
          <h2 className="font-headline text-5xl font-extrabold tracking-tighter text-white max-w-2xl leading-[1.1]">
            Bridge your digital <span className="text-[#d394ff]">ecosystem.</span>
          </h2>
          <p className="text-[#cfc2d2] max-w-lg text-lg leading-relaxed font-light">
            Manage all your professional social identities from a single glass-paned interface.
            Experience seamless metadata synchronization.
          </p>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLATFORMS.map((p) => (
            <div
              key={p.name}
              data-platform-card
              className="glass-card rounded-3xl p-8 border border-[#4c4450]/10 hover:border-[#d394ff]/30 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] transition-colors" style={{ background: `${p.accentColor}0d` }} />

              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${p.iconBg} flex items-center justify-center text-white shadow-lg`}>
                    <span className="material-symbols-outlined text-[28px]">{p.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-bold text-white tracking-tight">{p.name}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${p.statusClass}`}>{p.status}</span>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full border border-[#4c4450]/20 flex items-center justify-center hover:bg-[#2a2a2a] transition-colors">
                  <span className="material-symbols-outlined text-[#988d9c] text-[18px]">more_vert</span>
                </button>
              </div>

              <div className={`flex items-center gap-3 p-4 bg-[#1c1b1b] rounded-2xl mb-8 ${p.userOpacity}`}>
                <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#988d9c] text-[16px]">person</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{p.user}</p>
                  <p className="font-mono text-[10px] text-[#988d9c]">{p.syncInfo}</p>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#988d9c]">Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {p.permissions.map((perm) => (
                    <span key={perm} className="px-3 py-1 rounded-full bg-[#4c4450]/10 text-[#cfc2d2] text-[11px]">{perm}</span>
                  ))}
                </div>
              </div>

              <button className={`w-full py-4 rounded-xl text-sm transition-all active:scale-[0.98] ${p.btnClass}`}>
                {p.btnLabel}
              </button>
            </div>
          ))}

          {/* Add Platform */}
          <div
            data-add-card
            className="rounded-3xl p-8 border-2 border-dashed border-[#4c4450]/20 flex flex-col items-center justify-center text-center gap-4 group hover:border-[#d394ff]/40 hover:bg-[#d394ff]/5 transition-all cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-[#201f1f] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#988d9c] group-hover:text-[#d394ff] text-[28px]">add</span>
            </div>
            <div>
              <h4 className="text-white font-bold">Add Platform</h4>
              <p className="text-[#988d9c] text-xs mt-1">TikTok, Twitter, or Pinterest</p>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <footer data-status-bar className="mt-20 flex items-center justify-between p-6 bg-[#1c1b1b]/50 rounded-2xl border border-[#4c4450]/10 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-[#cfc2d2] font-medium">Sync Engine: Healthy</span>
            </div>
            <div className="flex items-center gap-2 border-l border-[#4c4450]/20 pl-6">
              <span className="material-symbols-outlined text-[#988d9c] text-[16px]">schedule</span>
              <span className="text-xs text-[#988d9c] font-mono">Next automated sync in 14:02</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-[10px] text-[#988d9c] uppercase tracking-widest font-bold">Obsidian Engine v2.4.0</p>
            <span className="material-symbols-outlined text-[#988d9c] text-[16px] cursor-pointer hover:text-white transition-colors">info</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
