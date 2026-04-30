import { apiFetch } from '../lib/api';
import type { SocialConnection } from '../types/platforms.types';

export type { SocialConnection };

export async function listConnections(workspaceId?: string | null): Promise<SocialConnection[]> {
  const qs  = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
  const res = await apiFetch<SocialConnection[]>(`/platforms${qs}`);
  return res.data;
}

export async function deleteConnection(id: string): Promise<void> {
  await apiFetch(`/platforms/${id}`, { method: 'DELETE' });
}

export async function startFacebookOAuth(workspaceId?: string | null): Promise<void> {
  const qs  = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
  const res = await apiFetch<{ url: string }>(`/platforms/connect/facebook${qs}`);
  window.location.href = res.data.url;
}

export async function connectInstagramFromPages(workspaceId?: string | null): Promise<{ linked: number }> {
  const qs  = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
  const res = await apiFetch<{ linked: number }>(`/platforms/connect/instagram${qs}`);
  return res.data;
}

export async function startInstagramDirectOAuth(workspaceId?: string | null): Promise<void> {
  const qs  = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
  const res = await apiFetch<{ url: string }>(`/platforms/connect/instagram/oauth${qs}`);
  window.location.href = res.data.url;
}
