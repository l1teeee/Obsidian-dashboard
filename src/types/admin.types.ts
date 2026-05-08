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

export type AdminRole = 'admin' | 'superadmin';

export interface AdminEntry {
  id:              string;
  email:           string;
  name:            string | null;
  role:            AdminRole;
  status:          'pending' | 'accepted' | 'rejected';
  invited_by_name: string | null;
  created_at:      string;
  responded_at:    string | null;
}

export interface AdminOverview {
  stats:          AdminStats;
  posts_by_week:  AdminWeekPoint[];
  users_by_week:  AdminWeekPoint[];
  top_workspaces: AdminWorkspaceRow[];
}

// ─── Permissions & Roles ──────────────────────────────────────────────────────

export interface SystemPermission {
  key:      string;
  name:     string;
  category: string;
}

export interface PlanPermissions {
  free:       string[];
  starter:    string[];
  pro:        string[];
  enterprise: string[];
}

export interface PermissionsData {
  system: SystemPermission[];
  plan:   PlanPermissions;
}

export interface CustomRole {
  id:          string;
  name:        string;
  description: string | null;
  color:       string | null;
  permissions: string[];
  user_count:  number;
  created_at:  string;
}

export interface RoleUser {
  id:          string;
  email:       string;
  name:        string | null;
  plan:        string;
  assigned_at: string;
}

// ─── Token Usage ──────────────────────────────────────────────────────────────

export interface TokenStats {
  total_tokens:       number;
  input_tokens:       number;
  output_tokens:      number;
  total_calls:        number;
  unique_users:       number;
  estimated_cost_usd: number;
  top_tool:           string | null;
}

export interface ToolBreakdown {
  tool:          string;
  total_tokens:  number;
  input_tokens:  number;
  output_tokens: number;
  total_calls:   number;
  pct:           number;
}

export interface TopUser {
  user_id:      string;
  email:        string;
  name:         string | null;
  total_tokens: number;
  total_calls:  number;
}

export interface TokenLimit {
  plan:          string;
  monthly_limit: number;
}
