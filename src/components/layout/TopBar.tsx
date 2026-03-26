import { useLayout } from '../../contexts/LayoutContext';

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { toggle } = useLayout();

  return (
    <header className="h-[60px] sticky top-0 z-40 bg-[#131313]/80 backdrop-blur-xl border-b border-[#4c4450]/15 flex justify-between items-center px-4 md:px-8 shadow-[0_0_40px_rgba(211,148,255,0.08)]">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only (desktop uses the floating bubble) */}
        <button
          onClick={toggle}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#988d9c] hover:text-white hover:bg-[#201f1f] transition-all shrink-0"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
        </button>

        <h1 className="font-headline text-base md:text-lg font-extrabold tracking-tight text-white truncate">{title}</h1>
        {subtitle && (
          <>
            <span className="w-1 h-1 rounded-full bg-[#4c4450]/40 hidden sm:block" />
            <span className="text-[#988d9c] text-sm hidden sm:block">{subtitle}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="hidden sm:flex items-center gap-4">
          {actions}
        </div>
        <button className="w-9 h-9 flex items-center justify-center rounded-full text-[#988d9c] hover:text-white hover:bg-[#201f1f] transition-all">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d394ff] to-[#9400e4] p-[1px] shrink-0">
          <div className="w-full h-full rounded-full bg-[#1a1919] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#d394ff]" style={{ fontSize: 14 }}>person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
