import { useEffect, useRef, useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductShell from '../components/landing/ProductShell';

gsap.registerPlugin(ScrollTrigger);

const CAPTIONS = [
  { platform: 'ig', label: 'Instagram', color: '#E4405F', text: '✨ Big things are coming. We\'ve been building something that\'s going to change how you create content. Drop a 🔥 if you want early access. #ContentCreator #SocialMedia #Vielinks' },
  { platform: 'li', label: 'LinkedIn',  color: '#0a66c2', text: "After 6 months of research, we've uncovered what separates top-performing LinkedIn posts from the rest. It's not length, frequency, or even timing. It's authenticity. Here's what we found..." },
  { platform: 'fb', label: 'Facebook',  color: '#1877f2', text: "We're giving away 3 months of Vielinks Pro to our community 🎉 All you have to do is like this post and tag a friend who's serious about growing on social. Drawing this Friday!" },
];

const INSIGHTS = [
  { icon: 'access_time',   title: 'Best time to post',      desc: 'Tuesday 9:15 AM',   sub: 'Your audience is most active then',  badge: 'Today' },
  { icon: 'tag',           title: 'Trending hashtags',      desc: '#ContentMarketing', sub: '+240% volume this week',               badge: 'Hot' },
  { icon: 'article',       title: 'Optimal caption length', desc: '80-120 characters', sub: 'For Instagram based on your audience', badge: 'Tip'  },
  { icon: 'emoji_events',  title: 'Top content format',     desc: 'Carousel posts',    sub: '3× more saves than single images',    badge: 'Pro'  },
];

const AI_FEATURES = [
  { icon: 'auto_fix_high',  title: 'Caption generator',      body: 'Generate platform-optimized captions in seconds. Tone-aware: professional for LinkedIn, punchy for Instagram.' },
  { icon: 'schedule',       title: 'Smart timing',           body: 'Machine learning models trained on millions of posts find the exact window your followers are online.' },
  { icon: 'tag',            title: 'Hashtag intelligence',   body: "Don't guess which hashtags to use. Our AI ranks them by relevance, volume, and competition." },
  { icon: 'image_search',   title: 'Visual scoring',         body: 'Upload an image and get a predicted engagement score before you post it.' },
  { icon: 'trending_up',    title: 'Growth recommendations', body: "Weekly AI-generated action list: what to post, when to post it, and why it'll perform." },
  { icon: 'translate',      title: 'Multi-language support', body: 'Generate captions in 12+ languages to reach global audiences without a translator.' },
];

export default function ProductAIInsights() {
  useSEO({
    title: 'Vielinks AI Insights - Smart Social Media Suggestions',
    description: 'AI that knows your audience and platforms. Get caption suggestions, optimal posting times, trending hashtags, and engagement scoring.',
    keywords: 'social media AI, AI captions, hashtag generator, best time to post, content scoring',
  });

  const navigate = useNavigate();
  const [activeCap, setActiveCap] = useState(0);
  const [typing, setTyping] = useState(false);
  const featRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTyping(true);
      setTimeout(() => {
        setActiveCap(p => (p + 1) % CAPTIONS.length);
        setTyping(false);
      }, 500);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-feat]',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: featRef.current, start: 'top 78%', once: true } }
      );
    });
    return () => ctx.revert();
  }, []);

  const cap = CAPTIONS[activeCap];

  return (
    <ProductShell>
      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#7DD3C7]/[0.06] blur-[130px]" />
        <div className="mx-auto max-w-5xl px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#7DD3C7]/20 bg-[#7DD3C7]/8 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#7DD3C7]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7DD3C7]" /> Product · AI Insights
            </span>
            <h1 className="mt-5 text-5xl md:text-[4rem] font-extrabold leading-[0.96] tracking-[-0.04em] text-[#1C1814]">
              Write smarter.<br />
              <span className="bg-gradient-to-r from-[#7DD3C7] via-[#f0dcff] to-inverse-primary bg-clip-text text-transparent">
                Post at the right time.
              </span>
            </h1>
            <p className="mt-6 text-lg font-light text-[#1C1814]/55 max-w-xl mx-auto leading-relaxed">
              AI that knows your audience, your platforms, and your voice. Captions, timing, hashtags — handled.
            </p>
            <button onClick={() => navigate('/register')} className="mt-8 rounded-full bg-[#7DD3C7] px-8 py-3.5 text-sm font-bold text-[#0B0B0A] hover:shadow-[0_0_32px_rgba(125,211,199,0.4)] transition-all active:scale-[0.98]">
              Try AI for free
            </button>
          </motion.div>
        </div>
      </section>

      {/* Caption generator demo */}
      <section className="py-12 mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-white/[0.07] bg-[#111]/70 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
            <span className="material-symbols-outlined text-[#7DD3C7]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-sm font-bold text-[#1C1814]">AI Caption Generator</span>
            <div className="ml-auto flex gap-2">
              {CAPTIONS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCap(i)}
                  className="px-3 py-1 rounded-full text-[10px] font-bold border transition-all"
                  style={activeCap === i ? { borderColor: `${c.color}50`, color: c.color, backgroundColor: `${c.color}15` } : { borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}
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
                  className="text-sm text-[#1C1814]/80 leading-relaxed"
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
                      className="w-1.5 h-1.5 rounded-full bg-[#7DD3C7]"
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="px-6 py-3 border-t border-white/[0.04] flex items-center justify-between">
            <span className="text-[10px] text-[#1C1814]/25">Generated in 0.8s · optimized for {cap?.label}</span>
            <button className="text-[10px] font-semibold text-[#7DD3C7] hover:text-[#c97cff] transition-colors">Regenerate →</button>
          </div>
        </div>
      </section>

      {/* Insight cards */}
      <section className="py-8 mx-auto max-w-5xl px-6">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#7DD3C7] mb-6 text-center">Live AI insights for your account</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {INSIGHTS.map((ins) => (
            <motion.div
              key={ins.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/[0.07] bg-[#111]/70 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-[#7DD3C7]" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>{ins.icon}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#7DD3C7]/10 text-[#7DD3C7] text-[9px] font-bold">{ins.badge}</span>
              </div>
              <p className="text-[10px] text-[#1C1814]/40 mb-1">{ins.title}</p>
              <p className="text-sm font-bold text-[#1C1814]">{ins.desc}</p>
              <p className="text-[10px] text-[#1C1814]/30 mt-1">{ins.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20 mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1C1814]">The full AI toolkit</h2>
          <p className="mt-3 text-[#1C1814]/45">Every AI feature in one place, no prompt engineering required.</p>
        </div>
        <div ref={featRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_FEATURES.map((f) => (
            <div key={f.title} data-feat style={{ opacity: 0 }} className="rounded-2xl border border-white/[0.07] bg-[#111]/70 p-6 hover:border-[#7DD3C7]/20 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#7DD3C7]/8 border border-[#7DD3C7]/12 flex items-center justify-center mb-4 group-hover:bg-[#7DD3C7]/15 transition-colors">
                <span className="material-symbols-outlined text-[#7DD3C7]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-[#1C1814] mb-2">{f.title}</h3>
              <p className="text-sm text-[#1C1814]/45 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </ProductShell>
  );
}
