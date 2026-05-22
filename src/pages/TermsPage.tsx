import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSEO } from '../hooks/useSEO';
import SiteNav from '@/components/landing/SiteNav';
import ObsidianFooter from '@/components/landing/ObsidianFooter';

const EFFECTIVE_DATE = 'May 22, 2026';

type Section = { id: string; title: string; body: React.ReactNode };

const sections: Section[] = [
  {
    id: 'agreement',
    title: '1. Agreement to Terms',
    body: (
      <>
        <p>By accessing or using Vielinks ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization to these Terms, and "you" refers to both you and that organization.</p>
        <p className="mt-3">If you do not agree to these Terms, do not access or use the Service. We may update these Terms from time to time; continued use after changes constitutes acceptance of the revised Terms.</p>
      </>
    ),
  },
  {
    id: 'service',
    title: '2. Description of Service',
    body: (
      <>
        <p>Vielinks is a social media management platform that allows individuals and teams to schedule, publish, analyze, and collaborate on content across Instagram, LinkedIn, and Facebook ("Connected Platforms"). Features include:</p>
        <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#64748B]">
          <li>Content scheduling and calendar management</li>
          <li>Cross-platform publishing via official OAuth APIs</li>
          <li>Analytics and engagement reporting</li>
          <li>Team collaboration and approval workflows</li>
          <li>AI-assisted caption drafting</li>
          <li>Link-in-bio page hosting</li>
        </ul>
        <p className="mt-3">The Service is provided "as is" subject to the limitations described in Section 11 ("Disclaimers").</p>
      </>
    ),
  },
  {
    id: 'accounts',
    title: '3. Accounts and Registration',
    body: (
      <>
        <p>To use the Service you must create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account.</p>
        <p className="mt-3">You must be at least 16 years of age to create an account. By registering, you represent and warrant that you meet this requirement.</p>
        <p className="mt-3">You agree to notify us immediately at <a href="mailto:hello@vielinks.com" className="text-[#111827] underline underline-offset-2 hover:opacity-70">hello@vielinks.com</a> of any unauthorized use of your account. We are not liable for losses arising from unauthorized access caused by your failure to safeguard your credentials.</p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: '4. Acceptable Use',
    body: (
      <>
        <p>You agree not to use the Service to:</p>
        <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#64748B]">
          <li>Violate any applicable law, regulation, or third-party right</li>
          <li>Publish spam, misleading content, or coordinated inauthentic behavior</li>
          <li>Infringe the intellectual property rights of any person or entity</li>
          <li>Distribute malware, phishing content, or other harmful material</li>
          <li>Attempt to reverse-engineer, decompile, or extract source code from the Service</li>
          <li>Use automated means (bots, scrapers) to access the Service beyond our public API</li>
          <li>Resell or sublicense access to the Service without written authorization</li>
          <li>Circumvent platform rate limits or violate the terms of any Connected Platform</li>
        </ul>
        <p className="mt-3">We reserve the right to suspend or terminate accounts that violate this policy without prior notice.</p>
      </>
    ),
  },
  {
    id: 'third-party',
    title: '5. Third-Party Platforms and APIs',
    body: (
      <>
        <p>The Service connects to Instagram (Meta), LinkedIn, and Facebook (Meta) via their official APIs ("Connected Platforms"). Your use of Connected Platforms is subject to their respective terms of service and privacy policies. We are not responsible for changes to, or unavailability of, any Connected Platform API.</p>
        <p className="mt-3">If a Connected Platform revokes API access or changes its policies in a way that affects our Service, we will endeavor to notify you promptly but cannot guarantee continued feature availability.</p>
        <p className="mt-3">You represent that you have the right to connect your social accounts to Vielinks and that doing so does not violate the terms of the Connected Platforms.</p>
      </>
    ),
  },
  {
    id: 'billing',
    title: '6. Payment and Billing',
    body: (
      <>
        <p>Paid plans are billed monthly or annually in advance. All prices are in USD unless stated otherwise. By providing payment information, you authorize us to charge your payment method on a recurring basis.</p>
        <p className="mt-3">Paid plans include a 14-day free trial. Your payment method will not be charged until the trial period ends. You may cancel at any time before the trial ends without charge.</p>
        <p className="mt-3">We use Stripe as our payment processor. Your payment details are transmitted directly to Stripe and are not stored on our servers. Stripe's terms of service and privacy policy govern the handling of your payment information.</p>
        <p className="mt-3">All fees are non-refundable except as required by applicable law or as expressly stated in our refund policy. Downgrades take effect at the end of the current billing period.</p>
      </>
    ),
  },
  {
    id: 'cancellation',
    title: '7. Cancellation and Termination',
    body: (
      <>
        <p>You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period; you will not be charged for the next cycle. Access to paid features continues until the period ends.</p>
        <p className="mt-3">We reserve the right to suspend or terminate your account at any time for violation of these Terms, at our reasonable discretion, with or without notice. Upon termination, your right to use the Service ceases immediately.</p>
        <p className="mt-3">Upon account closure, we will retain your data for 30 days to allow for reactivation, after which it will be permanently deleted in accordance with our Privacy Policy.</p>
      </>
    ),
  },
  {
    id: 'ip',
    title: '8. Intellectual Property',
    body: (
      <>
        <p>The Service, including its design, code, trademarks, and content produced by Vielinks, is owned by Vielinks and protected by applicable intellectual property law. Nothing in these Terms grants you any right in our intellectual property beyond the limited license to use the Service as described herein.</p>
        <p className="mt-3">You retain all rights to the content you create and upload through the Service ("Your Content"). By using the Service, you grant Vielinks a limited, non-exclusive license to store, process, and transmit Your Content solely as necessary to provide the Service to you.</p>
        <p className="mt-3">You represent that you own or have sufficient rights to Your Content and that it does not infringe any third-party intellectual property rights.</p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: '9. Privacy',
    body: (
      <p>Your privacy is important to us. Our collection and use of your personal data is governed by our <button onClick={() => window.location.href = '/privacy'} className="text-[#111827] underline underline-offset-2 hover:opacity-70">Privacy Policy</button>, which is incorporated into these Terms by reference. By using the Service, you consent to the data practices described in the Privacy Policy.</p>
    ),
  },
  {
    id: 'disclaimers',
    title: '10. Disclaimers',
    body: (
      <>
        <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>
        <p className="mt-3">We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components. We do not warrant the accuracy, completeness, or reliability of any analytics data or AI-generated suggestions provided by the Service.</p>
      </>
    ),
  },
  {
    id: 'liability',
    title: '11. Limitation of Liability',
    body: (
      <>
        <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, VIELINKS AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.</p>
        <p className="mt-3">IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO US IN THE TWELVE MONTHS PRECEDING THE CLAIM OR (B) USD $100.</p>
        <p className="mt-3">Some jurisdictions do not allow the exclusion or limitation of certain damages; in such jurisdictions, our liability shall be limited to the fullest extent permitted by law.</p>
      </>
    ),
  },
  {
    id: 'governing-law',
    title: '12. Governing Law and Disputes',
    body: (
      <>
        <p>These Terms are governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.</p>
        <p className="mt-3">Any dispute arising from or relating to these Terms or the Service shall first be submitted to informal negotiation. If not resolved within 30 days, disputes shall be resolved by binding arbitration under the rules of the American Arbitration Association, except that either party may seek injunctive relief in a court of competent jurisdiction.</p>
        <p className="mt-3">You waive any right to participate in a class-action lawsuit or class-wide arbitration to the fullest extent permitted by applicable law.</p>
      </>
    ),
  },
  {
    id: 'changes',
    title: '13. Changes to Terms',
    body: (
      <p>We may modify these Terms at any time. We will notify you of material changes via email or a prominent in-app notice at least 14 days before the changes take effect. If you continue to use the Service after the effective date, you accept the revised Terms. If you do not agree to the revised Terms, you must stop using the Service and cancel your account.</p>
    ),
  },
  {
    id: 'contact',
    title: '14. Contact',
    body: (
      <>
        <p>If you have any questions about these Terms, please contact us:</p>
        <div className="mt-3 space-y-1 text-[#64748B]">
          <p><span className="font-medium text-[#0F172A]">Email:</span> <a href="mailto:hello@vielinks.com" className="text-[#111827] underline underline-offset-2 hover:opacity-70">hello@vielinks.com</a></p>
          <p><span className="font-medium text-[#0F172A]">Product:</span> Vielinks</p>
        </div>
      </>
    ),
  },
];

export default function TermsPage() {
  useSEO({
    title: 'Terms of Service - Vielinks',
    description: 'Read the Vielinks Terms of Service. Understand your rights and responsibilities when using our social media management platform.',
    keywords: 'terms of service, terms and conditions, user agreement, Vielinks legal',
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
            Legal
          </span>
          <h1 className="mt-5 text-[clamp(36px,5vw,60px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#0F172A]">
            Terms of <span className="text-[#111827]">Service.</span>
          </h1>
          <p className="mt-5 text-[1rem] font-light leading-[1.8] text-[#0F172A]/55 max-w-lg mx-auto">
            Last updated: {EFFECTIVE_DATE}. Please read these terms carefully before using Vielinks.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 + i * 0.04, ease: [0.25, 0.4, 0.25, 1] }}
              className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#FFFFFF] px-8 py-7"
            >
              <h2 className="text-[1rem] font-semibold tracking-[-0.01em] text-[#0F172A] mb-3">{section.title}</h2>
              <div className="text-[0.9rem] leading-[1.75] text-[#64748B]">
                {section.body}
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
          <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[#0F172A]">Have a question about our terms?</h3>
          <p className="mt-2 text-[0.9rem] text-[#64748B]">
            We're happy to clarify anything. Reach out and we'll respond within a few hours on business days.
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
              className="inline-flex items-center justify-center rounded-xl border border-[#E2E8F0] bg-white px-8 py-3 text-[14px] font-medium text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all duration-200"
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
