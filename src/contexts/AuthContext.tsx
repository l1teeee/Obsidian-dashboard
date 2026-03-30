/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { setAccessToken, refreshTokens, hasSessionCookie } from '../lib/api';
import * as authService from '../services/auth.service';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id:               string;
  email:            string;
  profileCompleted: boolean;
}

interface AuthCtx {
  user:                 AuthUser | null;
  isAuthenticated:      boolean;
  isLoading:            boolean;
  login:                (email: string, password: string, rememberMe?: boolean) => Promise<{ isFirstLogin: boolean; profileCompleted: boolean }>;
  register:             (email: string, password: string, name: string) => Promise<{ isFirstLogin: boolean; profileCompleted: boolean }>;
  logout:               () => Promise<void>;
  markProfileCompleted: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthCtx | null>(null);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function decodeUser(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { id: string; email: string; pc?: number };
    return { id: payload.id, email: payload.email, profileCompleted: !!payload.pc };
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

  // Silent refresh on mount — only attempted when obs_sid cookie is present,
  // meaning the user has an active session. Skipped entirely for guests.
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    if (!hasSessionCookie()) {
      setIsLoading(false);
      return;
    }

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
    const u = decodeUser(tokens.accessToken);
    setUser(u);
    return { isFirstLogin: tokens.isFirstLogin, profileCompleted: u?.profileCompleted ?? false };
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const tokens = await authService.register(email, password, name);
    applyTokenPair(tokens);
    const u = decodeUser(tokens.accessToken);
    setUser(u);
    return { isFirstLogin: tokens.isFirstLogin, profileCompleted: u?.profileCompleted ?? false };
  }, []);

  // Called by CompleteProfileModal after a successful PUT /users/me.
  // Refreshes the access token (backend now returns pc:1) and updates user state.
  const markProfileCompleted = useCallback(async () => {
    const newToken = await refreshTokens();
    if (newToken) setUser(decodeUser(newToken));
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
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, markProfileCompleted }}>
      {children}
    </AuthContext.Provider>
  );
}

