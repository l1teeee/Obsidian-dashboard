import { apiFetch, setAccessToken } from '../lib/api';

export interface TokenPair {
  accessToken:  string;
  isFirstLogin: boolean;
  // refreshToken lives in an httpOnly cookie — never exposed to JS
}

export async function login(email: string, password: string, rememberMe = true): Promise<TokenPair> {
  const res = await apiFetch<TokenPair>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe }),
  });
  return res.data;
}

export async function register(
  email: string,
  password: string,
  name: string,
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

export function clearTokens(): void {
  setAccessToken(null);
  // No localStorage to clear — refresh token is httpOnly cookie, cleared by server on logout
}
