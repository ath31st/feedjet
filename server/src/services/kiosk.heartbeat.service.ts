import type { KioskHeartbeat } from '../types/kiosk.heartbeat.js';
import { createServiceLogger } from '../utils/pino.logger.js';

export class KioskHeartbeatService {
  private readonly kiosks = new Map<string, KioskHeartbeat>();
  private readonly logger = createServiceLogger('kioskHeartbeatService');

  registerHeartbeat(kioskId: number, slug: string, ip: string) {
    const kioskHeartbeat: KioskHeartbeat = {
      kioskId,
      slug,
      ip,
      lastHeartbeat: new Date(),
    };

    this.logger.debug(
      { kioskId, slug, ip, fn: 'registerHeartbeat' },
      'Registered kiosk heartbeat',
    );

    this.kiosks.set(ip, kioskHeartbeat);
  }

  getActiveKiosks(timeoutMs: number) {
    const now = Date.now();
    return Array.from(this.kiosks.values()).filter(
      (k) => now - k.lastHeartbeat.getTime() < timeoutMs,
    );
  }

  clear() {
    this.kiosks.clear();
    this.logger.debug({ fn: 'clear' }, 'Cleared kiosks');
  }
}
