import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

interface ComposeDrawerProps {
  open:    boolean;
  onClose: () => void;
}

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { id: 'facebook',  label: 'Facebook',  color: '#1877F2', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { id: 'linkedin',  label: 'LinkedIn',  color: '#0A66C2', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
];

export default function ComposeDrawer({ open, onClose }: ComposeDrawerProps) {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const panelRef    = useRef<HTMLDivElement>(null);

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [caption,           setCaption]           = useState('');
  const [mode,              setMode]              = useState<'schedule' | 'now'>('schedule');
  const [previewOpen,       setPreviewOpen]       = useState(false);

  const hashtagCount = (caption.match(/#\w+/g) ?? []).length;
  const mentionCount = (caption.match(/@\w+/g) ?? []).length;
  const charCount    = caption.length;
  const maxChars     = 2200;

  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return;

    if (open) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      gsap.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.32, ease: 'power3.out' });
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const handleClose = () => {
    if (!overlayRef.current || !panelRef.current) { onClose(); return; }
    document.body.style.overflow = '';
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.18, ease: 'power2.in' });
    gsap.to(panelRef.current, { x: '100%', duration: 0.22, ease: 'power2.in', onComplete: onClose });
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={handleClose}
        className="absolute inset-0 bg-[#0F172A]/42 backdrop-blur-[2px]"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 flex flex-col bg-[#FFFFFF] border-l border-[#0F172A]/10 shadow-[-28px_0_64px_rgba(15,23,42,0.12)]"
        style={{ width: '460px', maxWidth: '92vw', maxHeight: '100vh', overflowY: 'auto' }}
      >

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#0F172A]/8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F4E0D6] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#111827]" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>add</span>
            </div>
            <div>
              <h2 className="font-headline text-base font-bold text-[#0F172A] tracking-[-0.01em]">New post</h2>
              <p className="text-[11px] text-[#94A3B8]">Draft · auto-saved</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* WHERE TO POST */}
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#64748B] font-bold">Where to post</p>
              <p className="text-[11px] text-[#94A3B8]">
                {selectedPlatforms.length} selected
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map(p => {
                const active = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className={[
                      'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                      active
                        ? 'border-[#111827]/40 bg-[#F4E0D6]/40 text-[#0F172A]'
                        : 'border-[#0F172A]/12 bg-white text-[#64748B] hover:border-[#0F172A]/20',
                    ].join(' ')}
                  >
                    <svg viewBox="0 0 24 24" className="shrink-0" style={{ width: 14, height: 14, fill: active ? p.color : '#94A3B8' }}>
                      <path d={p.icon} />
                    </svg>
                    <span className="text-[12px]">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-[#0F172A]/8 mx-6" />

          {/* CAPTION */}
          <div className="px-6 pt-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#111827]" style={{ fontSize: 13 }}>text_fields</span>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#64748B] font-bold">Caption</p>
              </div>
              <Link
                to="/composer"
                onClick={handleClose}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#111827] hover:text-[#0B1220] transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>auto_awesome</span>
                Write with AI
              </Link>
            </div>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              maxLength={maxChars}
              placeholder="What's the story? Plain over clever. Lead with the verb when you can."
              className="w-full bg-[#F8FAFC] border border-[#0F172A]/10 rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] resize-none outline-none focus:border-[#111827]/40 transition-colors leading-relaxed"
              style={{ minHeight: '120px' }}
            />
            <div className="flex items-center justify-between mt-2 px-0.5">
              <p className="text-[10px] text-[#94A3B8]">
                {hashtagCount} hashtag{hashtagCount !== 1 ? 's' : ''} · {mentionCount} mention{mentionCount !== 1 ? 's' : ''}
              </p>
              <p className={`text-[10px] font-mono ${charCount > maxChars * 0.9 ? 'text-[#B45309]' : 'text-[#94A3B8]'}`}>
                {charCount} / {maxChars}
              </p>
            </div>
          </div>

          <div className="h-px bg-[#0F172A]/8 mx-6" />

          {/* IMAGE OR VIDEO */}
          <div className="px-6 pt-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#111827]" style={{ fontSize: 13 }}>image</span>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#64748B] font-bold">Image or video</p>
              </div>
              <Link
                to="/composer"
                onClick={handleClose}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#111827] hover:text-[#0B1220] transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>auto_awesome</span>
                Generate
              </Link>
            </div>
            <div className="border border-dashed border-[#0F172A]/18 rounded-xl p-6 flex flex-col items-center gap-2 bg-[#F8FAFC] hover:border-[#111827]/35 hover:bg-[#F4E0D6]/20 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[#94A3B8]" style={{ fontSize: 22 }}>upload</span>
              <p className="text-sm text-[#334155]">
                Drop or{' '}
                <Link to="/composer" onClick={handleClose} className="text-[#111827] font-semibold hover:text-[#0B1220]">
                  browse
                </Link>
              </p>
              <p className="text-[10px] text-[#94A3B8]">PNG · JPG · MP4 up to 50 MB</p>
            </div>
          </div>

          <div className="h-px bg-[#0F172A]/8 mx-6" />

          {/* WHEN */}
          <div className="px-6 pt-4 pb-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#64748B] font-bold mb-3">When</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('schedule')}
                className={[
                  'flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all',
                  mode === 'schedule'
                    ? 'border-[#111827]/35 bg-[#F4E0D6]/30'
                    : 'border-[#0F172A]/12 bg-white hover:border-[#0F172A]/20',
                ].join(' ')}
              >
                <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 16 }}>schedule</span>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">Schedule</p>
                  <p className="text-[10px] font-mono text-[#64748B] mt-0.5">Today · 11:00 AM</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMode('now')}
                className={[
                  'flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all',
                  mode === 'now'
                    ? 'border-[#111827]/35 bg-[#F4E0D6]/30'
                    : 'border-[#0F172A]/12 bg-white hover:border-[#0F172A]/20',
                ].join(' ')}
              >
                <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 16 }}>bolt</span>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">Publish now</p>
                  <p className="text-[10px] font-mono text-[#64748B] mt-0.5">Goes live immediately</p>
                </div>
              </button>
            </div>
          </div>

          <div className="h-px bg-[#0F172A]/8 mx-6" />

          {/* SHOW LIVE PREVIEW */}
          <button
            type="button"
            onClick={() => setPreviewOpen(v => !v)}
            className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-[#F1F5F9]/40 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 15 }}>preview</span>
              <span className="text-sm text-[#334155] font-medium">Show live preview</span>
            </div>
            <span
              className="material-symbols-outlined text-[#94A3B8] transition-transform duration-200"
              style={{ fontSize: 18, transform: previewOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              expand_more
            </span>
          </button>
          {previewOpen && (
            <div className="mx-6 mb-4 px-4 py-3 rounded-xl bg-[#F1F5F9] text-[11px] text-[#64748B] text-center">
              Preview available in the full composer.
              <Link to="/composer" onClick={handleClose} className="ml-1 text-[#111827] font-semibold hover:text-[#0B1220]">Open it →</Link>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#0F172A]/8 bg-[#FFFFFF]">
          <div className="px-6 py-3 flex items-center justify-between">
            <Link
              to="/composer"
              onClick={handleClose}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>draft</span>
              Save draft
            </Link>
            <Link
              to="/composer"
              onClick={handleClose}
              className="text-[11px] font-semibold text-[#111827] hover:text-[#0B1220] transition-colors border border-[#111827]/25 rounded-lg px-3 py-1.5 hover:border-[#111827]/50"
            >
              Configuración completa
            </Link>
          </div>
          <div className="px-6 pb-5">
            <Link
              to="/composer"
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#111827] text-white text-sm font-bold hover:bg-[#0B1220] transition-all active:scale-[0.98]"
            >
              Schedule post
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
