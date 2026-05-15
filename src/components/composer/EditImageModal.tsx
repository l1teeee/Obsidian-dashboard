import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { editImage } from '../../services/ai.service';
import { uploadFile } from '../../services/media.service';
import type { MediaItem } from '../../hooks/useComposer';

// ── Helpers ───────────────────────────────────────────────────────────────────

const EDIT_MAX_PX = 1024;

// gpt-image-1 accepts any PNG — just resize to max 1024px
async function resizeForEdit(url: string): Promise<string> {
  const loadSrc = url.startsWith('data:') ? url : await fetch(url).then(r => r.blob()).then(b => URL.createObjectURL(b));
  return new Promise(resolve => {
    const img    = new Image();
    const isBlob = loadSrc.startsWith('blob:');
    img.onload = () => {
      if (isBlob) URL.revokeObjectURL(loadSrc);
      const scale  = Math.min(1, EDIT_MAX_PX / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(img.naturalWidth  * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => { if (isBlob) URL.revokeObjectURL(loadSrc); resolve(url); };
    img.src = loadSrc;
  });
}

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res  = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'image/png' });
}

// ── Types ─────────────────────────────────────────────────────────────────────

type ModalScreen = 'form' | 'result';

interface EditResult {
  dataUrl:   string;
  sourceUrl: string;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface EditImageModalProps {
  isOpen:     boolean;
  onClose:    () => void;
  item:       MediaItem | null;
  onReplaced: (blobUrl: string, sourceUrl: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function EditImageModal({
  isOpen,
  onClose,
  item,
  onReplaced,
}: EditImageModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
    } else {
      setIsVisible(false);
      const t = setTimeout(() => setIsMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setScreen('form');
        setEditPrompt('');
        setEditError(null);
        setEditResult(null);
        setPreviewSide('edited');
      }, 220);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const [screen,        setScreen]        = useState<ModalScreen>('form');
  const [editResult,    setEditResult]    = useState<EditResult | null>(null);
  const [previewSide,   setPreviewSide]   = useState<'original' | 'edited'>('edited');
  const [showPromptTip, setShowPromptTip] = useState(false);
  const [promptCopied,  setPromptCopied]  = useState(false);

  const [editPrompt,  setEditPrompt]  = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError,   setEditError]   = useState<string | null>(null);

  function copyInstruction() {
    navigator.clipboard.writeText(editPrompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  }

  async function handleEdit() {
    if (!item || !editPrompt.trim() || editLoading) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const imageDataUrl = await resizeForEdit(item.previewUrl);
      const result  = await editImage({ imageDataUrl, instruction: editPrompt.trim() });
      const file    = await dataUrlToFile(result.dataUrl, 'ai-edit.png');
      const upload  = await uploadFile(file);
      setEditResult({ dataUrl: result.dataUrl, sourceUrl: upload.url });
      setPreviewSide('edited');
      setScreen('result');
    } catch (err) {
      setEditError((err as Error).message ?? 'Edit failed. Try again.');
    } finally {
      setEditLoading(false);
    }
  }

  function handleAccept() {
    if (!editResult) return;
    onReplaced(editResult.dataUrl, editResult.sourceUrl);
  }

  function handleTryAgain() {
    setScreen('form');
    setEditResult(null);
    setEditError(null);
    // Keep editPrompt so user can tweak it
  }

  if (!isMounted || !item) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-200 ${
        isVisible ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none pointer-events-none'
      }`}
      onClick={() => !editLoading && onClose()}
    >
      <div
        className={`relative w-full max-w-md bg-[#FBF8F2] rounded-2xl shadow-2xl flex flex-col transition-all duration-200 ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.97] translate-y-3'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#15140F]/25">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ffd166]/15 border border-[#ffd166]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#ffd166]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>edit</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#15140F] leading-none mb-0.5">
                {screen === 'form' ? 'Edit Image' : 'Compare Result'}
              </h2>
              <p className="text-[10px] text-[#6B655B]">DALL·E 2 inpainting</p>
            </div>
          </div>
          <button
            onClick={() => !editLoading && onClose()}
            disabled={editLoading}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-[#6B655B] hover:text-[#15140F] hover:bg-white/8 transition-all disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SCREEN: FORM
        ════════════════════════════════════════════════════════════════════ */}
        {screen === 'form' && (
          <div className="px-5 py-5 space-y-4">
            {/* Image preview */}
            <div className="rounded-2xl overflow-hidden relative" style={{ aspectRatio: '4/3', maxHeight: 240 }}>
              {editLoading ? (
                <>
                  <div className="absolute inset-0 bg-[#252424] animate-pulse" />
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </>
              ) : (
                <img src={item.previewUrl} alt="" className="w-full h-full object-contain bg-[#111]" />
              )}
            </div>

            {/* Hint */}
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-[#ffd166]/[0.06] border border-[#ffd166]/12">
              <span className="material-symbols-outlined text-[#ffd166]/60 shrink-0 mt-0.5" style={{ fontSize: 13 }}>info</span>
              <p className="text-[10px] text-[#ffd166]/70 leading-snug">
                Describe only what to change. Everything else will be preserved.
              </p>
            </div>

            {/* Instruction */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#6B655B]/70">Instruction</label>
              <input
                type="text"
                value={editPrompt}
                onChange={e => setEditPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEdit()}
                placeholder='e.g. "Make the sky sunset colors"'
                disabled={editLoading}
                autoFocus
                className="w-full bg-[#252424] border border-[#15140F]/30 rounded-xl px-4 py-3 text-sm text-[#15140F] placeholder:text-[#6B655B]/40 outline-none focus:border-[#ffd166]/40 transition-colors disabled:opacity-50"
              />
            </div>

            {editError && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/8 border border-red-500/15">
                <span className="material-symbols-outlined text-red-400 text-[14px] shrink-0 mt-0.5">error</span>
                <p className="text-[11px] text-red-400 leading-relaxed">{editError}</p>
              </div>
            )}

            {/* Apply button */}
            <button
              onClick={handleEdit}
              disabled={!editPrompt.trim() || editLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#ffd166] text-[#1a1400] text-sm font-bold transition-all disabled:opacity-40 hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
              Apply Edit
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            SCREEN: RESULT (before / after)
        ════════════════════════════════════════════════════════════════════ */}
        {screen === 'result' && editResult && (
          <div className="px-5 py-5 space-y-4">
            {/* Toggle tabs */}
            <div className="flex gap-1 p-1 bg-[#252424] rounded-xl border border-[#15140F]/20">
              {(['original', 'edited'] as const).map(side => (
                <button
                  key={side}
                  onClick={() => setPreviewSide(side)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-[11px] font-bold uppercase tracking-wider transition-all ${
                    previewSide === side
                      ? side === 'edited'
                        ? 'bg-[#ffd166]/20 text-[#ffd166]'
                        : 'bg-white/10 text-[#15140F]'
                      : 'text-[#6B655B] hover:text-[#3D3A30]'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                    {side === 'original' ? 'image' : 'edit'}
                  </span>
                  {side === 'original' ? 'Original' : 'Edited'}
                </button>
              ))}
            </div>

            {/* Image display */}
            <div className="rounded-2xl overflow-hidden bg-[#111] flex items-center justify-center relative" style={{ aspectRatio: '4/3', maxHeight: 280 }}>
              {/* Original */}
              <img
                src={item.previewUrl}
                alt="Original"
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${previewSide === 'original' ? 'opacity-100' : 'opacity-0'}`}
              />
              {/* Edited */}
              <img
                src={editResult.dataUrl}
                alt="Edited"
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${previewSide === 'edited' ? 'opacity-100' : 'opacity-0'}`}
              />
              {/* Label badge */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                previewSide === 'edited'
                  ? 'bg-[#ffd166]/80 text-[#1a1400]'
                  : 'bg-white/20 text-[#15140F] backdrop-blur-sm'
              }`}>
                {previewSide === 'edited' ? 'Edited' : 'Original'}
              </div>
            </div>

            {/* Instruction — icon + tooltip */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowPromptTip(p => !p)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
                    showPromptTip
                      ? 'bg-[#ffd166]/20 border-[#ffd166]/40 text-[#ffd166]'
                      : 'bg-[#252424] border-[#15140F]/25 text-[#6B655B] hover:text-[#ffd166] hover:border-[#ffd166]/30'
                  }`}
                  title="View instruction"
                >
                  <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
                </button>
                {showPromptTip && (
                  <div className="absolute bottom-full left-0 mb-2 z-20 w-64">
                    <div className="bg-[#E7E0D0] border border-[#15140F]/40 rounded-xl p-3 shadow-xl">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B655B]/60 mb-1.5">Instruction used</p>
                      <p className="text-[11px] text-[#15140F] italic leading-relaxed">"{editPrompt}"</p>
                      <button
                        onClick={copyInstruction}
                        className="mt-2.5 flex items-center gap-1.5 text-[9px] font-semibold text-[#6B655B] hover:text-[#ffd166] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[11px]">{promptCopied ? 'check' : 'content_copy'}</span>
                        {promptCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="flex ml-3">
                      <div className="w-2.5 h-2.5 bg-[#E7E0D0] border-b border-r border-[#15140F]/40 rotate-45 -mt-1.5" />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-[#6B655B]/60 italic truncate">"{editPrompt}"</p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              {/* Accept */}
              <button
                onClick={handleAccept}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#ffd166] text-[#1a1400] text-sm font-bold transition-all hover:brightness-110 active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Use edited version
              </button>

              {/* Try again */}
              <button
                onClick={handleTryAgain}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#252424] border border-[#15140F]/25 text-[#3D3A30] text-sm font-semibold hover:border-[#15140F]/50 hover:bg-[#2a2929] transition-all active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                Try different instruction
              </button>

              {/* Keep original */}
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] text-[#6B655B] hover:text-[#15140F] hover:bg-white/5 transition-all"
              >
                Keep original
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
