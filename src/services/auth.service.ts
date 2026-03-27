import { apiFetch, setAccessToken } from '../lib/api';

export interface TokenPair {
  accessToken:  string;
  refreshToken: string;
  isFirstLogin: boolean;
}

export async function login(email: string, password: string): Promise<TokenPair> {
  const res = await apiFetch<TokenPair>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return res.data;
}

export async function register(
  email: string,
  password: string,
  name: string
): Promise<TokenPair> {
  const res = await apiFetch<TokenPair>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  return res.data;
}

export async function logout(): Promise<void> {
  await apiFetch('/auth/logout', { method: 'POST' });
}

export async function refresh(refreshToken: string): Promise<TokenPair | null> {
  try {
    const res = await apiFetch<TokenPair>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    return res.data;
  } catch {
    return null;
  }
}

export function clearTokens(): void {
  setAccessToken(null);
  localStorage.removeItem('obs_refresh_token');
}
