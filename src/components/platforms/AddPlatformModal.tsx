import Modal from '../shared/Modal';
import SocialBrandIcon from '../shared/SocialBrandIcon';

type ConnectablePlatform = 'facebook' | 'instagram';

interface PlatformDef {
  id:          ConnectablePlatform;
  name:        string;
  description: string;
  iconBg:      string;
}

const CONNECTABLE: PlatformDef[] = [
  {
    id:          'facebook',
    name:        'Facebook',
    description: 'Connect a Facebook Page to publish posts.',
    iconBg:      'bg-[#1877F2]',
  },
  {
    id:          'instagram',
    name:        'Instagram',
    description: 'Requires a Facebook Page with a linked Instagram Business account.',
    iconBg:      'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]',
  },
];

interface AddPlatformModalProps {
  open:               boolean;
  connectedPlatforms: string[];
  connecting:         boolean;
  onClose:            () => void;
  onConnect:          (platform: ConnectablePlatform) => void;
}

export default function AddPlatformModal({
  open,
  connectedPlatforms,
  connecting,
  onClose,
  onConnect,
}: AddPlatformModalProps) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
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
              Connect via Facebook OAuth to link Facebook Pages and Instagram Business accounts.
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
      <div className="px-8 py-6 flex flex-col gap-3">
        {CONNECTABLE.map((platform) => {
          const connected = connectedPlatforms.includes(platform.id);
          return (
            <div
              key={platform.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                connected || connecting
                  ? 'border-[#4c4450]/10 bg-[#1c1b1b]/40 opacity-50 cursor-not-allowed'
                  : 'border-[#4c4450]/15 bg-[#1c1b1b]/60 hover:border-[#d394ff]/30 hover:bg-[#d394ff]/5 cursor-pointer group'
              }`}
              onClick={() => { if (!connected && !connecting) onConnect(platform.id); }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${platform.iconBg} flex items-center justify-center shadow-md shrink-0`}>
                  <SocialBrandIcon platformId={platform.id} size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{platform.name}</p>
                  <p className="text-[10px] text-[#988d9c]">{platform.description}</p>
                </div>
              </div>

              {connected ? (
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#c5d247] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c5d247]" />
                  Connected
                </span>
              ) : connecting ? (
                <span className="material-symbols-outlined text-[#988d9c] text-[18px] animate-spin shrink-0">progress_activity</span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#988d9c] group-hover:text-[#d394ff] transition-colors shrink-0">
                  Connect
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              )}
            </div>
          );
        })}

        {/* Info note */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#d394ff]/5 border border-[#d394ff]/15 mt-2">
          <span className="material-symbols-outlined text-[#d394ff] text-[18px] shrink-0 mt-0.5">info</span>
          <p className="text-[11px] text-[#cfc2d2] leading-relaxed">
            Both Facebook and Instagram are connected through <strong className="text-white">Facebook Login</strong>.
            After connecting, pages and linked Instagram Business accounts are automatically detected.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-5 border-t border-[#4c4450]/10 bg-[#1c1b1b]/30 flex items-center justify-between rounded-b-3xl">
        <p className="text-[10px] text-[#988d9c]">
          Powered by Facebook Graph API v21.0
        </p>
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-xl border border-[#4c4450]/20 text-xs font-semibold text-[#cfc2d2] hover:bg-[#2a2a2a] transition-colors"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
