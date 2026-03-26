export type ChannelId = 'ig' | 'li' | 'fb';

export interface Channel {
  id:    ChannelId;
  label: string;
  color: string;
}

export const CHAR_LIMITS: Record<ChannelId, number> = {
  ig: 2200,
  li: 3000,
  fb: 63206,
};

/** Ideal caption length ranges (chars). Outside = warn/error. */
export const CHAR_IDEAL: Record<ChannelId, { min: number; softMax: number; hardMax: number }> = {
  ig: { min: 15,  softMax: 150,  hardMax: 300  },
  li: { min: 50,  softMax: 700,  hardMax: 1500 },
  fb: { min: 20,  softMax: 500,  hardMax: 1500 },
};

export const CHANNELS: Channel[] = [
  { id: 'ig', label: 'Instagram', color: '#E4405F' },
  { id: 'li', label: 'LinkedIn',  color: '#0077B5' },
  { id: 'fb', label: 'Facebook',  color: '#1877F2' },
];

export const AI_SUGGESTIONS: string[] = [
  'Exploring the intersection of cinematic visuals and digital strategy. The future is editorial. ✨',
  'Behind every great brand is a story worth telling. This is ours. #ObsidianLens',
  "Great content isn't created — it's curated. Discover what's next on the horizon. 🔮",
];
