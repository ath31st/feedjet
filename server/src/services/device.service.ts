import { eq, desc, sql } from 'drizzle-orm';
import type { DbType } from '../container.js';
import { devicesTable } from '../db/schema.js';
import type {
  Device,
  DeviceUpsertPayload,
  DeviceFull,
} from '@shared/types/device.js';
import { createServiceLogger } from '../utils/pino.logger.js';
import { DeviceError } from '../errors/device.error.js';
import { LRUCache } from 'lru-cache';

export class DeviceService {
  private readonly db: DbType;
  private readonly devicesCache = new LRUCache<string, Device[]>({
    max: 1,
    ttl: 15000,
  });
  private readonly logger = createServiceLogger('deviceService');

  constructor(db: DbType) {
    this.db = db;
  }

  upsert(ip: string, payload: DeviceUpsertPayload): Device {
    const now = new Date();

    this.logger.debug(
      { deviceId: payload.deviceId, ip, fn: 'upsert' },
      'Upserting device',
    );

    try {
      const existing = this.db
        .select()
        .from(devicesTable)
        .where(eq(devicesTable.deviceId, payload.deviceId))
        .get();

      if (existing) {
        const updated = this.db
          .update(devicesTable)
          .set({
            ip,
            slug: payload.slug,
            userAgent: payload.userAgent,
            platform: payload.platform,
            lastSeenAt: now,
          })
          .where(eq(devicesTable.deviceId, payload.deviceId))
          .returning()
          .get();

        return updated;
      }

      const created = this.db
        .insert(devicesTable)
        .values({
          deviceId: payload.deviceId,
          ip,
          slug: payload.slug,
          userAgent: payload.userAgent,
          platform: payload.platform,
          firstSeenAt: now,
          lastSeenAt: now,
        })
        .returning()
        .get();

      return created;
    } catch (err) {
      this.logger.error(
        { err, payload, ip, fn: 'upsert' },
        'Failed to upsert device',
      );
      throw new DeviceError(500, 'Failed to upsert device');
    }
  }

  getById(deviceId: string): Device {
    try {
      const device = this.db
        .select()
        .from(devicesTable)
        .where(eq(devicesTable.deviceId, deviceId))
        .get();

      if (!device) {
        throw new DeviceError(404, 'Device not found');
      }

      return device;
    } catch (err) {
      this.logger.error(
        { err, deviceId, fn: 'getById' },
        'Failed to get device',
      );
      throw err;
    }
  }

  getAll(): Device[] {
    try {
      const cached = this.devicesCache.get('all');
      if (cached) {
        return cached;
      }

      const devices = this.db
        .select()
        .from(devicesTable)
        .orderBy(desc(devicesTable.lastSeenAt))
        .all();

      this.devicesCache.set('all', devices);

      return devices;
    } catch (err) {
      this.logger.error({ err, fn: 'getAll' }, 'Failed to get devices');
      throw new DeviceError(500, 'Failed to get devices');
    }
  }

  getAllFull(integrationIps: Set<string>): DeviceFull[] {
    try {
      const devices = this.getAll();

      return devices.map((device) => ({
        ...device,
        hasIntegration: integrationIps.has(device.ip),
      }));
    } catch (err) {
      this.logger.error(
        { err, fn: 'getAllWithIntegration' },
        'Failed to get devices',
      );
      throw new DeviceError(500, 'Failed to get devices');
    }
  }

  delete(deviceId: string): void {
    try {
      this.db
        .delete(devicesTable)
        .where(eq(devicesTable.deviceId, deviceId))
        .run();

      this.devicesCache.clear();

      this.logger.info({ deviceId, fn: 'delete' }, 'Device deleted');
    } catch (err) {
      this.logger.error(
        { err, deviceId, fn: 'delete' },
        'Failed to delete device',
      );
      throw new DeviceError(500, 'Failed to delete device');
    }
  }

  deleteOldDevices(daysThreshold: number): number {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

      const cutoffTimestampInSeconds = Math.floor(cutoffDate.getTime() / 1000);

      const oldDevices = this.db
        .select()
        .from(devicesTable)
        .where(sql`${devicesTable.lastSeenAt} < ${cutoffTimestampInSeconds}`)
        .all();

      if (oldDevices.length === 0) {
        this.logger.info(
          { daysThreshold, fn: 'deleteOldDevices' },
          'No old devices to delete',
        );
        return 0;
      }

      this.db
        .delete(devicesTable)
        .where(sql`${devicesTable.lastSeenAt} < ${cutoffTimestampInSeconds}`)
        .run();

      this.devicesCache.clear();

      this.logger.info(
        {
          deletedCount: oldDevices.length,
          daysThreshold,
          fn: 'deleteOldDevices',
        },
        `Deleted ${oldDevices.length} devices older than ${daysThreshold} days`,
      );

      return oldDevices.length;
    } catch (err) {
      this.logger.error(
        { err, daysThreshold, fn: 'deleteOldDevices' },
        'Failed to delete old devices',
      );
      throw new DeviceError(500, 'Failed to delete old devices');
    }
  }

  touch(deviceId: string): void {
    try {
      this.db
        .update(devicesTable)
        .set({ lastSeenAt: new Date() })
        .where(eq(devicesTable.deviceId, deviceId))
        .run();
    } catch (err) {
      this.logger.error(
        { err, deviceId, fn: 'touch' },
        'Failed to update lastSeenAt',
      );
      throw new DeviceError(500, 'Failed to update device heartbeat');
    }
  }
}
