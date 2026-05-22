import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSEO } from '../hooks/useSEO';
import SiteNav from '@/components/landing/SiteNav';
import ObsidianFooter from '@/components/landing/ObsidianFooter';

const LAST_REVIEWED = 'May 22, 2026';

type Pillar = { icon: string; title: string; desc: string };

const pillars: Pillar[] = [
  { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: 'Encrypted at rest', desc: 'All data stored on our servers is encrypted using AES-256.' },
  { icon: 'M8 11V7a4 4 0 018 0v4m-4 8v-2m-6 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z', title: 'Encrypted in transit', desc: 'All data in transit is protected by TLS 1.2+ with HSTS enforced.' },
  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Zero-knowledge tokens', desc: 'Social media OAuth tokens are encrypted individually; our staff cannot read them.' },
  { icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', title: 'Monitoring & alerting', desc: 'Automated systems monitor infrastructure health and trigger alerts on anomalies 24/7.' },
];

type Section = { id: string; title: string; body: React.ReactNode };

const sections: Section[] = [
  {
    id: 'overview',
    title: 'Security at Vielinks',
    body: (
      <>
        <p>Security is a core part of how we build and operate Vielinks — not an afterthought. Because you trust us with access to your social media accounts and brand content, we take a defense-in-depth approach: multiple independent security controls so that no single failure exposes your data.</p>
        <p className="mt-3">This page describes the security measures we have implemented to protect your data and the connected social accounts you manage through Vielinks. If you have questions or concerns not addressed here, contact us at <a href="mailto:security@vielinks.com" className="text-[#111827] underline underline-offset-2 hover:opacity-70">security@vielinks.com</a>.</p>
      </>
    ),
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure and Hosting',
    body: (
      <>
        <p>Vielinks runs on Amazon Web Services (AWS) infrastructure located in the United States. We use managed services designed for high availability, automatic failover, and geographic redundancy.</p>
        <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#64748B]">
          <li>Application servers run in private VPCs with no direct public exposure</li>
          <li>Databases are deployed in private subnets, inaccessible from the public internet</li>
          <li>All traffic is routed through a Web Application Firewall (WAF) that filters common attack patterns (SQLi, XSS, SSRF)</li>
          <li>DDoS protection is provided at the network layer via AWS Shield</li>
          <li>Automated daily backups with 30-day retention and point-in-time recovery enabled</li>
          <li>Multi-availability-zone deployments for database and critical services</li>
        </ul>
      </>
    ),
  },
  {
    id: 'encryption',
    title: 'Encryption',
    body: (
      <>
        <p className="font-medium text-[#0F172A]">Data in transit</p>
        <p className="mt-1">All communication between your browser and Vielinks servers is encrypted using TLS 1.2 or higher. We enforce HTTP Strict Transport Security (HSTS) with a minimum of 12 months preload, preventing downgrade attacks. Our TLS certificates are managed via AWS Certificate Manager with automatic renewal.</p>

        <p className="font-medium text-[#0F172A] mt-4">Data at rest</p>
        <p className="mt-1">All data stored in our databases and object storage is encrypted at rest using AES-256. Encryption keys are managed through AWS Key Management Service (KMS) with strict access policies and automatic annual rotation.</p>

        <p className="font-medium text-[#0F172A] mt-4">Social media OAuth tokens</p>
        <p className="mt-1">OAuth access tokens issued by Instagram, LinkedIn, and Facebook are encrypted at the application layer using AES-256 before being written to the database. This means even if an attacker gained raw database access, they could not read your tokens without the application-layer encryption keys, which are stored separately in KMS.</p>
      </>
    ),
  },
  {
    id: 'authentication',
    title: 'Authentication and Access Control',
    body: (
      <>
        <p className="font-medium text-[#0F172A]">User authentication</p>
        <ul className="mt-1 space-y-1.5 list-disc list-inside text-[#64748B]">
          <li>Passwords are hashed using bcrypt with a cost factor of 12 — never stored in plaintext</li>
          <li>Two-factor authentication (2FA) via TOTP is available and recommended for all accounts</li>
          <li>Session tokens are cryptographically random, stored as HTTP-only, Secure, SameSite=Strict cookies</li>
          <li>Sessions expire after 30 days of inactivity; users can revoke all active sessions from account settings</li>
          <li>Account lockout after 10 consecutive failed login attempts with exponential backoff</li>
        </ul>

        <p className="font-medium text-[#0F172A] mt-4">Internal access controls</p>
        <ul className="mt-1 space-y-1.5 list-disc list-inside text-[#64748B]">
          <li>Principle of least privilege: engineers have access only to systems they need for their role</li>
          <li>All infrastructure access requires MFA and is routed through a bastion host with full audit logging</li>
          <li>Production database access by staff requires a time-limited, peer-approved access request</li>
          <li>All internal access events are logged and reviewed weekly</li>
        </ul>
      </>
    ),
  },
  {
    id: 'social-tokens',
    title: 'Social Media Token Security',
    body: (
      <>
        <p>Because Vielinks publishes on your behalf, we hold OAuth tokens that grant access to your Instagram, LinkedIn, and Facebook accounts. We treat these with particular care:</p>
        <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#64748B]">
          <li>Tokens are encrypted at the application layer (AES-256) before database storage</li>
          <li>We request the minimum scopes necessary — only what is needed to schedule, publish, and read analytics</li>
          <li>No staff member can view a decrypted token through normal tooling; access requires an audited, emergency process</li>
          <li>Tokens are automatically refreshed before expiry; expired tokens are deleted immediately</li>
          <li>You can revoke a token from Vielinks at any time in account settings, or directly from the platform (Instagram, LinkedIn, Facebook) — revocation takes effect immediately</li>
          <li>If a token is unexpectedly revoked by the platform (e.g., due to a password change), you are notified immediately and no further publishing occurs</li>
        </ul>
      </>
    ),
  },
  {
    id: 'application',
    title: 'Application Security',
    body: (
      <>
        <p>Our development process includes security considerations at every stage:</p>
        <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#64748B]">
          <li>All code changes go through peer review before merging to production</li>
          <li>Automated dependency scanning via Dependabot flags vulnerable packages; critical CVEs are patched within 24 hours</li>
          <li>Static analysis (ESLint security plugins, TypeScript strict mode) runs on every pull request</li>
          <li>OWASP Top 10 mitigations are part of our baseline engineering standards: parameterized queries prevent SQLi, strict CSP headers prevent XSS, CSRF tokens protect all state-changing requests</li>
          <li>Rate limiting is applied to all authentication endpoints and public APIs</li>
          <li>Uploads are validated server-side for type, size, and content before processing</li>
        </ul>
      </>
    ),
  },
  {
    id: 'monitoring',
    title: 'Monitoring and Incident Response',
    body: (
      <>
        <p className="font-medium text-[#0F172A]">Monitoring</p>
        <p className="mt-1">We use centralized logging and real-time alerting to detect anomalies. Metrics monitored include authentication failure rates, unusual API call volumes, error rates, and database query patterns. Our on-call team receives alerts for any anomaly outside normal thresholds, 24 hours a day, 7 days a week.</p>

        <p className="font-medium text-[#0F172A] mt-4">Incident response</p>
        <p className="mt-1">We maintain a formal incident response plan. In the event of a confirmed security incident:</p>
        <ul className="mt-2 space-y-1.5 list-disc list-inside text-[#64748B]">
          <li>Affected systems are isolated immediately to contain the incident</li>
          <li>A root cause analysis is initiated within 24 hours</li>
          <li>Affected users are notified via email within 72 hours, as required by GDPR Article 33</li>
          <li>A post-incident report is published internally; material findings are shared with affected users</li>
        </ul>
      </>
    ),
  },
  {
    id: 'disclosure',
    title: 'Responsible Disclosure',
    body: (
      <>
        <p>We welcome security researchers who identify vulnerabilities in our systems. If you believe you have found a security issue, please report it responsibly:</p>
        <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#64748B]">
          <li>Email your findings to <a href="mailto:security@vielinks.com" className="text-[#111827] underline underline-offset-2 hover:opacity-70">security@vielinks.com</a></li>
          <li>Include a detailed description of the vulnerability, steps to reproduce, and potential impact</li>
          <li>Allow us reasonable time (90 days) to investigate and remediate before public disclosure</li>
          <li>Do not access, modify, or delete data belonging to other users during your research</li>
        </ul>
        <p className="mt-3">We will acknowledge your report within 48 hours, keep you informed of our progress, and credit you publicly (with your consent) upon resolution. We do not pursue legal action against researchers who act in good faith under these guidelines.</p>
      </>
    ),
  },
  {
    id: 'compliance',
    title: 'Compliance and Reviews',
    body: (
      <>
        <p>Vielinks is designed with GDPR compliance in mind. Our data handling practices are described in our <button onClick={() => window.location.href = '/privacy'} className="text-[#111827] underline underline-offset-2 hover:opacity-70">Privacy Policy</button>.</p>
        <p className="mt-3">We conduct internal security reviews on a quarterly basis, covering access controls, dependency vulnerabilities, and infrastructure configuration. Third-party penetration tests are commissioned annually.</p>
        <p className="mt-3">This security page is reviewed and updated at least every 6 months. Last reviewed: <strong className="text-[#0F172A]">{LAST_REVIEWED}</strong>.</p>
      </>
    ),
  },
];

export default function SecurityPage() {
  useSEO({
    title: 'Security - Vielinks',
    description: 'Learn how Vielinks protects your social media accounts, content, and data with encryption, access controls, and continuous monitoring.',
    keywords: 'security, data protection, encryption, OAuth security, Vielinks security',
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
          className="mb-12 text-center"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#111827]/18 bg-[#111827]/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#111827]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#111827]" />
            Security
          </span>
          <h1 className="mt-5 text-[clamp(36px,5vw,60px)] font-medium leading-[1.08] tracking-[-0.035em] text-[#0F172A]">
            Built to be <span className="text-[#111827]">trusted.</span>
          </h1>
          <p className="mt-5 text-[1rem] font-light leading-[1.8] text-[#0F172A]/55 max-w-lg mx-auto">
            You're giving us access to your brand. Here's exactly how we protect it.
          </p>
        </motion.div>

        {/* Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10"
        >
          {pillars.map((p) => (
            <div key={p.title} className="flex items-start gap-4 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#FFFFFF] px-6 py-5">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#111827]/18 bg-[#111827]/8 text-[#111827]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={p.icon} />
                </svg>
              </div>
              <div>
                <p className="text-[0.85rem] font-semibold text-[#0F172A]">{p.title}</p>
                <p className="mt-0.5 text-[0.8rem] leading-[1.6] text-[#64748B]">{p.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.04, ease: [0.25, 0.4, 0.25, 1] }}
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
          <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[#0F172A]">Found a security issue?</h3>
          <p className="mt-2 text-[0.9rem] text-[#64748B]">
            Report it to our security team. We'll acknowledge within 48 hours and keep you in the loop.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:security@vielinks.com"
              className="inline-flex items-center justify-center rounded-xl bg-[#111827] px-8 py-3 text-[14px] font-medium text-white transition-all duration-200 hover:bg-[#0B1220] active:scale-[0.98]"
            >
              Report vulnerability
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
