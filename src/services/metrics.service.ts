import { apiFetch } from '../lib/api';
import type { DashboardSummary, FacebookSummary, FbPostMetric } from '../types/metrics.types';

export type { DashboardSummary, FacebookSummary, FbPostMetric };

export async function getDashboardSummary(signal?: AbortSignal): Promise<DashboardSummary> {
  const res = await apiFetch<DashboardSummary>('/metrics/dashboard/summary', { signal });
  return res.data;
}

export async function getFacebookSummary(signal?: AbortSignal): Promise<FacebookSummary> {
  const res = await apiFetch<FacebookSummary>('/metrics/facebook/summary', { signal });
  return res.data;
}

export async function getFacebookPosts(signal?: AbortSignal): Promise<FbPostMetric[]> {
  const res = await apiFetch<FbPostMetric[]>('/metrics/facebook/posts', { signal });
  return res.data;
}

export async function getFacebookPostById(postId: string): Promise<FbPostMetric> {
  const res = await apiFetch<FbPostMetric>(`/metrics/facebook/posts/${postId}`);
  return res.data;
}
