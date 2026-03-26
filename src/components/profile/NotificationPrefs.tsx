import { useState } from 'react';
import type { NotificationPref } from '../../domain/entities/Profile';

interface NotificationPrefsProps {
  prefs: NotificationPref[];
}

export default function NotificationPrefs({ prefs: initialPrefs }: NotificationPrefsProps) {
  const [prefs, setPrefs] = useState<NotificationPref[]>(initialPrefs);

  const toggle = (index: number) => {
    setPrefs(prev => prev.map((p, i) => i === index ? { ...p, on: !p.on } : p));
  };

  return (
    <div data-section className="bg-[#201f1f] rounded-3xl border border-[#4c4450]/10 overflow-hidden">
      <div className="px-8 py-5 border-b border-[#4c4450]/5 bg-[#2a2a2a]/20">
        <h3 className="font-headline font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#d394ff] text-[18px]">notifications</span>
          Notification Preferences
        </h3>
      </div>
      <div className="divide-y divide-[#4c4450]/5">
        {prefs.map((pref, i) => (
          <div key={pref.label} className="px-8 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
            <div>
              <p className="text-sm text-[#e5e2e1] font-medium">{pref.label}</p>
              <p className="text-[10px] text-[#988d9c] mt-0.5">{pref.desc}</p>
            </div>
            <div
              onClick={() => toggle(i)}
              className={`w-10 h-5 rounded-full transition-colors shrink-0 cursor-pointer relative ${pref.on ? 'bg-[#d394ff]' : 'bg-[#353534]'}`}
            >
              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-all ${pref.on ? 'left-[22px]' : 'left-[3px]'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
