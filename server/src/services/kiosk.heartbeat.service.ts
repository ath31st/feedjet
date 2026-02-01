import { LRUCache } from 'lru-cache';
import type { KioskHeartbeat } from '../../../shared/types/kiosk.heartbeat.js';
import { createServiceLogger } from '../utils/pino.logger.js';

export class KioskHeartbeatService {
  private readonly logger = createServiceLogger('kioskHeartbeatService');

  private readonly cacheLimit = 100;
  private readonly ttl = 24 * 60 * 60 * 1000 * 3; // 3 days

  private readonly cache = new LRUCache<string, KioskHeartbeat>({
    max: this.cacheLimit,
    ttl: this.ttl,
  });

  registerHeartbeat(slug: string, ip: string) {
    const kioskHeartbeat: KioskHeartbeat = {
      slug,
      ip,
      lastHeartbeat: new Date(),
    };

    this.logger.debug(
      { slug, ip, fn: 'registerHeartbeat' },
      'Registered kiosk heartbeat',
    );

    this.cache.set(ip, kioskHeartbeat);
  }

  getActiveKiosks(): KioskHeartbeat[] {
    return Array.from(this.cache.values());
  }

  clear() {
    this.cache.clear();
    this.logger.debug({ fn: 'clear' }, 'Cleared kiosks');
  }
}
