export interface SocialConnection {
  id:                  string;
  platform:            'facebook' | 'instagram';
  platform_account_id: string;
  account_name:        string;
  account_picture:     string | null;
  token_expires_at:    string | null;
  page_id:             string | null;
  page_name:           string | null;
  ig_business_id:      string | null;
  account_type:        string | null;
  scopes:              string;
  created_at:          string;
}
