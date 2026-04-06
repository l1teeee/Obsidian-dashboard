export interface UserProfile {
  id:                string;
  email:             string;
  name:              string | null;
  role:              string | null;
  country:           string | null;
  profile_completed: boolean;
  created_at:        string;
}
