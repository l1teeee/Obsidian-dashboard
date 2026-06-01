import { type ReactNode } from 'react';
import SiteNav from './SiteNav';
import ObsidianFooter from './ObsidianFooter';

interface PublicShellProps {
  children: ReactNode;
}

export default function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden">
      <SiteNav />
      {children}
      <ObsidianFooter />
    </div>
  );
}
