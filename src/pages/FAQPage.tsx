import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { motion } from 'framer-motion';
import SiteNav from '@/components/landing/SiteNav';
import ObsidianFooter from '@/components/landing/ObsidianFooter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type FAQItem = { id: string; q: string; a: string };
type FAQGroup = { category: string; icon: string; items: FAQItem[] };

const groups: FAQGroup[] = [
  {
    category: 'Getting started',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    items: [
      {
        id: 'gs-1',
        q: 'Do I need a credit card to start?',
        a: 'No. The Free plan is completely free forever with no card required. Paid plans include a 14-day free trial — you only enter billing details when you decide to upgrade.',
      },
      {
        id: 'gs-2',
        q: 'How long does the initial setup take?',
        a: 'Most teams are fully set up within 15 minutes. Connecting your social accounts takes under 2 minutes per platform via OAuth. You can schedule your first post before finishing the onboarding flow.',
      },
      {
        id: 'gs-3',
        q: 'Can I try the paid features before committing?',
        a: 'Yes. Every paid plan starts with a 14-day free trial that includes all features of that tier. No card required. At the end of the trial you choose to subscribe or automatically drop to the Free plan.',
      },
    ],
  },
  {
    category: 'Platforms & connections',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
    items: [
      {
        id: 'pl-1',
        q: 'Which social platforms does Vielinks support?',
        a: 'Vielinks currently connects to Instagram, LinkedIn, and Facebook via their official OAuth APIs. We are actively working on adding X (Twitter), TikTok, and Pinterest. You can vote on upcoming integrations from your workspace settings.',
      },
      {
        id: 'pl-2',
        q: 'How many accounts can I connect?',
        a: 'It depends on your plan. Free supports 1 account, Starter supports 3, Pro supports 10, and Agency supports unlimited accounts across all connected platforms.',
      },
      {
        id: 'pl-3',
        q: 'What happens if a platform disconnects or my token expires?',
        a: 'Vielinks monitors the health of all connected accounts in real time. If a connection drops, you will receive an email and in-app notification immediately. Posts scheduled during that window are queued and published as soon as the account is reconnected — no posts are lost.',
      },
    ],
  },
  {
    category: 'Publishing & scheduling',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    items: [
      {
        id: 'pub-1',
        q: 'How does the best-time posting engine work?',
        a: 'Vielinks analyzes your own historical engagement data per platform and per audience timezone — not generic industry benchmarks. As your account grows and you publish more content, the recommendations improve. The engine surfaces the specific time windows where your audience is most active.',
      },
      {
        id: 'pub-2',
        q: 'Can I schedule content weeks or months in advance?',
        a: 'Yes. There is no limit on how far in advance you can schedule posts. You can plan an entire quarter of content in a single session using the drag-and-drop content calendar.',
      },
      {
        id: 'pub-3',
        q: 'What happens if a post fails to publish?',
        a: 'Vielinks has automatic retry logic built in. If a post fails on the first attempt, the system retries up to 3 times within a short window. If it still fails, you receive an immediate notification with the exact error reason so you can take action — your draft is never deleted.',
      },
    ],
  },
  {
    category: 'Analytics & reporting',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    items: [
      {
        id: 'an-1',
        q: 'What metrics does Vielinks track?',
        a: 'Vielinks tracks reach, impressions, engagement rate, follower growth, link clicks, saves, and shares across all connected platforms. All metrics are aggregated in a unified cross-platform view and broken down per post and per platform.',
      },
      {
        id: 'an-2',
        q: 'Can I export analytics reports?',
        a: 'Pro plans can export CSV data. Agency plans additionally include white-label PDF reports that you can co-brand and send directly to clients — no extra formatting required.',
      },
    ],
  },
  {
    category: 'Plans, billing & teams',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    items: [
      {
        id: 'bi-1',
        q: 'Can I upgrade, downgrade, or cancel at any time?',
        a: 'Yes, anytime. Upgrades take effect immediately with prorated billing. Downgrades and cancellations take effect at the end of the current billing period so you always get the full value of what you paid for.',
      },
      {
        id: 'bi-2',
        q: 'Does Vielinks offer refunds?',
        a: 'Yes. If you cancel within 7 days of a charge we will issue a full refund, no questions asked. Beyond that window refunds are evaluated case by case — contact support and we will make it right.',
      },
      {
        id: 'bi-3',
        q: 'Can I manage multiple brands or clients from one account?',
        a: 'Yes. Pro plans include up to 5 team seats and multi-workspace support — each workspace has its own accounts, calendar, and analytics. Agency plans include unlimited workspaces and team members, with role-based access controls and content approval workflows.',
      },
    ],
  },
  {
    category: 'Security & privacy',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    items: [
      {
        id: 'sec-1',
        q: 'Is my data secure?',
        a: 'All platform connections use official OAuth — we never see or store your passwords. Data is encrypted in transit (TLS 1.3) and at rest (AES-256). We do not sell, share, or use your content or analytics data for advertising. You can delete your account and all associated data at any time from settings.',
      },
    ],
  },
];

export default function FAQPage() {
  useSEO({
    title: 'Vielinks FAQ - Frequently Asked Questions',
    description: 'Find answers to common questions about Vielinks social media management: setup, platforms, scheduling, analytics, billing, and security.',
    keywords: 'vielinks FAQ, social media management FAQ, post scheduler help, social analytics questions',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: groups.map(g => g.items.map(i => ({
        '@type': 'Question',
        name: i.q,
        acceptedAnswer: { '@type': 'Answer', text: i.a },
      }))).flat(),
    },
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden">
      <SiteNav />

      <main className="mx-auto max-w-[900px] px-6 md:px-12 pt-36 pb-28">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="mb-16 text-center"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#111827]/18 bg-[#111827]/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#111827]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#111827]" />
            Help center
          </span>
          <h1 className="mt-5 text-[clamp(36px,5vw,60px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#0F172A]">
            Frequently asked <span className="text-[#111827]">questions.</span>
          </h1>
          <p className="mt-5 text-[1rem] font-light leading-[1.8] text-[#0F172A]/55 max-w-lg mx-auto">
            Everything you need to know about Vielinks. Can't find your answer?{' '}
            <a href="mailto:hello@vielinks.com" className="text-[#111827]/70 underline underline-offset-2 hover:text-[#111827] transition-colors">
              Contact us
            </a>
            .
          </p>
        </motion.div>

        {/* Category groups */}
        <div className="space-y-8">
          {groups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 + gi * 0.07, ease: [0.25, 0.4, 0.25, 1] }}
              className="rounded-2xl border border-border bg-[#FFFFFF] overflow-hidden"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 border-b border-border px-8 py-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#111827]/18 bg-[#111827]/10 text-[#111827]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={group.icon} />
                  </svg>
                </div>
                <h2 className="text-[0.8rem] font-bold uppercase tracking-[0.18em] text-[#0F172A]/50">
                  {group.category}
                </h2>
                <span className="ml-auto rounded-full border border-border bg-[#F1F5F9] px-2.5 py-0.5 text-[0.6rem] font-semibold text-[#64748B]">
                  {group.items.length}
                </span>
              </div>

              {/* Questions */}
              <div className="px-8">
                <Accordion type="single" collapsible>
                  {group.items.map((item, ii) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className={ii === group.items.length - 1 ? 'border-b-0' : ''}
                    >
                      <AccordionTrigger className="text-[0.95rem] font-semibold">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-[0.9rem]">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="mt-14 text-center rounded-2xl border border-[#E2E8F0] bg-[#F4E0D6] px-10 py-10"
        >
          <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[#0F172A]">Still have a question?</h3>
          <p className="mt-2 text-[0.9rem] text-[#64748B]">
            Our team responds within a few hours on business days.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:hello@vielinks.com"
              className="inline-flex items-center justify-center rounded-xl bg-[#111827] px-8 py-3 text-[14px] font-medium text-white transition-all duration-200 hover:bg-[#0B1220] active:scale-[0.98]"
            >
              Email us
            </a>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center rounded-xl border border-[#CBD5E1] px-8 py-3 text-[14px] font-medium text-[#334155] hover:bg-[#F1F5F9] transition-all duration-200"
            >
              Back to home
            </button>
          </div>
        </motion.div>

      </main>

      <ObsidianFooter />
    </div>
  );
}
