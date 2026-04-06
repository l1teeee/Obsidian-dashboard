
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const bars = [
    { day: 'Mon', h: 55 },
    { day: 'Tue', h: 38 },
    { day: 'Wed', h: 78 },
    { day: 'Thu', h: 48 },
    { day: 'Fri', h: 68 },
];

const features = [
    'Predictive Engagement Modeling',
    'Competitor Heatmap Overlays',
    'Cross-Platform Attribution Metrics',
];

export default function AnalyticsSection() {
    const sectionRef = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // willChange antes del timeline
            gsap.set(
                [
                    '[data-a="eyebrow"]',
                    '[data-a="title"]',
                    '[data-a="desc"]',
                    '[data-a="feature"]',
                    '[data-a="chart-shell"]',
                    '[data-a="metric"]',
                    '[data-a="bar-wrap"]',
                    '[data-a="day"]',
                ],
                { willChange: 'transform, opacity, filter' }
            );

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 72%',
                    toggleActions: 'play none none none',
                    once: true,
                },
                defaults: { ease: 'power3.out' },
            });

            tl
                .to('[data-a="orb-1"]', { opacity: 1, duration: 0.8 }, 0)
                .to('[data-a="orb-2"]', { opacity: 1, duration: 0.8 }, 0.1)
                .fromTo('[data-a="eyebrow"]',
                    { opacity: 0, y: 12, filter: 'blur(8px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4 },
                    0.05
                )
                .fromTo('[data-a="title"]',
                    { opacity: 0, y: 20, filter: 'blur(10px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55 },
                    '-=0.2'
                )
                .fromTo('[data-a="desc"]',
                    { opacity: 0, y: 14 },
                    { opacity: 1, y: 0, duration: 0.45 },
                    '-=0.3'
                )
                .fromTo('[data-a="feature"]',
                    { opacity: 0, y: 12 },
                    { opacity: 1, y: 0, duration: 0.38, stagger: 0.06 },
                    '-=0.25'
                )
                .fromTo('[data-a="chart-shell"]',
                    { opacity: 0, y: 28, scale: 0.988, filter: 'blur(12px)' },
                    { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.65 },
                    '-=0.55'
                )
                .fromTo('[data-a="metric"]',
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.35, stagger: 0.04 },
                    '-=0.4'
                )
                .fromTo('[data-a="bar-wrap"]',
                    { opacity: 0, y: 12 },
                    { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 },
                    '-=0.25'
                )
                .fromTo('[data-a="bar-fill"]',
                    { scaleY: 0, transformOrigin: 'bottom center' },
                    { scaleY: 1, duration: 0.6, stagger: 0.06, ease: 'power4.out' },
                    '-=0.3'
                )
                .fromTo('[data-a="day"]',
                    { opacity: 0, y: 6 },
                    { opacity: 1, y: 0, duration: 0.28, stagger: 0.04 },
                    '-=0.4'
                )
                .add(() => {
                    gsap.to('[data-a="orb-1"]', {
                        y: -16, x: 10,
                        duration: 4.6, repeat: -1, yoyo: true, ease: 'sine.inOut',
                    });
                    gsap.to('[data-a="orb-2"]', {
                        y: 18, x: -12,
                        duration: 5.4, repeat: -1, yoyo: true, ease: 'sine.inOut',
                    });
                    gsap.to('[data-a="chart-glow"]', {
                        opacity: 0.7,
                        duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut',
                    });
                });
        }, sectionRef); // <-- scope al ref, igual que en ObsidianNav

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="Analytics"
            className="relative overflow-hidden py-32 md:py-40"
        >
            {/* Orbs — invisibles en el HTML, GSAP los revela al hacer scroll */}
            <div
                data-a="orb-1"
                style={{ opacity: 0 }}
                className="pointer-events-none absolute left-[6%] top-20 h-72 w-72 rounded-full bg-[#d394ff]/8 blur-[110px]"
            />
            <div
                data-a="orb-2"
                style={{ opacity: 0 }}
                className="pointer-events-none absolute bottom-10 right-[4%] h-72 w-72 rounded-full bg-[#aa30fa]/8 blur-[110px]"
            />

            <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-6 md:px-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-24">

                {/* ── Columna izquierda ── */}
                <div className="order-1 max-w-[620px]">
          <span
              data-a="eyebrow"
              style={{ opacity: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d394ff]/18 bg-[#d394ff]/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#d394ff]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
            Advanced Intelligence
          </span>

                    <h2
                        data-a="title"
                        style={{ opacity: 0 }}
                        className="font-headline text-4xl font-extrabold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl"
                    >
                        Data as beautiful
                        <br />
                        <span className="bg-gradient-to-b from-white via-[#f0dcff] to-[#c97cff] bg-clip-text text-transparent">
              as your content.
            </span>
                    </h2>

                    <p
                        data-a="desc"
                        style={{ opacity: 0 }}
                        className="mt-7 max-w-[560px] text-[1.02rem] font-light leading-8 text-[#adaaaa] md:text-[1.08rem]"
                    >
                        Vielinks translates complex social signals into editorial
                        insights. Identify trend-breakouts before they peak and optimize
                        your posting schedule with surgical precision.
                    </p>

                    <ul className="mt-10 space-y-4">
                        {features.map((feature) => (
                            <li
                                key={feature}
                                data-a="feature"
                                style={{ opacity: 0 }}
                                className="group flex items-center gap-4"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d394ff]/18 bg-[#d394ff]/10 text-[#d394ff] transition-all duration-300 group-hover:bg-[#d394ff] group-hover:text-[#4a0076]">
                                    <svg
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2.4}
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium tracking-[0.01em] text-[#e5e2e1] md:text-[0.96rem]">
                  {feature}
                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Columna derecha: chart ── */}
                <div className="order-2">
                    <div
                        data-a="chart-shell"
                        style={{ opacity: 0 }}
                        className="relative mx-auto max-w-[560px]"
                    >
                        <div
                            data-a="chart-glow"
                            className="pointer-events-none absolute inset-x-10 top-8 h-32 rounded-full bg-[#d394ff]/10 blur-[80px]"
                        />

                        <div className="relative overflow-hidden rounded-[2rem] border border-[#494847]/20 bg-[#1a1919]/72 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:rounded-[2.4rem] md:p-8">
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.00)_35%)]" />
                            <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

                            <div className="relative z-10">
                                <div className="mb-10 flex items-start justify-between gap-6">
                                    <div>
                                        <p
                                            data-a="metric"
                                            style={{ opacity: 0 }}
                                            className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#adaaaa]/58"
                                        >
                                            Engagement Velocity
                                        </p>
                                        <div className="flex items-end gap-3">
                                            <p
                                                data-a="metric"
                                                style={{ opacity: 0 }}
                                                className="font-headline text-[2.2rem] font-extrabold tracking-[-0.05em] text-white md:text-[2.7rem]"
                                            >
                                                342,109
                                            </p>
                                            <span
                                                data-a="metric"
                                                style={{ opacity: 0 }}
                                                className="mb-1 inline-flex rounded-full border border-[#d394ff]/16 bg-[#d394ff]/10 px-2.5 py-1 text-[0.72rem] font-semibold text-[#d394ff]"
                                            >
                        +12.4%
                      </span>
                                        </div>
                                    </div>

                                    <div data-a="metric" style={{ opacity: 0 }} className="flex gap-2">
                                        {['↓', '⋯'].map((icon, i) => (
                                            <button
                                                key={i}
                                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-[#262626]/80 text-xs text-[#adaaaa] transition-all duration-300 hover:border-white/10 hover:text-white"
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Barras */}
                                <div className="mb-4 flex h-52 items-end gap-3 md:gap-4">
                                    {bars.map((bar) => (
                                        <div
                                            key={bar.day}
                                            data-a="bar-wrap"
                                            style={{ opacity: 0 }}
                                            className="flex flex-1 flex-col justify-end"
                                        >
                                            <div className="relative h-44 overflow-hidden rounded-[1.15rem] border border-white/[0.04] bg-white/[0.02]">
                                                <div
                                                    data-a="bar-fill"
                                                    className="absolute inset-x-0 bottom-0 rounded-[1rem] border-t border-[#d394ff]/35 bg-gradient-to-t from-[#d394ff]/55 via-[#d394ff]/28 to-[#d394ff]/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
                                                    style={{ height: `${bar.h}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Labels días */}
                                <div className="flex justify-between gap-3 md:gap-4">
                                    {bars.map((bar) => (
                                        <span
                                            key={bar.day}
                                            data-a="day"
                                            style={{ opacity: 0 }}
                                            className="flex-1 text-center text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#adaaaa]/38"
                                        >
                      {bar.day}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}