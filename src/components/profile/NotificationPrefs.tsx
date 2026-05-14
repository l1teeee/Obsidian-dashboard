import type { NotificationPref } from '../../domain/entities/Profile';

interface NotificationPrefsProps {
  prefs: NotificationPref[];
}

export default function NotificationPrefs({ prefs }: NotificationPrefsProps) {
  return (
    <div data-section className="bg-[#F0EBE2] rounded-3xl border border-[#1C1814]/10 overflow-hidden">
      <div className="px-8 py-5 border-b border-[#1C1814]/5 bg-[#E5DFD6]/20 flex items-center justify-between">
        <h3 className="font-headline font-bold text-[#1C1814] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7DD3C7] text-[18px]">notifications</span>
          Notification Preferences
        </h3>
        <span className="text-[10px] text-[#1C1814] uppercase tracking-widest font-semibold">Coming soon</span>
      </div>
      <div className="divide-y divide-[#1C1814]/5">
        {prefs.map((pref) => (
          <div key={pref.label} className="px-8 py-4 flex items-center justify-between opacity-40">
            <div>
              <p className="text-sm text-[#1C1814] font-medium">{pref.label}</p>
              <p className="text-[10px] text-[#6A6470] mt-0.5">{pref.desc}</p>
            </div>
            <div className={`w-10 h-5 rounded-full shrink-0 relative cursor-not-allowed ${pref.on ? 'bg-[#7DD3C7]' : 'bg-[#353534]'}`}>
              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] ${pref.on ? 'left-[22px]' : 'left-[3px]'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
