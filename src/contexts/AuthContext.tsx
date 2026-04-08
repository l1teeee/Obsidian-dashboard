/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { apiFetch, setAccessToken, refreshTokens, hasSessionCookie } from '../lib/api';
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
  kickedByDevice:       boolean;
  login:                (email: string, password: string, rememberMe?: boolean, force?: boolean) => Promise<{ isFirstLogin: boolean; profileCompleted: boolean }>;
  register:             (email: string, password: string) => Promise<authService.RegisterResult>;
  verifyEmail:          (email: string, code: string) => Promise<{ isFirstLogin: boolean; profileCompleted: boolean }>;
  verifyEmailToken:     (token: string) => Promise<{ isFirstLogin: boolean; profileCompleted: boolean }>;
  logout:               () => Promise<void>;
  markProfileCompleted: () => Promise<void>;
  clearKick:            () => void;
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
  const [user,           setUser]           = useState<AuthUser | null>(null);
  const [isLoading,      setIsLoading]      = useState(true);
  const [kickedByDevice, setKickedByDevice] = useState(false);
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

  // Handle session expiry triggered by apiFetch (token expired / unauthorized)
  useEffect(() => {
    const handle = () => { setUser(null); authService.clearTokens(); };
    window.addEventListener('auth:session-expired', handle);
    return () => window.removeEventListener('auth:session-expired', handle);
  }, []);

  // Handle session revoked by another device (SESSION_REVOKED from /auth/ping)
  useEffect(() => {
    const handle = () => { setUser(null); authService.clearTokens(); setKickedByDevice(true); };
    window.addEventListener('auth:session-revoked', handle);
    return () => window.removeEventListener('auth:session-revoked', handle);
  }, []);

  // Poll /auth/ping every 15s while authenticated.
  // If the server returns 401 (SESSION_REVOKED), apiFetch dispatches auth:session-expired.
  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => {
      void apiFetch('/auth/ping').catch(() => { /* handled by apiFetch */ });
    }, 15_000);
    return () => clearInterval(id);
  }, [user]);

  const login = useCallback(async (email: string, password: string, rememberMe?: boolean, force?: boolean) => {
    const result = await authService.login(email, password, rememberMe, force);
    if ('conflict' in result) {
      // Bubble up so LoginCard can show the session conflict modal
      throw Object.assign(new Error('SESSION_LIMIT_EXCEEDED'), { code: 'SESSION_LIMIT_EXCEEDED', sessions: result.active_sessions });
    }
    applyTokenPair(result);
    const u = decodeUser(result.accessToken);
    setUser(u);
    return { isFirstLogin: result.isFirstLogin, profileCompleted: u?.profileCompleted ?? false };
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    return authService.register(email, password);
    // No tokens set — user must verify email first
  }, []);

  const verifyEmail = useCallback(async (email: string, code: string) => {
    const tokens = await authService.verifyEmail(email, code);
    applyTokenPair(tokens);
    const u = decodeUser(tokens.accessToken);
    setUser(u);
    return { isFirstLogin: tokens.isFirstLogin, profileCompleted: u?.profileCompleted ?? false };
  }, []);

  const verifyEmailToken = useCallback(async (token: string) => {
    const tokens = await authService.verifyEmailByToken(token);
    applyTokenPair(tokens);
    const u = decodeUser(tokens.accessToken);
    setUser(u);
    return { isFirstLogin: tokens.isFirstLogin, profileCompleted: u?.profileCompleted ?? false };
  }, []);

  // Called by CompleteProfile after a successful PUT /users/me.
  // Refreshes the access token (backend now returns pc:1) and updates user state.
  const markProfileCompleted = useCallback(async () => {
    const newToken = await refreshTokens();
    if (newToken) setUser(decodeUser(newToken));
  }, []);

  const clearKick = useCallback(() => setKickedByDevice(false), []);

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
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, kickedByDevice, clearKick, login, register, verifyEmail, verifyEmailToken, logout, markProfileCompleted }}>
      {children}
    </AuthContext.Provider>
  );
}

