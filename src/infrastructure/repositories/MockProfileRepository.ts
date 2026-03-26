import type { IProfileRepository } from '../../domain/ports/IProfileRepository';
import type { ProfileData, ProfileStat, ConnectedPlatformEntry, ActivityEntry, NotificationPref } from '../../domain/entities/Profile';

let currentProfile: ProfileData = {
  name:     'Alex Rivera',
  email:    'alex@obsidianlens.com',
  role:     'Digital Curator',
  timezone: 'UTC−6 (Mexico City)',
};

const STATS: ProfileStat[] = [
  { label: 'Posts Published', value: '248' },
  { label: 'Total Reach',     value: '1.2M' },
  { label: 'Avg Engagement',  value: '4.8%' },
  { label: 'Platforms',       value: '3' },
];

const CONNECTED_PLATFORMS: ConnectedPlatformEntry[] = [
  { platformId: 'instagram', name: 'Instagram', handle: '@alex_creative_lens', status: 'connected',    color: '#E1306C', icon: 'photo_camera' },
  { platformId: 'linkedin',  name: 'LinkedIn',  handle: 'Alex Rivera',         status: 'needs-reauth', color: '#0077B5', icon: 'work'         },
  { platformId: 'facebook',  name: 'Facebook',  handle: 'Obsidian Official',   status: 'disconnected', color: '#1877F2', icon: 'group'        },
];

const ACTIVITY: ActivityEntry[] = [
  { action: 'Published post',     detail: '"The Future of Digital Curation"', time: '2 hours ago', icon: 'publish',       color: '#c5d247' },
  { action: 'Scheduled 3 posts',  detail: 'Instagram · LinkedIn · Facebook',  time: '5 hours ago', icon: 'schedule',      color: '#d394ff' },
  { action: 'Connected platform', detail: 'Instagram reconnected',            time: 'Yesterday',   icon: 'link',          color: '#d394ff' },
  { action: 'Export report',      detail: 'Post #88291 analytics PDF',        time: '2 days ago',  icon: 'download',      color: '#988d9c' },
  { action: 'Post failed',        detail: '"Tech Nostalgia: Why We Crave…"',  time: '3 days ago',  icon: 'error_outline', color: '#ffb4ab' },
];

const NOTIFICATION_PREFS: NotificationPref[] = [
  { label: 'Post published',          desc: 'When a scheduled post goes live', on: true  },
  { label: 'Post failed',             desc: 'When a post fails to publish',    on: true  },
  { label: 'Weekly analytics digest', desc: 'Summary every Monday at 8 AM',   on: true  },
  { label: 'Platform disconnected',   desc: 'When a platform needs re-auth',   on: false },
  { label: 'Engagement milestones',   desc: 'When a post crosses 10k reach',   on: false },
];

export class MockProfileRepository implements IProfileRepository {
  getProfile():      ProfileData           { return { ...currentProfile }; }
  saveProfile(d: ProfileData): void        { currentProfile = { ...d }; }
  getStats():        ProfileStat[]         { return STATS; }
  getConnectedPlatforms(): ConnectedPlatformEntry[] { return CONNECTED_PLATFORMS; }
  getActivity():     ActivityEntry[]       { return ACTIVITY; }
  getNotificationPrefs(): NotificationPref[] { return [...NOTIFICATION_PREFS]; }
}
