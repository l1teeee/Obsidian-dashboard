import type { ProfileData } from '../../domain/entities/Profile';

interface ProfileHeroProps {
  profile:         ProfileData;
  onEdit:          () => void;
  onChangeAvatar:  () => void;
}

export default function ProfileHero({ profile, onEdit, onChangeAvatar }: ProfileHeroProps) {
  return (
    <section data-hero className="glass-card rounded-3xl border border-[#15140F]/10 overflow-hidden">
      <div className="px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-end gap-4">
            <button
              onClick={onChangeAvatar}
              className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#C8553A] to-[#D6A86A] p-[2px] shrink-0 shadow-[0_0_24px_rgba(200,85,58,0.4)] group"
            >
              <div className="w-full h-full rounded-2xl bg-[#FBF8F2] overflow-hidden flex items-center justify-center">
                {profile.avatar_url
                  ? <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  : <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 32 }}>person</span>
                }
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="material-symbols-outlined text-[#15140F]" style={{ fontSize: 20 }}>photo_camera</span>
              </div>
            </button>
            <div className="mb-1">
              <h2 className="font-headline text-2xl font-extrabold text-[#15140F] tracking-tight">{profile.name || 'No name set'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#6B655B]">
                  {profile.role || 'No role set'}{profile.country ? ` · ${profile.country}` : ''}
                </span>
                {profile.plan && (
                  <span className="px-2 py-0.5 rounded-full bg-[#C8553A]/15 border border-[#C8553A]/30 text-[#C8553A] text-[10px] font-bold uppercase tracking-wider capitalize">
                    {profile.plan} Plan
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2 rounded-xl border border-[#15140F]/30 text-sm text-[#15140F] hover:border-[#C8553A]/50 hover:text-[#15140F] transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Edit Profile
          </button>
        </div>

      </div>
    </section>
  );
}
