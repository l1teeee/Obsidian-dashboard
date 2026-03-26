import type { ConnectedPlatform } from '../entities/Platform';

export interface IPlatformRepository {
  getConnectedPlatforms(): ConnectedPlatform[];
}
