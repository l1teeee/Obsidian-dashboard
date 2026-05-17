import { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  Product: [
    { label: 'Planner', href: '/planner' },
    { label: 'Insights', href: '/insights' },
    { label: 'AI Studio', href: '/ai-studio' },
    { label: 'Connections', href: '/connections' },
  ],
  Company: [
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: 'mailto:hello@vielinks.com' },
  ],
  Legal: [
    { label: 'Terms', href: 'mailto:hello@vielinks.com?subject=Terms%20of%20service' },
    { label: 'Privacy', href: 'mailto:hello@vielinks.com?subject=Privacy%20policy' },
    { label: 'Security', href: 'mailto:hello@vielinks.com?subject=Security%20question' },
  ],
};

export default function ObsidianFooter() {
  const footerRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!footerRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('[data-ft="col"]', { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-ft="col"]',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 88%', once: true },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#15140F] pt-24 pb-12 text-[#F6F2EA]">
      <div className="mx-auto max-w-300 px-8">
        <div className="grid grid-cols-1 gap-16 border-b border-[rgba(251,248,242,0.12)] pb-16 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div data-ft="col">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mb-4 cursor-pointer text-left text-[28px] font-medium tracking-[-0.03em] text-[#F6F2EA] transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6F2EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15140F] focus-visible:rounded-sm"
            >
              Vielinks
            </button>
            <p className="max-w-[320px] text-[14px] leading-[1.6] text-[rgba(251,248,242,0.6)]">
              One workspace for your posts. Schedule, analyze, collaborate &mdash; across Instagram, LinkedIn, and Facebook.
            </p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} data-ft="col">
              <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.18em] text-[rgba(251,248,242,0.4)]">
                {section}
              </p>
              <ul className="flex list-none flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('mailto:') ? (
                      <a
                        href={link.href}
                        className="block cursor-pointer text-[14px] text-[rgba(251,248,242,0.7)] transition-all duration-200 hover:text-[#F6F2EA] motion-safe:hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6F2EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15140F] focus-visible:rounded-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate(link.href)}
                        className="block cursor-pointer text-left text-[14px] text-[rgba(251,248,242,0.7)] transition-all duration-200 hover:text-[#F6F2EA] motion-safe:hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6F2EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15140F] focus-visible:rounded-sm"
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

        <div className="flex flex-col items-center justify-between gap-2 pt-8 text-[12px] text-[rgba(251,248,242,0.4)] sm:flex-row">
          <span>&copy; 2026 Vielinks. Made for teams who post on purpose.</span>
          <span>v 2.0 &middot; Rebrand draft</span>
        </div>
      </div>
    </footer>
  );
}
