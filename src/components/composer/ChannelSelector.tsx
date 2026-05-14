import { LayoutGroup, motion } from 'framer-motion';
import { CHANNELS } from '../../domain/entities/Composer';
import type { ChannelId } from '../../types/composer.types';

const CHANNEL_META: Record<ChannelId, { icon: React.ReactNode; label: string }> = {
  ig: {
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  li: {
    label: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  fb: {
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
};

interface ChannelSelectorProps {
  selectedChannels:  ChannelId[];
  onToggle:          (id: ChannelId) => void;
  igAccountName?:    string | null;
  preferred:         ChannelId | null;
  onPreferredChange: (id: ChannelId | null) => void;
}

export default function ChannelSelector({
  selectedChannels,
  onToggle,
  igAccountName,
  preferred,
  onPreferredChange,
}: ChannelSelectorProps) {
  const igActive = selectedChannels.includes('ig');

  // Preferred channel always first, rest in original CHANNELS order
  const sorted = [...CHANNELS].sort((a, b) => {
    if (a.id === preferred) return -1;
    if (b.id === preferred) return 1;
    return 0;
  });

  function handleStarClick(e: React.MouseEvent, chId: ChannelId) {
    e.stopPropagation();
    if (preferred === chId) return;
    onPreferredChange(chId);
  }

  return (
    <div data-editor-section className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-widest text-[#6A6470] font-bold">
          Target Channels
        </label>
        <span className="text-[10px] text-[#1C1814]">
          {selectedChannels.length === 0 ? 'None selected' : `${selectedChannels.length} selected`}
        </span>
      </div>

      <LayoutGroup>
        <div className="flex gap-3">
          {sorted.map(ch => {
            const active      = selectedChannels.includes(ch.id);
            const isPreferred = preferred === ch.id;
            const meta        = CHANNEL_META[ch.id];

            return (
              <motion.button
                key={ch.id}
                layoutId={ch.id}
                layout="position"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onToggle(ch.id)}
                className={[
                  'relative flex-1 flex items-center gap-3 py-3.5 px-4 rounded-2xl border transition-colors duration-150 select-none cursor-pointer text-sm font-medium',
                  active && isPreferred
                    ? 'border-[#ffd166]/50 bg-[#ffd166]/8 text-[#1C1814]'
                    : active
                      ? 'border-[#7DD3C7]/30 bg-[#7DD3C7]/8 text-[#1C1814]'
                      : 'border-[#1C1814]/15 bg-transparent text-[#6A6470] hover:border-[#1C1814]/30 hover:text-[#1C1814]',
                ].join(' ')}
              >
                {/* Star — absolute top-right, solo cuando activo */}
                {active && (
                  <span
                    role="button"
                    title={isPreferred ? 'Quitar preferida' : 'Marcar como preferida'}
                    onClick={(e) => handleStarClick(e, ch.id)}
                    className="material-symbols-outlined absolute top-2 right-2 transition-colors"
                    style={{
                      fontSize: 14,
                      fontVariationSettings: "'FILL' 1",
                      color: isPreferred ? '#ffd166' : '#4c4450',
                    }}
                  >
                    star
                  </span>
                )}

                {/* Icon */}
                <span
                  className={[
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                    active && isPreferred ? 'bg-[#ffd166]/15'
                    : active             ? 'bg-[#7DD3C7]/15'
                    :                      'bg-[#1a1a1a]',
                  ].join(' ')}
                >
                  <span style={{
                    color: active && isPreferred ? '#ffd166'
                         : active               ? '#7DD3C7'
                         :                        '#4c4450',
                  }}>
                    {meta.icon}
                  </span>
                </span>

                {/* Label */}
                <span className="truncate">{meta.label}</span>

              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>

      {/* Instagram disclaimer */}
      {igActive && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-[#1C1814]/10 border border-[#1C1814]/20">
          <span className="material-symbols-outlined text-[#6A6470] mt-0.5 shrink-0" style={{ fontSize: 16 }}>info</span>
          <p className="text-[11px] text-[#6A6470] leading-relaxed">
            <span className="font-semibold text-[#5C5650]">Instagram</span>
            {igAccountName && <span className="text-[#7DD3C7]"> (@{igAccountName})</span>}
            {' '}only supports images and videos. Text-only posts are not available on Instagram.
          </p>
        </div>
      )}
    </div>
  );
}
