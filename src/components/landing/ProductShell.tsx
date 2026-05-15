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
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#C8553A]/[0.07] blur-[120px]" />
      <div className="mx-auto max-w-3xl px-6 text-center relative">
        <p className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#C8553A]">Start today</p>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#15140F] mb-5">
          Ready to grow your<br />social presence?
        </h2>
        <p className="text-[#15140F]/50 text-lg mb-10 max-w-xl mx-auto">
          Join thousands of creators and brands using Vielinks to publish smarter.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="rounded-full bg-[#C8553A] px-8 py-3.5 text-sm font-bold text-white shadow-[0_16px_36px_rgba(200,85,58,0.24)] transition-all hover:bg-[#A53F28] hover:shadow-[0_18px_42px_rgba(200,85,58,0.28)] active:scale-[0.98]"
          >
            Get started free
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="rounded-full border border-white/[0.12] bg-white/[0.04] px-8 py-3.5 text-sm font-semibold text-[#15140F]/60 hover:border-[#C8553A]/30 hover:text-[#15140F]/90 transition-all"
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
    <div className="min-h-screen bg-[#F6F2EA] text-[#15140F] overflow-x-hidden">
      <LandingNav />
      <main>{children}</main>
      <ProductCTA />
      <ObsidianFooter />
    </div>
  );
}
