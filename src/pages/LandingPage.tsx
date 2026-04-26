import { useSEO } from '../hooks/useSEO';
import CursorFollower         from '../components/landing/CursorFollower';
import LandingNav             from '../components/landing/LandingNav';
import HeroGeometric          from '../components/landing/HeroGeometric';
import SocialProof            from '../components/landing/SocialProof';
import BenefitsSection        from '../components/landing/BenefitsSection';
import WorkflowTimeline       from '../components/ui/workflow-timeline';
import DifferentiatorsSection from '../components/landing/DifferentiatorsSection';
import TestimonialsSection    from '../components/landing/TestimonialsSection';
import PlatformSection        from '../components/landing/PlatformSection';
import AnalyticsSection       from '../components/landing/AnalyticsSection';
import ShowcaseSection        from '../components/landing/ShowcaseSection';
import PricingSection         from '../components/landing/PricingSection';
import FAQSection             from '../components/landing/FAQSection';
import CTASection             from '../components/landing/CTASection';
import ObsidianFooter         from '../components/landing/ObsidianFooter';

export default function LandingPage() {
  useSEO({
    title: 'Vielinks - Social Media Management Dashboard for Every Platform',
    description: 'Manage Instagram, LinkedIn, and Facebook from one dashboard. Schedule posts, track analytics, and grow your audience with AI-powered insights.',
    keywords: 'social media management, post scheduler, social analytics, content calendar, Instagram, LinkedIn, Facebook',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Vielinks',
      applicationCategory: 'Social Networking Application',
      operatingSystem: 'Web',
      description: 'Social media management dashboard for managing multiple platforms from one place.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  });

  return (
    <div className="landing-page bg-[#0a0a0a] text-white overflow-x-hidden">
      <CursorFollower />
      <LandingNav />
      <main>
        <HeroGeometric />
        <SocialProof />
        <BenefitsSection />
        <WorkflowTimeline />
        <DifferentiatorsSection />
        <TestimonialsSection />
        <PlatformSection />
        <AnalyticsSection />
        <ShowcaseSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <ObsidianFooter />
    </div>
  );
}
