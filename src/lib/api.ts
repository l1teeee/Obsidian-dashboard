const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

let _accessToken: string | null = null;
let _refreshing: Promise<string | null> | null = null;

export function setAccessToken(token: string | null): void {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

// ─── Token refresh ────────────────────────────────────────────────────────────

async function callRefresh(): Promise<string | null> {
  const rt = localStorage.getItem('obs_refresh_token');
  if (!rt) return null;

  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });

    type RefreshResp = { success: boolean; data: { accessToken: string; refreshToken: string } };
    const json = (await res.json()) as RefreshResp;

    if (!res.ok || !json.success) {
      localStorage.removeItem('obs_refresh_token');
      _accessToken = null;
      return null;
    }

    _accessToken = json.data.accessToken;
    localStorage.setItem('obs_refresh_token', json.data.refreshToken);
    return _accessToken;
  } catch {
    localStorage.removeItem('obs_refresh_token');
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
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  type RawResp = ApiResponse<T> & { error?: { code: string; message: string } };
  const json = (await res.json()) as RawResp;

  if (!res.ok) {
    if (_retry && json.error?.code === 'TOKEN_EXPIRED') {
      const newToken = await refreshTokens();
      if (newToken) return apiFetch<T>(path, options, false);
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
      throw Object.assign(new Error('Session expired'), { code: 'SESSION_EXPIRED', status: 401 });
    }

    throw Object.assign(new Error(json.error?.message ?? 'Request failed'), {
      code:   json.error?.code ?? 'API_ERROR',
      status: res.status,
    });
  }

  return json;
}
