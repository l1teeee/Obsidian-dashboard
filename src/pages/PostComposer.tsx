import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import TopBar from '../components/layout/TopBar';
import ChannelSelector from '../components/composer/ChannelSelector';
import MediaUpload from '../components/composer/MediaUpload';
import CaptionEditor from '../components/composer/CaptionEditor';
import SchedulePicker from '../components/composer/SchedulePicker';
import PreviewPanel from '../components/composer/PreviewPanel';
import ScrollArea from '../components/shared/ScrollArea';
import { useComposer, type ActionType } from '../hooks/useComposer';

type MobileTab = 'edit' | 'preview';

const ACTION_COPY: Record<ActionType, { eyebrow: string; title: string; sub: string; icon: string }> = {
  draft:    { eyebrow: 'Draft saved',  title: 'Saved to drafts',      sub: 'You can edit and publish it anytime.',    icon: 'draft' },
  publish:  { eyebrow: 'Published',    title: 'Post is live!',         sub: 'Your content is now public.',            icon: 'rocket_launch' },
  schedule: { eyebrow: 'Scheduled',    title: 'Ready to go!',          sub: 'We\'ll publish it at the chosen time.',  icon: 'schedule_send' },
};

export default function PostComposer() {
  const navigate     = useNavigate();
  const overlayRef   = useRef<HTMLDivElement>(null);
  const circleRef    = useRef<SVGCircleElement>(null);
  const checkRef     = useRef<SVGPathElement>(null);
  const [done, setDone]     = useState(false);
  const [actionMeta, setActionMeta] = useState<{ type: ActionType; names: string } | null>(null);

  const playSuccess = useCallback((type: ActionType, names: string) => {
    setActionMeta({ type, names });
    setDone(true);

    requestAnimationFrame(() => {
      const overlay = overlayRef.current;
      const circle  = circleRef.current;
      const path    = checkRef.current;
      if (!overlay || !circle || !path) return;

      const circleLen = circle.getTotalLength?.() ?? 163;
      const pathLen   = path.getTotalLength?.() ?? 30;

      gsap.set(overlay, { opacity: 0, display: 'flex' });
      gsap.set(circle,  { strokeDasharray: circleLen, strokeDashoffset: circleLen });
      gsap.set(path,    { strokeDasharray: pathLen,   strokeDashoffset: pathLen });

      const tl = gsap.timeline({ onComplete: () => { navigate('/posts'); } });

      tl.to(overlay, { opacity: 1, duration: 0.35, ease: 'power2.out' })
        .to('[data-orb-a]', { scale: 1.4, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.1')
        .to('[data-orb-b]', { scale: 1.4, opacity: 1, duration: 0.7, ease: 'power2.out' }, '<')
        .to(circle, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }, '-=0.4')
        .to(path,   { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, '-=0.1')
        .to('[data-check-wrap]', { filter: 'drop-shadow(0 0 20px rgba(211,148,255,0.85))', duration: 0.4, ease: 'power2.out' }, '-=0.1')
        .from('[data-success-line]', { opacity: 0, y: 12, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, '-=0.2')
        .to({}, { duration: 1.6 });
    });
  }, [navigate]);

  const {
    caption, setCaption, mediaPreview, setMediaPreview,
    selectedChannels, previewTab, setPreviewTab,
    scheduleDate, setScheduleDate, toast,
    showSuggestions, setShowSuggestions,
    toggleChannel, handleFileChange, handleAction,
    pageRef, fileInputRef, isSubmitting,
  } = useComposer(playSuccess);

  const [mobileTab, setMobileTab] = useState<MobileTab>('edit');

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = prev; };
  }, []);

  const meta = actionMeta ? ACTION_COPY[actionMeta.type] : null;

  return (
    <div ref={pageRef} className="h-screen flex flex-col relative overflow-hidden">

      {/* ── Success overlay ── */}
      <div
        ref={overlayRef}
        style={{ display: 'none' }}
        className="absolute inset-0 z-[200] flex-col items-center justify-center bg-[#0e0e0e] text-center px-6"
      >
        {/* Ambient orbs */}
        <div data-orb-a className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#d394ff]/10 blur-[120px] opacity-60" />
        <div data-orb-b className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-[#9400e4]/10 blur-[100px] opacity-60" />

        {/* Animated icon */}
        <div data-check-wrap className="mb-8">
          {meta && (
            <div className="w-20 h-20 rounded-3xl bg-[#d394ff]/10 border border-[#d394ff]/20 flex items-center justify-center mb-6 mx-auto">
              <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 36, fontVariationSettings: "'FILL' 1" }}>
                {meta.icon}
              </span>
            </div>
          )}
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" className="-mt-2">
            <circle
              ref={circleRef}
              cx="45" cy="45" r="40"
              stroke="#d394ff" strokeWidth="2"
              strokeLinecap="round"
              fill="rgba(211,148,255,0.04)"
            />
            <path
              ref={checkRef}
              d="M28 46L40 58L63 34"
              stroke="#d394ff" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Text */}
        {meta && (
          <div className="space-y-2">
            <p data-success-line className="text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-[#d394ff]/70">
              {meta.eyebrow}
              {actionMeta?.names ? ` · ${actionMeta.names}` : ''}
            </p>
            <h2 data-success-line className="font-headline text-3xl font-extrabold tracking-tight text-white">
              {meta.title}
            </h2>
            <p data-success-line className="text-sm text-[#adaaaa]/60 mt-2">
              {meta.sub}
            </p>
          </div>
        )}
      </div>

      {/* ── Normal composer UI ── */}
      {!done && (
        <>
          <TopBar
            title="Post Composer"
            actions={
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => handleAction('draft')}
                  disabled={isSubmitting}
                  className="hidden sm:block text-sm font-medium text-[#988d9c] hover:text-white transition-colors disabled:opacity-40"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handleAction('publish')}
                  disabled={isSubmitting}
                  className="hidden sm:block text-sm font-medium border border-[#4c4450]/30 hover:border-[#d394ff] transition-all rounded-xl px-4 py-2 active:scale-95 text-[#e5e2e1] disabled:opacity-40"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleAction('schedule')}
                  disabled={isSubmitting}
                  className="text-sm font-semibold bg-[#d394ff] text-[#5e2388] rounded-xl px-4 md:px-6 py-2 shadow-[0_0_20px_rgba(211,148,255,0.2)] hover:shadow-[0_0_30px_rgba(211,148,255,0.4)] transition-all active:scale-95 disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving…' : 'Schedule'}
                </button>
              </div>
            }
          />

          {/* Mobile tab switcher */}
          <div className="md:hidden flex border-b border-[#4c4450]/15 bg-[#131313] shrink-0">
            {(['edit', 'preview'] as MobileTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                  mobileTab === tab ? 'text-[#d394ff] border-b-2 border-[#d394ff]' : 'text-[#988d9c]'
                }`}
              >
                {tab === 'edit' ? 'Edit' : 'Preview'}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex flex-1 min-h-0">
            <section
              data-editor-panel
              className={`w-full md:w-1/2 flex flex-col border-r border-[#4c4450]/15 min-h-0 ${
                mobileTab === 'preview' ? 'hidden md:flex' : ''
              }`}
            >
              <ScrollArea className="flex-1 min-h-0 p-4 md:p-8">
                <div className="max-w-xl mx-auto space-y-6">
                  <ChannelSelector selectedChannels={selectedChannels} onToggle={toggleChannel} />
                  <MediaUpload
                    mediaPreview={mediaPreview}
                    fileInputRef={fileInputRef}
                    onRemove={() => { setMediaPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    onFileChange={handleFileChange}
                  />
                  <CaptionEditor
                    caption={caption}
                    selectedChannels={selectedChannels}
                    showSuggestions={showSuggestions}
                    onCaptionChange={val => { setCaption(val); setShowSuggestions(false); }}
                    onToggleSuggestions={() => setShowSuggestions(p => !p)}
                  />
                  <SchedulePicker scheduleDate={scheduleDate} onDateChange={setScheduleDate} />

                  {/* Mobile actions */}
                  <div className="flex gap-3 md:hidden pb-4">
                    <button
                      onClick={() => handleAction('draft')}
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl border border-[#4c4450]/30 text-sm font-medium text-[#988d9c] hover:text-white transition-colors disabled:opacity-40"
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={() => handleAction('publish')}
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl border border-[#4c4450]/30 text-sm font-medium text-[#e5e2e1] hover:border-[#d394ff] transition-all disabled:opacity-40"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </ScrollArea>
            </section>

            <div className={`w-full md:w-1/2 min-h-0 ${mobileTab === 'edit' ? 'hidden md:flex' : 'flex'}`}>
              <PreviewPanel
                caption={caption}
                mediaPreview={mediaPreview}
                selectedChannels={selectedChannels}
                previewTab={previewTab}
                onTabChange={setPreviewTab}
              />
            </div>
          </div>

          {/* Toast (errors only) */}
          {toast && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#201f1f] border border-[#d394ff]/30 shadow-[0_0_40px_rgba(211,148,255,0.2)]">
              <span className="material-symbols-outlined text-[#d394ff]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-sm text-white font-medium whitespace-nowrap">{toast}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
