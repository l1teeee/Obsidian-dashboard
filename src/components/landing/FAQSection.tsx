
import { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    id: '1',
    q: 'Do I need a credit card to start?',
    a: 'No. The Free plan is completely free forever with no card required. Paid plans include a 14-day free trial — you only enter billing details when you decide to upgrade.',
  },
  {
    id: '2',
    q: 'Which social platforms does Vielinks connect to?',
    a: 'Vielinks currently connects to Instagram, LinkedIn, and Facebook via official OAuth. Each connected profile or page counts as one account. More platforms are on the roadmap.',
  },
  {
    id: '3',
    q: 'Can I manage multiple brands from one account?',
    a: 'Yes. The Pro plan supports up to 5 team seats and multiple workspaces. The Agency plan offers unlimited workspaces and team members, ideal for managing several brands or clients.',
  },
  {
    id: '4',
    q: 'Can I cancel or change my plan at any time?',
    a: 'Yes, anytime. You can upgrade, downgrade, or cancel from your workspace settings. Billing is prorated on upgrades. Cancellations take effect at the end of the current billing period.',
  },
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set('[data-faq="eyebrow"],[data-faq="title"],[data-faq="sub"],[data-faq="list"],[data-faq="cta"]', { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 74%',
          toggleActions: 'play none none none',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo('[data-faq="eyebrow"]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo('[data-faq="title"]',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.15')
        .fromTo('[data-faq="sub"]',     { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 },  '-=0.3')
        .fromTo('[data-faq="list"]',    { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 },  '-=0.25')
        .fromTo('[data-faq="cta"]',     { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, '-=0.2');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="FAQ" className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.015] blur-[120px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="mx-auto max-w-[780px]">

          {/* Header */}
          <div className="mb-12 text-center">
            <span data-faq="eyebrow" style={{ opacity: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-[#1C1814]/[0.05] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#1C1814]/45">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7DD3C7]" />
              FAQ
            </span>
            <h2 data-faq="title" style={{ opacity: 0 }} className="mt-5 text-4xl font-extrabold tracking-[-0.04em] leading-[0.96] text-[#1C1814] md:text-5xl">
              Quick answers.
            </h2>
            <p data-faq="sub" style={{ opacity: 0 }} className="mt-4 text-[1rem] font-light leading-[1.8] text-[#1C1814]/50">
              The questions we get asked most before signing up.
            </p>
          </div>

          {/* Accordion — 4 questions */}
          <div data-faq="list" style={{ opacity: 0 }} className="rounded-[1.75rem] border border-white/[0.07] bg-[#F3EEE6]/80 px-8 backdrop-blur-xl">
            <Accordion type="single" collapsible defaultValue="1">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className={i === faqs.length - 1 ? 'border-b-0' : ''}
                >
                  <AccordionTrigger className="text-[0.95rem] font-semibold">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[0.9rem]">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Link to full FAQ page */}
          <div data-faq="cta" style={{ opacity: 0 }} className="mt-8 text-center">
            <button
              onClick={() => navigate('/faq')}
              className="group inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[#1C1814]/35 transition-all duration-300 hover:text-[#1C1814]/70"
            >
              See all 15 questions
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
