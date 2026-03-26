import { useEffect, useRef, useState, forwardRef } from 'react';
import gsap from 'gsap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaInstagram, FaLinkedinIn, FaFacebook } from 'react-icons/fa';
import TopBar from '../components/layout/TopBar';

/* ─── Constants ────────────────────────────────────────── */
const CHANNELS = [
  { id: 'ig', label: 'Instagram', color: '#E4405F', Icon: FaInstagram },
  { id: 'li', label: 'LinkedIn',  color: '#0077B5', Icon: FaLinkedinIn },
  { id: 'fb', label: 'Facebook',  color: '#1877F2', Icon: FaFacebook },
];

const CHAR_LIMITS: Record<string, number> = { ig: 2200, li: 3000, fb: 63206 };

const AI_SUGGESTIONS = [
  'Exploring the intersection of cinematic visuals and digital strategy. The future is editorial. ✨',
  'Behind every great brand is a story worth telling. This is ours. #ObsidianLens',
  "Great content isn't created — it's curated. Discover what's next on the horizon. 🔮",
];

/* ─── Sub-components: platform previews ────────────────── */
interface PreviewProps { caption: string; mediaPreview: string | null; }

function IGPreview({ caption, mediaPreview }: PreviewProps) {
  return (
    <div className="w-full h-full bg-black flex flex-col pt-5">
      <div className="px-4 pb-2 flex justify-between items-center shrink-0">
        <span className="text-white font-bold text-base font-headline">Instagram</span>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-white text-[20px]">favorite</span>
          <span className="material-symbols-outlined text-white text-[20px]">send</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[1.5px] shrink-0">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <span className="material-symbols-outlined text-[#d394ff] text-[12px]">person</span>
            </div>
          </div>
          <span className="text-xs font-bold text-white">obsidian_lens</span>
          <span className="material-symbols-outlined text-blue-400 text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          <span className="ml-auto text-[#0095f6] text-xs font-bold">Follow</span>
        </div>
        <div className="w-full aspect-square bg-[#201f1f] relative">
          {mediaPreview ? (
            <img src={mediaPreview} className="w-full h-full object-cover" alt="" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[#4c4450]">
              <span className="material-symbols-outlined text-[32px]">image</span>
              <span className="text-[9px] font-mono">No media</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center px-3 py-2.5">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-white text-[20px]">favorite</span>
            <span className="material-symbols-outlined text-white text-[20px]">mode_comment</span>
            <span className="material-symbols-outlined text-white text-[20px]">send</span>
          </div>
          <span className="material-symbols-outlined text-white text-[20px]">bookmark</span>
        </div>
        <div className="px-3 pb-4 space-y-1">
          <p className="text-[11px] font-bold text-white">1,248 likes</p>
          <p className="text-[11px] leading-relaxed text-white">
            <span className="font-bold">obsidian_lens </span>
            <span className="text-[#cfc2d2]">{caption || 'Your caption will appear here...'}</span>
          </p>
          <p className="text-[9px] text-[#988d9c] uppercase font-medium">Just now</p>
        </div>
      </div>
      <div className="h-12 border-t border-[#353534] flex justify-around items-center bg-black shrink-0">
        {['home', 'search', 'add_box', 'video_library'].map(icon => (
          <span key={icon} className="material-symbols-outlined text-white text-[20px]">{icon}</span>
        ))}
        <div className="w-6 h-6 rounded-full bg-[#353534]" />
      </div>
    </div>
  );
}

function LIPreview({ caption, mediaPreview }: PreviewProps) {
  return (
    <div className="w-full h-full bg-[#f4f2ee] flex flex-col pt-5">
      <div className="px-3 pb-2 flex items-center justify-between bg-white border-b border-[#e0e0e0] shrink-0">
        <span className="font-black text-[#0077b5] text-lg">in</span>
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-[#666] text-[18px]">search</span>
          <span className="material-symbols-outlined text-[#666] text-[18px]">notifications</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white mx-2 mt-2 rounded-xl border border-[#e0e0e0] overflow-hidden">
          <div className="flex items-start gap-2 p-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#d394ff] to-[#9400e4] p-[1.5px] shrink-0">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[#d394ff] text-[13px]">person</span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-[#191919] leading-tight">Alex Rivera</p>
              <p className="text-[9px] text-[#666] leading-tight">Digital Curator · Obsidian Lens</p>
              <p className="text-[9px] text-[#666]">Just now · <span className="material-symbols-outlined text-[9px] align-middle">public</span></p>
            </div>
            <button className="text-[#0077b5] text-[10px] font-bold border border-[#0077b5] rounded-full px-2 py-0.5 shrink-0">+ Follow</button>
          </div>
          <div className="px-3 pb-2">
            <p className="text-[11px] text-[#191919] leading-relaxed line-clamp-4">
              {caption || 'Your post content will appear here...'}
            </p>
          </div>
          {mediaPreview && <img src={mediaPreview} className="w-full aspect-video object-cover" alt="" />}
          <div className="px-3 py-2 border-t border-[#e0e0e0]">
            <p className="text-[9px] text-[#666] mb-2">42 reactions · 8 comments</p>
            <div className="flex justify-between">
              {[['thumb_up','Like'],['mode_comment','Comment'],['repeat','Repost'],['send','Send']].map(([icon, label]) => (
                <button key={label} className="flex flex-col items-center gap-0.5">
                  <span className="material-symbols-outlined text-[#666] text-[16px]">{icon}</span>
                  <span className="text-[8px] text-[#666]">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-12 bg-white border-t border-[#e0e0e0] flex justify-around items-center shrink-0">
        {['home','group','work','notifications','person'].map(icon => (
          <span key={icon} className="material-symbols-outlined text-[#0077b5] text-[18px]">{icon}</span>
        ))}
      </div>
    </div>
  );
}

function FBPreview({ caption, mediaPreview }: PreviewProps) {
  return (
    <div className="w-full h-full bg-[#f0f2f5] flex flex-col pt-5">
      <div className="px-3 pb-2 flex items-center justify-between bg-white border-b border-[#e4e6eb] shrink-0">
        <span className="font-black text-[#1877f2] text-xl">f</span>
        <div className="flex gap-2">
          {['search','notifications'].map(icon => (
            <div key={icon} className="w-7 h-7 rounded-full bg-[#e4e6eb] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#050505] text-[14px]">{icon}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white mx-2 mt-2 rounded-xl border border-[#e4e6eb] overflow-hidden">
          <div className="flex items-center gap-2 p-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#d394ff] to-[#9400e4] p-[1.5px] shrink-0">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[#d394ff] text-[13px]">person</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#050505]">Alex Rivera</p>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-[#65676b]">Just now ·</span>
                <span className="material-symbols-outlined text-[#65676b] text-[9px]">public</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#65676b] text-[18px] ml-auto">more_horiz</span>
          </div>
          <div className="px-3 pb-2">
            <p className="text-[11px] text-[#050505] leading-relaxed line-clamp-4">
              {caption || 'Your post content will appear here...'}
            </p>
          </div>
          {mediaPreview ? (
            <img src={mediaPreview} className="w-full aspect-video object-cover" alt="" />
          ) : (
            <div className="w-full aspect-video bg-[#f0f2f5] flex items-center justify-center border-t border-b border-[#e4e6eb]">
              <span className="material-symbols-outlined text-[#bcc0c4] text-[32px]">image</span>
            </div>
          )}
          <div className="px-3 pt-2 pb-1">
            <div className="flex justify-between text-[9px] text-[#65676b] pb-2 border-b border-[#e4e6eb]">
              <span>👍 ❤️ 24</span>
              <span>5 comments · 2 shares</span>
            </div>
            <div className="flex justify-around pt-1">
              {[['thumb_up','Like'],['mode_comment','Comment'],['share','Share']].map(([icon, label]) => (
                <button key={label} className="flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-[#f0f2f5]">
                  <span className="material-symbols-outlined text-[#65676b] text-[14px]">{icon}</span>
                  <span className="text-[9px] font-bold text-[#65676b]">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-12 bg-white border-t border-[#e4e6eb] flex justify-around items-center shrink-0">
        {['home','group','ondemand_video','storefront','notifications'].map(icon => (
          <span key={icon} className="material-symbols-outlined text-[#1877f2] text-[18px]">{icon}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Custom datepicker inputs ─────────────────────────── */
interface PickerInputProps { value?: string; onClick?: () => void; }

const DateInput = forwardRef<HTMLButtonElement, PickerInputProps>(({ value, onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    type="button"
    className="flex items-center gap-4 bg-[#1c1b1b] border border-[#4c4450]/30 rounded-2xl p-4 hover:border-[#d394ff]/50 transition-colors w-full text-left cursor-pointer"
  >
    <span className="material-symbols-outlined text-[#d394ff] text-[18px] shrink-0">event</span>
    <div className="flex flex-col">
      <span className="text-[10px] text-[#988d9c] font-bold uppercase tracking-tighter">Date</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
    <span className="material-symbols-outlined text-[#988d9c] ml-auto text-[16px]">expand_more</span>
  </button>
));
DateInput.displayName = 'DateInput';

const TimeInput = forwardRef<HTMLButtonElement, PickerInputProps>(({ value, onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    type="button"
    className="flex items-center gap-4 bg-[#1c1b1b] border border-[#4c4450]/30 rounded-2xl p-4 hover:border-[#d394ff]/50 transition-colors w-full text-left cursor-pointer"
  >
    <span className="material-symbols-outlined text-[#d394ff] text-[18px] shrink-0">schedule</span>
    <div className="flex flex-col">
      <span className="text-[10px] text-[#988d9c] font-bold uppercase tracking-tighter">Time</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
    <span className="material-symbols-outlined text-[#988d9c] ml-auto text-[16px]">expand_more</span>
  </button>
));
TimeInput.displayName = 'TimeInput';

/* ─── Main component ────────────────────────────────────── */
export default function PostComposer() {
  const pageRef     = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [caption,          setCaption]          = useState('');
  const [mediaPreview,     setMediaPreview]      = useState<string | null>(null);
  const [selectedChannels, setSelectedChannels]  = useState<string[]>(['ig']);
  const [previewTab,       setPreviewTab]        = useState('ig');
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date('2024-10-24T09:15:00'));
  const [toast,            setToast]             = useState<string | null>(null);
  const [showSuggestions,  setShowSuggestions]   = useState(false);

  // Cleanup object URL on unmount or change
  useEffect(() => {
    return () => { if (mediaPreview) URL.revokeObjectURL(mediaPreview); };
  }, [mediaPreview]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-editor-panel]',   { x: -30, opacity: 0, duration: 0.55, ease: 'power3.out', delay: 0.1 });
      gsap.from('[data-phone-mockup]',   { scale: 0.92, opacity: 0, duration: 0.6, ease: 'back.out(1.2)', delay: 0.25 });
      gsap.from('[data-editor-section]', { y: 16, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.3 });
    }, pageRef.current!);
    return () => ctx.revert();
  }, []);

  const toggleChannel = (id: string) => {
    setSelectedChannels(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // no deselect last
        const next = prev.filter(c => c !== id);
        // if preview was showing this channel, switch to first remaining
        if (previewTab === id) setPreviewTab(next[0]);
        return next;
      }
      setPreviewTab(id); // switch preview to newly selected channel
      return [...prev, id];
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(URL.createObjectURL(file));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = (type: 'draft' | 'publish' | 'schedule') => {
    const names   = selectedChannels.map(id => CHANNELS.find(c => c.id === id)?.label).join(', ');
    const dateStr = scheduleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = scheduleDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (type === 'draft')    showToast('Draft saved successfully');
    if (type === 'publish')  showToast(`Post published to ${names}`);
    if (type === 'schedule') showToast(`Scheduled for ${dateStr} at ${timeStr} on ${names}`);
  };

  return (
    <div ref={pageRef}>
      <TopBar
        title="Post Composer"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAction('draft')}
              className="text-sm font-medium text-[#988d9c] hover:text-white transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleAction('publish')}
              className="text-sm font-medium border border-[#4c4450]/30 hover:border-[#d394ff] transition-all rounded-xl px-5 py-2 active:scale-95 text-[#e5e2e1]"
            >
              Publish Now
            </button>
            <button
              onClick={() => handleAction('schedule')}
              className="text-sm font-semibold bg-[#d394ff] text-[#5e2388] rounded-xl px-6 py-2 shadow-[0_0_20px_rgba(211,148,255,0.2)] hover:shadow-[0_0_30px_rgba(211,148,255,0.4)] transition-all active:scale-95"
            >
              Schedule Post
            </button>
          </div>
        }
      />

      <div className="flex h-[calc(100vh-60px)] overflow-hidden">

        {/* ── Left: Editor ── */}
        <section data-editor-panel className="w-1/2 p-8 overflow-y-auto border-r border-[#4c4450]/15">
          <div className="max-w-xl mx-auto space-y-8">

            {/* Channel selector */}
            <div data-editor-section className="space-y-3">
              <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">Target Channels</label>
              <div className="flex gap-3">
                {CHANNELS.map(ch => {
                  const active = selectedChannels.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      onClick={() => toggleChannel(ch.id)}
                      className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95 ${
                        active
                          ? 'glass-card border-[#d394ff]'
                          : 'bg-[#201f1f]/50 border-transparent text-[#988d9c] hover:text-[#e5e2e1] hover:bg-[#201f1f]'
                      }`}
                    >
                      <ch.Icon size={17} style={{ color: active ? ch.color : undefined }} />
                      <span className="text-xs font-semibold">{ch.label}</span>
                      {active && (
                        <span className="material-symbols-outlined text-[#d394ff] text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Media upload */}
            <div data-editor-section className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">Creative Asset</label>
                {mediaPreview && (
                  <button
                    onClick={() => { setMediaPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="text-[10px] text-[#ffb4ab] hover:text-[#ff6b6b] transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {mediaPreview ? (
                  <div className="rounded-3xl overflow-hidden aspect-video">
                    <img src={mediaPreview} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
                      <span className="material-symbols-outlined text-white text-[32px]">edit</span>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-3xl border-2 border-dashed border-[#4c4450]/40 bg-[#1c1b1b] flex flex-col items-center justify-center gap-3 transition-all group-hover:border-[#d394ff]/50 group-hover:bg-[#201f1f]">
                    <div className="w-16 h-16 rounded-full bg-[#d394ff]/10 flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-[28px] text-[#d394ff]">cloud_upload</span>
                    </div>
                    <p className="text-sm font-medium text-[#e5e2e1]">Drop your media here or <span className="text-[#d394ff]">browse</span></p>
                    <p className="text-[10px] text-[#988d9c]">High-res JPG, PNG, or MP4 (Max 50MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Caption */}
            <div data-editor-section className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">Caption & Context</label>
                <button
                  onClick={() => setShowSuggestions(p => !p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d394ff]/10 text-[#d394ff] text-[10px] font-bold uppercase tracking-wider hover:bg-[#d394ff]/20 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                  AI Suggestions
                </button>
              </div>

              {showSuggestions && (
                <div className="bg-[#1c1b1b] rounded-2xl border border-[#d394ff]/20 p-3 space-y-1">
                  {AI_SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setCaption(s); setShowSuggestions(false); }}
                      className="w-full text-left p-3 rounded-xl hover:bg-[#d394ff]/10 transition-colors text-xs text-[#cfc2d2] leading-relaxed border border-transparent hover:border-[#d394ff]/20"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative">
                <textarea
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  className="w-full h-48 bg-[#1c1b1b] border border-[#4c4450]/30 rounded-3xl p-6 pb-14 text-[#e5e2e1] focus:ring-2 focus:ring-[#d394ff]/20 focus:border-[#d394ff] outline-none transition-all placeholder:text-[#988d9c]/50 resize-none leading-relaxed"
                  placeholder="What's the story behind this post?"
                />
                {/* Per-channel char counters */}
                <div className="absolute bottom-4 right-5 flex gap-4">
                  {selectedChannels.map(chId => {
                    const limit = CHAR_LIMITS[chId] ?? 2200;
                    const pct = caption.length / limit;
                    const color = pct > 0.9 ? '#ffb4ab' : pct > 0.7 ? '#c5d247' : '#d394ff';
                    return (
                      <div key={chId} className="flex flex-col items-end">
                        <span className="text-[10px] font-mono" style={{ color }}>{chId.toUpperCase()}: {caption.length}/{limit}</span>
                        <div className="h-[2px] w-8 mt-1 rounded-full bg-[#353534] overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-150" style={{ width: `${Math.min(pct * 100, 100)}%`, background: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div data-editor-section className="space-y-3 pb-10">
              <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">Distribution Schedule</label>
              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  selected={scheduleDate}
                  onChange={(date: Date | null) => date && setScheduleDate(date)}
                  dateFormat="MMM d, yyyy"
                  minDate={new Date()}
                  customInput={<DateInput />}
                  popperPlacement="top-start"
                  popperProps={{ strategy: 'fixed' }}
                />
                <DatePicker
                  selected={scheduleDate}
                  onChange={(date: Date | null) => date && setScheduleDate(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  customInput={<TimeInput />}
                  popperPlacement="top-end"
                  popperProps={{ strategy: 'fixed' }}
                />
              </div>
              <p className="text-[10px] text-[#c5d247] font-medium flex items-center gap-2 px-2">
                <span className="material-symbols-outlined text-[13px]">bolt</span>
                System suggested based on audience activity peak.
              </p>
            </div>

          </div>
        </section>

        {/* ── Right: Preview ── */}
        <section className="w-1/2 bg-[#0e0e0e] flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#d394ff]/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#9400e4]/5 blur-[100px] rounded-full pointer-events-none" />

          {/* Platform tabs — solo muestra los canales seleccionados */}
          <div className="flex gap-1 p-1 bg-[#201f1f]/40 backdrop-blur-md rounded-full mb-8 border border-[#4c4450]/10 z-10">
            {CHANNELS.filter(ch => selectedChannels.includes(ch.id)).map(ch => (
              <button
                key={ch.id}
                onClick={() => setPreviewTab(ch.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  previewTab === ch.id
                    ? 'bg-[#d394ff] text-[#5e2388] shadow-lg'
                    : 'text-[#988d9c] hover:text-white'
                }`}
              >
                <ch.Icon size={13} />
                {ch.label}
              </button>
            ))}
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
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#201f1f] border border-[#d394ff]/30 shadow-[0_0_40px_rgba(211,148,255,0.2)]">
          <span className="material-symbols-outlined text-[#d394ff]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span className="text-sm text-white font-medium whitespace-nowrap">{toast}</span>
        </div>
      )}
    </div>
  );
}
