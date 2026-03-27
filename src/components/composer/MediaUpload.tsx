import { useState } from 'react';
import type { RefObject } from 'react';
import { generateImage } from '../../services/ai.service';
import type { MediaItem } from '../../hooks/useComposer';

const MAX_MEDIA = 10;

interface MediaUploadProps {
  mediaItems:         MediaItem[];
  fileInputRef:       RefObject<HTMLInputElement | null>;
  onRemove:           (index: number) => void;
  onFileChange:       (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAIImageGenerated: (blobUrl: string, sourceUrl: string) => void;
}

type ImageSize = '1024x1024' | '1792x1024' | '1024x1792';

const SIZE_OPTIONS: { value: ImageSize; label: string; icon: string }[] = [
  { value: '1024x1024', label: 'Square',    icon: 'crop_square'    },
  { value: '1792x1024', label: 'Landscape', icon: 'crop_landscape' },
  { value: '1024x1792', label: 'Portrait',  icon: 'crop_portrait'  },
];

export default function MediaUpload({
  mediaItems,
  fileInputRef,
  onRemove,
  onFileChange,
  onAIImageGenerated,
}: MediaUploadProps) {
  const [showAI,        setShowAI]        = useState(false);
  const [prompt,        setPrompt]        = useState('');
  const [size,          setSize]          = useState<ImageSize>('1024x1024');
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [revisedPrompt, setRevisedPrompt] = useState<string | null>(null);

  const canAddMore = mediaItems.length < MAX_MEDIA;

  async function handleGenerate() {
    const trimmed = prompt.trim();
    if (!trimmed || loading || !canAddMore) return;
    setLoading(true);
    setError(null);
    setRevisedPrompt(null);
    try {
      const result = await generateImage({ prompt: trimmed, size });
      // dataUrl is a base64 data URI — use directly, no cross-origin fetch needed
      onAIImageGenerated(result.dataUrl, result.dataUrl);
      setRevisedPrompt(result.revised_prompt);
    } catch (err) {
      setError((err as Error).message ?? 'Image generation failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-editor-section className="space-y-3">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">Creative Assets</label>
          {mediaItems.length > 0 && (
            <span className="text-[10px] font-bold text-[#d394ff] bg-[#d394ff]/10 px-2 py-0.5 rounded-full">
              {mediaItems.length}/{MAX_MEDIA}
            </span>
          )}
        </div>
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

      {/* AI panel */}
      <div className={`grid transition-all duration-300 ease-in-out ${showAI ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="bg-[#1c1b1b] border border-[#d394ff]/20 rounded-2xl p-4 space-y-3 mb-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d394ff] text-[16px]">auto_awesome</span>
                <span className="text-[11px] font-bold text-[#d394ff] uppercase tracking-widest">AI Image Generator</span>
              </div>
              <span className="text-[9px] text-[#988d9c]/60 uppercase tracking-widest">DALL·E 3</span>
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
              {SIZE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSize(opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                    size === opt.value
                      ? 'bg-[#d394ff]/20 text-[#d394ff] border border-[#d394ff]/30'
                      : 'bg-[#252424] text-[#988d9c] border border-[#4c4450]/20 hover:border-[#d394ff]/20 hover:text-[#cfc2d2]'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading || !canAddMore}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#d394ff] text-[#5e2388] text-xs font-bold uppercase tracking-wider disabled:opacity-40 hover:brightness-110 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                  Generating — this may take a moment…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  {!canAddMore ? `Max ${MAX_MEDIA} images reached` : revisedPrompt ? 'Generate Another' : 'Generate Image'}
                </>
              )}
            </button>

            {error && <p className="text-[10px] text-red-400">{error}</p>}
            {revisedPrompt && !loading && (
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#4c4450]">DALL·E revised your prompt to:</p>
                <p className="text-[10px] text-[#988d9c] leading-relaxed italic">"{revisedPrompt}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media grid */}
      {mediaItems.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {mediaItems.map((item, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-[#1c1b1b]">
              <img src={item.previewUrl} className="w-full h-full object-cover" alt="" />

              {/* Upload in progress overlay */}
              {item.uploading && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-white text-[20px] animate-spin">progress_activity</span>
                  <span className="text-[8px] text-white/80 font-bold uppercase tracking-wider">Uploading…</span>
                </div>
              )}

              {/* Upload error overlay */}
              {item.uploadError && !item.uploading && (
                <div className="absolute inset-0 bg-red-900/70 flex flex-col items-center justify-center gap-1 p-1">
                  <span className="material-symbols-outlined text-red-300 text-[18px]">cloud_off</span>
                  <span className="text-[7px] text-red-200 font-bold text-center leading-tight">Upload failed</span>
                </div>
              )}

              {/* AI badge */}
              {!item.uploading && item.sourceUrl && !item.uploadError && (
                <div className="absolute top-1 left-1 bg-[#d394ff]/80 rounded-md px-1 py-0.5">
                  <span className="text-[7px] font-bold text-[#131313] uppercase tracking-wide">AI</span>
                </div>
              )}

              {/* Index badge */}
              {!item.uploading && (
                <div className="absolute top-1 right-1 bg-black/50 rounded-full w-4 h-4 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">{i + 1}</span>
                </div>
              )}

              {/* Remove button — disabled while uploading */}
              {!item.uploading && (
                <button
                  onClick={() => onRemove(i)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-white text-[22px]">delete</span>
                </button>
              )}
            </div>
          ))}

          {/* Add more button */}
          {canAddMore && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-[#4c4450]/40 bg-[#1c1b1b] flex flex-col items-center justify-center gap-1 hover:border-[#d394ff]/50 hover:bg-[#201f1f] transition-all"
            >
              <span className="material-symbols-outlined text-[#d394ff] text-[20px]">add_photo_alternate</span>
              <span className="text-[9px] text-[#988d9c]">Add more</span>
            </button>
          )}
        </div>
      ) : (
        /* Empty drop zone */
        <div
          className="h-24 rounded-2xl border-2 border-dashed border-[#4c4450]/40 bg-[#1c1b1b] flex items-center justify-center gap-4 cursor-pointer transition-all hover:border-[#d394ff]/50 hover:bg-[#201f1f]"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-9 h-9 rounded-full bg-[#d394ff]/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px] text-[#d394ff]">cloud_upload</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#e5e2e1]">Drop media or <span className="text-[#d394ff]">browse</span></p>
            <p className="text-[10px] text-[#988d9c]">JPG, PNG, MP4 · Max {MAX_MEDIA} files</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
