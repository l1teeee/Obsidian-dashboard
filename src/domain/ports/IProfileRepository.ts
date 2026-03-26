import type { ProfileData, ProfileStat, ConnectedPlatformEntry, ActivityEntry, NotificationPref } from '../entities/Profile';

export interface IProfileRepository {
  getProfile():            ProfileData;
  saveProfile(d: ProfileData): void;
  getStats():              ProfileStat[];
  getConnectedPlatforms(): ConnectedPlatformEntry[];
  getActivity():           ActivityEntry[];
  getNotificationPrefs():  NotificationPref[];
}
