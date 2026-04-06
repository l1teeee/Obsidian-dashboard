import { apiFetch } from '../lib/api';
import type { SocialConnection } from '../types/platforms.types';

export type { SocialConnection };

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

/**
 * Instagram direct OAuth (Camino B) — no Facebook account required.
 * Fetches the Instagram OAuth URL from the backend then redirects the browser.
 */
export async function startInstagramDirectOAuth(): Promise<void> {
  const res = await apiFetch<{ url: string }>('/platforms/connect/instagram/oauth');
  window.location.href = res.data.url;
}
