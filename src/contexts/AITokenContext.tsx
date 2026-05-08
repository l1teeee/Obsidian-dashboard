import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

interface TokenStatus {
  allowed: boolean;
  used:    number;
  limit:   number;
  plan:    string;
}

interface AITokenContextValue {
  allowed:  boolean;
  used:     number;
  limit:    number;
  plan:     string;
  refresh:  () => Promise<void>;
}

const AITokenContext = createContext<AITokenContextValue>({
  allowed: true,
  used:    0,
  limit:   0,
  plan:    'free',
  refresh: async () => {},
});

export function useAITokens(): AITokenContextValue {
  return useContext(AITokenContext);
}

export function AITokenProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<TokenStatus>({ allowed: true, used: 0, limit: 0, plan: 'free' });

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiFetch<TokenStatus>('/users/me/tokens');
      setStatus(res.data);
    } catch {
      // silently fail — keep previous state
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = () => setStatus(prev => ({ ...prev, allowed: false }));
    window.addEventListener('ai:token-limit-exceeded', handler);
    return () => window.removeEventListener('ai:token-limit-exceeded', handler);
  }, []);

  return (
    <AITokenContext.Provider value={{ ...status, refresh }}>
      {children}
    </AITokenContext.Provider>
  );
}
