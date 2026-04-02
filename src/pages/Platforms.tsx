import { useState } from 'react';
import TopBar from '../components/layout/TopBar';
import { usePlatforms } from '../hooks/usePlatforms';
import SocialBrandIcon from '../components/shared/SocialBrandIcon';
import AddPlatformModal from '../components/platforms/AddPlatformModal';

function getIconBg(platform: string): string {
  switch (platform) {
    case 'instagram': return 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]';
    case 'facebook':  return 'bg-[#1877F2]';
    default:          return 'bg-[#4c4450]';
  }
}

function formatExpiry(expiresAt: string | null): string {
  if (!expiresAt) return 'Never expires';
  const d = new Date(expiresAt);
  return `Expires ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

export default function Platforms() {
  const {
    connections, loading, connecting, disconnecting,
    handleConnect, handleDisconnect, pageRef,
  } = usePlatforms();

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col">
      <TopBar
        title="Platforms"
        subtitle="Connection Manager"
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#e4b9ff] hover:bg-[#e2b5ff] text-[#2f004d] px-4 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            Add New Connection
          </button>
        }
      />

      <main className="flex-1 p-10 bg-[#131313]" style={{ background: 'radial-gradient(circle at center, rgba(211,148,255,0.04) 0%, transparent 70%)' }}>

        {/* Header */}
        <header data-header-section className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d394ff]/10 border border-[#d394ff]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d394ff]" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#d394ff]">
              {connections.length > 0 ? `${connections.length} account${connections.length > 1 ? 's' : ''} connected` : 'No accounts connected'}
            </span>
          </div>
          <h2 className="font-headline text-5xl font-extrabold tracking-tighter text-white max-w-2xl leading-[1.1]">
            Bridge your digital <span className="text-[#d394ff]">ecosystem.</span>
          </h2>
          <p className="text-[#cfc2d2] max-w-lg text-lg leading-relaxed font-light">
            Connect your Facebook and Instagram accounts to publish directly from this dashboard.
          </p>
        </header>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="glass-card rounded-3xl p-8 border border-[#4c4450]/10 animate-pulse min-h-[280px]" />
            ))}
          </div>
        )}

        {/* Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {connections.map((conn) => (
              <div
                key={conn.id}
                data-platform-card
                className="glass-card rounded-3xl p-8 border border-[#4c4450]/10 hover:border-[#d394ff]/30 transition-all duration-500 group relative overflow-hidden"
              >
                {/* Glow */}
                <div
                  className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] transition-colors pointer-events-none opacity-30"
                  style={{ background: conn.platform === 'instagram' ? '#bc1888' : '#1877F2' }}
                />

                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${getIconBg(conn.platform)} flex items-center justify-center shadow-lg shrink-0`}>
                      <SocialBrandIcon platformId={conn.platform} size={28} />
                    </div>
                    <div>
                      <h3 className="font-headline text-xl font-bold text-white tracking-tight capitalize">
                        {conn.platform}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400">
                        Connected
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account info */}
                <div className="flex items-center gap-3 p-4 bg-[#1c1b1b] rounded-2xl mb-6">
                  {conn.account_picture ? (
                    <img src={conn.account_picture} alt={conn.account_name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#988d9c] text-[16px]">person</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{conn.account_name}</p>
                    {conn.page_name && conn.platform === 'facebook' && (
                      <p className="text-[10px] text-[#988d9c] truncate">Page: {conn.page_name}</p>
                    )}
                    <p className="font-mono text-[10px] text-[#988d9c]">{formatExpiry(conn.token_expires_at)}</p>
                  </div>
                </div>

                {/* Scopes */}
                {conn.scopes && (
                  <div className="space-y-2 mb-8">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#988d9c]">Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {conn.scopes.split(',').map(scope => (
                        <span key={scope} className="px-3 py-1 rounded-full bg-[#4c4450]/10 text-[#cfc2d2] text-[11px]">
                          {scope.trim().replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  disabled={disconnecting === conn.id}
                  onClick={() => handleDisconnect(conn.id, conn.account_name)}
                  className="w-full py-4 rounded-xl text-sm transition-all active:scale-[0.98] border border-[#4c4450]/30 text-[#e5e2e1] hover:bg-[#ffb4ab]/10 hover:border-[#ffb4ab]/20 hover:text-[#ffb4ab] disabled:opacity-50"
                >
                  {disconnecting === conn.id ? 'Disconnecting…' : 'Disconnect'}
                </button>
              </div>
            ))}

            {/* Add Platform card */}
            <div
              data-add-card
              onClick={() => setModalOpen(true)}
              className="rounded-3xl p-8 border-2 border-dashed border-[#4c4450]/20 flex flex-col items-center justify-center text-center gap-4 group hover:border-[#d394ff]/40 hover:bg-[#d394ff]/5 transition-all cursor-pointer min-h-[280px]"
            >
              <div className="w-16 h-16 rounded-full bg-[#201f1f] flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[#988d9c] group-hover:text-[#d394ff] text-[28px]">add</span>
              </div>
              <div>
                <h4 className="text-white font-bold">Add Platform</h4>
                <p className="text-[#988d9c] text-xs mt-1">Facebook & Instagram</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && connections.length === 0 && (
          <p className="text-center text-[#988d9c] text-sm mt-4">
            No accounts connected yet. Click <span className="text-[#d394ff]">Add New Connection</span> to get started.
          </p>
        )}
      </main>

      <AddPlatformModal
        open={modalOpen}
        connectedPlatforms={connections.map(c => c.platform)}
        connecting={connecting}
        onClose={() => setModalOpen(false)}
        onConnect={(p) => { setModalOpen(false); handleConnect(p); }}
      />
    </div>
  );
}
