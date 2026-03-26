import type { IPlatformRepository } from '../../domain/ports/IPlatformRepository';
import type { ConnectedPlatform } from '../../domain/entities/Platform';

const PLATFORMS: ConnectedPlatform[] = [
  {
    id:            'instagram',
    name:          'Instagram',
    abbr:          'IG',
    color:         '#E1306C',
    icon:          'instagram',
    status:        'connected',
    handle:        '@alex_creative_lens',
    syncInfo:      'Last Sync: 12m ago',
    permissions:   ['Media Insights', 'Direct Messages', 'Story Analytics'],
    gradientClass: 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]',
  },
  {
    id:          'facebook',
    name:        'Facebook',
    abbr:        'FB',
    color:       '#1877F2',
    icon:        'facebook',
    status:      'connected',
    handle:      'Obsidian Studios Page',
    syncInfo:    'Last Sync: 4m ago',
    permissions: ['Ads Manager', 'Public Content', 'Engagement'],
  },
  {
    id:          'linkedin',
    name:        'LinkedIn',
    abbr:        'LI',
    color:       '#0A66C2',
    icon:        'linkedin',
    status:      'needs-reauth',
    handle:      'Alex Rivera',
    syncInfo:    'Disconnected: 48h ago',
    permissions: ['Profile Feed', 'Network Stats', 'Job Insights'],
  },
];

export class MockPlatformRepository implements IPlatformRepository {
  getConnectedPlatforms(): ConnectedPlatform[] { return PLATFORMS; }
}
