import { useEffect, useState } from 'react';
import Modal from '../shared/Modal';
import SocialBrandIcon from '../shared/SocialBrandIcon';

type ConnectablePlatform = 'facebook' | 'instagram';
type ModalStep = 'list' | 'instagram-type';
type IgAccountType = 'business' | 'personal';

interface PlatformDef {
  id:          ConnectablePlatform | 'linkedin';
  name:        string;
  description: string;
  iconBg:      string;
  comingSoon?: true;
}

const PLATFORMS: PlatformDef[] = [
  {
    id:          'facebook',
    name:        'Facebook',
    description: 'Connect a Facebook Page to publish posts and sync linked Instagram.',
    iconBg:      'bg-[#1877F2]',
  },
  {
    id:          'instagram',
    name:        'Instagram',
    description: 'Connect directly with Instagram Login — no Facebook account needed.',
    iconBg:      'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]',
  },
  {
    id:          'linkedin',
    name:        'LinkedIn',
    description: 'Publish to your LinkedIn profile or company page.',
    iconBg:      'bg-[#0A66C2]',
    comingSoon:  true,
  },
];

// Feature rows shown in the account-type cards
interface FeatureRow {
  icon:    string;
  label:   string;
  note?:   string;
  enabled: boolean;
}

const BUSINESS_FEATURES: FeatureRow[] = [
  { icon: 'send',           label: 'Publish posts, stories & reels',   enabled: true  },
  { icon: 'bar_chart',      label: 'Full analytics & insights',         enabled: true  },
  { icon: 'chat_bubble',    label: 'Read & reply to comments',          enabled: true  },
  { icon: 'schedule',       label: 'Schedule content in advance',       enabled: true  },
  { icon: 'link',           label: 'No Facebook Page required',         enabled: true  },
];

const PERSONAL_FEATURES: FeatureRow[] = [
  { icon: 'send',        label: 'Publish posts via API',     note: 'Meta restriction',       enabled: false },
  { icon: 'bar_chart',   label: 'Analytics & insights',      note: 'Not available',          enabled: false },
  { icon: 'chat_bubble', label: 'Comment management',        note: 'Not available',          enabled: false },
  { icon: 'person',      label: 'View account in dashboard',                                 enabled: true  },
  { icon: 'star',        label: 'Creator account (free)',    note: 'Unlocks everything above', enabled: true, },
];

interface AddPlatformModalProps {
  open:                       boolean;
  connectedPlatforms:         string[];
  connecting:                 boolean;
  onClose:                    () => void;
  onConnect:                  (platform: ConnectablePlatform) => void;
  onConnectInstagramDirect:   () => void;
}

export default function AddPlatformModal({
  open,
  connectedPlatforms,
  connecting,
  onClose,
  onConnect,
  onConnectInstagramDirect,
}: AddPlatformModalProps) {
  const [step,   setStep]   = useState<ModalStep>('list');
  const [_igType, setIgType] = useState<IgAccountType | null>(null);

  useEffect(() => {
    if (!open) { setStep('list'); setIgType(null); }
  }, [open]);

  const STEP_META: Record<ModalStep, { badge: string; title: string; subtitle: string }> = {
    'list': {
      badge:    'New Connection',
      title:    'Add a Platform',
      subtitle: 'Facebook connects Pages + Instagram. Instagram Login connects directly.',
    },
    'instagram-type': {
      badge:    'Instagram',
      title:    'Account type',
      subtitle: 'Choose your account type to see what\'s available.',
    },
  };

  const meta = STEP_META[step];

  const goBack = () => {
    if (step === 'instagram-type') { setStep('list'); setIgType(null); }
  };

  function handleConnectType(type: IgAccountType) {
    setIgType(type);
    onClose();
    onConnectInstagramDirect();
  }

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-8 pt-8 pb-6 border-b border-[#4c4450]/10">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d394ff]/10 border border-[#d394ff]/20 mb-3">
              {step !== 'list' && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1 text-[#d394ff] hover:text-white transition-colors mr-0.5"
                >
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                </button>
              )}
              <span className="w-1.5 h-1.5 rounded-full bg-[#d394ff]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#d394ff]">
                {meta.badge}
              </span>
            </div>
            <h2 className="font-headline text-2xl font-extrabold tracking-tight text-white">
              {meta.title}
            </h2>
            <p className="text-[#988d9c] text-sm mt-1">{meta.subtitle}</p>
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

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="px-8 py-6 flex flex-col gap-3">

        {/* Platform list */}
        {step === 'list' && (
          <>
            {PLATFORMS.map((platform) => {
              const connected = !platform.comingSoon && connectedPlatforms.includes(platform.id);
              const disabled  = connected || connecting || !!platform.comingSoon;

              return (
                <div
                  key={platform.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                    disabled
                      ? 'border-[#4c4450]/10 bg-[#1c1b1b]/40 opacity-50 cursor-not-allowed'
                      : 'border-[#4c4450]/15 bg-[#1c1b1b]/60 hover:border-[#d394ff]/30 hover:bg-[#d394ff]/5 cursor-pointer group'
                  }`}
                  onClick={() => {
                    if (disabled) return;
                    if (platform.id === 'instagram') { setStep('instagram-type'); return; }
                    if (platform.id !== 'linkedin')  { onConnect(platform.id); }
                  }}
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

                  {platform.comingSoon ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#4c4450]/20 text-[#988d9c] shrink-0">
                      Coming soon
                    </span>
                  ) : connected ? (
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
          </>
        )}

        {/* Step — Account type with disclaimers */}
        {step === 'instagram-type' && (
          <>
            {/* Business / Creator card */}
            <div className="flex flex-col p-5 rounded-2xl border border-[#4c4450]/15 bg-[#1c1b1b]/60 hover:border-[#d394ff]/30 hover:bg-[#d394ff]/5 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#d394ff]/10 border border-[#d394ff]/15 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#d394ff] text-[20px]">storefront</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Business or Creator</p>
                  <p className="text-[10px] text-[#988d9c]">Professional Instagram account</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {BUSINESS_FEATURES.map((f) => (
                  <div key={f.label} className="flex items-center gap-2.5">
                    <span className={`material-symbols-outlined text-[14px] shrink-0 ${f.enabled ? 'text-[#c5d247]' : 'text-[#4c4450]'}`}>
                      {f.enabled ? 'check_circle' : 'cancel'}
                    </span>
                    <span className={`text-[11px] ${f.enabled ? 'text-[#cfc2d2]' : 'text-[#4c4450]'}`}>{f.label}</span>
                    {f.note && <span className="text-[10px] text-[#4c4450] ml-auto">{f.note}</span>}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleConnectType('business')}
                disabled={connecting}
                className="w-full py-2.5 rounded-xl bg-[#d394ff]/10 border border-[#d394ff]/20 text-[#d394ff] text-xs font-bold uppercase tracking-wider hover:bg-[#d394ff]/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {connecting ? (
                  <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                ) : (
                  <SocialBrandIcon platformId="instagram" size={14} />
                )}
                Connect with Instagram Login
              </button>
            </div>

            {/* Personal card */}
            <div className="flex flex-col p-5 rounded-2xl border border-[#4c4450]/15 bg-[#1c1b1b]/60 hover:border-[#facc15]/20 hover:bg-[#facc15]/3 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#facc15]/8 border border-[#facc15]/15 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#facc15] text-[20px]">person</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Personal</p>
                  <p className="text-[10px] text-[#988d9c]">Regular Instagram account</p>
                </div>
                <span className="ml-auto px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-[#facc15]/10 text-[#facc15] shrink-0">
                  Limited
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {PERSONAL_FEATURES.map((f) => (
                  <div key={f.label} className="flex items-center gap-2.5">
                    <span className={`material-symbols-outlined text-[14px] shrink-0 ${
                      f.enabled
                        ? f.icon === 'star' ? 'text-[#facc15]' : 'text-[#c5d247]'
                        : 'text-[#4c4450]'
                    }`}>
                      {f.enabled ? (f.icon === 'star' ? 'tips_and_updates' : 'check_circle') : 'cancel'}
                    </span>
                    <span className={`text-[11px] ${f.enabled ? 'text-[#cfc2d2]' : 'text-[#4c4450]'}`}>{f.label}</span>
                    {f.note && (
                      <span className={`text-[10px] ml-auto ${f.icon === 'star' ? 'text-[#facc15]' : 'text-[#4c4450]'}`}>
                        {f.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleConnectType('personal')}
                disabled={connecting}
                className="w-full py-2.5 rounded-xl bg-[#facc15]/8 border border-[#facc15]/15 text-[#facc15] text-xs font-bold uppercase tracking-wider hover:bg-[#facc15]/15 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {connecting ? (
                  <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[14px]">person</span>
                )}
                Connect personal account
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="px-8 py-5 border-t border-[#4c4450]/10 bg-[#1c1b1b]/30 flex items-center justify-between rounded-b-3xl">
        <p className="text-[10px] text-[#988d9c]">
          {step === 'instagram-type'
            ? 'Powered by Instagram API · Meta Graph API v21.0'
            : 'Powered by Meta Graph API v21.0'}
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
