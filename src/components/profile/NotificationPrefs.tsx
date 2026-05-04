import type { NotificationPref } from '../../domain/entities/Profile';

interface NotificationPrefsProps {
  prefs: NotificationPref[];
}

export default function NotificationPrefs({ prefs }: NotificationPrefsProps) {
  return (
    <div data-section className="bg-[#201f1f] rounded-3xl border border-[#4c4450]/10 overflow-hidden">
      <div className="px-8 py-5 border-b border-[#4c4450]/5 bg-[#2a2a2a]/20 flex items-center justify-between">
        <h3 className="font-headline font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#d394ff] text-[18px]">notifications</span>
          Notification Preferences
        </h3>
        <span className="text-[10px] text-[#4c4450] uppercase tracking-widest font-semibold">Coming soon</span>
      </div>
      <div className="divide-y divide-[#4c4450]/5">
        {prefs.map((pref) => (
          <div key={pref.label} className="px-8 py-4 flex items-center justify-between opacity-40">
            <div>
              <p className="text-sm text-[#e5e2e1] font-medium">{pref.label}</p>
              <p className="text-[10px] text-[#988d9c] mt-0.5">{pref.desc}</p>
            </div>
            <div className={`w-10 h-5 rounded-full shrink-0 relative cursor-not-allowed ${pref.on ? 'bg-[#d394ff]' : 'bg-[#353534]'}`}>
              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] ${pref.on ? 'left-[22px]' : 'left-[3px]'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
