import { apiFetch } from '../lib/api';
import type { PageMeta } from '../lib/api';
import type {
  AdminOverview, AdminUserRow, AdminWorkspaceRow, AdminPostRow, AdminEntry,
  PermissionsData, PlanPermissions, CustomRole, RoleUser,
  TokenStats, ToolBreakdown, TopUser, TokenLimit,
} from '../types/admin.types';

export type { AdminOverview, AdminUserRow, AdminWorkspaceRow, AdminPostRow, AdminEntry, PermissionsData, PlanPermissions, CustomRole, RoleUser, TokenStats, ToolBreakdown, TopUser, TokenLimit };

export async function getAdmins(): Promise<AdminEntry[]> {
  const res = await apiFetch<AdminEntry[]>('/admin/admins');
  return res.data;
}

export async function addAdmin(email: string, role: 'admin' | 'superadmin' = 'admin'): Promise<AdminEntry> {
  const res = await apiFetch<AdminEntry>('/admin/admins', {
    method: 'POST',
    body:   JSON.stringify({ email, role }),
  });
  return res.data;
}

export async function removeAdmin(id: string): Promise<void> {
  await apiFetch(`/admin/admins/${id}`, { method: 'DELETE' });
}

export async function respondToInvite(token: string, action: 'accept' | 'reject'): Promise<{ status: string; email: string }> {
  const res = await apiFetch<{ status: string; email: string }>('/admin/invite/respond', {
    method: 'POST',
    body:   JSON.stringify({ token, action }),
  });
  return res.data;
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

// ─── Permissions & Roles ─────────────────────────────────────────────────────

export async function getPermissions(): Promise<PermissionsData> {
  const res = await apiFetch<PermissionsData>('/admin/permissions');
  return res.data;
}

export async function setPlanPermissions(plan: string, permissions: string[]): Promise<void> {
  await apiFetch(`/admin/permissions/${plan}`, { method: 'PUT', body: JSON.stringify({ permissions }) });
}

export async function getRoles(): Promise<CustomRole[]> {
  const res = await apiFetch<CustomRole[]>('/admin/roles');
  return res.data;
}

export async function createRole(data: { name: string; description?: string; color?: string; permissions: string[] }): Promise<CustomRole> {
  const res = await apiFetch<CustomRole>('/admin/roles', { method: 'POST', body: JSON.stringify(data) });
  return res.data;
}

export async function updateRole(id: string, data: { name: string; description?: string; color?: string; permissions: string[] }): Promise<void> {
  await apiFetch(`/admin/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteRole(id: string): Promise<void> {
  await apiFetch(`/admin/roles/${id}`, { method: 'DELETE' });
}

export async function getRoleUsers(roleId: string): Promise<RoleUser[]> {
  const res = await apiFetch<RoleUser[]>(`/admin/roles/${roleId}/users`);
  return res.data;
}

export async function assignUserToRole(roleId: string, userId: string): Promise<void> {
  await apiFetch(`/admin/roles/${roleId}/users`, { method: 'POST', body: JSON.stringify({ user_id: userId }) });
}

export async function removeUserFromRole(roleId: string, userId: string): Promise<void> {
  await apiFetch(`/admin/roles/${roleId}/users/${userId}`, { method: 'DELETE' });
}

// ─── Token Usage ─────────────────────────────────────────────────────────────

export async function getTokenStats(period = '30d'): Promise<TokenStats> {
  const res = await apiFetch<TokenStats>(`/admin/tokens/stats?period=${period}`);
  return res.data;
}

export async function getToolBreakdown(period = '30d'): Promise<ToolBreakdown[]> {
  const res = await apiFetch<ToolBreakdown[]>(`/admin/tokens/by-tool?period=${period}`);
  return res.data;
}

export async function getTopUsers(period = '30d', limit = 10): Promise<TopUser[]> {
  const res = await apiFetch<TopUser[]>(`/admin/tokens/top-users?period=${period}&limit=${limit}`);
  return res.data;
}

export async function getTokenLimits(): Promise<TokenLimit[]> {
  const res = await apiFetch<TokenLimit[]>('/admin/tokens/limits');
  return res.data;
}

export async function setTokenLimit(plan: string, monthlyLimit: number): Promise<void> {
  await apiFetch(`/admin/tokens/limits/${plan}`, {
    method: 'PUT',
    body:   JSON.stringify({ monthly_limit: monthlyLimit }),
  });
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
