export type UserPlan = 'free' | 'starter' | 'pro' | 'enterprise';

export interface UserProfile {
  id:                string;
  email:             string;
  name:              string | null;
  role:              string | null;
  country:           string | null;
  avatar_url:        string | null;
  plan:              UserPlan;
  is_admin:          boolean;
  is_superadmin:     boolean;
  profile_completed: boolean;
  created_at:        string;
}
