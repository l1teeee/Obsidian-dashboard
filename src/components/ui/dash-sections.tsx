// Shared static data and view components used in both DashboardPreview and the How it works panels.

export const DASH_WEEK_DAYS = [
  { day: 'SUN', date: '31', posts: [] as { caption: string; platform: string }[] },
  { day: 'MON', date: '1',  posts: [{ caption: 'Launch teaser',    platform: 'instagram' }] },
  { day: 'TUE', date: '2',  posts: [] as { caption: string; platform: string }[] },
  { day: 'WED', date: '3',  posts: [{ caption: 'Industry insights', platform: 'linkedin'  }] },
  { day: 'THU', date: '4',  posts: [] as { caption: string; platform: string }[] },
  { day: 'FRI', date: '5',  posts: [{ caption: 'Weekend promo',     platform: 'facebook'  }] },
  { day: 'SAT', date: '6',  posts: [] as { caption: string; platform: string }[] },
];

export const DASH_RECENT = [
  { initial: 'C', color: '#1877F2', caption: 'Cada paso que das hacia tus metas es una victoria. Mantente enfocado y r', date: 'Apr 30, 10:36 PM' },
  { initial: 'P', color: '#1877F2', caption: 'Primera prueba de subida',  date: 'Apr 30, 6:51 PM'  },
  { initial: 'H', color: '#1877F2', caption: 'Hola a todos',              date: 'Apr 29, 2:15 PM'  },
];

export const pColor = (p: string) => p === 'instagram' ? '#E1306C' : p === 'linkedin' ? '#0A66C2' : '#1877F2';

// ─── Calendar ────────────────────────────────────────────────────────────────

export function CalendarSection() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-bold">Content calendar</h2>
          <p className="text-[9px] text-[#64748B]">June 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[9px] text-[#94A3B8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C]" /> IG
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A66C2]" /> LI
            <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2]" /> FB
          </span>
          <span className="px-2.5 py-1.5 rounded-lg bg-[#0F172A] text-white text-[9px] font-bold pointer-events-none">+ New post</span>
        </div>
      </div>
      <div className="grid grid-cols-7 bg-[#F8FAFC] rounded-xl overflow-hidden border border-[#0F172A]/10">
        {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => (
          <div key={d} className="py-2 text-center text-[8px] font-mono font-bold uppercase tracking-widest text-[#94A3B8] border-b border-[#0F172A]/8">{d}</div>
        ))}
        {[
          {d:1,posts:[]},{d:2,posts:[{p:'instagram',t:'10:00'}]},{d:3,posts:[]},
          {d:4,posts:[{p:'linkedin',t:'09:00'}]},{d:5,posts:[]},{d:6,posts:[{p:'facebook',t:'18:00'},{p:'instagram',t:'20:00'}]},{d:7,posts:[]},
          {d:8,posts:[]},{d:9,posts:[{p:'instagram',t:'11:00'}]},{d:10,posts:[]},
          {d:11,posts:[{p:'linkedin',t:'08:30'}]},{d:12,posts:[]},{d:13,posts:[{p:'facebook',t:'15:00'}]},{d:14,posts:[{p:'instagram',t:'12:00'}]},
        ].map(({d,posts}) => (
          <div key={d} className="min-h-[72px] p-2 border-r border-b border-[#0F172A]/8 last:border-r-0 bg-white">
            <span className="text-[9px] font-bold text-[#64748B] block mb-1">{d}</span>
            <div className="space-y-0.5">
              {posts.map((pp,j) => (
                <div key={j} className="flex items-center gap-1 px-1 py-0.5 rounded text-[8px]" style={{ background:`${pColor(pp.p)}15`, borderLeft:`2px solid ${pColor(pp.p)}` }}>
                  <span className="font-medium truncate" style={{ color:pColor(pp.p) }}>{pp.t}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Posts ────────────────────────────────────────────────────────────────────

const POSTS_DATA = [
  { init:'C', color:'#1877F2', pl:'facebook',  cap:'Cada paso que das hacia tus metas es una victoria…',   st:'published',      date:'Apr 30, 10:36 PM', lk:24, cm:3  },
  { init:'L', color:'#0A66C2', pl:'linkedin',  cap:'Industry insights for Q2 2026 — what changed and why', st:'scheduled',      date:'Jun 1, 09:00 AM',  lk:0,  cm:0  },
  { init:'S', color:'#E1306C', pl:'instagram', cap:'Sunday recap — a quiet week full of good decisions',    st:'draft',          date:'Jun 5',            lk:0,  cm:0  },
  { init:'P', color:'#1877F2', pl:'facebook',  cap:'Primera prueba de subida al calendario',               st:'published',      date:'Apr 30, 6:51 PM',  lk:8,  cm:1  },
  { init:'B', color:'#0A66C2', pl:'linkedin',  cap:'Behind the scenes — a week with the team',            st:'needs approval', date:'Jun 3',            lk:0,  cm:0  },
];

const ST_STYLE: Record<string,string> = {
  published:       'bg-[#ECFDF5] text-[#047857]',
  scheduled:       'bg-[#F1F5F9] text-[#334155]',
  draft:           'bg-[#F8FAFC] text-[#94A3B8]',
  'needs approval':'bg-[#FEF3C7] text-[#92400E]',
};

export function PostsSection() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-bold">All posts</h2>
        <span className="px-2.5 py-1.5 rounded-lg bg-[#0F172A] text-white text-[9px] font-bold pointer-events-none">+ New post</span>
      </div>
      <div className="flex gap-1">
        {['All','Published','Scheduled','Draft','Needs approval'].map((tab,i) => (
          <span key={tab} className={`px-2.5 py-1 rounded-full text-[9px] font-medium ${i===0 ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>{tab}</span>
        ))}
      </div>
      {POSTS_DATA.map((p,i) => (
        <div key={i} className="flex items-center gap-2.5 rounded-xl border border-[#0F172A]/8 bg-white px-3 py-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold shrink-0 text-[11px]" style={{ background: p.color }}>{p.init}</div>
          <span className="material-symbols-outlined text-[#94A3B8] shrink-0" style={{ fontSize: 13 }}>{p.pl==='instagram'?'photo_camera':p.pl==='linkedin'?'work':'thumb_up'}</span>
          <p className="text-[10px] text-[#334155] truncate flex-1">{p.cap}</p>
          <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full shrink-0 ${ST_STYLE[p.st]}`}>{p.st.toUpperCase()}</span>
          <span className="text-[8px] text-[#94A3B8] shrink-0 w-24 text-right">{p.date}</span>
          <div className="flex gap-3 shrink-0">
            {[['favorite',p.lk],['comment',p.cm]].map(([ic,v]) => (
              <div key={String(ic)} className="flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[#94A3B8]" style={{ fontSize: 10 }}>{ic}</span>
                <span className="text-[9px] text-[#64748B]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard Home ───────────────────────────────────────────────────────────

export function DashboardSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between pb-3 border-b border-[#0F172A]/8">
        <div>
          <p className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-[#64748B] mb-1.5">SUNDAY · MAY 31 · 2026</p>
          <h1 className="text-[20px] font-medium tracking-[-0.03em] leading-[1.1]">
            Plan a <em className="not-italic" style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontStyle: 'italic' }}>quiet</em> week ahead.
          </h1>
          <p className="text-[10px] text-[#64748B] mt-1 max-w-xs leading-relaxed">3 posts in the queue. Engagement is steady.</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {[['3','Scheduled'],['21','Total Posts'],['—','Engagement']].map(([v,l],i) => (
            <div key={l} className="flex items-center gap-4">
              {i > 0 && <div className="w-px h-6 bg-[#0F172A]/10" />}
              <div className="text-center">
                <p className="text-[20px] font-bold leading-none">{v}</p>
                <p className="text-[8px] font-mono uppercase tracking-[0.12em] text-[#64748B] mt-0.5">{l}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[#0F172A]/10 overflow-hidden relative bg-[#111827]" style={{ height: 160 }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 45% 55%,#4facfe 0%,#00f2fe 20%,#43e97b 40%,#f093fb 65%,#0F172A 85%)', opacity: 0.85 }} />
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)' }}>
            <span className="material-symbols-outlined text-white/80" style={{ fontSize: 9 }}>public</span>
            <span className="font-mono text-[7px] text-white font-bold uppercase tracking-wider">FACEBOOK · 1:1</span>
          </div>
        </div>
        <div className="rounded-2xl border border-[#0F172A]/10 bg-white p-4 flex flex-col gap-2" style={{ height: 160 }}>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
            <span className="text-[8px] font-mono uppercase tracking-[0.1em] text-[#111827]">Next Up · Sep 23</span>
          </div>
          <h3 className="text-[11px] font-medium leading-tight">Un viaje hacia la luna comienza con una visión clara...</h3>
          <p className="text-[10px] text-[#64748B] leading-relaxed line-clamp-2 flex-1">Cuando miramos más allá de lo visible, descubrimos un universo lleno de posibilidades...</p>
          <div className="flex items-center gap-1.5 pt-1.5 border-t border-[#0F172A]/8">
            <span className="px-2 py-1 rounded-lg bg-[#111827] text-white text-[8px] font-bold">Preview</span>
            <span className="px-2 py-1 rounded-lg border border-[#0F172A]/15 text-[8px] font-semibold">Edit post</span>
          </div>
        </div>
        <div className="flex flex-col gap-2" style={{ height: 160 }}>
          <div className="flex-1 rounded-2xl border p-3 flex flex-col gap-1" style={{ borderColor: 'rgba(14,159,110,0.22)', background: 'rgba(14,159,110,0.10)' }}>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-[#111827] flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>add</span>
              </div>
              <span className="text-[8px] font-mono font-bold uppercase text-[#111827]">Compose</span>
            </div>
            <p className="text-[10px] font-semibold">Write something for tomorrow.</p>
            <p className="text-[9px] text-[#64748B]">AI can help with caption</p>
          </div>
          {[['auto_awesome','Generate caption','Brand voice'],['calendar_month','Plan the week','3 posts']].map(([ic,t,s]) => (
            <div key={t} className="rounded-2xl border border-[#0F172A]/10 bg-white px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 12 }}>{ic}</span>
                <div><p className="text-[9px] font-medium">{t}</p><p className="text-[8px] text-[#64748B]">{s}</p></div>
              </div>
              <span className="material-symbols-outlined text-[#94A3B8]" style={{ fontSize: 13 }}>chevron_right</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 border border-[#0F172A]/10 rounded-xl overflow-hidden">
        {DASH_WEEK_DAYS.map(({ day, date, posts }) => (
          <div key={day} className={`min-h-[70px] p-1.5 border-r border-[#0F172A]/10 last:border-r-0 flex flex-col ${date==='31' ? 'bg-[#F4E0D6]/30' : ''}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[7px] font-mono uppercase tracking-widest text-[#64748B]">{day}</span>
              <span className="text-[9px] font-bold">{date}</span>
            </div>
            {posts.length === 0 ? <span className="text-[#94A3B8] text-[10px]">–</span> : posts.map((p,j) => (
              <div key={j} className="px-1 py-0.5 rounded text-[8px] bg-[#F1F5F9] truncate" style={{ borderLeft:`2px solid ${pColor(p.platform)}` }}>
                <span className="truncate text-[#334155]">{p.caption.slice(0,12)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        {DASH_RECENT.map((post,i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-xl border border-[#0F172A]/8 bg-white px-3 py-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white font-bold shrink-0 text-[11px]" style={{ background: post.color }}>{post.initial}</div>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white shrink-0" style={{ background: '#10B981' }}>PUBLISHED</span>
            <p className="text-[10px] text-[#334155] truncate flex-1">{post.caption}</p>
            <span className="text-[8px] text-[#94A3B8] shrink-0">{post.date}</span>
            {[['0','Likes'],['—','Cmts'],['0','Shares']].map(([v,l]) => (
              <div key={l} className="text-center shrink-0"><p className="text-[9px] font-bold">{v}</p><p className="text-[7px] text-[#94A3B8] uppercase">{l}</p></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Configure ───────────────────────────────────────────────────────────────

export function ConfigureSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-[13px] font-bold">Platform connections</h2>
      <div className="space-y-2">
        {[
          { name:'Instagram', handle:'@mitienda.mx',    color:'#E1306C', icon:'photo_camera' },
          { name:'LinkedIn',  handle:'Alejandro Mendez', color:'#0A66C2', icon:'work'         },
          { name:'Facebook',  handle:'Prueba Page',      color:'#1877F2', icon:'thumb_up'     },
        ].map(({name,handle,color,icon}) => (
          <div key={name} className="flex items-center gap-3 rounded-2xl border border-[#0F172A]/10 bg-white px-4 py-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background:`${color}15` }}>
              <span className="material-symbols-outlined" style={{ fontSize:18, color }}>{icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold">{name}</p>
              <p className="text-[9px] text-[#64748B]">{handle}</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-[8px] font-bold text-[#047857]">Connected</span>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-[#0F172A]/10 bg-white divide-y divide-[#0F172A]/8 overflow-hidden">
        <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest px-4 py-2.5 bg-[#F8FAFC]">Workspace settings</div>
        {[['Timezone','America/Mexico_City','language'],['Default language','Spanish','translate'],['Post notifications','Enabled','notifications']].map(([l,v,ic]) => (
          <div key={String(l)} className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#94A3B8]" style={{ fontSize:13 }}>{ic}</span>
              <span className="text-[10px] font-medium">{l}</span>
            </div>
            <span className="text-[10px] text-[#64748B]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export function InsightsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-bold">Insights</h2>
        <span className="px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[9px] font-medium text-[#64748B]">Last 30 days</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[['4,218','Total reach','+12%'],['6.2%','Avg engagement','+0.8%'],['12,045','Impressions','+18%'],['87','New followers','+5%']].map(([v,l,d]) => (
          <div key={l} className="rounded-2xl border border-[#0F172A]/10 bg-white p-3">
            <p className="text-[18px] font-bold leading-none mb-1">{v}</p>
            <p className="text-[9px] text-[#64748B]">{l}</p>
            <p className="text-[8px] font-semibold text-[#047857] mt-1">{d}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-[#0F172A]/10 bg-white p-4">
        <h3 className="text-[11px] font-bold mb-3">Platform performance</h3>
        <div className="space-y-2.5">
          {[['Instagram','#E1306C',45],['LinkedIn','#0A66C2',35],['Facebook','#1877F2',20]].map(([n,c,pct]) => (
            <div key={String(n)} className="flex items-center gap-3">
              <span className="text-[9px] font-medium w-16 shrink-0 text-[#334155]">{n}</span>
              <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                <div className="h-full rounded-full" style={{ width:`${pct}%`, background:String(c) }} />
              </div>
              <span className="text-[9px] font-semibold w-8 text-right text-[#64748B]">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <h3 className="text-[11px] font-bold mb-2">Top posts this month</h3>
        {[['#E1306C','Product launch reel','1,240 reach','8.4%'],['#0A66C2','Industry insights Q2','980 reach','7.1%'],['#1877F2','Community spotlight','760 reach','5.9%']].map(([c,t,r,e]) => (
          <div key={String(t)} className="flex items-center gap-2.5 rounded-xl border border-[#0F172A]/8 bg-white px-3 py-2">
            <div className="w-2 h-8 rounded-full shrink-0" style={{ background:String(c) }} />
            <p className="text-[10px] font-medium text-[#334155] flex-1">{t}</p>
            <span className="text-[9px] text-[#64748B]">{r}</span>
            <span className="text-[9px] font-bold text-[#047857]">{e}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
