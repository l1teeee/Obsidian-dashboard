export interface FacebookSummary {
  fan_count:         number;
  impressions_30d:   number;
  reach_30d:         number;
  engaged_users_30d: number;
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
