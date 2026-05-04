import type { ProfileData } from '../../domain/entities/Profile';

interface ProfileHeroProps {
  profile:         ProfileData;
  onEdit:          () => void;
  onChangeAvatar:  () => void;
}

export default function ProfileHero({ profile, onEdit, onChangeAvatar }: ProfileHeroProps) {
  return (
    <section data-hero className="glass-card rounded-3xl border border-[#4c4450]/10 overflow-hidden">
      <div className="px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-end gap-4">
            <button
              onClick={onChangeAvatar}
              className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#d394ff] to-[#9400e4] p-[2px] shrink-0 shadow-[0_0_24px_rgba(211,148,255,0.4)] group"
            >
              <div className="w-full h-full rounded-2xl bg-[#1a1919] overflow-hidden flex items-center justify-center">
                {profile.avatar_url
                  ? <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  : <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 32 }}>person</span>
                }
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontSize: 20 }}>photo_camera</span>
              </div>
            </button>
            <div className="mb-1">
              <h2 className="font-headline text-2xl font-extrabold text-white tracking-tight">{profile.name || 'No name set'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#988d9c]">
                  {profile.role || 'No role set'}{profile.country ? ` · ${profile.country}` : ''}
                </span>
                {profile.plan && (
                  <span className="px-2 py-0.5 rounded-full bg-[#d394ff]/15 border border-[#d394ff]/30 text-[#d394ff] text-[10px] font-bold uppercase tracking-wider capitalize">
                    {profile.plan} Plan
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2 rounded-xl border border-[#4c4450]/30 text-sm text-[#e5e2e1] hover:border-[#d394ff]/50 hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Edit Profile
          </button>
        </div>

      </div>
    </section>
  );
}
