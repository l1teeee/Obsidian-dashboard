import { useState, useRef } from 'react';
import TopBar from '../components/layout/TopBar';
import { usePlatforms, getTokenExpiryInfo } from '../hooks/usePlatforms';
import SocialBrandIcon from '../components/shared/SocialBrandIcon';
import AddPlatformModal from '../components/platforms/AddPlatformModal';
import type { SocialConnection } from '../types/platforms.types';

function getIconBg(platform: string): string {
  switch (platform) {
    case 'instagram': return 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]';
    case 'facebook':  return 'bg-[#1877F2]';
    default:          return 'bg-[#1C1814]';
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

interface ConnectionCardProps {
  conn:            SocialConnection;
  disconnecting:   string | null;
  syncingIg:       boolean;
  selectingPage:   boolean;
  hasInstagram:    boolean;
  onDisconnect:    (id: string, name: string) => void;
  onSyncInstagram: () => void;
  onReconnect:     () => void;
  onSetupPage:     (conn: SocialConnection) => void;
}

function ConnectionCard({ conn, disconnecting, syncingIg, selectingPage, hasInstagram, onDisconnect, onSyncInstagram, onReconnect, onSetupPage }: ConnectionCardProps) {
  return (
    <div
      data-platform-card
      className="glass-card rounded-2xl p-5 border border-[#1C1814]/10 hover:border-[#7DD3C7]/30 transition-all duration-500 group relative overflow-hidden"
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
            {conn.page_name || conn.account_name}
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
            <button className="w-7 h-7 rounded-lg bg-[#1C1814]/10 hover:bg-[#1C1814]/25 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[#6A6470] text-[14px]">shield</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-52 bg-[#FAF7F2] border border-[#1C1814]/30 rounded-xl p-3 shadow-xl z-10 hidden group-hover/perms:block">
              <p className="text-[9px] uppercase tracking-widest font-bold text-[#6A6470] mb-2">Permissions</p>
              <div className="flex flex-wrap gap-1">
                {conn.scopes.split(',').map(scope => (
                  <span key={scope} className="px-2 py-0.5 rounded-full bg-[#1C1814]/20 text-[#5C5650] text-[10px]">
                    {scope.trim().replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* No page linked banner */}
      {conn.platform === 'facebook' && !conn.page_id && (
        <div className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 mb-4 border border-[#facc15]/25" style={{ background: 'rgba(250,204,21,0.07)' }}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[14px] text-[#facc15] shrink-0">warning</span>
            <p className="text-[11px] font-medium text-[#facc15] truncate">No Facebook Page linked yet</p>
          </div>
          <button
            onClick={() => onSetupPage(conn)}
            disabled={selectingPage}
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0 text-[#facc15] bg-[#facc15]/12 hover:bg-[#facc15]/20 transition-colors disabled:opacity-50"
          >
            Setup Page
          </button>
        </div>
      )}

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
              background:  isCrit ? 'rgba(255,75,75,0.08)'  : 'rgba(250,204,21,0.07)',
              borderColor: isCrit ? 'rgba(255,75,75,0.25)'  : 'rgba(250,204,21,0.25)',
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
              onClick={() => onReconnect()}
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0 transition-colors"
              style={{
                color:      isCrit ? '#ff4b4b' : '#facc15',
                background: isCrit ? 'rgba(255,75,75,0.12)' : 'rgba(250,204,21,0.12)',
              }}
            >
              Reconnect
            </button>
          </div>
        );
      })()}

      {/* Account info */}
      <div className="bg-[#FAF7F2] rounded-xl p-3 mb-4 space-y-2.5">
        <div className="flex items-center gap-2.5">
          {conn.account_picture ? (
            <img src={conn.account_picture} alt={conn.account_name} className="w-8 h-8 rounded-full object-cover shrink-0" />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[#1C1814] text-xs font-bold"
              style={conn.platform === 'instagram'
                ? { background: 'linear-gradient(to top right, #833ab4, #fd1d1d)' }
                : { background: '#1877F2' }
              }
            >
              {(conn.account_name?.[0] ?? conn.page_name?.[0] ?? '?').toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-widest font-bold text-[#1C1814] leading-none mb-0.5">Account</p>
            <p className="text-sm font-semibold text-[#1C1814] truncate leading-none">{conn.account_name}</p>
          </div>
        </div>

        {conn.page_name && (
          <div className="flex items-center gap-2.5 pt-2.5 border-t border-[#1C1814]/20">
            <div className="w-8 h-8 rounded-full bg-[#1C1814]/15 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#6A6470] text-[14px]">
                {conn.platform === 'instagram' ? 'link' : 'pages'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-widest font-bold text-[#1C1814] leading-none mb-0.5">
                {conn.platform === 'instagram' ? 'Via Page' : 'Page'}
              </p>
              <p className="text-sm text-[#5C5650] truncate leading-none">{conn.page_name}</p>
            </div>
          </div>
        )}

        <p className="font-mono text-[9px] text-[#1C1814] pt-1">{formatExpiry(conn.token_expires_at)}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          disabled={disconnecting === conn.id}
          onClick={() => onDisconnect(conn.id, conn.account_name)}
          className="flex-1 py-2.5 rounded-lg text-xs transition-all active:scale-[0.98] border border-[#1C1814]/30 text-[#6A6470] hover:bg-[#ffb4ab]/10 hover:border-[#ffb4ab]/20 hover:text-[#ffb4ab] disabled:opacity-50"
        >
          {disconnecting === conn.id ? 'Disconnecting…' : 'Disconnect'}
        </button>

        {conn.platform === 'facebook' && conn.page_id && !hasInstagram && (
          <button
            disabled={syncingIg}
            onClick={onSyncInstagram}
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
  );
}

export default function Platforms() {
  const {
    connections, loading, connecting, syncingIg, disconnecting, selectingPage,
    handleConnect, handleConnectInstagramDirect, handleSyncInstagram, handleDisconnect, handleSelectPage, pageRef,
  } = usePlatforms();

  const hasInstagram  = connections.some(c => c.platform === 'instagram');
  const fbConnections = connections.filter(c => c.platform === 'facebook');
  const igConnections = connections.filter(c => c.platform === 'instagram');
  const otherConns    = connections.filter(c => c.platform !== 'facebook' && c.platform !== 'instagram');

  const [modalOpen,        setModalOpen]        = useState(false);
  const [pageSetupConn,    setPageSetupConn]    = useState<SocialConnection | null>(null);
  const [pageIdInput,      setPageIdInput]      = useState('');
  const pageIdInputRef = useRef<HTMLInputElement>(null);

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col">

      {/* OAuth connecting / syncing overlay */}
      {(connecting || (loading && new URLSearchParams(window.location.search).get('connected') === 'success')) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F4F0E8]/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-5 px-8 py-10 rounded-3xl border border-[#1C1814]/20 bg-[#FAF7F2]/90 shadow-2xl max-w-xs w-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1877F2] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#1C1814] text-[28px] animate-spin">progress_activity</span>
            </div>
            <div>
              <p className="font-headline text-base font-bold text-[#1C1814] mb-1">
                {connecting ? 'Redirecting to Facebook…' : 'Saving your connection…'}
              </p>
              <p className="text-[#6A6470] text-xs leading-relaxed">
                {connecting
                  ? 'Complete the authorization on Facebook and you\'ll be brought back here.'
                  : 'Fetching your pages and updating your account.'}
              </p>
            </div>
          </div>
        </div>
      )}

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

      <main className="flex-1 p-10 bg-[#131313]" style={{ background: 'radial-gradient(circle at center, rgba(125,211,199,0.04) 0%, transparent 70%)' }}>

        {/* Header */}
        <header data-header-section className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7DD3C7]/10 border border-[#7DD3C7]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3C7]" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#7DD3C7]">
              {connections.length > 0 ? `${connections.length} account${connections.length > 1 ? 's' : ''} connected` : 'No accounts connected'}
            </span>
          </div>
          <h2 className="font-headline text-5xl font-extrabold tracking-tighter text-[#1C1814] max-w-2xl leading-[1.1]">
            Bridge your digital <span className="text-[#7DD3C7]">ecosystem.</span>
          </h2>
          <p className="text-[#5C5650] max-w-lg text-lg leading-relaxed font-light">
            Connect your Facebook and Instagram accounts to publish directly from this dashboard.
          </p>
        </header>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="glass-card rounded-3xl p-8 border border-[#1C1814]/10 animate-pulse min-h-[280px]" />
            ))}
          </div>
        )}

        {/* Cards */}
        {!loading && (
          <div className="space-y-10">

            {/* ── Facebook section ─────────────────────────────────────────── */}
            {fbConnections.length > 0 && (
              <div>
                {fbConnections.length > 1 && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-[#1877F2] flex items-center justify-center shrink-0">
                      <SocialBrandIcon platformId="facebook" size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1C1814] leading-none">Facebook Pages</h3>
                      <p className="text-[10px] text-[#6A6470] mt-0.5">{fbConnections.length} pages connected</p>
                    </div>
                    <div className="flex-1 h-px bg-[#1877F2]/15 ml-2" />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {fbConnections.map(conn => (
                    <ConnectionCard
                      key={conn.id}
                      conn={conn}
                      disconnecting={disconnecting}
                      syncingIg={syncingIg}
                      selectingPage={selectingPage}
                      hasInstagram={hasInstagram}
                      onDisconnect={handleDisconnect}
                      onSyncInstagram={handleSyncInstagram}
                      onReconnect={() => handleConnect('facebook')}
                      onSetupPage={(c) => { setPageSetupConn(c); setPageIdInput(''); }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Instagram section ─────────────────────────────────────────── */}
            {igConnections.length > 0 && (
              <div>
                {igConnections.length > 1 && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center shrink-0">
                      <SocialBrandIcon platformId="instagram" size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1C1814] leading-none">Instagram Accounts</h3>
                      <p className="text-[10px] text-[#6A6470] mt-0.5">{igConnections.length} accounts connected</p>
                    </div>
                    <div className="flex-1 h-px bg-[#bc1888]/15 ml-2" />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {igConnections.map(conn => (
                    <ConnectionCard
                      key={conn.id}
                      conn={conn}
                      disconnecting={disconnecting}
                      syncingIg={syncingIg}
                      selectingPage={selectingPage}
                      hasInstagram={hasInstagram}
                      onDisconnect={handleDisconnect}
                      onSyncInstagram={handleSyncInstagram}
                      onReconnect={() => handleConnect('facebook')}
                      onSetupPage={(c) => { setPageSetupConn(c); setPageIdInput(''); }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Other connections + Add card ─────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {otherConns.map(conn => (
                <ConnectionCard
                  key={conn.id}
                  conn={conn}
                  disconnecting={disconnecting}
                  syncingIg={syncingIg}
                  selectingPage={selectingPage}
                  hasInstagram={hasInstagram}
                  onDisconnect={handleDisconnect}
                  onSyncInstagram={handleSyncInstagram}
                  onReconnect={() => handleConnect('facebook')}
                  onSetupPage={(c) => { setPageSetupConn(c); setPageIdInput(''); }}
                />
              ))}

              {/* Add Platform card */}
              <div
                data-add-card
                onClick={() => setModalOpen(true)}
                className="rounded-2xl p-5 border border-dashed border-[#1C1814]/20 flex items-center gap-3 group hover:border-[#7DD3C7]/40 hover:bg-[#7DD3C7]/5 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F0EBE2] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <span className="material-symbols-outlined text-[#6A6470] group-hover:text-[#7DD3C7] text-[20px]">add</span>
                </div>
                <div>
                  <h4 className="text-[#1C1814] font-semibold text-sm">Add Platform</h4>
                  <p className="text-[#6A6470] text-[11px]">Facebook & Instagram</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Empty state */}
        {!loading && connections.length === 0 && (
          <p className="text-center text-[#6A6470] text-sm mt-4">
            No accounts connected yet. Click <span className="text-[#7DD3C7]">Add New Connection</span> to get started.
          </p>
        )}
      </main>

      <AddPlatformModal
        open={modalOpen}
        connectedPlatforms={connections.map(c => c.platform)}
        connecting={connecting}
        onClose={() => setModalOpen(false)}
        onConnect={(p) => { setModalOpen(false); handleConnect(p); }}
        onConnectInstagramDirect={() => { setModalOpen(false); handleConnectInstagramDirect(); }}
      />

      {/* ── Facebook Page Setup Modal ─────────────────────────────────────────── */}
      {pageSetupConn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FAF7F2] border border-[#1C1814]/30 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-[#1C1814]/10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/20 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2]" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#1877F2]">Facebook Page</span>
                  </div>
                  <h2 className="font-headline text-2xl font-extrabold tracking-tight text-[#1C1814]">Link your Page</h2>
                  <p className="text-[#6A6470] text-sm mt-1">Enter your Facebook Page ID to complete the connection.</p>
                </div>
                <button
                  onClick={() => setPageSetupConn(null)}
                  className="w-9 h-9 rounded-full border border-[#1C1814]/20 flex items-center justify-center hover:bg-[#E5DFD6] transition-colors shrink-0 mt-1"
                >
                  <span className="material-symbols-outlined text-[#6A6470] text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-6 space-y-4">
              <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#1C1814]/10">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#1C1814] mb-2">Where to find your Page ID</p>
                <p className="text-xs text-[#6A6470] leading-relaxed">
                  Go to your Facebook Page, click <span className="text-[#1C1814] font-medium">About</span>, scroll to
                  <span className="text-[#1C1814] font-medium"> Page transparency</span>, and copy the numeric Page ID.
                  It looks like: <span className="font-mono text-[#7DD3C7]">123456789012345</span>
                </p>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#6A6470] block mb-2">
                  Facebook Page ID
                </label>
                <input
                  ref={pageIdInputRef}
                  type="text"
                  value={pageIdInput}
                  onChange={e => setPageIdInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && pageIdInput.trim()) {
                      handleSelectPage(pageIdInput.trim());
                      setPageSetupConn(null);
                    }
                  }}
                  placeholder="e.g. 123456789012345"
                  className="w-full bg-[#111] border border-[#1C1814]/30 rounded-xl px-4 py-3 text-sm text-[#1C1814] placeholder-[#1C1814] focus:outline-none focus:border-[#1877F2]/50 font-mono"
                  autoFocus
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-[#1C1814]/10 bg-[#FAF7F2]/30 flex items-center justify-end gap-3 rounded-b-3xl">
              <button
                onClick={() => setPageSetupConn(null)}
                className="px-5 py-2 rounded-xl border border-[#1C1814]/20 text-xs font-semibold text-[#5C5650] hover:bg-[#E5DFD6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!pageIdInput.trim()) return;
                  handleSelectPage(pageIdInput.trim());
                  setPageSetupConn(null);
                }}
                disabled={!pageIdInput.trim() || selectingPage}
                className="px-5 py-2 rounded-xl bg-[#1877F2] text-[#1C1814] text-xs font-bold uppercase tracking-wider hover:bg-[#1877F2]/85 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {selectingPage && <span className="material-symbols-outlined text-[13px] animate-spin">progress_activity</span>}
                Connect Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
