import { apiFetch } from '../lib/api';
import type { ChannelId } from '../types/composer.types';

export interface ApiWorkspace {
  id:         string;
  user_id:    string;
  name:       string;
  created_at: string;
}

export interface PreferredChannelResult {
  preferred:    ChannelId | null;
  autoDetected: boolean;
  totalPosts:   number;
}

export async function getAll(): Promise<ApiWorkspace[]> {
  const res = await apiFetch<ApiWorkspace[]>('/workspaces');
  return res.data;
}

export async function create(name: string): Promise<ApiWorkspace> {
  const res = await apiFetch<ApiWorkspace>('/workspaces', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return res.data;
}

export async function rename(id: string, name: string): Promise<ApiWorkspace> {
  const res = await apiFetch<ApiWorkspace>(`/workspaces/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
  return res.data;
}

export async function remove(id: string): Promise<void> {
  await apiFetch(`/workspaces/${id}`, { method: 'DELETE' });
}

export async function fetchPreferredChannel(workspaceId: string): Promise<PreferredChannelResult> {
  const res = await apiFetch<PreferredChannelResult>(`/workspaces/${workspaceId}/preferred-channel`);
  return res.data;
}

export async function savePreferredChannel(workspaceId: string, channel: ChannelId | null): Promise<void> {
  await apiFetch(`/workspaces/${workspaceId}/preferred-channel`, {
    method: 'POST',
    body:   JSON.stringify({ channel }),
  });
}
