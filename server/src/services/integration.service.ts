import type {
  Integration,
  NewIntegration,
  UpdateIntegration,
} from '@shared/types/integration.js';
import type { DbType } from '../container.js';
import { encrypt } from '../utils/crypto.js';
import { createServiceLogger } from '../utils/pino.logger.js';
import { kioskIntegrationsTable } from '../db/schema.js';
import { and, eq } from 'drizzle-orm';
import { IntegrationError } from '../errors/integration.error.js';
import { integrationMapper } from '../mappers/integration.mapper.js';

export class IntegrationService {
  private readonly db: DbType;
  private readonly logger = createServiceLogger('integrationService');

  constructor(db: DbType) {
    this.db = db;
  }

  getAll(): Integration[] {
    const rows = this.db.select().from(kioskIntegrationsTable).all();

    return integrationMapper.fromEntities(rows);
  }

  getByKiosk(kioskId: number): Integration {
    const row = this.db
      .select()
      .from(kioskIntegrationsTable)
      .where(eq(kioskIntegrationsTable.kioskId, kioskId))
      .get();

    if (!row) {
      throw new IntegrationError(404, 'Integration not found');
    }

    return integrationMapper.fromEntity(row);
  }

  create(kioskId: number, input: NewIntegration): Integration {
    this.logger.debug({ kioskId, input, fn: 'create' }, 'Creating integration');
    this.validate(input);

    if (this.exists(kioskId)) {
      throw new IntegrationError(409, 'Integration already exists');
    }

    try {
      const integration = this.db
        .insert(kioskIntegrationsTable)
        .values({
          kioskId: kioskId,
          type: input.type,
          description: input.description ?? null,
          login: input.login ?? null,
          passwordEnc: input.password && encrypt(input.password),
        })
        .returning()
        .get();

      this.logger.info(
        { kioskId, type: input.type, fn: 'create' },
        'Created integration',
      );

      return integrationMapper.fromEntity(integration);
    } catch (error) {
      this.logger.error(
        { kioskId, type: input.type, fn: 'create' },
        'Error creating integration',
        error,
      );
      throw new IntegrationError(500, 'Error creating integration');
    }
  }

  update(kioskId: number, input: UpdateIntegration): Integration {
    this.logger.debug({ kioskId, input, fn: 'update' }, 'Updating integration');

    if (!this.exists(kioskId)) {
      throw new IntegrationError(404, 'Integration not found');
    }

    const updateData: Partial<{
      description: string;
      login: string;
      passwordEnc: string;
    }> = {};

    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    if (input.login !== undefined) {
      updateData.login = input.login;
    }

    if (input.password !== undefined) {
      updateData.passwordEnc = encrypt(input.password);
    }

    if (Object.keys(updateData).length === 0) {
      return this.getByKiosk(kioskId);
    }

    try {
      const result = this.db
        .update(kioskIntegrationsTable)
        .set(updateData)
        .where(
          and(
            eq(kioskIntegrationsTable.kioskId, kioskId),
            eq(kioskIntegrationsTable.type, input.type),
          ),
        )
        .returning()
        .get();

      this.logger.info(
        { kioskId, type: input.type, fn: 'update' },
        'Updated integration',
      );

      return integrationMapper.fromEntity(result);
    } catch (error) {
      this.logger.error(
        { kioskId, type: input.type, fn: 'update' },
        'Error updating integration',
        error,
      );
      throw new IntegrationError(500, 'Error updating integration');
    }
  }

  delete(kioskId: number): boolean {
    this.logger.debug({ kioskId, fn: 'delete' }, 'Deleting integration');
    const result =
      this.db
        .delete(kioskIntegrationsTable)
        .where(eq(kioskIntegrationsTable.kioskId, kioskId))
        .run().changes > 0;

    this.logger.info({ kioskId, fn: 'delete' }, 'Deleted integration');
    return result;
  }

  exists(kioskId: number): boolean {
    const integration = this.db
      .select()
      .from(kioskIntegrationsTable)
      .where(eq(kioskIntegrationsTable.kioskId, kioskId))
      .get();

    return !!integration;
  }

  private validate(input: NewIntegration | UpdateIntegration) {
    if (input.type === 'fully_kiosk') {
      if (!input.password) {
        throw new IntegrationError(400, 'Fully Kiosk requires password');
      }
    }
  }
}
