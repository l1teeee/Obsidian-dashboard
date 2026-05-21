import { useEffect, useRef, useState } from 'react';
import { TIMEZONES } from '../../domain/entities/Profile';
import type { ProfileData } from '../../domain/entities/Profile';
import gsap from 'gsap';
import InitialsAvatar from '../shared/InitialsAvatar';

interface EditProfileModalProps {
  data:    ProfileData;
  onSave:  (d: ProfileData) => Promise<void>;
  onClose: () => void;
}

export default function EditProfileModal({ data, onSave, onClose }: EditProfileModalProps) {
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

  const inputCls = 'w-full bg-[#FFFFFF] border border-[#0F172A]/30 rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#64748B]/40 focus:outline-none focus:border-[#111827]/60 focus:ring-1 focus:ring-[#0E9F6E]/20 transition-all';

  const field = (label: string, key: keyof ProfileData, placeholder = '') => (
    <div className="space-y-1.5">
      <label className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">{label}</label>
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
        className="w-full max-w-lg bg-[#FFFFFF] border border-[#0F172A]/20 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-5 border-b border-[#0F172A]/10 flex items-center justify-between bg-[#F1F5F9]">
          <div>
            <h2 className="font-headline font-bold text-[#0F172A] text-lg">Edit Profile</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Update your account information</p>
          </div>
          <button
            onClick={handleClose}
            disabled={saving}
            className="w-8 h-8 rounded-xl bg-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#CBD5E1] transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>

        {/* Avatar */}
        <div className="px-8 pt-6 pb-2 flex items-center gap-4">
          <InitialsAvatar name={form.name || form.email} size="md" />
          <div>
            <p className="text-sm font-bold text-[#0F172A] font-headline">{form.name || 'No name'}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{form.email}</p>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pb-4 pt-4 space-y-4">
          {field('Full Name', 'name', 'Alex Johnson')}
          {field('Role',      'role', 'Content Creator')}
          {field('Country',   'country', 'United States')}

          {/* Email - readonly */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">Email</label>
            <input
              type="email"
              value={form.email}
              readOnly
              className={`${inputCls} opacity-50 cursor-not-allowed`}
            />
          </div>

          {/* Timezone */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">Timezone</label>
            <select
              value={form.timezone}
              onChange={e => setForm(prev => ({ ...prev, timezone: e.target.value }))}
              className={`${inputCls} appearance-none cursor-pointer`}
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz} className="bg-[#FFFFFF]">{tz}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-xs text-[#DC2626] px-3 py-2 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/20">
              {error}
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
            disabled={saving || !form.name.trim()}
            className="px-6 py-2.5 rounded-xl bg-[#111827] text-white text-sm font-bold hover:bg-[#0B1220] active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
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
