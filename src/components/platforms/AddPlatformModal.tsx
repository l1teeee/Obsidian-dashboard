import { useEffect } from 'react';
import SocialBrandIcon from '../shared/SocialBrandIcon';
import { PLATFORM_REGISTRY, type PlatformId } from '../../domain/entities/Platform';

function getIconBg(id: string): string {
  switch (id) {
    case 'instagram': return 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]';
    case 'facebook':  return 'bg-[#1877F2]';
    case 'linkedin':  return 'bg-[#0A66C2]';
    case 'twitter':   return 'bg-[#000000]';
    case 'tiktok':    return 'bg-gradient-to-br from-[#010101] via-[#69C9D0] to-[#EE1D52]';
    case 'youtube':   return 'bg-[#FF0000]';
    case 'pinterest': return 'bg-[#E60023]';
    default:          return 'bg-[#4c4450]';
  }
}

interface AddPlatformModalProps {
  open: boolean;
  connectedIds: PlatformId[];
  onClose: () => void;
  onConnect: (id: PlatformId) => void;
}

export default function AddPlatformModal({ open, connectedIds, onClose, onConnect }: AddPlatformModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const allPlatforms = Object.values(PLATFORM_REGISTRY);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg glass-card rounded-3xl border border-[#4c4450]/20 overflow-hidden shadow-2xl shadow-black/60 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[#4c4450]/10">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d394ff]/10 border border-[#d394ff]/20 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d394ff]" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#d394ff]">New Connection</span>
              </div>
              <h2 className="font-headline text-2xl font-extrabold tracking-tight text-white">
                Add a Platform
              </h2>
              <p className="text-[#988d9c] text-sm mt-1">
                Select a platform to connect to your workspace.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-[#4c4450]/20 flex items-center justify-center hover:bg-[#2a2a2a] transition-colors shrink-0 mt-1"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[#988d9c] text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Platform list */}
        <div className="px-8 py-6 flex flex-col gap-3 overflow-y-auto flex-1 min-h-0">
          {allPlatforms.map((platform) => {
            const connected = connectedIds.includes(platform.id);
            return (
              <div
                key={platform.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                  connected
                    ? 'border-[#4c4450]/10 bg-[#1c1b1b]/40 opacity-50 cursor-not-allowed'
                    : 'border-[#4c4450]/15 bg-[#1c1b1b]/60 hover:border-[#d394ff]/30 hover:bg-[#d394ff]/5 cursor-pointer group'
                }`}
                onClick={() => { if (!connected) onConnect(platform.id); }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${getIconBg(platform.id)} flex items-center justify-center shadow-md shrink-0`}>
                    <SocialBrandIcon platformId={platform.id} size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{platform.name}</p>
                    <p className="text-[10px] text-[#988d9c] font-mono">{platform.abbr}</p>
                  </div>
                </div>

                {connected ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#c5d247]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5d247]" />
                    Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#988d9c] group-hover:text-[#d394ff] transition-colors">
                    Connect
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-[#4c4450]/10 bg-[#1c1b1b]/30 flex items-center justify-between">
          <p className="text-[10px] text-[#988d9c]">
            {connectedIds.length} of {allPlatforms.length} platforms connected
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-[#4c4450]/20 text-xs font-semibold text-[#cfc2d2] hover:bg-[#2a2a2a] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
