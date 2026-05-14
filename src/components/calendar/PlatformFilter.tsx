import { PLATFORM_REGISTRY, type PlatformId } from '../../domain/entities/Platform';
import SocialBrandIcon from '../shared/SocialBrandIcon';

interface PlatformFilterProps {
  activePlatforms: PlatformId[];
  onToggle:        (id: PlatformId) => void;
}

const FILTER_PLATFORMS: PlatformId[] = ['instagram', 'facebook', 'linkedin'];

export default function PlatformFilter({ activePlatforms, onToggle }: PlatformFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[11px] font-bold uppercase tracking-widest text-[#1C1814] mr-1">Platforms</span>
      {FILTER_PLATFORMS.map(id => {
        const p      = PLATFORM_REGISTRY[id];
        const active = activePlatforms.includes(id);
        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all',
              active
                ? 'border-transparent text-[#1C1814]'
                : 'bg-transparent border-[#1C1814]/20 text-[#6A6470] hover:border-[#1C1814]/40 hover:text-[#1C1814]',
            ].join(' ')}
            style={active ? { background: p.color + '22', borderColor: p.color + '60', color: p.color } : {}}
          >
            <SocialBrandIcon platformId={id} size={13} />
            {p.name}
            {active && (
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.color }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
