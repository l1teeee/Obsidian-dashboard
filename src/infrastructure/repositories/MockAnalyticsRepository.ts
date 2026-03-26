import { addDays } from 'date-fns';
import type { IAnalyticsRepository } from '../../domain/ports/IAnalyticsRepository';
import type { AnalyticsData } from '../../domain/entities/Analytics';
import type { CalendarPost } from '../../domain/entities/CalendarPost';

const KPIS = [
  { label: 'Follower Growth',   value: '42,891', badge: '+12.4%', badgeColor: 'purple' as const, sub: '+4.2k this month'       },
  { label: 'Avg. Engagement',   value: '4.82%',  badge: '+0.8%',  badgeColor: 'green'  as const, sub: 'v. 3.9% industry avg'   },
  { label: 'Best Posting Time', value: '19:30',  badge: null,     badgeColor: null,               sub: 'GMT +2 (Thursday)'      },
];

const PLATFORM_BREAKDOWN = [
  { platformId: 'instagram', name: 'Instagram', handle: '@obsidian.lens',        growthLabel: '+842',   reach: '1.2M', barPct: 75 },
  { platformId: 'linkedin',  name: 'LinkedIn',  handle: 'Obsidian Lens Curator', growthLabel: '+1,204', reach: '842K', barPct: 92 },
  { platformId: 'facebook',  name: 'Facebook',  handle: 'Obsidian Official',     growthLabel: '+156',   reach: '310K', barPct: 25 },
];

const TOP_POSTS = [
  { id: '92837', title: 'The Future of Digital Curation',          platform: 'camera', reach: '42.5K', likes: '3.2K', comments: '412', engagement: '8.4%', imageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=100&q=80' },
  { id: '10423', title: 'Workspace Optimization for Creative Pros', platform: 'work',   reach: '28.1K', likes: '1.8K', comments: '204', engagement: '7.2%', imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=100&q=80' },
  { id: '88291', title: 'Obsidian Lens v2.0 Release',               platform: 'camera', reach: '54.0K', likes: '4.1K', comments: '822', engagement: '9.1%', imageUrl: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=100&q=80' },
];

function buildCalendarPosts(): CalendarPost[] {
  const t = new Date();
  return [
    { id: '88200', date: addDays(t, -8),  time: '06:12 PM', platform: 'instagram', title: 'Tech Nostalgia: Why We Crave the Analog',           status: 'failed'    },
    { id: '92837', date: addDays(t, -5),  time: '09:00 AM', platform: 'instagram', title: 'The Future of Digital Curation',                    status: 'published' },
    { id: '10423', date: addDays(t, -3),  time: '02:30 PM', platform: 'linkedin',  title: 'Workspace Optimization for Creative Pros',           status: 'published' },
    { id: '88291', date: addDays(t, -1),  time: '10:42 AM', platform: 'instagram', title: 'The Digital Curator Series',                        status: 'published' },
    { id: '20011', date: t,               time: '11:00 AM', platform: 'facebook',  title: 'Community Spotlight: Q1 Highlights',                status: 'scheduled' },
    { id: '20012', date: addDays(t, 2),   time: '09:15 AM', platform: 'instagram', title: 'Behind the Lens: Morning Routine',                  status: 'scheduled' },
    { id: '20013', date: addDays(t, 2),   time: '03:00 PM', platform: 'linkedin',  title: 'Editorial Thinking in Brand Strategy',              status: 'scheduled' },
    { id: '20014', date: addDays(t, 5),   time: '08:00 AM', platform: 'instagram', title: 'Obsidian Lens Community Top Picks',                 status: 'scheduled' },
    { id: '20015', date: addDays(t, 7),   time: '12:00 PM', platform: 'facebook',  title: 'The Case for Editorial Thinking in Brands',         status: 'scheduled' },
    { id: '20016', date: addDays(t, 7),   time: '04:00 PM', platform: 'linkedin',  title: 'AI-Driven Creative Workflows: Insights',            status: 'scheduled' },
    { id: '20017', date: addDays(t, 10),  time: '10:00 AM', platform: 'instagram', title: 'Tokyo Architecture Series Vol. 2',                  status: 'scheduled' },
    { id: '20018', date: addDays(t, 14),  time: '09:00 AM', platform: 'linkedin',  title: 'Future of AI in the Creative Industry',             status: 'scheduled' },
    { id: '20019', date: addDays(t, 14),  time: '02:00 PM', platform: 'instagram', title: 'Modernism in Tokyo: A Photo Essay',                 status: 'scheduled' },
    { id: '20020', date: addDays(t, 18),  time: '11:00 AM', platform: 'facebook',  title: 'Digital Minimalism and the New Aesthetic',          status: 'scheduled' },
    { id: '20021', date: addDays(t, 21),  time: '03:30 PM', platform: 'linkedin',  title: 'Building a Brand With Editorial Precision',         status: 'scheduled' },
  ];
}

export class MockAnalyticsRepository implements IAnalyticsRepository {
  getAnalyticsData(): AnalyticsData {
    return {
      kpis:              KPIS,
      platformBreakdown: PLATFORM_BREAKDOWN,
      topPosts:          TOP_POSTS,
      barHeights:        [40, 65, 55, 85, 95, 45, 60],
      barDays:           ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    };
  }
  getCalendarPosts(): CalendarPost[] { return buildCalendarPosts(); }
}
