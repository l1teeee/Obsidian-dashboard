export interface DashboardSummary {
  posts: {
    total:                number;
    published:            number;
    scheduled:            number;
    draft:                number;
    published_this_week:  number;
  };
  platforms_connected: number;
}

export interface FacebookSummary {
  fan_count:         number;
  impressions_30d:   number;
  reach_30d:         number;
  engaged_users_30d: number;
  period: { since: string; until: string };
}

export interface FbPostMetric {
  id:            string;
  local_id?:     string;
  message:       string | null;
  created_time:  string;
  thumbnail:     string | null;
  impressions:   number;
  reach:         number;
  engaged_users: number;
  reactions:     number;
}
