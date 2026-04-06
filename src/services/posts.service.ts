import { apiFetch } from '../lib/api';
import type {
  ApiPost,
  ApiPostMetrics,
  GetPostsParams,
  PostsPage,
  CreatePostPayload,
  UpdatePostPayload,
} from '../types/posts.types';

export type { ApiPost, ApiPostMetrics, GetPostsParams, PostsPage, CreatePostPayload, UpdatePostPayload };

export async function getAll(params: GetPostsParams = {}): Promise<PostsPage> {
  const qs = new URLSearchParams();
  if (params.platform) qs.set('platform', params.platform);
  if (params.status)   qs.set('status',   params.status);
  qs.set('page',  String(params.page  ?? 1));
  qs.set('limit', String(params.limit ?? 100));

  const res = await apiFetch<ApiPost[]>(`/posts?${qs.toString()}`);
  return { posts: res.data, meta: res.meta! };
}

export async function getById(id: string): Promise<ApiPost> {
  const res = await apiFetch<ApiPost>(`/posts/${id}`);
  return res.data;
}

export async function create(payload: CreatePostPayload): Promise<ApiPost> {
  const res = await apiFetch<ApiPost>('/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function update(id: string, payload: UpdatePostPayload): Promise<ApiPost> {
  const res = await apiFetch<ApiPost>(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deactivate(id: string): Promise<ApiPost> {
  const res = await apiFetch<ApiPost>(`/posts/${id}/deactivate`, {
    method: 'PATCH',
    body: '{}',
  });
  return res.data;
}

export async function remove(id: string, removeFromPlatform = false): Promise<{ fbDeleteFailed?: boolean }> {
  const qs  = removeFromPlatform ? '?removeFromPlatform=true' : '';
  const res = await apiFetch<{ fbDeleteFailed?: boolean }>(`/posts/${id}${qs}`, { method: 'DELETE' });
  return res.data ?? {};
}

export async function getMetrics(id: string): Promise<ApiPostMetrics> {
  const res = await apiFetch<ApiPostMetrics>(`/posts/${id}/metrics`);
  return res.data;
}
