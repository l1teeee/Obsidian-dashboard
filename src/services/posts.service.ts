import { apiFetch } from '../lib/api';
import type { PageMeta } from '../lib/api';

export interface ApiPost {
  id:           string;
  user_id:      string;
  platform:     string;
  post_type:    string;
  caption:      string | null;
  media_urls:   string[] | null;
  status:       string;
  scheduled_at: string | null;
  published_at: string | null;
  created_at:   string;
}

export interface GetPostsParams {
  platform?: string;
  status?:   string;
  page?:     number;
  limit?:    number;
}

export interface PostsPage {
  posts: ApiPost[];
  meta:  PageMeta;
}

export interface CreatePostPayload {
  platform:      string;
  post_type?:    string;
  caption?:      string;
  media_urls?:   string[];
  status?:       string;
  scheduled_at?: string;
}

export interface UpdatePostPayload {
  status?:       string;
  caption?:      string;
  scheduled_at?: string;
  media_urls?:   string[];
}

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

export async function remove(id: string): Promise<void> {
  await apiFetch(`/posts/${id}`, { method: 'DELETE' });
}
