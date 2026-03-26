import { useEffect, useRef, useState } from 'react';
import { TIMEZONES } from '../../domain/entities/Profile';
import type { ProfileData } from '../../domain/entities/Profile';
import gsap from 'gsap';

interface EditProfileModalProps {
  data:    ProfileData;
  onSave:  (d: ProfileData) => void;
  onClose: () => void;
}

export default function EditProfileModal({ data, onSave, onClose }: EditProfileModalProps) {
  const [form, setForm] = useState<ProfileData>(data);
  const overlayRef      = useRef<HTMLDivElement>(null);
  const cardRef         = useRef<HTMLDivElement>(null);

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

  const handleSave = () => {
    onSave(form);
    handleClose();
  };

  const field = (label: string, key: keyof ProfileData, type = 'text') => (
    <div className="space-y-1.5">
      <label className="text-[10px] text-[#988d9c] uppercase tracking-widest font-semibold">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        className="w-full bg-[#1c1b1b] border border-[#4c4450]/30 rounded-xl px-4 py-3 text-sm text-[#e5e2e1] placeholder:text-[#988d9c]/40 focus:outline-none focus:border-[#d394ff]/60 focus:ring-1 focus:ring-[#d394ff]/20 transition-all"
      />
    </div>
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onMouseDown={(e) => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div
        ref={cardRef}
        className="w-full max-w-lg bg-[#1a1919] border border-[#4c4450]/20 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-5 border-b border-[#4c4450]/10 flex items-center justify-between bg-[#201f1f]">
          <div>
            <h2 className="font-headline font-bold text-white text-lg">Edit Profile</h2>
            <p className="text-xs text-[#988d9c] mt-0.5">Update your account information</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-[#988d9c] hover:text-white hover:bg-[#353534] transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>

        {/* Avatar section */}
        <div className="px-8 pt-6 pb-2 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#d394ff] to-[#9400e4] p-[2px] shrink-0">
            <div className="w-full h-full rounded-2xl bg-[#1a1919] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 26 }}>person</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-white font-headline">{form.name}</p>
            <p className="text-xs text-[#988d9c] mt-0.5">{form.email}</p>
            <button className="mt-2 text-[10px] text-[#d394ff] font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>upload</span>
              Change avatar
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pb-6 pt-4 space-y-4">
          {field('Full Name', 'name')}
          {field('Email',     'email', 'email')}
          {field('Role',      'role')}

          {/* Timezone select */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#988d9c] uppercase tracking-widest font-semibold">Timezone</label>
            <select
              value={form.timezone}
              onChange={e => setForm(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full bg-[#1c1b1b] border border-[#4c4450]/30 rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#d394ff]/60 focus:ring-1 focus:ring-[#d394ff]/20 transition-all appearance-none cursor-pointer"
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz} className="bg-[#1c1b1b]">{tz}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-[#4c4450]/10 flex items-center justify-end gap-3 bg-[#201f1f]">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl border border-[#4c4450]/30 text-sm text-[#988d9c] hover:text-white hover:border-[#4c4450]/60 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#d394ff] text-[#2f004d] text-sm font-bold shadow-[0_0_20px_rgba(211,148,255,0.25)] hover:shadow-[0_0_30px_rgba(211,148,255,0.45)] active:scale-95 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
