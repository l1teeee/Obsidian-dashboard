import { createContext, useContext, useState, type ReactNode } from 'react';

interface LayoutCtx {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const LayoutContext = createContext<LayoutCtx>({
  isOpen: true,
  toggle: () => {},
  close: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export function LayoutProvider({ children }: { children: ReactNode }) {
  // Start open on desktop, closed on mobile
  const [isOpen, setIsOpen] = useState(() => window.innerWidth >= 1024);

  return (
    <LayoutContext.Provider value={{
      isOpen,
      toggle: () => setIsOpen(p => !p),
      close:  () => setIsOpen(false),
    }}>
      {children}
    </LayoutContext.Provider>
  );
}
