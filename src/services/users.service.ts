import { apiFetch } from '../lib/api';
import type { UserProfile, UserPlan } from '../types/users.types';

export type { UserProfile };

export interface PlatformSummary {
  id:               string;
  platform:         'facebook' | 'instagram';
  account_name:     string;
  account_picture:  string | null;
  token_expires_at: string | null;
  created_at:       string;
}

export interface ActivityItem {
  action: string;
  detail: string;
  time:   string;
  icon:   string;
  color:  string;
}

export async function getProfile(): Promise<UserProfile> {
  const res = await apiFetch<UserProfile>('/users/me');
  return res.data;
}

export async function updateProfile(data: { name?: string; role?: string; country?: string }): Promise<UserProfile> {
  const res = await apiFetch<UserProfile>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updatePlan(plan: UserPlan): Promise<void> {
  await apiFetch('/users/me/plan', {
    method: 'PATCH',
    body: JSON.stringify({ plan }),
  });
}

export async function getPlatforms(): Promise<PlatformSummary[]> {
  const res = await apiFetch<PlatformSummary[]>('/users/me/platforms');
  return res.data;
}

export async function getUserActivity(): Promise<ActivityItem[]> {
  const res = await apiFetch<ActivityItem[]>('/users/me/activity');
  return res.data;
}

export async function getAllUserActivity(): Promise<ActivityItem[]> {
  const res = await apiFetch<ActivityItem[]>('/users/me/activity/all');
  return res.data;
}

export async function saveAvatarUrl(avatarUrl: string): Promise<void> {
  await apiFetch('/users/me/avatar', {
    method: 'PATCH',
    body: JSON.stringify({ avatar_url: avatarUrl }),
  });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiFetch('/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
}
