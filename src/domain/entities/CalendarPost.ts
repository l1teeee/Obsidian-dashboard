import type { PlatformId } from './Platform';
import type { PostStatus } from './Post';

export interface CalendarPost {
  id:       string;
  date:     Date;
  time:     string;
  platform: PlatformId;
  title:    string;
  status:   PostStatus;
}
