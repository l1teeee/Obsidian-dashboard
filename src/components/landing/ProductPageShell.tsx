import CursorFollower from './CursorFollower';
import LandingNav     from './LandingNav';
import ObsidianFooter from './ObsidianFooter';
import type { ReactNode } from 'react';

export default function ProductPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="landing-page bg-[#0B0B0A] text-white overflow-x-hidden">
      <CursorFollower />
      <LandingNav />
      <main>{children}</main>
      <ObsidianFooter />
    </div>
  );
}
