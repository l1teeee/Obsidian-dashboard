import type { AnalyticsData } from '../entities/Analytics';
import type { CalendarPost } from '../entities/CalendarPost';

export interface IAnalyticsRepository {
  getAnalyticsData(): AnalyticsData;
  getCalendarPosts(): CalendarPost[];
}
