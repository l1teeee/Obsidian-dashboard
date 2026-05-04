import { apiFetch } from '../lib/api';
import type { PageMeta } from '../lib/api';
import type { AdminOverview, AdminUserRow, AdminWorkspaceRow, AdminPostRow, AdminEntry } from '../types/admin.types';

export type { AdminOverview, AdminUserRow, AdminWorkspaceRow, AdminPostRow, AdminEntry };

export async function getAdmins(): Promise<AdminEntry[]> {
  const res = await apiFetch<AdminEntry[]>('/admin/admins');
  return res.data;
}

export async function addAdmin(email: string): Promise<AdminEntry> {
  const res = await apiFetch<AdminEntry>('/admin/admins', {
    method: 'POST',
    body:   JSON.stringify({ email }),
  });
  return res.data;
}

export async function removeAdmin(id: string): Promise<void> {
  await apiFetch(`/admin/admins/${id}`, { method: 'DELETE' });
}

export async function getOverview(): Promise<AdminOverview> {
  const res = await apiFetch<AdminOverview>('/admin/overview');
  return res.data;
}

export async function getUsers(params: {
  page?:   number;
  limit?:  number;
  search?: string;
  plan?:   string;
} = {}): Promise<{ users: AdminUserRow[]; meta: PageMeta }> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.plan)   qs.set('plan',   params.plan);
  qs.set('page',  String(params.page  ?? 1));
  qs.set('limit', String(params.limit ?? 10));
  const res = await apiFetch<AdminUserRow[]>(`/admin/users?${qs.toString()}`);
  return { users: res.data, meta: res.meta! };
}

export async function getWorkspaces(params: {
  page?:   number;
  limit?:  number;
  search?: string;
} = {}): Promise<{ workspaces: AdminWorkspaceRow[]; meta: PageMeta }> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  qs.set('page',  String(params.page  ?? 1));
  qs.set('limit', String(params.limit ?? 10));
  const res = await apiFetch<AdminWorkspaceRow[]>(`/admin/workspaces?${qs.toString()}`);
  return { workspaces: res.data, meta: res.meta! };
}

export async function deactivateUser(id: string, reason: string): Promise<void> {
  await apiFetch(`/admin/users/${id}/deactivate`, { method: 'PATCH', body: JSON.stringify({ reason }) });
}

export async function activateUser(id: string, reason: string): Promise<void> {
  await apiFetch(`/admin/users/${id}/activate`, { method: 'PATCH', body: JSON.stringify({ reason }) });
}

export async function deactivateWorkspace(id: string): Promise<void> {
  await apiFetch(`/admin/workspaces/${id}/deactivate`, { method: 'PATCH' });
}

export async function activateWorkspace(id: string): Promise<void> {
  await apiFetch(`/admin/workspaces/${id}/activate`, { method: 'PATCH' });
}

export async function deactivatePost(id: string, reason: string): Promise<void> {
  await apiFetch(`/admin/posts/${id}/deactivate`, { method: 'PATCH', body: JSON.stringify({ reason }) });
}

export async function activatePost(id: string, reason: string): Promise<void> {
  await apiFetch(`/admin/posts/${id}/activate`, { method: 'PATCH', body: JSON.stringify({ reason }) });
}

export async function getPosts(params: {
  page?:     number;
  limit?:    number;
  platform?: string;
  status?:   string;
  search?:   string;
} = {}): Promise<{ posts: AdminPostRow[]; meta: PageMeta }> {
  const qs = new URLSearchParams();
  if (params.platform) qs.set('platform', params.platform);
  if (params.status)   qs.set('status',   params.status);
  if (params.search)   qs.set('search',   params.search);
  qs.set('page',  String(params.page  ?? 1));
  qs.set('limit', String(params.limit ?? 10));
  const res = await apiFetch<AdminPostRow[]>(`/admin/posts?${qs.toString()}`);
  return { posts: res.data, meta: res.meta! };
}
