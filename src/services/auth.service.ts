import { apiFetch, setAccessToken } from '../lib/api';
import type { TokenPair, RegisterResult } from '../types/auth.types';

export type { TokenPair, RegisterResult };

export interface ActiveSession {
  id:          number;
  device_info: string | null;
  created_at:  string;
}

export interface SessionConflict {
  conflict:        true;
  active_sessions: ActiveSession[];
}

export async function login(
  email: string,
  password: string,
  rememberMe = true,
  force = false,
): Promise<TokenPair | SessionConflict> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method:      'POST',
    headers:     { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, rememberMe, force }),
  });

  const json = await res.json() as { success: boolean; data: TokenPair; error?: { code: string } & SessionConflict };

  if (res.status === 409 && json.error?.code === 'SESSION_LIMIT_EXCEEDED') {
    return { conflict: true, active_sessions: json.error.active_sessions };
  }

  if (!res.ok) {
    const code = json.error?.code ?? 'UNKNOWN';
    const msg  = (json.error as { message?: string })?.message ?? 'Login failed';
    throw Object.assign(new Error(msg), { code });
  }

  return json.data;
}

export async function forceLogout(): Promise<void> {
  await apiFetch('/auth/force-logout', { method: 'POST' });
}

export async function register(email: string, password: string): Promise<RegisterResult> {
  const res = await apiFetch<RegisterResult>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return res.data;
}

export async function verifyEmail(email: string, code: string): Promise<TokenPair> {
  const res = await apiFetch<TokenPair>('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
  return res.data;
}

export async function verifyEmailByToken(token: string): Promise<TokenPair> {
  const res = await apiFetch<TokenPair>('/auth/verify-email-token', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  return res.data;
}

export async function resendVerification(email: string): Promise<{ devVerifyToken?: string }> {
  const res = await apiFetch<{ devVerifyToken?: string }>('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return res.data;
}

export async function logout(): Promise<void> {
  await apiFetch('/auth/logout', { method: 'POST' });
}

/**
 * Fire-and-forget logout using sendBeacon — safe to call on pagehide/tab close.
 * sendBeacon is guaranteed to be sent even when the page is unloading.
 */
export function logoutBeacon(): void {
  const base = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';
  // Pass an empty JSON blob so the backend Content-Type check passes
  navigator.sendBeacon(`${base}/auth/logout`, new Blob([], { type: 'application/json' }));
}

export function clearTokens(): void {
  setAccessToken(null);
  // No localStorage to clear — refresh token is httpOnly cookie, cleared by server on logout
}
