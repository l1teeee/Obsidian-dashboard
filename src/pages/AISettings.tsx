import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { getAiSettings, saveAiSettings } from '../services/ai-settings.service';
import type { AiSettingsData } from '../services/ai-settings.service';

const EMPTY: AiSettingsData = {
  persona:             '',
  brand_voice:         '',
  target_audience:     '',
  content_pillars:     '',
  hashtag_strategy:    '',
  example_posts:       '',
  avoid:               '',
  custom_instructions: '',
};

function hasAnyData(d: AiSettingsData): boolean {
  return Object.values(d).some(v => typeof v === 'string' && v.trim().length > 0);
}

// ─── Field component ──────────────────────────────────────────────────────────

interface FieldProps {
  label:       string;
  icon:        string;
  description: string;
  value:       string;
  onChange:    (v: string) => void;
  placeholder: string;
  editing:     boolean;
  multiline?:  boolean;
  rows?:       number;
}

function Field({
  label, icon, description, value, onChange, placeholder, editing, multiline = true, rows = 3,
}: FieldProps) {
  const inputCls = [
    'w-full bg-[#1c1b1b] border border-[#4c4450]/30 rounded-2xl px-4 py-3 text-sm text-[#e5e2e1]',
    'focus:ring-2 focus:ring-[#d394ff]/20 focus:border-[#d394ff] outline-none transition-all',
    'placeholder:text-[#988d9c]/40',
    multiline ? 'resize-none leading-relaxed' : '',
  ].join(' ');

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 16 }}>{icon}</span>
        <label className="text-[11px] font-bold uppercase tracking-widest text-[#988d9c]">{label}</label>
      </div>
      {editing && (
        <p className="text-[11px] text-[#4c4450] leading-relaxed pl-6">{description}</p>
      )}

      {editing ? (
        multiline ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            className={inputCls}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={inputCls}
          />
        )
      ) : (
        /* Read-only display */
        <div className="pl-6">
          {value.trim() ? (
            <p className="text-sm text-[#cfc2d2] leading-relaxed whitespace-pre-wrap">{value}</p>
          ) : (
            <p className="text-sm text-[#4c4450]/60 italic">Not configured</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AISettings() {
  const { active } = useWorkspace();
  const pageRef    = useRef<HTMLDivElement>(null);

  const [saved,   setSaved]   = useState<AiSettingsData>(EMPTY); // last saved state
  const [form,    setForm]    = useState<AiSettingsData>(EMPTY); // current edit state
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [saveOk,  setSaveOk]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!active?.id) return;
    setLoading(true);
    getAiSettings(active.id)
      .then(data => {
        const loaded: AiSettingsData = {
          persona:             data.persona             ?? '',
          brand_voice:         data.brand_voice         ?? '',
          target_audience:     data.target_audience     ?? '',
          content_pillars:     data.content_pillars     ?? '',
          hashtag_strategy:    data.hashtag_strategy    ?? '',
          example_posts:       data.example_posts       ?? '',
          avoid:               data.avoid               ?? '',
          custom_instructions: data.custom_instructions ?? '',
        };
        setSaved(loaded);
        setForm(loaded);
        // If no data yet → start in edit mode so user can fill it right away
        setEditing(!hasAnyData(loaded));
      })
      .catch(() => {
        setSaved(EMPTY);
        setForm(EMPTY);
        setEditing(true); // nothing saved → edit mode
      })
      .finally(() => setLoading(false));
  }, [active?.id]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-ai-section]', {
        y: 20, opacity: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out', delay: 0.1,
      });
    }, pageRef.current!);
    return () => ctx.revert();
  }, []);

  const set = (key: keyof AiSettingsData) => (v: string) =>
    setForm(prev => ({ ...prev, [key]: v }));

  const handleEdit = () => {
    setForm(saved); // reset to saved before editing
    setError(null);
    setEditing(true);
  };

  const handleCancel = () => {
    setForm(saved);
    setError(null);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!active?.id || saving) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await saveAiSettings(active.id, form);
      const normalized: AiSettingsData = {
        persona:             updated.persona             ?? '',
        brand_voice:         updated.brand_voice         ?? '',
        target_audience:     updated.target_audience     ?? '',
        content_pillars:     updated.content_pillars     ?? '',
        hashtag_strategy:    updated.hashtag_strategy    ?? '',
        example_posts:       updated.example_posts       ?? '',
        avoid:               updated.avoid               ?? '',
        custom_instructions: updated.custom_instructions ?? '',
      };
      setSaved(normalized);
      setForm(normalized);
      setEditing(false);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 2500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Sections config — drives both view and edit render
  const sections = [
    {
      title: 'Brand Identity',
      icon:  'badge',
      fields: [
        {
          key:         'persona' as const,
          label:       'Persona / Brand',
          icon:        'person',
          description: 'Who are you or your brand? Give the AI a clear identity to write from.',
          placeholder: 'e.g. Vielinks — a social media SaaS for creative agencies. Modern, premium, bold.',
          multiline:   false,
        },
        {
          key:         'brand_voice' as const,
          label:       'Voice & Tone',
          icon:        'record_voice_over',
          description: 'How should your captions sound? Formal? Playful? Direct? Inspirational?',
          placeholder: 'e.g. Confident and direct. Uses short punchy sentences. Occasional dry humor. Never corporate.',
          rows:        3,
        },
        {
          key:         'target_audience' as const,
          label:       'Target Audience',
          icon:        'group',
          description: 'Who is reading your posts? The more specific, the better the copy.',
          placeholder: 'e.g. Founders and marketing managers at DTC brands, 25–40 y/o, interested in growth and design.',
          rows:        2,
        },
      ],
    },
    {
      title: 'Content Strategy',
      icon:  'strategy',
      fields: [
        {
          key:         'content_pillars' as const,
          label:       'Content Pillars',
          icon:        'category',
          description: 'The main topics your content covers. Helps the AI stay on-brand.',
          placeholder: 'e.g. Social media tips, behind-the-scenes, product launches, client wins, industry trends',
          multiline:   false,
        },
        {
          key:         'example_posts' as const,
          label:       'Style Reference Posts',
          icon:        'format_quote',
          description: 'Paste 2–3 example captions that represent your ideal writing style. This is the most powerful context you can give.',
          placeholder: 'Example 1:\nYour best captions start before you open the app. Strategy first. ✦\n\nExample 2:\nWe don\'t post to fill a schedule. We post to move people.',
          rows:        6,
        },
      ],
    },
    {
      title: 'Hashtag Settings',
      icon:  'tag',
      fields: [
        {
          key:         'hashtag_strategy' as const,
          label:       'Hashtag Strategy',
          icon:        'tag',
          description: 'Tell the AI how you like to use hashtags: mix of niche/broad, max count, preferred style.',
          placeholder: 'e.g. Mix of 5 niche (under 500k posts) + 5 medium (500k–5M) + 3 broad. Max 13 total.',
          rows:        2,
        },
      ],
    },
    {
      title: 'Guardrails',
      icon:  'block',
      fields: [
        {
          key:         'avoid' as const,
          label:       'Avoid',
          icon:        'do_not_disturb_on',
          description: 'Words, phrases, topics or styles the AI should never use.',
          placeholder: "e.g. Never use 'hustle', avoid clichés like 'game changer', don't mention competitors",
          rows:        2,
        },
        {
          key:         'custom_instructions' as const,
          label:       'Custom Instructions',
          icon:        'tune',
          description: 'Anything else the AI should know. Free form — injected directly into the prompt.',
          placeholder: 'e.g. Always end with a question to drive comments. Use em-dashes instead of commas for rhythm.',
          rows:        3,
        },
      ],
    },
  ];

  return (
    <div ref={pageRef} className="max-w-2xl mx-auto px-6 py-10 space-y-10">

      {/* Header */}
      <div data-ai-section className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d394ff]/20 to-[#9400e4]/20 border border-[#d394ff]/25 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 20 }}>auto_awesome</span>
            </div>
            <div>
              <h1 className="text-2xl font-headline font-extrabold tracking-tight text-white">AI Settings</h1>
              <p className="text-xs text-[#988d9c]">Context ChatGPT uses when generating your captions</p>
            </div>
          </div>
          {active && (
            <div className="flex items-center gap-2 pl-13">
              <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 13 }}>workspaces</span>
              <span className="text-[11px] font-bold text-[#d394ff] uppercase tracking-widest">{active.name}</span>
            </div>
          )}
        </div>

        {/* Edit button — only shown in view mode when there's data */}
        {!loading && !editing && hasAnyData(saved) && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#4c4450]/30 text-sm font-semibold text-[#cfc2d2] hover:text-white hover:border-[#d394ff]/40 hover:bg-[#d394ff]/8 transition-all active:scale-[0.98] shrink-0"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
            Edit
          </button>
        )}
      </div>

      {/* Success banner */}
      {saveOk && (
        <div data-ai-section className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-green-500/10 border border-green-500/20">
          <span className="material-symbols-outlined text-green-400" style={{ fontSize: 16 }}>check_circle</span>
          <p className="text-sm text-green-400">Settings saved — AI will use this context next time you generate captions.</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-[#1c1b1b] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {sections.map(section => (
            <section key={section.title} data-ai-section className="space-y-5">
              <div className="flex items-center gap-2 pb-1 border-b border-[#4c4450]/15">
                <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 14 }}>{section.icon}</span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#988d9c]">{section.title}</h2>
              </div>

              {section.fields.map(f => (
                <Field
                  key={f.key}
                  label={f.label}
                  icon={f.icon}
                  description={f.description}
                  placeholder={f.placeholder}
                  value={form[f.key] ?? ''}
                  onChange={set(f.key)}
                  editing={editing}
                  multiline={f.multiline !== false}
                  rows={f.rows}
                />
              ))}
            </section>
          ))}

          {/* Action bar — only in edit mode */}
          {editing && (
            <div data-ai-section className="flex items-center justify-between gap-4 pt-2">
              <div>
                {error && <p className="text-sm text-red-400">{error}</p>}
              </div>

              <div className="flex items-center gap-3">
                {/* Cancel only if there was pre-existing data to go back to */}
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
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
