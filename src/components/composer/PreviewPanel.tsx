import { FaInstagram, FaLinkedinIn, FaFacebook } from 'react-icons/fa';
import { CHANNELS } from '../../domain/entities/Composer';
import type { ChannelId } from '../../domain/entities/Composer';
import IGPreview from './previews/IGPreview';
import LIPreview from './previews/LIPreview';
import FBPreview from './previews/FBPreview';

const ICONS: Record<ChannelId, React.ComponentType<{ size?: number }>> = {
  ig: FaInstagram,
  li: FaLinkedinIn,
  fb: FaFacebook,
};

interface PreviewPanelProps {
  caption:          string;
  mediaPreview:     string | null;
  selectedChannels: ChannelId[];
  previewTab:       ChannelId;
  onTabChange:      (id: ChannelId) => void;
}

export default function PreviewPanel({
  caption,
  mediaPreview,
  selectedChannels,
  previewTab,
  onTabChange,
}: PreviewPanelProps) {
  return (
    <section className="w-full bg-[#0e0e0e] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden min-h-0">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#d394ff]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#9400e4]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Platform tabs */}
      <div className="flex gap-1 p-1 bg-[#201f1f]/40 backdrop-blur-md rounded-full mb-8 border border-[#4c4450]/10 z-10">
        {CHANNELS.filter(ch => selectedChannels.includes(ch.id)).map(ch => {
          const Icon = ICONS[ch.id];
          return (
            <button
              key={ch.id}
              onClick={() => onTabChange(ch.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                previewTab === ch.id
                  ? 'bg-[#d394ff] text-[#5e2388] shadow-lg'
                  : 'text-[#988d9c] hover:text-white'
              }`}
            >
              <Icon size={13} />
              {ch.label}
            </button>
          );
        })}
      </div>

      {/* Phone shell */}
      <div
        data-phone-mockup
        className="w-[300px] h-[590px] rounded-[3rem] border-[8px] border-[#353534] shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative z-10 overflow-hidden"
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#353534] rounded-b-2xl z-20" />

        {previewTab === 'ig' && <IGPreview caption={caption} mediaPreview={mediaPreview} />}
        {previewTab === 'li' && <LIPreview caption={caption} mediaPreview={mediaPreview} />}
        {previewTab === 'fb' && <FBPreview caption={caption} mediaPreview={mediaPreview} />}
      </div>

      <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-[#201f1f]/50 border border-[#4c4450]/10 z-10">
        <span className="w-2 h-2 rounded-full bg-[#d394ff] animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#988d9c]">Real-time Preview</span>
      </div>
    </section>
  );
}
