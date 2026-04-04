import { useState } from 'react';
import TopBar from '../components/layout/TopBar';
import { usePlatforms, getTokenExpiryInfo } from '../hooks/usePlatforms';
import SocialBrandIcon from '../components/shared/SocialBrandIcon';
import AddPlatformModal from '../components/platforms/AddPlatformModal';
import { startFacebookOAuth } from '../services/platforms.service';

function getIconBg(platform: string): string {
  switch (platform) {
    case 'instagram': return 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]';
    case 'facebook':  return 'bg-[#1877F2]';
    default:          return 'bg-[#4c4450]';
  }
}

function getPlatformColor(platform: string): string {
  switch (platform) {
    case 'facebook':  return '#1877F2';
    case 'instagram': return '#bc1888';
    case 'linkedin':  return '#0A66C2';
    default:          return '#988d9c';
  }
}

function formatExpiry(expiresAt: string | null): string {
  if (!expiresAt) return 'Never expires';
  const d = new Date(expiresAt);
  return `Expires ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

export default function Platforms() {
  const {
    connections, loading, connecting, syncingIg, disconnecting,
    handleConnect, handleConnectInstagram, handleSyncInstagram, handleDisconnect, pageRef,
  } = usePlatforms();

  const hasInstagram = connections.some(c => c.platform === 'instagram');

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
                className="glass-card rounded-2xl p-5 border border-[#4c4450]/10 hover:border-[#d394ff]/30 transition-all duration-500 group relative overflow-hidden"
              >
                {/* Glow */}
                <div
                  className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-[48px] pointer-events-none opacity-20"
                  style={{ background: conn.platform === 'instagram' ? '#bc1888' : '#1877F2' }}
                />

                {/* Header row */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${getIconBg(conn.platform)} flex items-center justify-center shadow-md shrink-0`}>
                    <SocialBrandIcon platformId={conn.platform} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-headline text-base font-bold tracking-tight capitalize leading-none mb-1"
                      style={{ color: getPlatformColor(conn.platform) }}
                    >
                      {conn.platform}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                        style={{ color: getPlatformColor(conn.platform), backgroundColor: `${getPlatformColor(conn.platform)}18` }}
                      >
                        Connected
                      </span>
                      {conn.account_type && (() => {
                        const map: Record<string, { label: string; color: string; bg: string; warning?: string }> = {
                          BUSINESS:      { label: 'Business', color: '#4ade80', bg: '#4ade8018' },
                          MEDIA_CREATOR: { label: 'Creator',  color: '#60a5fa', bg: '#60a5fa18' },
                          PERSONAL:      { label: 'Personal', color: '#facc15', bg: '#facc1518',
                            warning: 'Publishing via API not available for personal accounts' },
                        };
                        const entry = map[conn.account_type!];
                        if (!entry) return null;
                        return (
                          <span
                            title={entry.warning}
                            className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider cursor-default"
                            style={{ color: entry.color, backgroundColor: entry.bg }}
                          >
                            {entry.warning && <span className="mr-0.5">⚠</span>}
                            {entry.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Permissions tooltip icon */}
                  {conn.scopes && (
                    <div className="relative group/perms shrink-0">
                      <button className="w-7 h-7 rounded-lg bg-[#4c4450]/10 hover:bg-[#4c4450]/25 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-[#988d9c] text-[14px]">shield</span>
                      </button>
                      <div className="absolute right-0 top-full mt-2 w-52 bg-[#1c1b1b] border border-[#4c4450]/30 rounded-xl p-3 shadow-xl z-10 hidden group-hover/perms:block">
                        <p className="text-[9px] uppercase tracking-widest font-bold text-[#988d9c] mb-2">Permissions</p>
                        <div className="flex flex-wrap gap-1">
                          {conn.scopes.split(',').map(scope => (
                            <span key={scope} className="px-2 py-0.5 rounded-full bg-[#4c4450]/20 text-[#cfc2d2] text-[10px]">
                              {scope.trim().replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Token expiry banner */}
                {(() => {
                  const expiry = getTokenExpiryInfo(conn.token_expires_at);
                  if (!expiry.isExpired && !expiry.isWarning) return null;

                  const isCrit = expiry.isCritical || expiry.isExpired;
                  const message = expiry.isExpired
                    ? 'Token expired — Reconnect required'
                    : `Token expires in ${expiry.daysLeft} day${expiry.daysLeft === 1 ? '' : 's'} — Reconnect ${isCrit ? 'now' : 'soon'}`;

                  return (
                    <div
                      className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 mb-4 border"
                      style={{
                        background:   isCrit ? 'rgba(255,75,75,0.08)'  : 'rgba(250,204,21,0.07)',
                        borderColor:  isCrit ? 'rgba(255,75,75,0.25)'  : 'rgba(250,204,21,0.25)',
                      }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="material-symbols-outlined text-[14px] shrink-0"
                          style={{ color: isCrit ? '#ff4b4b' : '#facc15' }}
                        >
                          {expiry.isExpired ? 'error' : 'warning'}
                        </span>
                        <p
                          className="text-[11px] font-medium truncate"
                          style={{ color: isCrit ? '#ff4b4b' : '#facc15' }}
                        >
                          {message}
                        </p>
                      </div>
                      <button
                        onClick={() => startFacebookOAuth()}
                        className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0 transition-colors"
                        style={{
                          color:           isCrit ? '#ff4b4b' : '#facc15',
                          background:      isCrit ? 'rgba(255,75,75,0.12)'  : 'rgba(250,204,21,0.12)',
                        }}
                      >
                        Reconnect
                      </button>
                    </div>
                  );
                })()}

                {/* Account info */}
                <div className="bg-[#1c1b1b] rounded-xl p-3 mb-4 space-y-2.5">
                  {/* Account row */}
                  <div className="flex items-center gap-2.5">
                    {conn.account_picture ? (
                      <img src={conn.account_picture} alt={conn.account_name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                        style={conn.platform === 'instagram'
                          ? { background: 'linear-gradient(to top right, #833ab4, #fd1d1d)' }
                          : { background: '#1877F2' }
                        }
                      >
                        {(conn.account_name?.[0] ?? conn.page_name?.[0] ?? '?').toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-[9px] uppercase tracking-widest font-bold text-[#4c4450] leading-none mb-0.5">Account</p>
                      <p className="text-sm font-semibold text-white truncate leading-none">{conn.account_name}</p>
                    </div>
                  </div>

                  {/* Page row */}
                  {conn.page_name && (
                    <div className="flex items-center gap-2.5 pt-2.5 border-t border-[#4c4450]/20">
                      <div className="w-8 h-8 rounded-full bg-[#4c4450]/15 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#988d9c] text-[14px]">
                          {conn.platform === 'instagram' ? 'link' : 'pages'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase tracking-widest font-bold text-[#4c4450] leading-none mb-0.5">
                          {conn.platform === 'instagram' ? 'Via Page' : 'Page'}
                        </p>
                        <p className="text-sm text-[#cfc2d2] truncate leading-none">{conn.page_name}</p>
                      </div>
                    </div>
                  )}

                  <p className="font-mono text-[9px] text-[#4c4450] pt-1">{formatExpiry(conn.token_expires_at)}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    disabled={disconnecting === conn.id}
                    onClick={() => handleDisconnect(conn.id, conn.account_name)}
                    className="flex-1 py-2.5 rounded-lg text-xs transition-all active:scale-[0.98] border border-[#4c4450]/30 text-[#988d9c] hover:bg-[#ffb4ab]/10 hover:border-[#ffb4ab]/20 hover:text-[#ffb4ab] disabled:opacity-50"
                  >
                    {disconnecting === conn.id ? 'Disconnecting…' : 'Disconnect'}
                  </button>

                  {conn.platform === 'facebook' && conn.page_id && !hasInstagram && (
                    <button
                      disabled={syncingIg}
                      onClick={handleSyncInstagram}
                      className="flex-1 py-2.5 rounded-lg text-xs transition-all active:scale-[0.98] border border-[#bc1888]/25 text-[#bc1888] hover:bg-[#bc1888]/10 hover:border-[#bc1888]/40 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {syncingIg ? (
                        <>
                          <span className="material-symbols-outlined text-[13px] animate-spin">progress_activity</span>
                          Syncing…
                        </>
                      ) : (
                        <>
                          <SocialBrandIcon platformId="instagram" size={13} />
                          Sync IG
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add Platform card */}
            <div
              data-add-card
              onClick={() => setModalOpen(true)}
              className="rounded-2xl p-5 border border-dashed border-[#4c4450]/20 flex items-center gap-3 group hover:border-[#d394ff]/40 hover:bg-[#d394ff]/5 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#201f1f] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <span className="material-symbols-outlined text-[#988d9c] group-hover:text-[#d394ff] text-[20px]">add</span>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Add Platform</h4>
                <p className="text-[#988d9c] text-[11px]">Facebook & Instagram</p>
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
        onConnectInstagram={() => { setModalOpen(false); handleConnectInstagram(); }}
      />
    </div>
  );
}
