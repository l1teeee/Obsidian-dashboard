import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface LegendItem {
  id: string;
  name: string;
}

interface ScrollLegendProps {
  items: LegendItem[];
  className?: string;
}

export function ScrollLegend({ items, className }: ScrollLegendProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const firstEl = document.getElementById(items[0]?.id ?? '');

      // Show legend when first tracked section is within 90% of viewport height from top
      if (firstEl) {
        setVisible(firstEl.getBoundingClientRect().top < window.innerHeight * 0.9);
      } else {
        setVisible(window.scrollY > 300);
      }

      // Active = last section whose top edge has passed 40% down the viewport
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          setActiveSection(items[i].id);
          return;
        }
      }
      setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div
      className={cn(
        'fixed left-5 top-1/2 -translate-y-1/2 z-40 transition-[opacity,transform] duration-300',
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none',
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="relative flex items-center gap-3 group"
              aria-label={`Go to ${item.name}`}
            >
              {/* Line indicator */}
              <div
                className={cn(
                  'h-px rounded-full transition-all duration-300',
                  isActive
                    ? 'w-6 bg-[#0F172A]'
                    : 'w-3.5 bg-[#CBD5E1] group-hover:w-5 group-hover:bg-[#94A3B8]',
                )}
              />

              {/* Label */}
              <span
                className={cn(
                  'text-[11px] font-medium whitespace-nowrap transition-all duration-200',
                  isActive ? 'text-[#0F172A]' : 'text-[#94A3B8]',
                  isHovered
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-1 pointer-events-none',
                )}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
