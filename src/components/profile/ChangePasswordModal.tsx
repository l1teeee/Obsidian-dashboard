import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { changePassword } from '../../services/users.service';

interface ChangePasswordModalProps {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [current,  setCurrent]  = useState('');
  const [next,     setNext]     = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState(false);
  const [showCur,  setShowCur]  = useState(false);
  const [showNew,  setShowNew]  = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
    gsap.fromTo(cardRef.current,
      { y: 24, opacity: 0, scale: 0.97 },
      { y: 0,  opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out', delay: 0.05 },
    );
  }, []);

  const handleClose = () => {
    gsap.to(cardRef.current,    { y: 16, opacity: 0, scale: 0.97, duration: 0.22, ease: 'power2.in' });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, ease: 'power2.in', onComplete: onClose });
  };

  const handleSave = async () => {
    if (!current || !next) return;
    if (next !== confirm) { setError('Passwords do not match.'); return; }
    if (next.length < 8)  { setError('New password must be at least 8 characters.'); return; }
    setSaving(true);
    setError(null);
    try {
      await changePassword(current, next);
      setSuccess(true);
      setTimeout(handleClose, 1200);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to change password.';
      setError(msg);
      setSaving(false);
    }
  };

  const inputCls = 'w-full bg-[#1c1b1b] border border-[#4c4450]/30 rounded-xl px-4 py-3 text-sm text-[#e5e2e1] placeholder:text-[#988d9c]/40 focus:outline-none focus:border-[#d394ff]/60 focus:ring-1 focus:ring-[#d394ff]/20 transition-all pr-11';

  const pwField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    toggleShow: () => void,
    placeholder = '••••••••',
  ) => (
    <div className="space-y-1.5">
      <label className="text-[10px] text-[#988d9c] uppercase tracking-widest font-semibold">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputCls}
          disabled={saving || success}
        />
        <button
          type="button"
          onClick={toggleShow}
          aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={show}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#988d9c] hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            {show ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onMouseDown={e => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div
        ref={cardRef}
        className="w-full max-w-md bg-[#1a1919] border border-[#4c4450]/20 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-5 border-b border-[#4c4450]/10 flex items-center justify-between bg-[#201f1f]">
          <div>
            <h2 className="font-headline font-bold text-white text-lg">Change Password</h2>
            <p className="text-xs text-[#988d9c] mt-0.5">Enter your current password to confirm</p>
          </div>
          <button
            onClick={handleClose}
            disabled={saving}
            className="w-8 h-8 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-[#988d9c] hover:text-white hover:bg-[#353534] transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>

        <div className="px-8 py-6 space-y-4">
          {pwField('Current Password', current, setCurrent, showCur, () => setShowCur(v => !v))}
          {pwField('New Password',     next,    setNext,    showNew, () => setShowNew(v => !v), 'Min. 8 characters')}

          <div className="space-y-1.5">
            <label className="text-[10px] text-[#988d9c] uppercase tracking-widest font-semibold">Confirm New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                className={`${inputCls} ${confirm && confirm !== next ? 'border-[#ffb4ab]/60' : ''}`}
                disabled={saving || success}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#ffb4ab] px-3 py-2 rounded-xl bg-[#ffb4ab]/10 border border-[#ffb4ab]/20">
              {error}
            </p>
          )}

          {success && (
            <p className="text-xs text-[#a8d5a2] px-3 py-2 rounded-xl bg-[#a8d5a2]/10 border border-[#a8d5a2]/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Password changed successfully.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-[#4c4450]/10 flex items-center justify-end gap-3 bg-[#201f1f]">
          <button
            onClick={handleClose}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl border border-[#4c4450]/30 text-sm text-[#988d9c] hover:text-white hover:border-[#4c4450]/60 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => { void handleSave(); }}
            disabled={saving || success || !current || !next || !confirm}
            className="px-6 py-2.5 rounded-xl bg-[#d394ff] text-[#2f004d] text-sm font-bold shadow-[0_0_20px_rgba(211,148,255,0.25)] hover:shadow-[0_0_30px_rgba(211,148,255,0.45)] active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {saving
              ? <><span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span> Saving…</>
              : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
