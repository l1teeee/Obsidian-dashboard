import TopBar from '../components/layout/TopBar';
import ChannelSelector from '../components/composer/ChannelSelector';
import MediaUpload from '../components/composer/MediaUpload';
import CaptionEditor from '../components/composer/CaptionEditor';
import SchedulePicker from '../components/composer/SchedulePicker';
import PreviewPanel from '../components/composer/PreviewPanel';
import { useComposer } from '../hooks/useComposer';

export default function PostComposer() {
  const {
    caption, setCaption, mediaPreview, setMediaPreview,
    selectedChannels, previewTab, setPreviewTab,
    scheduleDate, setScheduleDate, toast,
    showSuggestions, setShowSuggestions,
    toggleChannel, handleFileChange, handleAction,
    pageRef, fileInputRef,
  } = useComposer();

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

        {/* Left: Editor */}
        <section data-editor-panel className="w-1/2 p-8 overflow-y-auto border-r border-[#4c4450]/15">
          <div className="max-w-xl mx-auto space-y-8">
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
          </div>
        </section>

        {/* Right: Preview */}
        <PreviewPanel
          caption={caption}
          mediaPreview={mediaPreview}
          selectedChannels={selectedChannels}
          previewTab={previewTab}
          onTabChange={setPreviewTab}
        />
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
