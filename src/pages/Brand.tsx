import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useWorkspace } from '../contexts/WorkspaceContext';

// ── Color utilities ───────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

function deriveColorSystem(primary: string): ColorSystem {
  const [h, s, l] = hexToHsl(primary);
  return {
    PRIMARY:      primary,
    BRAND_LIGHT:  hslToHex(h, Math.max(s - 10, 0), Math.min(l + 22, 93)),
    BRAND_DARK:   hslToHex(h, Math.min(s + 8, 100), Math.max(l - 22, 8)),
    LIGHT_BG:     hslToHex(h, Math.max(s - 50, 5), 96),
    LIGHT_BORDER: hslToHex(h, Math.max(s - 20, 10), Math.min(l + 28, 88)),
    DARK_BG:      hslToHex(h, Math.min(s + 5, 100), Math.max(l - 48, 6)),
  };
}

function isValidHex(v: string) {
  return /^#[0-9a-fA-F]{6}$/.test(v);
}

async function extractColorsFromImage(file: File, count = 6): Promise<string[]> {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const size = 80;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      URL.revokeObjectURL(url);

      const buckets: Map<string, number> = new Map();
      for (let i = 0; i < data.length; i += 4 * 3) {
        const a = data[i + 3];
        if (a < 128) continue;
        // quantize to 32-step buckets
        const r = Math.round(data[i]     / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        // skip near-white and near-black
        if (r > 220 && g > 220 && b > 220) continue;
        if (r < 30  && g < 30  && b < 30)  continue;
        const key = `${r},${g},${b}`;
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      }

      const sorted = [...buckets.entries()].sort((a, b) => b[1] - a[1]);
      const colors: string[] = [];
      for (const [key] of sorted) {
        if (colors.length >= count) break;
        const [r, g, b] = key.split(',').map(Number);
        const hex = '#' + [r, g, b].map(x => Math.min(x, 255).toString(16).padStart(2, '0')).join('');
        // ensure minimum contrast between picked colors
        const tooClose = colors.some(existing => {
          const [er, eg, eb] = [
            parseInt(existing.slice(1, 3), 16),
            parseInt(existing.slice(3, 5), 16),
            parseInt(existing.slice(5, 7), 16),
          ];
          return Math.abs(r - er) + Math.abs(g - eg) + Math.abs(b - eb) < 80;
        });
        if (!tooClose) colors.push(hex);
      }
      resolve(colors);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve([]); };
    img.src = url;
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface ColorSystem {
  PRIMARY:      string;
  BRAND_LIGHT:  string;
  BRAND_DARK:   string;
  LIGHT_BG:     string;
  LIGHT_BORDER: string;
  DARK_BG:      string;
}

interface BrandData {
  name:              string;
  handle:            string;
  tagline:           string;
  website:           string;
  primaryColor:      string;
  colors:            ColorSystem;
  voice: {
    tone:            string;
    toneDescription: string;
    language:        string;
    emojiUsage:      string;
    sentenceStyle:   string;
    vocabularyLevel: string;
    ctaStyle:        string;
    hashtagStyle:    string;
  };
  content: {
    industry:          string;
    targetAudience:    string;
    contentPillars:    string;
    avoid:             string;
    defaultCtaKeyword: string;
    preferredSlideCount: string;
  };
  extractedColors:   string[];
  referenceImageUrls: string[];
}

const DEFAULT_COLORS = deriveColorSystem('#d394ff');

const EMPTY: BrandData = {
  name: '', handle: '', tagline: '', website: '',
  primaryColor: '',
  colors: DEFAULT_COLORS,
  voice: {
    tone: '', toneDescription: '',
    language: 'Spanish',
    emojiUsage: 'minimal',
    sentenceStyle: 'short',
    vocabularyLevel: 'accessible',
    ctaStyle: 'Comenta [KEYWORD]',
    hashtagStyle: 'niche_only',
  },
  content: {
    industry: '', targetAudience: '', contentPillars: '',
    avoid: '', defaultCtaKeyword: 'INFO', preferredSlideCount: '7',
  },
  extractedColors: [],
  referenceImageUrls: [],
};

function storageKey(wsId: string) {
  return `brand_v1_${wsId}`;
}

function loadBrand(wsId: string): BrandData {
  try {
    const raw = localStorage.getItem(storageKey(wsId));
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch { return EMPTY; }
}

function saveBrand(wsId: string, data: BrandData) {
  localStorage.setItem(storageKey(wsId), JSON.stringify(data));
}

function hasAnyData(d: BrandData) {
  return d.name.trim().length > 0 || d.primaryColor.trim().length > 0;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-1 border-b border-[#4c4450]/15">
      <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 14 }}>{icon}</span>
      <h2 className="text-xs font-bold uppercase tracking-widest text-[#988d9c]">{title}</h2>
    </div>
  );
}

function FieldLabel({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 16 }}>{icon}</span>
      <label className="text-[11px] font-bold uppercase tracking-widest text-[#988d9c]">{label}</label>
    </div>
  );
}

const inputCls =
  'w-full bg-[#1c1b1b] border border-[#4c4450]/30 rounded-2xl px-4 py-3 text-sm text-[#e5e2e1] ' +
  'focus:ring-2 focus:ring-[#d394ff]/20 focus:border-[#d394ff] outline-none transition-all placeholder:text-[#988d9c]/40';

interface PillsProps {
  options: { value: string; label: string }[];
  value:   string;
  onChange: (v: string) => void;
  editing: boolean;
}

function Pills({ options, value, onChange, editing }: PillsProps) {
  if (!editing) {
    const found = options.find(o => o.value === value);
    return (
      <p className="text-sm text-[#cfc2d2] pl-6">
        {found ? found.label : <span className="text-[#4c4450]/60 italic">Not configured</span>}
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-2 pl-6">
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={[
            'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border',
            value === o.value
              ? 'bg-[#d394ff]/15 border-[#d394ff]/40 text-[#d394ff]'
              : 'bg-[#1c1b1b] border-[#4c4450]/30 text-[#988d9c] hover:text-white hover:border-[#4c4450]/60',
          ].join(' ')}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ColorSwatch({ color, selected, onClick, size = 'md' }: {
  color: string; selected?: boolean; onClick?: () => void; size?: 'sm' | 'md';
}) {
  const dim = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
  return (
    <button
      type="button"
      title={color}
      onClick={onClick}
      className={[
        `${dim} rounded-full border-2 transition-all shrink-0`,
        selected
          ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]'
          : 'border-transparent hover:scale-110 hover:border-white/40',
        onClick ? 'cursor-pointer' : 'cursor-default',
      ].join(' ')}
      style={{ background: color }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Brand() {
  const { active } = useWorkspace();
  const pageRef    = useRef<HTMLDivElement>(null);
  const dropRef    = useRef<HTMLDivElement>(null);

  const [saved,    setSaved]    = useState<BrandData>(EMPTY);
  const [form,     setForm]     = useState<BrandData>(EMPTY);
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [saveOk,   setSaveOk]   = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hexInput, setHexInput] = useState('');
  const [extracting, setExtracting] = useState(false);

  // Load from localStorage when workspace changes
  useEffect(() => {
    if (!active?.id) return;
    const data = loadBrand(active.id);
    setSaved(data);
    setForm(data);
    setHexInput(data.primaryColor);
    setEditing(!hasAnyData(data));
  }, [active?.id]);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-brand-section]', {
        y: 20, opacity: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out', delay: 0.1,
      });
    }, pageRef.current!);
    return () => ctx.revert();
  }, []);

  const setVoice  = (key: keyof BrandData['voice'])   => (v: string) =>
    setForm(p => ({ ...p, voice:   { ...p.voice,   [key]: v } }));
  const setContent = (key: keyof BrandData['content']) => (v: string) =>
    setForm(p => ({ ...p, content: { ...p.content, [key]: v } }));

  const applyPrimaryColor = (hex: string) => {
    if (!isValidHex(hex)) return;
    setForm(p => ({ ...p, primaryColor: hex, colors: deriveColorSystem(hex) }));
    setHexInput(hex);
  };

  // Image processing
  const processFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) return;
    setExtracting(true);

    const results = await Promise.all(
      imageFiles.map(async file => {
        const url = await new Promise<string>(res => {
          const reader = new FileReader();
          reader.onload = e => res(e.target!.result as string);
          reader.readAsDataURL(file);
        });
        const colors = await extractColorsFromImage(file);
        return { url, colors };
      }),
    );

    setForm(p => {
      const newUrls   = results.map(r => r.url);
      const newColors = [...new Set([...p.extractedColors, ...results.flatMap(r => r.colors)])].slice(0, 12);
      return { ...p, referenceImageUrls: [...p.referenceImageUrls, ...newUrls], extractedColors: newColors };
    });
    setExtracting(false);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (!editing) return;
    processFiles([...e.dataTransfer.files]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles([...e.target.files]);
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setForm(p => ({
      ...p,
      referenceImageUrls: p.referenceImageUrls.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = () => {
    if (!active?.id || saving) return;
    setSaving(true);
    try {
      saveBrand(active.id, form);
      setSaved(form);
      setEditing(false);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setForm(saved);
    setHexInput(saved.primaryColor);
    setEditing(true);
  };

  const handleCancel = () => {
    setForm(saved);
    setHexInput(saved.primaryColor);
    setEditing(false);
  };

  const TONE_OPTIONS = [
    { value: 'professional',  label: 'Professional',  desc: 'Authoritative, uses data and specifics.' },
    { value: 'conversational', label: 'Conversational', desc: 'Warm, close, talks like a friend.' },
    { value: 'playful',       label: 'Playful',        desc: 'Energetic, uses humor and emojis.' },
    { value: 'bold',          label: 'Bold',           desc: 'Provocative, direct, challenges the norm.' },
    { value: 'minimal',       label: 'Minimal',        desc: 'Factual, no fluff, every word earns its place.' },
    { value: 'inspirational', label: 'Inspirational',  desc: 'Motivational, elevates and moves people.' },
  ];

  const selectedTone = TONE_OPTIONS.find(t => t.value === form.voice.tone);

  const COLOR_TOKEN_LABELS: { key: keyof ColorSystem; label: string }[] = [
    { key: 'PRIMARY',      label: 'Primary' },
    { key: 'BRAND_LIGHT',  label: 'Light' },
    { key: 'BRAND_DARK',   label: 'Dark' },
    { key: 'LIGHT_BG',     label: 'BG Light' },
    { key: 'LIGHT_BORDER', label: 'Border' },
    { key: 'DARK_BG',      label: 'BG Dark' },
  ];

  return (
    <div ref={pageRef} className="max-w-2xl mx-auto px-6 py-10 space-y-10">

      {/* Header */}
      <div data-brand-section className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d394ff]/20 to-[#9400e4]/20 border border-[#d394ff]/25 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 20 }}>style</span>
            </div>
            <div>
              <h1 className="text-2xl font-headline font-extrabold tracking-tight text-white">Brand</h1>
              <p className="text-xs text-[#988d9c]">Visual identity and voice the AI uses when generating your carousels</p>
            </div>
          </div>
          {active && (
            <div className="flex items-center gap-2 pl-13">
              <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 13 }}>workspaces</span>
              <span className="text-[11px] font-bold text-[#d394ff] uppercase tracking-widest">{active.name}</span>
            </div>
          )}
        </div>

        {!editing && hasAnyData(saved) && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#4c4450]/30 text-sm font-semibold text-[#cfc2d2] hover:text-white hover:border-[#d394ff]/40 hover:bg-[#d394ff]/8 transition-all active:scale-[0.98] shrink-0"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
            Edit
          </button>
        )}
      </div>

      {saveOk && (
        <div data-brand-section className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-green-500/10 border border-green-500/20">
          <span className="material-symbols-outlined text-green-400" style={{ fontSize: 16 }}>check_circle</span>
          <p className="text-sm text-green-400">Brand saved — AI will use this identity for all future carousels.</p>
        </div>
      )}

      {/* ── Section 1: Identity ───────────────────────────────────────────────── */}
      <section data-brand-section className="space-y-5">
        <SectionHeader icon="badge" title="Brand Identity" />

        <div className="space-y-1.5">
          <FieldLabel icon="label" label="Brand Name" />
          {editing ? (
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Vielinks" className={inputCls} />
          ) : (
            <p className="text-sm text-[#cfc2d2] pl-6">{form.name || <span className="text-[#4c4450]/60 italic">Not configured</span>}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <FieldLabel icon="alternate_email" label="Instagram Handle" />
          {editing ? (
            <input type="text" value={form.handle} onChange={e => setForm(p => ({ ...p, handle: e.target.value }))}
              placeholder="@yourbrand" className={inputCls} />
          ) : (
            <p className="text-sm text-[#cfc2d2] pl-6">{form.handle || <span className="text-[#4c4450]/60 italic">Not configured</span>}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <FieldLabel icon="format_quote" label="Tagline / Slogan" />
          {editing ? (
            <input type="text" value={form.tagline} onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))}
              placeholder="e.g. Content that converts." className={inputCls} />
          ) : (
            <p className="text-sm text-[#cfc2d2] pl-6">{form.tagline || <span className="text-[#4c4450]/60 italic">Not configured</span>}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <FieldLabel icon="language" label="Website" />
          {editing ? (
            <input type="text" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
              placeholder="https://yourbrand.com" className={inputCls} />
          ) : (
            <p className="text-sm text-[#cfc2d2] pl-6">{form.website || <span className="text-[#4c4450]/60 italic">Not configured</span>}</p>
          )}
        </div>
      </section>

      {/* ── Section 2: Visual Identity ────────────────────────────────────────── */}
      <section data-brand-section className="space-y-5">
        <SectionHeader icon="palette" title="Visual Identity" />

        {/* Image upload */}
        <div className="space-y-3">
          <FieldLabel icon="image" label="Reference Images" />
          {editing && (
            <p className="text-[11px] text-[#4c4450] leading-relaxed pl-6">
              Upload logos, brand assets, or color reference images. The AI will extract your brand palette automatically.
            </p>
          )}

          {editing && (
            <div
              ref={dropRef}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={[
                'relative rounded-2xl border-2 border-dashed transition-all p-6 text-center cursor-pointer',
                dragging
                  ? 'border-[#d394ff]/60 bg-[#d394ff]/8'
                  : 'border-[#4c4450]/30 bg-[#1c1b1b] hover:border-[#d394ff]/30 hover:bg-[#d394ff]/5',
              ].join(' ')}
              onClick={() => document.getElementById('brand-img-input')?.click()}
            >
              <input id="brand-img-input" type="file" accept="image/*" multiple onChange={handleFileInput} className="hidden" />
              {extracting ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <span className="material-symbols-outlined text-[#d394ff] animate-spin" style={{ fontSize: 28 }}>progress_activity</span>
                  <p className="text-xs text-[#988d9c]">Extracting colors…</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-2">
                  <span className="material-symbols-outlined text-[#4c4450]" style={{ fontSize: 32 }}>upload_file</span>
                  <p className="text-sm text-[#988d9c]">Drop images here or <span className="text-[#d394ff]">click to upload</span></p>
                  <p className="text-[11px] text-[#4c4450]">PNG, JPG, SVG, WebP</p>
                </div>
              )}
            </div>
          )}

          {/* Thumbnails */}
          {form.referenceImageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 pl-6">
              {form.referenceImageUrls.map((url, i) => (
                <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-[#4c4450]/30">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {editing && (
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>close</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Extracted palette */}
        {form.extractedColors.length > 0 && (
          <div className="space-y-2">
            <FieldLabel icon="colorize" label="Extracted Palette" />
            {editing && (
              <p className="text-[11px] text-[#4c4450] pl-6">Click a color to use it as your primary brand color.</p>
            )}
            <div className="flex flex-wrap gap-2 pl-6">
              {form.extractedColors.map(color => (
                <ColorSwatch
                  key={color}
                  color={color}
                  selected={form.primaryColor === color}
                  onClick={editing ? () => applyPrimaryColor(color) : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* Primary color */}
        <div className="space-y-2">
          <FieldLabel icon="circle" label="Primary Brand Color" />
          {editing ? (
            <div className="flex items-center gap-3 pl-6">
              <input
                type="color"
                value={isValidHex(hexInput) ? hexInput : '#d394ff'}
                onChange={e => applyPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-xl border border-[#4c4450]/30 bg-[#1c1b1b] cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={hexInput}
                onChange={e => {
                  setHexInput(e.target.value);
                  if (isValidHex(e.target.value)) applyPrimaryColor(e.target.value);
                }}
                placeholder="#d394ff"
                className="w-36 bg-[#1c1b1b] border border-[#4c4450]/30 rounded-xl px-3 py-2 text-sm font-mono text-[#e5e2e1] focus:ring-2 focus:ring-[#d394ff]/20 focus:border-[#d394ff] outline-none transition-all"
              />
              {isValidHex(hexInput) && (
                <p className="text-[11px] text-[#4c4450]">Palette derived automatically</p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-6">
              {form.primaryColor ? (
                <>
                  <div className="w-7 h-7 rounded-full border border-white/10" style={{ background: form.primaryColor }} />
                  <span className="text-sm font-mono text-[#cfc2d2]">{form.primaryColor}</span>
                </>
              ) : (
                <p className="text-sm text-[#4c4450]/60 italic">Not configured</p>
              )}
            </div>
          )}
        </div>

        {/* Derived palette */}
        {isValidHex(form.primaryColor) && (
          <div className="space-y-3">
            <FieldLabel icon="auto_awesome" label="Derived Color System" />
            <div className="pl-6 grid grid-cols-3 sm:grid-cols-6 gap-3">
              {COLOR_TOKEN_LABELS.map(({ key, label }) => (
                <div key={key} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-10 h-10 rounded-xl border border-white/10 shadow-sm"
                    style={{ background: form.colors[key] }}
                  />
                  <span className="text-[9px] text-[#4c4450] uppercase tracking-wider text-center leading-tight">{label}</span>
                  <span className="text-[9px] font-mono text-[#988d9c]/60">{form.colors[key]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Section 3: Voice & Tone ───────────────────────────────────────────── */}
      <section data-brand-section className="space-y-5">
        <SectionHeader icon="record_voice_over" title="Voice & Tone" />

        {/* Tone selector */}
        <div className="space-y-2">
          <FieldLabel icon="mood" label="Brand Tone" />
          {editing && (
            <p className="text-[11px] text-[#4c4450] pl-6">How should your content sound to your audience?</p>
          )}
          {editing ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-6">
              {TONE_OPTIONS.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setVoice('tone')(t.value)}
                  className={[
                    'text-left px-3 py-2.5 rounded-2xl border transition-all',
                    form.voice.tone === t.value
                      ? 'bg-[#d394ff]/12 border-[#d394ff]/40 text-white'
                      : 'bg-[#1c1b1b] border-[#4c4450]/30 text-[#988d9c] hover:border-[#4c4450]/60 hover:text-white',
                  ].join(' ')}
                >
                  <p className="text-xs font-bold capitalize">{t.label}</p>
                  <p className="text-[10px] mt-0.5 leading-snug opacity-70">{t.desc}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="pl-6">
              {selectedTone ? (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#d394ff] mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#cfc2d2] capitalize">{selectedTone.label}</p>
                    <p className="text-xs text-[#4c4450]">{selectedTone.desc}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#4c4450]/60 italic">Not configured</p>
              )}
            </div>
          )}
        </div>

        {/* Custom tone description */}
        <div className="space-y-1.5">
          <FieldLabel icon="notes" label="Tone Description" />
          {editing && (
            <p className="text-[11px] text-[#4c4450] pl-6">Describe your brand voice in detail. This is injected directly into the generation prompt.</p>
          )}
          {editing ? (
            <textarea
              value={form.voice.toneDescription}
              onChange={e => setVoice('toneDescription')(e.target.value)}
              rows={3}
              placeholder="e.g. Confident and direct. Short punchy sentences. Occasional dry humor. Never corporate. Always ends with a call to action."
              className={`${inputCls} resize-none leading-relaxed`}
            />
          ) : (
            <div className="pl-6">
              {form.voice.toneDescription.trim()
                ? <p className="text-sm text-[#cfc2d2] whitespace-pre-wrap leading-relaxed">{form.voice.toneDescription}</p>
                : <p className="text-sm text-[#4c4450]/60 italic">Not configured</p>
              }
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <FieldLabel icon="translate" label="Language" />
          <Pills
            options={[{ value: 'Spanish', label: 'Spanish' }, { value: 'English', label: 'English' }, { value: 'Both', label: 'Bilingual' }]}
            value={form.voice.language} onChange={setVoice('language')} editing={editing}
          />
        </div>

        <div className="space-y-1.5">
          <FieldLabel icon="short_text" label="Sentence Style" />
          <Pills
            options={[
              { value: 'short',      label: 'Short & punchy' },
              { value: 'paragraphs', label: 'Full paragraphs' },
              { value: 'mixed',      label: 'Mixed' },
            ]}
            value={form.voice.sentenceStyle} onChange={setVoice('sentenceStyle')} editing={editing}
          />
        </div>

        <div className="space-y-1.5">
          <FieldLabel icon="school" label="Vocabulary Level" />
          <Pills
            options={[
              { value: 'accessible', label: 'Accessible' },
              { value: 'technical',  label: 'Technical' },
              { value: 'expert',     label: 'Expert' },
            ]}
            value={form.voice.vocabularyLevel} onChange={setVoice('vocabularyLevel')} editing={editing}
          />
        </div>

        <div className="space-y-1.5">
          <FieldLabel icon="emoji_emotions" label="Emoji Usage" />
          <Pills
            options={[
              { value: 'none',     label: 'None' },
              { value: 'minimal',  label: 'Minimal' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'heavy',    label: 'Heavy' },
            ]}
            value={form.voice.emojiUsage} onChange={setVoice('emojiUsage')} editing={editing}
          />
        </div>

        <div className="space-y-1.5">
          <FieldLabel icon="tag" label="Hashtag Style" />
          <Pills
            options={[
              { value: 'none',       label: 'None' },
              { value: 'niche_only', label: 'Niche only' },
              { value: 'mixed',      label: 'Mixed' },
              { value: 'full_set',   label: 'Full set' },
            ]}
            value={form.voice.hashtagStyle} onChange={setVoice('hashtagStyle')} editing={editing}
          />
        </div>

        <div className="space-y-1.5">
          <FieldLabel icon="campaign" label="Default CTA Pattern" />
          {editing ? (
            <input
              type="text"
              value={form.voice.ctaStyle}
              onChange={e => setVoice('ctaStyle')(e.target.value)}
              placeholder='e.g. Comenta [KEYWORD]'
              className={inputCls}
            />
          ) : (
            <p className="text-sm text-[#cfc2d2] pl-6">{form.voice.ctaStyle || <span className="text-[#4c4450]/60 italic">Not configured</span>}</p>
          )}
        </div>
      </section>

      {/* ── Section 4: Content Strategy ──────────────────────────────────────── */}
      <section data-brand-section className="space-y-5">
        <SectionHeader icon="strategy" title="Content Strategy" />

        <div className="space-y-1.5">
          <FieldLabel icon="business_center" label="Industry / Niche" />
          {editing ? (
            <input type="text" value={form.content.industry}
              onChange={e => setContent('industry')(e.target.value)}
              placeholder="e.g. fitness, marketing, tech, wellness" className={inputCls} />
          ) : (
            <p className="text-sm text-[#cfc2d2] pl-6">{form.content.industry || <span className="text-[#4c4450]/60 italic">Not configured</span>}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <FieldLabel icon="group" label="Target Audience" />
          {editing ? (
            <input type="text" value={form.content.targetAudience}
              onChange={e => setContent('targetAudience')(e.target.value)}
              placeholder="e.g. Founders and marketing managers at DTC brands, 25–40 y/o"
              className={inputCls} />
          ) : (
            <p className="text-sm text-[#cfc2d2] pl-6">{form.content.targetAudience || <span className="text-[#4c4450]/60 italic">Not configured</span>}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <FieldLabel icon="category" label="Content Pillars" />
          {editing && (
            <p className="text-[11px] text-[#4c4450] pl-6">The main topics your brand talks about, comma-separated.</p>
          )}
          {editing ? (
            <input type="text" value={form.content.contentPillars}
              onChange={e => setContent('contentPillars')(e.target.value)}
              placeholder="e.g. Social media tips, behind-the-scenes, product launches, client wins"
              className={inputCls} />
          ) : (
            <p className="text-sm text-[#cfc2d2] pl-6">{form.content.contentPillars || <span className="text-[#4c4450]/60 italic">Not configured</span>}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <FieldLabel icon="do_not_disturb_on" label="Avoid" />
          {editing && (
            <p className="text-[11px] text-[#4c4450] pl-6">Words, phrases, or topics the AI should never use.</p>
          )}
          {editing ? (
            <textarea
              value={form.content.avoid}
              onChange={e => setContent('avoid')(e.target.value)}
              rows={2}
              placeholder="e.g. Never use 'hustle', avoid clichés, don't mention competitors"
              className={`${inputCls} resize-none leading-relaxed`}
            />
          ) : (
            <div className="pl-6">
              {form.content.avoid.trim()
                ? <p className="text-sm text-[#cfc2d2] whitespace-pre-wrap">{form.content.avoid}</p>
                : <p className="text-sm text-[#4c4450]/60 italic">Not configured</p>
              }
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <FieldLabel icon="smart_button" label="Default CTA Keyword" />
            {editing ? (
              <input type="text" value={form.content.defaultCtaKeyword}
                onChange={e => setContent('defaultCtaKeyword')(e.target.value)}
                placeholder="e.g. INFO, GUIA, KIT" className={inputCls} />
            ) : (
              <p className="text-sm text-[#cfc2d2] pl-6">{form.content.defaultCtaKeyword || <span className="text-[#4c4450]/60 italic">—</span>}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <FieldLabel icon="view_carousel" label="Preferred Slide Count" />
            <Pills
              options={[{ value: '5', label: '5' }, { value: '7', label: '7' }, { value: '9', label: '9' }]}
              value={form.content.preferredSlideCount}
              onChange={setContent('preferredSlideCount')}
              editing={editing}
            />
          </div>
        </div>
      </section>

      {/* ── Action bar ───────────────────────────────────────────────────────── */}
      {editing && (
        <div data-brand-section className="flex items-center justify-end gap-3 pt-2">
          {hasAnyData(saved) && (
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl border border-[#4c4450]/20 text-sm font-semibold text-[#988d9c] hover:text-white hover:bg-[#201f1f] transition-all disabled:opacity-40"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !active}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#d394ff] text-[#131313] font-bold text-sm hover:bg-[#e0a8ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>progress_activity</span>
                Saving…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
                Save Brand
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
