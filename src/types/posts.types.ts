import type { PageMeta } from '../lib/api';

export interface ApiPost {
  id:               string;
  user_id:          string;
  platform:         string;
  post_type:        string;
  caption:          string | null;
  media_urls:       string[] | null;
  permalink:        string | null;
  platform_post_id: string | null;
  status:           string;
  scheduled_at:     string | null;
  published_at:     string | null;
  created_at:       string;
}

export interface ApiPostMetrics {
  likes:       number;
  comments:    number;
  shares:      number;
  reach:       number | null;
  impressions: number | null;
  clicks:      number | null;
  dev_mode:    boolean;
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
