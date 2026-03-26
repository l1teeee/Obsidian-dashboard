import type { PlatformId, PlatformStatus } from './Platform';

export interface ProfileData {
  name:     string;
  email:    string;
  role:     string;
  timezone: string;
}

export interface ProfileStat {
  label: string;
  value: string;
}

export interface ConnectedPlatformEntry {
  platformId: PlatformId;
  name:       string;
  handle:     string;
  status:     PlatformStatus;
  color:      string;
  icon:       string;
}

export interface ActivityEntry {
  action: string;
  detail: string;
  time:   string;
  icon:   string;
  color:  string;
}

export interface NotificationPref {
  label: string;
  desc:  string;
  on:    boolean;
}

export const TIMEZONES: string[] = [
  'UTC−8 (Los Angeles)', 'UTC−7 (Denver)', 'UTC−6 (Mexico City)',
  'UTC−5 (New York)', 'UTC−4 (Caracas)', 'UTC+0 (London)',
  'UTC+1 (Paris)', 'UTC+2 (Cairo)', 'UTC+3 (Moscow)',
  'UTC+5:30 (Mumbai)', 'UTC+8 (Beijing)', 'UTC+9 (Tokyo)',
];
