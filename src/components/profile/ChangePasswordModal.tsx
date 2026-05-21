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

  const inputCls = 'w-full bg-[#FFFFFF] border border-[#0F172A]/30 rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#64748B]/40 focus:outline-none focus:border-[#111827]/60 focus:ring-1 focus:ring-[#0E9F6E]/20 transition-all pr-11';

  const pwField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    toggleShow: () => void,
    placeholder = '••••••••',
  ) => (
    <div className="space-y-1.5">
      <label className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">{label}</label>
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
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
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
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-200 flex items-center justify-center p-4"
      onMouseDown={e => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div
        ref={cardRef}
        className="w-full max-w-md bg-[#FFFFFF] border border-[#0F172A]/20 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-5 border-b border-[#0F172A]/10 flex items-center justify-between bg-[#F1F5F9]">
          <div>
            <h2 className="font-headline font-bold text-[#0F172A] text-lg">Change Password</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Enter your current password to confirm</p>
          </div>
          <button
            onClick={handleClose}
            disabled={saving}
            className="w-8 h-8 rounded-xl bg-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#CBD5E1] transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>

        <div className="px-8 py-6 space-y-4">
          {pwField('Current Password', current, setCurrent, showCur, () => setShowCur(v => !v))}
          {pwField('New Password',     next,    setNext,    showNew, () => setShowNew(v => !v), 'Min. 8 characters')}

          <div className="space-y-1.5">
            <label className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">Confirm New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                className={`${inputCls} ${confirm && confirm !== next ? 'border-[#DC2626]/60' : ''}`}
                disabled={saving || success}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#DC2626] px-3 py-2 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/20">
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
        <div className="px-8 py-5 border-t border-[#0F172A]/10 flex items-center justify-end gap-3 bg-[#F1F5F9]">
          <button
            onClick={handleClose}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl border border-[#0F172A]/30 text-sm text-[#64748B] hover:text-[#0F172A] hover:border-[#0F172A]/60 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => { void handleSave(); }}
            disabled={saving || success || !current || !next || !confirm}
            className="px-6 py-2.5 rounded-xl bg-[#111827] text-white text-sm font-bold hover:bg-[#0B1220] active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
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
