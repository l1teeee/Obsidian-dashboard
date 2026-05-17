import { useEffect, useRef, useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroBadge from '../components/landing/HeroBadge';
import ProductShell from '../components/landing/ProductShell';

gsap.registerPlugin(ScrollTrigger);

const CAPTIONS = [
  {
    platform: 'ig',
    label: 'Instagram',
    color: '#E4405F',
    text: 'Big things are coming. We have been building something that changes how you create content — and we want you to be first. Drop a comment if you want early access. #ContentCreator #SocialMedia #Vielinks',
  },
  {
    platform: 'li',
    label: 'LinkedIn',
    color: '#0a66c2',
    text: "After 6 months of research, we uncovered what separates top-performing LinkedIn posts from the rest. It is not length, frequency, or even timing. It is authenticity. Here is what we found — and how to apply it today.",
  },
  {
    platform: 'fb',
    label: 'Facebook',
    color: '#1877f2',
    text: "We are giving away 3 months of Vielinks Pro to our community. Like this post and tag a friend who is serious about growing on social. Drawing closes this Friday.",
  },
];

const INSIGHTS = [
  { icon: 'access_time',  title: 'Best time to post',      desc: 'Tuesday 9:15 AM',   sub: 'Your audience is most active then',  badge: 'Today' },
  { icon: 'tag',          title: 'Trending hashtags',      desc: '#ContentMarketing', sub: '+240% volume this week',               badge: 'Hot'   },
  { icon: 'article',      title: 'Optimal caption length', desc: '80–120 characters', sub: 'For Instagram based on your audience', badge: 'Tip'   },
  { icon: 'grid_view',    title: 'Top content format',     desc: 'Carousel posts',    sub: '3x more saves than single images',    badge: 'Pro'   },
];

const PLATFORM_RECS = [
  {
    name: 'Instagram', icon: 'camera_alt', color: '#E4405F',
    recs: ['Post at 10 AM Tuesday', 'Carousel format for +3x saves', 'Keep captions under 110 characters'],
  },
  {
    name: 'LinkedIn', icon: 'work', color: '#0a66c2',
    recs: ['Post at 8 AM Wednesday', 'Long-form performs best here', 'Professional tone, first-person voice'],
  },
  {
    name: 'Facebook', icon: 'thumb_up', color: '#1877f2',
    recs: ['Post at 6 PM Thursday', 'Video drives 3x more reach', 'Ask a direct question to drive comments'],
  },
];

const WEEKLY_ACTIONS = [
  { label: 'Post carousel on Instagram — Tuesday 10 AM',       done: false },
  { label: 'Publish LinkedIn article on industry trend',        done: false },
  { label: 'Boost top-performing Facebook post from last week', done: false },
  { label: 'Refresh hashtag set for Instagram',                 done: true  },
  { label: 'Update profile bio link to latest campaign',        done: true  },
];

const GUARDRAILS = [
  {
    icon: 'record_voice_over',
    title: 'Brand voice preservation',
    body: 'Set your tone guidelines once. Every AI suggestion adapts to your voice — professional, casual, or somewhere in between.',
    color: '#4A6A82',
  },
  {
    icon: 'rate_review',
    title: 'Human review before publish',
    body: 'AI generates, you decide. Every suggestion goes through your approval flow before it reaches your audience.',
    color: '#4F7A4A',
  },
  {
    icon: 'tune',
    title: 'Adjustable confidence',
    body: 'Choose how much the AI rewrites. From light edits to full regeneration — you set the boundary.',
    color: '#C8553A',
  },
];

const AI_FEATURES = [
  { icon: 'auto_fix_high',  title: 'Caption generator',      body: 'Generate platform-optimized captions in seconds. Tone-aware: professional for LinkedIn, direct for Instagram.' },
  { icon: 'schedule',       title: 'Smart timing',           body: 'Models trained on millions of posts find the exact publishing window when your followers are most active.' },
  { icon: 'tag',            title: 'Hashtag intelligence',   body: 'Ranked by relevance, volume, and competition — not guesswork. Updated weekly per platform.' },
  { icon: 'image_search',   title: 'Visual scoring',         body: 'Upload an image and get a predicted engagement score before you publish it.' },
  { icon: 'trending_up',    title: 'Growth recommendations', body: 'Weekly AI-generated action list: what to post, when to post, and why it will perform.' },
  { icon: 'translate',      title: 'Multi-language support', body: 'Generate captions in 12+ languages to reach global audiences without a translator.' },
];

export default function ProductAIInsights() {
  useSEO({
    title: 'Vielinks AI Insights - Smart Social Media Recommendations',
    description: 'Turn performance data into your next best move. AI-powered captions, timing, hashtags, and weekly action plans for Instagram, LinkedIn, and Facebook.',
    keywords: 'social media AI, AI captions, hashtag generator, best time to post, content recommendations',
  });

  const navigate   = useNavigate();
  const [activeCap, setActiveCap] = useState(0);
  const [typing, setTyping]       = useState(false);
  const featRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTyping(true);
      setTimeout(() => {
        setActiveCap(p => (p + 1) % CAPTIONS.length);
        setTyping(false);
      }, 500);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-feat]',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: featRef.current, start: 'top 78%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const cap = CAPTIONS[activeCap];

  return (
    <ProductShell>
      {/* Hero */}
      <section className="pt-36 pb-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <HeroBadge className="mb-5">
              For teams who use AI with taste
            </HeroBadge>
            <h1 className="mt-5 text-[clamp(36px,5vw,60px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#15140F]">
              Turn performance<br />
              <span className="text-[#C8553A]">into the next best move.</span>
            </h1>
            <p className="mt-6 text-[15px] leading-[1.65] text-[#6B655B] max-w-xl mx-auto">
              AI that acts as an editorial assistant — not a content factory. Practical suggestions grounded in your real performance data.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#C8553A] px-8 py-3 text-[14px] font-medium text-white hover:bg-[#A53F28] transition-all duration-200 active:scale-[0.98]"
            >
              Try AI Insights free
            </button>
          </motion.div>
        </div>
      </section>

      {/* Caption generator demo */}
      <section className="py-12 mx-auto max-w-4xl px-6">
        <div className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(21,20,15,0.08)] flex items-center gap-3">
            <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-sm font-bold text-[#15140F]">Caption assistant</span>
            <div className="ml-auto flex gap-2">
              {CAPTIONS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCap(i)}
                  className="px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer"
                  style={
                    activeCap === i
                      ? { borderColor: `${c.color}50`, color: c.color, backgroundColor: `${c.color}15` }
                      : { borderColor: 'rgba(21,20,15,0.12)', color: '#6B655B' }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 min-h-[140px] relative">
            <AnimatePresence mode="wait">
              {!typing && cap && (
                <motion.p
                  key={activeCap}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-[#15140F]/80 leading-relaxed"
                >
                  {cap.text}
                </motion.p>
              )}
              {typing && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1 pt-2"
                >
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1.5 h-1.5 rounded-full bg-[#C8553A]"
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="px-6 py-3 border-t border-[rgba(21,20,15,0.06)] flex items-center justify-between">
            <span className="text-[10px] text-[#A39B8B]">Generated in 0.8s · optimized for {cap?.label}</span>
            <button className="text-[10px] font-semibold text-[#C8553A] hover:text-[#A53F28] transition-colors cursor-pointer">Regenerate</button>
          </div>
        </div>
      </section>

      {/* Live insight cards */}
      <section className="py-8 mx-auto max-w-5xl px-6">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C8553A] mb-6 text-center">Live recommendations for your account</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {INSIGHTS.map((ins) => (
            <motion.div
              key={ins.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>{ins.icon}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#C8553A]/10 text-[#C8553A] text-[9px] font-bold">{ins.badge}</span>
              </div>
              <p className="text-[10px] text-[#6B655B] mb-1">{ins.title}</p>
              <p className="text-sm font-bold text-[#15140F]">{ins.desc}</p>
              <p className="text-[10px] text-[#A39B8B] mt-1">{ins.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recommendations by platform */}
      <section className="py-16 border-y border-[rgba(21,20,15,0.08)]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-10">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C8553A] mb-3">By platform</p>
            <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#15140F]">Advice tailored to each channel.</h2>
            <p className="mt-3 text-[#6B655B] max-w-md mx-auto text-sm leading-relaxed">Instagram, LinkedIn, and Facebook have different audiences and algorithms. Your recommendations reflect that.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {PLATFORM_RECS.map((p) => (
              <div key={p.name} className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${p.color}18`, border: `1px solid ${p.color}28` }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: p.color, fontVariationSettings: "'FILL' 1" }}>{p.icon}</span>
                  </div>
                  <span className="text-sm font-bold text-[#15140F]">{p.name}</span>
                </div>
                <ul className="space-y-2.5">
                  {p.recs.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#6B655B] leading-relaxed">
                      <span className="material-symbols-outlined shrink-0 mt-0.5" style={{ fontSize: 13, color: p.color, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best-time engine */}
      <section className="py-16 mx-auto max-w-5xl px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C8553A] mb-3">Best-time engine</p>
            <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#15140F] mb-4">Post when your audience is actually there.</h2>
            <p className="text-[#6B655B] text-sm leading-relaxed mb-6">
              The engine analyzes your follower activity patterns and cross-references them with platform-level data to find the windows that maximize reach for each account.
            </p>
            <div className="space-y-2">
              {[
                { day: 'Monday',    time: '8:30 AM',  strength: 62 },
                { day: 'Tuesday',   time: '9:15 AM',  strength: 91 },
                { day: 'Wednesday', time: '12:00 PM', strength: 74 },
                { day: 'Thursday',  time: '8:00 AM',  strength: 68 },
                { day: 'Friday',    time: '11:30 AM', strength: 55 },
              ].map((row) => (
                <div key={row.day} className="flex items-center gap-3">
                  <span className="text-xs text-[#6B655B] w-24 shrink-0">{row.day}</span>
                  <span className="text-xs font-bold text-[#15140F] w-16 shrink-0">{row.time}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-[#EFE9DC]">
                    <div
                      className="h-full rounded-full bg-[#C8553A]"
                      style={{ width: `${row.strength}%`, opacity: 0.5 + (row.strength / 200) }}
                    />
                  </div>
                  <span className="text-[10px] text-[#A39B8B] w-8 text-right">{row.strength}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>access_time</span>
              <span className="text-xs font-bold text-[#15140F]">This week's best slot</span>
            </div>
            <div className="rounded-xl border border-[#C8553A]/20 bg-[#F5EBE8] p-5 mb-4">
              <p className="text-3xl font-semibold text-[#C8553A]">Tuesday</p>
              <p className="text-lg font-bold text-[#15140F]">9:15 AM</p>
              <p className="text-xs text-[#6B655B] mt-1">91% audience activity score</p>
            </div>
            <p className="text-xs text-[#6B655B] leading-relaxed">Based on your last 30 days of follower data across Instagram. Updated every Sunday.</p>
          </div>
        </div>
      </section>

      {/* Weekly action list */}
      <section className="py-16 border-y border-[rgba(21,20,15,0.08)]">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-10">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C8553A] mb-3">Weekly plan</p>
            <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#15140F]">Seven days of clarity.</h2>
            <p className="mt-3 text-[#6B655B] max-w-md mx-auto text-sm leading-relaxed">Every Monday, Vielinks generates a focused action list based on last week's performance and upcoming opportunities.</p>
          </div>
          <div className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] divide-y divide-[rgba(21,20,15,0.06)]">
            {WEEKLY_ACTIONS.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${item.done ? 'border-[#4F7A4A] bg-[#4F7A4A]' : 'border-[#D8D2C4]'}`}>
                  {item.done && (
                    <span className="material-symbols-outlined text-white" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>check</span>
                  )}
                </div>
                <span className={`text-sm ${item.done ? 'text-[#A39B8B] line-through' : 'text-[#15140F]'}`}>{item.label}</span>
                {!item.done && (
                  <span className="ml-auto text-[10px] font-bold text-[#C8553A] bg-[#C8553A]/10 px-2 py-0.5 rounded-full shrink-0">AI suggested</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guardrails */}
      <section className="py-16 mx-auto max-w-5xl px-6">
        <div className="text-center mb-10">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#C8553A] mb-3">Guardrails</p>
          <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#15140F]">AI that works for you, not around you.</h2>
          <p className="mt-3 text-[#6B655B] max-w-md mx-auto text-sm leading-relaxed">Suggestions are a starting point. Your brand voice, review process, and judgment stay in control.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {GUARDRAILS.map((g) => (
            <div key={g.title} className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${g.color}12`, border: `1px solid ${g.color}22` }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: g.color, fontVariationSettings: "'FILL' 1" }}>{g.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-[#15140F] mb-2">{g.title}</h3>
              <p className="text-sm text-[#6B655B] leading-relaxed">{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20 mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-[clamp(24px,3.5vw,40px)] font-medium tracking-[-0.03em] text-[#15140F]">The full AI toolkit</h2>
          <p className="mt-3 text-[#6B655B]">Every AI feature in one place — no prompt engineering required.</p>
        </div>
        <div ref={featRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_FEATURES.map((f) => (
            <div
              key={f.title}
              data-feat
              style={{ opacity: 0 }}
              className="rounded-2xl border border-[rgba(21,20,15,0.10)] bg-[#FBF8F2] p-6 hover:border-[#C8553A]/20 hover:bg-[#EFE9DC] transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#C8553A]/8 border border-[#C8553A]/12 flex items-center justify-center mb-4 group-hover:bg-[#C8553A]/15 transition-colors">
                <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-[#15140F] mb-2">{f.title}</h3>
              <p className="text-sm text-[#6B655B] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </ProductShell>
  );
}
