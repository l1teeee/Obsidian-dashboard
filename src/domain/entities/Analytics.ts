export interface AnalyticsKpi {
  label:      string;
  value:      string;
  badge:      string | null;
  badgeColor: 'purple' | 'green' | null;
  sub:        string;
}

export interface PlatformBreakdown {
  platformId:  string;
  name:        string;
  handle:      string;
  growthLabel: string;
  reach:       string;
  barPct:      number;
}

export interface TopPost {
  id:         string;
  title:      string;
  platform:   string;
  reach:      string;
  likes:      string;
  comments:   string;
  engagement: string;
  imageUrl:   string;
}

export interface AnalyticsData {
  kpis:              AnalyticsKpi[];
  platformBreakdown: PlatformBreakdown[];
  topPosts:          TopPost[];
  barHeights:        number[];
  barDays:           string[];
}
