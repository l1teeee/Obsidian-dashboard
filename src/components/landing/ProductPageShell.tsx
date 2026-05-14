import CursorFollower from './CursorFollower';
import LandingNav     from './LandingNav';
import ObsidianFooter from './ObsidianFooter';
import type { ReactNode } from 'react';

export default function ProductPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="landing-page bg-[#F4F0E8] text-[#1C1814] overflow-x-hidden">
      <CursorFollower />
      <LandingNav />
      <main>{children}</main>
      <ObsidianFooter />
    </div>
  );
}
