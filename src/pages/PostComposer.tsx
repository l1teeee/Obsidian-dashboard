import { useState, useEffect } from 'react';
import TopBar from '../components/layout/TopBar';
import ChannelSelector from '../components/composer/ChannelSelector';
import MediaUpload from '../components/composer/MediaUpload';
import CaptionEditor from '../components/composer/CaptionEditor';
import SchedulePicker from '../components/composer/SchedulePicker';
import PreviewPanel from '../components/composer/PreviewPanel';
import ScrollArea from '../components/shared/ScrollArea';
import { useComposer } from '../hooks/useComposer';

type MobileTab = 'edit' | 'preview';

export default function PostComposer() {
  const {
    caption, setCaption, mediaPreview, setMediaPreview,
    selectedChannels, previewTab, setPreviewTab,
    scheduleDate, setScheduleDate, toast,
    showSuggestions, setShowSuggestions,
    toggleChannel, handleFileChange, handleAction,
    pageRef, fileInputRef,
  } = useComposer();

  const [mobileTab, setMobileTab] = useState<MobileTab>('edit');

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = prev; };
  }, []);

  return (
    <div ref={pageRef} className="h-screen flex flex-col">
      <TopBar
        title="Post Composer"
        actions={
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => handleAction('draft')}
              className="hidden sm:block text-sm font-medium text-[#988d9c] hover:text-white transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleAction('publish')}
              className="hidden sm:block text-sm font-medium border border-[#4c4450]/30 hover:border-[#d394ff] transition-all rounded-xl px-4 py-2 active:scale-95 text-[#e5e2e1]"
            >
              Publish
            </button>
            <button
              onClick={() => handleAction('schedule')}
              className="text-sm font-semibold bg-[#d394ff] text-[#5e2388] rounded-xl px-4 md:px-6 py-2 shadow-[0_0_20px_rgba(211,148,255,0.2)] hover:shadow-[0_0_30px_rgba(211,148,255,0.4)] transition-all active:scale-95"
            >
              Schedule
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
              mobileTab === tab
                ? 'text-[#d394ff] border-b-2 border-[#d394ff]'
                : 'text-[#988d9c]'
            }`}
          >
            {tab === 'edit' ? 'Edit' : 'Preview'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-1 min-h-0">

        {/* Left: Editor */}
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
                onRemove={() => {
                  setMediaPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                onFileChange={handleFileChange}
              />

              <CaptionEditor
                caption={caption}
                selectedChannels={selectedChannels}
                showSuggestions={showSuggestions}
                onCaptionChange={(val) => { setCaption(val); setShowSuggestions(false); }}
                onToggleSuggestions={() => setShowSuggestions(p => !p)}
              />

              <SchedulePicker scheduleDate={scheduleDate} onDateChange={setScheduleDate} />

              {/* Mobile-only action buttons */}
              <div className="flex gap-3 md:hidden pb-4">
                <button
                  onClick={() => handleAction('draft')}
                  className="flex-1 py-3 rounded-xl border border-[#4c4450]/30 text-sm font-medium text-[#988d9c] hover:text-white transition-colors"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handleAction('publish')}
                  className="flex-1 py-3 rounded-xl border border-[#4c4450]/30 text-sm font-medium text-[#e5e2e1] hover:border-[#d394ff] transition-all"
                >
                  Publish
                </button>
              </div>
            </div>
          </ScrollArea>
        </section>

        {/* Right: Preview */}
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
