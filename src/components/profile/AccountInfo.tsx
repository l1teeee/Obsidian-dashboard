import type { ProfileData } from '../../domain/entities/Profile';

interface AccountInfoProps {
  profile:          ProfileData;
  onEdit:           () => void;
  onChangePassword: () => void;
}

export default function AccountInfo({ profile, onEdit, onChangePassword }: AccountInfoProps) {
  const rows = [
    { label: 'Full Name',    value: profile.name     || '—', icon: 'person'         },
    { label: 'Email',        value: profile.email,            icon: 'mail'           },
    { label: 'Role',         value: profile.role     || '—', icon: 'work'           },
    { label: 'Country',      value: profile.country  || '—', icon: 'public'         },
    { label: 'Timezone',     value: profile.timezone,         icon: 'schedule'       },
    { label: 'Member Since', value: profile.created_at || '—', icon: 'calendar_today' },
  ];

  return (
    <div data-section className="bg-[#F1F5F9] rounded-3xl border border-[#0F172A]/10 overflow-hidden">
      <div className="px-8 py-5 border-b border-[#0F172A]/5 flex items-center justify-between bg-[#E2E8F0]/20">
        <h3 className="font-headline font-bold text-[#0F172A] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#111827] text-[18px]">manage_accounts</span>
          Account Information
        </h3>
        <button
          onClick={onEdit}
          className="text-[10px] text-[#111827] font-bold uppercase tracking-widest hover:text-[#0F172A] transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[12px]">edit</span>
          Edit
        </button>
      </div>
      <div className="divide-y divide-[#0F172A]/5">
        {rows.map(({ label, value, icon }) => (
          <div key={label} className="px-8 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#0F172A] text-[16px]">{icon}</span>
              <span className="text-xs text-[#64748B] uppercase tracking-widest w-28">{label}</span>
            </div>
            <span className="text-sm text-[#0F172A] font-medium">{value}</span>
          </div>
        ))}
        <div className="px-8 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#0F172A] text-[16px]">lock</span>
            <span className="text-xs text-[#64748B] uppercase tracking-widest w-28">Password</span>
          </div>
          <button
            onClick={onChangePassword}
            className="text-xs text-[#111827] font-semibold hover:text-[#e8b5ff] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">lock_reset</span>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
