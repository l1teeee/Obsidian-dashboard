export interface AdminStats {
  total_users:      number;
  total_workspaces: number;
  total_posts:      number;
  posts_this_week:  number;
  users_this_week:  number;
}

export interface AdminWeekPoint {
  week:  string; // ISO date (start of week, e.g. "2025-04-07")
  count: number;
}

export interface AdminUserRow {
  id:                string;
  email:             string;
  name:              string | null;
  role:              string | null;
  plan:              string;
  is_admin:          boolean;
  is_banned:         boolean;
  profile_completed: boolean;
  created_at:        string;
  workspace_count:   number;
  post_count:        number;
}

export interface AdminWorkspaceRow {
  id:           string;
  name:         string;
  user_id:      string;
  owner_email:  string;
  owner_name:   string | null;
  post_count:   number;
  is_active:    boolean;
  created_at:   string;
}

export interface AdminPostRow {
  id:             string;
  user_id:        string;
  owner_email:    string;
  workspace_id:   string;
  workspace_name: string;
  platform:       string;
  post_type:      string;
  caption:        string | null;
  status:         string;
  scheduled_at:   string | null;
  published_at:   string | null;
  created_at:     string;
}

export interface AdminEntry {
  id:         string;
  email:      string;
  name:       string | null;
  created_at: string;
  added_by:   string | null;
}

export interface AdminOverview {
  stats:          AdminStats;
  posts_by_week:  AdminWeekPoint[];
  users_by_week:  AdminWeekPoint[];
  top_workspaces: AdminWorkspaceRow[];
}
