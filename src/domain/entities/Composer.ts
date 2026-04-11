import type { ChannelId, Channel } from '../../types/composer.types';

export type { ChannelId, Channel };

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

/** ChannelId → platform string stored in the DB */
export const PLATFORM_MAP: Record<ChannelId, string> = {
  ig: 'instagram',
  li: 'linkedin',
  fb: 'facebook',
};

/** Platform string stored in DB → ChannelId (legacy 'meta' defaults to Instagram) */
export const CHANNEL_FROM_PLATFORM: Record<string, ChannelId> = {
  meta:      'ig',
  instagram: 'ig',
  linkedin:  'li',
  facebook:  'fb',
};
