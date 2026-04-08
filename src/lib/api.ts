const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

let _accessToken: string | null = null;
let _refreshing: Promise<string | null> | null = null;

export function setAccessToken(token: string | null): void {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

// ─── Session indicator ────────────────────────────────────────────────────────
// obs_rt  is httpOnly — invisible to JS but sent automatically by the browser.
// obs_sid is a non-httpOnly presence flag ("1") set by the server alongside
// obs_rt. We read it to avoid calling /auth/refresh when there is no session,
// preventing unnecessary network requests for unauthenticated visitors.
export function hasSessionCookie(): boolean {
  return document.cookie.split(';').some(c => c.trim().startsWith('obs_sid='));
}

// ─── Token refresh ────────────────────────────────────────────────────────────

async function callRefresh(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method:      'POST',
      credentials: 'include',     // sends the httpOnly refresh-token cookie
    });

    type RefreshResp = { success: boolean; data: { accessToken: string } };
    const json = (await res.json()) as RefreshResp;

    if (!res.ok || !json.success) {
      _accessToken = null;
      return null;
    }

    _accessToken = json.data.accessToken;
    return _accessToken;
  } catch {
    _accessToken = null;
    return null;
  }
}

/** Refreshes the access token. Deduplicates concurrent calls. */
export async function refreshTokens(): Promise<string | null> {
  if (!_refreshing) {
    _refreshing = callRefresh().finally(() => { _refreshing = null; });
  }
  return _refreshing;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PageMeta {
  page:  number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data:    T;
  meta?:   PageMeta;
}

// ─── Fetch wrapper ────────────────────────────────────────────────────────────

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  _retry = true,
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    // Set Content-Type only for JSON bodies. FormData bodies must NOT have it
    // set manually — the browser adds it automatically with the multipart boundary.
    ...(options.body !== undefined && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',   // always send cookies (httpOnly refresh token)
  });

  type RawResp = ApiResponse<T> & { error?: { code: string; message: string } };
  const json = (await res.json()) as RawResp;

  if (!res.ok) {
    if (_retry && json.error?.code === 'TOKEN_EXPIRED') {
      const newToken = await refreshTokens();
      if (newToken) return apiFetch<T>(path, options, false);
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
      throw Object.assign(new Error('Session expired'), { code: 'SESSION_EXPIRED', status: 401 });
    }

    // Any other 401 → kick out immediately; distinguish device-kick from normal expiry
    if (res.status === 401) {
      const event = json.error?.code === 'SESSION_REVOKED'
        ? 'auth:session-revoked'
        : 'auth:session-expired';
      window.dispatchEvent(new CustomEvent(event));
    }

    throw Object.assign(new Error(json.error?.message ?? 'Request failed'), {
      code:   json.error?.code ?? 'API_ERROR',
      status: res.status,
    });
  }

  return json;
}
