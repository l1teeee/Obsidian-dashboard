export type PlatformId = 'instagram' | 'linkedin' | 'facebook';
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
  instagram: { id: 'instagram', name: 'Instagram', abbr: 'IG', color: '#E1306C', icon: 'photo_camera' },
  linkedin:  { id: 'linkedin',  name: 'LinkedIn',  abbr: 'LI', color: '#0077B5', icon: 'work'         },
  facebook:  { id: 'facebook',  name: 'Facebook',  abbr: 'FB', color: '#1877F2', icon: 'group'        },
};
