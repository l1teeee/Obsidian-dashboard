import { FaInstagram, FaLinkedinIn, FaFacebook } from 'react-icons/fa';
import { CHANNELS } from '../../domain/entities/Composer';
import type { ChannelId } from '../../domain/entities/Composer';

const ICONS: Record<ChannelId, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  ig: FaInstagram,
  li: FaLinkedinIn,
  fb: FaFacebook,
};

interface ChannelSelectorProps {
  selectedChannels: ChannelId[];
  onToggle:         (id: ChannelId) => void;
  fbPageName?:      string | null;
  igAccountName?:   string | null;
}

export default function ChannelSelector({ selectedChannels, onToggle, fbPageName: _fbPageName, igAccountName }: ChannelSelectorProps) {
  const igActive = selectedChannels.includes('ig');

  return (
    <div data-editor-section className="space-y-3">
      <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">Target Channels</label>
      <div className="flex gap-3">
        {CHANNELS.map(ch => {
          const active = selectedChannels.includes(ch.id);
          const Icon   = ICONS[ch.id];
          return (
            <button
              key={ch.id}
              onClick={() => onToggle(ch.id)}
              className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95 ${
                active
                  ? 'glass-card border-[#d394ff]'
                  : 'bg-[#201f1f]/50 border-transparent text-[#988d9c] hover:text-[#e5e2e1] hover:bg-[#201f1f]'
              }`}
            >
              <Icon size={17} style={{ color: active ? ch.color : undefined }} />
              <span className="text-xs font-semibold">{ch.label}</span>
              {active && (
                <span className="material-symbols-outlined text-[#d394ff] text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Instagram disclaimer */}
      {igActive && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-[#4c4450]/10 border border-[#4c4450]/20">
          <span className="material-symbols-outlined text-[#988d9c] text-[13px] mt-0.5 shrink-0">info</span>
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
