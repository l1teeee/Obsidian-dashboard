import type { IPostRepository } from '../../domain/ports/IPostRepository';
import type { PostSummary, PostRecord, UpcomingPost } from '../../domain/entities/Post';

const UPCOMING_POSTS: UpcomingPost[] = [
  { id: 'u1', date: 'Oct 24 · 09:00 AM', platform: 'instagram', caption: '"The intersection of brutalist architecture and digital minimalism. Explorations in form..."', mediaUrls: ['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80'] },
  { id: 'u2', date: 'Oct 25 · 02:30 PM', platform: 'linkedin',  caption: '"Insights on the future of AI-driven creative workflows. How we adapt to the new lens..."', mediaUrls: ['https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80'] },
  { id: 'u3', date: 'Oct 26 · 11:15 AM', platform: 'facebook',  caption: '"Community spotlight: Highlighting the best lens work from our global collective..."',    mediaUrls: ['https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&q=80'] },
  { id: 'u4', date: 'Oct 27 · 08:00 AM', platform: 'instagram', caption: '"Behind the lens: A morning in the life of a digital curator. Quiet light, big ideas."',   mediaUrls: ['https://images.unsplash.com/photo-1495231916356-a86217efff12?w=400&q=80'] },
  { id: 'u5', date: 'Oct 28 · 03:00 PM', platform: 'linkedin',  caption: '"The case for editorial thinking in brand strategy. Why curation is the new creation."',  mediaUrls: ['https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80'] },
  { id: 'u6', date: 'Oct 29 · 12:00 PM', platform: 'facebook',  caption: '"Vielinks community picks: The top 10 creative accounts redefining visual culture."', mediaUrls: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80'] },
];

const RECENT_POSTS: PostSummary[] = [
  { id: '88291', platform: 'instagram', status: 'published', title: 'Modernism in Tokyo: A Photo Essay',        date: 'Oct 22, 10:00 AM', imageUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=200&q=80', likes: '12.4k', comments: '432',  shares: '1.1k' },
  { id: '10423', platform: 'linkedin',  status: 'scheduled', title: 'Mastering the Art of Content Selection',   date: 'Oct 23, 09:00 AM', imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&q=80', likes: '—',     comments: '—',    shares: '—'    },
  { id: '88200', platform: 'instagram', status: 'failed',    title: 'Tech Nostalgia: Why We Crave the Analog',  date: 'Failed: Oct 21, 06:12 PM', imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c228b4de41?w=200&q=80', likes: '0', comments: '0', shares: '0' },
];

const SHARED_COMMENTS = [
  { name: 'Julian Vance', time: '2 hours ago', likes: 12, text: 'The lighting on this is incredible. It feels so premium and the color palette is perfectly on-brand. Keep this aesthetic coming!', filled: true  },
  { name: 'Elena Thorne', time: '4 hours ago', likes: 4,  text: "I'm curious about the specific techniques used for the obsidian textures here. Are you using Cinema4D or strictly digital painting?",                filled: false },
  { name: 'Marcus King',  time: 'Yesterday',   likes: 32, text: 'This post single-handedly convinced me to subscribe to Vielinks. The attention to visual detail is unparalleled in the social analytics space.', filled: true  },
];

const POST_RECORDS: Record<string, PostRecord> = {
  '88291': {
    id: '88291',
    imageUrl:  'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&q=80',
    platform:  'instagram',
    date:      'Oct 24, 2023 • 10:42 AM',
    caption:   'Exploring the intersection of digital obsidian and organic violet flows. This series aims to capture the essence of "The Digital Curator." #ObsidianLens #CinematicUI #DesignSystems',
    tags:      ['#EtherealViolets', '#Minimalism', '#HighGloss', '+4 more tags'],
    metrics: [
      { label: 'Total Likes',  value: '24,812',  delta: '+12.4%', positive: true  },
      { label: 'Comments',     value: '1,284',   delta: '+5.2%',  positive: true  },
      { label: 'Shares',       value: '842',     delta: '-1.4%',  positive: false },
      { label: 'Reach',        value: '142,000', delta: '+18.9%', positive: true  },
      { label: 'Impressions',  value: '288,412', delta: '+22.1%', positive: true  },
      { label: 'Save Rate',    value: '4.2%',    delta: null,     positive: true  },
    ],
    benchmarks: [
      { label: 'Engagement Depth',    delta: '+34% vs Avg', pct: 75, variant: 'purple' },
      { label: 'Visibility Reach',    delta: '+12% vs Avg', pct: 67, variant: 'green'  },
      { label: 'Conversion Velocity', delta: '-5% vs Avg',  pct: 50, variant: 'red'    },
    ],
    comments: SHARED_COMMENTS,
  },
  '92837': {
    id: '92837',
    imageUrl:  'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=600&q=80',
    platform:  'instagram',
    date:      'Oct 22, 2023 • 09:00 AM',
    caption:   'The future of digital curation is already here. AI-driven workflows are reshaping how we discover, filter, and amplify content at scale. #DigitalCuration #FutureOfWork #ObsidianLens',
    tags:      ['#AI', '#ContentStrategy', '#Digital', '+2 more tags'],
    metrics: [
      { label: 'Total Likes',  value: '42,500',  delta: '+28.1%', positive: true },
      { label: 'Comments',     value: '3,200',   delta: '+14.7%', positive: true },
      { label: 'Shares',       value: '1,840',   delta: '+9.2%',  positive: true },
      { label: 'Reach',        value: '310,000', delta: '+31.4%', positive: true },
      { label: 'Impressions',  value: '524,900', delta: '+38.6%', positive: true },
      { label: 'Save Rate',    value: '6.8%',    delta: null,     positive: true },
    ],
    benchmarks: [
      { label: 'Engagement Depth',    delta: '+58% vs Avg', pct: 92, variant: 'purple' },
      { label: 'Visibility Reach',    delta: '+31% vs Avg', pct: 84, variant: 'green'  },
      { label: 'Conversion Velocity', delta: '+9% vs Avg',  pct: 63, variant: 'green'  },
    ],
    comments: SHARED_COMMENTS,
  },
  '10423': {
    id: '10423',
    imageUrl:  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    platform:  'linkedin',
    date:      'Oct 23, 2023 • 02:30 PM',
    caption:   "Workspace optimization isn't just about aesthetics — it's about designing environments that compound your focus. Here's what I've learned after 3 years of deep work. #Productivity #WorkspaceDesign #CreativePros",
    tags:      ['#Productivity', '#DeepWork', '#WorkDesign', '+1 more tag'],
    metrics: [
      { label: 'Total Likes',  value: '18,100',  delta: '+7.3%',  positive: true  },
      { label: 'Comments',     value: '2,040',   delta: '+11.2%', positive: true  },
      { label: 'Shares',       value: '640',     delta: '-2.1%',  positive: false },
      { label: 'Reach',        value: '98,000',  delta: '+14.2%', positive: true  },
      { label: 'Impressions',  value: '176,300', delta: '+19.5%', positive: true  },
      { label: 'Save Rate',    value: '3.1%',    delta: null,     positive: true  },
    ],
    benchmarks: [
      { label: 'Engagement Depth',    delta: '+21% vs Avg', pct: 58, variant: 'purple' },
      { label: 'Visibility Reach',    delta: '+8% vs Avg',  pct: 52, variant: 'green'  },
      { label: 'Conversion Velocity', delta: '-2% vs Avg',  pct: 44, variant: 'red'    },
    ],
    comments: SHARED_COMMENTS,
  },
};

export class MockPostRepository implements IPostRepository {
  getRecentPosts(): PostSummary[]  { return RECENT_POSTS; }
  getUpcoming():    UpcomingPost[] { return UPCOMING_POSTS; }
  getById(id: string): PostRecord | null {
    return POST_RECORDS[id] ?? POST_RECORDS['88291'] ?? null;
  }
}
