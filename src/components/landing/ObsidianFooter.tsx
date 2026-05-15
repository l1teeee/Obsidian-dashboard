import { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  Product: [
    { label: 'Dashboard', href: '/product/dashboard' },
    { label: 'Analytics', href: '/product/analytics' },
    { label: 'Calendar', href: '/product/scheduler' },
    { label: 'AI Insights', href: '/product/ai-insights' },
    { label: 'Integrations', href: '/product/integrations' },
  ],
  Resources: [
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: 'mailto:hello@vielinks.com' },
  ],
  Trust: [
    { label: 'Security', href: 'mailto:hello@vielinks.com?subject=Security%20question' },
    { label: 'Privacy Policy', href: 'mailto:hello@vielinks.com?subject=Privacy%20policy' },
    { label: 'Terms of Service', href: 'mailto:hello@vielinks.com?subject=Terms%20of%20service' },
    { label: 'API Status', href: 'mailto:hello@vielinks.com?subject=API%20status' },
  ],
};

const bottomLinks = [
  { label: 'Privacy Policy', href: 'mailto:hello@vielinks.com?subject=Privacy%20policy' },
  { label: 'Terms of Service', href: 'mailto:hello@vielinks.com?subject=Terms%20of%20service' },
  { label: 'Cookie Settings', href: 'mailto:hello@vielinks.com?subject=Cookie%20settings' },
];

export default function ObsidianFooter() {
  const footerRef = useRef<HTMLElement | null>(null);
  const navigate  = useNavigate();
  useLayoutEffect(() => {
    if (!footerRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('[data-ft="links"],[data-ft="bottom"]', { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo('[data-ft="links"]',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55 }
      )
      .fromTo('[data-ft="bottom"]',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.25'
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-[#F6F2EA]">
      {/* Top separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7E0D0] to-transparent" />

      {/* ── Links + brand ──────────────────────────────────── */}
      <div
        data-ft="links"
        style={{ opacity: 0 }}
        className="mx-auto max-w-[1440px] px-6 py-16 md:px-12"
      >
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1fr_auto_auto_auto] md:gap-16 lg:gap-24">
          {/* Brand column */}
          <div className="col-span-2 flex flex-col gap-6 md:col-span-1">
            <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
              <img src="/favicon.png" alt="Vielinks" className="h-8 w-8 object-contain opacity-90 transition-opacity group-hover:opacity-100" />
              <span className="text-base font-extrabold tracking-tight text-[#15140F]">Vielinks</span>
            </button>
            <p className="max-w-[240px] text-[0.82rem] leading-[1.75] text-[#15140F]/50">
              The unified command center for social media teams. Built for brands that publish with intention.
            </p>

            <a
              href="mailto:hello@vielinks.com"
              className="inline-flex w-fit items-center rounded-full border border-[#D8D2C4] bg-[#FBF8F2] px-4 py-2 text-[0.78rem] font-semibold text-[#3D3A30] transition-all duration-300 hover:border-[#C8553A]/40 hover:bg-[#EFE9DC] hover:text-[#15140F]"
            >
              hello@vielinks.com
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-5">
              <h6 className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#15140F]/45">
                {section}
              </h6>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('mailto:') ? (
                      <a
                        href={link.href}
                        className="text-[0.85rem] text-[#15140F]/55 transition-colors duration-300 hover:text-[#15140F]/90"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        onClick={() => navigate(link.href)}
                        className="text-[0.85rem] text-[#15140F]/55 transition-colors duration-300 hover:text-[#15140F]/90"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────── */}
      <div
        data-ft="bottom"
        style={{ opacity: 0 }}
        className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 border-t border-[#E7E0D0] px-6 py-6 md:flex-row md:px-12"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.14em] text-[#15140F]/55">
            All systems operational
          </span>
          <span className="text-[#15140F]/10">·</span>
          <span className="text-[0.65rem] uppercase tracking-[0.14em] text-[#15140F]/55">
            © {new Date().getFullYear()} Vielinks, Inc.
          </span>
        </div>

        <div className="flex gap-5">
          {bottomLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[0.65rem] uppercase tracking-[0.12em] text-[#15140F]/55 transition-colors duration-300 hover:text-[#15140F]/70"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
