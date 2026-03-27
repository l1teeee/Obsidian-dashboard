import { apiFetch } from '../lib/api';

export interface ApiWorkspace {
  id:         string;
  user_id:    string;
  name:       string;
  created_at: string;
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
