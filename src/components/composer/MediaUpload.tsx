import type { RefObject } from 'react';

interface MediaUploadProps {
  mediaPreview:  string | null;
  fileInputRef:  RefObject<HTMLInputElement | null>;
  onRemove:      () => void;
  onFileChange:  (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MediaUpload({ mediaPreview, fileInputRef, onRemove, onFileChange }: MediaUploadProps) {
  return (
    <div data-editor-section className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">Creative Asset</label>
        {mediaPreview && (
          <button
            onClick={onRemove}
            className="text-[10px] text-[#ffb4ab] hover:text-[#ff6b6b] transition-colors"
          >
            Remove
          </button>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={onFileChange} />
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
  );
}
