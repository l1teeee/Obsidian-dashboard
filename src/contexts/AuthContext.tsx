/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { setAccessToken, refreshTokens } from '../lib/api';
import * as authService from '../services/auth.service';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id:    string;
  email: string;
}

interface AuthCtx {
  user:            AuthUser | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  login:    (email: string, password: string, rememberMe?: boolean) => Promise<{ isFirstLogin: boolean }>;
  register: (email: string, password: string, name: string) => Promise<{ isFirstLogin: boolean }>;
  logout:   () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthCtx | null>(null);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function decodeUser(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { id: string; email: string };
    return { id: payload.id, email: payload.email };
  } catch {
    return null;
  }
}

function applyTokenPair(tokens: authService.TokenPair): void {
  setAccessToken(tokens.accessToken);
  // refreshToken is in an httpOnly cookie set by the server — nothing to store here
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const bootstrapped = useRef(false);

  // Silent refresh on mount — runs once
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    void refreshTokens().then((newToken) => {
      if (newToken) setUser(decodeUser(newToken));
      setIsLoading(false);
    });
  }, []);

  // Handle session expiry triggered by apiFetch
  useEffect(() => {
    const handle = () => {
      setUser(null);
      authService.clearTokens();
    };
    window.addEventListener('auth:session-expired', handle);
    return () => window.removeEventListener('auth:session-expired', handle);
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    const tokens = await authService.login(email, password, rememberMe);
    applyTokenPair(tokens);
    setUser(decodeUser(tokens.accessToken));
    return { isFirstLogin: tokens.isFirstLogin };
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const tokens = await authService.register(email, password, name);
    applyTokenPair(tokens);
    setUser(decodeUser(tokens.accessToken));
    return { isFirstLogin: tokens.isFirstLogin };
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore — always clear local state
    } finally {
      authService.clearTokens();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

