import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { generateImage, generateCarouselSlides, editImage } from '../../services/ai.service';
import { uploadFile } from '../../services/media.service';

// ── Types ─────────────────────────────────────────────────────────────────────

type ImageSize   = '1024x1024' | '1792x1024' | '1024x1792';
type ModalScreen = 'form' | 'preview' | 'edit-preview';

interface GeneratedResult {
  dataUrl:        string;
  sourceUrl:      string;
  revisedPrompt:  string | null;
  originalPrompt: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CAROUSEL_STYLE_PRESETS: { label: string; icon: string; value: string }[] = [
  { label: 'Educational', icon: '📚', value: 'flat vector illustration, bold outlines, vibrant colors, clean white background, simple shapes, infographic style' },
  { label: 'Minimal',     icon: '▪',  value: 'minimalist illustration, thin lines, soft pastel palette, white background, clean and simple' },
  { label: 'Realistic',   icon: '📷', value: 'professional photography, natural lighting, sharp focus, cinematic composition, realistic' },
  { label: 'Bold',        icon: '⬛', value: 'bold graphic design, high contrast colors, geometric shapes, modern poster style, striking visuals' },
  { label: 'Watercolor',  icon: '🎨', value: 'watercolor illustration, soft brushstrokes, warm pastel tones, artistic, hand-painted look' },
  { label: '3D',          icon: '🧊', value: 'isometric 3D illustration, vibrant colors, clean background, modern digital art, polished render' },
];

const SIZE_OPTIONS: { value: ImageSize; label: string; icon: string }[] = [
  { value: '1024x1024', label: 'Square',    icon: 'crop_square'    },
  { value: '1792x1024', label: 'Landscape', icon: 'crop_landscape' },
  { value: '1024x1792', label: 'Portrait',  icon: 'crop_portrait'  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res  = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'image/png' });
}

const EDIT_MAX_PX = 1024;

async function resizeForEdit(dataUrl: string): Promise<string> {
  if (!dataUrl.startsWith('blob:') && !dataUrl.startsWith('http')) return dataUrl;
  const blob = await fetch(dataUrl).then(r => r.blob());
  return new Promise(resolve => {
    const img = new Image();
    const tmp = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(tmp);
      const scale  = Math.min(1, EDIT_MAX_PX / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(img.naturalWidth  * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(tmp); resolve(dataUrl); };
    img.src = tmp;
  });
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface AIGeneratorModalProps {
  isOpen:           boolean;
  onClose:          () => void;
  onImageGenerated: (blobUrl: string, sourceUrl: string, prompt?: string) => void;
  availableSlots:   number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AIGeneratorModal({
  isOpen,
  onClose,
  onImageGenerated,
  availableSlots,
}: AIGeneratorModalProps) {
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

  // ── Screen state ──────────────────────────────────────────────────────────
  const [screen,          setScreen]          = useState<ModalScreen>('form');
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);

  // ── Generation form ───────────────────────────────────────────────────────
  const [genMode,         setGenMode]         = useState<'single' | 'carousel'>('single');
  const [prompt,          setPrompt]          = useState('');
  const [size,            setSize]            = useState<ImageSize>('1024x1024');
  const [carouselTopic,   setCarouselTopic]   = useState('');
  const [carouselCount,   setCarouselCount]   = useState(4);
  const [carouselStyle,   setCarouselStyle]   = useState('');
  const [showCustomStyle, setShowCustomStyle] = useState(false);
  const [carouselSlides,  setCarouselSlides]  = useState<string[]>([]);
  const [slidesLoading,   setSlidesLoading]   = useState(false);
  const [slidesError,     setSlidesError]     = useState<string | null>(null);
  const [expandedSlides,  setExpandedSlides]  = useState<Set<number>>(new Set());
  const [genLoading,      setGenLoading]      = useState(false);
  const [genError,        setGenError]        = useState<string | null>(null);
  const [genProgress,     setGenProgress]     = useState<{ current: number; total: number } | null>(null);

  // ── Edit-in-preview state ─────────────────────────────────────────────────
  const [editPrompt,    setEditPrompt]    = useState('');
  const [editLoading,   setEditLoading]   = useState(false);
  const [editError,     setEditError]     = useState<string | null>(null);
  const [showPromptTip, setShowPromptTip] = useState(false);
  const [promptCopied,  setPromptCopied]  = useState(false);

  function copyPrompt(text: string) {
    navigator.clipboard.writeText(text);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  }

  function handleClose() {
    if (genLoading || editLoading) return;
    onClose();
  }

  // Reset form-level transient state when going back to form
  function goBackToForm() {
    setScreen('form');
    setGeneratedResult(null);
    setGenError(null);
    setEditPrompt('');
    setEditError(null);
  }

  // ── Generate slide prompts (carousel) ────────────────────────────────────
  async function handleGenerateSlides() {
    const trimmed = carouselTopic.trim();
    if (!trimmed || slidesLoading) return;
    setSlidesLoading(true);
    setSlidesError(null);
    try {
      const result = await generateCarouselSlides({
        topic: trimmed,
        count: carouselCount,
        style: carouselStyle.trim() || undefined,
      });
      setCarouselSlides(result.slides);
      setExpandedSlides(new Set());
    } catch (err) {
      setSlidesError((err as Error).message ?? 'Could not generate slide prompts.');
    } finally {
      setSlidesLoading(false);
    }
  }

  // ── Generate image(s) ─────────────────────────────────────────────────────
  async function handleGenerate() {
    setGenLoading(true);
    setGenError(null);
    setGenProgress(null);

    if (genMode === 'carousel') {
      // Carousel: add directly (previewing N images would be overwhelming)
      const slides = carouselSlides.map(s => s.trim()).filter(Boolean);
      const total  = Math.min(slides.length, availableSlots);
      if (total === 0) { setGenLoading(false); return; }
      try {
        for (let i = 0; i < total; i++) {
          setGenProgress({ current: i + 1, total });
          const result = await generateImage({ prompt: slides[i], size: '1024x1024' });
          const file   = await dataUrlToFile(result.dataUrl, `slide-${i + 1}.png`);
          const upload = await uploadFile(file);
          onImageGenerated(result.dataUrl, upload.url, slides[i]);
        }
        // Show success then close
        setTimeout(onClose, 1500);
      } catch (err) {
        setGenError((err as Error).message ?? 'Image generation failed.');
      } finally {
        setGenLoading(false);
        setGenProgress(null);
      }
    } else {
      // Single: go to preview screen
      const trimmed = prompt.trim();
      if (!trimmed || availableSlots === 0) { setGenLoading(false); return; }
      try {
        const result = await generateImage({ prompt: trimmed, size });
        const file   = await dataUrlToFile(result.dataUrl, 'ai-generated.png');
        const upload = await uploadFile(file);
        setGeneratedResult({ dataUrl: result.dataUrl, sourceUrl: upload.url, revisedPrompt: result.revised_prompt, originalPrompt: trimmed });
        setScreen('preview');
      } catch (err) {
        setGenError((err as Error).message ?? 'Image generation failed.');
      } finally {
        setGenLoading(false);
      }
    }
  }

  // ── Use generated image ───────────────────────────────────────────────────
  function handleUseImage() {
    if (!generatedResult) return;
    onImageGenerated(generatedResult.dataUrl, generatedResult.sourceUrl, generatedResult.originalPrompt);
    onClose();
  }

  // ── Edit generated image ──────────────────────────────────────────────────
  async function handleEditGenerated() {
    if (!generatedResult || !editPrompt.trim() || editLoading) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const imageDataUrl = await resizeForEdit(generatedResult.dataUrl);
      const result  = await editImage({ imageDataUrl, instruction: editPrompt.trim() });
      const file    = await dataUrlToFile(result.dataUrl, 'ai-edit.png');
      const upload  = await uploadFile(file);
      setGeneratedResult(prev => ({ ...prev!, dataUrl: result.dataUrl, sourceUrl: upload.url, revisedPrompt: null, originalPrompt: editPrompt.trim() }));
      setEditPrompt('');
      setScreen('preview');
    } catch (err) {
      setEditError((err as Error).message ?? 'Edit failed. Try again.');
    } finally {
      setEditLoading(false);
    }
  }

  function toggleSlide(idx: number) {
    setExpandedSlides(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }

  function getSlideTitle(slide: string): string {
    const first = slide.split(',')[0].trim();
    return first.length > 52 ? first.slice(0, 49) + '\u2026' : first;
  }

  const filledSlides = carouselSlides.filter(s => s.trim()).length;
  const willGenerate = Math.min(filledSlides, availableSlots);
  const canGenerate  = !genLoading && availableSlots > 0 && (
    genMode === 'single' ? !!prompt.trim() : filledSlides > 0
  );

  if (!isMounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-200 ${
        isVisible ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none pointer-events-none'
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-lg bg-[#1c1b1b] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transition-all duration-200 ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.97] translate-y-3'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#4c4450]/25 shrink-0">
          <div className="flex items-center gap-3">
            {/* Back arrow on preview/edit screens */}
            {screen !== 'form' && (
              <button
                onClick={goBackToForm}
                disabled={editLoading}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-[#988d9c] hover:text-white hover:bg-white/8 transition-all disabled:opacity-30 -ml-1"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-[#d394ff]/15 border border-[#d394ff]/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>
                {screen === 'edit-preview' ? 'auto_fix_high' : 'auto_awesome'}
              </span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-none mb-0.5">
                {screen === 'form'         ? 'AI Image Generator'
                : screen === 'preview'    ? 'Generated Image'
                : 'Edit with AI'}
              </h2>
              <p className="text-[10px] text-[#988d9c]">
                {screen === 'edit-preview' ? 'DALL·E 2 inpainting' : 'DALL·E 3 by OpenAI'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={genLoading || editLoading}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-[#988d9c] hover:text-white hover:bg-white/8 transition-all disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SCREEN: FORM
        ════════════════════════════════════════════════════════════════════ */}
        {screen === 'form' && (
          <>
            {/* Mode toggle */}
            <div className="px-5 pt-4 shrink-0">
              <div className="flex gap-1 p-1 bg-[#252424] rounded-xl border border-[#4c4450]/20">
                {(['single', 'carousel'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setGenMode(mode)}
                    disabled={genLoading}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 ${
                      genMode === mode ? 'bg-[#d394ff]/20 text-[#d394ff]' : 'text-[#988d9c] hover:text-[#cfc2d2]'
                    }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      {mode === 'single' ? 'image' : 'auto_stories'}
                    </span>
                    {mode === 'single' ? 'Single Image' : 'Carousel'}
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
              {/* Single mode */}
              {genMode === 'single' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#988d9c]/70">Describe your image</label>
                    <textarea
                      value={prompt}
                      rows={3}
                      onChange={e => setPrompt(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
                      placeholder="A serene mountain landscape at golden hour, cinematic lighting…"
                      disabled={genLoading}
                      className="w-full bg-[#252424] border border-[#4c4450]/30 rounded-xl px-4 py-3 text-sm text-[#e5e2e1] placeholder:text-[#988d9c]/40 outline-none focus:border-[#d394ff]/50 transition-colors resize-none disabled:opacity-50 leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#988d9c]/70">Aspect ratio</label>
                    <div className="flex gap-2">
                      {SIZE_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setSize(opt.value)}
                          disabled={genLoading}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 ${
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
                  </div>
                </>
              )}

              {/* Carousel mode */}
              {genMode === 'carousel' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#988d9c]/70">Topic</label>
                    <input
                      type="text"
                      value={carouselTopic}
                      onChange={e => { setCarouselTopic(e.target.value); setCarouselSlides([]); setSlidesError(null); }}
                      onKeyDown={e => { if (e.key === 'Enter') handleGenerateSlides(); }}
                      placeholder="What's this carousel about?"
                      disabled={genLoading}
                      className="w-full bg-[#252424] border border-[#4c4450]/30 rounded-xl px-4 py-3 text-sm text-[#e5e2e1] placeholder:text-[#988d9c]/40 outline-none focus:border-[#d394ff]/50 transition-colors disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#988d9c]/70">Visual style</label>
                    <div className="flex flex-wrap gap-1.5">
                      {CAROUSEL_STYLE_PRESETS.map(p => (
                        <button
                          key={p.label}
                          onClick={() => { setCarouselStyle(carouselStyle === p.value ? '' : p.value); setShowCustomStyle(false); }}
                          disabled={genLoading}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all disabled:opacity-50 ${
                            carouselStyle === p.value
                              ? 'bg-[#7c3aed] text-white shadow-sm'
                              : 'bg-[#252424] text-[#988d9c] border border-[#4c4450]/20 hover:border-[#d394ff]/20 hover:text-[#cfc2d2]'
                          }`}
                        >
                          <span className="text-[11px] leading-none">{p.icon}</span>
                          {p.label}
                        </button>
                      ))}
                      <button
                        onClick={() => { setShowCustomStyle(p => !p); if (CAROUSEL_STYLE_PRESETS.some(p => p.value === carouselStyle)) setCarouselStyle(''); }}
                        disabled={genLoading}
                        className={`w-8 h-[34px] rounded-lg text-sm font-bold transition-all disabled:opacity-50 ${
                          showCustomStyle ? 'bg-[#d394ff]/20 text-[#d394ff] border border-[#d394ff]/35' : 'bg-[#252424] text-[#988d9c] border border-[#4c4450]/20 hover:border-[#d394ff]/20 hover:text-[#cfc2d2]'
                        }`}
                      >+</button>
                    </div>
                    {showCustomStyle && (
                      <input type="text" value={carouselStyle} onChange={e => setCarouselStyle(e.target.value)} placeholder="Describe your own visual style…" autoFocus disabled={genLoading}
                        className="w-full bg-[#252424] border border-[#4c4450]/30 rounded-xl px-3 py-2.5 text-[11px] text-[#e5e2e1] placeholder:text-[#988d9c]/40 outline-none focus:border-[#d394ff]/50 transition-colors disabled:opacity-50"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#988d9c]/70">Slides</label>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        {[2, 3, 4, 5, 6].map(n => (
                          <button key={n} onClick={() => { setCarouselCount(n); setCarouselSlides([]); }} disabled={genLoading}
                            className={`w-9 h-9 rounded-xl text-[12px] font-bold transition-all disabled:opacity-50 ${
                              carouselCount === n ? 'bg-[#d394ff]/25 text-[#d394ff] border border-[#d394ff]/40' : 'bg-[#252424] text-[#988d9c] border border-[#4c4450]/20 hover:border-[#d394ff]/20 hover:text-[#cfc2d2]'
                            }`}
                          >{n}</button>
                        ))}
                      </div>
                      <button
                        onClick={handleGenerateSlides}
                        disabled={!carouselTopic.trim() || slidesLoading || genLoading}
                        className="ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#252424] border border-[#d394ff]/25 text-[#d394ff] text-[10px] font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-[#d394ff]/10 hover:border-[#d394ff]/40 transition-all active:scale-[0.98]"
                      >
                        {slidesLoading ? <span className="material-symbols-outlined text-[13px] animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-[13px]">auto_fix_high</span>}
                        {slidesLoading ? 'Working…' : carouselSlides.length > 0 ? 'Regenerate' : 'Generate prompts'}
                      </button>
                    </div>
                  </div>

                  {slidesError && (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/8 border border-red-500/15">
                      <span className="material-symbols-outlined text-red-400 text-[14px]">error</span>
                      <p className="text-[11px] text-red-400">{slidesError}</p>
                    </div>
                  )}

                  {carouselSlides.length > 0 ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-0.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#988d9c]/70">Prompts — click to edit</label>
                        <span className="text-[9px] text-[#988d9c]/50">{carouselSlides.length} slides</span>
                      </div>
                      {carouselSlides.map((slide, i) => (
                        <div key={i} className="rounded-xl border border-[#4c4450]/25 bg-[#252424] overflow-hidden">
                          <button type="button" onClick={() => toggleSlide(i)} className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-[#2a2929] transition-colors">
                            <span className="text-[10px] font-bold text-[#d394ff]/60 w-5 shrink-0 text-right">{i + 1}</span>
                            <span className="flex-1 text-[11px] text-[#cfc2d2] truncate">{getSlideTitle(slide) || `Slide ${i + 1}`}</span>
                            <span className="material-symbols-outlined text-[#988d9c]/40 text-[16px] shrink-0 transition-transform duration-200" style={{ transform: expandedSlides.has(i) ? 'rotate(180deg)' : '' }}>expand_more</span>
                          </button>
                          <div className="overflow-hidden transition-all duration-200 ease-out" style={{ maxHeight: expandedSlides.has(i) ? '160px' : '0px' }}>
                            <div className="px-3 pb-3">
                              <textarea value={slide} rows={1}
                                onChange={e => { const u = [...carouselSlides]; u[i] = e.target.value; setCarouselSlides(u); e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px`; }}
                                ref={el => { if (el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px`; } }}
                                className="w-full bg-[#1e1e1e] border border-[#4c4450]/30 rounded-xl px-3 py-2 text-[11px] text-[#e5e2e1] outline-none focus:border-[#d394ff]/50 transition-colors resize-none leading-relaxed overflow-hidden"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !slidesLoading && !slidesError && (
                      <div className="flex flex-col items-center gap-2 py-4 rounded-xl border border-dashed border-[#4c4450]/30">
                        <span className="material-symbols-outlined text-[#988d9c]/30 text-[28px]">auto_stories</span>
                        <p className="text-[11px] text-[#988d9c]/50 text-center px-4">Enter a topic and click <span className="text-[#d394ff]/70">Generate prompts</span></p>
                      </div>
                    )
                  )}
                </div>
              )}

              {genError && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/8 border border-red-500/15">
                  <span className="material-symbols-outlined text-red-400 text-[14px] shrink-0 mt-0.5">error</span>
                  <p className="text-[11px] text-red-400 leading-relaxed">{genError}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#4c4450]/25 shrink-0 space-y-2.5">
              {genLoading && (
                <div className="flex items-center justify-center gap-2 py-1">
                  <span className="material-symbols-outlined text-[#d394ff] text-[15px] animate-spin">progress_activity</span>
                  <span className="text-[11px] text-[#d394ff]/80 font-medium">
                    {genProgress ? `Generating image ${genProgress.current} of ${genProgress.total}…` : 'Generating…'}
                  </span>
                </div>
              )}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#d394ff] text-[#5e2388] text-sm font-bold uppercase tracking-wider hover:brightness-110 transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                {genMode === 'carousel' && filledSlides > 0
                  ? `Generate ${willGenerate} Image${willGenerate !== 1 ? 's' : ''}`
                  : genMode === 'carousel' ? 'Generate prompts first'
                  : 'Generate Image'}
              </button>
              {availableSlots === 0 && <p className="text-center text-[10px] text-[#988d9c]/60">Maximum media reached (10/10)</p>}
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            SCREEN: PREVIEW
        ════════════════════════════════════════════════════════════════════ */}
        {screen === 'preview' && generatedResult && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 min-h-0">
              {/* Generated image */}
              <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center" style={{ minHeight: 260, maxHeight: 380 }}>
                <img
                  src={generatedResult.dataUrl}
                  alt="Generated"
                  className="w-full h-full object-contain"
                  style={{ maxHeight: 380 }}
                />
              </div>

              {/* Prompt chip — icon + tooltip */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowPromptTip(p => !p)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
                      showPromptTip
                        ? 'bg-[#d394ff]/20 border-[#d394ff]/40 text-[#d394ff]'
                        : 'bg-[#252424] border-[#4c4450]/25 text-[#988d9c] hover:text-[#d394ff] hover:border-[#d394ff]/30'
                    }`}
                    title="View prompt"
                  >
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </button>
                  {showPromptTip && (
                    <div className="absolute bottom-full left-0 mb-2 z-20 w-72">
                      <div className="bg-[#2a2a2a] border border-[#4c4450]/40 rounded-xl p-3 shadow-xl">
                        {generatedResult.revisedPrompt && (
                          <>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#988d9c]/60 mb-1.5">Auto-optimized prompt</p>
                            <p className="text-[11px] text-[#e5e2e1] italic leading-relaxed mb-2.5">"{generatedResult.revisedPrompt}"</p>
                            <div className="border-t border-[#4c4450]/20 pt-2">
                              <button
                                onClick={() => copyPrompt(generatedResult.revisedPrompt!)}
                                className="flex items-center gap-1.5 text-[9px] font-semibold text-[#988d9c] hover:text-[#d394ff] transition-colors"
                              >
                                <span className="material-symbols-outlined text-[11px]">{promptCopied ? 'check' : 'content_copy'}</span>
                                {promptCopied ? 'Copied!' : 'Copy prompt'}
                              </button>
                            </div>
                          </>
                        )}
                        {!generatedResult.revisedPrompt && (
                          <>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#988d9c]/60 mb-1.5">Prompt used</p>
                            <p className="text-[11px] text-[#e5e2e1] italic leading-relaxed mb-2.5">"{generatedResult.originalPrompt}"</p>
                            <div className="border-t border-[#4c4450]/20 pt-2">
                              <button
                                onClick={() => copyPrompt(generatedResult.originalPrompt)}
                                className="flex items-center gap-1.5 text-[9px] font-semibold text-[#988d9c] hover:text-[#d394ff] transition-colors"
                              >
                                <span className="material-symbols-outlined text-[11px]">{promptCopied ? 'check' : 'content_copy'}</span>
                                {promptCopied ? 'Copied!' : 'Copy prompt'}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex ml-3">
                        <div className="w-2.5 h-2.5 bg-[#2a2a2a] border-b border-r border-[#4c4450]/40 rotate-45 -mt-1.5" />
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[#988d9c]/50">
                  {generatedResult.revisedPrompt ? 'Prompt auto-optimized by DALL·E' : 'Image generated'}
                </span>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#4c4450]/20" />
                <span className="text-[10px] text-[#988d9c]/50 uppercase tracking-widest">What next?</span>
                <div className="flex-1 h-px bg-[#4c4450]/20" />
              </div>

              {/* Action cards */}
              <div className="space-y-2">
                {/* Edit with AI */}
                <button
                  onClick={() => setScreen('edit-preview')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#252424] border border-[#ffd166]/20 hover:border-[#ffd166]/40 hover:bg-[#ffd166]/5 transition-all group text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#ffd166]/15 flex items-center justify-center shrink-0 group-hover:bg-[#ffd166]/25 transition-colors">
                    <span className="material-symbols-outlined text-[#ffd166]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>auto_fix_high</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">Edit with AI</p>
                    <p className="text-[10px] text-[#988d9c] mt-0.5">Modify specific elements — change colors, style, objects</p>
                  </div>
                  <span className="material-symbols-outlined text-[#988d9c]/40 group-hover:text-[#ffd166]/60 transition-colors text-[18px]">chevron_right</span>
                </button>

                {/* Try another */}
                <button
                  onClick={goBackToForm}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#252424] border border-[#4c4450]/20 hover:border-[#4c4450]/40 hover:bg-[#2a2929] transition-all group text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#988d9c]/10 flex items-center justify-center shrink-0 group-hover:bg-[#988d9c]/20 transition-colors">
                    <span className="material-symbols-outlined text-[#988d9c]" style={{ fontSize: 18 }}>refresh</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#cfc2d2]">Generate another</p>
                    <p className="text-[10px] text-[#988d9c] mt-0.5">Go back and try a different prompt or style</p>
                  </div>
                  <span className="material-symbols-outlined text-[#988d9c]/40 group-hover:text-[#988d9c]/70 transition-colors text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#4c4450]/25 shrink-0">
              <button
                onClick={handleUseImage}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#d394ff] text-[#5e2388] text-sm font-bold uppercase tracking-wider hover:brightness-110 transition-all active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Use this image
              </button>
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            SCREEN: EDIT PREVIEW
        ════════════════════════════════════════════════════════════════════ */}
        {screen === 'edit-preview' && generatedResult && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 min-h-0">
              {/* Current image (will update after edit) */}
              <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center relative" style={{ minHeight: 220, maxHeight: 300 }}>
                <img
                  src={generatedResult.dataUrl}
                  alt="Image to edit"
                  className={`w-full h-full object-contain transition-opacity duration-300 ${editLoading ? 'opacity-40' : 'opacity-100'}`}
                  style={{ maxHeight: 300 }}
                />
                {editLoading && (
                  <div className="absolute inset-0 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[#ffd166] text-[28px] animate-spin">progress_activity</span>
                  </div>
                )}
              </div>

              {/* Hint */}
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-[#ffd166]/[0.06] border border-[#ffd166]/12">
                <span className="material-symbols-outlined text-[#ffd166]/60 shrink-0 mt-0.5" style={{ fontSize: 13 }}>info</span>
                <p className="text-[10px] text-[#ffd166]/70 leading-snug">
                  Describe only what to change. Everything else will be preserved.
                </p>
              </div>

              {/* Edit instruction */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#988d9c]/70">Instruction</label>
                <input
                  type="text"
                  value={editPrompt}
                  onChange={e => setEditPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleEditGenerated()}
                  placeholder='e.g. "Change the background to a city at night"'
                  disabled={editLoading}
                  autoFocus
                  className="w-full bg-[#252424] border border-[#4c4450]/30 rounded-xl px-4 py-3 text-sm text-[#e5e2e1] placeholder:text-[#988d9c]/40 outline-none focus:border-[#ffd166]/40 transition-colors disabled:opacity-50"
                />
              </div>

              {editError && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/8 border border-red-500/15">
                  <span className="material-symbols-outlined text-red-400 text-[14px] shrink-0 mt-0.5">error</span>
                  <p className="text-[11px] text-red-400 leading-relaxed">{editError}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#4c4450]/25 shrink-0 space-y-2">
              <button
                onClick={handleEditGenerated}
                disabled={!editPrompt.trim() || editLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#ffd166] text-[#1a1400] text-sm font-bold transition-all disabled:opacity-40 hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed"
              >
                {editLoading ? (
                  <><span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>Editing…</>
                ) : (
                  <><span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_fix_high</span>Apply Edit</>
                )}
              </button>
              <button
                onClick={() => setScreen('preview')}
                disabled={editLoading}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] text-[#988d9c] hover:text-white hover:bg-white/5 transition-all disabled:opacity-40"
              >
                Use image as-is
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
