import CursorFollower from './CursorFollower';
import LandingNav     from './LandingNav';
import ObsidianFooter from './ObsidianFooter';
import type { ReactNode } from 'react';

export default function ProductPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="landing-page bg-[#F8F5FF] text-[#18111F] overflow-x-hidden">
      <CursorFollower />
      <LandingNav />
      <main>{children}</main>
      <ObsidianFooter />
    </div>
  );
}
