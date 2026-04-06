
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  Platform: ['Automation', 'Analytics', 'Integrations'],
  Company: ['Journal', 'Careers', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Security'],
};

export default function ObsidianFooter() {
  const footerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo('[data-ft="brand"]',
        { opacity: 0, y: 16, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5 }
      )
      .fromTo('[data-ft="col"]',
        { opacity: 0, y: 14, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.07 },
        '-=0.25'
      )
      .fromTo('[data-ft="bottom"]',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.2'
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative border-t border-[#494847]/10 bg-[#030303]">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d394ff]/15 to-transparent" />

      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-12">
        <div className="flex flex-col items-start justify-between gap-14 md:flex-row">
          {/* Brand */}
          <div data-ft="brand" style={{ opacity: 0 }} className="max-w-xs space-y-5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#d394ff] opacity-40 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d394ff]" />
              </span>
              <span className="text-lg font-bold tracking-tight text-[#e5e2e1]">Vielinks</span>
            </div>
            <p className="text-sm leading-relaxed text-[#adaaaa]/50">
              Defining the standard for creative CRM software. Building the bridge between data and artistry.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 md:grid-cols-3 md:gap-20">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section} data-ft="col" style={{ opacity: 0 }} className="space-y-5">
                <h6 className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/30">
                  {section}
                </h6>
                <ul className="space-y-3.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-[#adaaaa]/40 transition-colors duration-300 hover:text-[#d394ff]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        data-ft="bottom"
        style={{ opacity: 0 }}
        className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 border-t border-white/[0.04] px-6 py-7 md:flex-row md:px-12"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.14em] text-white/20">
          © {new Date().getFullYear()} Vielinks. All rights reserved.
        </span>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'API Status'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[0.65rem] uppercase tracking-[0.14em] text-white/20 transition-colors duration-300 hover:text-[#d394ff]"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
