import { useEffect, useState } from 'react';
import Modal from '../shared/Modal';
import SocialBrandIcon from '../shared/SocialBrandIcon';

type ConnectablePlatform = 'facebook' | 'instagram';
type ModalStep = 'list' | 'instagram-type' | 'instagram-needs';
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
    description: 'Connect a Facebook Page to publish posts.',
    iconBg:      'bg-[#1877F2]',
  },
  {
    id:          'instagram',
    name:        'Instagram',
    description: 'Connect any Instagram account — Business, Creator or Personal.',
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

interface AddPlatformModalProps {
  open:                 boolean;
  connectedPlatforms:   string[];
  connecting:           boolean;
  onClose:              () => void;
  onConnect:            (platform: ConnectablePlatform) => void;
  onConnectInstagram:   () => void;
}

export default function AddPlatformModal({
  open,
  connectedPlatforms,
  connecting,
  onClose,
  onConnect,
  onConnectInstagram,
}: AddPlatformModalProps) {
  const [step,   setStep]   = useState<ModalStep>('list');
  const [igType, setIgType] = useState<IgAccountType | null>(null);

  useEffect(() => {
    if (!open) { setStep('list'); setIgType(null); }
  }, [open]);

  const hasFacebook = connectedPlatforms.includes('facebook');

  const STEP_META: Record<ModalStep, { badge: string; title: string; subtitle: string }> = {
    'list': {
      badge:    'New Connection',
      title:    'Add a Platform',
      subtitle: 'Connect via Facebook OAuth to link pages and Instagram accounts.',
    },
    'instagram-type': {
      badge:    'Instagram',
      title:    'Account type',
      subtitle: 'What kind of Instagram account do you have?',
    },
    'instagram-needs': {
      badge:    'Instagram',
      title:    'What do you need?',
      subtitle: 'This helps us set up the right features for your account.',
    },
  };

  const meta = STEP_META[step];

  const goBack = () => {
    if (step === 'instagram-needs') { setStep('instagram-type'); return; }
    if (step === 'instagram-type')  { setStep('list'); return; }
  };

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

            {!hasFacebook && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#d394ff]/5 border border-[#d394ff]/15 mt-1">
                <span className="material-symbols-outlined text-[#d394ff] text-[18px] shrink-0 mt-0.5">info</span>
                <p className="text-[11px] text-[#cfc2d2] leading-relaxed">
                  Both Facebook and Instagram connect through <strong className="text-white">Facebook Login</strong>.
                  After authorizing, your pages and linked Instagram accounts are automatically detected.
                </p>
              </div>
            )}
          </>
        )}

        {/* Step 1 — Account type */}
        {step === 'instagram-type' && (
          <>
            {(
              [
                {
                  type:        'business' as IgAccountType,
                  icon:        'storefront',
                  label:       'Business or Creator',
                  description: 'Professional account linked to a Facebook Page. Full publishing and analytics support.',
                },
                {
                  type:        'personal' as IgAccountType,
                  icon:        'person',
                  label:       'Personal',
                  description: 'Regular Instagram account. Publishing and basic engagement features available.',
                },
              ] as const
            ).map(({ type, icon, label, description }) => (
              <button
                key={type}
                onClick={() => { setIgType(type); setStep('instagram-needs'); }}
                className="flex items-center gap-4 p-5 rounded-2xl border border-[#4c4450]/15 bg-[#1c1b1b]/60 hover:border-[#d394ff]/30 hover:bg-[#d394ff]/5 transition-all text-left group w-full"
              >
                <div className="w-11 h-11 rounded-xl bg-[#d394ff]/10 border border-[#d394ff]/15 flex items-center justify-center shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[#d394ff] text-[22px]">{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{label}</p>
                  <p className="text-[11px] text-[#988d9c] mt-0.5 leading-relaxed">{description}</p>
                </div>
                <span className="material-symbols-outlined text-[#988d9c] group-hover:text-[#d394ff] text-[18px] shrink-0 transition-colors">arrow_forward</span>
              </button>
            ))}
          </>
        )}

        {/* Step 2 — What do you need */}
        {step === 'instagram-needs' && (
          <>
            {(
              [
                {
                  icon:        'check_circle',
                  label:       'Keep it simple',
                  description: 'Publish posts, stories and reels. See likes, comments and basic engagement.',
                  accent:      'hover:border-[#c5d247]/40 hover:bg-[#c5d247]/5',
                  accentIcon:  'text-[#c5d247]',
                },
                {
                  icon:        'bar_chart_4_bars',
                  label:       'Advanced metrics',
                  description: 'In-depth analytics, audience insights, reach, impressions and performance trends.',
                  accent:      'hover:border-[#d394ff]/40 hover:bg-[#d394ff]/5',
                  accentIcon:  'text-[#d394ff]',
                },
              ] as const
            ).map(({ icon, label, description, accent, accentIcon }) => (
              <button
                key={label}
                onClick={() => onConnectInstagram()}
                className={`flex items-center gap-4 p-5 rounded-2xl border border-[#4c4450]/15 bg-[#1c1b1b]/60 ${accent} transition-all text-left group w-full`}
              >
                <div className={`w-11 h-11 rounded-xl bg-[#2a2a2a] flex items-center justify-center shadow-sm shrink-0`}>
                  <span className={`material-symbols-outlined ${accentIcon} text-[22px]`}>{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{label}</p>
                  <p className="text-[11px] text-[#988d9c] mt-0.5 leading-relaxed">{description}</p>
                </div>
                <span className="material-symbols-outlined text-[#988d9c] group-hover:text-white text-[18px] shrink-0 transition-colors">arrow_forward</span>
              </button>
            ))}

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#d394ff]/5 border border-[#d394ff]/15 mt-1">
              <span className="material-symbols-outlined text-[#d394ff] text-[18px] shrink-0 mt-0.5">info</span>
              <p className="text-[11px] text-[#cfc2d2] leading-relaxed">
                {igType === 'personal'
                  ? 'Personal accounts support publishing and basic engagement. For full analytics, consider upgrading to a Creator account (free).'
                  : 'Business and Creator accounts have access to the full suite of publishing tools and analytics.'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
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
