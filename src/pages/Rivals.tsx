import { useState, useEffect } from 'react';
import TopBar from '../components/layout/TopBar';

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = 'instagram' | 'facebook';

interface Rival {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  followers: number;
  following: number;
  posts: number;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const LS_KEY = 'vielinks_rivals';

const DEFAULT_RIVALS: Rival[] = [
  { id: '1', name: 'BrandX Studio',    handle: '@brandxstudio', platform: 'instagram', followers: 45_200, following: 1_230, posts: 567 },
  { id: '2', name: 'Novo Creative',    handle: '@novocreative', platform: 'facebook',  followers: 28_100, following: 654,   posts: 389 },
  { id: '3', name: 'PixelFlow Agency', handle: '@pixelflow',    platform: 'instagram', followers: 8_900,  following: 302,   posts: 180 },
];

function loadRivals(): Rival[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_RIVALS;
    return JSON.parse(raw) as Rival[];
  } catch {
    return DEFAULT_RIVALS;
  }
}

function saveRivals(rivals: Rival[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(rivals));
}

// ─── Static mock data ─────────────────────────────────────────────────────────

const MY_ACCOUNT = {
  name: 'My Account',
  handle: '@vielinks',
  followers: 12_400,
  following: 890,
  posts: 234,
  isMe: true as const,
};

const TRACKED_POSTS = [
  { id: 'p1', rivalId: '1', rivalName: 'BrandX Studio',   platform: 'instagram', url: 'https://instagram.com/p/abc123',            preview: 'New product drop — our SS25 collection is here 🔥',         comments: 312, date: '2026-03-28' },
  { id: 'p2', rivalId: '1', rivalName: 'BrandX Studio',   platform: 'instagram', url: 'https://instagram.com/p/def456',            preview: 'Behind the scenes at our studio shoot this week',           comments: 187, date: '2026-03-25' },
  { id: 'p3', rivalId: '2', rivalName: 'Novo Creative',   platform: 'instagram', url: 'https://instagram.com/p/ghi789',            preview: 'How we built our brand identity from zero 🎨',              comments: 94,  date: '2026-03-27' },
  { id: 'p4', rivalId: '2', rivalName: 'Novo Creative',   platform: 'linkedin',  url: 'https://linkedin.com/posts/novo-creative-xyz', preview: 'Excited to announce our partnership with TechVenture 🚀', comments: 56,  date: '2026-03-26' },
  { id: 'p5', rivalId: '3', rivalName: 'PixelFlow Agency', platform: 'instagram', url: 'https://instagram.com/p/jkl012',           preview: 'Case study: 3x engagement in 60 days for @clientco',       comments: 43,  date: '2026-03-29' },
  { id: 'p6', rivalId: '3', rivalName: 'PixelFlow Agency', platform: 'facebook',  url: 'https://facebook.com/pixelflow/posts/987654', preview: 'Join us this Friday for a free live Q&A on content strategy!', comments: 28, date: '2026-03-24' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

function deltaBadge(mine: number, rival: number) {
  const diff = rival - mine;
  const pct  = mine > 0 ? ((diff / mine) * 100).toFixed(0) : '∞';
  return { diff, pct, up: diff > 0 };
}

function parseNum(s: string): number {
  const clean = s.replace(/[^0-9.kmKM]/g, '');
  const lower = clean.toLowerCase();
  if (lower.endsWith('m')) return Math.round(parseFloat(lower) * 1_000_000);
  if (lower.endsWith('k')) return Math.round(parseFloat(lower) * 1_000);
  return parseInt(clean, 10) || 0;
}

const PLATFORM_ICONS: Record<string, string> = {
  instagram: 'photo_camera',
  linkedin:  'business_center',
  facebook:  'groups',
  twitter:   'alternate_email',
};
const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#e4b9ff',
  linkedin:  '#7bb8f5',
  facebook:  '#74b9e4',
  twitter:   '#7cd5f5',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({ label, value, mine, isMe }: { label: string; value: number; mine: number; isMe: boolean }) {
  const { up, pct } = deltaBadge(mine, value);
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-[#988d9c]">{label}</span>
      <span className="text-2xl font-headline font-bold tracking-tighter text-white">{fmtNum(value)}</span>
      {!isMe && (
        <span className={`text-[10px] font-semibold ${up ? 'text-[#c5d247]' : 'text-[#ff8a80]'}`}>
          {up ? '▲' : '▼'} {Math.abs(Number(pct))}% vs you
        </span>
      )}
    </div>
  );
}

const PLATFORM_META: Record<Platform, { label: string; icon: string; color: string; bg: string }> = {
  instagram: { label: 'Instagram', icon: 'photo_camera',  color: '#e4b9ff', bg: '#e4b9ff18' },
  facebook:  { label: 'Facebook',  icon: 'thumb_up',      color: '#74b9e4', bg: '#74b9e418' },
};

function RivalCard({
  account, mine, onDelete,
}: {
  account: (Rival & { isMe?: false }) | typeof MY_ACCOUNT;
  mine: typeof MY_ACCOUNT;
  onDelete?: () => void;
}) {
  const pm = !account.isMe ? PLATFORM_META[(account as Rival).platform] : null;

  return (
    <div className={[
      'glass-card rounded-3xl border p-6 flex flex-col gap-5 transition-all duration-200 group relative',
      account.isMe
        ? 'border-[#d394ff]/25 shadow-[0_0_30px_rgba(211,148,255,0.12)]'
        : 'border-[#4c4450]/10 hover:border-[#4c4450]/25',
    ].join(' ')}>

      {/* Delete button — rival only */}
      {!account.isMe && onDelete && (
        <button
          onClick={onDelete}
          title="Remove rival"
          className="absolute top-4 right-4 w-7 h-7 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 bg-[#ffb4ab]/10 hover:bg-[#ffb4ab]/20 text-[#ffb4ab] transition-all duration-150"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
        </button>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={[
          'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0',
          account.isMe
            ? 'bg-gradient-to-tr from-[#d394ff] to-[#9400e4]'
            : 'bg-[#1e1e1e] border border-[#4c4450]/20',
        ].join(' ')}>
          <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>
            {account.isMe ? 'person' : 'groups'}
          </span>
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-white font-headline leading-tight truncate">{account.name}</p>
            {account.isMe && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#d394ff]/15 text-[#d394ff] uppercase tracking-wider shrink-0">You</span>
            )}
          </div>
          <p className="text-[11px] text-[#988d9c] truncate">{account.handle}</p>
          {/* Platform badge */}
          {pm && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md" style={{ background: pm.bg }}>
                <span className="material-symbols-outlined" style={{ fontSize: 10, color: pm.color }}>{pm.icon}</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: pm.color }}>{pm.label}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#4c4450]/10">
        <StatPill label="Followers" value={account.followers} mine={mine.followers} isMe={!!account.isMe} />
        <StatPill label="Following" value={account.following} mine={mine.following} isMe={!!account.isMe} />
        <StatPill label="Posts"     value={account.posts}     mine={mine.posts}     isMe={!!account.isMe} />
      </div>
    </div>
  );
}

function PostRow({ post }: { post: typeof TRACKED_POSTS[number] }) {
  const color = PLATFORM_COLORS[post.platform] ?? '#988d9c';
  const icon  = PLATFORM_ICONS[post.platform]  ?? 'link';
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 rounded-2xl border border-transparent hover:border-[#4c4450]/15 hover:bg-white/[0.025] transition-all duration-150 group">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
        <span className="material-symbols-outlined" style={{ fontSize: 15, color }}>{icon}</span>
      </div>
      <span className="text-xs font-semibold text-[#cfc2d2] w-[130px] shrink-0 truncate">{post.rivalName}</span>
      <span className="flex-1 text-xs text-[#988d9c] truncate hidden sm:block">{post.preview}</span>
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="flex items-center gap-1 text-xs text-[#d394ff] hover:text-[#e8b8ff] transition-colors shrink-0 opacity-60 group-hover:opacity-100"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 13 }}>open_in_new</span>
        <span className="hidden md:block">View post</span>
      </a>
      <div className="flex items-center gap-1.5 shrink-0 w-[72px] justify-end">
        <span className="material-symbols-outlined text-[#988d9c]" style={{ fontSize: 14 }}>chat_bubble</span>
        <span className="text-sm font-bold text-white font-headline">{post.comments.toLocaleString()}</span>
      </div>
      <span className="text-[10px] text-[#4c4450] w-[72px] text-right shrink-0 hidden lg:block">{post.date}</span>
    </div>
  );
}

// ─── Add Rival Modal ──────────────────────────────────────────────────────────

const EMPTY_FORM = { name: '', handle: '', platform: 'instagram' as Platform, followers: '', following: '', posts: '' };

function AddRivalModal({ open, onClose, onAdd }: {
  open: boolean;
  onClose: () => void;
  onAdd: (rival: Rival) => void;
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Entrada/salida animada sin librería extra
  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!mounted) return null;

  const valid = form.name.trim() && form.handle.trim() &&
    parseNum(form.followers) > 0 && parseNum(form.following) >= 0 && parseNum(form.posts) >= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    onAdd({
      id: crypto.randomUUID(),
      name:      form.name.trim(),
      handle:    form.handle.trim().startsWith('@') ? form.handle.trim() : `@${form.handle.trim()}`,
      platform:  form.platform,
      followers: parseNum(form.followers),
      following: parseNum(form.following),
      posts:     parseNum(form.posts),
    });
    setForm(EMPTY_FORM);
    onClose();
  };

  const field = (
    key: keyof typeof EMPTY_FORM,
    label: string,
    placeholder: string,
    hint?: string,
  ) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase tracking-widest text-[#988d9c] font-semibold">{label}</label>
      <input
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="bg-[#131313] border border-[#4c4450]/25 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#4c4450] focus:outline-none focus:border-[#d394ff]/40 transition-all"
      />
      {hint && <span className="text-[10px] text-[#4c4450]">{hint}</span>}
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-250 ${visible ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'}`}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-md bg-[#161616] border border-[#4c4450]/20 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.7)] transition-all duration-250 ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
      >
        <form onSubmit={handleSubmit} className="p-7 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-headline font-extrabold tracking-tight text-white">Add Rival</h2>
              <p className="text-xs text-[#988d9c] mt-0.5">Data is saved locally in your browser</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-[#1e1e1e] hover:bg-[#2a2a2a] flex items-center justify-center text-[#988d9c] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
            </button>
          </div>

          {/* Fields */}
          {field('name',   'Name',   'BrandX Studio')}
          {field('handle', 'Handle', '@brandxstudio', 'The @ will be added automatically if missing')}

          {/* Platform selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-[#988d9c] font-semibold">Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {(['instagram', 'facebook'] as Platform[]).map(p => {
                const pm = PLATFORM_META[p];
                const active = form.platform === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, platform: p }))}
                    className={[
                      'flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all duration-150',
                      active
                        ? 'border-[#d394ff]/40 bg-[#d394ff]/8'
                        : 'border-[#4c4450]/20 bg-[#131313] hover:border-[#4c4450]/40',
                    ].join(' ')}
                  >
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: pm.bg }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: pm.color }}>{pm.icon}</span>
                    </div>
                    <span className={`text-sm font-semibold transition-colors ${active ? 'text-white' : 'text-[#988d9c]'}`}>{pm.label}</span>
                    {active && (
                      <span className="ml-auto material-symbols-outlined text-[#d394ff]" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {field('followers', 'Followers', '45.2K')}
            {field('following', 'Following', '1.2K')}
            {field('posts',     'Posts',     '567')}
          </div>

          <p className="text-[10px] text-[#4c4450]">Accepts K and M suffixes (e.g. 45.2K, 1.2M)</p>

          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="submit"
              disabled={!valid}
              className="flex-1 py-3 rounded-xl bg-[#d394ff] text-[#131313] font-bold text-sm hover:bg-[#e0a8ff] disabled:opacity-35 disabled:cursor-not-allowed transition-all"
            >
              Add Rival
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-[#4c4450]/20 text-sm font-semibold text-[#cfc2d2] hover:bg-[#201f1f] hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'posts';

export default function Rivals() {
  const [rivals, setRivals]         = useState<Rival[]>(loadRivals);
  const [tab, setTab]               = useState<Tab>('overview');
  const [filterRival, setFilterRival] = useState<string>('all');
  const [addOpen, setAddOpen]       = useState(false);

  // Persist on every change
  useEffect(() => { saveRivals(rivals); }, [rivals]);

  const handleAdd = (rival: Rival) => {
    setRivals(prev => [...prev, rival]);
  };

  const handleDelete = (id: string) => {
    setRivals(prev => prev.filter(r => r.id !== id));
    if (filterRival === id) setFilterRival('all');
  };

  const filteredPosts = filterRival === 'all'
    ? TRACKED_POSTS
    : TRACKED_POSTS.filter(p => p.rivalId === filterRival);

  const maxFollowers = Math.max(MY_ACCOUNT.followers, ...rivals.map(r => r.followers), 1);

  return (
    <>
      <AddRivalModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />

      <div>
        <TopBar
          title="Rival Monitor"
          actions={
            <div className="flex items-center gap-3">
              {/* Tab switcher */}
              <div className="flex items-center gap-1 bg-[#1c1b1b] rounded-full border border-[#4c4450]/15 p-1">
                <button
                  onClick={() => setTab('overview')}
                  className={[
                    'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
                    tab === 'overview' ? 'bg-[#d394ff] text-[#131313]' : 'text-[#988d9c] hover:text-white',
                  ].join(' ')}
                >
                  Overview
                </button>
                <button
                  onClick={() => setTab('posts')}
                  className={[
                    'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
                    tab === 'posts' ? 'bg-[#d394ff] text-[#131313]' : 'text-[#988d9c] hover:text-white',
                  ].join(' ')}
                >
                  Post Tracking
                </button>
              </div>

              {/* Add rival button */}
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#d394ff] hover:bg-[#e0a8ff] text-[#131313] text-xs font-bold transition-all duration-200 shadow-[0_0_20px_rgba(211,148,255,0.25)]"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
                Add Rival
              </button>
            </div>
          }
        />

        <div className="p-8 space-y-8 max-w-[1600px] mx-auto">

          {/* ── OVERVIEW TAB ── */}
          {tab === 'overview' && (
            <>
              {/* Summary KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Rivals tracked',   value: rivals.length,  icon: 'groups',      color: '#d394ff' },
                  { label: 'Max follower gap',  value: fmtNum(rivals.length ? Math.max(...rivals.map(r => r.followers)) - MY_ACCOUNT.followers : 0), icon: 'trending_up', color: '#c5d247' },
                  { label: 'Posts tracked',     value: TRACKED_POSTS.length, icon: 'article', color: '#e4b9ff' },
                ].map(k => (
                  <div key={k.label} className="glass-card rounded-3xl border border-[#4c4450]/5 p-5 flex items-center gap-4 shadow-[0_0_40px_rgba(211,148,255,0.06)]">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${k.color}18` }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: k.color }}>{k.icon}</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#988d9c]">{k.label}</p>
                      <p className="text-2xl font-headline font-bold tracking-tighter text-white">{k.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Account comparison grid */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#988d9c] mb-4">Account Comparison</h2>
                {rivals.length === 0 ? (
                  <div className="glass-card rounded-3xl border border-[#4c4450]/5 py-16 flex flex-col items-center gap-3 text-[#4c4450]">
                    <span className="material-symbols-outlined text-[40px]">radar</span>
                    <p className="text-sm">No rivals added yet</p>
                    <button
                      onClick={() => setAddOpen(true)}
                      className="mt-1 flex items-center gap-2 px-4 py-2 rounded-full bg-[#d394ff]/10 hover:bg-[#d394ff]/20 text-[#d394ff] text-xs font-bold transition-all"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                      Add your first rival
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <RivalCard account={MY_ACCOUNT} mine={MY_ACCOUNT} />
                    {rivals.map(r => (
                      <RivalCard key={r.id} account={r} mine={MY_ACCOUNT} onDelete={() => handleDelete(r.id)} />
                    ))}
                  </div>
                )}
              </div>

              {/* Followers comparison bars */}
              {rivals.length > 0 && (
                <div className="glass-card rounded-3xl border border-[#4c4450]/5 p-6 shadow-[0_0_40px_rgba(211,148,255,0.06)]">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-[#988d9c] mb-6">Followers Comparison</h2>
                  <div className="space-y-4">
                    {[MY_ACCOUNT, ...rivals].map(acc => {
                      const pct = Math.round((acc.followers / maxFollowers) * 100);
                      return (
                        <div key={acc.handle} className="flex items-center gap-4">
                          <span className="text-xs text-[#cfc2d2] font-semibold w-[130px] shrink-0 truncate">{acc.name}</span>
                          <div className="flex-1 h-2 rounded-full bg-[#1e1e1e] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                background: acc.isMe
                                  ? 'linear-gradient(90deg, #9400e4, #d394ff)'
                                  : 'linear-gradient(90deg, #3a3545, #6b5f72)',
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold text-white font-headline w-[52px] text-right shrink-0">{fmtNum(acc.followers)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── POST TRACKING TAB ── */}
          {tab === 'posts' && (
            <div className="glass-card rounded-3xl border border-[#4c4450]/5 overflow-hidden shadow-[0_0_40px_rgba(211,148,255,0.06)]">
              {/* Filter bar */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[#4c4450]/10 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#988d9c]">Filter</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {(['all', ...rivals.map(r => r.id)] as string[]).map(id => {
                    const label = id === 'all' ? 'All' : (rivals.find(r => r.id === id)?.name ?? id);
                    const active = filterRival === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setFilterRival(id)}
                        className={[
                          'px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150',
                          active
                            ? 'bg-[#d394ff]/15 text-[#d394ff] border border-[#d394ff]/30'
                            : 'text-[#988d9c] border border-[#4c4450]/20 hover:text-white hover:border-[#4c4450]/40',
                        ].join(' ')}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <span className="ml-auto text-[10px] text-[#4c4450]">{filteredPosts.length} posts</span>
              </div>

              {/* Table header */}
              <div className="flex items-center gap-4 px-5 py-2.5 border-b border-[#4c4450]/8">
                <div className="w-8 shrink-0" />
                <span className="text-[10px] uppercase tracking-widest text-[#4c4450] w-[130px] shrink-0">Rival</span>
                <span className="text-[10px] uppercase tracking-widest text-[#4c4450] flex-1 hidden sm:block">Preview</span>
                <span className="text-[10px] uppercase tracking-widest text-[#4c4450] shrink-0 w-[72px] hidden md:block">Link</span>
                <span className="text-[10px] uppercase tracking-widest text-[#4c4450] w-[72px] text-right shrink-0">Comments</span>
                <span className="text-[10px] uppercase tracking-widest text-[#4c4450] w-[72px] text-right shrink-0 hidden lg:block">Date</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-[#4c4450]/5 px-1">
                {filteredPosts.length === 0 ? (
                  <div className="py-16 flex flex-col items-center gap-3 text-[#4c4450]">
                    <span className="material-symbols-outlined text-[40px]">search_off</span>
                    <p className="text-sm">No posts tracked for this rival</p>
                  </div>
                ) : (
                  filteredPosts.map(post => <PostRow key={post.id} post={post} />)
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
