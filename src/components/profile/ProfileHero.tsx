import type { ProfileData } from '../../domain/entities/Profile';
import InitialsAvatar from '../shared/InitialsAvatar';

interface ProfileHeroProps {
  profile: ProfileData;
  onEdit:  () => void;
}

export default function ProfileHero({ profile, onEdit }: ProfileHeroProps) {
  return (
    <section data-hero className="glass-card rounded-3xl border border-[#0F172A]/10 overflow-hidden">
      <div className="px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-end gap-4">
            <InitialsAvatar name={profile.name || profile.email} size="lg" />
            <div className="mb-1">
              <h2 className="font-headline text-2xl font-extrabold text-[#0F172A] tracking-tight">{profile.name || 'No name set'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#64748B]">
                  {profile.role || 'No role set'}{profile.country ? ` · ${profile.country}` : ''}
                </span>
                {profile.plan && (
                  <span className="px-2 py-0.5 rounded-full bg-[#111827]/15 border border-[#111827]/30 text-[#111827] text-[10px] font-bold uppercase tracking-wider capitalize">
                    {profile.plan} Plan
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2 rounded-xl border border-[#0F172A]/30 text-sm text-[#0F172A] hover:border-[#111827]/50 hover:text-[#0F172A] transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Edit Profile
          </button>
        </div>

      </div>
    </section>
  );
}
