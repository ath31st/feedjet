import type {
  FullyKioskConfig,
  Integration,
  IntegrationConfig,
  NewIntegration,
  UpdateIntegration,
} from '@shared/types/integration.js';
import type { DbType } from '../container.js';
import { encrypt } from '../utils/crypto.js';
import { createServiceLogger } from '../utils/pino.logger.js';
import { devicesTable, integrationsTable, kiosksTable } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { IntegrationError } from '../errors/integration.error.js';
import { PhilipsPairError } from '../errors/philips.pair.error.js';
import type { PhilipsJointSpaceClient } from '../integration/philips.jointspace.client.js';
import { PORT } from '../config/philips.jointspace.client.config.js';
import { LRUCache } from 'lru-cache';

export class IntegrationService {
  private readonly db: DbType;
  private readonly philipsClient: PhilipsJointSpaceClient;
  private readonly integrationIpsCache = new LRUCache<string, Set<string>>({
    max: 1,
    ttl: 60_000,
  });
  private readonly logger = createServiceLogger('integrationService');

  constructor(db: DbType, philipsClient: PhilipsJointSpaceClient) {
    this.db = db;
    this.philipsClient = philipsClient;
  }

  getAll(): Integration[] {
    return this.db.select().from(integrationsTable).all();
  }

  getById(integrationId: number): Integration {
    const integration = this.findById(integrationId);

    if (!integration) {
      throw new IntegrationError(404, 'Integration not found');
    }

    return integration;
  }

  getByIp(ip: string): Integration {
    const integration = this.db
      .select()
      .from(integrationsTable)
      .where(eq(integrationsTable.ip, ip))
      .get();

    if (!integration) {
      throw new IntegrationError(404, 'Integration not found');
    }

    return integration;
  }

  getIpsByKioskId(kioskId: number): string[] {
    const rows = this.db
      .select({ ip: integrationsTable.ip })
      .from(integrationsTable)
      .innerJoin(devicesTable, eq(integrationsTable.ip, devicesTable.ip))
      .innerJoin(kiosksTable, eq(devicesTable.slug, kiosksTable.slug))
      .where(eq(kiosksTable.id, kioskId))
      .all();

    return [...new Set(rows.map((row) => row.ip))];
  }

  getIntegrationIps(): Set<string> {
    const cached = this.integrationIpsCache.get('ips');
    if (cached) {
      return cached;
    }

    const ips = new Set(
      this.db
        .select({ ip: integrationsTable.ip })
        .from(integrationsTable)
        .all()
        .map((row) => row.ip),
    );

    this.integrationIpsCache.set('ips', ips);

    return ips;
  }

  create(data: NewIntegration): Integration {
    this.logger.debug({ input: data, fn: 'create' }, 'Creating integration');

    this.validate(data);

    try {
      const config =
        data.type === 'fully_kiosk'
          ? {
              ...data.config,
              password: encrypt((data.config as FullyKioskConfig).password),
            }
          : data.config;

      const integration = this.db
        .insert(integrationsTable)
        .values({
          type: data.type,
          ip: data.ip,
          port: data.port,
          description: data.description ?? null,
          config,
        })
        .returning()
        .get();

      this.logger.info(
        { id: integration.id, fn: 'create' },
        'Created integration',
      );

      this.integrationIpsCache.clear();

      return integration;
    } catch (error) {
      this.logger.error(
        { data, fn: 'create', error },
        'Error creating integration',
      );

      throw new IntegrationError(500, 'Error creating integration');
    }
  }

  update(data: UpdateIntegration): Integration {
    this.logger.debug({ data, fn: 'update' }, 'Updating integration');

    const existing = this.getById(data.id);

    const updateData: Partial<{
      description: string;
      ip: string;
      port: number;
      config: IntegrationConfig;
    }> = {};

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.ip !== undefined || data.port !== undefined) {
      const ip = data.ip ?? existing.ip;
      const port = data.port ?? existing.port;

      const conflict = this.db
        .select()
        .from(integrationsTable)
        .where(
          and(eq(integrationsTable.ip, ip), eq(integrationsTable.port, port)),
        )
        .get();

      if (conflict && conflict.id !== existing.id) {
        throw new IntegrationError(409, 'Ip and port already in use');
      }

      updateData.ip = ip;
      updateData.port = port;
    }

    if (data.config !== undefined) {
      switch (existing.type) {
        case 'fully_kiosk': {
          const cfg = data.config as Partial<FullyKioskConfig>;

          const merged = {
            ...existing.config,
            ...cfg,
          } as FullyKioskConfig;

          updateData.config = {
            ...merged,
            ...(merged.password && {
              password: encrypt(merged.password),
            }),
          };

          break;
        }

        case 'adb': {
          updateData.config = existing.config;
          break;
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return existing;
    }

    const result = this.db
      .update(integrationsTable)
      .set(updateData)
      .where(eq(integrationsTable.id, data.id))
      .returning()
      .get();

    this.logger.info({ data, fn: 'update' }, 'Updated integration');

    this.integrationIpsCache.clear();

    return result;
  }

  delete(integrationId: number): boolean {
    this.logger.debug({ integrationId, fn: 'delete' }, 'Deleting integration');

    const result =
      this.db
        .delete(integrationsTable)
        .where(eq(integrationsTable.id, integrationId))
        .run().changes > 0;

    this.logger.info({ integrationId, fn: 'delete' }, 'Deleted integration');

    this.integrationIpsCache.clear();

    return result;
  }

  exists(integrationId: number): boolean {
    const integration = this.db
      .select()
      .from(integrationsTable)
      .where(eq(integrationsTable.id, integrationId))
      .get();

    return !!integration;
  }

  existsByKioskId(kioskId: number): boolean {
    const integrations = this.db
      .select()
      .from(integrationsTable)
      .innerJoin(devicesTable, eq(integrationsTable.ip, devicesTable.ip))
      .innerJoin(kiosksTable, eq(devicesTable.slug, kiosksTable.slug))
      .where(eq(kiosksTable.id, kioskId))
      .all();

    return integrations.length > 0;
  }

  existsByIp(ip: string): boolean {
    const integration = this.db
      .select()
      .from(integrationsTable)
      .where(eq(integrationsTable.ip, ip))
      .get();

    return !!integration;
  }

  async pairPhilipsStart(ip: string): Promise<void> {
    this.logger.debug(
      { ip, fn: 'pairPhilipsStart' },
      'Starting Philips pairing',
    );

    const existing = this.findByIpAndPhilipsType(ip);
    if (existing) {
      throw new IntegrationError(
        409,
        'Philips integration already exists for this IP',
      );
    }

    try {
      await this.philipsClient.startPairing(ip);
    } catch (error) {
      this.logger.warn(
        { ip, fn: 'pairPhilipsStart' },
        'Failed to start Philips pairing',
      );
      if (error instanceof PhilipsPairError) {
        throw new IntegrationError(400, error.message);
      }
      throw new IntegrationError(
        404,
        `TV not found at ${ip}:1926. Check the network connection to TV and try again.`,
      );
    }
  }

  async pairPhilipsComplete(
    ip: string,
    pin: string,
    description?: string,
  ): Promise<Integration> {
    this.logger.debug(
      { fn: 'pairPhilipsComplete' },
      'Completing Philips pairing',
    );

    let creds: { deviceId: string; authKey: string };

    try {
      creds = await this.philipsClient.completePairing(ip, pin);
    } catch (error) {
      if (error instanceof PhilipsPairError) {
        throw new IntegrationError(400, error.message);
      }

      this.logger.error(
        { fn: 'pairPhilipsComplete' },
        'Unexpected error completing Philips pairing',
        error,
      );

      throw new IntegrationError(500, 'Error completing Philips pairing');
    }

    const existing = this.findByIpAndPhilipsType(ip);

    const config = {
      deviceId: creds.deviceId,
      authKey: encrypt(creds.authKey),
    };

    try {
      const integration = existing
        ? this.db
            .update(integrationsTable)
            .set({
              type: 'philips_jointspace',
              config,
              ...(description !== undefined ? { description } : {}),
            })
            .where(eq(integrationsTable.ip, ip))
            .returning()
            .get()
        : this.db
            .insert(integrationsTable)
            .values({
              type: 'philips_jointspace',
              ip: ip,
              port: PORT,
              config,
              description: description ?? null,
            })
            .returning()
            .get();

      this.logger.info({ fn: 'pairPhilipsComplete' }, 'Philips pairing stored');

      this.integrationIpsCache.clear();

      return integration;
    } catch (error) {
      this.logger.error(
        { fn: 'pairPhilipsComplete' },
        'Failed to persist Philips pairing',
        error,
      );

      throw new IntegrationError(500, 'Error persisting Philips pairing');
    }
  }

  private findById(integrationId: number): Integration | null {
    const row = this.db
      .select()
      .from(integrationsTable)
      .where(eq(integrationsTable.id, integrationId))
      .get();

    return row ?? null;
  }

  private findByIpAndPhilipsType(ip: string): Integration | null {
    const row = this.db
      .select()
      .from(integrationsTable)
      .where(
        and(
          eq(integrationsTable.type, 'philips_jointspace'),
          eq(integrationsTable.ip, ip),
        ),
      )
      .get();

    return row ?? null;
  }

  private validate(data: NewIntegration) {
    if (data.type === 'philips_jointspace') {
      throw new IntegrationError(
        400,
        'Philips JointSpace integration must be created via pairing',
      );
    }

    if (data.type === 'fully_kiosk') {
      const config = data.config as Partial<FullyKioskConfig> | undefined;

      if (!config) {
        throw new IntegrationError(400, 'Config is required');
      }

      if (!config.password) {
        throw new IntegrationError(400, 'Fully Kiosk requires password');
      }

      if (!config.login) {
        throw new IntegrationError(400, 'Fully Kiosk requires login');
      }
    }
  }
}
