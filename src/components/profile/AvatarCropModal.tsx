import { useRef, useState } from 'react';
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from '../ui/image-crop';
import { Slider } from '../ui/slider';
import { uploadFile } from '../../services/media.service';
import { saveAvatarUrl } from '../../services/users.service';

interface AvatarCropModalProps {
  onSave:  (url: string) => void;
  onClose: () => void;
}

function cropToSquare(src: string, size = 512): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const dim = Math.min(img.naturalWidth, img.naturalHeight);
      const sx  = (img.naturalWidth  - dim) / 2;
      const sy  = (img.naturalHeight - dim) / 2;
      const canvas = document.createElement('canvas');
      canvas.width  = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('no context'));
      ctx.drawImage(img, sx, sy, dim, dim, 0, 0, size, size);
      canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/jpeg', 0.9);
    };
    img.onerror = reject;
    img.src = src;
  });
}

export default function AvatarCropModal({ onSave, onClose }: AvatarCropModalProps) {
  const [imageUrl, setImageUrl]   = useState<string | null>(null);
  const [zoom,     setZoom]       = useState(1);
  const [saving,   setSaving]     = useState(false);
  const [error,    setError]      = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10 MB.');
      return;
    }
    setError(null);
    setImageUrl(URL.createObjectURL(file));
    setZoom(1);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSave = async () => {
    if (!imageUrl) return;
    setSaving(true);
    setError(null);
    try {
      const blob    = await cropToSquare(imageUrl, 512);
      const file    = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      const result  = await uploadFile(file);
      await saveAvatarUrl(result.url);
      onSave(result.url);
      onClose();
    } catch {
      setError('Upload failed. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-[#1a1919] border border-[#4c4450]/20 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#4c4450]/10 flex items-center justify-between bg-[#201f1f]">
          <div>
            <h2 className="font-headline font-bold text-white">Upload Photo</h2>
            <p className="text-xs text-[#988d9c] mt-0.5">Drag to reposition, scroll to zoom</p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="w-8 h-8 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-[#988d9c] hover:text-white hover:bg-[#353534] transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!imageUrl ? (
            /* Drop zone */
            <div
              className="h-64 rounded-2xl border-2 border-dashed border-[#4c4450]/40 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#d394ff]/50 hover:bg-[#d394ff]/5 transition-all"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#d394ff]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 28 }}>add_photo_alternate</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">Click or drag to upload</p>
                <p className="text-xs text-[#988d9c] mt-1">JPG, PNG or WEBP - max 10 MB</p>
              </div>
            </div>
          ) : (
            /* Cropper */
            <div className="space-y-4">
              <Cropper
                className="h-72 w-full rounded-2xl overflow-hidden"
                image={imageUrl}
                zoom={zoom}
                onZoomChange={setZoom}
              >
                <CropperDescription>Avatar preview</CropperDescription>
                <CropperImage />
                <CropperCropArea className="rounded-full" />
              </Cropper>

              <div className="flex items-center gap-3 px-1">
                <span className="material-symbols-outlined text-[#988d9c] text-[16px]">zoom_out</span>
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.05}
                  onValueChange={([v]) => setZoom(v)}
                />
                <span className="material-symbols-outlined text-[#988d9c] text-[16px]">zoom_in</span>
                <span className="text-xs text-[#988d9c] w-8 text-right tabular-nums">{zoom.toFixed(1)}x</span>
              </div>

              <button
                onClick={() => { setImageUrl(null); setZoom(1); fileInputRef.current?.click(); }}
                className="text-xs text-[#988d9c] hover:text-white transition-colors"
              >
                Choose different photo
              </button>
            </div>
          )}

          {error && (
            <p className="text-xs text-[#ffb4ab] px-3 py-2 rounded-xl bg-[#ffb4ab]/10 border border-[#ffb4ab]/20">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#4c4450]/10 flex items-center justify-end gap-3 bg-[#201f1f]">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl border border-[#4c4450]/30 text-sm text-[#988d9c] hover:text-white hover:border-[#4c4450]/60 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => { void handleSave(); }}
            disabled={saving || !imageUrl}
            className="px-6 py-2.5 rounded-xl bg-[#d394ff] text-[#2f004d] text-sm font-bold shadow-[0_0_20px_rgba(211,148,255,0.25)] hover:shadow-[0_0_30px_rgba(211,148,255,0.45)] active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {saving
              ? <><span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span> Uploading…</>
              : 'Save Photo'}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
      </div>
    </div>
  );
}
