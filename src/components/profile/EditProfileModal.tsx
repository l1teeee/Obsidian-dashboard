import { useEffect, useRef, useState } from 'react';
import { TIMEZONES } from '../../domain/entities/Profile';
import type { ProfileData } from '../../domain/entities/Profile';
import gsap from 'gsap';

interface EditProfileModalProps {
  data:          ProfileData;
  onSave:        (d: ProfileData) => Promise<void>;
  onClose:       () => void;
  onChangeAvatar?: () => void;
}

export default function EditProfileModal({ data, onSave, onClose, onChangeAvatar }: EditProfileModalProps) {
  const [form,    setForm]    = useState<ProfileData>(data);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);
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
    if (!form.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
      handleClose();
    } catch {
      setError('Failed to save. Please try again.');
      setSaving(false);
    }
  };

  const inputCls = 'w-full bg-[#FBF8F2] border border-[#15140F]/30 rounded-xl px-4 py-3 text-sm text-[#15140F] placeholder:text-[#6B655B]/40 focus:outline-none focus:border-[#C8553A]/60 focus:ring-1 focus:ring-[#C8553A]/20 transition-all';

  const field = (label: string, key: keyof ProfileData, placeholder = '') => (
    <div className="space-y-1.5">
      <label className="text-[10px] text-[#6B655B] uppercase tracking-widest font-semibold">{label}</label>
      <input
        type="text"
        value={String(form[key] ?? '')}
        placeholder={placeholder}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        className={inputCls}
      />
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
        className="w-full max-w-lg bg-[#FBF8F2] border border-[#15140F]/20 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-5 border-b border-[#15140F]/10 flex items-center justify-between bg-[#EFE9DC]">
          <div>
            <h2 className="font-headline font-bold text-[#15140F] text-lg">Edit Profile</h2>
            <p className="text-xs text-[#6B655B] mt-0.5">Update your account information</p>
          </div>
          <button
            onClick={handleClose}
            disabled={saving}
            className="w-8 h-8 rounded-xl bg-[#E7E0D0] flex items-center justify-center text-[#6B655B] hover:text-[#15140F] hover:bg-[#D8D2C4] transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>

        {/* Avatar */}
        <div className="px-8 pt-6 pb-2 flex items-center gap-4">
          <button
            type="button"
            onClick={onChangeAvatar}
            disabled={!onChangeAvatar}
            className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#C8553A] to-[#D6A86A] p-[2px] shrink-0 group disabled:cursor-default"
          >
            <div className="w-full h-full rounded-2xl bg-[#FBF8F2] overflow-hidden flex items-center justify-center">
              {form.avatar_url
                ? <img src={form.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                : <span className="text-xl font-bold text-[#C8553A]">{(form.name || form.email).slice(0, 2).toUpperCase()}</span>
              }
            </div>
            {onChangeAvatar && (
              <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="material-symbols-outlined text-[#15140F]" style={{ fontSize: 16 }}>photo_camera</span>
              </div>
            )}
          </button>
          <div>
            <p className="text-sm font-bold text-[#15140F] font-headline">{form.name || 'No name'}</p>
            <p className="text-xs text-[#6B655B] mt-0.5">{form.email}</p>
            {onChangeAvatar && (
              <button type="button" onClick={onChangeAvatar} className="text-[10px] text-[#C8553A] hover:text-[#e8b5ff] mt-1 transition-colors">
                Change photo
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pb-4 pt-4 space-y-4">
          {field('Full Name', 'name', 'Alex Johnson')}
          {field('Role',      'role', 'Content Creator')}
          {field('Country',   'country', 'United States')}

          {/* Email - readonly */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#6B655B] uppercase tracking-widest font-semibold">Email</label>
            <input
              type="email"
              value={form.email}
              readOnly
              className={`${inputCls} opacity-50 cursor-not-allowed`}
            />
          </div>

          {/* Timezone */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#6B655B] uppercase tracking-widest font-semibold">Timezone</label>
            <select
              value={form.timezone}
              onChange={e => setForm(prev => ({ ...prev, timezone: e.target.value }))}
              className={`${inputCls} appearance-none cursor-pointer`}
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz} className="bg-[#FBF8F2]">{tz}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-xs text-[#ffb4ab] px-3 py-2 rounded-xl bg-[#ffb4ab]/10 border border-[#ffb4ab]/20">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-[#15140F]/10 flex items-center justify-end gap-3 bg-[#EFE9DC]">
          <button
            onClick={handleClose}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl border border-[#15140F]/30 text-sm text-[#6B655B] hover:text-[#15140F] hover:border-[#15140F]/60 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => { void handleSave(); }}
            disabled={saving || !form.name.trim()}
            className="px-6 py-2.5 rounded-xl bg-[#C8553A] text-[#2f004d] text-sm font-bold shadow-[0_0_20px_rgba(200,85,58,0.25)] hover:shadow-[0_0_30px_rgba(200,85,58,0.45)] active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {saving
              ? <><span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span> Saving…</>
              : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
