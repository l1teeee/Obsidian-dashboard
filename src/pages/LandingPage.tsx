import CursorFollower   from '../components/landing/CursorFollower';
import LandingNav       from '../components/landing/LandingNav';
import HeroGeometric    from '../components/landing/HeroGeometric';
import SocialProof      from '../components/landing/SocialProof';
import WorkflowTimeline from '../components/ui/workflow-timeline';
import PlatformSection  from '../components/landing/PlatformSection';
import AnalyticsSection from '../components/landing/AnalyticsSection';
import ShowcaseSection  from '../components/landing/ShowcaseSection';
import PricingSection   from '../components/landing/PricingSection';
import CTASection       from '../components/landing/CTASection';
import ObsidianFooter   from '../components/landing/ObsidianFooter';

export default function LandingPage() {
  return (
    <div className="landing-page bg-[#030303] text-white overflow-x-hidden">
      <CursorFollower />
      <LandingNav />
      <main>
        <HeroGeometric />
        <SocialProof />
        <WorkflowTimeline />
        <PlatformSection />
        <AnalyticsSection />
        <ShowcaseSection />
        <PricingSection />
        <CTASection />
      </main>
      <ObsidianFooter />
    </div>
  );
}
