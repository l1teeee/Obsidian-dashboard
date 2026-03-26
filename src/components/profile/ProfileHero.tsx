import type { ProfileData, ProfileStat } from '../../domain/entities/Profile';

interface ProfileHeroProps {
  profile:    ProfileData;
  stats:      ProfileStat[];
  onEdit:     () => void;
}

export default function ProfileHero({ profile, stats, onEdit }: ProfileHeroProps) {
  return (
    <section data-hero className="glass-card rounded-3xl border border-[#4c4450]/10 overflow-hidden">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-[#9400e4]/40 via-[#d394ff]/20 to-[#0e0e0e] relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=1200&q=40')] bg-cover bg-center opacity-10" />
      </div>

      <div className="px-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-6">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#d394ff] to-[#9400e4] p-[2px] shrink-0 shadow-[0_0_24px_rgba(211,148,255,0.4)]">
              <div className="w-full h-full rounded-2xl bg-[#1a1919] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 32 }}>person</span>
              </div>
            </div>
            <div className="mb-1">
              <h2 className="font-headline text-2xl font-extrabold text-white tracking-tight">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#988d9c]">{profile.role} · Obsidian Lens</span>
                <span className="px-2 py-0.5 rounded-full bg-[#d394ff]/15 border border-[#d394ff]/30 text-[#d394ff] text-[10px] font-bold uppercase tracking-wider">Pro Plan</span>
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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} data-stat className="bg-[#1c1b1b] rounded-2xl p-4 border border-[#4c4450]/5 text-center">
              <div className="font-mono text-2xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-[10px] text-[#988d9c] uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
