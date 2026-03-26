import { useEffect, useRef } from 'react';
import gsap from 'gsap';

type Variant = 'danger' | 'warning' | 'primary' | 'success';

interface ConfirmModalProps {
  title:         string;
  message:       string;
  confirmLabel:  string;
  variant?:      Variant;
  icon?:         string;
  note?:         string;
  onConfirm:     () => void;
  onClose:       () => void;
}

const VARIANT_STYLES: Record<Variant, { icon: string; btn: string; iconColor: string }> = {
  danger:  { icon: 'delete_forever', iconColor: '#ffb4ab', btn: 'bg-[#ffb4ab] text-[#2d0000] hover:bg-[#ffc9c2]' },
  warning: { icon: 'refresh',        iconColor: '#ffd166', btn: 'bg-[#ffd166] text-[#2d1800] hover:bg-[#ffe08a]' },
  primary: { icon: 'send',           iconColor: '#d394ff', btn: 'bg-[#d394ff] text-[#2f004d] hover:bg-[#e3b5ff]' },
  success: { icon: 'send',           iconColor: '#c5d247', btn: 'bg-[#c5d247] text-[#1a2000] hover:bg-[#d4e25a]' },
};

export default function ConfirmModal({
  title, message, confirmLabel, variant = 'primary', icon, note, onConfirm, onClose,
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const v          = VARIANT_STYLES[variant];

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 24, scale: 0.96 },
      { opacity: 1, y: 0,  scale: 1,    duration: 0.28, ease: 'power3.out' },
    );
  }, []);

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.18, ease: 'power2.in' });
    gsap.to(cardRef.current,    { opacity: 0, y: 16, scale: 0.97, duration: 0.18, ease: 'power2.in', onComplete: onClose });
  };

  const handleConfirm = () => {
    handleClose();
    setTimeout(onConfirm, 180);
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleClose}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div
        ref={cardRef}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-[#1c1b1b] rounded-3xl border border-[#4c4450]/20 shadow-[0_24px_80px_rgba(0,0,0,0.7)] p-8 flex flex-col items-center text-center gap-4"
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-1"
          style={{ background: v.iconColor + '18' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 30, color: v.iconColor, fontVariationSettings: "'FILL' 1" }}>
            {icon ?? v.icon}
          </span>
        </div>

        {/* Text */}
        <h3 className="font-headline text-lg font-bold text-white tracking-tight">{title}</h3>
        <p className="text-sm text-[#988d9c] leading-relaxed">{message}</p>

        {/* Info note */}
        {note && (
          <div className="w-full flex items-start gap-2.5 bg-[#ffffff]/[0.04] border border-[#4c4450]/20 rounded-xl px-4 py-3 text-left">
            <span className="material-symbols-outlined text-[#988d9c] shrink-0 mt-0.5" style={{ fontSize: 15 }}>info</span>
            <p className="text-xs text-[#988d9c] leading-relaxed">{note}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl border border-[#4c4450]/20 text-sm font-semibold text-[#cfc2d2] hover:bg-[#2a2a2a] hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${v.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
