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

// Returns the new access token, null if definitively invalid (401), or throws on server error (5xx)
async function callRefresh(): Promise<string | null> {
  const res = await fetch(`${BASE}/auth/refresh`, {
    method:      'POST',
    credentials: 'include',
  });

  if (res.status === 401 || res.status === 403) {
    _accessToken = null;
    return null;
  }

  if (!res.ok) {
    // 5xx or unexpected — don't invalidate the session, let the caller decide
    throw Object.assign(new Error('Refresh server error'), { status: res.status });
  }

  type RefreshResp = { success: boolean; data: { accessToken: string } };
  const json = (await res.json()) as RefreshResp;

  if (!json.success) {
    _accessToken = null;
    return null;
  }

  _accessToken = json.data.accessToken;
  return _accessToken;
}

/** Refreshes the access token. Deduplicates concurrent calls.
 *  Returns null if the refresh token is invalid (user must re-login).
 *  Throws if the refresh endpoint itself errored (5xx) — caller decides what to do. */
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
    if (_retry && res.status === 401 && json.error?.code === 'TOKEN_EXPIRED') {
      try {
        const newToken = await refreshTokens();
        if (newToken) return apiFetch<T>(path, options, false);
        // Refresh returned null = refresh token definitively invalid (401/403)
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
      } catch {
        // Refresh returned 5xx — server error, don't log the user out
      }
      throw Object.assign(new Error(json.error?.message ?? 'Session expired'), {
        code:   json.error?.code ?? 'SESSION_EXPIRED',
        status: 401,
      });
    }

    // Any other 401 — distinguish device-kick from normal expiry
    // Exclude external-token codes (Facebook/Instagram token expired) to avoid false logouts
    if (res.status === 401 && json.error?.code !== 'TOKEN_EXPIRED') {
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
