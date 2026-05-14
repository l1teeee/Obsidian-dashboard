import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNav from './LandingNav';
import ObsidianFooter from './ObsidianFooter';

interface ProductShellProps {
  children: ReactNode;
}

export function ProductCTA() {
  const navigate = useNavigate();
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#7DD3C7]/[0.07] blur-[120px]" />
      <div className="mx-auto max-w-3xl px-6 text-center relative">
        <p className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#7DD3C7]">Start today</p>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1C1814] mb-5">
          Ready to grow your<br />social presence?
        </h2>
        <p className="text-[#1C1814]/50 text-lg mb-10 max-w-xl mx-auto">
          Join thousands of creators and brands using Vielinks to publish smarter.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="rounded-full bg-[#1C1814] px-8 py-3.5 text-sm font-bold text-[#F4F0E8] shadow-[0_0_28px_rgba(125,211,199,0.28)] hover:shadow-[0_0_40px_rgba(125,211,199,0.28)] hover:bg-[#2A2520] transition-all active:scale-[0.98]"
          >
            Get started free
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="rounded-full border border-white/[0.12] bg-white/[0.04] px-8 py-3.5 text-sm font-semibold text-[#1C1814]/60 hover:border-[#7DD3C7]/30 hover:text-[#1C1814]/90 transition-all"
          >
            View pricing
          </button>
        </div>
      </div>
    </section>
  );
}

export default function ProductShell({ children }: ProductShellProps) {
  return (
    <div className="min-h-screen bg-[#F4F0E8] text-[#1C1814] overflow-x-hidden">
      <LandingNav />
      <main>{children}</main>
      <ProductCTA />
      <ObsidianFooter />
    </div>
  );
}
