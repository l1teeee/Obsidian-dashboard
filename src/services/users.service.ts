import { apiFetch } from '../lib/api';
import type { UserProfile } from '../types/users.types';

export type { UserProfile };

export async function getProfile(): Promise<UserProfile> {
  const res = await apiFetch<UserProfile>('/users/me');
  return res.data;
}
