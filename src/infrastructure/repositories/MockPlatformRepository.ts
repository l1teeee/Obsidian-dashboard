import type { IPlatformRepository } from '../../domain/ports/IPlatformRepository';
import type { ConnectedPlatform } from '../../domain/entities/Platform';

const PLATFORMS: ConnectedPlatform[] = [
  {
    id:           'instagram',
    name:         'Instagram',
    abbr:         'IG',
    color:        '#E1306C',
    icon:         'photo_camera',
    status:       'connected',
    handle:       '@alex_creative_lens',
    syncInfo:     'Last Sync: 12m ago',
    permissions:  ['Media Insights', 'Direct Messages', 'Story Analytics'],
    gradientClass: 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]',
  },
  {
    id:          'linkedin',
    name:        'LinkedIn',
    abbr:        'LI',
    color:       '#0077B5',
    icon:        'work',
    status:      'needs-reauth',
    handle:      'Alex Rivera',
    syncInfo:    'Disconnected: 48h ago',
    permissions: ['Profile Feed', 'Network Stats'],
  },
  {
    id:          'facebook',
    name:        'Facebook',
    abbr:        'FB',
    color:       '#1877F2',
    icon:        'groups',
    status:      'connected',
    handle:      'Obsidian Studios Page',
    syncInfo:    'Last Sync: 4m ago',
    permissions: ['Ads Manager', 'Public Content', 'Engagement'],
  },
];

export class MockPlatformRepository implements IPlatformRepository {
  getConnectedPlatforms(): ConnectedPlatform[] { return PLATFORMS; }
}
