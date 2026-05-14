import { useLayout } from '../../contexts/LayoutContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { isOpen, toggle } = useLayout();

  return (
    <header className="h-[60px] sticky top-0 z-40 bg-[#131313]/80 backdrop-blur-xl border-b border-[#1C1814]/15 flex justify-between items-center px-4 md:px-8 shadow-[0_0_40px_rgba(125,211,199,0.08)]">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only (desktop uses the floating bubble) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggle}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#6A6470] hover:text-[#1C1814] hover:bg-[#F0EBE2] active:scale-[0.92] transition-all shrink-0"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Toggle menu</TooltipContent>
        </Tooltip>

        <h1 className="font-headline text-base md:text-lg font-extrabold tracking-tight text-[#1C1814] truncate">{title}</h1>
        {subtitle && (
          <>
            <span className="w-1 h-1 rounded-full bg-[#1C1814]/40 hidden sm:block" />
            <span className="text-[#6A6470] text-sm hidden sm:block">{subtitle}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="hidden sm:flex items-center gap-4">
          {actions}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              aria-label="Notifications"
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#6A6470] hover:text-[#1C1814] hover:bg-[#F0EBE2] active:scale-[0.92] transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Notifications</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
