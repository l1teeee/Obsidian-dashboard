import type { PlatformId } from './Platform';

export type PostStatus = 'published' | 'scheduled' | 'draft' | 'failed' | 'inactive' | 'deleted';

export interface PostSummary {
  id:       string;
  title:    string;
  platform: PlatformId;
  status:   PostStatus;
  date:     string;
  imageUrl: string;
  likes:    string;
  comments: string;
  shares:   string;
}

export interface PostMetric {
  label:    string;
  value:    string;
  delta:    string | null;
  positive: boolean;
}

export interface PostBenchmark {
  label:   string;
  delta:   string;
  pct:     number;
  variant: 'purple' | 'green' | 'red';
}

export interface PostComment {
  name:   string;
  time:   string;
  likes:  number;
  text:   string;
  filled: boolean;
}

export interface PostRecord {
  id:         string;
  imageUrl:   string;
  platform:   PlatformId;
  date:       string;
  caption:    string;
  tags:       string[];
  metrics:    PostMetric[];
  benchmarks: PostBenchmark[];
  comments:   PostComment[];
}

export interface UpcomingPost {
  id:       string;
  date:     string;
  platform: PlatformId;
  caption:  string;
  imageUrl: string;
}
