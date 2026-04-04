import { apiFetch } from '../lib/api';

export interface SocialConnection {
  id:                  string;
  platform:            'facebook' | 'instagram';
  platform_account_id: string;
  account_name:        string;
  account_picture:     string | null;
  token_expires_at:    string | null;
  page_id:             string | null;
  page_name:           string | null;
  ig_business_id:      string | null;
  account_type:        string | null;
  scopes:              string;
  created_at:          string;
}

export async function listConnections(): Promise<SocialConnection[]> {
  const res = await apiFetch<SocialConnection[]>('/platforms');
  return res.data;
}

export async function deleteConnection(id: string): Promise<void> {
  await apiFetch(`/platforms/${id}`, { method: 'DELETE' });
}

/** Fetches the Facebook OAuth URL from the backend then redirects the browser */
export async function startFacebookOAuth(): Promise<void> {
  const res = await apiFetch<{ url: string }>('/platforms/connect/facebook');
  window.location.href = res.data.url;
}

/**
 * Uses existing Facebook Page tokens to detect and save linked Instagram accounts.
 * Throws with code 'NO_IG_FOUND' if no IG accounts are linked to any stored FB page.
 */
export async function connectInstagramFromPages(): Promise<{ linked: number }> {
  const res = await apiFetch<{ linked: number }>('/platforms/connect/instagram');
  return res.data;
}
