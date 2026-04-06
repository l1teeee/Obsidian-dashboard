import { apiFetch } from '../lib/api';
import type { FacebookSummary, FbPostMetric } from '../types/metrics.types';

export type { FacebookSummary, FbPostMetric };

export async function getFacebookSummary(): Promise<FacebookSummary> {
  const res = await apiFetch<FacebookSummary>('/metrics/facebook/summary');
  return res.data;
}

export async function getFacebookPosts(): Promise<FbPostMetric[]> {
  const res = await apiFetch<FbPostMetric[]>('/metrics/facebook/posts');
  return res.data;
}

export async function getFacebookPostById(postId: string): Promise<FbPostMetric> {
  const res = await apiFetch<FbPostMetric>(`/metrics/facebook/posts/${postId}`);
  return res.data;
}
