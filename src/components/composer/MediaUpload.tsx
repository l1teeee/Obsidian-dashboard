import { useState } from 'react';
import type { RefObject } from 'react';

interface MediaUploadProps {
  mediaPreview:  string | null;
  fileInputRef:  RefObject<HTMLInputElement | null>;
  onRemove:      () => void;
  onFileChange:  (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MediaUpload({ mediaPreview, fileInputRef, onRemove, onFileChange }: MediaUploadProps) {
  const [showAI, setShowAI]         = useState(false);
  const [prompt, setPrompt]         = useState('');
  const [generated, setGenerated]   = useState(false);
  const [loading, setLoading]       = useState(false);

  function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    // Simulate generation delay — replace with real AI call
    setTimeout(() => { setLoading(false); setGenerated(true); }, 1800);
  }

  return (
    <div data-editor-section className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">Creative Asset</label>
        <div className="flex items-center gap-2">
          {mediaPreview && (
            <button onClick={onRemove} className="text-[10px] text-[#ffb4ab] hover:text-[#ff6b6b] transition-colors">
              Remove
            </button>
          )}
          <button
            onClick={() => setShowAI(p => !p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${
              showAI
                ? 'bg-[#d394ff]/20 text-[#d394ff] border border-[#d394ff]/30'
                : 'bg-[#d394ff]/10 text-[#d394ff] hover:bg-[#d394ff]/20'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">image_search</span>
            Generate with AI
          </button>
        </div>
      </div>

      {/* AI panel — smooth open/close */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          showAI ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-[#1c1b1b] border border-[#d394ff]/20 rounded-2xl p-4 space-y-3 mb-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[#d394ff] text-[16px]">auto_awesome</span>
              <span className="text-[11px] font-bold text-[#d394ff] uppercase tracking-widest">AI Image Generator</span>
            </div>

            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="Describe the image you want to generate…"
              className="w-full bg-[#252424] border border-[#4c4450]/30 rounded-xl px-4 py-2.5 text-sm text-[#e5e2e1] placeholder:text-[#988d9c]/50 outline-none focus:border-[#d394ff]/50 transition-colors"
            />

            <div className="flex gap-2">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#d394ff] text-[#5e2388] text-xs font-bold uppercase tracking-wider disabled:opacity-40 hover:brightness-110 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                    Generating…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    {generated ? 'Regenerate' : 'Generate'}
                  </>
                )}
              </button>
              {generated && !loading && (
                <button
                  onClick={() => { setGenerated(false); setPrompt(''); }}
                  className="px-3 py-2.5 rounded-xl border border-[#4c4450]/30 text-[#988d9c] text-xs hover:text-[#e5e2e1] hover:border-[#4c4450]/60 transition-all"
                  title="Clear"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {generated && !loading && (
              <p className="text-[10px] text-[#c5d247] flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">check_circle</span>
                Image generated — apply it by selecting it above
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Drop zone */}
      <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={onFileChange} />
      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        {mediaPreview ? (
          <div className="rounded-2xl overflow-hidden h-32">
            <img src={mediaPreview} className="w-full h-full object-cover" alt="Preview" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
              <span className="material-symbols-outlined text-white text-[28px]">edit</span>
            </div>
          </div>
        ) : (
          <div className="h-24 rounded-2xl border-2 border-dashed border-[#4c4450]/40 bg-[#1c1b1b] flex items-center justify-center gap-4 transition-all group-hover:border-[#d394ff]/50 group-hover:bg-[#201f1f]">
            <div className="w-9 h-9 rounded-full bg-[#d394ff]/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px] text-[#d394ff]">cloud_upload</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#e5e2e1]">Drop media or <span className="text-[#d394ff]">browse</span></p>
              <p className="text-[10px] text-[#988d9c]">JPG, PNG, MP4 · Max 50 MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
