export type UserPlan = 'starter' | 'pro' | 'enterprise';

export interface UserProfile {
  id:                string;
  email:             string;
  name:              string | null;
  role:              string | null;
  country:           string | null;
  plan:              UserPlan;
  profile_completed: boolean;
  created_at:        string;
}
