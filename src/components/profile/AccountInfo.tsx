import type { ProfileData } from '../../domain/entities/Profile';

interface AccountInfoProps {
  profile: ProfileData;
  onEdit:  () => void;
}

export default function AccountInfo({ profile, onEdit }: AccountInfoProps) {
  const rows = [
    { label: 'Full Name',    value: profile.name,     icon: 'person'         },
    { label: 'Email',        value: profile.email,    icon: 'mail'           },
    { label: 'Role',         value: profile.role,     icon: 'work'           },
    { label: 'Timezone',     value: profile.timezone, icon: 'schedule'       },
    { label: 'Member Since', value: 'January 2024',   icon: 'calendar_today' },
  ];

  return (
    <div data-section className="bg-[#201f1f] rounded-3xl border border-[#4c4450]/10 overflow-hidden">
      <div className="px-8 py-5 border-b border-[#4c4450]/5 flex items-center justify-between bg-[#2a2a2a]/20">
        <h3 className="font-headline font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#d394ff] text-[18px]">manage_accounts</span>
          Account Information
        </h3>
        <button
          onClick={onEdit}
          className="text-[10px] text-[#d394ff] font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[12px]">edit</span>
          Edit
        </button>
      </div>
      <div className="divide-y divide-[#4c4450]/5">
        {rows.map(({ label, value, icon }) => (
          <div key={label} className="px-8 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#4c4450] text-[16px]">{icon}</span>
              <span className="text-xs text-[#988d9c] uppercase tracking-widest w-28">{label}</span>
            </div>
            <span className="text-sm text-[#e5e2e1] font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
