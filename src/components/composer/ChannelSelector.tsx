import { FaInstagram, FaLinkedinIn, FaFacebook } from 'react-icons/fa';
import { CHANNELS } from '../../domain/entities/Composer';
import type { ChannelId } from '../../types/composer.types';

const ICONS: Record<ChannelId, React.ComponentType<{ size?: number; color?: string }>> = {
  ig: FaInstagram,
  li: FaLinkedinIn,
  fb: FaFacebook,
};

const CHANNEL_GLOW: Record<ChannelId, { border: string; bg: string; shadow: string }> = {
  ig: {
    border:  '#e4405f',
    bg:      'rgba(228,64,95,0.10)',
    shadow:  '0 0 22px rgba(228,64,95,0.30), inset 0 1px 0 rgba(255,255,255,0.06)',
  },
  li: {
    border:  '#0a66c2',
    bg:      'rgba(10,102,194,0.10)',
    shadow:  '0 0 22px rgba(10,102,194,0.30), inset 0 1px 0 rgba(255,255,255,0.06)',
  },
  fb: {
    border:  '#1877f2',
    bg:      'rgba(24,119,242,0.10)',
    shadow:  '0 0 22px rgba(24,119,242,0.30), inset 0 1px 0 rgba(255,255,255,0.06)',
  },
};

interface ChannelSelectorProps {
  selectedChannels: ChannelId[];
  onToggle:         (id: ChannelId) => void;
  fbPageName?:      string | null;
  igAccountName?:   string | null;
}

export default function ChannelSelector({ selectedChannels, onToggle, igAccountName }: ChannelSelectorProps) {
  const igActive = selectedChannels.includes('ig');

  return (
    <div data-editor-section className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">
          Target Channels
        </label>
        <span className="text-[10px] text-[#4c4450]">
          {selectedChannels.length === 0 ? 'None selected' : `${selectedChannels.length} selected`}
        </span>
      </div>

      <div className="flex gap-2.5">
        {CHANNELS.map(ch => {
          const active = selectedChannels.includes(ch.id);
          const Icon   = ICONS[ch.id];
          const glow   = CHANNEL_GLOW[ch.id];

          return (
            <button
              key={ch.id}
              onClick={() => onToggle(ch.id)}
              className="flex-1 flex flex-col items-center gap-2.5 py-4 px-2 rounded-2xl border-2 transition-all duration-200 select-none active:scale-95"
              style={active ? {
                borderColor:     glow.border,
                backgroundColor: glow.bg,
                boxShadow:       glow.shadow,
              } : {
                borderColor:     'rgba(76,68,80,0.25)',
                backgroundColor: '#171616',
              }}
            >
              {/* Icon + badge */}
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={active ? {
                    backgroundColor: `${glow.border}22`,
                    boxShadow:       `0 0 12px ${glow.border}44`,
                  } : {
                    backgroundColor: '#252323',
                  }}
                >
                  <Icon size={20} color={active ? '#ffffff' : '#4c4450'} />
                </div>
                {active && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#d394ff] flex items-center justify-center shadow-[0_0_8px_rgba(211,148,255,0.6)]">
                    <span
                      className="material-symbols-outlined text-[#0e0e0e] leading-none"
                      style={{ fontSize: 10, fontVariationSettings: "'FILL' 1" }}
                    >
                      check
                    </span>
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                className="text-[11px] font-bold tracking-tight transition-colors duration-200"
                style={{ color: active ? '#ffffff' : '#4c4450' }}
              >
                {ch.label}
              </span>

              {/* Active pill */}
              <div
                className="h-1 w-6 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: active ? glow.border : 'transparent',
                  boxShadow:       active ? `0 0 6px ${glow.border}` : 'none',
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Instagram disclaimer */}
      {igActive && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-[#4c4450]/10 border border-[#4c4450]/20">
          <span className="material-symbols-outlined text-[#988d9c] mt-0.5 shrink-0" style={{ fontSize: 13 }}>info</span>
          <p className="text-[10px] text-[#988d9c] leading-relaxed">
            <span className="font-semibold text-[#cfc2d2]">Instagram</span>
            {igAccountName && <span className="text-[#d394ff]"> (@{igAccountName})</span>}
            {' '}only supports images and videos. Text-only posts are not available on Instagram.
          </p>
        </div>
      )}
    </div>
  );
}
