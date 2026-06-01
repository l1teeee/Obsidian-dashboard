import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSEO } from '../hooks/useSEO';
import PublicShell from '@/components/landing/PublicShell';

const EFFECTIVE_DATE = 'May 22, 2026';

type Section = { id: string; title: string; body: React.ReactNode };

const sections: Section[] = [
  {
    id: 'introduction',
    title: '1. Introduction',
    body: (
      <>
        <p>Vielinks ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and share information when you use the Vielinks platform ("Service").</p>
        <p className="mt-3">This policy applies to all users of the Service, including visitors to our website. If you are located in the European Economic Area (EEA), the United Kingdom, or Switzerland, this policy also constitutes our GDPR disclosure.</p>
        <p className="mt-3">If you have any questions, contact our privacy team at <a href="mailto:privacy@vielinks.com" className="text-[#111827] underline underline-offset-2 hover:opacity-70">privacy@vielinks.com</a>.</p>
      </>
    ),
  },
  {
    id: 'data-collected',
    title: '2. Data We Collect',
    body: (
      <>
        <p className="font-medium text-[#0F172A]">2.1 Account Information</p>
        <p className="mt-1">When you register, we collect your name, email address, and hashed password. If you register via Google OAuth, we receive your name, email, and profile picture from Google.</p>

        <p className="font-medium text-[#0F172A] mt-4">2.2 Social Media Credentials and Tokens</p>
        <p className="mt-1">To publish on your behalf, we store OAuth access tokens issued by Instagram (Meta), LinkedIn, and Facebook (Meta). These tokens allow Vielinks to post, read basic account metadata, and retrieve analytics. We never store your social media passwords. Tokens are encrypted at rest using AES-256 and can be revoked at any time from your account settings or directly from the Connected Platform.</p>

        <p className="font-medium text-[#0F172A] mt-4">2.3 Content and Posts</p>
        <p className="mt-1">We store the posts, captions, images, videos, and schedules you create within the Service. This includes draft content, published content, and any media you upload. Content is retained for the lifetime of your account and deleted within 30 days of account closure.</p>

        <p className="font-medium text-[#0F172A] mt-4">2.4 Analytics Data</p>
        <p className="mt-1">We retrieve performance metrics (reach, impressions, engagement, follower counts) from Connected Platforms via their official APIs and store this data to power your analytics dashboard. This data is tied to your account and the connected social accounts.</p>

        <p className="font-medium text-[#0F172A] mt-4">2.5 Usage and Technical Data</p>
        <p className="mt-1">We automatically collect information about how you use the Service, including IP address, browser type, device type, operating system, pages visited, features used, and time and duration of visits. This data is used for product improvement, security monitoring, and aggregate analytics.</p>

        <p className="font-medium text-[#0F172A] mt-4">2.6 Billing Information</p>
        <p className="mt-1">Payment processing is handled by Stripe. We do not store full card numbers. We receive and store the last four digits, card brand, expiry date, and billing address for record-keeping purposes.</p>

        <p className="font-medium text-[#0F172A] mt-4">2.7 Communications</p>
        <p className="mt-1">When you contact support or send us an email, we store the content of your communication to respond and improve our support processes.</p>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Your Data',
    body: (
      <>
        <p>We use the data we collect to:</p>
        <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#64748B]">
          <li>Provide, operate, and maintain the Service</li>
          <li>Authenticate your identity and manage your account</li>
          <li>Publish content to Connected Platforms on your behalf</li>
          <li>Retrieve and display analytics from Connected Platforms</li>
          <li>Process payments and manage your subscription</li>
          <li>Send transactional emails (post confirmations, billing receipts, security alerts)</li>
          <li>Improve the Service through aggregate usage analysis</li>
          <li>Generate AI-assisted caption suggestions using your past content patterns</li>
          <li>Detect, prevent, and respond to fraud, abuse, and security incidents</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p className="mt-3">We do not sell your personal data to third parties. We do not use your content to train general-purpose AI models or share it with third parties for advertising purposes.</p>
      </>
    ),
  },
  {
    id: 'legal-basis',
    title: '4. Legal Basis for Processing (GDPR)',
    body: (
      <>
        <p>If you are in the EEA, UK, or Switzerland, we process your personal data under the following legal bases:</p>
        <div className="mt-3 space-y-3">
          <div className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFC] px-5 py-4">
            <p className="font-medium text-[#0F172A] text-[0.85rem]">Contract performance</p>
            <p className="mt-1 text-[#64748B]">Processing your account data, tokens, and content is necessary to perform our contract with you and provide the Service.</p>
          </div>
          <div className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFC] px-5 py-4">
            <p className="font-medium text-[#0F172A] text-[0.85rem]">Legitimate interests</p>
            <p className="mt-1 text-[#64748B]">Usage data, security monitoring, and product improvement are processed under our legitimate interest to operate and improve a secure, reliable product.</p>
          </div>
          <div className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFC] px-5 py-4">
            <p className="font-medium text-[#0F172A] text-[0.85rem]">Legal obligation</p>
            <p className="mt-1 text-[#64748B]">Billing records and certain security logs are retained to comply with applicable legal and tax obligations.</p>
          </div>
          <div className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFC] px-5 py-4">
            <p className="font-medium text-[#0F172A] text-[0.85rem]">Consent</p>
            <p className="mt-1 text-[#64748B]">Marketing communications are sent only with your explicit consent. You may withdraw consent at any time by clicking "Unsubscribe" in any marketing email.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'data-sharing',
    title: '5. Data Sharing and Disclosure',
    body: (
      <>
        <p>We share your data only in the following circumstances:</p>
        <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#64748B]">
          <li><span className="font-medium text-[#0F172A]">Service providers:</span> We share data with trusted vendors (Stripe for payments, AWS for infrastructure, Resend for transactional email) under data processing agreements that require them to protect your data.</li>
          <li><span className="font-medium text-[#0F172A]">Connected Platforms:</span> Your content is transmitted to Instagram, LinkedIn, and Facebook when you schedule or publish posts. This transmission is governed by their respective privacy policies.</li>
          <li><span className="font-medium text-[#0F172A]">Your team members:</span> Within a shared workspace, your posts, analytics, and profile information are visible to other members of your workspace as defined by your role and permissions.</li>
          <li><span className="font-medium text-[#0F172A]">Legal requirements:</span> We may disclose data when required by law, court order, or to protect the rights, property, or safety of Vielinks, our users, or the public.</li>
          <li><span className="font-medium text-[#0F172A]">Business transfers:</span> In the event of a merger, acquisition, or asset sale, your data may be transferred as part of that transaction. We will provide notice before your data is transferred and becomes subject to a different privacy policy.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'retention',
    title: '6. Data Retention',
    body: (
      <>
        <p>We retain your personal data for as long as your account is active or as necessary to provide the Service. Specific retention periods:</p>
        <div className="mt-3 overflow-hidden rounded-xl border border-[rgba(15,23,42,0.08)]">
          {[
            { type: 'Account and profile data', period: 'Lifetime of account + 30 days' },
            { type: 'Social media tokens', period: 'Until revoked or account closed' },
            { type: 'Posts and content', period: 'Lifetime of account + 30 days' },
            { type: 'Analytics data', period: 'Lifetime of account + 30 days' },
            { type: 'Billing records', period: '7 years (legal obligation)' },
            { type: 'Usage logs', period: '12 months rolling' },
            { type: 'Security logs', period: '24 months rolling' },
          ].map((row, i, arr) => (
            <div key={row.type} className={`flex items-center gap-4 px-5 py-3 text-[0.85rem] ${i < arr.length - 1 ? 'border-b border-[rgba(15,23,42,0.06)]' : ''} ${i % 2 === 0 ? 'bg-[#F8FAFC]' : 'bg-white'}`}>
              <span className="flex-1 text-[#0F172A] font-medium">{row.type}</span>
              <span className="text-[#64748B] shrink-0">{row.period}</span>
            </div>
          ))}
        </div>
        <p className="mt-3">After account closure, all personal data is permanently deleted within 30 days, except where retention is required by law.</p>
      </>
    ),
  },
  {
    id: 'security',
    title: '7. Security',
    body: (
      <p>We implement technical and organizational measures to protect your personal data, including TLS encryption in transit, AES-256 encryption at rest for sensitive data (tokens, credentials), access controls, and regular security reviews. For a detailed description of our security practices, see our <button onClick={() => window.location.href = '/security'} className="text-[#111827] underline underline-offset-2 hover:opacity-70">Security page</button>. No system is completely secure; we cannot guarantee absolute security of your data.</p>
    ),
  },
  {
    id: 'rights',
    title: '8. Your Rights (GDPR and Other Applicable Law)',
    body: (
      <>
        <p>Depending on your location, you may have the following rights regarding your personal data:</p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-[#64748B]">
          <li><span className="font-medium text-[#0F172A]">Access:</span> Request a copy of the personal data we hold about you.</li>
          <li><span className="font-medium text-[#0F172A]">Correction:</span> Request correction of inaccurate or incomplete data.</li>
          <li><span className="font-medium text-[#0F172A]">Deletion:</span> Request deletion of your personal data ("right to be forgotten"), subject to legal retention obligations.</li>
          <li><span className="font-medium text-[#0F172A]">Restriction:</span> Request that we restrict processing of your data in certain circumstances.</li>
          <li><span className="font-medium text-[#0F172A]">Portability:</span> Receive your data in a structured, machine-readable format.</li>
          <li><span className="font-medium text-[#0F172A]">Objection:</span> Object to processing based on legitimate interests.</li>
          <li><span className="font-medium text-[#0F172A]">Withdraw consent:</span> Where processing is based on consent, withdraw it at any time without affecting prior lawful processing.</li>
        </ul>
        <p className="mt-3">To exercise any of these rights, email <a href="mailto:privacy@vielinks.com" className="text-[#111827] underline underline-offset-2 hover:opacity-70">privacy@vielinks.com</a>. We will respond within 30 days. If you are in the EEA, you also have the right to lodge a complaint with your local data protection authority.</p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '9. Cookies and Tracking',
    body: (
      <>
        <p>We use cookies and similar technologies to:</p>
        <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#64748B]">
          <li><span className="font-medium text-[#0F172A]">Essential cookies:</span> Maintain your authenticated session and remember preferences. These cannot be disabled without breaking the Service.</li>
          <li><span className="font-medium text-[#0F172A]">Analytics cookies:</span> Understand how users interact with the Service to improve the product (aggregate, anonymized).</li>
        </ul>
        <p className="mt-3">We do not use third-party advertising cookies or sell data to ad networks. You can control cookies through your browser settings, but disabling essential cookies will prevent you from logging in.</p>
      </>
    ),
  },
  {
    id: 'international',
    title: '10. International Data Transfers',
    body: (
      <p>Vielinks is operated from the United States. If you are located outside the US, your data will be transferred to and processed in the US. For EEA/UK users, we rely on Standard Contractual Clauses (SCCs) approved by the European Commission to legitimize these transfers. A copy of our SCCs is available upon request at <a href="mailto:privacy@vielinks.com" className="text-[#111827] underline underline-offset-2 hover:opacity-70">privacy@vielinks.com</a>.</p>
    ),
  },
  {
    id: 'children',
    title: '11. Children\'s Privacy',
    body: (
      <p>The Service is not directed at children under 16 years of age. We do not knowingly collect personal data from children under 16. If we become aware that we have collected data from a child under 16 without parental consent, we will delete it promptly. If you believe we have inadvertently collected such data, contact us at <a href="mailto:privacy@vielinks.com" className="text-[#111827] underline underline-offset-2 hover:opacity-70">privacy@vielinks.com</a>.</p>
    ),
  },
  {
    id: 'changes',
    title: '12. Changes to This Policy',
    body: (
      <p>We may update this Privacy Policy from time to time. We will notify you of material changes via email or an in-app notice at least 14 days before the changes take effect. The "Last updated" date at the top of this page reflects the most recent revision. Continued use of the Service after changes take effect constitutes acceptance of the revised policy.</p>
    ),
  },
  {
    id: 'contact',
    title: '13. Contact and Data Controller',
    body: (
      <>
        <p>The data controller for personal data processed through the Service is Vielinks. For privacy questions, data requests, or complaints:</p>
        <div className="mt-3 space-y-1 text-[#64748B]">
          <p><span className="font-medium text-[#0F172A]">Privacy inquiries:</span> <a href="mailto:privacy@vielinks.com" className="text-[#111827] underline underline-offset-2 hover:opacity-70">privacy@vielinks.com</a></p>
          <p><span className="font-medium text-[#0F172A]">General contact:</span> <a href="mailto:hello@vielinks.com" className="text-[#111827] underline underline-offset-2 hover:opacity-70">hello@vielinks.com</a></p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPage() {
  useSEO({
    title: 'Privacy Policy - Vielinks',
    description: 'Vielinks Privacy Policy. Learn how we collect, use, and protect your personal data including social media credentials, posts, and analytics.',
    keywords: 'privacy policy, GDPR, data protection, Vielinks privacy, personal data',
  });

  const navigate = useNavigate();

  return (
    <PublicShell>
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
            Privacy <span className="text-[#111827]">Policy.</span>
          </h1>
          <p className="mt-5 text-[1rem] font-light leading-[1.8] text-[#0F172A]/55 max-w-lg mx-auto">
            Last updated: {EFFECTIVE_DATE}. We keep this plain-language — no legal jargon without explanation.
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
          <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[#0F172A]">Questions about your data?</h3>
          <p className="mt-2 text-[0.9rem] text-[#64748B]">
            Our privacy team responds to all requests within 30 days as required by GDPR.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:privacy@vielinks.com"
              className="inline-flex items-center justify-center rounded-xl bg-[#111827] px-8 py-3 text-[14px] font-medium text-white transition-all duration-200 hover:bg-[#0B1220] active:scale-[0.98]"
            >
              Contact privacy team
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
    </PublicShell>
  );
}
