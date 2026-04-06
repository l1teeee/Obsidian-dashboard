import { apiFetch } from '../lib/api';

export interface FacebookSummary {
  fan_count:          number;
  impressions_30d:    number;
  reach_30d:          number;
  engaged_users_30d:  number;
  period: { since: string; until: string };
}

export interface FbPostMetric {
  id:            string;
  message:       string | null;
  created_time:  string;
  thumbnail:     string | null;
  impressions:   number;
  reach:         number;
  engaged_users: number;
  reactions:     number;
}

export async function getFacebookSummary(): Promise<FacebookSummary> {
  const res = await apiFetch<FacebookSummary>('/metrics/facebook/summary');
  return res.data;
}

export async function getFacebookPosts(): Promise<FbPostMetric[]> {
  const res = await apiFetch<FbPostMetric[]>('/metrics/facebook/posts');
  return res.data;
}
