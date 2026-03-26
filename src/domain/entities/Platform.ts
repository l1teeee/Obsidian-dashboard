export type PlatformId = 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok' | 'youtube' | 'pinterest';
export type PlatformStatus = 'connected' | 'needs-reauth' | 'disconnected';

export interface Platform {
  id:    PlatformId;
  name:  string;
  abbr:  string;
  color: string;
  icon:  string;
}

export interface ConnectedPlatform extends Platform {
  status:         PlatformStatus;
  handle:         string;
  syncInfo:       string;
  permissions:    string[];
  gradientClass?: string;
}

export const PLATFORM_REGISTRY: Record<PlatformId, Platform> = {
  instagram: { id: 'instagram', name: 'Instagram', abbr: 'IG', color: '#E1306C', icon: 'instagram' },
  facebook:  { id: 'facebook',  name: 'Facebook',  abbr: 'FB', color: '#1877F2', icon: 'facebook'  },
  linkedin:  { id: 'linkedin',  name: 'LinkedIn',  abbr: 'LI', color: '#0A66C2', icon: 'linkedin'  },
  twitter:   { id: 'twitter',   name: 'X (Twitter)',abbr: 'X',  color: '#000000', icon: 'twitter'   },
  tiktok:    { id: 'tiktok',    name: 'TikTok',    abbr: 'TT', color: '#010101', icon: 'tiktok'    },
  youtube:   { id: 'youtube',   name: 'YouTube',   abbr: 'YT', color: '#FF0000', icon: 'youtube'   },
  pinterest: { id: 'pinterest', name: 'Pinterest',  abbr: 'PI', color: '#E60023', icon: 'pinterest' },
};
